/**
 * [clearscreen] タグ - 画面の全リセット
 *
 * 背景・キャラクター・CG・メッセージウィンドウ・BGMを全てクリアします。
 * エンディングやバッドエンドの末尾に挟んで状態をリセットする際に使います。
 *
 * @param {ScenarioManager} manager
 * @param {object} params
 * @param {number} [params.time=0] - フェードアウト時間(ms)。0なら即座にクリア。
 */
export default async function handleClearScreen(manager, params) {
    const duration = Number(params.time) || 0;
    const scene = manager.scene;

    // --- 1. BGM停止 ---
    manager.soundManager.stopBgm(duration);

    // --- 2. 各レイヤーをフェードアウト → 破棄 ---
    const targetLayers = ['background', 'character', 'cg'].map(name => manager.layers[name]).filter(Boolean);
    const allObjects = targetLayers.flatMap(layer => [...layer.list]);

    if (duration > 0 && allObjects.length > 0) {
        await new Promise(resolve => {
            scene.tweens.add({
                targets: allObjects,
                alpha: 0,
                duration,
                ease: 'Linear',
                onComplete: resolve
            });
        });
    }

    for (const layer of targetLayers) {
        layer.removeAll(true);
    }
    scene.characters = {};

    // --- 3. メッセージウィンドウをリセット・非表示 ---
    if (manager.messageWindow) {
        manager.messageWindow.reset();
        manager.messageWindow.setAlpha(0);
    }
}
