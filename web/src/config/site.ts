/**
 * サイト固有の識別情報。
 *
 * 本家 mirai-gikai から fork した際に書き換える値をここに集約している。
 * 文言・色・運営者名を変えたいときは、原則このファイルだけを触れば済む。
 *
 * @see FORK_GUIDELINES.md
 */
export const SITE = {
  /** サービス名。fork ガイドラインにより「みらい議会＠地域名」形式にする */
  name: "みらい議会＠南魚沼市",
  /** PWA 等で使う短縮名 */
  shortName: "みらい議会＠南魚沼",
  description:
    "新潟県南魚沼市の市議会で今どんな議案が審議されているか、わかりやすく伝えるプラットフォーム",

  /** 対象自治体・議会 */
  municipality: "新潟県南魚沼市",
  councilName: "南魚沼市議会",

  /** 運営主体。個人の有志として運営している */
  operator: "みらい議会＠南魚沼市 運営チーム",
  /** 法務ページで「個人情報取扱事業者」として示す氏名 */
  operatorName: "高瀬章充",
  /** 問い合わせ・記載内容の誤り報告の宛先 */
  contactEmail: "takase@socialups.jp",
  /** 利用規約・プライバシーポリシーの最終更新日 */
  policyUpdatedAt: "2026年9月8日",
  copyright: "© 2026 みらい議会＠南魚沼市",

  /**
   * fork ガイドラインで掲示が必須の免責文言。
   * フッターとアバウトセクションの両方に出している。
   */
  disclaimer: "これは政党チームみらいが運営しているものではありません",
  /** 自治体公式と誤認されないための補足 */
  officialDisclaimer:
    "南魚沼市および南魚沼市議会が運営する公式サイトではありません",

  /** themeColor。globals.css の --primary と揃えること */
  themeColor: "#26619c",
} as const;
