import { describe, expect, it } from "vitest";
import {
  buildHighlights,
  opposingSpeakers,
  questioners,
  readDocumentFacts,
  supportingSpeakers,
} from "./highlights";

const DEBATE = [
  "まず、原案に反対者の発言を許します。",
  "６番・川辺きのい君。",
  "**川辺きのい君**　日本共産党議員団を代表して、第 18 号議案に、反対の立場で討論に参加します。",
  "**議長**　次に、原案に賛成者の発言を許します。",
  "**大平剛君**　第 18 号議案について、賛成の立場で討論に参加させていただきます。",
].join("\n");

describe("討論の発言者", () => {
  it("反対の立場の議員を会派つきで拾う", () => {
    expect(opposingSpeakers(DEBATE)).toEqual([
      { name: "川辺きのい", faction: "日本共産党議員団" },
    ]);
  });

  it("賛成の立場の議員を拾う", () => {
    expect(supportingSpeakers(DEBATE)).toEqual([
      { name: "大平剛", faction: null },
    ]);
  });

  /** 議長は進行役なので討論の当事者ではない */
  it("議長は発言者に含めない", () => {
    const names = [...opposingSpeakers(DEBATE), ...supportingSpeakers(DEBATE)];
    expect(names.map((s) => s.name)).not.toContain("議長");
  });
});

describe("質疑の発言者", () => {
  /** 質疑では部長・課長は答弁側なので、質問した議員だけを数える */
  it("執行部の答弁者は除く", () => {
    const text = [
      "**黒岩揺光君**　この点について伺います。",
      "**市民生活部長**　お答えします。",
      "**税務課長**　補足します。",
      "**田中せつ子君**　関連して伺います。",
    ].join("\n");

    expect(questioners(text).map((s) => s.name)).toEqual([
      "黒岩揺光",
      "田中せつ子",
    ]);
  });

  it("同じ議員が複数回発言しても1人として数える", () => {
    const text = [
      "**黒岩揺光君**　1回目の質疑です。",
      "**市長**　お答えします。",
      "**黒岩揺光君**　2回目の質疑です。",
    ].join("\n");

    expect(questioners(text)).toHaveLength(1);
  });
});

describe("議案書からの読み取り", () => {
  it("契約金額を読みやすい単位に言い換える", () => {
    const doc = "３ 契 約 金 額    金２１２，３００，０００円";
    expect(readDocumentFacts(doc).contractAmount).toBe("2億1,230万円");
  });

  /** 変更契約では変更後の額が実際の契約額になる */
  it("変更契約は変更後の額を採る", () => {
    const doc = [
      "(１)変 更 前   金４７８，５００，０００円",
      "(２)変 更 後   金５５８，４８３，２００円",
    ].join("\n");
    expect(readDocumentFacts(doc).contractAmount).toBe(
      "5億5,848万3,200円（変更後）"
    );
  });

  it("施行日を読み取る", () => {
    expect(
      readDocumentFacts("この条例は、令和８年４月１日から施行する。").effectiveDate
    ).toBe("令和8年4月1日");
  });

  it("公布の日から施行する場合も読み取る", () => {
    expect(
      readDocumentFacts("この条例は、公布の日から施行する。").effectiveDate
    ).toBe("公布の日");
  });

  /** 予算書は千円単位で書かれている */
  it("補正額は千円単位を円に直す", () => {
    const doc = "第１条 歳入歳出予算の総額に歳入歳出それぞれ23,250千円を追加し、";
    expect(readDocumentFacts(doc).budgetChange).toBe("2,325万円を追加");
  });

  it("議案書が無ければすべて null", () => {
    expect(readDocumentFacts(null)).toEqual({
      contractAmount: null,
      effectiveDate: null,
      budgetChange: null,
    });
  });
});

describe("要点の表", () => {
  it("該当する項目だけを行にする", () => {
    const md = buildHighlights({
      houseLabel: "市長提出",
      statusNote: "3月3日 原案可決（賛成多数）",
      debate: DEBATE,
      questions: "",
      facts: {
        contractAmount: null,
        effectiveDate: "令和8年4月1日",
        budgetChange: null,
      },
    });

    expect(md).toContain("| 提出者 | 市長提出 |");
    expect(md).toContain("| 施行日 | 令和8年4月1日 |");
    expect(md).toContain("| 反対討論 | 川辺きのい（日本共産党議員団） |");
    expect(md).toContain("| 賛成討論 | 大平剛 |");
    // 該当しない項目は行ごと出さない
    expect(md).not.toContain("契約金額");
    expect(md).not.toContain("質疑した議員");
  });
});
