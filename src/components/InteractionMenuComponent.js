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
        // 通常は600px、戻るボタンは半分の300px
        const bgW = isBack ? 300 : 600;
        const bgH = isBack ? 50 : 100;
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

        // --- 2. テキスト (通常は巨大、戻るは半分) ---
        const fontSize = isBack ? '32px' : '64px';
        const btnText = this.scene.add.text(0, 0, choice.text, {
            fontSize: fontSize,
            color: '#ffffff',
            fontFamily: '"Times New Roman", "MS PMincho", serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(btnText);

        // --- 3. インタラクション ---
        container.setSize(bgW, bgH);
        container.setInteractive(new Phaser.Geom.Ellipse(0, 0, bgW, bgH), Phaser.Geom.Ellipse.Contains);
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
