/**
 * ドメイン語彙の辞書。
 *
 * fork 元（team-mirai/mirai-gikai）は国会（二院制）を前提に作られている。
 * 本サイトは市議会（一院制）が対象なので、DB のスキーマ・enum はそのまま
 * 残したうえで、**表示ラベルだけをここで読み替える**方針をとる。
 * スキーマを書き換えないのは、本家の更新を取り込み続けられるようにするため。
 *
 * 読み替えの対応表:
 * | 本家（国会）              | 本サイト（市議会）           |
 * |---------------------------|------------------------------|
 * | diet_sessions（国会会期）  | 定例会・臨時会               |
 * | originating_house HR/HC    | 提出者区分 市長提出/議員提出 |
 * | in_originating_house       | 委員会審査中                 |
 * | in_receiving_house         | 本会議審議中                 |
 * | enacted / rejected         | 可決 / 否決                  |
 * | shugiin_url                | 市議会の議案ページURL        |
 *
 * @see web/src/config/site.ts
 */
export const VOCAB = {
  /** 審議機関 */
  assembly: "南魚沼市議会",
  assemblyShort: "市議会",
  /** 審議の対象。国会の「法案」にあたるもの */
  bill: "議案",
  /** 会期の単位 */
  session: "定例会",
  /** 会期中／閉会中の表示 */
  inSession: "定例会 会期中",
  outOfSession: "閉会中",
  /** 一次情報へのリンクラベル（本家の shugiin_url にあたる） */
  officialBillPageLabel: "市議会の議案ページ",
} as const;

/**
 * 提出者区分のラベル。
 *
 * DB の `originating_house`（house_enum: HR/HC）を、一院制の市議会では
 * 「誰が出した議案か」として読み替えて使う。市議会の議案は市長提出が
 * 大半で、残りが議員提出（意見書・決議など）という構成になる。
 */
export const SUBMITTER_LABELS = {
  /** HR = 市長提出議案 */
  HR: "市長提出",
  /** HC = 議員提出議案 */
  HC: "議員提出",
} as const;

/**
 * 議案ステータスのラベル。
 *
 * 二院制の「衆議院審議中／参議院審議中」を、市議会の審議の流れ
 * （上程 → 委員会付託・審査 → 本会議で討論・採決）に読み替える。
 */
export const BILL_STATUS_LABELS = {
  preparing: "上程前",
  introduced: "上程",
  in_originating_house: "委員会審査中",
  in_receiving_house: "本会議審議中",
  enacted: "可決",
  rejected: "否決",
} as const;

/** 議案の進捗バーに出す4ステップ */
export const BILL_PROGRESS_STEPS = [
  { label: "議案\n上程" },
  { label: "委員会\n審査" },
  { label: "本会議\n審議" },
  { label: "議決" },
] as const;

/**
 * 議案カードに出す簡略ステータス。
 * 一覧では審議の段階まで出すと情報過多なので「審議中」にまとめる。
 */
export const BILL_CARD_STATUS_LABELS = {
  deliberating: "審議中",
  enacted: "可決",
  rejected: "否決",
  preparing: "上程前",
} as const;
