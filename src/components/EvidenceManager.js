/**
 * 証拠品マネージャー
 * プレイヤーが所持している証拠品の状態を管理し、evidence_db.jsonからデータを取得する。
 */
export default class EvidenceManager {
  constructor(scene) {
    this.scene = scene;
    this.db = null;
  }

  /**
   * 初期化: DBのロードを行う
   */
  init() {
    // DBはPreloadSceneなどでロード済みであることを期待するが、
    // ここでは安全のためキャッシュを確認
    const dbData = this.scene.cache.json.get("evidence_db");
    if (dbData) {
      this.db = dbData.evidence_list;
    } else {
      console.warn("[EvidenceManager] evidence_db not found in cache.");
      this.db = [];
    }
  }

  /**
   * 証拠品を所持しているかチェック
   */
  hasEvidence(evidenceId) {
    const list = this._getEvidenceList();
    return list.includes(evidenceId);
  }

  /**
   * 証拠品を追加する
   */
  addEvidence(evidenceId) {
    if (!this.getEvidenceData(evidenceId)) {
      console.warn(
        `[EvidenceManager] Evidence ID '${evidenceId}' not found in DB.`,
      );
      return;
    }

    const list = this._getEvidenceList();
    if (!list.includes(evidenceId)) {
      list.push(evidenceId);
      this._saveEvidenceList(list);
      console.log(`[EvidenceManager] Added evidence: ${evidenceId}`);

      // UI更新通知などはState変更経由で伝わるはずだが、必要ならemit
      this.scene.events.emit("EVIDENCE_ADDED", evidenceId);
    }
  }

  /**
   * 証拠品データを取得する
   */
  getEvidenceData(evidenceId) {
    if (!this.db) this.init();
    return this.db.find((e) => e.id === evidenceId);
  }

  /**
   * 所持している全ての証拠品のデータを取得する
   */
  getAllPossessedEvidence() {
    const list = this._getEvidenceList();
    return list
      .map((id) => this.getEvidenceData(id))
      .filter((e) => e !== undefined);
  }

  // --- Private / Internal Helpers ---

  _getEvidenceList() {
    const stateManager = this.scene.registry.get("stateManager");
    if (stateManager) {
      let list = stateManager.getF("evidence_list");
      if (!Array.isArray(list)) {
        list = [];
      }
      return list;
    }
    return [];
  }

  _saveEvidenceList(list) {
    const stateManager = this.scene.registry.get("stateManager");
    if (stateManager) {
      stateManager.setF("evidence_list", list);
    }
  }
}
