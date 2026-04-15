// src/main.js

// UIScene / GameScene は SystemScene が `this.scene.add(...)` で動的に登録するため、
// ここでは import しない (重複読み込みと意図不明なコメント行の温床になっていた)。
import PreloadScene from './scenes/PreloadScene.js';
import SystemScene from './scenes/SystemScene.js';
import { uiRegistry as rawUiRegistry, sceneUiVisibility } from './ui/index.js';
import { eventTagHandlers } from './handlers/events/index.js';
import SaveLoadScene from './scenes/SaveLoadScene.js';
import ConfigScene from './scenes/ConfigScene.js';
import BacklogScene from './scenes/BacklogScene.js';
import ActionScene from './scenes/ActionScene.js';
import BattleScene from './scenes/BattleScene.js';
import OverlayScene from './scenes/OverlayScene.js';
import NovelOverlayScene from './scenes/NovelOverlayScene.js';
import EditorPlugin from './plugins/EditorPlugin.js';
import JumpScene from './scenes/JumpScene.js';
import TitleScene from './scenes/TitleScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import TrialScene from './scenes/TrialScene.js';
// ★★★ 新設：uiRegistryを自動処理する非同期関数 ★★★
// pathから動的にモジュールをimportするため、asyncにする
async function processUiRegistry(registry) {
    const processed = JSON.parse(JSON.stringify(registry));

    for (const key in processed) {
        const definition = processed[key];

        if (definition.path) {
            try {
                const module = await import(definition.path);
                const UiClass = module.default;

                // ★★★ ここからが修正の核心 ★★★
                // 読み込んだクラスを`component`プロパティとして格納する
                definition.component = UiClass;
                // 不要になったpathは削除しても良い（任意）
                // delete definition.path; 

                if (UiClass && UiClass.dependencies) {
                    definition.watch = UiClass.dependencies;
                    // console.log(`[UI Registry] Processed '${key}'. Auto-configured 'watch'.`);
                }
            } catch (e) {
                console.error(`Failed to process UI definition for '${key}'`, e);
            }
        }
    }
    return processed;
}


const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        // ★★★ 変更点1: 親要素のIDを変更 ★★★
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
    },
    // UIScene / GameScene は SystemScene から動的に add されるので、配列には含めない
    scene: [
        PreloadScene,
        SystemScene,
        TitleScene,
        GameOverScene,
        SaveLoadScene,
        ConfigScene,
        BacklogScene,
        ActionScene,
        BattleScene,
        JumpScene,
        OverlayScene,
        NovelOverlayScene,
        TrialScene
    ],
    input: {
        topOnly: false,
        activePointers: 3 // 同時に3つのタッチを認識できるようにする
    },
    plugins: {
        global: [
            { key: 'EditorPlugin', plugin: EditorPlugin, start: true }
        ]
    },
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 1 // Matter.js の重力はスケールが違う。1 が標準的
            }
        }
    }
};

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('debug')) {
        document.body.classList.add('debug-mode');
    }
    // ステップ1: 必要なデータを先に非同期で準備する
    const processedUiRegistry = await processUiRegistry(rawUiRegistry);

    // Phaser Gameインスタンスを生成
    const game = new Phaser.Game(config);

    // ステップ2: ゲームインスタンスができた直後に、準備したデータを登録する
    // これにより、どのシーンが起動するよりも先にデータが利用可能になることが保証される
    game.registry.set('uiRegistry', processedUiRegistry);
    game.registry.set('sceneUiVisibility', sceneUiVisibility);
    game.registry.set('eventTagHandlers', eventTagHandlers);
};
