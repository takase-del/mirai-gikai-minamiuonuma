import { describe, expect, it } from "vitest";
import {
  buildArgumentsSection,
  buildExchangesSection,
  extractArguments,
  extractExchanges,
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

describe("討論からの理由の抜き出し", () => {
  // 中略の前後がどこで切れたか見分けられるよう、文ごとに番号を振っておく
  const middle = Array.from(
    { length: 45 },
    (_, i) => `これは${i}番目の論点です。`
  ).join("");
  const long = [
    "**川辺きのい君**　日本共産党議員団を代表して、反対の立場で討論に参加します。",
    `市民生活は厳しい状況にあります。${middle}`,
    "以上の理由から、引上げの時期としては尚早と考え、反対討論といたします。",
  ].join("\n");

  it("立場表明の一文は本文から落とす", () => {
    const [item] = extractArguments(long, "反対");
    expect(item.excerpt).not.toContain("討論に参加します");
    expect(item.speaker).toEqual({
      name: "川辺きのい",
      faction: "日本共産党議員団",
    });
  });

  it("長い討論は冒頭と結びを引いて間を（中略）で示す", () => {
    const [item] = extractArguments(long, "反対");
    expect(item.excerpt).toContain("（中略）");
    expect(item.excerpt).toContain("反対討論といたします。");
  });

  /** 抜粋が文の途中から始まると、何を言っているのか読み取れなくなる */
  it("結びの抜粋は文の先頭から始まり、討論の結びで終わる", () => {
    const [item] = extractArguments(long, "反対");
    const tail = item.excerpt.split("（中略）")[1].trim();

    expect(tail.startsWith("これは")).toBe(true);
    expect(tail.endsWith("反対討論といたします。")).toBe(true);
  });

  /** 冒頭も同様に、文の途中で終わらせない */
  it("冒頭の抜粋は討論の最初の文から始まる", () => {
    const [item] = extractArguments(long, "反対");
    expect(item.excerpt.startsWith("市民生活は厳しい状況にあります。")).toBe(
      true
    );
  });

  it("短い討論は中略せずそのまま出す", () => {
    const short = "**神保貴雄君**　反対の立場で討論します。理由は時期尚早だからです。";
    const [item] = extractArguments(short, "反対");
    expect(item.excerpt).toBe("理由は時期尚早だからです。");
  });

  it("討論が無ければ節ごと出さない", () => {
    expect(buildArgumentsSection("")).toBe("");
  });
});

describe("質疑のやりとりの抜き出し", () => {
  const qa = [
    "**大平剛君**　正当な理由とはどういうものを想定されていますか。",
    "**子育て支援課長**　職員配置ができていないときは受け入れられません。",
    "**大平剛君**　確認でお願いします。",
    "**子育て支援課長**　そのとおりです。",
    "**田中せつ子君**　補助から給付になると改善されますか。",
    "**福祉保健部長**　そのように考えております。",
  ].join("\n");

  it("議員の問いと直後の答弁を組にする", () => {
    const items = extractExchanges(qa);
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      asker: "大平剛",
      answerer: "子育て支援課長",
    });
    expect(items[1].asker).toBe("田中せつ子");
  });

  /** 往復をすべて載せると長くなりすぎるので、議員ごとに最初の1往復に絞る */
  it("同じ議員の2回目以降の質疑は拾わない", () => {
    const items = extractExchanges(qa);
    expect(items.filter((x) => x.asker === "大平剛")).toHaveLength(1);
  });

  it("質疑が無ければ節ごと出さない", () => {
    expect(buildExchangesSection("")).toBe("");
  });

  it("答弁が続かない発言は組にしない", () => {
    expect(extractExchanges("**大平剛君**　質問です。")).toHaveLength(0);
  });
});
