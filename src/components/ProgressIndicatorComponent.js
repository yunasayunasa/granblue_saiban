/**
 * 証言が変化した際などに「議論進行…」というメッセージを表示するコンポーネント。
 */
export default class ProgressIndicatorComponent {
    constructor(scene, gameObject, params) {
        this.scene = scene;
        this.gameObject = gameObject; // テキストオブジェクト
        this.gameObject.setVisible(false);

        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.add(this);
        }
    }

    show(message = "議論進行…", duration = 2000) {
        console.log('[ProgressIndicator] show called. gameObject type:', this.gameObject.type, this.gameObject);
        let textObj = null;
        if (this.gameObject.setText) {
            textObj = this.gameObject;
        } else if (this.gameObject.list) {
            // Container の場合は子要素から Text を探す
            textObj = this.gameObject.list.find(child => child.setText || child.type === 'Text' || child.type === 'BitmapText');
        }
        
        // ★ 追加: テキストが見つからない場合のフォールバック (GameObject自体が実はTextっぽい何かだった場合)
        if (!textObj && this.gameObject.text !== undefined) {
             // setTextメソッドがないがtextプロパティがある場合(稀だが)
             textObj = this.gameObject;
        }

        if (textObj) {
            textObj.setText(message);
        } else {
            console.warn('[ProgressIndicator] No text object found to set message:', message);
        }

        this.gameObject.setVisible(true);
        this.gameObject.setAlpha(0);

        // フェードイン・アウトのアニメーション
        this.scene.tweens.add({
            targets: this.gameObject,
            alpha: 1,
            duration: 500,
            yoyo: true,
            hold: duration,
            onComplete: () => {
                this.gameObject.setVisible(false);
                this.scene.events.emit('PROGRESS_INDICATOR_COMPLETE');
            }
        });
    }
}
