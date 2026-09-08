/**
 * 外部リンク定数
 *
 * fork 版のため、本家「みらい議会」やチームみらいへ利用者を送る導線
 * （寄附など）は置かない。FORK_GUIDELINES.md の第7条(d)を参照。
 */
export const EXTERNAL_LINKS = {
  REPORT: "https://forms.gle/wJXXMt6cv2ZdiCgg6",
  ABOUT_NOTE: "https://note.com/team_mirai_jp/n/nd1656aa5f86d",
  TEAM_MIRAI_ABOUT: "https://team-mir.ai/about",
  TERMS: "https://team-mir.ai/terms",
  PRIVACY: "https://team-mir.ai/privacy",
  FAQ: "https://team-mirai.notion.site/FAQ-28cf6f56bae180bd84e7f7ae80f806a1",
  FORK_GUIDELINES_NOTE: "https://note.com/team_mirai_jp/n/nc59ec347e8c7",
  // AGPL-3.0 第13条により、改変版（この fork）のソースを示す必要がある。
  // 本家のリポジトリを指してはならない。
  GITHUB_REPO: "https://github.com/takase-del/mirai-gikai-minamiuonuma",
  /** 本家「みらい議会」。免責文言と併記して混同を避けるために使う。 */
  UPSTREAM_MIRAI_GIKAI: "https://gikai.team-mir.ai/",
} as const;
