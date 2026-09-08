import type { Route } from "next";
import Link from "next/link";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { SITE } from "@/config/site";
import { routes } from "@/lib/routes";

type FooterLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

const links: FooterLinkItem[] = [
  {
    label: "会期から探す",
    href: routes.gikaiSessions(),
    external: false,
  },
  {
    label: "利用規約",
    href: routes.terms(),
    external: false,
  },
  {
    label: "プライバシーポリシー",
    href: routes.privacy(),
    external: false,
  },
  {
    label: "よくあるご質問",
    href: EXTERNAL_LINKS.FAQ,
    external: true,
  },
  {
    label: "ソースコード（AGPL-3.0）",
    href: EXTERNAL_LINKS.GITHUB_REPO,
    external: true,
  },
  {
    label: "本家「みらい議会」",
    href: EXTERNAL_LINKS.ORIGINAL_MIRAI_GIKAI,
    external: true,
  },
];

/**
 * デスクトップメニュー: フッターリンク（サイドバー内）
 */
export function DesktopMenuLinks() {
  return (
    <div className="flex flex-col gap-1.5">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href as Route}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer" : undefined}
          className="font-medium text-xs transition-opacity hover:opacity-70"
          style={{
            lineHeight: "1.48em",
          }}
        >
          {link.label}
        </Link>
      ))}
      <p
        className="font-medium text-xs text-mirai-text-note"
        style={{
          lineHeight: "1.48em",
        }}
      >
        {SITE.disclaimer}
      </p>
      <p
        className="font-medium text-xs"
        style={{
          lineHeight: "1.48em",
        }}
      >
        {SITE.copyright}
      </p>
    </div>
  );
}
