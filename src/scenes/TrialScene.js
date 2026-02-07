import BaseGameScene from './BaseGameScene.js';
import EvidenceManager from '../components/EvidenceManager.js';
import EvidenceSelectOverlay from '../components/EvidenceSelectOverlay.js';


/**
 * 裁判パート用のシーン。
 * BaseGameSceneを継承し、証言のフロー制御、ポーズ機能、タイマー管理を追加する。
 */
export default class TrialScene extends BaseGameScene {
    constructor() {
        super({ key: 'TrialScene' });
        this.isPaused = false;
        this.timer = null;
        this.currentTime = 0;
        this.maxTime = 300; // デフォルト300秒
    }

    init(data) {
        super.init(data);
        if (data && data.maxTime) {
            this.maxTime = data.maxTime;
        }
        this.currentTime = this.maxTime;
    }

    create() {
        super.create();
        
        // 証拠品マネージャーの初期化
        this.evidenceManager = new EvidenceManager(this);
        this.evidenceManager.init();
        
        // 証拠品選択オーバーレイの作成
        this.evidenceSelectOverlay = new EvidenceSelectOverlay(this, this.evidenceManager);
        this.evidenceSelectOverlay.setVisible(false);

        // テスト用: 初期所持品の追加 (デバッグ)
        this.evidenceManager.addEvidence('candy_wrapper');
        this.evidenceManager.addEvidence('gum');

        this.initSceneWithData();

        // ★ 証拠品確認ボタンの追加 (左上, タイマーと同じ高さ y=80 付近)
        this.createEvidenceButton();
    }

    createEvidenceButton() {
        const x = 150;
        const y = 80;
        
        const container = this.add.container(x, y).setDepth(2000).setScrollFactor(0);
        
        // 背景 (角丸四角)
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.6);
        bg.lineStyle(2, 0xffffff, 0.8);
        bg.fillRoundedRect(-80, -35, 160, 70, 15);
        bg.strokeRoundedRect(-80, -35, 160, 70, 15);
        container.add(bg);

        // テキスト
        const text = this.add.text(0, 0, '証拠品', {
            fontSize: '28px',
            color: '#ffffff',
            fontFamily: 'sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(text);

        // インタラクション
        container.setSize(160, 70);
        container.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                // 議論中(isFlowing)でも見れるようにするが、ポーズはしておいたほうが無難
                if (this.evidenceSelectOverlay) {
                    if (this.evidenceSelectOverlay.visible) {
                         this.evidenceSelectOverlay.hide();
                         this.setPause(false);
                    } else {
                         this.setPause(true);
                         this.evidenceSelectOverlay.show('view', () => {
                             // viewモードなのでコールバックは基本使わないが、閉じた時の処理用
                         });
                         // Overlay側で閉じるボタンが押されたらここに戻る仕組みが必要だが、
                         // 現状のOverlayはhide()するだけ。
                         // Overlayのhideでポーズ解除が必要。
                         // 簡易的に、Overlayのhideをフックするか、OverlayにonCloseを持たせる。
                         // EvidenceSelectOverlayを少し修正して、onCloseコールバックを受け取れるようにするのが良いが、
                         // ここでは一旦、OverlayのcloseBtnクリック時にシーンのresumeを呼ぶように改造するか、
                         // またはEvidenceSelectOverlayからイベントを発火させる。
                    }
                }
            });
        
        // Overlayが閉じられたときにポーズ解除するイベントをリッスン
        if (this.evidenceSelectOverlay) {
            this.evidenceSelectOverlay.on('CLOSE_OVERLAY', () => {
                this.setPause(false);
            });
        }
    }

    /**
     * データ駆動のセットアップ完了後に呼び出される。
     */
    onSetupComplete() {
        console.log(`[TrialScene] Object setup complete. Initializing trial logic.`);

        // 議論開始イベントの待機
        // 議論開始イベントの待機
        this.events.on('START_DEBATE', this.startDebate, this);
        this.events.on('PAUSE_TRIAL', () => this.setPause(true));
        this.events.on('RESUME_TRIAL', () => this.setPause(false));

        // ★ リセット要求の処理
        this.events.on('RESTART_DEBATE_REQUEST', () => {
            console.log('[TrialScene] Received RESTART_DEBATE_REQUEST');
            const trialManager = this.children.getByName('trial_manager');
            if (trialManager && trialManager.components && trialManager.components.TrialSegmentManager) {
                trialManager.components.TrialSegmentManager.restartDebate();
            }
        });

        // シーン初期データの状態反映 (タイマーなど)
        if (this.loadData && this.loadData.currentTime) {
            this.currentTime = this.loadData.currentTime;
        }

        this.events.emit('scene-ready');
    }

    startDebate() {
        // 二重開始防止
        if (this.timerEvent) this.timerEvent.destroy();

        // ★ 修正: 開始時に必ずポーズ解除
        this.setPause(false);

        // タイマーの開始
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        if (this.isPaused) return;

        this.currentTime--;
        const stateManager = this.registry.get('stateManager');
        if (stateManager) {
            stateManager.setF('trial_timer', this.currentTime);
        }

        if (this.currentTime <= 0) {
            this.handleTimeUp();
        }
    }

    handleTimeUp() {
        console.log('[TrialScene] Time Up!');
        this.events.emit('TIME_UP');

        // GameFlowManagerを通じてゲームオーバーへ
        const engineAPI = this.registry.get('engineAPI');
        if (engineAPI) {
            engineAPI.fireGameFlowEvent('GAME_OVER');
        } else {
            const systemScene = this.scene.get('SystemScene');
            if (systemScene && systemScene.gameFlowManager) {
                systemScene.gameFlowManager.handleEvent('GAME_OVER');
            }
        }
    }

    setPause(pause) {
        this.isPaused = pause;

        // ★ タイマーイベントも停止・再開させる
        if (this.time) {
            this.time.paused = pause;
        }

        // シーン内の全オブジェクトの物理/アニメーション停止
        if (pause) {
            this.matter.world.pause();
            if (this.updatableComponents) {
                this.updatableComponents.forEach(comp => {
                    if (comp.onPause) comp.onPause();
                });
            }
        } else {
            this.matter.world.resume();
            if (this.updatableComponents) {
                this.updatableComponents.forEach(comp => {
                    if (comp.onResume) comp.onResume();
                });
            }
        }
    }

    update(time, delta) {
        if (this.isPaused) return;
        super.update(time, delta);
    }
}
