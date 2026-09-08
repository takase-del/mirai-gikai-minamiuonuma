import { describe, expect, it } from "vitest";

import { HOUSE_LABELS, getBillStatusLabel } from "./index";

describe("getBillStatusLabel", () => {
  it("returns '上程前' for preparing", () => {
    expect(getBillStatusLabel("preparing")).toBe("上程前");
  });

  it("returns '上程' for introduced", () => {
    expect(getBillStatusLabel("introduced")).toBe("上程");
  });

  it("returns '委員会審査中' for in_originating_house", () => {
    expect(getBillStatusLabel("in_originating_house")).toBe("委員会審査中");
  });

  it("returns '本会議審議中' for in_receiving_house", () => {
    expect(getBillStatusLabel("in_receiving_house")).toBe("本会議審議中");
  });

  it("returns '可決' for enacted", () => {
    expect(getBillStatusLabel("enacted")).toBe("可決");
  });

  it("returns '否決' for rejected", () => {
    expect(getBillStatusLabel("rejected")).toBe("否決");
  });

  /**
   * 一院制の市議会には発議院がないので、第2引数を渡しても結果は変わらない。
   * 本家のシグネチャに合わせて引数だけ残していることを固定する。
   */
  describe("提出者区分に依存しないこと", () => {
    it.each([
      "HR",
      "HC",
      null,
      undefined,
    ] as const)("originatingHouse=%s でも in_originating_house は '委員会審査中'", (house) => {
      expect(getBillStatusLabel("in_originating_house", house)).toBe(
        "委員会審査中"
      );
    });

    it.each([
      "HR",
      "HC",
      null,
      undefined,
    ] as const)("originatingHouse=%s でも in_receiving_house は '本会議審議中'", (house) => {
      expect(getBillStatusLabel("in_receiving_house", house)).toBe(
        "本会議審議中"
      );
    });
  });

  it("returns the status string as-is for unknown status", () => {
    // biome-ignore lint/suspicious/noExplicitAny: テスト用に未知のステータスを渡す
    expect(getBillStatusLabel("unknown_status" as any)).toBe("unknown_status");
  });
});

describe("HOUSE_LABELS", () => {
  it("house_enum を提出者区分として読み替える", () => {
    expect(HOUSE_LABELS.HR).toBe("市長提出");
    expect(HOUSE_LABELS.HC).toBe("議員提出");
  });
});
