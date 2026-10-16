/**
 * 議案の「要点」を、議事録と議案書から機械的に組み立てる。
 *
 * 要約文を書き起こすのではなく、公表されている記録から事実だけを抜き出して
 * 一覧にする。誰が反対したのか、いくらの契約なのか、いつから変わるのかは、
 * 本文を通読しないと分からないが、市民が最初に知りたいのはそこだと考えた。
 */

/** 討論・質疑の発言者 */
export type Speaker = {
  name: string;
  /** 「日本共産党議員団を代表して」のように会派を名乗った場合のみ */
  faction: string | null;
};

const SPEAKER_LINE = /^\*\*([^*]+)\*\*[\s　]*(.*)$/;
/** 「反対の立場で討論に参加します」から立場を読む */
const STANCE = /(反対|賛成)(?:の立場|する立場|の討論|討論)/;
const FACTION = /(日本共産党議員団|つばめの会|[^\s、。]{2,12}(?:会派|議員団|の会))を代表/;
/** 執行部の肩書き。質疑では答弁側になるので議員と分ける */
const EXECUTIVE = /(市長|副市長|教育長|議長|[^\s]*(?:部長|課長|局長|室長|館長|所長|管理者|委員長))$/;

function parseSpeakers(text: string, stance?: "反対" | "賛成"): Speaker[] {
  const seen = new Set<string>();
  const out: Speaker[] = [];

  for (const line of text.split("\n")) {
    const m = SPEAKER_LINE.exec(line.trim());
    if (!m) {
      continue;
    }
    const name = m[1].replace(/君$/, "");
    const body = m[2];
    if (EXECUTIVE.test(name)) {
      continue;
    }
    if (stance) {
      const s = STANCE.exec(body);
      if (!s || s[1] !== stance) {
        continue;
      }
    }
    if (seen.has(name)) {
      continue;
    }
    seen.add(name);
    const f = FACTION.exec(body);
    out.push({ name, faction: f ? f[1] : null });
  }
  return out;
}

export function opposingSpeakers(debate: string): Speaker[] {
  return parseSpeakers(debate, "反対");
}

export function supportingSpeakers(debate: string): Speaker[] {
  return parseSpeakers(debate, "賛成");
}

export function questioners(questions: string): Speaker[] {
  return parseSpeakers(questions);
}

const Z2H = (s: string) =>
  s.replace(/[０-９，]/g, (c) => "0123456789,"["０１２３４５６７８９，".indexOf(c)]);

/** 議案書から読み取れる数値・日付 */
export type DocumentFacts = {
  contractAmount: string | null;
  effectiveDate: string | null;
  budgetChange: string | null;
};

const CONTRACT = /契\s*約\s*金\s*額[^\n]*?金?\s*([０-９0-9，,]{5,})\s*円/;
const CONTRACT_AFTER = /変\s*更\s*後[^\n]*?金?\s*([０-９0-9，,]{5,})\s*円/;
const EFFECTIVE = /この条例は、?\s*(令和[０-９0-9]+年[０-９0-9]+月[０-９0-9]+日)\s*から施行/;
const EFFECTIVE_ON_PUBLISH = /この条例は、?\s*公布の日から施行/;
const BUDGET = /歳入歳出それぞれ\s*([０-９0-9，,]+)\s*千?円を(追加|減額)/;

/** 「212,300,000」→「2億1,230万円」のように、桁を読みやすく言い換える */
function readableYen(raw: string): string {
  const n = Number(Z2H(raw).replace(/,/g, ""));
  if (!Number.isFinite(n) || n === 0) {
    return `${raw}円`;
  }
  const oku = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  const rest = n % 10_000;
  const parts: string[] = [];
  if (oku > 0) parts.push(`${oku.toLocaleString("ja-JP")}億`);
  if (man > 0) parts.push(`${man.toLocaleString("ja-JP")}万`);
  if (rest > 0) parts.push(`${rest.toLocaleString("ja-JP")}`);
  return `${parts.join("")}円`;
}

export function readDocumentFacts(document: string | null): DocumentFacts {
  if (!document) {
    return { contractAmount: null, effectiveDate: null, budgetChange: null };
  }
  const after = CONTRACT_AFTER.exec(document);
  const contract = after ?? CONTRACT.exec(document);
  const effective = EFFECTIVE.exec(document);
  const budget = BUDGET.exec(document);

  return {
    contractAmount: contract
      ? `${readableYen(contract[1])}${after ? "（変更後）" : ""}`
      : null,
    effectiveDate: effective
      ? Z2H(effective[1])
      : EFFECTIVE_ON_PUBLISH.test(document)
        ? "公布の日"
        : null,
    // 予算は千円単位で書かれている
    budgetChange: budget
      ? `${readableYen(`${Z2H(budget[1]).replace(/,/g, "")}000`)}を${budget[2]}`
      : null,
  };
}

function formatSpeakers(list: Speaker[]): string {
  return list
    .map((s) => (s.faction ? `${s.name}（${s.faction}）` : s.name))
    .join("、");
}

/**
 * 「要点」の表をMarkdownで組み立てる。該当しない行は出さない。
 */
export function buildHighlights(args: {
  houseLabel: string;
  statusNote: string;
  debate: string;
  questions: string;
  facts: DocumentFacts;
}): string {
  const rows: Array<[string, string]> = [
    ["提出者", args.houseLabel],
    ["議決", args.statusNote],
  ];

  if (args.facts.contractAmount) {
    rows.push(["契約金額", args.facts.contractAmount]);
  }
  if (args.facts.budgetChange) {
    rows.push(["予算の増減", args.facts.budgetChange]);
  }
  if (args.facts.effectiveDate) {
    rows.push(["施行日", args.facts.effectiveDate]);
  }

  const against = opposingSpeakers(args.debate);
  const favor = supportingSpeakers(args.debate);
  if (against.length > 0) {
    rows.push(["反対討論", formatSpeakers(against)]);
  }
  if (favor.length > 0) {
    rows.push(["賛成討論", formatSpeakers(favor)]);
  }
  if (args.debate && against.length === 0 && favor.length === 0) {
    rows.push(["討論", "あり（下記参照）"]);
  }

  const asked = questioners(args.questions);
  if (asked.length > 0) {
    rows.push([
      "質疑した議員",
      `${asked.length}人（${asked.map((s) => s.name).join("、")}）`,
    ]);
  }

  return [
    "### 要点",
    "",
    "| 項目 | 内容 |",
    "| --- | --- |",
    ...rows.map(([k, v]) => `| ${k} | ${v} |`),
    "",
  ].join("\n");
}

/** 議事録の1発言 */
type Utterance = { name: string; text: string };

/** 「**氏名**　本文」の行と、その続きの行をまとめて1発言にする */
function parseUtterances(text: string): Utterance[] {
  const out: Utterance[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      continue;
    }
    const m = SPEAKER_LINE.exec(line);
    if (m) {
      out.push({ name: m[1].replace(/君$/, ""), text: m[2] });
      continue;
    }
    if (out.length > 0) {
      out[out.length - 1].text += line;
    }
  }
  return out.filter((u) => u.name !== "議長");
}

/** 文の途中で切らないよう、句点の手前までで丸める */
function clip(text: string, limit: number): string {
  if (text.length <= limit) {
    return text;
  }
  const head = text.slice(0, limit);
  const lastStop = head.lastIndexOf("。");
  return lastStop > limit * 0.5
    ? head.slice(0, lastStop + 1)
    : `${head.trimEnd()}…`;
}

/** 末尾を取るときに、文の途中から始まらないよう句点の次から拾う */
function clipTail(text: string, limit: number): string {
  if (text.length <= limit) {
    return text;
  }
  const tail = text.slice(-limit);
  const firstStop = tail.indexOf("。");
  return firstStop >= 0 && firstStop < limit * 0.5
    ? tail.slice(firstStop + 1).trim()
    : tail.trim();
}

/** 「反対の立場で討論に参加します。」のような立場表明の一文 */
const STANCE_SENTENCE =
  /^[^。]*?(?:反対|賛成)(?:の立場|する立場)[^。]*。/;

/**
 * 討論から、各議員の述べた理由を抜き出す。
 *
 * 討論は「立場表明 → 論拠 → 結び」の順で述べられ、結びに「〜と考え、
 * 反対討論といたします」と理由が要約されることが多い。要約を書き起こす
 * 代わりに、冒頭と結びを原文のまま引き、間を（中略）で示す。
 */
export function extractArguments(
  debate: string,
  stance: "反対" | "賛成",
  opts: { head?: number; tail?: number } = {}
): Array<{ speaker: Speaker; excerpt: string }> {
  const head = opts.head ?? 200;
  const tail = opts.tail ?? 200;
  const targets = new Set(
    (stance === "反対" ? opposingSpeakers(debate) : supportingSpeakers(debate))
      .map((s) => s.name)
  );

  const merged = new Map<string, string>();
  for (const u of parseUtterances(debate)) {
    if (!targets.has(u.name)) {
      continue;
    }
    merged.set(u.name, (merged.get(u.name) ?? "") + u.text);
  }

  const factions = new Map(
    (stance === "反対" ? opposingSpeakers(debate) : supportingSpeakers(debate))
      .map((s) => [s.name, s.faction])
  );

  return [...merged].map(([name, raw]) => {
    // 立場表明は要点の表に出ているので本文からは落とす
    const body = raw.replace(STANCE_SENTENCE, "").trim();
    const excerpt =
      body.length <= head + tail
        ? body
        : `${clip(body, head)}\n\n（中略）\n\n${clipTail(body, tail)}`;
    return { speaker: { name, faction: factions.get(name) ?? null }, excerpt };
  });
}

/**
 * 質疑から「議員の問い → 執行部の答え」の組を抜き出す。
 *
 * やりとりは往復するが、最初の問いと直後の答えで論点はおおむね伝わる。
 * 議員1人につき1往復に絞り、全文は「審議の経過」で読める形にしておく。
 */
export function extractExchanges(
  questions: string,
  limit = 220
): Array<{ asker: string; question: string; answerer: string; answer: string }> {
  const utterances = parseUtterances(questions);
  const out: Array<{
    asker: string;
    question: string;
    answerer: string;
    answer: string;
  }> = [];
  const seen = new Set<string>();

  for (let i = 0; i < utterances.length; i++) {
    const u = utterances[i];
    if (EXECUTIVE.test(u.name) || seen.has(u.name)) {
      continue;
    }
    const reply = utterances.slice(i + 1).find((x) => EXECUTIVE.test(x.name));
    if (!reply) {
      continue;
    }
    seen.add(u.name);
    out.push({
      asker: u.name,
      question: clip(u.text.trim(), limit),
      answerer: reply.name,
      answer: clip(reply.text.trim(), limit),
    });
  }
  return out;
}

/** 反対・賛成の理由をMarkdownにする */
export function buildArgumentsSection(debate: string): string {
  if (!debate) {
    return "";
  }
  const blocks: string[] = [];
  for (const [stance, label] of [
    ["反対", "反対の理由"],
    ["賛成", "賛成の理由"],
  ] as const) {
    const items = extractArguments(debate, stance);
    if (items.length === 0) {
      continue;
    }
    blocks.push(
      `### ${label}`,
      "",
      ...items.flatMap(({ speaker, excerpt }) => [
        `**${speaker.name} 議員**${speaker.faction ? `（${speaker.faction}）`: ""}`,
        "",
        excerpt
          .split("\n")
          .map((l) => (l ? `> ${l}` : ">"))
          .join("\n"),
        "",
      ])
    );
  }
  if (blocks.length === 0) {
    return "";
  }
  return `${blocks.join("\n")}\n*討論の記録からの抜粋です。全文は下の「審議の経過」に掲載しています。*\n`;
}

/** 質疑のやりとりをMarkdownにする */
export function buildExchangesSection(questions: string): string {
  const items = extractExchanges(questions);
  if (items.length === 0) {
    return "";
  }
  const rows = items.flatMap((x) => [
    `**${x.asker} 議員の質疑**`,
    "",
    `> ${x.question}`,
    "",
    `**${x.answerer}の答弁**`,
    "",
    `> ${x.answer}`,
    "",
  ]);
  return [
    "### 主な質疑",
    "",
    ...rows,
    "*議員ごとに最初のやりとりを抜粋しています。全文は下の「審議の経過」に掲載しています。*",
    "",
  ].join("\n");
}
