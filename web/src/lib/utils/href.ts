/**
 * href がサイト外へ出るリンクかどうかを判定する。
 *
 * 外部リンクだけを別タブで開き、内部リンクは同じタブで遷移させるために使う。
 * `next/headers` に依存しないので Client Component からも呼べる。
 */
export function isExternalHref(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//");
}
