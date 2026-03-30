import BaseGameScene from './BaseGameScene.js';

export default class TitleScene extends BaseGameScene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        super.create();
        // JSONレイアウト（旧タイトル）をバイパスし、直接onSetupCompleteへ
        this.finalizeSetup([]);
    }

    onSetupComplete() {
        // GameFlowManager の状態を 'Title' に強制同期
        const engineAPI = this.registry.get('engineAPI') || window.EngineAPI;
        const gameFlowManager = engineAPI?.gameFlowManager;
        if (gameFlowManager) gameFlowManager.currentState = 'Title';

        const W  = this.scale.width;
        const H  = this.scale.height;
        const cx = W / 2;
        const cy = H / 2;

        // ── 背景 ──
        const bg = this.add.image(cx, cy, 'bg_title')
            .setDisplaySize(W, H)
            .setAlpha(0)
            .setDepth(0);

        // ── ロゴ ──
        const logo = this.add.image(cx, cy - 60, 'title_logo')
            .setAlpha(0)
            .setDepth(2);
        const logoScale = Math.min((W * 0.65) / logo.width, (H * 0.45) / logo.height) * 1.2;
        logo.setScale(logoScale);

        // ── ホワイトフラッシュ用オーバーレイ ──
        const flash = this.add.rectangle(cx, cy, W, H, 0xffffff)
            .setAlpha(0)
            .setDepth(3);

        // ── TOUCH SCREEN テキスト ──
        const touchText = this.add.text(cx, H * 0.83, 'TOUCH SCREEN', {
            fontFamily: '"Noto Sans JP", sans-serif',
            fontSize: '31px',
            fill: '#ffffff',
            letterSpacing: 6,
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5).setAlpha(0).setDepth(2);

        // uiCamera から除外（ゲームカメラのみで描画）
        if (this.uiCamera) {
            this.uiCamera.ignore([bg, logo, flash, touchText]);
        }

        // ── BGM 開始 ──
        const soundManager = this.registry.get('soundManager');
        if (soundManager) soundManager.playBgm('bgm_maintheme');

        // ── アニメーションシーケンス ──

        // 1) 背景フェードイン (900ms)
        this.tweens.add({
            targets: bg,
            alpha: 1,
            duration: 900,
            ease: 'Linear',
            onComplete: () => this._doFlashAndLogo(flash, logo, touchText),
        });
    }

    _doFlashAndLogo(flash, logo, touchText) {
        // 2) 白フラッシュ (0→1、120ms)
        this.tweens.add({
            targets: flash,
            alpha: 1,
            duration: 120,
            ease: 'Linear',
            onComplete: () => {
                // フラッシュ頂点と同時にロゴを表示
                logo.setAlpha(1);

                // 3) フラッシュ退場 (1→0、350ms)
                this.tweens.add({
                    targets: flash,
                    alpha: 0,
                    duration: 350,
                    ease: 'Linear',
                    onComplete: () => this._showTouchText(touchText),
                });
            },
        });
    }

    _showTouchText(touchText) {
        // 4) TOUCH SCREEN フェードイン (500ms、400ms遅延)
        this.tweens.add({
            targets: touchText,
            alpha: 1,
            duration: 500,
            delay: 400,
            ease: 'Linear',
            onComplete: () => {
                // 5) 上下浮遊アニメーション（無限ループ）
                this.tweens.add({
                    targets: touchText,
                    y: touchText.y - 12,
                    duration: 1800,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1,
                });

                // 6) タップ/クリックでゲーム開始
                this._waitForStartInput();
            },
        });
    }

    _waitForStartInput() {
        this.input.once('pointerdown', () => this._startGame());
        this.input.keyboard.once('keydown', () => this._startGame());
    }

    _startGame() {
        const engineAPI = this.registry.get('engineAPI') || window.EngineAPI;
        if (engineAPI) {
            engineAPI.fireGameFlowEvent('START_GAME');
        } else {
            const systemScene = this.scene.get('SystemScene');
            if (systemScene?.gameFlowManager) {
                systemScene.gameFlowManager.handleEvent('START_GAME');
            }
        }
    }
}
