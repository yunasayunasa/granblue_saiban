/**
 * [chara_zoom] タグ - キャラクター顔アップ演出
 *
 * 指定キャラクターを拡大して「顔アップ」を演出します。
 * 縮小して元のサイズに戻すか、元サイズに留まるか選択できます。
 *
 * @param {ScenarioManager} manager
 * @param {object} params
 * @param {string} params.name            - 対象キャラクター名 (必須)
 * @param {number} [params.scale=1.5]     - 拡大率
 * @param {number} [params.time=300]      - 拡大アニメーション時間(ms)
 * @param {string} [params.restore='false'] - 'true'にすると元のスケールに戻す
 * @param {number} [params.restore_time=300] - 元に戻す時間(ms)
 */
export default async function handleCharaZoom(manager, params) {
    const {
        name,
        scale = 1.5,
        time = 300,
        restore = 'false',
        restore_time = 300,
    } = params;

    const scene = manager.scene;

    if (!name) { console.warn('[chara_zoom] name属性は必須です。'); return; }
    const chara = scene.characters[name];
    if (!chara) { console.warn(`[chara_zoom] キャラクター[${name}]が見つかりません。`); return; }

    const targetScale = Number(scale);
    const duration = Number(time);
    const restoreDuration = Number(restore_time);
    const originScaleX = chara.scaleX;
    const originScaleY = chara.scaleY;

    // 拡大アニメーション
    await new Promise(resolve => {
        scene.tweens.add({
            targets: chara,
            scaleX: targetScale,
            scaleY: targetScale,
            duration: duration,
            ease: 'Back.easeOut',
            onComplete: resolve,
        });
    });

    // restore='true' の場合、元のスケールに戻す
    if (restore === 'true') {
        await new Promise(resolve => {
            scene.tweens.add({
                targets: chara,
                scaleX: originScaleX,
                scaleY: originScaleY,
                duration: restoreDuration,
                ease: 'Power2',
                onComplete: resolve,
            });
        });
    }
}
