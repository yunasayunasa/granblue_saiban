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
        const isBack = choice.isBack || false;
        const spacing = 120;
        const y = index * spacing;

        const container = this.scene.add.container(0, y);

        // --- 1. 土台 (楕円) ---
        // 通常: 600x140、戻る: 300x70
        const bgW = isBack ? 300 : 600;
        const bgH = isBack ? 70 : 140;
        const bg = this.scene.add.graphics();

        const drawBg = (color, alpha) => {
            bg.clear();
            bg.fillStyle(color, alpha);
            bg.fillEllipse(0, 0, bgW, bgH);
            // 枠線
            bg.lineStyle(isBack ? 2 : 3, 0xffffff, 0.4);
            bg.strokeEllipse(0, 0, bgW, bgH);
        };

        drawBg(0x000000, 0.7);
        container.add(bg);

        // --- 2. テキスト (通常: 48px、戻る: 28px) ---
        const fontSize = isBack ? '28px' : '48px';
        const btnText = this.scene.add.text(0, 0, choice.text, {
            fontSize: fontSize,
            color: '#ffffff',
            fontFamily: '"Times New Roman", "MS PMincho", serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(btnText);

        // --- 3. インタラクション ---
        // ★ 修正: Ellipse のパラメータは半径 (radiusX, radiusY) が必要
        container.setSize(bgW, bgH);
        const hitEllipse = new Phaser.Geom.Ellipse(0, 0, bgW / 2, bgH / 2);
        container.setInteractive(hitEllipse, Phaser.Geom.Ellipse.Contains);
        container.input.useHandCursor = true;

        container.on('pointerover', () => {
            drawBg(0x000033, 0.9);
            btnText.setScale(1.05);
        });

        container.on('pointerout', () => {
            drawBg(0x000000, 0.7);
            btnText.setScale(1.0);
        });

        container.on('pointerdown', () => {
            console.log('[InteractionMenu] Selected:', choice);
            this.hide();
            if (this.onSelection) {
                this.onSelection(choice);
            }
        });

        this.gameObject.add(container);
    }

    hide() {
        this.gameObject.setVisible(false);
    }
}
