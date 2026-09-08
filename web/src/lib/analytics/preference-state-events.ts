"use client";

import type { DifficultyLevelEnum } from "@/features/bill-difficulty/shared/types";

/*
 * 本サイトはアクセス解析を入れていないため、送信先が無い。
 * `sendGAEvent` は dataLayer が無いと毎ページビューで警告を出すので、
 * 呼び出し側はそのままに、ここで何もしない実装にしている。
 * 解析を導入するときは、レイアウトへのタグ設置とあわせてここを戻し、
 * プライバシーポリシーの記載も更新すること。
 */

/** 難易度表示の現在の設定を送る（解析未導入のため何もしない） */
export function sendDifficultyStateEvent(_level: DifficultyLevelEnum) {
  // no-op
}

/** ふりがな表示の現在の設定を送る（解析未導入のため何もしない） */
export function sendFuriganaStateEvent(_enabled: boolean) {
  // no-op
}
