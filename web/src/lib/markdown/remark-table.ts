import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { gfmTable } from "micromark-extension-gfm-table";
import type { Processor } from "unified";

/**
 * GFMの表記法だけを有効にする remark プラグイン。
 *
 * 議案の解説では「改正前／改正後」や金額の一覧を表で見せる場面が多い。
 * remark-gfm を丸ごと入れれば表は使えるようになるが、同時に
 * autolink literal（裸のURLを自動で `<a>` にする）も有効になり、
 * `rehypeEmbedYouTube` が前提にしている「段落中の裸のURLはテキストノード」
 * という条件が崩れてYouTube埋め込みが動かなくなる。
 * そのため表の拡張だけを取り出して使う。
 */
export function remarkTable(this: Processor) {
  const data = this.data();

  if (!data.micromarkExtensions) {
    data.micromarkExtensions = [];
  }
  data.micromarkExtensions.push(gfmTable());

  if (!data.fromMarkdownExtensions) {
    data.fromMarkdownExtensions = [];
  }
  data.fromMarkdownExtensions.push(gfmTableFromMarkdown());
}
