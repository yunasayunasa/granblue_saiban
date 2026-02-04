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

        // コンポーネントの検索
        this.scene.updatableComponents.forEach(comp => {
            if (comp.constructor.name === 'InteractionMenuComponent') {
                this.interactionMenu = comp;
                comp.onSelection = (choice) => this.handleChoice(choice);
            }
            if (comp.constructor.name === 'ProgressIndicatorComponent') {
                this.progressIndicator = comp;
            }
        });

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

        this.scene.addComponent(container, 'TestimonyFlowComponent', {
            text: data.text,
            speed: 50,
            moveSpeed: 120
        });

        // ハイライト設定
        if (data.highlights && data.highlights.length > 0) {
            // 黄色のハイライトがある場合、コンテナ全体を黄色っぽく見せ、クリック可能にする
            // 本来は部分的な色変えが必要だが、一旦プロトタイプ版として全体に適用
            textObj.setTint(0xffff00);

            // 重要：ハイライトデータを持たせる
            container.on('pointerdown', () => {
                // コンソーログでクリックを確認
                console.log('[TrialManager] Testimony clicked:', data.text);
                this.onHighlightClicked(data.highlights[0]);
            });
        }

        this.activeTestimonies.push(container);
    }

    onHighlightClicked(highlightData) {
        if (this.isInteracting || !this.isFlowing) return;

        console.log('[TrialManager] highlight clicked. data:', highlightData);
        this.scene.events.emit('PAUSE_TRIAL');
        this.isInteracting = true;

        if (this.interactionMenu) {
            this.interactionMenu.show(highlightData);
        } else {
            console.warn('[TrialManager] interactionMenu not found. resuming...');
            this.isInteracting = false;
            this.scene.events.emit('RESUME_TRIAL');
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
