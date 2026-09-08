import type { Database } from "@mirai-gikai/supabase";
import {
  BILL_STATUS_LABELS,
  SUBMITTER_LABELS,
} from "@mirai-gikai/shared/vocabulary";

// Database types
export type Bill = Database["public"]["Tables"]["bills"]["Row"];
export type BillInsert = Database["public"]["Tables"]["bills"]["Insert"];
export type BillUpdate = Database["public"]["Tables"]["bills"]["Update"];

export type BillContent = Database["public"]["Tables"]["bill_contents"]["Row"];
export type BillContentInsert =
  Database["public"]["Tables"]["bill_contents"]["Insert"];
export type BillContentUpdate =
  Database["public"]["Tables"]["bill_contents"]["Update"];

export type MiraiStance = Database["public"]["Tables"]["mirai_stances"]["Row"];

// Enums
export type HouseEnum = Database["public"]["Enums"]["house_enum"];
export type BillStatusEnum = Database["public"]["Enums"]["bill_status_enum"];
export type StanceTypeEnum = Database["public"]["Enums"]["stance_type_enum"];

// 公開ステータス型（議案の公開/非公開を管理）
export type BillPublishStatus = "draft" | "published" | "coming_soon";

// Coming Soon議案の型（最小限の情報のみ）
export type ComingSoonBill = {
  id: string;
  name: string; // 正式名称
  title: string | null; // わかりやすいタイトル（bill_contentsから）
  originating_house: HouseEnum;
  shugiin_url: string | null;
};

// Combined types for UI
export type BillWithStance = Bill & {
  mirai_stance?: MiraiStance;
};

export type BillTag = {
  id: string;
  label: string;
};

export type FeaturedTag = {
  id: string;
  label: string;
  priority: number;
};

export type BillWithContent = Bill & {
  bill_content?: BillContent;
  mirai_stance?: MiraiStance;
  tags: BillTag[];
  featured_tag?: FeaturedTag;
  hasPublicInterview?: boolean;
  /** 公開レポート件数。一覧の回答数バッジと「声が集まっている順」に使う。 */
  publicReportCount?: number;
};

// タグごとにグループ化された議案
export type BillsByTag = {
  tag: BillTag & { description?: string; priority: number };
  bills: BillWithContent[];
};

// ステータスのソート順（DBのstatus_order generated columnと一致させる）
export const BILL_STATUS_ORDER: Record<BillStatusEnum, number> = {
  enacted: 0,
  rejected: 1,
  in_receiving_house: 2,
  in_originating_house: 3,
  introduced: 4,
  preparing: 5,
};

/**
 * 提出者区分の表示ラベル。
 *
 * 一院制の市議会では発議院という概念がないため、DB の house_enum を
 * 「市長提出 / 議員提出」として読み替えている。名前を HOUSE_LABELS のまま
 * 残しているのは、本家の更新を取り込むときの衝突を減らすため。
 */
export const HOUSE_LABELS: Record<HouseEnum, string> = SUBMITTER_LABELS;

// ステータスを日本語ラベルに変換する関数
export function getBillStatusLabel(
  status: BillStatusEnum,
  // 一院制では審議中の議院を出し分ける必要がないため参照しない。
  // 呼び出し側の変更を最小にするため引数だけ残している。
  _originatingHouse?: HouseEnum | null
): string {
  return BILL_STATUS_LABELS[status] ?? status;
}

export const STANCE_LABELS: Record<StanceTypeEnum, string> = {
  for: "賛成",
  against: "反対",
  neutral: "中立",
  conditional_for: "条件付き賛成",
  conditional_against: "条件付き反対",
  considering: "検討中",
  continued_deliberation: "継続審査中",
  free_vote: "自由投票",
};
