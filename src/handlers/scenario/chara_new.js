/**
 * [chara_new] タグ - キャラクターの定義
 * 
 * キャラクターの管理ID（name）と表示名（jname）を紐付けます。
 * これにより、スクリプト上で #表示名 と書いた際に、正しいスプライトがハイライトされます。
 * 
 * @param {ScenarioManager} manager - ScenarioManagerのインスタンス
 * @param {object} params - { name, jname }
 */
export default async function handleCharaNew(manager, params) {
    const { name, jname } = params;

    if (!name) {
        console.warn('[chara_new] name属性は必須です。');
        return;
    }

    // manager の characterDefs に登録する
    manager.registerCharacter(name, {
        jname: jname || name
    });
}
