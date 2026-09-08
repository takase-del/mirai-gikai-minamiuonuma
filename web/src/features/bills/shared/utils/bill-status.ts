import { BILL_CARD_STATUS_LABELS } from "@mirai-gikai/shared/vocabulary";
import type { BillStatusEnum } from "../types";

/** カード用の簡略化されたステータスラベルを取得 */
export function getCardStatusLabel(status: BillStatusEnum): string {
  switch (status) {
    case "introduced":
    case "in_originating_house":
    case "in_receiving_house":
      return BILL_CARD_STATUS_LABELS.deliberating;
    case "enacted":
      return BILL_CARD_STATUS_LABELS.enacted;
    case "rejected":
      return BILL_CARD_STATUS_LABELS.rejected;
    default:
      return BILL_CARD_STATUS_LABELS.preparing;
  }
}

/** ステータスに対応するBadgeのvariantを取得 */
export function getStatusVariant(
  status: BillStatusEnum
): "light" | "default" | "dark" | "muted" {
  switch (status) {
    case "introduced":
    case "in_originating_house":
    case "in_receiving_house":
      return "light";
    case "enacted":
      return "default";
    case "rejected":
      return "dark";
    default:
      return "muted";
  }
}
