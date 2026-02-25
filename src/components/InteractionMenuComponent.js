/**
 * 裁判中のインタラクション（選択肢）メニューを表示するコンポーネント。
 * 選択肢は縦に並べて表示。重なりと見切れを防ぐため、ボタン数に応じてY座標を調整。
 */
export default class InteractionMenuComponent {
    constructor(scene, gameObject, params) {
        this.scene = scene;
        this.gameObject = gameObject;
        this.menuItems = [];
        this.onSelection = params.onSelection || null;

        this.gameObject.setVisible(false);

        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.add(this);
        }
    }

    show(highlightData) {
        // 既存の子要素を破棄
        if (typeof this.gameObject.removeAll === 'function') {
            this.gameObject.removeAll(true);
        } else if (this.gameObject.list) {
            while (this.gameObject.list.length > 0) {
                this.gameObject.list[0].destroy();
            }
        }

        this.gameObject.setVisible(true);

        if (!highlightData) {
            console.error('[InteractionMenu] highlightData is missing!');
            return;
        }

        const choices = highlightData.choices || [];
        if (choices.length === 0) {
            console.warn('[InteractionMenu] No choices defined.');
        }

        // ボタン定義 (選択肢 + 戻るボタン)
        const allButtons = [...choices, { text: '戻る', isBack: true }];
        const BTN_H = 100;         // ボタン高さ (通常)
        const BACK_H = 60;         // 戻るボタン高さ
        const SPACING = 20;        // ボタン間の余白

        // 総高さを計算してY開始位置を決定（画面中央から上に寄せる）
        const normalCount = choices.length;
        const totalH = normalCount * BTN_H + BACK_H + (allButtons.length - 1) * SPACING;
        let currentY = -totalH / 2;

        allButtons.forEach((choice) => {
            const btnH = choice.isBack ? BACK_H : BTN_H;
            const centerY = currentY + btnH / 2;
            this.createChoiceButton(choice, centerY);
            currentY += btnH + SPACING;
        });
    }

    createChoiceButton(choice, centerY) {
        const isBack = choice.isBack || false;

        const container = this.scene.add.container(0, centerY);

        // ボタンサイズ
        const bgW = isBack ? 260 : 580;
        const bgH = isBack ? 60 : 100;

        const bg = this.scene.add.graphics();

        const drawBg = (color, alpha) => {
            bg.clear();
            bg.fillStyle(color, alpha);
            bg.fillRoundedRect(-bgW / 2, -bgH / 2, bgW, bgH, 14);
            bg.lineStyle(isBack ? 1 : 2, 0xffffff, isBack ? 0.3 : 0.7);
            bg.strokeRoundedRect(-bgW / 2, -bgH / 2, bgW, bgH, 14);
        };

        drawBg(isBack ? 0x111111 : 0x000033, isBack ? 0.6 : 0.85);
        container.add(bg);

        // テキスト
        const fontSize = isBack ? '26px' : '40px';
        const btnText = this.scene.add.text(0, 0, choice.text, {
            fontSize: fontSize,
            color: isBack ? '#aaaaaa' : '#ffffff',
            fontFamily: '"Times New Roman", "MS PMincho", serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        container.add(btnText);

        // インタラクション (矩形ヒットエリア)
        container.setInteractive(
            new Phaser.Geom.Rectangle(-bgW / 2, -bgH / 2, bgW, bgH),
            Phaser.Geom.Rectangle.Contains
        );
        container.input.useHandCursor = true;

        container.on('pointerover', () => {
            drawBg(isBack ? 0x333333 : 0x001166, isBack ? 0.8 : 0.95);
            btnText.setScale(1.04);
        });

        container.on('pointerout', () => {
            drawBg(isBack ? 0x111111 : 0x000033, isBack ? 0.6 : 0.85);
            btnText.setScale(1.0);
        });

        container.on('pointerdown', () => {
            console.log('[InteractionMenu] Selected:', choice.text);
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
