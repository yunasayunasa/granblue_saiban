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
        this.waitingForNext = false;

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

        // ★ デュアルカメラ対応: 演出は常に水平に表示するためUIカメラに登録
        if (this.scene.registerToCamera) {
            this.scene.registerToCamera(this.cutInEffect, 'UI');
            this.scene.registerToCamera(this.debateStartEffect, 'UI');
        }

        // 中間シナリオ再生中フラグ
        this.isPlayingInterim = false;
    }

    start() {
        console.log('[TrialSegmentManager] start() called.');

        // ★ 修正: 確実に全オブジェクトが生成されるのを待つため、微小な遅延を入れる
        this.scene.time.delayedCall(10, () => {
            const menuObj = this.scene.findGameObjectByName ? this.scene.findGameObjectByName('interaction_menu') : this.scene.children.getByName('interaction_menu');
            if (menuObj && menuObj.components && menuObj.components.InteractionMenuComponent) {
                this.interactionMenu = menuObj.components.InteractionMenuComponent;
                this.interactionMenu.onSelection = (choice) => this.handleChoice(choice);
                console.log('[TrialSegmentManager] InteractionMenuComponent found via GameObject.');
            } else {
                console.warn('[TrialSegmentManager] InteractionMenuComponent NOT found.');
            }

            const indicatorObj = this.scene.findGameObjectByName ? this.scene.findGameObjectByName('progress_indicator') : this.scene.children.getByName('progress_indicator');
            if (indicatorObj && indicatorObj.components && indicatorObj.components.ProgressIndicatorComponent) {
                this.progressIndicator = indicatorObj.components.ProgressIndicatorComponent;
            }

            // 早送りボタンの初期化
            const ffButton = this.scene.findGameObjectByName ? this.scene.findGameObjectByName('fast_forward_button') : this.scene.children.getByName('fast_forward_button');
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
                const timerObj = this.scene.findGameObjectByName ? this.scene.findGameObjectByName('timer_container') : this.scene.children.getByName('timer_container');
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
        console.log('[TrialSegmentManager] startDebateLoop. DUMP segmentData:', JSON.stringify(this.segmentData));
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
                        console.log('[TrialSegmentManager] Loop scenario Promise resolved. Restarting loop.');
                        this.cleanupCurrentSegment();
                        this.isFlowing = true;
                        this.currentTestimonyIndex = 0;
                        this.scene.isPaused = false;

                        this.debateStartEffect.play('LOOP', () => {
                            this.scene.time.delayedCall(100, () => this.spawnNextTestimony());
                        });
                    })
                    .catch(err => {
                        console.error('[TrialSegmentManager] Loop scenario FAILED/TIEMOUT:', err);
                        this.cleanupCurrentSegment();
                        this.isFlowing = true;
                        this.currentTestimonyIndex = 0;
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
        const charNames = {
            left: 'character_left',
            center: 'character_center',
            right: 'character_right'
        };

        for (const [key, name] of Object.entries(charNames)) {
            if (this.scene.findGameObjectByName) {
                this.charaImages[key] = this.scene.findGameObjectByName(name);
            } else {
                this.charaImages[key] = this.scene.children.getByName(name);
            }
        }

        console.log('[TrialSegmentManager] Found characters:',
            Object.entries(this.charaImages).map(([k, v]) => `${k}: ${v ? v.name : 'null'}`).join(', '));
    }

    // キャラ表示切り替えメソッド
    updateCharacterDisplay(index) {
        // 画像がまだ見つかっていない場合は検索を試みる (Lazy Load)
        this._findCharacterImages();

        if (this.charaImages.left) this.charaImages.left.setVisible(false);
        if (this.charaImages.center) this.charaImages.center.setVisible(false);
        if (this.charaImages.right) this.charaImages.right.setVisible(false);

        // インデックスに応じて表示 (0:左, 1:右, 2:中 のローテーション、またはデータ指定)
        // データに position 指定がある場合はそれを優先
        const currentTestimony = this.segmentData.testimonies[index];
        let posStr = currentTestimony && currentTestimony.position;

        let pos = 2; // default center
        if (posStr) {
            if (posStr === 'left') pos = 0;
            else if (posStr === 'right') pos = 1;
            else pos = 2;
        } else {
            pos = index % 3;
        }

        const target = (pos === 0) ? this.charaImages.left :
            (pos === 1) ? this.charaImages.right :
                this.charaImages.center;

        if (target) {
            target.setVisible(true);
            console.log(`[TrialSegmentManager] Showing character target: ${target.name} at position: ${pos}`);

            // ★ カメラ回転演出
            this._rotateCameraForPosition(pos);

        } else {
            console.warn('[TrialSegmentManager] No character image for position:', pos);
        }
    }

    _rotateCameraForPosition(pos) {
        const cam = this.scene.cameras.main;
        let targetAngle = 0;

        // 0:left -> カメラは左(-15度) ... ではなく、
        // 要望: "キャラが右の時、カメラを全体的に15度右回転"
        // "キャラが左なら...カメラは左に15度"
        // Phaserのrotationはラジアン、angleは度。

        if (pos === 0) { // Left Character
            targetAngle = -5; // 左に傾ける (少し控えめに5度から調整)
        } else if (pos === 1) { // Right Character
            targetAngle = 5; // 右に傾ける
        } else { // Center
            targetAngle = 0;
        }

        // ユーザー要望の15度は画面が大きく傾きすぎる可能性があるため、まずは5度程度で様子を見る。
        // また、rotateTo は Phaser Camera にはないため、tweenで rotation を操作する。
        // rotation = angle * (Math.PI / 180)

        const targetRotation = targetAngle * (Math.PI / 180);
        cam.setRotation(targetRotation);
        console.log(`[TrialSegmentManager] MainCamera rotation set to: ${targetRotation} (rad) / ${targetAngle} (deg)`);
    }

    createTestimonyObject(data) {
        // Y座標の重なりを避けるための計算。3行でループ。
        // デフォルトスタイルは 'scroll'
        const style = data.style || 'scroll';

        // 配置計算
        let x, y;

        // 現在のキャラ位置を取得 (Spawn時に計算済みではないため再計算)
        // 本来はインスタンス変数に保持すべきだが、簡易的にここでも同じロジックで判定
        let posStr = data.position;
        let posIndex = 2;
        if (posStr) {
            if (posStr === 'left') posIndex = 0;
            else if (posStr === 'right') posIndex = 1;
            else posIndex = 2;
        } else {
            posIndex = this.currentTestimonyIndex % 3; // Note: currentTestimonyIndex has already been incremented? No, it's checked before increment in spawn
            // spawnNextで increment される前の index を使いたいが、
            // spawnNextTestimony 内で createTestimonyObject 呼び出し時点では currentTestimonyIndex はまだインクリメントされていない。
            // しかし spawnNextTestimony の中で data = testimonies[this.currentTestimonyIndex] としているので整合している。
        }

        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        if (style === 'typewriter') {
            // 中央配置
            x = width / 2;
            y = 300;
        } else {
            // scroll (従来通りだが、開始位置を変える)
            // Left Chara (pos=0) -> Text from Right
            // Right Chara (pos=1) -> Text from Left
            // Center Chara (pos=2) -> Text split?

            y = 200 + (this.currentTestimonyIndex % 3) * 50; // 少しずらす

            if (posIndex === 0) { // Left Chara -> Text on Right
                x = width * 0.6; // 画面右側
            } else if (posIndex === 1) { // Right Chara -> Text on Left
                x = width * 0.1; // 画面左側
            } else { // Center
                // 中央の場合は邪魔にならないように... とりあえず左寄り
                x = width * 0.1;

                // ★ スプリット表示の場合
                if (data.text.includes('|')) {
                    // ここでは代表座標のみ決め、実際のテキスト生成は後で分割する
                    // コンテナ自体の位置はずらさず、内部でオフセットする手もあるが、
                    // TestimonyFlowComponentが1つのオブジェクトを動かす前提なので、
                    // スプリットの場合はコンテナを2つ作るか、1つのコンテナ内に2つのTextを置くか。
                    // FlowComponentは1つのText(またはContainer内の1つのText)を操作する。
                    // 複雑になるため、今回は「スプリット文字が含まれていたら、改行に置換して中央表示」などで代用するか、
                    // あるいは FlowComponent を拡張する。

                    // 簡易実装: '|' を改行に置換して表示
                    // data.text = data.text.replace(/\|/g, '\n'); 
                    // 一旦そのまま通して、FlowComponent側で対応する手段もあるが、
                    // 要望は「両方に分けて表示」。
                }
            }

            // スクロール開始位置は画面外から
            if (style === 'scroll') {
                x = width + 50; // 右から左へ流れる前提なら常に右端スタート？
                // 現在のTestimonyFlowComponentは「xを減算」しているので右から左。
                // もし「左にキャラがいるから右にテキスト」の場合、
                // 「テキストが右から出てきて左に流れる」のか、「その場に表示される」のか。
                // 従来の挙動は「右から左へ流れるニコニコ動画風」。

                // 要望「証言は左」 -> 恐らく固定位置表示 or 吹き出し的なものを想定？
                // しかし FlowComponent は scroll か typewriter。
                // typewriter なら固定位置。
                // scroll なら流れる。

                // ここでは「固定位置(typewriterライク)で、かつ表示場所が左右」という解釈で実装を修正する。
                // styleが未指定なら 'scroll' になるが、裁判パートの証言は通常固定位置でポポポ...と出るのが一般的。
                // もし 'scroll' が「流れる」モードなら、それはそれで維持。

                // 今回は「証言シーンのテンプレート化」なので、style: 'typewriter' をデフォルトにする変更も視野に。
                // しかし既存データへの影響を避けるため、style指定に従う。
                // もし 'typewriter' なら座標を調整。
            }
        }

        // ★ 強制的に typewriter 的な配置にするためのオーバーライド
        // ユーザー要望の「右の時、証言は左」などの配置は静止テキスト（typewriter）の方が自然。
        // もしデータが scroll 指定でも、このレイアウトテンプレートに従うなら位置固定の方が良いかもしれない。
        // ここでは style='typewriter' の場合の配置ロジックを強化する。

        if (style === 'typewriter' || data.position) { // position指定がある場合も固定配置とみなす
            if (posIndex === 0) { // Left Chara -> Text Right
                x = width * 0.55;
                y = height * 0.6;
            } else if (posIndex === 1) { // Right Chara -> Text Left
                x = width * 0.05;
                y = height * 0.6;
            } else { // Center
                x = width * 0.1; // 全幅使うため左端基準
                y = height * 0.65; // 少し下
            }
        } else {
            // 従来のスクロール (右端スタート)
            x = width + 100;
        }

        const container = this.scene.add.container(x, y).setDepth(1000); // ★ 高いDepthを設定

        // ★ デュアルカメラ対応: UIカメラからは除外する（MainCamera側で回転させる）
        if (this.scene.registerToCamera) {
            this.scene.registerToCamera(container, 'Gameplay');
        }

        const textObj = this.scene.add.text(0, 0, data.text.replace(/\|/g, '\n'), {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            wordWrap: { width: (posIndex === 2 ? 1000 : 500), useAdvancedWrap: true }
        });

        if (style === 'typewriter' || data.position) {
            // 左寄せ等の調整
            textObj.setOrigin(0, 0);
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
            textObj.updateText();
            container.setSize(textObj.width, textObj.height);

            // 重要：ハイライトがある場合のみ指マークとクリックイベントを設定
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, textObj.width, textObj.height), Phaser.Geom.Rectangle.Contains);
            container.input.useHandCursor = true;

            container.on('pointerdown', () => {
                console.log(`[TrialManager] Testimony highlight clicked! ID: ${data.id}, isInteracting: ${this.isInteracting}`);
                this.onHighlightClicked(data.highlights[0]);
            });
        } else {
            // ハイライトがない場合もクリック領域自体は設定（ただし指マークはなし）
            textObj.updateText();
            container.setSize(textObj.width, textObj.height);
            container.setInteractive(new Phaser.Geom.Rectangle(0, 0, textObj.width, textObj.height), Phaser.Geom.Rectangle.Contains);
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
            const menuObj = this.scene.findGameObjectByName ? this.scene.findGameObjectByName('interaction_menu') : this.scene.children.getByName('interaction_menu');
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
        console.log('[TrialManager] handleChoice called with:', JSON.stringify(choice));
        console.log('[TrialManager] action:', choice.action, 'pre_update:', choice.pre_update_scenario, 'evidence_req:', choice.evidence_required);

        // 0. 「戻る」ボタン: 何もせず議論再開
        if (choice.isBack) {
            this._resumeFromMenu();
            return;
        }

        // --- 疑問 / ゆさぶる (update_testimony) の処理 ---
        if (choice.action === 'update_testimony') {
            // 1. 中間シナリオがあれば再生
            if (choice.pre_update_scenario) {
                console.log(`[TrialManager] Playing interim scenario: ${choice.pre_update_scenario}`);
                this.isPlayingInterim = true;
                try {
                    await EngineAPI.runScenarioAsOverlay(this.scene.scene.key, choice.pre_update_scenario, true);
                } catch (e) {
                    console.warn('[TrialManager] Interim scenario failed:', e);
                }
                this.isPlayingInterim = false;
            }

            // 2. データ更新 (メモリ内のデータを書き換える)
            await this.updateTestimony(choice.target, choice.new_text, choice.new_highlights);

            // 3. ユーザー要望: "疑問...はすべてショートテキストのあと議論冒頭に戻る"
            // データ更新後、議論を最初からやり直すことで、プレイヤーは新しい証言を確認しにいく
            this.restartDebate();
            return;
        }

        // --- 証拠品提示が必要な場合 (evidence_required) ---
        // 正解選択肢でかつ証拠品が必要な場合
        if (choice.evidence_required) {
            console.log('[TrialManager] Evidence required:', choice.evidence_required);
            this._showEvidenceOverlay(choice);
            return;
        }

        // --- その他 (単なるハズレ選択肢など) ---
        // ユーザー要望: "ハズレ選択肢はすべてショートテキストのあと議論冒頭に戻る"

        const isCorrect = choice.correct;
        const scenarioFile = isCorrect ? choice.success_scenario : choice.failure_scenario;

        // シナリオ再生
        if (scenarioFile) {
            try {
                // シナリオ実行とタイムアウトの競合
                await Promise.race([
                    EngineAPI.runScenarioAsOverlay(this.scene.scene.key, scenarioFile, true),
                    new Promise((_, reject) => this.scene.time.delayedCall(10000, () => reject(new Error('Scenario execution timed out'))))
                ]);
            } catch (e) {
                console.warn('[TrialManager] Scenario execution failed or timed out:', e);
                // フリーズ防止のため、強制的にオーバーレイを閉じるリクエストを送る
                EngineAPI.requestCloseOverlay('NovelOverlayScene');
                // 少し待ってから次へ進む
                await new Promise(r => this.scene.time.delayedCall(500, r));
            }
        }

        if (isCorrect) {
            // ★ 進行時はカメラをリセット
            this._rotateCameraForPosition(-1); // -1 or null to reset

            // 正解 (証拠品なしで正解になるケースは稀だが、あれば次へ)
            if (choice.next_trial_data) {
                this.loadNextTrialData(choice.next_trial_data);
            } else {
                // 次のデータがない場合はとりあえず進めるか終了
                console.log('No next data. Finishing trial segment?');
                this._resumeFromMenu();
            }
        } else {
            // 不正解 -> 冒頭に戻る
            this.restartDebate();
        }
    }

    _showEvidenceOverlay(choice) {
        const overlay = this.scene.evidenceSelectOverlay;
        if (overlay) {
            // ポーズ状態にする
            // this.scene.setPause(true); // EvidenceSelectOverlay側で制御されている場合もあるが念のため
            // -> EvidenceSelectOverlay.show は内部で特にPauseしないようなので、呼ぶ側でするか、
            //    あるいは handleChoice 時点ですでに InteractionMenu で Pause されているはず。

            overlay.show('present', (selectedEvidenceId) => {
                this._onEvidencePresented(selectedEvidenceId, choice);
            });
        } else {
            console.warn('[TrialManager] EvidenceSelectOverlay not found.');
            this.restartDebate();
        }
    }

    // 証拠品が提示されたときのコールバック
    async _onEvidencePresented(evidenceId, choice) {
        console.log(`[TrialManager] Evidence presented: ${evidenceId}, Required: ${choice.evidence_required}`);

        // オーバーレイは閉じる動作を内部で行うが、非同期完了を待つ必要があるかも
        // ここでは即座に判定

        if (evidenceId === choice.evidence_required) {
            // --- 正解 ---
            // ★ 進行時はカメラをリセット（論破演出の前に戻しておく）
            this._rotateCameraForPosition(-1);

            // 論破演出
            await this._playBreakEffect();

            // 成功シナリオ
            if (choice.success_scenario) {
                await EngineAPI.runScenarioAsOverlay(this.scene.scene.key, choice.success_scenario, true);
            }

            // 次のフェーズへ
            if (choice.next_trial_data) {
                this.loadNextTrialData(choice.next_trial_data);
            } else {
                // 完全クリア？
                console.log('Trial segment complete!');
                this.scene.events.emit('TRIAL_COMPLETE');
            }
        } else {
            // --- 不正解 (間違った証拠品) ---
            // ユーザー要望: "仮に間違った証拠品ならショートテキストのあと再提示"

            // 失敗シナリオ (証拠品ミス用があればそれを、なければ通常の失敗シナリオ)
            const failScenario = choice.failure_scenario_evidence || choice.failure_scenario;
            if (failScenario) {
                await EngineAPI.runScenarioAsOverlay(this.scene.scene.key, failScenario, true);
            } else {
                // シナリオがない場合は簡易メッセージ
                if (this.progressIndicator) {
                    this.progressIndicator.show("証拠品が違うようだ…", 1500);
                    await new Promise(r => setTimeout(r, 1500));
                }
            }

            // 再提示 (もう一度オーバーレイを開く)
            // 少しウェイトを入れてから開く
            this.scene.time.delayedCall(500, () => {
                this._showEvidenceOverlay(choice);
            });
        }
    }

    async _playBreakEffect() {
        return new Promise(resolve => {
            this.cutInEffect.play(resolve);
        });
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
            // ここでのresumeは行わない (handleChoice側でrestartDebateする)
        } else {
            // resumeなし
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

        // ★ カメラリセットを徹底
        this._rotateCameraForPosition(-1);
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

        const ffButton = this.scene.findGameObjectByName ? this.scene.findGameObjectByName('fast_forward_button') : this.scene.children.getByName('fast_forward_button');
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
