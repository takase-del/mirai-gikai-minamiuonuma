import "server-only";
import { unstable_cache } from "next/cache";
import { getDifficultyLevel } from "@/features/bill-difficulty/server/loaders/get-difficulty-level";
import type { DifficultyLevelEnum } from "@/features/bill-difficulty/shared/types";
import { countPublishedBillsByDietSession } from "@/features/bills/server/repositories/bill-repository";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { DietSession } from "../../shared/types";
import { findAllDietSessions } from "../repositories/diet-session-repository";

export type DietSessionWithCount = {
  session: DietSession;
  /** 公開済み議案の件数。0件の会期は一覧に出さない判断に使う */
  publishedBillCount: number;
};

/**
 * すべての会期を、公開済み議案の件数付きで新しい順に取得する。
 */
export async function getDietSessionsWithCounts(): Promise<
  DietSessionWithCount[]
> {
  const difficultyLevel = await getDifficultyLevel();
  return _getCached(difficultyLevel);
}

const _getCached = unstable_cache(
  async (
    difficultyLevel: DifficultyLevelEnum
  ): Promise<DietSessionWithCount[]> => {
    const sessions = await findAllDietSessions();

    return Promise.all(
      sessions.map(async (session) => ({
        session,
        publishedBillCount: await countPublishedBillsByDietSession(
          session.id,
          difficultyLevel
        ),
      }))
    );
  },
  ["diet-sessions-with-counts"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.DIET_SESSIONS, CACHE_TAGS.BILLS],
  }
);
