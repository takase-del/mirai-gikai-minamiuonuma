/**
 * 南魚沼市議会の実データを投入するシード。
 *
 * - `source-data.json`: 市議会公式サイトの議決結果ページ・付議事件一覧から
 *   機械的に取り込んだ会期と議案の一覧（件名・議決結果は原文ママ）
 * - `contents.ts`: 議案書PDFを読んで書き起こした解説（難易度別）
 * - `knowledge/`: 議案書PDFから抽出した本文。AIチャットの根拠として使う
 *
 * 解説を書いた議案だけを published にし、それ以外は draft のまま入れる。
 * 未校閲のAI生成文を公開しないための措置なので、published を増やすときは
 * 必ず議案書と突き合わせてから行うこと。
 *
 * 実行: pnpm seed:minamiuonuma
 */
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { clearAllData, createAdminClient } from "../shared/helper";
import { CURATED_CONTENTS } from "./contents";

type SourceSession = {
  key: string;
  name: string;
  slug: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  source_url: string;
};

type SourceBill = {
  session: string;
  no: string;
  name: string;
  originating_house: "HR" | "HC";
  status: "enacted" | "rejected" | "introduced";
  status_note: string;
  official_note: string;
  source_url: string;
  /** 議案書PDFに記載された提出日。PDFが無い・記載が無いものは undefined */
  submitted_date?: string;
  /** documents/ 配下の議案書本文ファイル名。PDFが無い議案は undefined */
  document?: string;
};

const DIR = import.meta.dirname;

const { sessions, bills } = JSON.parse(
  fs.readFileSync(path.join(DIR, "source-data.json"), "utf-8")
) as { sessions: SourceSession[]; bills: SourceBill[] };

/** タグは議案の性格で分ける。featured_priority はトップページでの並び順 */
const TAGS = [
  { label: "予算・決算", priority: 1, description: "当初予算・補正予算・決算の認定" },
  { label: "子育て・教育", priority: 2, description: "保育・学校・給食など" },
  { label: "健康・福祉", priority: 3, description: "医療・介護・健康保険など" },
  { label: "暮らし・インフラ", priority: 4, description: "上下水道・道路・除雪など" },
  { label: "まちづくり・環境", priority: 5, description: "都市計画・公園・景観・ごみ" },
  { label: "産業・観光", priority: 6, description: "農業・商工業・観光施設" },
  { label: "行政・議会", priority: 7, description: "組織・人事・条例整理・議会運営" },
];

/** 解説を書いていない議案にも、件名から機械的にタグを当てる */
const TAG_RULES: Array<[RegExp, string]> = [
  [/予算|決算|継続費|健全化判断比率|資金不足比率/, "予算・決算"],
  [/保育|乳児|こども|子ども|学校|給食|教育委員会|通園/, "子育て・教育"],
  [/国民健康保険|後期高齢者|介護|病院|診療所|鍼灸|予防接種/, "健康・福祉"],
  [/水道|下水道|浄化槽|除雪|市道|道路|消防|火災|災害/, "暮らし・インフラ"],
  [/公園|景観|ごみ|環境|都市|辺地|字の変更|総合計画/, "まちづくり・環境"],
  [/観光|農業|商工|開発センター|街づくり|アグリ|八海山麓|伝世館/, "産業・観光"],
];

function pickTags(name: string): string[] {
  const hit = TAG_RULES.filter(([re]) => re.test(name)).map(([, label]) => label);
  return hit.length > 0 ? [hit[0]] : ["行政・議会"];
}

/**
 * 解説をまだ書いていない議案に入れる、事実だけのコンテンツ。
 *
 * 件名・会期・議決結果・議案書へのリンクという、市議会が公表している事実の
 * 転記だけで構成する。件名から中身を推測して書かないこと。解説が未作成である
 * ことも本文に明示し、読み手が「解説済み」と誤解しないようにする。
 */
function buildStubContent(
  bill: SourceBill,
  session: SourceSession,
  level: "normal" | "hard"
) {
  const houseLabel = bill.originating_house === "HC" ? "議員提出" : "市長提出";
  const decided = bill.status === "introduced";

  const rows = [
    ["正式名称", bill.name],
    ["会期", `${session.name}（${session.start_date} 〜 ${session.end_date}）`],
    ["提出者区分", houseLabel],
    [decided ? "審議状況" : "議決", bill.status_note],
  ];

  const officialNote = bill.official_note
    ? `\n## 市議会が公表している内容\n\n> ${bill.official_note}\n`
    : "";

  const notice =
    level === "normal"
      ? "この議案は、市議会が公表している件名と議決結果だけを掲載しています。**内容の解説はまだ作成していません。** 議案の中身は、下の議案書（一次資料）でご確認ください。"
      : "本ページは市議会公表情報の転記のみで構成されています。**解説は未作成です。** 条文・金額・施行期日等は一次資料を参照してください。";

  return {
    // タイトルの先頭に議案番号を残す。市議会の資料や会議録は議案番号で
    // 参照されるため、番号が無いと一次資料と突き合わせられない。
    title: bill.name,
    summary: `${session.name}の議案です。${bill.status_note}。解説はまだ作成していません。`,
    content: `## この議案について

${notice}

## 基本情報

| 項目 | 内容 |
| --- | --- |
${rows.map(([k, v]) => `| ${k} | ${v} |`).join("\n")}
${officialNote}${buildDocumentSection(bill)}
## 一次資料

[${bill.source_url.endsWith(".pdf") ? "議案書（PDF）" : "市議会の議決結果ページ"}](${bill.source_url})
`,
  };
}

/**
 * 議案書の本文を読む。PDFが無い議案は null。
 */
function readDocument(bill: SourceBill): string | null {
  if (!bill.document) {
    return null;
  }
  const file = path.join(DIR, "documents", bill.document);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf-8").trim() : null;
}

/**
 * 議案書の本文をそのまま載せてよいかを判定する。
 *
 * なお、該当する議案書のテキストはリポジトリにも置いていない。本サイトで
 * 伏せてもリポジトリが公開されれば同じことになるため。掲載する方針に
 * 変えるときは scripts で取得し直すこと。
 *
 * 人事案件（教育委員・監査委員・人権擁護委員などの任命同意）の議案書には、
 * 候補者の氏名・生年月・住所が記載されている。市が公表している情報とはいえ、
 * 個人情報の再掲になるため本サイトには載せず、一次資料へのリンクだけを示す。
 * 掲載方針が固まったら、この判定を運営者が見直すこと。
 */
function containsPersonalData(document: string): boolean {
  return /生\s*年\s*月/.test(document);
}

/**
 * 議案書の本文をMarkdownのセクションにする。
 * 原文は表形式の桁揃えを空白で表現しているので、コードブロックで崩さずに出す。
 */
function buildDocumentSection(bill: SourceBill): string {
  const document = readDocument(bill);
  if (!document) {
    return "";
  }
  if (containsPersonalData(document)) {
    return `
## 議案書について

この議案書には候補者の氏名・生年月・住所が記載されているため、本文の掲載は控えています。内容は市議会の一次資料でご確認ください。
`;
  }
  return `
## 議案書の内容（原文）

市議会が公開している議案書の本文です。契約金額や予算額、施行期日などはここに記載されています。

\`\`\`
${document}
\`\`\`
`;
}

function curatedKey(session: string, no: string) {
  return `${session}::${no}`;
}

const curatedByKey = new Map(
  CURATED_CONTENTS.map((c) => [curatedKey(c.session, c.no), c])
);

async function main() {
  const supabase = createAdminClient();
  console.log("🏔  南魚沼市議会データの投入を開始します");

  await clearAllData(supabase);

  // ── 会期 ──────────────────────────────────────────
  const { data: sessionRows, error: sessionError } = await supabase
    .from("diet_sessions")
    .insert(
      sessions.map((s) => ({
        name: s.name,
        slug: s.slug,
        start_date: s.start_date,
        end_date: s.end_date,
        is_active: s.is_active,
        shugiin_url: s.source_url,
      }))
    )
    .select();
  if (sessionError) throw new Error(`会期の投入に失敗: ${sessionError.message}`);
  const sessionIdBySlug = new Map(sessionRows.map((r) => [r.slug as string, r.id]));
  console.log(`📅 会期 ${sessionRows.length}件`);

  // ── タグ ──────────────────────────────────────────
  const { data: tagRows, error: tagError } = await supabase
    .from("tags")
    .insert(
      TAGS.map((t) => ({
        label: t.label,
        featured_priority: t.priority,
        description: t.description,
      }))
    )
    .select();
  if (tagError) throw new Error(`タグの投入に失敗: ${tagError.message}`);
  const tagIdByLabel = new Map(tagRows.map((r) => [r.label as string, r.id]));
  console.log(`🏷  タグ ${tagRows.length}件`);

  // ── 議案 ──────────────────────────────────────────
  // 議案番号は年度ごとに振り直されるため、別の会期に同じ名称の議案が存在する
  // （例: 令和7年と令和8年の「第20号議案 南魚沼市税条例の一部改正について」）。
  // 名前で突き合わせると取り違えるので、投入前にIDを採番して紐づける。
  const billIds = bills.map(() => randomUUID());
  const billRows = bills.map((b, i) => {
    const curated = curatedByKey.get(curatedKey(b.session, b.no));
    // 審議中の会期は議決結果も議案書もまだ出ていないので「これから掲載される議案」に置く。
    // 閉会した会期は、解説が未作成でも件名と議決結果は公表されているので公開する。
    const isActiveSession = sessions.find((s) => s.key === b.session)?.is_active;
    const publishStatus = isActiveSession
      ? ("coming_soon" as const)
      : ("published" as const);
    return {
      id: billIds[i],
      name: b.name,
      originating_house: b.originating_house,
      status: b.status,
      status_note: b.status_note,
      shugiin_url: b.source_url,
      diet_session_id: sessionIdBySlug.get(b.session) ?? null,
      publish_status: publishStatus,
      // published_at と submitted_date は列名リネームの移行中で、DBトリガー
      // sync_bills_published_submitted が両者を同期する。published_at に投入日時を
      // 入れると、それが「上程日」として画面に出てしまう。提出日は議案書PDFに
      // 記載された日付だけを入れ、分からないものは null のままにする。
      published_at: null,
      submitted_date: curated?.submittedDate ?? b.submitted_date ?? null,
      is_featured: curated?.isFeatured ?? false,
      is_review_completed: false,
      // AIチャットの根拠。議案書の本文をそのまま渡す
      knowledge_source: readDocument(b),
      use_knowledge_source_in_chat: readDocument(b) != null,
    };
  });

  const { data: insertedBills, error: billError } = await supabase
    .from("bills")
    .insert(billRows)
    .select();
  if (billError) throw new Error(`議案の投入に失敗: ${billError.message}`);
  console.log(`📄 議案 ${insertedBills.length}件`);

  // ── 議案タグ ──────────────────────────────────────
  const billTagRows = bills.flatMap((b, i) => {
    const billId = billIds[i];
    const curated = curatedByKey.get(curatedKey(b.session, b.no));
    const labels = curated?.tags ?? pickTags(b.name);
    return labels.flatMap((label) => {
      const tagId = tagIdByLabel.get(label);
      return tagId ? [{ bill_id: billId, tag_id: tagId }] : [];
    });
  });
  const { error: billTagError } = await supabase
    .from("bills_tags")
    .insert(billTagRows);
  if (billTagError)
    throw new Error(`議案タグの投入に失敗: ${billTagError.message}`);
  console.log(`🔗 議案タグ ${billTagRows.length}件`);

  // ── 難易度別コンテンツ ────────────────────────────
  // 難易度は normal / hard の2種類あり、一覧・詳細のクエリは
  // bill_contents!inner で難易度を絞る。片方でも欠けるとその難易度に
  // 切り替えたときに議案が消えるので、必ず両方を作る。
  const sessionByKey = new Map(sessions.map((s) => [s.key, s]));
  let stubCount = 0;
  const contentRows = bills.flatMap((b, i) => {
    const billId = billIds[i];
    // 審議中の会期は「これから掲載される議案」として名前だけ出すので中身は作らない
    if (sessionByKey.get(b.session)?.is_active) {
      return [];
    }
    const curated = curatedByKey.get(curatedKey(b.session, b.no));
    const session = sessionByKey.get(b.session);
    if (!curated && !session) {
      return [];
    }
    if (!curated) {
      stubCount++;
    }
    return (["normal", "hard"] as const).map((level) => {
      const c = curated
        ? curated[level]
        : buildStubContent(b, session as SourceSession, level);
      return {
        bill_id: billId,
        difficulty_level: level,
        // 手書きのタイトルには議案番号が入っていないので、ここで前置きする。
        // スタブ側は bill.name をそのまま使うため既に番号が入っている。
        title: curated ? `${b.no} ${c.title}` : c.title,
        summary: c.summary,
        // 解説を書いた議案にも、根拠を確かめられるよう議案書の本文を添える。
        // スタブ側は buildStubContent の中で既に挟んでいる。
        content: curated ? c.content + buildDocumentSection(b) : c.content,
      };
    });
  });
  const { error: contentError } = await supabase
    .from("bill_contents")
    .insert(contentRows);
  if (contentError)
    throw new Error(`議案コンテンツの投入に失敗: ${contentError.message}`);
  console.log(`📝 議案コンテンツ ${contentRows.length}件`);

  const counts = billRows.reduce<Record<string, number>>((acc, b) => {
    acc[b.publish_status] = (acc[b.publish_status] ?? 0) + 1;
    return acc;
  }, {});
  console.log("\n✅ 投入完了");
  console.log(`   公開(published)      : ${counts.published ?? 0}件`);
  console.log(`   近日公開(coming_soon): ${counts.coming_soon ?? 0}件`);
  console.log(`   下書き(draft)        : ${counts.draft ?? 0}件`);
  console.log(`   うち解説を執筆済み   : ${CURATED_CONTENTS.length}件`);
  console.log(`   うち事実のみ（未執筆）: ${stubCount}件`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
