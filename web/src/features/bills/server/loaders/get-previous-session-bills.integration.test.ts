import {
  cleanupTestBill,
  cleanupTestDietSession,
  createTestBill,
  createTestBillContent,
  createTestDietSession,
} from "@test-utils/utils";
import { afterEach, describe, expect, it, vi } from "vitest";

// unstable_cache はモジュール初期化時に評価されるため、
// setup の共通モック（vitest.integration.setup.ts）だけでは不十分。
// テストファイル内で vi.mock → 動的インポートの順序を保証する必要がある。
vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: never[]) => unknown) => fn,
}));

const { getPreviousSessionBills } = await import(
  "./get-previous-session-bills"
);

describe("getPreviousSessionBills 統合テスト", () => {
  const sessionIds: string[] = [];
  const billIds: string[] = [];

  /** 会期に紐づく公開済み議案を1件作り、後始末用に id を控える。 */
  async function createPublishedBill(dietSessionId: string) {
    const bill = await createTestBill({
      diet_session_id: dietSessionId,
      publish_status: "published",
    });
    await createTestBillContent(bill.id, { difficulty_level: "normal" });
    billIds.push(bill.id);
    return bill;
  }

  afterEach(async () => {
    // 議案を先に消す。会期は議案から参照されている。
    await Promise.all(billIds.splice(0).map(cleanupTestBill));
    await Promise.all(sessionIds.splice(0).map(cleanupTestDietSession));
  });

  it("アクティブな会期が無くても直近で閉会した会期の議案を返す", async () => {
    // 閉会中はどの会期にも is_active が立っていないのが通常の状態。
    // ここで null を返すとトップページから過去の議案への導線が消える。
    const older = await createTestDietSession({
      start_date: "2027-01-01",
      end_date: "2027-03-31",
      is_active: false,
    });
    const latest = await createTestDietSession({
      start_date: "2027-04-01",
      end_date: "2027-06-30",
      is_active: false,
    });
    sessionIds.push(older.id, latest.id);

    const bill = await createPublishedBill(latest.id);

    const result = await getPreviousSessionBills(new Date("2027-08-01"));

    expect(result?.session.id).toBe(latest.id);
    expect(result?.bills.map((b) => b.id)).toEqual([bill.id]);
    expect(result?.totalBillCount).toBe(1);
  });

  it("プレビューは5件までで、総件数は全件を返す", async () => {
    // 「もっと読む」を出すかはこの2つの差で決まる。
    const session = await createTestDietSession({
      start_date: "2027-01-01",
      end_date: "2027-03-31",
      is_active: false,
    });
    sessionIds.push(session.id);

    for (let i = 0; i < 6; i++) {
      await createPublishedBill(session.id);
    }

    const result = await getPreviousSessionBills(new Date("2027-08-01"));

    expect(result?.bills).toHaveLength(5);
    expect(result?.totalBillCount).toBe(6);
  });

  it("閉会済みの会期が無ければ null を返す", async () => {
    const result = await getPreviousSessionBills(new Date("1900-01-01"));

    expect(result).toBeNull();
  });
});
