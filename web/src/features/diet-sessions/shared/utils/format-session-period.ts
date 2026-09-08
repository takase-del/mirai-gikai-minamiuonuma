/**
 * 会期を短く表示する。
 * 同じ月なら終わりの月を省き、1日開催の臨時会は日付ひとつだけにする。
 */
export function formatSessionPeriod(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const head = `${s.getFullYear()}.${s.getMonth() + 1}.${s.getDate()}`;

  if (start === end) {
    return head;
  }

  const tail =
    s.getMonth() === e.getMonth()
      ? `${e.getDate()}`
      : `${e.getMonth() + 1}.${e.getDate()}`;
  return `${head} 〜 ${tail}`;
}
