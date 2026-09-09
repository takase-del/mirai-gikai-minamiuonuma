import { describe, expect, it } from "vitest";
import { isExternalHref } from "./href";

describe("isExternalHref", () => {
  it("スキーム付きのURLは外部リンクとして扱う", () => {
    expect(isExternalHref("https://example.com/a")).toBe(true);
    expect(isExternalHref("http://example.com")).toBe(true);
    expect(isExternalHref("mailto:someone@example.com")).toBe(true);
  });

  it("スキームを省略したプロトコル相対URLも外部リンクとして扱う", () => {
    // 「//」で始まると閲覧中のスキームで外部ホストへ出るため、内部リンクではない。
    expect(isExternalHref("//example.com/a")).toBe(true);
  });

  it("サイト内のパスは外部リンクではない", () => {
    expect(isExternalHref("/")).toBe(false);
    expect(isExternalHref("/about")).toBe(false);
    expect(isExternalHref("/bills/abc?difficulty=hard")).toBe(false);
    expect(isExternalHref("#section")).toBe(false);
  });
});
