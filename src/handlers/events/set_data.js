// src/handlers/events/set_data.js

export default async function set_data(interpreter, params) {
    const name = params.name;
    let value = params.value;

    if (name === undefined || value === undefined) {
        console.warn('[set_data] "name" and "value" parameters are required.');
        return;
    }

    const key = name.startsWith('f.') ? name.substring(2) : name;
    const stateManager = interpreter.scene.registry.get('stateManager');
    if (!stateManager) return;

    // stateManager.eval は内部で catch するため失敗時は undefined が返る。
    // 評価不能だった場合は元の生文字列にフォールバックして警告を出す。
    let finalValue = stateManager.eval(value);
    if (finalValue === undefined) {
        console.warn(`[set_data] Failed to evaluate "${value}". Falling back to raw value.`);
        finalValue = value;
    }

    stateManager.setF(key, finalValue);
}

/**
 * ★ VSLエディタ用の自己定義 ★
 */
set_data.define = {
    description: 'ゲーム変数(f.)に値を設定します。値には式も使えます (例: f.score + 100)。',
    params: [
        { key: 'name', type: 'string', label: '変数名 (f.)', defaultValue: 'f.variable' },
        { key: 'value', type: 'string', label: '設定する値/式', defaultValue: '0' }
    ]
};