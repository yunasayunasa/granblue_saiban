/**
 * [chara_vanish] タグ - 震えながら消えるエフェクト
 *
 * キャラクターがブルブル震えながらフェードアウトします。
 * 倒されたトンチキ生物や、ギャグ的な退場に使用します。
 *
 * @param {ScenarioManager} manager
 * @param {object} params
 * @param {string} params.name         - 対象キャラクター名 (必須)
 * @param {number} [params.time=800]   - 総演出時間(ms)
 * @param {number} [params.power=12]   - 揺れの強さ(pixel)
 */
export default async function handleCharaVanish(manager, params) {
    const { name, time = 800, power = 12 } = params;
    const scene = manager.scene;

    if (!name) { console.warn('[chara_vanish] name属性は必須です。'); return; }
    const chara = scene.characters[name];
    if (!chara) { console.warn(`[chara_vanish] キャラクター[${name}]が見つかりません。`); return; }

    const duration = Number(time);
    const intensity = Number(power);
    const originX = chara.x;

    await new Promise(resolve => {
        // 横揺れTween
        const shakeTween = scene.tweens.add({
            targets: chara,
            x: originX + intensity,
            duration: 50,
            ease: 'Linear',
            yoyo: true,
            repeat: Math.floor((duration / 100) - 1),
        });

        // フェードアウトTween（同時進行）
        scene.tweens.add({
            targets: chara,
            alpha: 0,
            duration: duration,
            ease: 'Power1',
            onComplete: () => {
                shakeTween.stop();
                chara.setX(originX);
                chara.destroy();
                delete scene.characters[name];
                resolve();
            }
        });
    });
}
