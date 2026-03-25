/**
 * [focus] タグ - 集中線エフェクト
 *
 * 画面中心から放射状に線を描いてフェードアウトさせる演出です。
 * ギャグシーン・衝撃シーン・驚きのシーンで使用します。
 *
 * @param {ScenarioManager} manager
 * @param {object} params
 * @param {number} [params.lines=24]      - 線の本数
 * @param {string} [params.color='ffffff'] - 線の色 (16進数)
 * @param {number} [params.time=600]      - 総演出時間(ms)
 * @param {number} [params.cx]            - 中心X (省略時は画面中央)
 * @param {number} [params.cy]            - 中心Y (省略時は画面中央)
 * @param {string} [params.wait='true']   - 完了まで待つか
 */
export default async function handleFocus(manager, params) {
    const {
        lines = 24,
        color = 'ffffff',
        time = 600,
        wait = 'true',
    } = params;

    const scene = manager.scene;
    const cam = scene.cameras.main;
    const W = cam.width;
    const H = cam.height;
    const cx = params.cx !== undefined ? Number(params.cx) : W / 2;
    const cy = params.cy !== undefined ? Number(params.cy) : H / 2;
    const colorInt = parseInt(String(color).replace(/^#/, ''), 16);
    const duration = Number(time);
    const lineCount = Number(lines);

    // 集中線の最大半径（画面対角線長より大きく）
    const maxRadius = Math.sqrt(W * W + H * H);

    const graphics = scene.add.graphics();
    graphics.setDepth(9999);
    if (manager.layers && manager.layers.character) {
        graphics.setDepth((manager.layers.character.depth || 0) + 100);
    }

    const angleStep = (Math.PI * 2) / lineCount;
    for (let i = 0; i < lineCount; i++) {
        const angle = i * angleStep;
        const halfWidth = (i % 3 === 0) ? 8 : 4; // 太さにバリエーション

        // 扇形の輪郭を三角形で描く
        const x1 = cx + Math.cos(angle - 0.03) * 30;
        const y1 = cy + Math.sin(angle - 0.03) * 30;
        const x2 = cx + Math.cos(angle + 0.03) * 30;
        const y2 = cy + Math.sin(angle + 0.03) * 30;
        const x3 = cx + Math.cos(angle + halfWidth * 0.005) * maxRadius;
        const y3 = cy + Math.sin(angle + halfWidth * 0.005) * maxRadius;
        const x4 = cx + Math.cos(angle - halfWidth * 0.005) * maxRadius;
        const y4 = cy + Math.sin(angle - halfWidth * 0.005) * maxRadius;

        graphics.fillStyle(colorInt, 0.85);
        graphics.fillTriangle(x1, y1, x3, y3, x4, y4);
        graphics.fillTriangle(x1, y1, x2, y2, x4, y4);
    }

    const promise = new Promise(resolve => {
        scene.tweens.add({
            targets: graphics,
            alpha: { from: 0.9, to: 0 },
            duration: duration,
            ease: 'Power1',
            onComplete: () => {
                graphics.destroy();
                resolve();
            }
        });
    });

    if (wait !== 'false') {
        await promise;
    }
}
