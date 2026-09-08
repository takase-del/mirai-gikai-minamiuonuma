import { getBillsByFeaturedTags } from "@/features/bills/server/loaders/get-bills-by-featured-tags";
import { getComingSoonBills } from "./get-coming-soon-bills";
import { getFeaturedBills } from "./get-featured-bills";
import { getPreviousSessionBills } from "./get-previous-session-bills";

/**
 * トップページ用のデータを並列取得する
 * BFF (Backend For Frontend) パターン
 *
 * @param now アーカイブに出す会期を決める基準時刻（日本時間）
 */
export async function loadHomeData(now: Date) {
  const [featuredBills, billsByTag, comingSoonBills, previousSessionData] =
    await Promise.all([
      getFeaturedBills(),
      getBillsByFeaturedTags(),
      getComingSoonBills(),
      getPreviousSessionBills(now),
    ]);

  return {
    billsByTag,
    featuredBills,
    comingSoonBills,
    previousSessionData,
  };
}
