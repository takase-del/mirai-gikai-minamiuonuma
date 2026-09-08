// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RubyfulInitializer } from "./initializer";

/* 解析ツールは入れていないため、報告の配線が生きているかだけを確かめる */
const sendFuriganaStateEventMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics/preference-state-events", () => ({
  sendFuriganaStateEvent: sendFuriganaStateEventMock,
}));
vi.mock("next/script", () => ({
  default: () => null,
}));

beforeEach(() => {
  localStorage.clear();
  sendFuriganaStateEventMock.mockClear();
});

describe("RubyfulInitializer", () => {
  it("マウント時にふりがな表示の現在値を報告する", () => {
    localStorage.setItem("rubyful-enabled", "true");
    render(<RubyfulInitializer />);

    expect(sendFuriganaStateEventMock).toHaveBeenCalledWith(true);
  });

  it("localStorage未設定時はfalseで報告する", () => {
    render(<RubyfulInitializer />);

    expect(sendFuriganaStateEventMock).toHaveBeenCalledWith(false);
  });
});
