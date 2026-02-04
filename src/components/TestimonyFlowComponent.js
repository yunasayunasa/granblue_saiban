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
        if (this.scene.isPaused) return;

        if (this.charIndex < this.fullText.length) {
            this.charIndex++;
            const visibleText = this.fullText.substring(0, this.charIndex);

            if (this.textObject) {
                this.textObject.setText(visibleText);
            }

            // タイプ音再生
            this.playTypeSound();
        } else {
            this.isTyping = false;
            this.isComplete = true;
            if (this.typeTimer) this.typeTimer.remove();
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
        if (this.scene.isPaused) return;

        // 横移動
        this.gameObject.x -= (this.moveSpeed * delta) / 1000;

        // 画面外判定
        if (this.gameObject.x < -1200) { // 十分に左へ
            this.onExitScreen();
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
