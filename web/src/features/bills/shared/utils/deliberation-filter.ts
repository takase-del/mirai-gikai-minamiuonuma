/**
 * 審議のされ方による絞り込み。
 *
 * 議決の結果（可決・否決）はステータスのタブで絞れるが、市民が知りたいのは
 * むしろ「議論が分かれた議案はどれか」だと考えた。質疑や討論が行われたか、
 * 全会一致だったかは議事録にしかない情報で、これまで一覧から辿れなかった。
 */
export const DELIBERATION_FILTERS = [
  "all",
  "questioned",
  "debated",
  "split",
] as const;

export type DeliberationFilter = (typeof DELIBERATION_FILTERS)[number];

export const DELIBERATION_FILTER_LABELS: Record<DeliberationFilter, string> = {
  all: "すべて",
  questioned: "質疑あり",
  debated: "討論あり",
  split: "賛否が分かれた",
};

/** 一覧のチップに添える説明。何で絞られるのかを言葉で補う */
export const DELIBERATION_FILTER_HINTS: Record<DeliberationFilter, string> = {
  all: "",
  questioned: "本会議で議員から質疑が出た議案",
  debated: "本会議で賛成・反対の討論が行われた議案",
  split: "全会一致ではなく、賛成多数または賛成少数で議決された議案",
};

export function isDeliberationFilter(
  value: string | undefined
): value is DeliberationFilter {
  return (
    value !== undefined &&
    (DELIBERATION_FILTERS as readonly string[]).includes(value)
  );
}

/** 絞り込みの判定に使う議案の属性 */
export type DeliberationFacts = {
  has_questions: boolean;
  has_debate: boolean;
  is_unanimous: boolean | null;
};

export function matchesDeliberation(
  bill: DeliberationFacts,
  filter: DeliberationFilter
): boolean {
  switch (filter) {
    case "questioned":
      return bill.has_questions;
    case "debated":
      return bill.has_debate;
    case "split":
      // 未議決（null）は「分かれた」とは言えないので含めない
      return bill.is_unanimous === false;
    default:
      return true;
  }
}
