import { unstable_cache } from "next/cache";
import { getDifficultyLevel } from "@/features/bill-difficulty/server/loaders/get-difficulty-level";
import type { DifficultyLevelEnum } from "@/features/bill-difficulty/shared/types";
import { getLatestClosedDietSession } from "@/features/diet-sessions/server/loaders/get-latest-closed-diet-session";
import type { DietSession } from "@/features/diet-sessions/shared/types";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { BillWithContent } from "../../shared/types";
import {
  findPreviousSessionBills,
  findTagsByBillIds,
  findBillIdsWithPublicInterview,
  countPublishedBillsByDietSession,
} from "../repositories/bill-repository";

const MAX_PREVIEW_BILLS = 5;

export type PreviousSessionBillsResult = {
  session: DietSession;
  bills: BillWithContent[];
  totalBillCount: number;
} | null;

/**
 * 直近で閉会した会期とその議案を取得（プレビュー用、最大5件）
 * 閉会済みの会期がひとつも無い場合は null を返す
 *
 * どの会期を出すかは `getLatestClosedDietSession` に合わせる。
 */
export async function getPreviousSessionBills(
  now: Date
): Promise<PreviousSessionBillsResult> {
  const previousSession = await getLatestClosedDietSession(now);
  if (!previousSession) {
    return null;
  }

  const difficultyLevel = await getDifficultyLevel();
  const [bills, totalBillCount] = await Promise.all([
    _getCachedPreviousSessionBills(previousSession.id, difficultyLevel),
    _getCachedPreviousSessionBillCount(previousSession.id, difficultyLevel),
  ]);

  return {
    session: previousSession,
    bills,
    totalBillCount,
  };
}

const _getCachedPreviousSessionBills = unstable_cache(
  async (
    dietSessionId: string,
    difficultyLevel: DifficultyLevelEnum
  ): Promise<BillWithContent[]> => {
    const data = await findPreviousSessionBills(
      dietSessionId,
      difficultyLevel,
      MAX_PREVIEW_BILLS
    );

    if (data.length === 0) {
      return [];
    }

    // タグ情報とインタビュー状態を取得
    const billIds = data.map((item) => item.id);
    const [tagsByBillId, interviewBillIds] = await Promise.all([
      findTagsByBillIds(billIds),
      findBillIdsWithPublicInterview(billIds),
    ]);

    const billsWithContent: BillWithContent[] = data.map((item) => {
      const { bill_contents, ...bill } = item;
      return {
        ...bill,
        bill_content: Array.isArray(bill_contents)
          ? bill_contents[0]
          : undefined,
        tags: tagsByBillId.get(item.id) ?? [],
        hasPublicInterview: interviewBillIds.has(item.id),
      };
    });

    return billsWithContent;
  },
  ["previous-session-bills"],
  {
    revalidate: 600, // 10分
    tags: [CACHE_TAGS.BILLS, CACHE_TAGS.INTERVIEW_CONFIGS],
  }
);

const _getCachedPreviousSessionBillCount = unstable_cache(
  async (
    dietSessionId: string,
    difficultyLevel: DifficultyLevelEnum
  ): Promise<number> => {
    return countPublishedBillsByDietSession(dietSessionId, difficultyLevel);
  },
  ["previous-session-bill-count"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.BILLS],
  }
);
