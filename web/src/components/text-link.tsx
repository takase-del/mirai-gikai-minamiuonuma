import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isExternalHref } from "@/lib/utils/href";

interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * 本文中のテキストリンク。
 *
 * 外部リンクのときだけ別タブで開く。呼び出し側が内部・外部を意識して
 * target を書き分けると、内部リンクに `_blank` が付いたまま残りやすい。
 */
export function TextLink({ href, children, className }: TextLinkProps) {
  const isExternal = isExternalHref(href);

  return (
    <Link
      href={href as Route}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={cn(
        "underline underline-offset-2 transition-opacity hover:opacity-70",
        className
      )}
    >
      {children}
    </Link>
  );
}
