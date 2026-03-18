/**
 * 裁判の制限時間を管理し、表示を更新するコンポーネント。
 */
export default class TrialTimerComponent {
    constructor(scene, gameObject, params) {
        this.scene = scene;
        this.gameObject = gameObject; // 通常は Container (背景板 + テキスト)

        this.timeLimit = params.timeLimit || 300; // 秒
        this.currentTime = this.timeLimit;
        this.isPaused = false;
        this.isActive = false;

        // Container内部のテキストオブジェクトを検索
        this.textObject = null;
        if (gameObject.list) {
            this.textObject = gameObject.list.find(child => child.type === 'Text');
        } else if (gameObject.type === 'Text') {
            this.textObject = gameObject;
        }

        if (this.textObject) {
            // 明朝体系のフォントを指定 (serif)
            this.textObject.setFontFamily('"Times New Roman", "MS PMincho", serif');
        }

        // ★ StateManager 依存の宣言 (UIScene経由でupdateValueが呼ばれる)
        this.dependencies = ['trial_timer'];

        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.add(this);
        }

        // 初期値の反映 (直接読み取りのみ、購読はしない)
        const stateManager = this.scene.registry.get('stateManager');
        if (stateManager) {
            const initial = stateManager.getF('trial_timer');
            if (initial !== undefined) {
                this.currentTime = initial;
                this.updateDisplay();
            }
        }
    }

    /**
     * StateManagerからの通知を受け取る
     */
    updateValue(state) {
        if (state.trial_timer !== undefined) {
            this.currentTime = state.trial_timer;
            this.updateDisplay();
        }
    }

    start() {
        this.isActive = true;
        this._elapsed = 0;
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    onPause() {
        this.isPaused = true;
    }

    onResume() {
        this.isPaused = false;
    }

    update(time, delta) {
        if (!this.isActive || this.isPaused) return;

        this._elapsed = (this._elapsed || 0) + delta;
        if (this._elapsed >= 1000) {
            this._elapsed -= 1000;
            this.currentTime = Math.max(0, this.currentTime - 1);
            this.updateDisplay();

            // StateManagerにも同期して TrialScene 側のタイムアウト判定に使わせる
            const stateManager = this.scene.registry.get('stateManager');
            if (stateManager) {
                stateManager.setF('trial_timer', this.currentTime);
            }
        }
    }

    updateDisplay() {
        if (!this.textObject) return;

        const displayTime = Math.max(0, Math.floor(this.currentTime));
        const minutes = Math.floor(displayTime / 60);
        const seconds = Math.floor(displayTime % 60);
        const displayStr = `LIMIT ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        this.textObject.setText(displayStr);
    }

    setTime(seconds) {
        this.timeLimit = seconds;
        this.currentTime = seconds;
        this.updateDisplay();
    }

    destroy() {
        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.delete(this);
        }
        this.textObject = null;
    }
}
