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

        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.add(this);
        }
    }

    start() {
        console.log('[TrialSegmentManager] start() called.');

        // ★ 修正: インスタンス化の順序に依存しないよう、GameObject名から検索して取得する
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

        const layoutData = this.scene.loadData || this.scene.cache.json.get(this.scene.layoutDataKey || this.scene.scene.key);
        console.log('[TrialSegmentManager] Layout Data:', layoutData ? 'Found' : 'Not Found');

        if (layoutData && layoutData.trial_data) {
            console.log('[TrialSegmentManager] Trial Data found. Starting loop...');
            this.segmentData = layoutData.trial_data;
            this.startDebateLoop();
        } else {
            console.warn('[TrialSegmentManager] No trial_data found in layout JSON.');
        }
    }

    startDebateLoop() {
        this.isFlowing = true;
        this.currentTestimonyIndex = 0;
        this.spawnNextTestimony();

        // タイマー開始を要求
        this.scene.events.emit('START_DEBATE');
    }

    spawnNextTestimony() {
        if (!this.isFlowing || this.scene.isPaused) return;

        console.log(`[TrialSegmentManager] Spawning testimony index: ${this.currentTestimonyIndex}`);
        const testimonyData = this.segmentData.testimonies[this.currentTestimonyIndex];
        if (!testimonyData) {
            console.log('[TrialSegmentManager] End of testimonies. Looping back to 0.');
            this.currentTestimonyIndex = 0;
            // ★ 再帰呼び出しではなく、次フレーム以降に委ねる（安定性のため）
            this.scene.time.delayedCall(100, () => this.spawnNextTestimony());
            return;
        }

        this.createTestimonyObject(testimonyData);
        this.currentTestimonyIndex++;

        this.scene.time.delayedCall(this.segmentData.interval || 4000, () => {
            this.spawnNextTestimony();
        });
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

        const container = this.scene.add.container(x, y);
        const textObj = this.scene.add.text(0, 0, data.text, {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        });

        // typewriterの場合は中央揃えにする
        if (style === 'typewriter') {
            textObj.setOrigin(0.5, 0.5);
        }
        container.add(textObj);

        // コンテナのクリック範囲を設定（テキストのサイズに合わせる）
        container.setSize(textObj.width, textObj.height);
        container.setInteractive({ useHandCursor: true });

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

            // 重要：インタラクション設定
            container.on('pointerdown', () => {
                console.log('[TrialManager] Testimony clicked:', modifiedText);
                this.onHighlightClicked(data.highlights[0]);
            });
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
            this.updateTestimony(choice.target, choice.new_text);
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

    updateTestimony(targetId, newText) {
        // 1. データ上の修正
        const testimony = this.segmentData.testimonies.find(t => t.id === targetId);
        if (testimony) {
            testimony.text = newText;
            // 必要ならハイライトもクリアまたは更新するべきだが、今回はテキスト変更のみ
            testimony.highlights = []; // ハイライトは無効化しておく（矛盾が解消された等のため）
        }

        // 2. 画面上の修正 (Activeなものがあれば即時反映)
        const activeObj = this.activeTestimonies.find(obj => obj.getData('id') === targetId);
        if (activeObj) {
            // Container内のTextを探す
            const textObj = activeObj.list.find(child => child.type === 'Text');
            if (textObj) {
                textObj.setText(newText);
                // コンテナサイズ更新
                textObj.updateText();
                activeObj.setSize(textObj.width, textObj.height);
            }
            // FlowComponentのfullTextも更新しないと、文字送り中に戻ってしまう可能性がある
            // コンポーネント取得
            if (activeObj.components && activeObj.components.TestimonyFlowComponent) {
                activeObj.components.TestimonyFlowComponent.fullText = newText;
                // もし文字送りが終わっていてもテキストは更新済みなのでOK
            }
        }

        if (this.progressIndicator) {
            this.progressIndicator.show("証言変更…", 2000);
            this.scene.events.once('PROGRESS_INDICATOR_COMPLETE', () => {
                this.isInteracting = false;
                this.scene.events.emit('RESUME_TRIAL');
            });
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
