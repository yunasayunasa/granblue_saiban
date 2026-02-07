/**
 * 証拠品選択オーバーレイ (UI)
 * - 下部にリスト
 * - 左に拡大画像
 * 
 * - 右に説明
 */
export default class EvidenceSelectOverlay extends Phaser.GameObjects.Container {
    constructor(scene, evidenceManager) {
        super(scene, 0, 0);
        this.scene = scene;
        this.evidenceManager = evidenceManager;
        
        // 画面サイズショートカット
        this.width = scene.scale.width;
        this.height = scene.scale.height;

        this.visible = false;
        this.depth = 3000; // 最前面

        this.onPresent = null; // 提示時のコールバック
        this.isModePresent = false; // 「提示」モードか「閲覧」モードか

        this._createUI();
        this.scene.add.existing(this);
    }

    _createUI() {
        // 1. 背景 (半透明の黒)
        this.bg = this.scene.add.rectangle(this.width/2, this.height/2, this.width, this.height, 0x000000, 0.85);
        this.bg.setInteractive(); // 下の要素をクリックさせない
        this.add(this.bg);

        // 2. ブロッカー (閉じる用) - 右上の×ボタンなど
        const closeBtn = this.scene.add.text(this.width - 50, 50, '×', { fontSize: '48px', color: '#ffffff' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.hide());
        this.add(closeBtn);

        // 3. 左側: 拡大画像エリア
        // Texture key cannot be null. Use empty string or a valid placeholder.
        this.largeImage = this.scene.add.image(300, 300, ''); 
        // this.largeImage.setMaxSize(400, 400); // setMaxSize might fail if texture is invalid/empty frame, so do it later or check safely
        this.largeImage.setVisible(false); // Initially hidden
        this.add(this.largeImage);
        
        // 4. 右側: 説明エリア
        this.descContainer = this.scene.add.container(600, 100);
        this.titleText = this.scene.add.text(0, 0, '', { fontSize: '40px', color: '#ffcc00', fontStyle: 'bold' });
        this.descText = this.scene.add.text(0, 60, '', { fontSize: '24px', color: '#ffffff', wordWrap: { width: 600 } });
        this.descContainer.add([this.titleText, this.descText]);
        this.add(this.descContainer);

        // 5. 提示ボタン (最初は非表示)
        this.presentBtn = this.scene.add.text(300, 550, 'つきつける', {
            fontSize: '32px', padding: { x: 20, y: 10 }, color: '#ffffff', backgroundColor: '#aa0000'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setVisible(false)
        .on('pointerdown', () => this._onPresentBtnClicked());
        this.add(this.presentBtn);

        // 6. 下部: リストエリア (スクロールコンテナは複雑なので、一旦簡易的なページングか、コンテナ並べで実装)
        // 今回は物理的に並べる（数が少ない前提）
        this.listContainer = this.scene.add.container(0, this.height - 150);
        // 背景帯
        const listBg = this.scene.add.rectangle(this.width/2, 75, this.width, 150, 0x222222);
        this.listContainer.add(listBg);
        this.add(this.listContainer);

        this.selectedId = null;
    }

    show(mode = 'view', onPresentCallback = null) {
        console.log(`[EvidenceSelectOverlay] show called. Mode: ${mode}`);
        this.setVisible(true);
        this.isModePresent = (mode === 'present');
        this.onPresent = onPresentCallback;

        // ★ 一時停止 (シーン全体をポーズ)
        if (this.scene.setPause) {
            this.scene.setPause(true);
        }

        // ボタン表示切り替え
        this.presentBtn.setVisible(this.isModePresent);

        // リスト更新
        this._refreshList();

        // 最初のアイテムを選択（なければ空）
        const allItems = this.evidenceManager.getAllPossessedEvidence();
        if (allItems.length > 0) {
            this._selectItem(allItems[0]);
        } else {
            this._clearDetail();
        }

        // 簡易アニメーション
        this.alpha = 0;
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 200
        });
    }

    hide() {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                this.setVisible(false);
                // コールバック解除
                this.onPresent = null;
                // ★ イベント発火
                this.emit('CLOSE_OVERLAY');
            }
        });
    }

    _refreshList() {
        // リストクリア
        this.listContainer.each(child => {
            if (child.type === 'Container') child.destroy(); // アイコンコンテナのみ消す
        });

        const items = this.evidenceManager.getAllPossessedEvidence();
        const startX = 100;
        const gap = 120;

        items.forEach((item, index) => {
            const x = startX + (index * gap);
            const y = 75; // listContainer内のY

            const iconContainer = this.scene.add.container(x, y);
            
            // アイコン枠
            const frame = this.scene.add.rectangle(0, 0, 100, 100, 0x444444).setStrokeStyle(2, 0xffffff);
            
            // アイコン画像 (アセットがロードされている前提、なければ文字)
            let icon;
            if (this.scene.textures.exists(item.icon)) {
                icon = this.scene.add.image(0, 0, item.icon).setDisplaySize(80, 80);
            } else {
                icon = this.scene.add.text(0, 0, '?', { fontSize: '32px' }).setOrigin(0.5);
            }

            iconContainer.add([frame, icon]);
            iconContainer.setSize(100, 100);
            iconContainer.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this._selectItem(item));

            this.listContainer.add(iconContainer);
        });
    }

    _selectItem(item) {
        this.selectedId = item.id;

        // 詳細表示更新
        this.titleText.setText(item.name);
        this.descText.setText(item.description);

        if (this.scene.textures.exists(item.image)) {
            this.largeImage.setTexture(item.image);
            this.largeImage.setDisplaySize(400, 400); // アスペクト比維持しつつ最大化が良いが簡易実装
            this.largeImage.setVisible(true);
        } else {
            this.largeImage.setVisible(false);
        }
    }

    _clearDetail() {
        this.selectedId = null;
        this.titleText.setText('');
        this.descText.setText('証拠品を持っていません。');
        this.largeImage.setVisible(false);
    }

    _onPresentBtnClicked() {
        if (this.selectedId && this.onPresent) {
            this.onPresent(this.selectedId);
            this.hide();
        }
    }
}
