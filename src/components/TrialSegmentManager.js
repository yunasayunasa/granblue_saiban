/**
 * 裁判セグメントの進行を管理するコンポーネント。
 * JSONから証言データをロードし、TestimonyFlowComponentを持つオブジェクトを生成・制御する。
 */
import EngineAPI from '../core/EngineAPI.js'; // EngineAPIをインポート

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
                // 二重起動を防ぐため、少し待ってから実行
                this.scene.time.delayedCall(500, () => {
                    if (this.isFlowing && !this.scene.isPaused && !this.isInteracting) {
                        this.spawnNextTestimony();
                    }
                });
            }
        });

        // 連鎖タイマーの参照保持用
        this.spawnTimer = null;
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

            // キャラ画像取得 (Lazy load もあるが、ここで初期検索)
            console.log('[TrialSegmentManager] Pre-caching characters...');
            this._findCharacterImages();

            const layoutData = this.scene.loadData || this.scene.cache.json.get(this.scene.layoutDataKey || this.scene.scene.key);
            console.log('[TrialSegmentManager] Layout Data:', layoutData ? 'Found' : 'Not Found');

            if (layoutData && layoutData.trial_data) {
                console.log('[TrialSegmentManager] Trial Data found. Starting loop...');
                this.segmentData = layoutData.trial_data;
                this.startDebateLoop();
            } else {
                console.warn('[TrialSegmentManager] No trial_data found in layout JSON.');
            }
        });
    }

    startDebateLoop() {
        this.isFlowing = true;
        this.currentTestimonyIndex = 0;
        this.spawnNextTestimony();

        // タイマー開始を要求
        this.scene.events.emit('START_DEBATE');
    }

    spawnNextTestimony() {
        if (!this.isFlowing || this.scene.isPaused || this.isInteracting) {
            console.log('[TrialSegmentManager] Spawn skipped (paused or interacting)');
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
                        this.scene.events.emit('RESUME_TRIAL'); // ポーズ解除などのため念のため
                        this.scene.time.delayedCall(100, () => this.spawnNextTestimony()); // ★ 少し遅延させて安定性向上
                    })
                    .catch(err => {
                        console.error('[TrialSegmentManager] Loop scenario error:', err);
                        this.cleanupCurrentSegment(); // エラー時も古い証言を破棄
                        // エラー時も再ループを試みる
                        this.isFlowing = true;
                        this.currentTestimonyIndex = 0;
                        this.scene.time.delayedCall(100, () => this.spawnNextTestimony());
                    });
                return;
            }

            console.log('[TrialSegmentManager] Looping back to 0 immediately.');
            this.cleanupCurrentSegment(); // ★ 古い証言を破棄
            this.currentTestimonyIndex = 0;
            // ★ 再帰呼び出しではなく、次フレーム以降に委ねる（安定性のため）
            this.scene.time.delayedCall(100, () => this.spawnNextTestimony());
            return;
        }

        const testimonyData = this.segmentData.testimonies[this.currentTestimonyIndex];
        this.createTestimonyObject(testimonyData);

        // キャラ表示切り替え
        this.updateCharacterDisplay(this.currentTestimonyIndex);

        this.currentTestimonyIndex++;

        this.spawnTimer = this.scene.time.delayedCall(this.segmentData.interval || 4000, () => {
            this.spawnNextTestimony();
        });
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
            console.log('[TrialManager] Back button selected. Resuming.');
            this.isInteracting = false;
            this.scene.events.emit('RESUME_TRIAL');
            return;
        }

        // 1. テキスト更新アクション (ゆさぶる等)
        if (choice.action === 'update_testimony') {
            await this.updateTestimony(choice.target, choice.new_text, choice.new_highlights);
            return;
        }

        // 2. シナリオ再生の準備
        let scenarioFile = null;
        let isSuccess = false;

        if (choice.correct) {
            console.log('[TrialManager] Correct choice!');
            isSuccess = true;
            scenarioFile = choice.success_scenario;
        } else {
            console.log('[TrialManager] Incorrect choice.');
            scenarioFile = choice.failure_scenario;
        }

        // 3. シナリオがあればオーバーレイで実行
        if (scenarioFile) {
            // フルパスでない場合は補完 (assets/scenarios/ は EngineAPI側で補完される場合もあるが、念のため)
            // EngineAPI.runScenarioAsOverlay は 'scenarios/hoge.ks' のようなパスを期待していると仮定するか、
            // そのまま渡して ScenarioManager 側で補完させる。既存実装に従う。
            // ここでは assets/scenarios/ からの相対パスがJSONに書かれていると想定。

            try {
                console.log(`[TrialManager] Playing scenario: ${scenarioFile}`);
                await EngineAPI.runScenarioAsOverlay(this.scene.scene.key, scenarioFile, true);
                console.log('[TrialManager] Scenario finished.');
            } catch (e) {
                console.warn('[TrialManager] Scenario execution failed or skipped:', e);
            }
        } else if (isSuccess) {
            // シナリオ未指定だが正解の場合、簡易エフェクトだけ出す
            if (this.progressIndicator) {
                await new Promise(resolve => {
                    this.progressIndicator.show("論破！！", 3000);
                    this.scene.events.once('PROGRESS_INDICATOR_COMPLETE', resolve);
                });
            }
        }

        // 4. シナリオ終了後の処理
        if (isSuccess) {
            if (choice.next_trial_data) {
                this.loadNextTrialData(choice.next_trial_data);
            } else {
                console.log('[TrialManager] No next trial data. Resuming current loop (or ending).');
                // 次がない場合はどうするか？ひとまず再開
                this.isInteracting = false;
                this.scene.events.emit('RESUME_TRIAL');
            }
        } else {
            // 失敗時は元の議論に戻る（ペナルティ処理などあればここに追加）
            console.log('[TrialManager] Returning to discussion...');
            this.isInteracting = false;
            this.scene.events.emit('RESUME_TRIAL');
        }
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
        // 現在画面に出ている証言をすべて消す
        this.activeTestimonies.forEach(obj => obj.destroy());
        this.activeTestimonies = [];
        this.isInteracting = false; // ★ インタラクション状態もリセット

        // タイマーもクリアしておく
        if (this.spawnTimer) {
            this.spawnTimer.remove();
            this.spawnTimer = null;
        }
    }

    // ★ 冒頭からやり直す（リセット）
    restartDebate() {
        console.log('[TrialManager] Restarting debate loop...');
        this.cleanupCurrentSegment();
        this.currentTestimonyIndex = 0;
        this.startDebateLoop();
        this.isInteracting = false;
        this.scene.events.emit('RESUME_TRIAL');
    }

    update(time, delta) {
        // 画面外、または破棄済みオブジェクトのクリーンアップ
        this.activeTestimonies = this.activeTestimonies.filter(obj => {
            if (!obj || !obj.active) return false;
            if (obj.x < -1500) {
                obj.destroy();
                return false;
            }
            return true;
        });
    }
}
