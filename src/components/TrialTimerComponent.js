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
        // 表示更新だけなら updateDisplay で十分だが、 updateValue で行うため
        // この定期 update は不要になる可能性がある。
        // ここでは空にしておくか、あるいはアニメーション等が必要な場合のみ利用。
    }

    updateDisplay() {
        if (!this.textObject) return;

        const minutes = Math.floor(this.currentTime / 60);
        const seconds = Math.floor(this.currentTime % 60);
        const displayStr = `LIMIT ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        this.textObject.setText(displayStr);

        // 残り時間が少ない場合に赤くする演出
        if (this.currentTime < 30) {
            this.textObject.setColor('#ff0000');
        } else {
            this.textObject.setColor('#ffffff');
        }
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
