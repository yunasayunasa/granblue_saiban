/**
 * 裁判セグメントの進行を管理するコンポーネント。
 * JSONから証言データをロードし、TestimonyFlowComponentを持つオブジェクトを生成・制御する。
 */
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
        const x = this.scene.cameras.main.width + 100;
        const y = 200 + (this.currentTestimonyIndex % 3) * 120;

        const container = this.scene.add.container(x, y);
        const textObj = this.scene.add.text(0, 0, data.text, {
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        });
        container.add(textObj);

        // コンテナのクリック範囲を設定（テキストのサイズに合わせる）
        container.setSize(textObj.width, textObj.height);
        container.setInteractive({ useHandCursor: true });

        const flowComponent = this.scene.addComponent(container, 'TestimonyFlowComponent', {
            text: data.text,
            speed: 50,
            moveSpeed: 120
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

    handleChoice(choice) {
        console.log('[TrialManager] Choice selected:', choice.text);

        if (choice.correct) {
            this.proceedToNextPhase();
        } else if (choice.action === 'update_testimony') {
            this.updateTestimony(choice.target, choice.new_text);
        } else {
            console.log('[TrialManager] Incorrect choice or no action.');
            this.isInteracting = false;
            this.scene.events.emit('RESUME_TRIAL');
        }
    }

    updateTestimony(targetId, newText) {
        const testimony = this.segmentData.testimonies.find(t => t.id === targetId);
        if (testimony) {
            testimony.text = newText;

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
    }

    proceedToNextPhase() {
        console.log('論破成功！');
        if (this.progressIndicator) {
            this.progressIndicator.show("論破！！", 3000);
            this.scene.events.once('PROGRESS_INDICATOR_COMPLETE', () => {
                // ここで次のシーンやフラグ更新などを行う
            });
        }
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
