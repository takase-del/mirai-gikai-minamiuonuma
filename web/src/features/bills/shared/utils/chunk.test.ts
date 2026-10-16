import { describe, expect, it } from "vitest";
import { chunk } from "./chunk";

describe("chunk", () => {
  it("指定した長さごとに切り分ける", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("割り切れるときは端数の配列を作らない", () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("要素数が長さ以下なら1つにまとめる", () => {
    expect(chunk([1, 2], 10)).toEqual([[1, 2]]);
  });

  it("空配列は空のまま返す", () => {
    expect(chunk([], 10)).toEqual([]);
  });

  /** 0や負数を許すと無限ループになる */
  it.each([0, -1])("長さに %i を渡すと例外にする", (size) => {
    expect(() => chunk([1, 2, 3], size)).toThrow();
  });
});
