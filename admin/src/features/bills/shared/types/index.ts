import type { Database } from "@mirai-gikai/supabase";
import {
  BILL_STATUS_LABELS,
  SUBMITTER_LABELS,
} from "@mirai-gikai/shared/vocabulary";

export type Bill = Database["public"]["Tables"]["bills"]["Row"];
export type BillInsert = Database["public"]["Tables"]["bills"]["Insert"];
export type BillUpdate = Database["public"]["Tables"]["bills"]["Update"];

export type BillStatus = Database["public"]["Enums"]["bill_status_enum"];
export type BillPublishStatus =
  Database["public"]["Enums"]["bill_publish_status"];
export type OriginatingHouse = Database["public"]["Enums"]["house_enum"];

export type BillWithContent = Bill & {
  bill_content?: Database["public"]["Tables"]["bill_contents"]["Row"];
};

export type BillWithDietSession = Bill & {
  diet_sessions: { name: string } | null;
};

import type { SortConfig } from "@/lib/sort";

// ソート関連の型定義
export type BillSortField =
  | "created_at"
  | "submitted_date"
  | "status_order"
  | "publish_status_order";

export const BILL_SORT_FIELDS: readonly BillSortField[] = [
  "created_at",
  "submitted_date",
  "status_order",
  "publish_status_order",
] as const;

export type BillSortConfig = SortConfig<BillSortField>;

export const DEFAULT_BILL_SORT: BillSortConfig = {
  field: "created_at",
  order: "desc",
};

// ステータスのソート順（DBのstatus_order generated columnと一致させる）
export const BILL_STATUS_ORDER: Record<BillStatus, number> = {
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
 * 一院制の市議会には発議院がないため、DB の house_enum を
 * 「市長提出 / 議員提出」として読み替えている。
 * 詳細は @mirai-gikai/shared/vocabulary を参照。
 */
export const HOUSE_LABELS: Record<OriginatingHouse, string> = SUBMITTER_LABELS;

// ステータスを日本語ラベルに変換する関数
export function getBillStatusLabel(
  status: BillStatus,
  // 一院制では審議中の議院を出し分ける必要がないため参照しない。
  _originatingHouse?: OriginatingHouse | null
): string {
  return BILL_STATUS_LABELS[status] ?? status;
}
