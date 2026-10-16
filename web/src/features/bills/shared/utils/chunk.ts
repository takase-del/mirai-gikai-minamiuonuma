/**
 * 配列を一定の長さごとに切り分ける。
 *
 * PostgREST の `in` フィルタは条件をURLに載せるため、IDをまとめて渡すと
 * クエリ文字列が長くなりすぎて "URI too long" で失敗する。議案が200件を
 * 超えたあたりで実際に一覧ページが500になった。IDの配列を分割して
 * 複数回に分けて問い合わせるために使う。
 */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error(`chunk size must be positive, got ${size}`);
  }
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}
