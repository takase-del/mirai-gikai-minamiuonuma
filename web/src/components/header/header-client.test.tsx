// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeaderClient } from "./header-client";

/*
 * 解析ツールは入れていないので、送信関数そのものは何もしない実装になっている。
 * ここで確かめたいのは「ページ表示のたびに設定値を報告する配線が生きているか」
 * なので、送信先ではなく送信関数の呼び出しを見る。
 */
const sendDifficultyStateEventMock = vi.hoisted(() => vi.fn());
const usePathnameMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics/preference-state-events", () => ({
  sendDifficultyStateEvent: sendDifficultyStateEventMock,
}));
vi.mock("next/navigation", () => ({ usePathname: usePathnameMock }));
vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));
vi.mock(
  "@/features/bill-difficulty/client/components/difficulty-selector",
  () => ({
    DifficultySelector: () => null,
  })
);
vi.mock(
  "@/features/interview-session/client/components/interview-header-actions",
  () => ({
    InterviewHeaderActions: () => null,
  })
);
vi.mock("./hamburger-menu", () => ({ HamburgerMenu: () => null }));

beforeEach(() => {
  sendDifficultyStateEventMock.mockClear();
  usePathnameMock.mockReturnValue("/");
});

describe("HeaderClient", () => {
  it("マウント時に難易度設定の現在値を報告する", () => {
    render(<HeaderClient difficultyLevel="hard" />);

    expect(sendDifficultyStateEventMock).toHaveBeenCalledWith("hard");
  });

  it("pathnameが変わると再度報告する", () => {
    const { rerender } = render(<HeaderClient difficultyLevel="normal" />);
    expect(sendDifficultyStateEventMock).toHaveBeenCalledTimes(1);

    usePathnameMock.mockReturnValue("/bills/1");
    rerender(<HeaderClient difficultyLevel="normal" />);

    expect(sendDifficultyStateEventMock).toHaveBeenCalledTimes(2);
  });
});
