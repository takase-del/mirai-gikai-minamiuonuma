import { Container } from "@/components/layouts/container";
import {
  LegalList,
  LegalPageLayout,
  LegalParagraph,
  LegalSectionTitle,
} from "@/components/layouts/legal-page-layout";
import { TextLink } from "@/components/text-link";
import { EXTERNAL_LINKS } from "@/config/external-links";
import {
  FORK_DISCLAIMER,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OPERATOR,
} from "@/config/site";
import { routes } from "@/lib/routes";

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
          <LegalSectionTitle>運営者</LegalSectionTitle>
          <LegalParagraph>
            {SITE_NAME}は{SITE_OPERATOR}
            が運営しています。利用規約・プライバシーポリシーにおける「当方」は
            {SITE_OPERATOR}を指します。
          </LegalParagraph>
          <LegalList
            items={[
              {
                id: "terms",
                content: (
                  <TextLink
                    className="text-mirai-brand-teal-hover"
                    href={routes.terms()}
                  >
                    利用規約
                  </TextLink>
                ),
              },
              {
                id: "privacy",
                content: (
                  <TextLink
                    className="text-mirai-brand-teal-hover"
                    href={routes.privacy()}
                  >
                    プライバシーポリシー
                  </TextLink>
                ),
              },
            ]}
          />
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>チームみらいとの関係</LegalSectionTitle>
          <LegalParagraph className="font-bold">
            {FORK_DISCLAIMER}。
          </LegalParagraph>
          <LegalParagraph>
            {SITE_NAME}は、政党チームみらいが AGPL-3.0
            ライセンスで公開しているソフトウェア「みらい議会」を fork
            （複製・改変）して運営している、非公式のサービスです。運営者は
            {SITE_OPERATOR}
            であってチームみらいではなく、掲載内容や運営方針について
            チームみらいは責任を負いません。
          </LegalParagraph>
          <LegalParagraph>
            チームみらいが運営する本家のサービスは、以下からご覧いただけます。
          </LegalParagraph>
          <LegalList
            items={[
              {
                id: "upstream",
                content: (
                  <TextLink
                    className="text-mirai-brand-teal-hover"
                    href={EXTERNAL_LINKS.UPSTREAM_MIRAI_GIKAI}
                  >
                    みらい議会（本家）
                  </TextLink>
                ),
              },
              {
                id: "team-mirai",
                content: (
                  <TextLink
                    className="text-mirai-brand-teal-hover"
                    href={EXTERNAL_LINKS.TEAM_MIRAI_ABOUT}
                  >
                    チームみらいについて
                  </TextLink>
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
                  <TextLink
                    className="text-mirai-brand-teal-hover"
                    href={EXTERNAL_LINKS.GITHUB_REPO}
                  >
                    本サービスのソースコード（GitHub）
                  </TextLink>
                ),
              },
              {
                id: "fork-guidelines",
                content: (
                  <TextLink
                    className="text-mirai-brand-teal-hover"
                    href={EXTERNAL_LINKS.FORK_GUIDELINES_NOTE}
                  >
                    チームみらいの自主制作ガイドライン
                  </TextLink>
                ),
              },
            ]}
          />
        </section>
      </Container>
    </LegalPageLayout>
  );
}
