/**
 * 裁判セグメントの進行を管理するコンポーネント。
 * JSONから証言データをロードし、TestimonyFlowComponentを持つオブジェクトを生成・制御する。
 */
import EngineAPI from '../core/EngineAPI.js';
import CutInEffect from '../effects/CutInEffect.js';
import DebateStartEffect from '../effects/DebateStartEffect.js';

export default class TrialSegmentManager {
    constructor(scene, gameObject, params) {
        this.scene = scene;
        this.gameObject = gameObject;
        this.segmentData = null;
        this.currentTestimonyIndex = 0;
        this.activeTestimonies = [];
        this.isInteracting = false;
        this.isFlowing = false;

        this.interactionMenu = null;
        this.progressIndicator = null;

        // キャラクター画像のキャッシュ
        this.charaImages = { left: null, center: null, right: null };

        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.add(this);
        }

        // イベントリスナー登録
        this.scene.events.on('RESTART_DEBATE_REQUEST', () => this.restartDebate());
        this.scene.events.on('RESUME_TRIAL', () => {
            console.log('[TrialManager] RESUME_TRIAL received. Forcing input.enabled = true');
            this.isInteracting = false;
            this.scene.input.enabled = true; // ★ 強制的に復帰
            // 議論中かつポーズされていないなら、証言生成の連鎖が止まっている可能性があるため再開させる
            if (this.isFlowing && !this.scene.isPaused) {
                // すでに待機中(waitingForNext)なら何もしない
                if (this.waitingForNext) {
                    console.log('[TrialManager] RESUME_TRIAL: Already waiting for next. Skipping manual spawn.');
                    return;
                }

                // 二重起動を防ぐため、少し待ってから実行
                this.scene.time.delayedCall(300, () => {
                    if (this.isFlowing && !this.scene.isPaused && !this.isInteracting && !this.waitingForNext) {
                        this.spawnNextTestimony();
                    }
                });
            }
        });

        // 連鎖タイマーの参照保持用
        this.spawnTimer = null;

        // 証言終了イベントの待機フラグ
        this.waitingForNext = false;

        // イベントリスナー登録
        this.scene.events.on('TESTIMONY_FINISHED', () => {
            if (this.waitingForNext && this.isFlowing && !this.scene.isPaused && !this.isInteracting) {
                console.log('[TrialManager] TESTIMONY_FINISHED received. Spawning next.');
                this.waitingForNext = false;
                this.spawnNextTestimony();
            }
        });

        // タイムアップイベント
        this.scene.events.on('TRIAL_TIMEOUT', () => {
            console.warn('[TrialManager] TRIAL_TIMEOUT received!');
            this.handleTimeout();
        });

        // 早送りキー (Shift)
        this.fastForwardKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // エフェクトインスタンス
        this.cutInEffect = new CutInEffect(this.scene);
        this.debateStartEffect = new DebateStartEffect(this.scene);

        // 中間シナリオ再生中フラグ
        this.isPlayingInterim = false;
    }

    start() {
        console.log('[TrialSegmentManager] start() called.');

        // ★ 修正: 確実に全オブジェクトが生成されるのを待つため、微小な遅延を入れる
        this.scene.time.delayedCall(10, () => {
            const menuObj = this.scene.children.getByName('interaction_menu');
            if (menuObj && menuObj.components && menuObj.components.InteractionMenuComponent) {
                this.interactionMenu = menuObj.components.InteractionMenuComponent;
                this.interactionMenu.onSelection = (choice) => this.handleChoice(choice);
                console.log('[TrialSegmentManager] InteractionMenuComponent found via GameObject.');
            } else {
                console.warn('[TrialSegmentManager] InteractionMenuComponent NOT found.');
            }

            const indicatorObj = this.scene.children.getByName('progress_indicator');
            if (indicatorObj && indicatorObj.components && indicatorObj.components.ProgressIndicatorComponent) {
                this.progressIndicator = indicatorObj.components.ProgressIndicatorComponent;
            }

            // 早送りボタンの初期化
            const ffButton = this.scene.children.getByName('fast_forward_button');
            if (ffButton) {
                ffButton.setInteractive(new Phaser.Geom.Circle(0, 0, 40), Phaser.Geom.Circle.Contains);
                ffButton.isDown = false;
                ffButton.on('pointerdown', () => { ffButton.isDown = true; });
                ffButton.on('pointerup', () => { ffButton.isDown = false; });
                ffButton.on('pointerout', () => { ffButton.isDown = false; });
                console.log('[TrialManager] FastForward button initialized.');
            }

            // キャラ画像取得 (Lazy load もあるが、ここで初期検索)
            console.log('[TrialManager] Pre-caching characters...');
            this._findCharacterImages();

            const layoutData = this.scene.loadData || this.scene.cache.json.get(this.scene.layoutDataKey || this.scene.scene.key);
            console.log('[TrialManager] Layout Data:', layoutData ? 'Found' : 'Not Found');

            if (layoutData && layoutData.trial_data) {
                console.log('[TrialManager] Trial Data found. Starting loop...');
                this.segmentData = layoutData.trial_data;

                // タイマーの初期化 (あれば)
                const timerObj = this.scene.children.getByName('timer_container');
                if (timerObj && timerObj.components && timerObj.components.TrialTimerComponent) {
                    const timer = timerObj.components.TrialTimerComponent;
                    if (this.segmentData.timeLimit) {
                        timer.setTime(this.segmentData.timeLimit);
                    }
                    timer.start();
                }

                this.startDebateLoop();
            } else {
                console.warn('[TrialManager] No trial_data found in layout JSON.');
            }
        });
    }

    startDebateLoop() {
        this.isFlowing = true;
        this.currentTestimonyIndex = 0;
        // this.spawnNextTestimony(); // 開始演出後に呼び出すのでコメントアウト

        // タイマー開始を要求
        this.scene.events.emit('START_DEBATE');

        // 開始演出
        this.debateStartEffect.play('START', () => {
             // 演出後に最初の証言生成
             this.spawnNextTestimony();
        });
    }

    spawnNextTestimony() {
        if (!this.isFlowing || this.scene.isPaused || this.isInteracting) {
            console.log('[TrialSegmentManager] Spawn skipped (paused or interacting)');
            return;
        }

        // ★ 重要: すでに次の証言を待機中(イベント待ち)なら、手動での重複生成を阻止する
        if (this.waitingForNext) {
            console.warn('[TrialSegmentManager] Spawn blocked: Already waiting for TESTIMONY_FINISHED.');
            return;
        }

        // 既存のタイマーがあればキャンセル
        if (this.spawnTimer) {
            this.spawnTimer.remove();
            this.spawnTimer = null;
        }

        console.log(`[TrialSegmentManager] Spawning testimony index: ${this.currentTestimonyIndex}`);

        // インデックスが範囲を超えているかチェック (ループ判定)
        if (this.currentTestimonyIndex >= this.segmentData.testimonies.length) {
            console.log('[TrialSegmentManager] End of testimonies.');

            // ループシナリオがある場合
            if (this.segmentData.loop_scenario) {
                console.log(`[TrialSegmentManager] Playing loop scenario: ${this.segmentData.loop_scenario}`);
                this.isFlowing = false; // 一時停止

                EngineAPI.runScenarioAsOverlay(this.scene.scene.key, this.segmentData.loop_scenario, true)
                    .then(() => {
                        console.log('Loop scenario finished. Restarting loop.');
                        this.cleanupCurrentSegment(); // ★ 古い証言を破棄
                        this.isFlowing = true;
                        this.currentTestimonyIndex = 0;
                        this.scene.isPaused = false; // ★ ポーズ状態をリセット
                        // this.scene.events.emit('RESUME_TRIAL'); // ★ 削除: ここでEmitするとリスナーが反応してspawnNextTestimonyを呼んでしまい、演出と被る
                        
                        // ループ時は「LOOP」などの演出を入れる手もあるが、今回はSTARTと同じものを使うか、テキストを変える
                        this.debateStartEffect.play('LOOP', () => {
                             this.scene.time.delayedCall(100, () => this.spawnNextTestimony());
                        });
                    })
                    .catch(err => {
                        console.error('[TrialSegmentManager] Loop scenario error:', err);
                        this.cleanupCurrentSegment(); // エラー時も古い証言を破棄
                        // エラー時も再ループを試みる
                        this.isFlowing = true;
                        this.currentTestimonyIndex = 0;
                        // this.scene.events.emit('RESUME_TRIAL'); // ★ 削除
                        this.scene.time.delayedCall(100, () => this.spawnNextTestimony());
                    });
                return;
            }

            console.log('[TrialSegmentManager] Looping back to 0 immediately.');
            this.cleanupCurrentSegment(); // ★ 古い証言を破棄
            this.currentTestimonyIndex = 0;
            // ★ リセット直後は少し待ってから開始（安定性のため）
            this.scene.time.delayedCall(100, () => this.spawnNextTestimony());
            return;
        }

        const testimonyData = this.segmentData.testimonies[this.currentTestimonyIndex];
        this.createTestimonyObject(testimonyData);

        // キャラ表示切り替え
        this.updateCharacterDisplay(this.currentTestimonyIndex);

        this.currentTestimonyIndex++;

        // 次の証言のトリガー判定
        // interval が 0 または未指定の場合、証言が消えるのを待つ (順次表示モード)
        const interval = this.segmentData.interval;
        if (interval > 0) {
            console.log(`[TrialSegmentManager] Next spawn in ${interval}ms`);
            this.spawnTimer = this.scene.time.delayedCall(interval, () => {
                this.spawnNextTestimony();
            });
        } else {
            console.log('[TrialSegmentManager] Sequential mode. Waiting for TESTIMONY_FINISHED...');
            this.waitingForNext = true;
        }
    }

    // キャラ画像を一括検索する内部メソッド
    _findCharacterImages() {
        if (!this.charaImages.left) this.charaImages.left = this.scene.children.getByName('character_left');
        if (!this.charaImages.center) this.charaImages.center = this.scene.children.getByName('character_center');
        if (!this.charaImages.right) this.charaImages.right = this.scene.children.getByName('character_right');

        console.log('[TrialSegmentManager] Character status check:',
            'L:', !!this.charaImages.left,
            'C:', !!this.charaImages.center,
            'R:', !!this.charaImages.right);
    }

    // キャラ表示切り替えメソッド
    updateCharacterDisplay(index) {
        // 画像がまだ見つかっていない場合は検索を試みる (Lazy Load)
        this._findCharacterImages();

        // 全て非表示
        if (this.charaImages.left) this.charaImages.left.setVisible(false);
        if (this.charaImages.center) this.charaImages.center.setVisible(false);
        if (this.charaImages.right) this.charaImages.right.setVisible(false);

        // インデックスに応じて表示 (0:左, 1:右, 2:中 のローテーションとする)
        const pos = index % 3;
        const target = (pos === 0) ? this.charaImages.left :
            (pos === 1) ? this.charaImages.right :
                this.charaImages.center;

        if (target) {
            target.setVisible(true);
            console.log('[TrialSegmentManager] Showing character for index', index, 'at position:', pos);
            // 簡易パンアップ演出風 (Y座標を少し下げてからTween等したほうが良いが、今は即時)
        } else {
            console.warn('[TrialSegmentManager] No character image for position:', pos);
        }
    }

    createTestimonyObject(data) {
        // Y座標の重なりを避けるための計算。3行でループ。
        // デフォルトスタイルは 'scroll'
        const style = data.style || 'scroll';

        // 配置計算
        let x, y;
        if (style === 'typewriter') {
            // 中央配置: 画面幅の中央, Y軸は少し上寄りなど
            x = this.scene.cameras.main.width / 2;
            y = 300;
        } else {
            // scroll (従来通り)
            x = this.scene.cameras.main.width + 100;
            y = 200 + (this.currentTestimonyIndex % 3) * 120;
        }

        const container = this.scene.add.container(x, y).setDepth(1000); // ★ 高いDepthを設定
        const textObj = this.scene.add.text(0, 0, data.text, {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            wordWrap: { width: 800, useAdvancedWrap: true } // ★ 複数行表示対応
        });

        // typewriterの場合は中央揃えにする
        if (style === 'typewriter') {
            textObj.setOrigin(0.5, 0.5);
        }
        container.add(textObj);

        // コンテナのクリック範囲を設定（テキストのサイズに合わせる）
        container.setSize(textObj.width, textObj.height);

        // ★ Phaser 3.60のContainerでは、明示的にヒットエリアを指定し、カーソルをpointerに設定する
        container.setInteractive(new Phaser.Geom.Rectangle(0, 0, textObj.width, textObj.height), Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => { if (container.input.enabled) container.scene.input.setDefaultCursor('pointer'); })
            .on('pointerout', () => { container.scene.input.setDefaultCursor('default'); });

        // ★ IDを保存 (後で検索できるように)
        if (data.id) {
            container.setData('id', data.id);
        }

        const flowComponent = this.scene.addComponent(container, 'TestimonyFlowComponent', {
            text: data.text,
            speed: 50,
            moveSpeed: 120,
            style: style // ★ スタイルを渡す
        });

        // ★★★ 【重要修正】動的に追加したコンポーネントは手動で開始する必要がある ★★★
        if (flowComponent && typeof flowComponent.start === 'function') {
            flowComponent.start();
        }

        // ハイライト設定
        if (data.highlights && data.highlights.length > 0) {
            // ★ 修正: 色変え(setTint)は全体が変わってしまい分かりにくいため廃止。
            // 代わりに、テキスト自体を加工して【】で囲むことで強調箇所を示す。
            let modifiedText = data.text;
            data.highlights.forEach(h => {
                // 単純置換
                modifiedText = modifiedText.replace(h.text, `【${h.text}】`);
            });

            // コンポーネントのテキストを更新（タイピング開始前なので間に合う）
            // container内のTextオブジェクトも更新しておく必要がある
            textObj.setText(modifiedText);

            // FlowComponent側にも新しいテキストを伝える
            if (flowComponent) {
                flowComponent.fullText = modifiedText;
            }

            // コンテナもサイズ再計算（文字数が増えたため）
            // updateTextなどでサイズが即時反映されない場合があるため少し余裕を持たせるか、
            // 次のフレームで更新されるのを待つが、ここでは簡易的に再セット
            textObj.updateText();
            container.setSize(textObj.width, textObj.height);

            // 重要：ハイライトがある場合のみ指マークとクリックイベントを設定
            container.setInteractive({ useHandCursor: true });
            container.input.hitArea = new Phaser.Geom.Rectangle(0, 0, textObj.width, textObj.height);
            container.input.hitAreaCallback = Phaser.Geom.Rectangle.Contains;

            container.on('pointerdown', () => {
                console.log('[TrialManager] Testimony clicked:', modifiedText);
                this.onHighlightClicked(data.highlights[0]);
            });
        } else {
            // ハイライトがない場合は指マークを出さない（通常のヒットエリアのみ）
            container.setInteractive({ useHandCursor: false });
            container.input.hitArea = new Phaser.Geom.Rectangle(0, 0, textObj.width, textObj.height);
            container.input.hitAreaCallback = Phaser.Geom.Rectangle.Contains;
        }

        this.activeTestimonies.push(container);
    }

    onHighlightClicked(highlightData) {
        if (this.isInteracting || !this.isFlowing) return;

        console.log('[TrialManager] highlight clicked. data:', highlightData);
        
        // 証拠品提示が必要かチェック
        const evidenceRequired = highlightData.evidence_required;

        // メニューに渡すデータを加工 (テキストなど)
        // ここでは簡易的に InteractionMenu を使うが、証拠品提示ボタンを追加するロジックが必要
        // 現状の InteractionMenu は「反論/賛成/疑問」の選択肢を出すだけ。
        // ダンガンロンパ的「つきつける」は、本来は銃の照準を合わせるアクションだが、
        // 今回の要件では「議論の選択肢から正解の選択肢を選ぶと更に証拠品を提示するシーンが開き」となっている。
        // なので、まずは InteractionMenu を開き、そこでの選択結果として証拠品提示画面へ遷移する。

        this._showInteractionMenu(highlightData);
    }

    _showInteractionMenu(highlightData) {
        // ★ 遅延検索: クリックされた瞬間にメニューを探す（確実に存在するため）
        if (!this.interactionMenu) {
            const menuObj = this.scene.children.getByName('interaction_menu');
            if (menuObj && menuObj.components && menuObj.components.InteractionMenuComponent) {
                this.interactionMenu = menuObj.components.InteractionMenuComponent;
                this.interactionMenu.onSelection = (choice) => this.handleChoice(choice);
                console.log('[TrialSegmentManager] InteractionMenuComponent found (Lazy load).');
            }
        }

        if (this.interactionMenu) {
            this.scene.events.emit('PAUSE_TRIAL');
            this.isInteracting = true;
            this.interactionMenu.show(highlightData);
        } else {
            console.warn('[TrialManager] interactionMenu still not found.');
        }
    }

    async handleChoice(choice) {
        console.log('[TrialManager] Choice selected:', choice.text);

        // 0. 「戻る」ボタン: 何もせず議論再開
        if (choice.isBack) {
            this._resumeFromMenu();
            return;
        }

        // 0.5. 中間シナリオ (pre_update_scenario) がある場合
        if (choice.pre_update_scenario) {
            console.log(`[TrialManager] Playing interim scenario: ${choice.pre_update_scenario}`);
            this.isPlayingInterim = true;
            try {
                await EngineAPI.runScenarioAsOverlay(this.scene.scene.key, choice.pre_update_scenario, true);
            } catch (e) {
                console.warn('[TrialManager] Interim scenario failed:', e);
            }
            this.isPlayingInterim = false;
            // 続きの処理へ
        }

        // 1. テキスト更新アクション (ゆさぶる等)
        if (choice.action === 'update_testimony') {
            await this.updateTestimony(choice.target, choice.new_text, choice.new_highlights);
            return;
        }

        // 1.5 証拠品提示が必要な場合 (evidence_required が choice に設定されている場合)
        // または、choice自体が「証拠品を提示する」というアクションの場合
        if (choice.evidence_required) {
            console.log('[TrialManager] Evidence required:', choice.evidence_required);
            // 証拠品選択オーバーレイを表示
            const overlay = this.scene.evidenceSelectOverlay;
            if (overlay) {
                overlay.show('present', (selectedEvidenceId) => {
                    this._onEvidencePresented(selectedEvidenceId, choice);
                });
            } else {
                console.warn('[TrialManager] EvidenceSelectOverlay not found.');
                this._resumeFromMenu(); // 諦めて戻る
            }
            return; // ここで一旦処理を止めて、コールバック待ち
        }

        // 2. シナリオ再生の準備 (通常フロー)
        await this._processScenarioResult(choice.correct, choice.success_scenario, choice.failure_scenario, choice.next_trial_data);
    }

    // 証拠品が提示されたときのコールバック
    async _onEvidencePresented(evidenceId, choice) {
        console.log(`[TrialManager] Evidence presented: ${evidenceId}, Required: ${choice.evidence_required}`);
        
        if (evidenceId === choice.evidence_required) {
            // 正解！ -> 論破演出へ
            await this._playBreakEffect();
            await this._processScenarioResult(true, choice.success_scenario, null, choice.next_trial_data);
        } else {
            // 不正解 -> 失敗シナリオへ（あれば）
            // 証拠品間違い専用のシナリオがあればそれがベストだが、今回は共通失敗あるいは汎用失敗へ
            // choice.failure_scenario_evidence_mismatch などがあれば優先する
            await this._processScenarioResult(false, null, choice.failure_scenario, null);
        }
    }

    async _playBreakEffect() {
        return new Promise(resolve => {
            this.cutInEffect.play(resolve);
        });
    }

    async _processScenarioResult(isCorrect, successScenario, failureScenario, nextTrialData) {
        let scenarioFile = isCorrect ? successScenario : failureScenario;
        let isSuccess = isCorrect;

        // 3. シナリオがあればオーバーレイで実行
        if (scenarioFile) {
            try {
                console.log(`[TrialManager] Playing scenario: ${scenarioFile}`);
                await EngineAPI.runScenarioAsOverlay(this.scene.scene.key, scenarioFile, true);

                if (!this.isFlowing && this.currentTestimonyIndex === 0) {
                    console.log('[TrialManager] Scene was reset during scenario.');
                    return;
                }
            } catch (e) {
                console.warn('[TrialManager] Scenario execution failed or skipped:', e);
            }
        } else if (isSuccess) {
             // シナリオなし正解
             if (this.progressIndicator) {
                await new Promise(resolve => {
                    this.progressIndicator.show("論破！！", 3000); // ここもカットイン出したければ出せる
                    this.scene.events.once('PROGRESS_INDICATOR_COMPLETE', resolve);
                });
            }
        }

        // 4. シナリオ終了後の処理
        if (isSuccess) {
            if (nextTrialData) {
                this.loadNextTrialData(nextTrialData);
            } else {
                this._resumeFromMenu();
            }
        } else {
            // 失敗時は元の議論に戻る
            if (!this.isFlowing && this.currentTestimonyIndex === 0) return;
            this._resumeFromMenu();
        }
    }

    _resumeFromMenu() {
        console.log('[TrialManager] Resuming trial flow.');
        this.isInteracting = false;
        this.scene.events.emit('RESUME_TRIAL');
    }

    async updateTestimony(targetId, newText, newHighlights) {
        // 1. データ上の修正
        const testimony = this.segmentData.testimonies.find(t => t.id === targetId);
        if (testimony) {
            testimony.text = newText;
            if (newHighlights) {
                testimony.highlights = newHighlights;
            } else {
                testimony.highlights = []; // ハイライトは無効化 (クリア)
            }
        }

        // 2. 画面上の修正 (Activeなものがあれば即時反映)
        const activeObj = this.activeTestimonies.find(obj => obj.getData('id') === targetId);
        if (activeObj) {
            // Container内のTextを探す
            const textObj = activeObj.list.find(child => child.type === 'Text');
            if (textObj) {
                // ハイライトがある場合はテキスト加工が必要
                let displayText = newText;
                if (newHighlights && newHighlights.length > 0) {
                    newHighlights.forEach(h => {
                        displayText = displayText.replace(h.text, `【${h.text}】`);
                    });
                }

                textObj.setText(displayText);
                textObj.updateText();
                activeObj.setSize(textObj.width, textObj.height);

                // イベント再設定
                activeObj.off('pointerdown');
                activeObj.setInteractive(new Phaser.Geom.Rectangle(0, 0, textObj.width, textObj.height), Phaser.Geom.Rectangle.Contains)
                    .on('pointerover', () => { if (activeObj.input.enabled) activeObj.scene.input.setDefaultCursor('pointer'); })
                    .on('pointerout', () => { activeObj.scene.input.setDefaultCursor('default'); });

                if (newHighlights && newHighlights.length > 0) {
                    activeObj.on('pointerdown', () => {
                        console.log('[TrialManager] Updated testimony clicked:', displayText);
                        this.onHighlightClicked(newHighlights[0]); // 簡易的に最初のハイライトを使用
                    });
                }
            }

            // FlowComponentのfullTextも更新
            if (activeObj.components && activeObj.components.TestimonyFlowComponent) {
                let flowText = newText;
                if (newHighlights && newHighlights.length > 0) {
                    newHighlights.forEach(h => {
                        flowText = flowText.replace(h.text, `【${h.text}】`);
                    });
                }
                activeObj.components.TestimonyFlowComponent.fullText = flowText;
            }
        }

        if (this.progressIndicator) {
            this.progressIndicator.show("証言変更…", 2000);
            await new Promise(resolve => {
                this.scene.events.once('PROGRESS_INDICATOR_COMPLETE', resolve);
            });
            this.isInteracting = false;
            this.scene.events.emit('RESUME_TRIAL');
        } else {
            this.isInteracting = false;
            this.scene.events.emit('RESUME_TRIAL');
        }
    }

    loadNextTrialData(jsonPath) {
        console.log(`[TrialManager] Loading next trial data: ${jsonPath}`);

        // Loaderを使って動的にJSONをロード
        // 注: PhaserのLoaderはシーン開始時以外は使いにくいが、start()させることでいけるか、
        // あるいは fetch API で取ってくるか。EngineAPIやBaseGameSceneの仕組みを使うのが安全。
        // ここでは簡易的に BaseGameScene の loadData キャッシュは使えないため、
        // load.json -> once('complete') パターンで実装する。

        const key = `trial_data_${Date.now()}`;
        this.scene.load.json(key, `assets/data/${jsonPath}`);
        this.scene.load.once('complete', () => {
            const nextData = this.scene.cache.json.get(key);
            if (nextData && nextData.trial_data) {
                this.cleanupCurrentSegment();
                this.segmentData = nextData.trial_data;
                this.currentTestimonyIndex = 0;
                this.startDebateLoop(); // 新しいデータでループ開始
                this.isInteracting = false;
                this.scene.events.emit('RESUME_TRIAL');
            } else {
                console.error('[TrialManager] Failed to load valid trial data.');
                this.isInteracting = false;
                this.scene.events.emit('RESUME_TRIAL');
            }
        });
        this.scene.load.start();
    }

    cleanupCurrentSegment() {
        console.log('[TrialManager] Cleaning up current segment...');

        // タイマーを確実に停止
        if (this.spawnTimer) {
            this.spawnTimer.remove();
            this.spawnTimer = null;
        }

        // 現在画面に出ている証言をすべて消す
        this.activeTestimonies.forEach(obj => {
            if (obj && obj.active) {
                obj.destroy();
            }
        });
        this.activeTestimonies = [];
        this.isInteracting = false; // ★ インタラクション状態もリセット
        this.waitingForNext = false; // ★ 次周回への誤爆防止
    }

    // ★ 冒頭からやり直す（リセット）
    restartDebate() {
        console.log('[TrialManager] Restarting debate loop...');
        this.cleanupCurrentSegment();
        this.currentTestimonyIndex = 0;
        this.startDebateLoop();
        this.isInteracting = false;
        // this.scene.events.emit('RESUME_TRIAL'); // ★ 削除: startDebateLoop内で演出再生 -> onCompleteでspawn呼ばれるので不要
    }

    async handleTimeout() {
        if (!this.isFlowing) return;
        this.isFlowing = false;
        this.cleanupCurrentSegment();

        const timeoutScenario = this.segmentData.timeoutScenario || "chapter1/timeout_bad_end.ks";
        console.log(`[TrialManager] Playing timeout scenario: ${timeoutScenario}`);

        try {
            await EngineAPI.runScenarioAsOverlay(this.scene.scene.key, timeoutScenario, true);
            // シナリオ終了後、通常はゲームオーバーかリトライを選択させるが、
            // ここでは簡易的に最初からやり直す
            this.restartDebate();
        } catch (e) {
            console.error('[TrialManager] Timeout scenario error:', e);
            this.restartDebate();
        }
    }

    update(time, delta) {
        // --- 早送りロジック ---
        // 1. Shiftキーが押されているか
        // 2. 画面上の「早送りボタン」(名前: fast_forward_button) が押されているか
        let isFF = this.fastForwardKey.isDown;

        const ffButton = this.scene.children.getByName('fast_forward_button');
        if (ffButton && ffButton.isDown) { // isDown は自前で管理する必要があるかもしれない
            isFF = true;
        }

        // timeScaleの適用
        const targetScale = isFF ? 3.0 : 1.0;
        if (this.scene.time.timeScale !== targetScale) {
            this.scene.time.timeScale = targetScale;
            console.log(`[TrialManager] timeScale changed to: ${targetScale}`);
        }

        // 画面外、または破棄済みオブジェクトのクリーンアップ
        this.activeTestimonies = this.activeTestimonies.filter(obj => {
            if (!obj || !obj.active) return false;
            // scrollモードの画面外判定はFlowComponentが行うが、念のためのバックアップ
            if (obj.x < -1500) {
                obj.destroy();
                return false;
            }
            return true;
        });
    }
}
