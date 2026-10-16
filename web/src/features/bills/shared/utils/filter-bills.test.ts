import { describe, expect, it } from "vitest";
import { filterBills } from "./filter-bills";

function bill(
  id: string,
  overrides: {
    title?: string;
    tags?: string[];
    hasPublicInterview?: boolean;
    has_questions?: boolean;
    has_debate?: boolean;
    is_unanimous?: boolean | null;
  } = {}
) {
  return {
    id,
    name: `${id} 議案`,
    bill_content: { title: overrides.title ?? `${id} のタイトル` } as never,
    tags: (overrides.tags ?? []).map((label) => ({ id: label, label })),
    hasPublicInterview: overrides.hasPublicInterview ?? false,
    has_questions: overrides.has_questions ?? false,
    has_debate: overrides.has_debate ?? false,
    is_unanimous: overrides.is_unanimous ?? null,
  };
}

const ids = (bills: { id: string }[]) => bills.map((b) => b.id);
const base = {
  query: "",
  tagId: null,
  interviewOnly: false,
  deliberation: "all" as const,
};

describe("filterBills", () => {
  it("既定では絞り込まない", () => {
    const bills = [bill("a"), bill("b")];
    expect(ids(filterBills(bills, base))).toEqual(["a", "b"]);
  });

  it("キーワードで絞る", () => {
    const bills = [bill("a", { title: "ガソリン税" }), bill("b")];
    expect(ids(filterBills(bills, { ...base, query: "ガソリン" }))).toEqual([
      "a",
    ]);
  });

  it("カテゴリで絞る", () => {
    const bills = [
      bill("a", { tags: ["税金"] }),
      bill("b", { tags: ["教育"] }),
    ];
    expect(ids(filterBills(bills, { ...base, tagId: "税金" }))).toEqual(["a"]);
  });

  it("受付中のみに絞る", () => {
    const bills = [
      bill("open", { hasPublicInterview: true }),
      bill("closed", { hasPublicInterview: false }),
    ];
    expect(ids(filterBills(bills, { ...base, interviewOnly: true }))).toEqual([
      "open",
    ]);
  });

  it("複数の条件を重ねる", () => {
    const bills = [
      bill("hit", {
        title: "ガソリン税",
        tags: ["税金"],
        hasPublicInterview: true,
      }),
      bill("noTag", {
        title: "ガソリン税",
        tags: ["教育"],
        hasPublicInterview: true,
      }),
      bill("noInterview", { title: "ガソリン税", tags: ["税金"] }),
    ];

    expect(
      ids(
        filterBills(bills, {
          query: "ガソリン",
          tagId: "税金",
          interviewOnly: true,
          deliberation: "all",
        })
      )
    ).toEqual(["hit"]);
  });

  it("元の配列を壊さない", () => {
    const input = [bill("a")];
    filterBills(input, base).push(bill("b"));
    expect(input).toHaveLength(1);
  });

  describe("審議のされ方で絞る", () => {
    it("質疑があった議案だけに絞る", () => {
      const bills = [bill("a", { has_questions: true }), bill("b")];
      expect(
        ids(filterBills(bills, { ...base, deliberation: "questioned" }))
      ).toEqual(["a"]);
    });

    it("討論があった議案だけに絞る", () => {
      const bills = [bill("a"), bill("b", { has_debate: true })];
      expect(
        ids(filterBills(bills, { ...base, deliberation: "debated" }))
      ).toEqual(["b"]);
    });

    it("賛否が分かれた議案だけに絞る", () => {
      const bills = [
        bill("a", { is_unanimous: true }),
        bill("b", { is_unanimous: false }),
        bill("c", { is_unanimous: null }),
      ];
      expect(
        ids(filterBills(bills, { ...base, deliberation: "split" }))
      ).toEqual(["b"]);
    });

    /** 他の条件と重ねられること。キーワードと併用しても両方効く */
    it("キーワードと併用できる", () => {
      const bills = [
        bill("a", { title: "給食センター", has_debate: true }),
        bill("b", { title: "給食センター" }),
        bill("c", { title: "道路", has_debate: true }),
      ];
      expect(
        ids(
          filterBills(bills, {
            ...base,
            query: "給食",
            deliberation: "debated",
          })
        )
      ).toEqual(["a"]);
    });
  });
});
