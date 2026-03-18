/**
 * 証拠品選択オーバーレイ (UI)
 * - 下部にリスト
 * - 左に拡大画像
 * - 右に説明
 */
export default class EvidenceSelectOverlay extends Phaser.GameObjects.Container {
    constructor(scene, evidenceManager) {
        super(scene, 0, 0);
        this.scene = scene;
        this.evidenceManager = evidenceManager;

        this.W = scene.scale.width;
        this.H = scene.scale.height;

        this.visible = false;
        this.depth = 3000;

        this.onPresent = null;
        this.isModePresent = false;
        this.selectedId = null;

        this._createUI();
        this.scene.add.existing(this);
    }

    _createUI() {
        const W = this.W;
        const H = this.H;

        // 背景 (半透明の黒)
        this.bg = this.scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.88);
        this.bg.setInteractive();
        this.add(this.bg);

        // タイトル帯
        const titleBg = this.scene.add.rectangle(W / 2, 40, W, 80, 0x001144, 1);
        this.add(titleBg);
        this.titleLabel = this.scene.add.text(W / 2, 40, '証拠品ファイル', {
            fontSize: '32px', color: '#ffcc00', fontStyle: 'bold', fontFamily: 'serif'
        }).setOrigin(0.5);
        this.add(this.titleLabel);

        // ×ボタン (閲覧モード時のみ表示)
        this.closeBtn = this.scene.add.text(W - 50, 40, '×', {
            fontSize: '48px', color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.hide());
        this.add(this.closeBtn);

        // 戻るボタン (提示モード時のみ表示)
        this.backBtn = this.scene.add.text(60, 40, '◀ 戻る', {
            fontSize: '28px', color: '#aaaaaa', fontFamily: 'serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.hide());
        this.add(this.backBtn);

        // 左側: 拡大画像エリア (x:50~380, y:100~520)
        const imgFrameBg = this.scene.add.rectangle(215, 320, 330, 420, 0x111133).setStrokeStyle(2, 0x334488);
        this.add(imgFrameBg);
        this.largeImage = this.scene.add.image(215, 310, '__DEFAULT');
        this.largeImage.setVisible(false);
        this.add(this.largeImage);

        // 右側: 説明エリア (x:420~)
        this.itemName = this.scene.add.text(420, 110, '', {
            fontSize: '38px', color: '#ffcc00', fontStyle: 'bold', fontFamily: 'serif'
        });
        this.add(this.itemName);

        this.itemDesc = this.scene.add.text(420, 165, '', {
            fontSize: '24px', color: '#dddddd', wordWrap: { width: W - 450 }, fontFamily: 'serif', lineSpacing: 6
        });
        this.add(this.itemDesc);

        // 「つきつける」ボタン
        this.presentBtn = this.scene.add.text(W / 2, H - 185, 'つきつける！', {
            fontSize: '36px', padding: { x: 40, y: 14 },
            color: '#ffffff', backgroundColor: '#880000',
            fontStyle: 'bold', fontFamily: 'serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true })
            .setVisible(false)
            .on('pointerover', () => this.presentBtn.setStyle({ backgroundColor: '#cc0000' }))
            .on('pointerout', () => this.presentBtn.setStyle({ backgroundColor: '#880000' }))
            .on('pointerdown', () => this._onPresentBtnClicked());
        this.add(this.presentBtn);

        // 下部リストエリア
        const listAreaY = H - 150;
        const listBg = this.scene.add.rectangle(W / 2, listAreaY + 75, W, 150, 0x111122).setStrokeStyle(1, 0x334488, 0.5);
        this.add(listBg);

        this.listContainer = this.scene.add.container(0, listAreaY);
        this.add(this.listContainer);
    }

    show(mode = 'view', onPresentCallback = null) {
        this.setVisible(true);
        this.isModePresent = (mode === 'present');
        this.onPresent = onPresentCallback;

        // ボタン表示切り替え
        this.presentBtn.setVisible(this.isModePresent);
        this.closeBtn.setVisible(!this.isModePresent);
        this.backBtn.setVisible(this.isModePresent);
        this.titleLabel.setText(this.isModePresent ? '証拠品をつきつけろ！' : '証拠品ファイル');

        this._refreshList();

        const allItems = this.evidenceManager.getAllPossessedEvidence();
        if (allItems.length > 0) {
            this._selectItem(allItems[0]);
        } else {
            this._clearDetail();
        }

        this.alpha = 0;
        this.scene.tweens.add({ targets: this, alpha: 1, duration: 200 });
    }

    hide() {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                this.setVisible(false);
                this.onPresent = null;
                // ポーズ解除を確実に実行
                if (this.scene.setPause) {
                    this.scene.setPause(false);
                }
                this.emit('CLOSE_OVERLAY');
            }
        });
    }

    _refreshList() {
        // リストクリア
        this.listContainer.removeAll(true);

        const items = this.evidenceManager.getAllPossessedEvidence();
        const ICON_SIZE = 110;
        const GAP = 10;
        const startX = 60;

        items.forEach((item, index) => {
            const x = startX + index * (ICON_SIZE + GAP);
            const y = 75;

            const iconContainer = this.scene.add.container(x, y);

            // 選択枠 (選択中: ゴールド、非選択: グレー)
            const isSelected = (item.id === this.selectedId);
            const frame = this.scene.add.rectangle(0, 0, ICON_SIZE, ICON_SIZE, isSelected ? 0x443300 : 0x333344)
                .setStrokeStyle(isSelected ? 3 : 1, isSelected ? 0xffcc00 : 0x666688);

            let icon;
            if (item.icon && this.scene.textures.exists(item.icon)) {
                icon = this.scene.add.image(0, -10, item.icon).setDisplaySize(80, 80);
            } else {
                icon = this.scene.add.text(0, -10, '?', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5);
            }

            const nameText = this.scene.add.text(0, 42, item.name, {
                fontSize: '14px', color: '#cccccc', fontFamily: 'serif'
            }).setOrigin(0.5);

            iconContainer.add([frame, icon, nameText]);
            iconContainer.setSize(ICON_SIZE, ICON_SIZE);
            iconContainer.setInteractive({ useHandCursor: true })
                .on('pointerover', () => { if (item.id !== this.selectedId) frame.setStrokeStyle(2, 0x8888cc); })
                .on('pointerout', () => { if (item.id !== this.selectedId) frame.setStrokeStyle(1, 0x666688); })
                .on('pointerdown', () => this._selectItem(item));

            this.listContainer.add(iconContainer);
        });
    }

    _selectItem(item) {
        this.selectedId = item.id;
        this.itemName.setText(item.name);
        this.itemDesc.setText(item.description);

        if (item.image && this.scene.textures.exists(item.image)) {
            this.largeImage.setTexture(item.image);
            // アスペクト比を維持して最大300x380に収める
            const tex = this.scene.textures.get(item.image).getSourceImage();
            const maxW = 300, maxH = 380;
            const ratio = Math.min(maxW / tex.width, maxH / tex.height);
            this.largeImage.setScale(ratio);
            this.largeImage.setVisible(true);
        } else {
            this.largeImage.setVisible(false);
        }

        // リストのハイライトを更新
        this._refreshList();
    }

    _clearDetail() {
        this.selectedId = null;
        this.itemName.setText('');
        this.itemDesc.setText('証拠品を持っていません。');
        this.largeImage.setVisible(false);
    }

    _onPresentBtnClicked() {
        if (this.selectedId && this.onPresent) {
            const callback = this.onPresent;
            this.hide();
            // hide()のtween完了後にコールバック（ポーズ解除後）
            this.scene.time.delayedCall(220, () => callback(this.selectedId));
        }
    }
}
