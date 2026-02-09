import { ComponentRegistry } from '../components/index.js';
/**､
 * データ駆動型ゲームシーンの基底クラス。
 * JSONレイアウトファイルに基づいてシーンを構築し、
 * インゲームエディタとの連携機能を提供する。
 */
export default class BaseGameScene extends Phaser.Scene {

    constructor(config) {
        super(config);
        // このクラスで定義されている他のプロパティは変更なし
        this.dynamicColliders = [];
        this.actionInterpreter = null;
        this.keyPressEvents = new Map();
        this.layoutDataKey = null;
        this.updatableComponents = new Set();
        this._deferredActions = [];
        this.joystick = null;

        this._sceneSettingsApplied = false;
        this.ySortEnabled = false;
        this.ySortableObjects = new Set(); // ★ ArrayからSetに変更
        this.layer = {}; // ★ レイヤーコンテナを保持するオブジェクトを追加
    }
    /**
    * ★★★ 新規メソッド ★★★
    * シーンが起動する際にPhaserによって自動的に呼び出される
    * SystemSceneから渡されたデータを受け取る
    * @param {object} data - SystemScene.launch()から渡されたデータ
    */
    init(data) {
        // dataオブジェクトが存在し、その中にlayoutDataKeyプロパティがあれば、
        // それをこのシーンのプロパティとして保存する
        if (data && data.layoutDataKey) {
            this.layoutDataKey = data.layoutDataKey;
            // console.log(`[${this.scene.key}] Initialized with specific layout data key: '${this.layoutDataKey}'`);
        } else {
            // 指定がなければ、nullのまま
            this.layoutDataKey = null;
            // console.log(`[${this.scene.key}] Initialized without specific layout data key.`);
        }
        this.loadData = data.loadData || null; // ★ ロードデータを受け取る

    }
    create() {
        this.actionInterpreter = this.registry.get('actionInterpreter');
        if (!this.actionInterpreter) {
            console.error(`[${this.scene.key}] CRITICAL: ActionInterpreter not found in registry!`);
        }
        // このメソッドは、継承先（JumpSceneなど）で super.create() として
        // 呼び出されることを想定していますが、中身は空で構いません。
        const keyToLoad = this.layoutDataKey || this.scene.key;
        const layoutData = this.cache.json.get(keyToLoad);
        this.sceneSettings = layoutData?.scene_settings || {};
        this.ySortEnabled = layoutData?.scene_settings?.ySortEnabled === true;

        if (this.ySortEnabled) {
            // console.log("[BaseGameScene] Y-Sort is enabled for this scene.");
        }
        this.applySceneSettings();

    }
    /**
         * ★★★ 新規追加 ★★★
         * エディタからジョイスティックを追加するためのプレースホルダー（空の器）。
         * ジョイスティックを必要とするシーン（JumpSceneなど）は、このメソッドをオーバーライドして
         * 具体的な生成ロジックを実装する。
         */
    addJoystickFromEditor(isFromEditor = true) {
        // BaseGameSceneの時点では、何もしない。
        // これにより、ジョイスティックが不要なシーンでエラーが出るのを防ぐ。
        if (isFromEditor) {
            alert(`このシーンタイプ (${this.scene.key}) は、ジョイスティックの追加に対応していません。`);
        }
        console.warn(`[BaseGameScene] addJoystickFromEditor was called on a scene that does not support it.`);
    }
    // in src/scenes/BaseGameScene.js (クラス内のどこかに追加)

    /** ★★★ 新設 ★★★
     * JSONデータからシーン設定を読み込み、適用する。
     */
    // applySceneSettings() メソッド内
    applySceneSettings() {
        const key = this.layoutDataKey || this.scene.key;
        const data = this.cache.json.get(key);
        if (data && data.scene_settings) {
            const s = data.scene_settings;
            if (s.backgroundColor) this.cameras.main.setBackgroundColor(s.backgroundColor);
            if (this.matter && this.matter.world && s.gravity) {
                this.matter.world.engine.gravity.x = s.gravity.enabled ? (s.gravity.x || 0) : 0;
                this.matter.world.engine.gravity.y = s.gravity.enabled ? (s.gravity.y || 0) : 0;
                this.matter.world.engine.gravity.scale = s.gravity.enabled ? (s.gravity.scale ?? 0.001) : 0;
            }
        }

        // ★ デュアルカメラシステムの設定
        // メインカメラは既存。UIカメラを追加。
        if (!this.uiCamera) {
            this.uiCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height).setName('UICamera');
            this.uiCamera.setScroll(0, 0);
            this.uiCamera.setTransparent(true);
        }
    }

    initSceneWithData() {
        const sys = this.scene.get('SystemScene').events;
        sys.off('start_tutorial', this.handleStartTutorial, this);
        sys.on('start_tutorial', this.handleStartTutorial, this);
        const key = this.layoutDataKey || this.scene.key;
        const data = this.cache.json.get(key);
        if (data) {
            this.createAnimationsFromLayout(data);
            this.loadData = data;
            this.buildSceneFromLayout(data);
        } else {
            console.warn(`[BaseGameScene] No layout data: ${key}`);
            this.finalizeSetup([]);
        }
        this.matter.world.on('beforeupdate', () => {
            const g = this.matter.world.engine.gravity;
            this.children.list.forEach(obj => {
                if (obj.body && obj.getData('ignoreGravity')) {
                    const f = { x: -(obj.body.mass * g.x * g.scale), y: -(obj.body.mass * g.y * g.scale) };
                    Phaser.Physics.Matter.Matter.Body.applyForce(obj.body, obj.body.position, f);
                }
            });
        });
    }

    createAnimationsFromLayout(data) {
        if (!data.animations || !Array.isArray(data.animations)) return;
        data.animations.forEach(a => {
            if (!this.anims.exists(a.key)) {
                this.anims.create({
                    key: a.key,
                    frames: this.anims.generateFrameNumbers(a.texture, { start: a.frames.start, end: a.frames.end }),
                    frameRate: a.frameRate,
                    repeat: a.repeat
                });
            }
        });
    }

    deferAction(action) { this._deferredActions.push(action); }

    handleStartTutorial(id) {
        if (id) this.scene.get('SystemScene').events.emit('request-overlay', { from: this.scene.key, scenario: id, block_input: false });
    }

    addCroppedTilemapChunk(key, rect) {
        if (rect.width <= 0 || rect.height <= 0) return null;
        const rt = this.make.renderTexture({ width: rect.width, height: rect.height }, false);
        const img = this.add.image(-9000, -9000, key).setOrigin(0, 0).setCrop(rect.x, rect.y, rect.width, rect.height);
        rt.draw(img, 0, 0); img.destroy();
        const newKey = `${key}_chunk_${Date.now()}`; rt.saveTexture(newKey); rt.destroy();
        const obj = this.add.image(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y, newKey);
        obj.name = newKey; obj.setData('cropSource', { key, rect });
        const l = { name: obj.name, type: 'Image', x: Math.round(obj.x), y: Math.round(obj.y), layer: 'Gameplay', physics: { isStatic: true } };
        this.applyProperties(obj, l); this.initComponentsAndEvents(obj);
        return obj;
    }

    addTextObjectFromEditor(name, layer) {
        const l = { name, type: 'Text', text: 'New Text', x: Math.round(this.cameras.main.midPoint.x), y: Math.round(this.cameras.main.midPoint.y), style: { fontSize: '32px', fill: '#fff' }, layer };
        const obj = this.createObjectFromLayout(l); this.applyProperties(obj, l);
        return obj;
    }

    buildSceneFromLayout(data) {
        if (!data) { this.finalizeSetup([]); return; }
        if (this.editorUI && data.layers) this.editorUI.setLayers(data.layers);
        const objs = [];
        if (data.objects) {
            data.objects.forEach(l => {
                const obj = this.createObjectFromLayout(l);
                if (obj) { this.applyProperties(obj, l); this.initComponentsAndEvents(obj); objs.push(obj); }
            });
        }
        this.finalizeSetup(objs);
    }

    createObjectFromLayout(layout) {
        let key = layout.texture || '__DEFAULT';
        if (layout.textureData) {
            const restoredKey = `chunk_restored_${Date.now()}_${Math.random()}`;
            try { this.textures.addBase64(restoredKey, layout.textureData); key = restoredKey; } catch (e) { console.error(`[BaseGameScene] Restore Fail`, e); }
        }
        if (layout.type === 'Text') {
            const s = layout.style || { fontSize: '32px', fill: '#fff' };
            const obj = new Phaser.GameObjects.Text(this, 0, 0, layout.text || '', s);
            if (s.shadow && s.shadow.color) obj.setShadow(s.shadow.offsetX, s.shadow.offsetY, s.shadow.color, s.shadow.blur || 0, s.shadow.stroke, s.shadow.fill);
            return obj;
        }
        if (layout.type === 'Sprite') return new Phaser.GameObjects.Sprite(this, 0, 0, key);
        if (layout.type === 'Container' || layout.type === 'container') return new Phaser.GameObjects.Container(this, 0, 0);
        if (layout.type === 'Graphics' || layout.type === 'graphics') return new Phaser.GameObjects.Graphics(this);
        return new Phaser.GameObjects.Image(this, 0, 0, key);
    }

    initComponentsAndEvents(gameObject) {
        if (gameObject.components) {
            for (const key in gameObject.components) {
                const component = gameObject.components[key];
                if (this.updatableComponents.has(component)) this.updatableComponents.delete(component);
                if (component && component.destroy) component.destroy();
            }
        }
        gameObject.components = {};
        const componentsData = gameObject.getData('components');
        const componentsToStart = [];
        if (componentsData) {
            const normalized = Array.isArray(componentsData) ? componentsData : Object.entries(componentsData).map(([type, params]) => ({ type, params }));
            normalized.forEach(c => {
                const instance = this.addComponent(gameObject, c.type, c.params);
                if (instance) {
                    if (typeof instance.update === 'function') this.updatableComponents.add(instance);
                    componentsToStart.push(instance);
                }
            });
        }
        this.applyEventsAndEditorFunctions(gameObject, gameObject.getData('events'));
        componentsToStart.forEach(comp => {
            if (typeof comp.start === 'function') {
                try { comp.start(); } catch (e) { console.error(`[BaseGameScene] Component start error:`, e); }
            }
        });
    }

    applyProperties(gameObject, data) {
        gameObject.name = data.name || 'untitled';
        if (data.data) { for (const key in data.data) gameObject.setData(key, data.data[key]); }
        ['components', 'events', 'group', 'layer'].forEach(k => { if (data[k]) gameObject.setData(k, data[k]); });

        if (data.texture && (gameObject instanceof Phaser.GameObjects.Sprite || gameObject instanceof Phaser.GameObjects.Image)) gameObject.setTexture(data.texture);
        if (data.frame !== undefined && gameObject instanceof Phaser.GameObjects.Sprite) gameObject.setFrame(data.frame);

        gameObject.setPosition(data.x ?? 0, data.y ?? 0);
        gameObject.setAngle(data.angle ?? 0);
        gameObject.setAlpha(data.alpha ?? 1);
        gameObject.setDepth(data.depth ?? 0);
        gameObject.setVisible(data.visible ?? true);

        if (data.ySort) this.ySortableObjects.add(gameObject);
        if (data.originX !== undefined || data.originY !== undefined) gameObject.setOrigin(data.originX ?? 0.5, data.originY ?? 0.5);

        if (data.physics) {
            this.matter.add.gameObject(gameObject, data.physics);
            if (data.physics.isStatic) gameObject.setStatic(true);
            if (data.physics.isSensor) gameObject.setSensor(true);
            if (data.physics.friction !== undefined) gameObject.setFriction(data.physics.friction);
            if (data.physics.restitution !== undefined) gameObject.setBounce(data.physics.restitution);
            if (data.physics.fixedRotation !== undefined) gameObject.setFixedRotation(data.physics.fixedRotation);
            if (data.physics.ignoreGravity !== undefined) gameObject.setData('ignoreGravity', data.physics.ignoreGravity);
            if (data.physics.collisionFilter) gameObject.setCollisionCategory(data.physics.collisionFilter.category).setCollidesWith(data.physics.collisionFilter.mask);
        } else {
            gameObject.setScale(data.scaleX ?? 1, data.scaleY ?? 1);
        }

        // ★ レイヤーまたは表示リストへの追加ロジックを復元
        if (data.layer) {
            if (!this.layer[data.layer]) {
                this.layer[data.layer] = this.add.container(0, 0).setName(data.layer);
                // ★ レイヤーごとのデフォルト深度を設定
                const depths = { 'Background': 0, 'Gameplay': 10, 'UI': 100, 'Overlay': 1000 };
                if (depths[data.layer] !== undefined) this.layer[data.layer].setDepth(depths[data.layer]);
            }
            this.layer[data.layer].add(gameObject);
        } else if (!gameObject.parentContainer) {
            // 親コンテナ（Container内の子要素）でなければ、シーンに直接追加
            this.add.existing(gameObject);

            // ★ 動的なカメラ振り分け
            if (this.uiCamera) {
                if (data.layer === 'UI') {
                    this.cameras.main.ignore(gameObject);
                } else {
                    this.uiCamera.ignore(gameObject);
                }
            }
        }

        if (gameObject instanceof Phaser.GameObjects.Graphics && data.draw) this.applyGraphicsProperties(gameObject, data.draw);

        if (gameObject instanceof Phaser.GameObjects.Container && data.list) {
            data.list.forEach(childLayout => {
                const child = this.createObjectFromLayout(childLayout);
                if (child) {
                    this.applyProperties(child, childLayout);
                    // Container.add(child) はすでに行われる（applyProperties内で再帰的に呼ばれるため不要だが、
                    // 明示的にここで呼ぶか、applyProperties側のロジックに任せるか。
                    // 現状の applyProperties の data.layer がない場合は add.existing されるので注意。
                    // Containerの子要素の場合は parentContainer がセットされるはずだが、
                    // new 直後はセットされていないため、第二引数等で制御する必要がある。
                    if (!child.parentContainer) gameObject.add(child);
                    this.initComponentsAndEvents(child);
                }
            });
        }
    }

    applyGraphicsProperties(graphics, draw) {
        if (!draw) return;
        graphics.clear();
        if (draw.lineStyle) {
            graphics.lineStyle(draw.lineStyle.width || 0, parseInt(draw.lineStyle.color, 16) || 0xffffff, draw.lineStyle.alpha ?? 1);
        }
        if (draw.fill) {
            graphics.fillStyle(parseInt(draw.fill.color, 16) || 0xffffff, draw.fill.alpha ?? 1);
        }
        switch (draw.type) {
            case 'roundedRect':
                if (draw.fill) graphics.fillRoundedRect(draw.x, draw.y, draw.width, draw.height, draw.radius || 0);
                if (draw.lineStyle) graphics.strokeRoundedRect(draw.x, draw.y, draw.width, draw.height, draw.radius || 0);
                break;
            case 'rect':
                if (draw.fill) graphics.fillRect(draw.x, draw.y, draw.width, draw.height);
                if (draw.lineStyle) graphics.strokeRect(draw.x, draw.y, draw.width, draw.height);
                break;
            case 'circle':
                if (draw.fill) graphics.fillCircle(draw.x, draw.y, draw.radius);
                if (draw.lineStyle) graphics.strokeCircle(draw.x, draw.y, draw.radius);
                break;
        }
    }

    applyEventsAndEditorFunctions(gameObject, eventsData) {
        const events = eventsData || [];
        gameObject.setData('events', events);
        gameObject.off('pointerdown');
        gameObject.off('onStateChange');
        gameObject.off('onDirectionChange');

        events.forEach(eventData => {
            if (eventData.trigger === 'onClick' || eventData.trigger === 'onPointerDown') {
                gameObject.setInteractive({ useHandCursor: true });
                gameObject.on('pointerdown', () => {
                    const ai = this.registry.get('actionInterpreter');
                    if (ai) ai.run(gameObject, eventData, null);
                });
            } else if (eventData.trigger === 'onStateChange' || eventData.trigger === 'onDirectionChange') {
                const signal = eventData.trigger === 'onStateChange' ? 'onStateChange' : 'onDirectionChange';
                gameObject.on(signal, (val1, val2) => {
                    const context = signal === 'onStateChange' ? { state: val1, oldState: val2 } : { direction: val1 };
                    this.evaluateConditionAndRun(gameObject, eventData, context);
                });
            }
        });

        const editor = this.plugins.get('EditorPlugin');
        if (editor && editor.isEnabled) editor.makeEditable(gameObject, this);
    }

    evaluateConditionAndRun(gameObject, eventData, context) {
        let conditionMet = true;
        if (eventData.condition) {
            try {
                const func = new Function(...Object.keys(context), `'use strict'; return (${eventData.condition});`);
                conditionMet = func(...Object.values(context));
            } catch (e) {
                console.warn(`[BaseGameScene] Condition error: "${eventData.condition}"`, e);
                conditionMet = false;
            }
        }
        if (conditionMet) {
            const ai = this.registry.get('actionInterpreter');
            if (ai) ai.run(gameObject, eventData, gameObject);
        }
        return conditionMet;
    }

    handleOverlap(src, tar, phase) {
        const ai = this.registry.get('actionInterpreter'), evs = src.getData('events');
        if (!ai || !evs) return;
        const key = `overlap_${tar.name || tar.id}`, was = src.getData(key);
        if (phase === 'active' && !was) {
            src.setData(key, true);
            evs.forEach(e => { if (e.trigger === 'onOverlap_Start' && e.targetGroup === tar.getData('group')) ai.run(src, e, tar); });
        } else if (phase === 'end' && was) {
            src.setData(key, false);
            evs.forEach(e => { if (e.trigger === 'onOverlap_End' && e.targetGroup === tar.getData('group')) ai.run(src, e, tar); });
        }
    }

    handleCollision(src, tar, pair) {
        const ai = this.registry.get('actionInterpreter'), evs = src.getData('events');
        if (!ai || !evs) return;
        evs.forEach(e => {
            if (e.targetGroup !== tar.getData('group')) return;
            if (e.trigger === 'onCollide_Start') ai.run(src, e, tar);
            else if (e.trigger === 'onStomp' || e.trigger === 'onHit') {
                let norm = pair.collision.normal; if (src.body === pair.bodyB) norm = { x: -norm.x, y: -norm.y };
                const stomp = norm.y < -0.7;
                if ((e.trigger === 'onStomp' && stomp) || (e.trigger === 'onHit' && !stomp)) ai.run(src, e, tar);
            }
        });
    }

    addComponent(target, type, params = {}) {
        if (target.components && target.components[type]) return target.components[type];
        const Class = ComponentRegistry[type];
        if (!Class) return null;
        const inst = new Class(this, target, params);
        if (!target.components) target.components = {};
        target.components[type] = inst;
        let data = target.getData('components') || [];
        if (!Array.isArray(data)) data = Object.entries(data).map(([t, p]) => ({ type: t, params: p }));
        if (!data.some(c => c.type === type)) { data.push({ type, params }); target.setData('components', data); }
        const ed = this.plugins.get('EditorPlugin');
        if (ed && ed.isEnabled && ed.onComponentAdded) ed.onComponentAdded(target, type, params);
        return inst;
    }

    update(time, delta) {
        if (this._deferredActions.length > 0) {
            const arr = [...this._deferredActions]; this._deferredActions.length = 0;
            arr.forEach(a => a());
        }
        if (this.updatableComponents) {
            this.updatableComponents.forEach(c => {
                // ★ gameObject が存在し、かつアクティブな場合のみ update を実行
                const target = c.gameObject;
                if ((!target || target.active) && c.update) try { c.update(time, delta); } catch (e) { }
            });
        }
        if (this.ySortEnabled) {
            this.children.list.filter(o => o.active && o.getData('layer') === 'Gameplay').forEach(obj => {
                const sy = obj.body ? Math.round(obj.body.position.y) : Math.round(obj.y);
                if (obj.depth !== sy) obj.setDepth(sy);
            });
        }
        this.handleKeyPressEvents();
    }

    finalizeSetup(allGameObjects) {
        // ★ デュアルカメラの振り分け設定
        if (this.uiCamera) {
            // UIカメラはデフォルトですべてを無視し、UIレイヤーのみを表示する
            // メインカメラはUIレイヤーのみを無視する

            this.cameras.main.ignore(Object.values(this.layer).filter(l => l.name === 'UI'));

            // UIカメラの設定: UI以外のレイヤーをすべて無視
            const nonUiLayers = Object.values(this.layer).filter(l => l.name !== 'UI');
            this.uiCamera.ignore(nonUiLayers);

            // レイヤーに属していないオブジェクトもUIカメラからは無視する
            this.children.list.forEach(child => {
                if (!child.getData('layer') && child !== this.uiCamera && !Object.values(this.layer).includes(child)) {
                    this.uiCamera.ignore(child);
                }
            });
        }

        for (const gameObject of allGameObjects) {
            const events = gameObject.getData('events');
            if (events) {
                events.forEach(eventData => {
                    if (eventData.trigger === 'onReady') {
                        const actionInterpreter = this.registry.get('actionInterpreter');
                        if (actionInterpreter) actionInterpreter.run(gameObject, eventData, gameObject);
                    }
                });
            }
        }
        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach(pair => {
                if (pair.bodyA.gameObject && pair.bodyB.gameObject) {
                    this.handleCollision(pair.bodyA.gameObject, pair.bodyB.gameObject, pair);
                    this.handleCollision(pair.bodyB.gameObject, pair.bodyA.gameObject, pair);
                }
            });
        });
        this.matter.world.on('collisionactive', (event) => {
            event.pairs.forEach(pair => {
                if ((pair.bodyA.isSensor || pair.bodyB.isSensor) && pair.bodyA.gameObject && pair.bodyB.gameObject) {
                    this.handleOverlap(pair.bodyA.gameObject, pair.bodyB.gameObject, 'active');
                    this.handleOverlap(pair.bodyB.gameObject, pair.bodyA.gameObject, 'active');
                }
            });
        });
        this.matter.world.on('collisionend', (event) => {
            event.pairs.forEach(pair => {
                if ((pair.bodyA.isSensor || pair.bodyB.isSensor) && pair.bodyA.gameObject && pair.bodyB.gameObject) {
                    this.handleOverlap(pair.bodyA.gameObject, pair.bodyB.gameObject, 'end');
                    this.handleOverlap(pair.bodyB.gameObject, pair.bodyA.gameObject, 'end');
                }
            });
        });
        if (this.onSetupComplete) this.onSetupComplete();
        this.events.emit('scene-ready');
    }

    onEditorEventChanged(targetObject) {
        this.applyEventsAndEditorFunctions(targetObject, targetObject.getData('events'));
    }

    _addObjectFromEditorCore(createLayout, newName, layerName) {
        const centerX = this.cameras.main.scrollX + this.cameras.main.width / 2;
        const centerY = this.cameras.main.scrollY + this.cameras.main.height / 2;
        const newLayout = { ...createLayout, name: newName, x: Math.round(centerX), y: Math.round(centerY), layer: layerName };
        const obj = this.createObjectFromLayout(newLayout);
        if (obj) {
            this.applyProperties(obj, newLayout);
            this.initComponentsAndEvents(obj);
        }
        return obj;
    }

    addObjectFromEditor(assetKey, newName, layerName) {
        return this._addObjectFromEditorCore({ texture: assetKey, type: 'Image' }, newName, layerName);
    }

    handleKeyPressEvents() {
        const interpreter = this.registry.get('actionInterpreter');
        if (!interpreter) return;
        for (const [key, events] of this.keyPressEvents.entries()) {
            const keyObj = this.input.keyboard.addKey(key);
            if (Phaser.Input.Keyboard.JustDown(keyObj)) {
                events.forEach(e => interpreter.run(this, e, this));
            }
        }
    }

    addPrefabFromEditor(prefabKey, newName, layerName) {
        const prefabData = this.cache.json.get(prefabKey);
        if (!prefabData) return null;
        const spawnPos = { x: this.cameras.main.scrollX + this.cameras.main.width / 2, y: this.cameras.main.scrollY + this.cameras.main.height / 2 };
        if (prefabData.type === 'GroupPrefab') {
            const gid = `group_${newName}_${Phaser.Math.RND.uuid().substr(0, 4)}`;
            const created = prefabData.objects.map(c => {
                const l = { ...c, x: spawnPos.x + (c.x || 0), y: spawnPos.y + (c.y || 0), group: gid, layer: layerName };
                const obj = this.createObjectFromLayout(l);
                if (obj) {
                    this.applyProperties(obj, l);
                    this.initComponentsAndEvents(obj);
                }
                return obj;
            });
            return created;
        } else {
            const l = { ...prefabData, name: newName, x: spawnPos.x, y: spawnPos.y, layer: layerName };
            const obj = this.createObjectFromLayout(l);
            if (obj) {
                this.applyProperties(obj, l);
                this.initComponentsAndEvents(obj);
            }
            return obj;
        }
    }

    extractLayoutFromObject(gameObject) {
        if (!gameObject || !gameObject.scene) return {};
        const layout = {
            name: gameObject.name, type: gameObject.constructor.name,
            x: Math.round(gameObject.x), y: Math.round(gameObject.y),
            scaleX: gameObject.scaleX, scaleY: gameObject.scaleY,
            angle: gameObject.angle, alpha: gameObject.alpha, depth: gameObject.depth,
            group: gameObject.getData('group'), layer: gameObject.getData('layer'),
            components: gameObject.getData('components'), events: gameObject.getData('events'),
        };
        if (gameObject instanceof Phaser.GameObjects.Text) {
            layout.text = gameObject.text; layout.style = gameObject.style.toJSON();
        } else if (gameObject.texture) {
            layout.texture = gameObject.texture.key;
            if (gameObject.frame) layout.frame = gameObject.frame.name;
        }
        if (gameObject.body) {
            layout.physics = { isStatic: gameObject.body.isStatic, isSensor: gameObject.body.isSensor, friction: gameObject.body.friction, restitution: gameObject.body.restitution };
        }
        return layout;
    }

    shutdown() { super.shutdown(); }
}
