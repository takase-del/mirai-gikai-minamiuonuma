"use client";

import type { ReactNode } from "react";
import { NEEDS_ANONYMOUS_USER } from "@/config/features";
import { useAnonymousSupabaseUser } from "@/features/chat/client/hooks/use-anonymous-supabase-user";

/**
 * 匿名ユーザーを用意するだけのコンポーネント。
 *
 * 匿名IDを必要とする機能（AIチャット・AIインタビュー）を出していないときは
 * 何もしない。閲覧するだけの利用者に識別子を発行しないため。
 */
export function AuthGate({ children }: { children?: ReactNode }) {
  if (!NEEDS_ANONYMOUS_USER) {
    return <>{children}</>;
  }

  return <AnonymousUserGate>{children}</AnonymousUserGate>;
}

function AnonymousUserGate({ children }: { children?: ReactNode }) {
  useAnonymousSupabaseUser();

  return <>{children}</>;
}
