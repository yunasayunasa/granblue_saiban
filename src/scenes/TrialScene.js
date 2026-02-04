import BaseGameScene from './BaseGameScene.js';

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
        this.initSceneWithData();
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

        // シーン初期データの状態反映 (タイマーなど)
        if (this.loadData && this.loadData.currentTime) {
            this.currentTime = this.loadData.currentTime;
        }

        this.events.emit('scene-ready');
    }

    startDebate() {
        // 二重開始防止
        if (this.timerEvent) this.timerEvent.destroy();

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
