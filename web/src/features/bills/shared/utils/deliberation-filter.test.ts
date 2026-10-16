import { describe, expect, it } from "vitest";
import {
  type DeliberationFacts,
  isDeliberationFilter,
  matchesDeliberation,
} from "./deliberation-filter";

const bill = (over: Partial<DeliberationFacts> = {}): DeliberationFacts => ({
  has_questions: false,
  has_debate: false,
  is_unanimous: null,
  ...over,
});

describe("isDeliberationFilter", () => {
  it.each(["all", "questioned", "debated", "split"])("%s を受け付ける", (v) => {
    expect(isDeliberationFilter(v)).toBe(true);
  });

  /** URL直打ちで壊せないよう、知らない値は弾く */
  it.each(["", "unknown", undefined])("%s は受け付けない", (v) => {
    expect(isDeliberationFilter(v as string | undefined)).toBe(false);
  });
});

describe("matchesDeliberation", () => {
  it("all はすべて通す", () => {
    expect(matchesDeliberation(bill(), "all")).toBe(true);
  });

  it("questioned は質疑があった議案だけ", () => {
    expect(
      matchesDeliberation(bill({ has_questions: true }), "questioned")
    ).toBe(true);
    expect(matchesDeliberation(bill(), "questioned")).toBe(false);
  });

  it("debated は討論があった議案だけ", () => {
    expect(matchesDeliberation(bill({ has_debate: true }), "debated")).toBe(
      true
    );
    expect(matchesDeliberation(bill(), "debated")).toBe(false);
  });

  describe("split（賛否が分かれた）", () => {
    it("全会一致でなければ該当する", () => {
      expect(matchesDeliberation(bill({ is_unanimous: false }), "split")).toBe(
        true
      );
    });

    it("全会一致は該当しない", () => {
      expect(matchesDeliberation(bill({ is_unanimous: true }), "split")).toBe(
        false
      );
    });

    /** 審議中の議案はまだ議決されておらず、分かれたかどうかを言えない */
    it("未議決（null）は該当しない", () => {
      expect(matchesDeliberation(bill({ is_unanimous: null }), "split")).toBe(
        false
      );
    });
  });
});
