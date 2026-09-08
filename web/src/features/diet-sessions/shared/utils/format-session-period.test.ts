import { describe, expect, it } from "vitest";
import { formatSessionPeriod } from "./format-session-period";

describe("formatSessionPeriod", () => {
  it("同じ月の会期は終わりの月を省く", () => {
    expect(formatSessionPeriod("2026-03-02", "2026-03-19")).toBe(
      "2026.3.2 〜 19"
    );
  });

  it("月をまたぐ会期は終わりも月から出す", () => {
    expect(formatSessionPeriod("2026-08-31", "2026-09-18")).toBe(
      "2026.8.31 〜 9.18"
    );
  });

  /** 臨時会は1日で終わることが多く、「11.10 〜 10」と出ると読みにくい */
  it("1日開催の会期は日付ひとつだけにする", () => {
    expect(formatSessionPeriod("2025-11-10", "2025-11-10")).toBe("2025.11.10");
  });

  it("年をまたいで表示しても年は開始側だけ出す", () => {
    expect(formatSessionPeriod("2025-01-15", "2025-01-15")).toBe("2025.1.15");
  });
});
