/**
 * [jump] タグ - シーン遷移 / ラベルジャンプ
 * 
 * 他のPhaserシーンへ遷移するか、現在のシナリオファイル内のラベルへジャンプします。
 * シーン遷移の際は、オートセーブを実行し、パラメータを渡すことができます。
 * 
 * @param {ScenarioManager} manager - ScenarioManagerのインスタンス
 * @param {object} params - { storage, target, params }
 */
import EngineAPI from '../../core/EngineAPI.js'; // ★ インポート
export default async function handleJump(manager, params) {

    // --- シーン間遷移 または シナリオファイル遷移 の場合 ---
    if (params.storage) {
        const storage = params.storage;

        // A. 別のシナリオファイルへのジャンプ (.ks)
        if (storage.endsWith('.ks')) {
            // console.log(`[jump] 別のシナリオファイル[${storage}]をロードします。 target=[${params.target}]`);
            await manager.loadScenario(storage, params.target || null);
            return;
        }

        // B. 他のPhaserシーンへの遷移
        const toSceneKey = storage;
        // console.log(`[jump] シーン[${toSceneKey}]へ遷移します。`);

        // 1. オートセーブを実行
        manager.scene.performSave(0);

        // 2. 遷移先に渡すパラメータを解決
        let transitionParams = {};
        if (params.params) {
            try {
                transitionParams = manager.stateManager.getValue(`(${params.params})`);
            } catch (e) {
                console.error(`[jump] params属性の解析に失敗しました: "${params.params}"`, e);
                transitionParams = {};
            }
        }

        const fromSceneKey = manager.scene.scene.key;

        // 遷移リクエストを確実に発行
        EngineAPI.requestJump(fromSceneKey, toSceneKey, transitionParams);

        // 自分の仕事を終える
        manager.stop();
        manager.scene.scene.stop();

    } else if (params.target && params.target.startsWith('*')) {
        manager.jumpTo(params.target);
    } else {
        console.warn('[jump] 有効なstorage属性またはtarget属性が指定されていません。');
    }
}