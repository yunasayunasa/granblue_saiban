/**
 * 証言テキストの流れを制御するコンポーネント。
 * 文字を1文字ずつ表示（タイプ音付き）しながら画面内を移動させる。
 */
export default class TestimonyFlowComponent {
    constructor(scene, gameObject, params) {
        this.scene = scene;
        this.gameObject = gameObject; // TextオブジェクトまたはContainer

        const rawText = params.text || gameObject.text || "";
        this.typingSpeed = params.speed || 50;
        this.moveSpeed = params.moveSpeed || 100;
        // ★ style: 'scroll' (default) or 'typewriter'
        this.style = params.style || 'scroll';
        this.waitAfterType = 800; // ★ 短縮：タイプ完了後の待機時間 (2000 -> 800)

        // ★ タグ解析
        const parsed = this.parseTags(rawText);
        this.cleanText = parsed.cleanText;
        this.tagEvents = parsed.tagEvents; // Map: index -> array of tags

        this.charIndex = 0; // Display index
        this.isTyping = false;
        this.isComplete = false;
        this.typeTimer = null;

        // 初期状態のテキスト処理
        if (gameObject.type === 'Container') {
            this.textObject = gameObject.list.find(obj => obj.type === 'Text');
        } else if (gameObject.type === 'Text') {
            this.textObject = gameObject;
        }

        if (this.textObject) {
            this.textObject.setText("");
        }

        // シーンの更新ループに登録
        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.add(this);
        }
    }

    parseTags(text) {
        let cleanText = "";
        const tagEvents = new Map();

        // 正規表現でタグを抽出: {tag:value} or {tag:val1:val2}
        // 単純なループで処理
        let i = 0;
        while (i < text.length) {
            if (text[i] === '{') {
                const closeIndex = text.indexOf('}', i);
                if (closeIndex !== -1) {
                    const content = text.substring(i + 1, closeIndex);
                    // タグ形式確認 (簡易: コロンが含まれているか、または特定のキーワード)
                    // {se:name}, {cam:shake}, {chara:emote}
                    if (content.includes(':') || content.startsWith('wait')) {
                        // 有効なタグとみなす
                        const parts = content.split(':');
                        const type = parts[0];
                        const args = parts.slice(1);

                        // 現在のcleanText長の位置に登録
                        const idx = cleanText.length;
                        if (!tagEvents.has(idx)) {
                            tagEvents.set(idx, []);
                        }
                        tagEvents.get(idx).push({ type, args });

                        i = closeIndex + 1;
                        continue;
                    }
                }
            }

            cleanText += text[i];
            i++;
        }

        return { cleanText, tagEvents };
    }

    set fullText(val) {
        // 外部からテキスト更新された場合 (ハイライト処理など)
        const parsed = this.parseTags(val);
        this.cleanText = parsed.cleanText;
        this.tagEvents = parsed.tagEvents;
        this.charIndex = 0;
    }

    get fullText() {
        return this.cleanText; // getterとしては表示用テキストを返す
    }

    start() {
        this.startTyping();
    }

    startTyping() {
        if (this.typeTimer) this.typeTimer.remove();

        this.isTyping = true;
        this.typeTimer = this.scene.time.addEvent({
            delay: this.typingSpeed,
            callback: this.typeNextChar,
            callbackScope: this,
            loop: true
        });
    }

    typeNextChar() {
        if (this.scene.isPaused || !this.gameObject || !this.gameObject.active) {
            if (this.typeTimer) this.typeTimer.remove();
            return;
        }

        // ★ タグ実行 (今の文字を表示する直前、または表示されたタイミング)
        // ここでは「表示する文字の直前」に実行する
        if (this.tagEvents.has(this.charIndex)) {
            const tags = this.tagEvents.get(this.charIndex);
            tags.forEach(tag => this.executeTag(tag));
            // タグ実行済みとして削除は不要（インデックスが進むので）
        }

        if (this.charIndex < this.cleanText.length) {
            this.charIndex++;
            const visibleText = this.cleanText.substring(0, this.charIndex);

            if (this.textObject && this.textObject.active) {
                this.textObject.setText(visibleText);
            }

            // タイプ音再生
            this.playTypeSound();
        } else {
            this.isTyping = false;
            this.isComplete = true;
            if (this.typeTimer) this.typeTimer.remove();

            // ★ typewriterモードの場合、完了後に一定時間待って消える
            if (this.style === 'typewriter' && this.gameObject && this.gameObject.active) {
                this.scene.time.delayedCall(this.waitAfterType, () => {
                    if (this.gameObject && this.gameObject.active) {
                        this.onExitScreen();
                    }
                });
            }
        }
    }

    executeTag(tag) {
        console.log(`[TestimonyFlow] Executing tag: ${tag.type}`, tag.args);

        switch (tag.type) {
            case 'se':
                // {se:pop}
                this.playSe(tag.args[0]);
                break;
            case 'cam':
                // {cam:shake}
                if (tag.args[0] === 'shake') {
                    this.scene.cameras.main.shake(200, 0.01);
                }
                break;
            case 'chara':
                // {chara:emotion} -> update current logic?
                // TrialSegmentManager側で管理しているキャラ画像の切り替えは少し遠い。
                // 簡易的にシーンイベントを発行するか、GlobalRegistry経由などで操作。
                // ここでは簡易的に実装しない、またはイベント発行のみ。
                // TODO: キャラクター表情変更の実装
                break;
            default:
                break;
        }
    }

    playSe(seName) {
        const systemScene = this.scene.scene.get('SystemScene');
        const soundManager = systemScene?.registry.get('soundManager');
        if (soundManager && seName) {
            soundManager.playSe(seName);
        }
    }

    playTypeSound() {
        this.playSe('popopo');
    }

    update(time, delta) {
        if (this.scene.isPaused || !this.gameObject || !this.gameObject.active) return;

        const timeScale = this.scene.time.timeScale;

        // ★ scrollモードのみ移動する
        if (this.style === 'scroll') {
            // 横移動 (timeScaleを考慮)
            this.gameObject.x -= (this.moveSpeed * delta * timeScale) / 1000;

            // 画面外判定
            // 固定値 -1200 ではなく、オブジェクトの幅に基づいて「見えなくなったらすぐ」次へ
            const width = this.textObject ? this.textObject.width : 400;
            if (this.gameObject.x < -width - 50) {
                this.onExitScreen();
            }
        }
    }

    onExitScreen() {
        // ★ 終了イベントを発行（Manager側が次を出すタイミングを計るため）
        this.scene.events.emit('TESTIMONY_FINISHED');

        // 破棄
        if (this.gameObject && this.gameObject.active) {
            this.gameObject.destroy();
        }
    }

    destroy() {
        if (this.typeTimer) this.typeTimer.remove();
        if (this.scene.updatableComponents) {
            this.scene.updatableComponents.delete(this);
        }
    }
}
