/**
 * 外部リンク定数
 *
 * fork 元（team-mirai）のリンクは残さず、本サイト固有のものに差し替える。
 * TODO: CHANGE_ME を含む値は、運営体制が決まり次第 実URLに置き換えること。
 * （REPORT・FAQ が未設定。GITHUB_REPO は設定済み）
 */
export const EXTERNAL_LINKS = {
  /** 記載内容の誤りを報告する窓口 */
  REPORT: "https://example.com/CHANGE_ME/report-form",
  /** よくある質問 */
  FAQ: "https://example.com/CHANGE_ME/faq",

  /**
   * 改変後ソースコードの公開先。
   * AGPL-3.0 第13条により、ネットワーク越しの利用者がソースへ到達できる
   * 必要があるため、フッター等から必ず辿れるようにしておく。
   */
  GITHUB_REPO: "https://github.com/takase-del/mirai-gikai-minamiuonuma",
  /** fork 元の本家サービス（掲載はガイドラインの推奨事項） */
  ORIGINAL_MIRAI_GIKAI: "https://gikai.team-mir.ai/",
  /** fork 元リポジトリ */
  UPSTREAM_REPO: "https://github.com/team-mirai/mirai-gikai",
  FORK_GUIDELINES_NOTE: "https://note.com/team_mirai_jp/n/nc59ec347e8c7",

  /** 南魚沼市議会の一次情報 */
  COUNCIL: "https://www.city.minamiuonuma.niigata.jp/gikai/",
  COUNCIL_MINUTES:
    "https://www.city.minamiuonuma.niigata.jp/gikai/kaigiroku_giketsukekka/",
  COUNCIL_NEWSLETTER:
    "https://www.city.minamiuonuma.niigata.jp/gikai/gikaidayori/",
} as const;
