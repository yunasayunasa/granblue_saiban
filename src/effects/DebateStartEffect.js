/**
 * 議論開始演出 (DebateStartEffect)
 * 画像 (cg_01) を使用して「ノンストップ議論 開始」的なバナーを表示する。
 */
export default class DebateStartEffect extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;
        this.visible = false;
        this.depth = 3500;

        this._createGraphics();
        this.scene.add.existing(this);
    }

    _createGraphics() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        // 画像 (仮: cg_01)
        if (this.scene.textures.exists('cg_01')) {
            this.bgImage = this.scene.add.image(width/2, height/2, 'cg_01');
            // 画面幅に合わせる、あるいは帯状にする
            this.bgImage.setDisplaySize(width, height / 3); 
        } else {
            // フォールバック: 赤い帯
            this.bgImage = this.scene.add.rectangle(width/2, height/2, width, 300, 0xaa0000);
        }
        this.add(this.bgImage);

        // テキスト
        this.text = this.scene.add.text(width/2, height/2, "NON-STOP DEBATE", {
            fontSize: '80px', fontStyle: 'bold', color: '#ffffff', stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);
        this.add(this.text);

        this.subText = this.scene.add.text(width/2, height/2 + 60, "START", {
            fontSize: '60px', fontStyle: 'bold', color: '#ffff00', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);
        this.add(this.subText);
    }

    play(text = "START", onComplete) {
        this.setVisible(true);
        this.subText.setText(text);

        const width = this.scene.scale.width;

        // 初期状態
        this.bgImage.scaleY = 0;
        this.text.alpha = 0;
        this.subText.alpha = 0;
        this.subText.scale = 2;
        this.alpha = 1; // フェードアウトからの復帰用

        // 1. 帯が開く (0ms)
        this.scene.tweens.add({
            targets: this.bgImage,
            scaleY: 1,
            duration: 300,
            ease: 'Back.out'
        });

        // 2. テキストイン (200ms)
        this.scene.tweens.add({
            targets: this.text,
            alpha: 1,
            x: width/2,
            duration: 300,
            delay: 200
        });

        // 3. STARTスタンプ (400ms)
        this.scene.tweens.add({
            targets: this.subText,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Bounce.out',
            delay: 400
        });

        // 4. フェードアウト (1800ms - 待ち時間含む)
        // 元のタイムラインでは offset:800 で 1000ms 待機 -> 1300?? 
        // 意図としては、全部出切ってから少し待って消える。
        // スタンプ完了が 400+400=800ms。そこから1秒待つなら1800msあたりでフェードアウト開始。
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 300,
            delay: 1800,
            onComplete: () => {
                this.setVisible(false);
                this.alpha = 1; 
                if (onComplete) onComplete();
            }
        });
    }
}
