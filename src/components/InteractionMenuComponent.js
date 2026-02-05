/**
 * 裁判中のインタラクション（反論/賛成/疑問）メニューを表示するコンポーネント。
 */
export default class InteractionMenuComponent {
    constructor(scene, gameObject, params) {
        this.scene = scene;
        this.gameObject = gameObject; // 通常、メニュー用のContainer
        this.menuItems = [];
        this.onSelection = params.onSelection || null;

        this.gameObject.setVisible(false);

        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.add(this);
        }
    }

    show(highlightData) {
        // ★ 修正: removeAllが使えない場合を考慮し、手動で子要素を破棄
        if (typeof this.gameObject.removeAll === 'function') {
            this.gameObject.removeAll(true);
        } else if (this.gameObject.list) {
            // Containerのlistプロパティを直接操作して破棄
            while (this.gameObject.list.length > 0) {
                const child = this.gameObject.list[0];
                child.destroy();
            }
        }

        this.gameObject.setVisible(true);

        this.gameObject.setVisible(true);

        if (!highlightData) {
            console.error('[InteractionMenu] highlightData is missing!');
            return;
        }

        const choices = highlightData.choices || [];
        if (choices.length === 0) {
            console.warn('[InteractionMenu] No choices defined.');
            // デフォルトを入れるか、何もしないか。ここではスキップ
        }

        choices.forEach((choice, index) => {
            this.createChoiceButton(choice, index);
        });

        // ★ 修正: 「戻る」ボタンを追加
        this.createChoiceButton({
            text: "戻る",
            isBack: true
        }, choices.length);

        // 背景などの装飾
        // ...
    }

    createChoiceButton(choice, index) {
        const y = index * 60;
        const btn = this.scene.add.text(0, y, choice.text, {
            fontSize: '24px',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });

        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => {
            this.hide();
            if (this.onSelection) {
                this.onSelection(choice);
            }
        });

        this.gameObject.add(btn);
    }

    hide() {
        this.gameObject.setVisible(false);
    }
}
