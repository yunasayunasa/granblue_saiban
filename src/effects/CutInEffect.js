/**
 * カットイン演出 (論破時など)
 * キャラクター画像（yuna_normal）が画面外からスライドインし、停止してからフェードアウトする。
 */
export default class CutInEffect extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;
        this.visible = false;
        this.depth = 4000; // 最前面

        this._createGraphics();
        this.scene.add.existing(this);
    }

    _createGraphics() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        // 背景エフェクト (集中線的なものや、背景暗転)
        this.bg = this.scene.add.rectangle(width/2, height/2, width, height, 0x000000, 0.0);
        this.add(this.bg);

        // キャラクター画像 (仮: yuna_normal)
        // 右側からスライドインさせる想定
        if (this.scene.textures.exists('yuna_normal')) {
            this.charaInfo = { key: 'yuna_normal' };
        } else {
            // テクスチャがない場合のフォールバック
            this.charaInfo = null;
        }

        this.charaImage = this.scene.add.image(width + 400, height/2, this.charaInfo ? this.charaInfo.key : null);
        if (!this.charaInfo) {
             // テクスチャがない場合、文字で代用
             this.fallbackText = this.scene.add.text(width + 400, height/2, "BREAK!!", { 
                 fontSize: '120px', fontStyle: 'bold', color: '#ff0000', stroke: '#ffffff', strokeThickness: 10
             }).setOrigin(0.5);
             this.add(this.fallbackText);
             this.targetObj = this.fallbackText;
        } else {
             this.charaImage.setScale(1.5); // 少し大きめに
             this.add(this.charaImage);
             this.targetObj = this.charaImage;
        }
        
        // 「論破」文字など
    }

    play(onComplete) {
        this.setVisible(true);
        this.bg.alpha = 0;
        
        // 位置リセット
        const width = this.scene.scale.width;
        this.targetObj.x = width + 500;
        this.targetObj.alpha = 1;

        const timeline = this.scene.tweens.createTimeline();

        // 1. 暗転 & スライドイン (高速)
        timeline.add({
            targets: this.bg,
            alpha: 0.7,
            duration: 200,
            offset: 0
        });
        timeline.add({
            targets: this.targetObj,
            x: width / 2,
            ease: 'Power2',
            duration: 300,
            offset: 0
        });

        // 2. 停止 (決めポーズ)
        timeline.add({
            targets: this.targetObj,
            scaleX: 1.6, // 少しズーム
            scaleY: 1.6,
            duration: 1000,
            offset: 300
        });

        // 3. フェードアウト
        timeline.add({
            targets: [this.targetObj, this.bg],
            alpha: 0,
            x: -500, // 左へ抜ける
            duration: 400,
            offset: 1300,
            onComplete: () => {
                this.setVisible(false);
                if (onComplete) onComplete();
            }
        });

        timeline.play();
    }
}
