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

        // ★ StateManager 依存の宣言
        this.dependencies = ['trial_timer'];

        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.add(this);
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
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    update(time, delta) {
        // タイマーの更新は TrialScene.js 側で行うため、ここでは何もしない。
        // StateManager からの通知 (updateValue) に基づいて表示のみ更新する。
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
    }
}
