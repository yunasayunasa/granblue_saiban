/**
 * [slash] タグ - 斬撃エフェクト
 *
 * 画面に斜め線を素早く描画してフェードアウトさせる演出です。
 * 戦闘シーンや衝撃的な場面で使用します。
 *
 * @param {ScenarioManager} manager
 * @param {object} params
 * @param {number} [params.count=3]       - 斬撃線の本数
 * @param {string} [params.color='ffffff'] - 線の色 (16進数)
 * @param {number} [params.time=400]      - 総演出時間(ms)
 * @param {string} [params.wait='true']   - 完了まで待つか
 */
export default async function handleSlash(manager, params) {
    const {
        count = 3,
        color = 'ffffff',
        time = 400,
        wait = 'true',
    } = params;

    const scene = manager.scene;
    const cam = scene.cameras.main;
    const W = cam.width;
    const H = cam.height;
    const colorInt = parseInt(String(color).replace(/^#/, ''), 16);
    const duration = Number(time);
    const lineCount = Number(count);

    const container = scene.add.container(0, 0);
    container.setDepth(9999);

    // キャラクターレイヤーより手前に配置
    if (manager.layers && manager.layers.character) {
        // character layerのdepth+1に設定
        const charDepth = manager.layers.character.depth || 0;
        container.setDepth(charDepth + 100);
    }

    const graphics = scene.add.graphics();
    container.add(graphics);

    // 各斬撃線の描画
    for (let i = 0; i < lineCount; i++) {
        const offsetX = (i - Math.floor(lineCount / 2)) * 60;
        const startX = W * 0.3 + offsetX;
        const startY = 0;
        const endX = W * 0.7 + offsetX;
        const endY = H;

        graphics.lineStyle(6 - i, colorInt, 1.0);
        graphics.beginPath();
        graphics.moveTo(startX, startY);
        graphics.lineTo(endX, endY);
        graphics.strokePath();
    }

    // 白フラッシュ後にフェードアウト
    const promise = new Promise(resolve => {
        // 瞬間フラッシュ（明るく）
        scene.tweens.add({
            targets: graphics,
            alpha: { from: 1, to: 0 },
            duration: duration,
            ease: 'Power2',
            onComplete: () => {
                graphics.destroy();
                container.destroy();
                resolve();
            }
        });

        // カメラの一瞬の明滅
        scene.cameras.main.flash(80, 255, 255, 255);
    });

    if (wait !== 'false') {
        await promise;
    }
}
