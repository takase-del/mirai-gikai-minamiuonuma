import { EXTERNAL_LINKS } from "@/config/external-links";
import { SITE } from "@/config/site";
import { routes } from "@/lib/routes";

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterPolicyLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const primaryLinks: FooterLink[] = [
  {
    label: "TOP",
    href: routes.home(),
  },
  {
    label: "会期から探す",
    href: routes.gikaiSessions(),
  },
  {
    label: `${SITE.councilName}（公式）`,
    href: EXTERNAL_LINKS.COUNCIL,
    external: true,
  },
  {
    label: "会議録・議決結果",
    href: EXTERNAL_LINKS.COUNCIL_MINUTES,
    external: true,
  },
];

export const policyLinks: FooterPolicyLink[] = [
  {
    label: "よくあるご質問",
    href: EXTERNAL_LINKS.FAQ,
    external: true,
  },
  {
    label: "利用規約",
    href: routes.terms(),
  },
  {
    label: "プライバシーポリシー",
    href: routes.privacy(),
  },
  {
    label: "開発者向け",
    href: routes.developers(),
  },
  {
    label: "ソースコード（AGPL-3.0）",
    href: EXTERNAL_LINKS.GITHUB_REPO,
    external: true,
  },
];
