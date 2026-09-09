import type { Route } from "next";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import {
  LegalList,
  LegalPageLayout,
  LegalParagraph,
  LegalSectionTitle,
} from "@/components/layouts/legal-page-layout";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { FORK_DISCLAIMER, SITE_DESCRIPTION, SITE_NAME } from "@/config/site";

/**
 * このサービスについて説明するページ。
 *
 * 以前は「みらい議会とは」のリンク先を本家チームみらいの note 記事にしていたが、
 * fork 版のサービス名を掲げたまま本家の解説へ送るのは、FORK_GUIDELINES.md が
 * 防ごうとしている混同そのものになる。自前の説明をここに置く。
 */
export function AboutPage() {
  return (
    <LegalPageLayout
      title={`${SITE_NAME}について`}
      enLabel="About"
      description={SITE_DESCRIPTION}
      className="pt-24 md:pt-12"
    >
      <Container className="space-y-10">
        <section className="space-y-4">
          <LegalSectionTitle>このサービスについて</LegalSectionTitle>
          <LegalParagraph>
            {SITE_NAME}
            は、国会で今どんな法案が検討されているかを、南魚沼市に暮らす人にわかりやすく伝えることを目指したサービスです。国会に提出された議案などの公開情報をもとに、背景や論点を整理して掲載しています。
          </LegalParagraph>
          <LegalParagraph>
            掲載内容は公開情報の整理であり、法案の解釈や評価を確定させるものではありません。正確な内容は必ず一次情報をご確認ください。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>チームみらいとの関係</LegalSectionTitle>
          <LegalParagraph className="font-bold">
            {FORK_DISCLAIMER}。
          </LegalParagraph>
          <LegalParagraph>
            {SITE_NAME}は、政党チームみらいが AGPL-3.0
            ライセンスで公開しているソフトウェア「みらい議会」を fork
            （複製・改変）して運営している、非公式のサービスです。運営者はチームみらいとは別であり、掲載内容や運営方針についてチームみらいは責任を負いません。
          </LegalParagraph>
          <LegalParagraph>
            チームみらいが運営する本家のサービスは、以下からご覧いただけます。
          </LegalParagraph>
          <LegalList
            items={[
              {
                id: "upstream",
                content: (
                  <AboutLink href={EXTERNAL_LINKS.UPSTREAM_MIRAI_GIKAI}>
                    みらい議会（本家）
                  </AboutLink>
                ),
              },
              {
                id: "team-mirai",
                content: (
                  <AboutLink href={EXTERNAL_LINKS.TEAM_MIRAI_ABOUT}>
                    チームみらいについて
                  </AboutLink>
                ),
              },
            ]}
          />
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>ソースコードとライセンス</LegalSectionTitle>
          <LegalParagraph>
            本サービスのソースコードは AGPL-3.0
            ライセンスのもとで公開しています。改変した内容を含む全体を、どなたでもご覧いただけます。
          </LegalParagraph>
          <LegalList
            items={[
              {
                id: "source",
                content: (
                  <AboutLink href={EXTERNAL_LINKS.GITHUB_REPO}>
                    本サービスのソースコード（GitHub）
                  </AboutLink>
                ),
              },
              {
                id: "fork-guidelines",
                content: (
                  <AboutLink href={EXTERNAL_LINKS.FORK_GUIDELINES_NOTE}>
                    チームみらいの自主制作ガイドライン
                  </AboutLink>
                ),
              },
            ]}
          />
        </section>
      </Container>
    </LegalPageLayout>
  );
}

function AboutLink({
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
      className="text-mirai-brand-teal-hover underline underline-offset-2 transition-opacity hover:opacity-70"
    >
      {children}
    </Link>
  );
}
