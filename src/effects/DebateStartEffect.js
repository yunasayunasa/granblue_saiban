/**
 * 議論開始演出 (DebateStartEffect)
 * 画像アセット不要。Phaserのグラフィックスのみで構成。
 *
 * START: 上下から帯が閉じてテキストが出現 → フラッシュで消える
 * LOOP:  同様の演出だがアクセントカラーが変わる
 */
export default class DebateStartEffect extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;
        this.visible = false;
        this.depth = 3500;
        this.scene.add.existing(this);
    }

    play(text = 'START', onComplete) {
        const W = this.scene.scale.width;
        const H = this.scene.scale.height;

        const isLoop = (text === 'LOOP');
        // START: クリムゾン / LOOP: ダークオレンジ
        const bandColor  = isLoop ? 0xcc5500 : 0xaa0000;
        const labelJP    = isLoop ? '議　論　ループ' : '議　論　開　始';
        const labelEN    = isLoop ? 'BREAKDOWN' : 'DEBATE START';

        this.setVisible(true);
        this.alpha = 1;

        // --- 暗転オーバーレイ ---
        const overlay = this.scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0)
            .setScrollFactor(0).setDepth(3498);
        this.add(overlay);

        // --- 帯（上下2枚） ---
        const bandH = 130;
        const bandY = H / 2;
        const topBand = this.scene.add.rectangle(W / 2, bandY - bandH, W, bandH, bandColor)
            .setScrollFactor(0).setDepth(3499);
        const botBand = this.scene.add.rectangle(W / 2, bandY + bandH, W, bandH, bandColor)
            .setScrollFactor(0).setDepth(3499);
        this.add(topBand);
        this.add(botBand);

        // --- テキスト ---
        const mainText = this.scene.add.text(W / 2, H / 2, labelJP, {
            fontSize: '52px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            fontFamily: 'serif'
        }).setOrigin(0.5).setAlpha(0).setScrollFactor(0).setDepth(3500);

        const subText = this.scene.add.text(W / 2, H / 2 + 48, labelEN, {
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#ffddaa',
            stroke: '#000000',
            strokeThickness: 4,
            fontFamily: 'sans-serif',
            letterSpacing: 6
        }).setOrigin(0.5).setAlpha(0).setScale(2).setScrollFactor(0).setDepth(3500);

        this.add(mainText);
        this.add(subText);

        // SE
        if (this.scene.cache.audio.has('smash')) {
            this.scene.sound.play('smash', { volume: 0.8 });
        }

        // === アニメーション ===
        // 1. 暗転 (0ms)
        this.scene.tweens.add({ targets: overlay, alpha: 0.75, duration: 120 });

        // 2. 帯がスライドイン (0ms)
        this.scene.tweens.add({
            targets: topBand, y: bandY - bandH / 2,
            duration: 180, ease: 'Power2.easeOut'
        });
        this.scene.tweens.add({
            targets: botBand, y: bandY + bandH / 2,
            duration: 180, ease: 'Power2.easeOut',
            onComplete: () => {
                // カメラシェイク
                this.scene.cameras.main.shake(250, 0.015);

                // 3. テキストイン (180ms)
                this.scene.tweens.add({
                    targets: mainText, alpha: 1, duration: 150
                });
                this.scene.tweens.add({
                    targets: subText, alpha: 1, scale: 1,
                    duration: 250, ease: 'Back.easeOut'
                });

                // 4. 全体フェードアウト (900ms後)
                this.scene.time.delayedCall(900, () => {
                    this.scene.cameras.main.flash(120, 255, 255, 255);
                    this.scene.tweens.add({
                        targets: [overlay, topBand, botBand, mainText, subText],
                        alpha: 0,
                        duration: 200,
                        onComplete: () => {
                            [overlay, topBand, botBand, mainText, subText]
                                .forEach(obj => obj.destroy());
                            this.removeAll(false);
                            this.setVisible(false);
                            if (onComplete) onComplete();
                        }
                    });
                });
            }
        });
    }
}
