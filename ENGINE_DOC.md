# エンジン完全ドキュメント

> このドキュメントはエンジン全体の設計・API・データ形式を記述したものです。
> 新しいゲームを開発する際はこのファイルを参照し、再解析不要で開発できます。

---

## 目次
1. [全体アーキテクチャ](#全体アーキテクチャ)
2. [起動フロー](#起動フロー)
3. [コアマネージャー一覧](#コアマネージャー一覧)
4. [シーン一覧](#シーン一覧)
5. [シナリオスクリプト（KS形式）](#シナリオスクリプトks形式)
6. [イベントタグハンドラ（ActionInterpreter用）](#イベントタグハンドラactioninterpreter用)
7. [データファイル形式](#データファイル形式)
8. [コンポーネント一覧](#コンポーネント一覧)
9. [UIシステム](#uiシステム)
10. [ゲームフローステートマシン](#ゲームフローステートマシン)
11. [セーブ・ロード](#セーブロード)
12. [新しいゲームを作るときの手順](#新しいゲームを作るときの手順)

---

## 全体アーキテクチャ

```
Phaser 3 (1280x720, Matter.js物理)
│
├── SystemScene（常駐・全マネージャーを保持）
│   ├── EngineAPI           → 唯一の公開APIエントリ
│   ├── GameFlowManager     → ゲーム全体のステートマシン
│   ├── SceneTransitionManager → シーン遷移制御
│   ├── OverlayManager      → オーバーレイシーン管理
│   ├── TimeManager         → 時間停止/再開
│   ├── StateManager        → 変数管理（f.*, sf.*）
│   ├── SoundManager        → BGM/SE管理
│   └── ConfigManager       → ユーザー設定
│
├── UIScene（常駐・HUD等）
├── GameScene（ノベルパート）
│   └── ScenarioManager
├── ActionScene / JumpScene / BattleScene（ゲームプレイ）
│   └── BaseGameScene + ActionInterpreter
├── TrialScene（裁判パート）
│   └── BaseGameScene + EvidenceManager
├── OverlayScene（ポーズメニュー等）
├── NovelOverlayScene（ゲームプレイ中のノベル割り込み）
└── PreloadScene → LoadingScene → SystemScene起動
```

### 依存方向（重要）
- シーン → EngineAPI → 各マネージャー（シーンはEngineAPI経由でのみ操作）
- ScenarioManager → StateManager, SoundManager, ConfigManager
- ActionInterpreter → StateManager, eventTagHandlers
- GameFlowManager → EngineAPI

---

## 起動フロー

```
1. index.html → main.js
2. processUiRegistry()でUIコンポーネント定義を動的import
3. Phaser.Game生成（PhysicsはMatter.js）
4. PreloadScene（active:true）が自動起動
   ├── asset_define.json をロード
   ├── physics_define.json をロード
   ├── 全アセット（画像/音/スプライトシート/プレハブ/シーンレイアウト）をロード
   ├── ConfigManager, StateManager, ComponentRegistry を初期化
   └── SystemScene を起動
5. SystemScene.create()
   ├── SoundManager, SceneTransitionManager, OverlayManager, TimeManager 生成
   ├── EngineAPI.init()
   ├── UIScene起動（常駐）
   └── GameFlowManager生成・start()
6. GameFlowManager → initialState="Title" → TitleScene起動
```

---

## コアマネージャー一覧

### EngineAPI (`src/core/EngineAPI.js`)

エンジンの唯一の公開APIインターフェース。シーンからはこのクラス経由でのみ操作する。

```javascript
// SystemSceneインスタンス経由で取得
const api = this.sys.scene.systemScene.engineAPI;
// または game.registry経由
```

| メソッド | 用途 |
|---------|------|
| `requestSimpleTransition(from, to, params)` | シーンを切り替える |
| `requestReturnToNovel(from, params)` | GameSceneへ戻る |
| `requestJump(from, to, params)` | [jump]タグ専用遷移 |
| `requestPauseMenu(from, layoutKey, params)` | ポーズメニューを開く |
| `runScenarioAsOverlay(from, file, blockInput)` | ノベルをオーバーレイで実行 |
| `requestCloseOverlay(from, data)` | オーバーレイを閉じる |
| `fireGameFlowEvent(eventName, data)` | GameFlowManagerにイベント発行 |
| `stopTime()` / `resumeTime()` | 全シーンの物理時間を止める/再開 |
| `fireEvent(eventName, data)` | 任意イベント発行 |
| **Getter** `activeGameSceneKey` | 現在アクティブなゲームシーンのキー |
| **Getter** `isTimeStopped` | 時間停止中か否か |

---

### StateManager (`src/core/StateManager.js`)

ゲーム変数と永続データを管理する。EventEmitter継承。

**変数の種類:**
- `f.*` — ゲーム変数（セッション中有効）
- `sf.*` — システム変数（LocalStorageに永続保存）
  - `sf.history` — セリフ履歴（最大100件）
  - `sf.debug_mode` — URLに?debug=true含むと有効

```javascript
// 変数取得・設定
stateManager.setF('love_meter', 10);
stateManager.getF('love_meter'); // 10
stateManager.setSF('visited_ch1', true);

// 式評価（読み取り専用）
stateManager.eval('f.love_meter > 5'); // true/false

// 式実行（書き込み可能）
stateManager.execute('f.score = f.score + 10', { source, target });

// 変数変更イベント
stateManager.on('f-variable-changed', (key, value) => { ... });
stateManager.on('sf-variable-changed', (key, value) => { ... });
```

**式内で使えるもの:** `f`, `sf`, `self`, `source`, `target`, `Phaser`, `setF()`, `setSF()`

---

### ScenarioManager (`src/core/ScenarioManager.js`)

KSファイルの解析・実行エンジン。GameScene/NovelOverlaySceneが保持。

| メソッド | 用途 |
|---------|------|
| `loadScenario(key, targetLabel)` | シナリオファイルをロードして開始 |
| `next()` | シナリオを開始/再開 |
| `stop()` | 実行停止 |
| `onClick()` | クリック処理（テキスト送り） |
| `jumpTo(labelOrLine)` | 指定ラベルへジャンプ |
| `setMode('normal'/'skip'/'auto')` | 実行モード切り替え |
| `registerCharacter(name, data)` | キャラクター定義を登録 |
| `getScenarioState()` | 現在の進行状態を返す（セーブ用） |
| `getLayerState()` | 背景・キャラクター表示状態を返す |

**変数展開:** `&f.変数名` をシナリオ内に書くと値に置換される。

---

### ActionInterpreter (`src/core/ActionInterpreter.js`)

ノードグラフ（イベント定義）を実行するエンジン。BaseGameScene/UIScene/OverlaySceneが保持。

```javascript
// シーンのGameObjectにeventsが定義されていると自動実行
// events: [{ trigger: "onClick", actions: "[play_sound key=smash]" }]

await interpreter.run(sourceObject, eventData, collidedTarget);
```

**target指定:**
- `'player'` — PlayerControllerを持つオブジェクト
- `'source'` — イベント発火元
- `'target'` — 衝突相手
- `'オブジェクト名'` — 名前検索

---

### GameFlowManager (`src/core/GameFlowManager.js`)

ゲーム全体のフローをJSONで定義したステートマシン。`assets/data/game_flow.json` で制御。

```javascript
// イベントを発行してステートを遷移させる
engineAPI.fireGameFlowEvent('START_GAME', { extra: 'data' });
```

**デフォルトステート:**
- `Title` → TitleScene起動
- `InGame` → ゲームプレイ中
- `Paused` → ポーズメニュー中
- `NovelOverlay` → ノベルオーバーレイ中
- `Trial` → 裁判パート中
- `GameOver` → ゲームオーバー画面

---

### SoundManager (`src/core/SoundManager.js`)

BGMとSEを管理する。

```javascript
await soundManager.playBgm('bgm_action', 1000);   // BGM再生（1秒フェードイン）
soundManager.playBgmFireAndForget('cafe');          // 非同期BGM再生
soundManager.stopBgm(500);                          // 500msフェードアウト停止
await soundManager.playSe('smash', { loop: false }); // SE再生
soundManager.stopSe('blood');                       // ループSE停止
soundManager.getBgmCurrentTimeMs();                 // 再生位置取得
```

音量はConfigManagerと自動同期。`bgmVolume`, `seVolume`（0-1）。

---

### ConfigManager (`src/core/ConfigManager.js`)

ユーザー設定をLocalStorageに永続保存する。

| 設定キー | 型 | 説明 | デフォルト |
|---------|---|------|---------|
| `bgmVolume` | slider(0-1) | BGM音量 | 0.8 |
| `seVolume` | slider(0-1) | SE音量 | 0.9 |
| `textSpeed` | slider(0-100) | テキスト速度 | 50 |
| `typeSound` | option | タイプ音('se'/'none') | 'se' |

```javascript
configManager.getValue('bgmVolume'); // 0.8
configManager.setValue('textSpeed', 80);
configManager.on('change:bgmVolume', (value) => { ... });
```

LocalStorageキー: `'my_novel_engine_config'`

---

### TimeManager (`src/core/TimeManager.js`)

全シーンのMatter.js物理時間を一括停止・再開する。

```javascript
timeManager.stopTime();   // 全物理演算を一時停止
timeManager.resumeTime(); // 再開
timeManager.isTimeStopped; // 状態確認
```

---

### OverlayManager (`src/core/OverlayManager.js`)

オーバーレイシーンを管理する。

```javascript
// ポーズメニューを開く（layoutKeyはシーンレイアウトJSONのキー）
overlayManager.openMenuOverlay({ from: 'GameScene', layoutKey: 'pause_menu' });

// ノベルをオーバーレイで実行
overlayManager.openNovelOverlay({ scenario: 'test.ks', returnTo: 'GameScene' });

// 閉じる
overlayManager.closeOverlay({ fromScene: 'OverlayScene' });
```

---

## シーン一覧

| シーンキー | クラス | 用途 |
|-----------|--------|------|
| `SystemScene` | SystemScene | 常駐・全マネージャー管理 |
| `UIScene` | UIScene | 常駐・HUD・メッセージウィンドウ |
| `PreloadScene` | PreloadScene | 起動時アセットロード |
| `TitleScene` | TitleScene | タイトル画面 |
| `GameScene` | GameScene | ノベルパート |
| `ActionScene` | ActionScene | BaseGameScene継承・アクションゲームプレイ |
| `JumpScene` | JumpScene | BaseGameScene継承・ジャンプゲームプレイ |
| `BattleScene` | BattleScene | BaseGameScene継承・バトルゲームプレイ |
| `TrialScene` | TrialScene | BaseGameScene継承・裁判パート |
| `OverlayScene` | OverlayScene | ポーズメニュー等の汎用オーバーレイ |
| `NovelOverlayScene` | NovelOverlayScene | ゲームプレイ中のノベル割り込み |
| `GameOverScene` | GameOverScene | ゲームオーバー画面 |
| `SaveLoadScene` | SaveLoadScene | セーブ/ロード画面 |
| `BacklogScene` | BacklogScene | バックログ画面 |
| `ConfigScene` | ConfigScene | 設定画面 |

### BaseGameScene（アクションシーンの基底クラス）

`ActionScene`, `JumpScene`, `BattleScene`, `TrialScene` の共通基底。

**レイヤーシステム:**
- `Background` — 背景（最下層）
- `Gameplay` — キャラクター・オブジェクト
- `Foreground` — 前景（最上層）
- UIカメラとゲームカメラの2カメラシステム

**主要機能:**
- JSONレイアウトからオブジェクトを自動生成（`initSceneWithData`）
- Y軸ソート（デプス自動調整）
- コンポーネント動的アタッチ（`addComponent`）
- 物理衝突・重複イベント管理

---

## シナリオスクリプト（KS形式）

ファイル拡張子: `.ks`、配置場所: `assets/scenarios/`

### 基本構文

```ks
; セミコロンはコメント

; ラベル定義
*chapter1

; タグ（[タグ名 属性="値" ...]）
[bg storage="bg_school" time=1000]

; キャラクター定義（一度だけ必要）
[chara_new name="roger" jname="ロジャー"]

; 話者指定（#キャラ名）
#roger
「こんにちは。」
[p]

; 話者なし（ト書き）
#
（場面が変わった。）
[p]

; 変数展開（&f.変数名）
roger:「ポイントは&f.scoreです。」
[p]

; サブルーチン呼び出し
[call target="*sub1"]
[jump target="*chapter2"]
[return]

; シナリオ終了
[s]
```

### シナリオタグ一覧

#### キャラクター系
| タグ | 属性 | 説明 |
|-----|------|------|
| `[chara_new]` | `name`, `jname` | キャラクター定義登録 |
| `[chara_show]` | `name`, `pos`(left/center/right), `time` | キャラクター表示 |
| `[chara_hide]` | `name`, `time` | キャラクター非表示 |
| `[chara_mod]` | `name`, `face`, `time` | 表情変更（face=アセットキー部分） |

#### 背景・画像系
| タグ | 属性 | 説明 |
|-----|------|------|
| `[bg]` | `storage`, `time` | 背景設定（クロスフェード） |
| `[image]` | `storage`, `x`, `y`, `layer` | 画像表示 |
| `[freeimage]` | `storage`, `x`, `y` | 自由配置画像 |

#### アニメーション・演出系
| タグ | 属性 | 説明 |
|-----|------|------|
| `[move]` | `name`, `x`, `y`, `time`, `ease` | オブジェクト移動 |
| `[walk]` | `name`, `x`, `speed` | キャラクター歩行 |
| `[shake]` | `time`, `power` | 画面シェイク |
| `[fadein]` / `[fadeout]` | `time` | フェードイン/アウト |
| `[vignette]` | `alpha` | ビネット効果 |
| `[flip]` | `name` | 水平反転 |
| `[chara_jump]` | `name` | キャラクタージャンプ |
| `[stop_anim]` | `name` | アニメーション停止 |
| `[live_breath_start]` | `name` | 呼吸アニメ開始 |

#### 音声系
| タグ | 属性 | 説明 |
|-----|------|------|
| `[playbgm]` | `storage`, `time` | BGM再生 |
| `[stopbgm]` | `time` | BGM停止 |
| `[playse]` | `storage`, `loop` | SE再生 |
| `[voice]` | `storage` | ボイス再生 |

#### フロー制御系
| タグ | 説明 |
|-----|------|
| `[p]` | クリック待ち（ページ送り） |
| `[s]` | シナリオ停止（終了） |
| `[wait time=500]` | 指定ミリ秒待機 |
| `[delay time=100]` | 遅延 |
| `[cm]` | メッセージウィンドウをクリア |
| `[er]` | テキスト表示完了待ち |
| `[r]` | 改行 |
| `[hidewindow]` / `[showwindow]` | ウィンドウ非表示/表示 |

#### 条件分岐
```ks
[if exp="f.love_meter >= 10"]
「好感度が高い！」
[p]
[elsif exp="f.love_meter >= 5"]
「普通ですね。」
[p]
[else]
「低いです。」
[p]
[endif]
```

#### 選択肢
```ks
[link target="*choice_a" text="選択肢A"]
[link target="*choice_b" text="選択肢B"]
[s]

*choice_a
「Aを選んだ。」
[jump target="*after_choice"]

*choice_b
「Bを選んだ。」
[jump target="*after_choice"]

*after_choice
```

#### 変数操作
```ks
[eval exp="f.score = 100"]
[eval exp="f.score = f.score + 10"]
[log text="デバッグ出力 &f.score"]
```

#### シーン制御（ノベルオーバーレイ専用）
```ks
[overlay_end]   ; オーバーレイを閉じてゲームに戻る
```

---

## イベントタグハンドラ（ActionInterpreter用）

シーンのGameObjectの`events`フィールドに記述するアクション。
`[タグ名 属性=値]` の形式で記述する。

### オブジェクト操作系

| タグ | 属性 | 説明 |
|-----|------|------|
| `[destroy]` | `target` | オブジェクト削除 |
| `[set_visible]` | `target`, `value`(true/false) | 表示/非表示 |
| `[set_flip_x]` | `target`, `value`(true/false) | 水平反転 |
| `[spawn_object]` | `prefab`, `at`(source/pointer/x,y/名前) | プレハブからスポーン |
| `[tween]` | `target`, `property`, `to`, `time`, `ease`, `yoyo`, `loop` | アニメーション |
| `[move_to_target]` | `target`, `destination`, `speed` | 移動 |
| `[toggle_hiding]` | `target` | 非表示トグル |

### 物理演算系

| タグ | 属性 | 説明 |
|-----|------|------|
| `[body_velocity]` | `target`, `vx`, `vy` | 速度設定 |
| `[apply_force]` | `target`, `fx`, `fy` | 力を加える |
| `[set_collision]` | `target`, `enabled` | コリジョン有効/無効 |

### アニメーション系

| タグ | 属性 | 説明 |
|-----|------|------|
| `[anim_play]` | `target`, `key` | アニメーション再生 |
| `[anim_stop]` | `target` | アニメーション停止 |
| `[anim_frame]` | `target`, `frame` | フレーム指定 |

### 音声系

| タグ | 属性 | 説明 |
|-----|------|------|
| `[play_sound]` | `key`, `loop` | SE再生 |
| `[stop_sound]` | `key` | SE停止 |
| `[play_bgm]` | `key`, `fade` | BGM再生 |
| `[stop_bgm]` | `fade` | BGM停止 |

### カメラ系

| タグ | 属性 | 説明 |
|-----|------|------|
| `[camera_shake]` | `duration`, `intensity` | カメラシェイク |
| `[camera_fade]` | `duration`, `color`, `direction` | フェード |
| `[camera_follow]` | `target` | カメラフォロー |

### UI・ビジュアル系

| タグ | 属性 | 説明 |
|-----|------|------|
| `[flash_effect]` | `target`, `color`, `duration` | フラッシュ |
| `[vignette]` | `alpha` | ビネット |
| `[set_ui_visible]` | `name`, `value` | UI要素の表示/非表示 |
| `[open_menu]` | `layout` | メニューを開く |
| `[close_menu]` | — | メニューを閉じる |

### フロー制御系

| タグ | 属性 | 説明 |
|-----|------|------|
| `[wait]` | `time` | ミリ秒待機 |
| `[time_stop]` / `[time_resume]` | — | 時間停止/再開 |
| `[if]` | `exp` | 条件分岐（output_true/output_false） |
| `[eval]` | `exp` | 式実行（f.score = 10等） |
| `[distance_check]` | `a`, `b`, `threshold` | 距離チェック |
| `[timer_check]` | `id`, `threshold` | タイマーチェック |

### シーン・シナリオ系

| タグ | 属性 | 説明 |
|-----|------|------|
| `[transition_scene]` | `scene`, `params` | シーン遷移 |
| `[run_scene]` | `sceneKey`, `params` | シーン起動 |
| `[run_scenario]` | `file`, `block_input` | シナリオをオーバーレイ実行 |
| `[return_novel]` | `params` | GameSceneへ戻る |
| `[fire_game_flow_event]` | `event`, `data` | GameFlowへイベント発行 |
| `[fire_event]` | `event`, `data` | 汎用イベント発行 |
| `[fire_scene_event]` | `event`, `data` | シーン内イベント発行 |
| `[state_transition]` | `state` | ステート遷移 |
| `[save_game]` | `slot` | セーブ |
| `[load_game]` | `slot` | ロード |

### インタラクション系

| タグ | 属性 | 説明 |
|-----|------|------|
| `[interact_add]` | `target`, `label`, `events` | インタラクション追加 |
| `[interact_remove]` | `target` | インタラクション削除 |
| `[call_component_method]` | `target`, `component`, `method`, `args` | コンポーネントメソッド呼び出し |
| `[set_data]` | `target`, `key`, `value` | カスタムデータ設定 |

---

## データファイル形式

### asset_define.json

`assets/asset_define.json` — 全アセットの定義。PreloadSceneが読み込む。

```json
{
  "images": {
    "キー": "パス/ファイル名.png"
  },
  "spritesheets": {
    "キー": {
      "path": "パス",
      "frameWidth": 102,
      "frameHeight": 115
    }
  },
  "sounds": {
    "キー": "パス/ファイル名.mp3"
  },
  "prefabs": [
    { "key": "coin", "path": "data/prefabs/coin.json" }
  ],
  "file_lists": {
    "scenarios": {
      "path": "assets/scenarios/",
      "type": "text",
      "list": ["scene1.ks", "scene2.ks"]
    },
    "scene_layouts": {
      "path": "assets/data/scenes/",
      "type": "json",
      "list": ["GameScene.json", "UIScene.json"]
    },
    "tilesets": {
      "path": "assets/tilesets/",
      "type": "image",
      "list": ["tileset_terrain.png"]
    }
  }
}
```

---

### シーンレイアウトJSON

`assets/data/scenes/XXX.json` — シーンのオブジェクト配置定義。

```json
{
  "layers": [
    { "name": "Foreground", "visible": true, "locked": false },
    { "name": "Gameplay", "visible": true, "locked": false },
    { "name": "Background", "visible": true, "locked": false }
  ],
  "objects": [
    {
      "name": "オブジェクト名",
      "type": "Sprite",
      "texture": "アセットキー",
      "x": 640, "y": 360,
      "depth": 0,
      "scaleX": 1, "scaleY": 1,
      "angle": 0, "alpha": 1,
      "layer": "Gameplay",
      "group": "player",
      "physics": {
        "isStatic": false,
        "ignoreGravity": false,
        "shape": "rectangle"
      },
      "components": [
        { "type": "PlayerController", "speed": 200 }
      ],
      "events": [
        {
          "trigger": "onClick",
          "actions": "[play_sound key=smash]"
        },
        {
          "trigger": "onCollide_Start",
          "targetGroup": "enemy",
          "actions": "[set_data target=source key=hp value=0]"
        }
      ]
    }
  ]
}
```

**typeに使える値:**
- `Sprite` — スプライト
- `Image` — 静止画像
- `Text` — テキスト
- `Graphics` — 図形
- `Container` — コンテナ
- UIコンポーネント名（`Button`, `MessageWindow`, `HpBar`, `CoinHud` 等）

**triggerに使える値:**
- `onClick` — クリック/タップ
- `onCollide_Start` / `onCollide_End` — 衝突開始/終了（targetGroup指定可）
- `onOverlap_Start` / `onOverlap_End` — 重複開始/終了
- `onReady` — シーン準備完了時
- `onUpdate` — 毎フレーム

---

### プレハブJSON

`assets/data/prefabs/XXX.json` — 再利用可能なオブジェクト定義。

```json
{
  "name": "coin",
  "type": "Sprite",
  "texture": "next_arrow",
  "animation": { "default": "coin_spin" },
  "group": "collectible",
  "components": [],
  "physics": {
    "isStatic": true,
    "ignoreGravity": true,
    "shape": "circle"
  },
  "events": [
    {
      "trigger": "onCollide_Start",
      "targetGroup": "player",
      "actions": "[play_sound key=smash]"
    }
  ]
}
```

---

### game_flow.json

`assets/data/game_flow.json` — GameFlowManagerのステートマシン定義。

```json
{
  "initialState": "Title",
  "states": {
    "Title": {
      "onEnter": [
        { "type": "transitionTo", "params": { "scene": "TitleScene" } }
      ],
      "transitions": [
        {
          "event": "START_GAME",
          "to": "InGame",
          "action": {
            "type": "transitionTo",
            "params": { "scene": "GameScene", "startScenario": "scene1" }
          }
        }
      ]
    },
    "InGame": {
      "onEnter": [{ "type": "resumeScene" }],
      "transitions": [
        { "event": "OPEN_PAUSE_MENU", "to": "Paused" }
      ]
    },
    "Paused": {
      "onEnter": [
        { "type": "pauseScene" },
        { "type": "openMenuOverlay", "params": { "layout": "pause_menu" } }
      ],
      "transitions": [
        {
          "event": "CLOSE_PAUSE_MENU",
          "to": "InGame",
          "action": { "type": "closeOverlay" }
        }
      ]
    }
  }
}
```

**onEnter/onExit/actionで使えるtype:**

| type | 説明 |
|------|------|
| `transitionTo` | `params.scene` にシーンを指定して遷移 |
| `openMenuOverlay` | `params.layout` のオーバーレイを開く |
| `closeOverlay` | 現在のオーバーレイを閉じる |
| `pauseScene` | アクティブシーンをポーズ |
| `resumeScene` | シーンを安全にレジューム |
| `stopTime` / `resumeTime` | 時間停止/再開 |
| `runNovelOverlay` | ノベルをオーバーレイ実行 |
| `playBgm` | `params.key`, `params.fade` でBGM再生 |

---

### evidence_db.json

`assets/data/evidence_db.json` — 証拠品データベース（TrialScene用）。

---

## コンポーネント一覧

コンポーネントはJSONの`components`フィールドや`addComponent()`で動的にアタッチする。

### ゲームロジック系

| コンポーネント | 設定例 | 説明 |
|--------------|--------|------|
| `PlayerController` | `{ speed: 200 }` | 入力でキャラクター操作（バーチャルスティック対応） |
| `NpcController` | `{ speed: 100 }` | NPC制御基底 |
| `StateMachineComponent` | `{ states: {...} }` | オブジェクト固有のステートマシン |
| `Interactor` | `{}` | E/タップでインタラクション実行 |

### AI系

| コンポーネント | 説明 |
|--------------|------|
| `WanderComponent` | ランダムに徘徊する |
| `ChaseComponent` | 対象を追跡する |
| `ReturnHomeComponent` | 起点に帰る |
| `DetectionAreaComponent` | 範囲内の対象を検出する |
| `PatrolComponent` | パトロールルートを巡回する |
| `AnimationController` | アニメーション切り替えを管理する |

### ビジュアル系

| コンポーネント | 説明 |
|--------------|------|
| `LightComponent` | 光源エフェクト |
| `VignetteComponent` | ビネット効果 |
| `FogComponent` | フォグ効果 |
| `FlashEffect` | フラッシュ効果 |

### 裁判パート系

| コンポーネント | 説明 |
|--------------|------|
| `TestimonyFlowComponent` | 証言フロー管理 |
| `TrialSegmentManager` | 裁判セグメント管理 |
| `TrialTimerComponent` | 裁判タイマー |
| `InteractionMenuComponent` | インタラクションメニュー |
| `ProgressIndicatorComponent` | 進捗表示 |
| `EvidenceManager` | 証拠品管理 |
| `EvidenceSelectOverlay` | 証拠品選択UI |

### UI/HUD系（UISceneで使用）

| コンポーネント | 説明 |
|--------------|------|
| `WatchVariableComponent` | `f.*`変数を監視してテキスト更新 |
| `BarDisplayComponent` | 変数に応じたバー表示 |
| `TextDisplayComponent` | 変数に応じたテキスト表示 |
| `Scrollable` | スクロール対応コンテナ |

---

## UIシステム

### UIシーンのレイアウト定義

`assets/data/scenes/UIScene.json` にHUD要素を定義する。
`assets/data/scenes/pause_menu.json` 等にオーバーレイUIを定義する。

### sceneUiVisibility

どのシーンのとき、どのUI要素を表示するかを `main.js` の `sceneUiVisibility` で定義する。

```javascript
// main.jsのsceneUiVisibility例
const sceneUiVisibility = {
  GameScene: ['message_window', 'bottom_panel'],
  ActionScene: ['jump_button', 'menu_button'],
};
```

### uiRegistry

UIコンポーネントのクラスをJSONキー名と結びつける登録マップ。

```javascript
// main.jsのuiRegistry例
const uiRegistry = [
  { key: 'MessageWindow', path: 'src/ui/MessageWindow.js' },
  { key: 'Button', path: 'src/ui/Button.js' },
  { key: 'HpBar', path: 'src/ui/HpBar.js' },
];
```

### UI変数連携

UIコンポーネントが `dependencies: ['f.score']` を持っていると、`StateManager` の変数変更時に自動更新される。

---

## ゲームフローステートマシン

`assets/data/game_flow.json` を編集することで、コード変更なしにゲームフローを変更できる。

### 典型的なフロー

```
Title →[START_GAME]→ InGame
InGame →[OPEN_PAUSE_MENU]→ Paused →[CLOSE_PAUSE_MENU]→ InGame
InGame →[RUN_NOVEL_OVERLAY]→ NovelOverlay →[END_NOVEL_OVERLAY]→ InGame
InGame →[GAME_OVER]→ GameOver →[RESTART_GAME]→ InGame
InGame →[RETURN_TO_TITLE]→ Title
```

### イベントを発行する方法

**シナリオKSから:**
```ks
[eval exp="f.dummy = 1"]
; ※KSにはfire_game_flow_eventタグはないため、evalで変数を変え、
; StateManagerの変更イベントを使うか、シーン側のコードで対応する
```

**イベントJSONから（BaseGameScene内）:**
```
[fire_game_flow_event event="START_GAME" data='{"scene":"GameScene"}']
```

---

## セーブ・ロード

### セーブデータ構造

```javascript
{
  scenarioFile: 'scene1',    // 現在のシナリオファイルキー
  currentLine: 42,           // 現在行番号
  variables: { ...f },       // ゲーム変数スナップショット
  scenarioState: { ... },    // ScenarioManager状態
  layerState: {              // 表示状態
    background: { key, ... },
    characters: { ... }
  },
  bgmKey: 'cafe',            // 再生中BGM
  timestamp: 1234567890
}
```

### セーブ・ロードの実行

```javascript
// GameSceneから
gameScene.performSave(slotNumber);
gameScene.performLoad(slotNumber, returnParams);

// イベントタグから
[save_game slot=1]
[load_game slot=1]
```

LocalStorageキー: `save_slot_${n}`

---

## 新しいゲームを作るときの手順

### 1. アセット追加

`assets/asset_define.json` に追加するだけ。コード不要。

```json
{
  "images": { "新キャラ": "assets/images/新キャラ.png" },
  "sounds": { "新BGM": "assets/audio/新BGM.mp3" }
}
```

### 2. シナリオ作成

`assets/scenarios/` に `.ks` ファイルを作成し、`asset_define.json` の `file_lists.scenarios.list` に追加。

### 3. 新シーン（アクション系）作成

1. `assets/data/scenes/新Scene.json` を作成（レイアウト定義）
2. `assets/asset_define.json` の `file_lists.scene_layouts.list` に追加
3. `src/scenes/新Scene.js` を作成（`BaseGameScene` 継承）
4. `src/main.js` のシーン登録配列に追加
5. `src/core/GameFlowManager.js` の `SCENE_MAP` に追加

### 4. ゲームフロー追加

`assets/data/game_flow.json` に新しいステートと遷移を追加するだけ。

### 5. 新UIコンポーネント作成

1. `src/ui/新Component.js` を作成
2. `src/main.js` の `uiRegistry` に登録
3. `assets/data/scenes/UIScene.json`（または他のシーンJSON）に配置

### 6. 新イベントタグ作成

1. `src/handlers/events/新ハンドラ.js` を作成
2. `src/handlers/events/index.js` に `import` して追加

### 7. 新コンポーネント作成

1. `src/components/新Component.js` を作成
2. `src/components/index.js` に追加（ComponentRegistryへの登録）

---

## レイアウト座標系

```
解像度: 1280 x 720

キャラクター位置:
  左 (left):   x=280, y=450
  中央 (center): x=640, y=450
  右 (right):  x=1000, y=450

UI:
  メッセージウィンドウ: x=640, y=600（パディング35）
  選択肢ボタン開始Y: 200、ステップY: 90

カメラ: デフォルトはゲームカメラ（スクロール可）
UIカメラ: スクロール追従しない固定カメラ
```

---

## デバッグ

URLに `?debug=true` を付けると `sf.debug_mode = true` になり、EditorUIが有効化される。

EditorUIでできること:
- シーンレイアウトの編集（オブジェクト追加・移動・プロパティ変更）
- アセットブラウザ
- リアルタイムプレビュー
