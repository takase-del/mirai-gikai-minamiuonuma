import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { parseMarkdown } from "./index";

const TABLE = `| 名称 | 位置 |
| --- | --- |
| 南魚沼市学校給食センター | 南魚沼市四十日1787番地 |`;

describe("remarkTable", () => {
  it("GFMの表がテーブル要素になる", async () => {
    const html = renderToStaticMarkup(await parseMarkdown(TABLE));

    expect(html).toContain("<table>");
    expect(html).toContain("<th>名称</th>");
    expect(html).toContain("<td>南魚沼市学校給食センター</td>");
    // パイプ記号が生のまま残っていないこと
    expect(html).not.toContain("| 名称 |");
  });

  /**
   * remark-gfm を丸ごと入れると autolink literal も有効になり、段落中の裸のURLが
   * `<a>` に変わる。rehypeEmbedYouTube はテキストノードを見ているため、それだと
   * YouTube埋め込みが動かなくなる。表だけを有効にしていることを固定する。
   */
  it("裸のURLは自動リンクにならない（YouTube埋め込みを壊さない）", async () => {
    const html = renderToStaticMarkup(
      await parseMarkdown("https://example.com/foo")
    );

    expect(html).not.toContain("<a ");
    expect(html).toContain("https://example.com/foo");
  });

  it("取り消し線などGFMの他の記法は有効にしない", async () => {
    const html = renderToStaticMarkup(await parseMarkdown("~~消した~~"));

    expect(html).not.toContain("<del>");
  });
});
