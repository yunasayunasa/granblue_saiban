/**
 * 証言テキストの流れを制御するコンポーネント。
 * 文字を1文字ずつ表示（タイプ音付き）しながら画面内を移動させる。
 */
export default class TestimonyFlowComponent {
    constructor(scene, gameObject, params) {
        this.scene = scene;
        this.gameObject = gameObject; // TextオブジェクトまたはContainer

        this.fullText = params.text || gameObject.text || "";
        this.typingSpeed = params.speed || 50;
        this.moveSpeed = params.moveSpeed || 100;
        // ★ style: 'scroll' (default) or 'typewriter'
        this.style = params.style || 'scroll';
        this.waitAfterType = 2000; // タイプ完了後の待機時間（typewriter用）

        this.charIndex = 0;
        this.isTyping = false;
        this.isComplete = false;
        this.typeTimer = null;

        // 初期状態のテキスト処理
        if (gameObject.type === 'Container') {
            this.textObject = gameObject.list.find(obj => obj.type === 'Text');
        } else if (gameObject.type === 'Text') {
            this.textObject = gameObject;
        }

        if (this.textObject) {
            this.textObject.setText("");
        }

        // シーンの更新ループに登録
        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.add(this);
        }
    }

    start() {
        this.startTyping();
    }

    startTyping() {
        if (this.typeTimer) this.typeTimer.remove();

        this.isTyping = true;
        this.typeTimer = this.scene.time.addEvent({
            delay: this.typingSpeed,
            callback: this.typeNextChar,
            callbackScope: this,
            loop: true
        });
    }

    typeNextChar() {
        if (this.scene.isPaused || !this.gameObject || !this.gameObject.active) {
            if (this.typeTimer) this.typeTimer.remove();
            return;
        }

        if (this.charIndex < this.fullText.length) {
            this.charIndex++;
            const visibleText = this.fullText.substring(0, this.charIndex);

            if (this.textObject && this.textObject.active) {
                this.textObject.setText(visibleText);
            }

            // タイプ音再生
            this.playTypeSound();
        } else {
            this.isTyping = false;
            this.isComplete = true;
            if (this.typeTimer) this.typeTimer.remove();

            // ★ typewriterモードの場合、完了後に一定時間待って消える
            if (this.style === 'typewriter' && this.gameObject && this.gameObject.active) {
                this.scene.time.delayedCall(this.waitAfterType, () => {
                    if (this.gameObject && this.gameObject.active) {
                        this.onExitScreen();
                    }
                });
            }
        }
    }

    playTypeSound() {
        const systemScene = this.scene.scene.get('SystemScene');
        const soundManager = systemScene?.registry.get('soundManager');
        if (soundManager) {
            soundManager.playSe('popopo');
        }
    }

    update(time, delta) {
        if (this.scene.isPaused || !this.gameObject || !this.gameObject.active) return;

        // ★ scrollモードのみ移動する
        if (this.style === 'scroll') {
            // 横移動
            this.gameObject.x -= (this.moveSpeed * delta) / 1000;

            // 画面外判定
            if (this.gameObject.x < -1200) { // 十分に左へ
                this.onExitScreen();
            }
        }
    }

    onExitScreen() {
        // ★ 修正：ループさせず、破棄する（Manager側が新しいものを生成するため）
        this.gameObject.destroy();
    }

    destroy() {
        if (this.typeTimer) this.typeTimer.remove();
        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.delete(this);
        }
    }
}
