import type { Route } from "next";
import Link from "next/link";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { FORK_DISCLAIMER, SITE_NAME } from "@/config/site";

/**
 * fork 版であることの明示。
 *
 * FORK_GUIDELINES.md「5. 免責文言」により表示が必須。本家との混同を防ぐのが
 * 目的なので、フッター内でも周囲のリンク群に埋もれないよう面を分けて置く。
 * ガイドラインの推奨に従い、本家「みらい議会」への導線を併記する。
 *
 * ソースコードへのリンクも併せて置く。AGPL-3.0 第13条により、ネットワーク越しに
 * 本サービスを使う利用者へ改変後のソースへのアクセス手段を示す必要があるため。
 */
export function ForkDisclaimer() {
  return (
    <div className="mb-6 w-full rounded-xl bg-white/70 px-4 py-3.5">
      <p className="text-[13px] font-bold leading-[1.6] text-mirai-text">
        {FORK_DISCLAIMER}
      </p>
      <p className="mt-1.5 text-xs font-medium leading-[1.7] text-mirai-text-secondary">
        {SITE_NAME}は、チームみらいが公開する「みらい議会」を fork した非公式の
        サービスです。本家は{" "}
        <ExternalLink href={EXTERNAL_LINKS.UPSTREAM_MIRAI_GIKAI}>
          みらい議会
        </ExternalLink>
        、本サービスのソースコードは{" "}
        <ExternalLink href={EXTERNAL_LINKS.GITHUB_REPO}>GitHub</ExternalLink>{" "}
        で公開しています。
      </p>
    </div>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href as Route}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-2 transition-opacity hover:opacity-70"
    >
      {children}
    </Link>
  );
}
