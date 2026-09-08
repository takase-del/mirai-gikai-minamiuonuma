import type { Metadata } from "next";
import { Container } from "@/components/layouts/container";
import {
  LegalList,
  LegalPageLayout,
  LegalParagraph,
  LegalSectionTitle,
} from "@/components/layouts/legal-page-layout";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `利用規約 | ${SITE.name}`,
  description: `${SITE.name}をご利用いただくにあたっての基本的なルールを定めています。`,
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      className="bg-transparent pt-24 md:pt-12"
      title="利用規約"
      enLabel="Terms of Service"
      description={`${SITE.name}をご利用いただくにあたっての基本的なルールを定めています。`}
    >
      <Container className="space-y-8">
        <p className="text-sm text-mirai-text-muted">
          最終更新日：{SITE.policyUpdatedAt}
        </p>

        <section className="space-y-4">
          <LegalSectionTitle>第1条（本サイトの位置づけ）</LegalSectionTitle>
          <LegalParagraph>
            {SITE.name}（以下「本サイト」といいます）は、{SITE.operatorName}
            （以下「運営者」といいます）が個人として運営する非公式のウェブサイトです。
          </LegalParagraph>
          <LegalList
            items={[
              `本サイトは、${SITE.municipality}および${SITE.councilName}が運営するものではなく、これらの見解を代弁するものでもありません。`,
              "本サイトは、政党チームみらいが運営するものではありません。同党が公開しているオープンソースソフトウェア「みらい議会」を利用していますが、運営上の関係はありません。",
              "運営者は、特定の政党・会派・議員を支持または批判する立場をとりません。",
            ]}
          />
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>第2条（掲載情報について）</LegalSectionTitle>
          <LegalParagraph>
            本サイトに掲載している議案の情報は、{SITE.councilName}
            が公表している議案書・会議録・議決結果・議会だより等の公開情報をもとにしています。
          </LegalParagraph>
          <LegalList
            items={[
              "議案の件名・議決結果・議案書の本文は、公表されている内容をそのまま転記しています。",
              "議案の「解説」は、運営者が生成AIを活用して作成したものを含みます。作成にあたっては議案書の記載に基づくよう努めていますが、誤りや不正確な要約が含まれる可能性があります。",
              "解説を作成していない議案については、その旨を各ページに明示しています。",
            ]}
          />
          <LegalParagraph>
            <strong>
              議案の正確な内容・議決結果は、必ず{SITE.councilName}
              が公表している一次資料をご確認ください。
            </strong>
            本サイトの記載を根拠とした判断により生じた結果について、運営者は責任を負いません。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>第3条（情報に係る不保証）</LegalSectionTitle>
          <LegalParagraph>
            運営者は、本サイトに掲載する情報について、可能な限り正確かつ最新の内容を反映するよう努めますが、その正確性・完全性・即時性を保証するものではありません。本サイトは運営者が個人として運営しているため、更新が滞ることや、議会の審議状況に追随できないことがあります。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>第4条（記載内容の誤りについて）</LegalSectionTitle>
          <LegalParagraph>
            掲載内容に誤りを見つけられた場合は、以下までご連絡ください。確認のうえ、訂正が必要と判断した場合は速やかに修正します。
          </LegalParagraph>
          <LegalList items={[`メール：${SITE.contactEmail}`]} />
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>第5条（禁止事項）</LegalSectionTitle>
          <LegalParagraph>
            本サイトのご利用にあたり、以下の行為を禁止します。
          </LegalParagraph>
          <LegalList
            items={[
              "法令または公序良俗に違反する行為",
              "本サイトのサーバーに過度の負荷をかける行為、不正アクセスを試みる行為",
              "本サイトの掲載内容を、あたかも南魚沼市または南魚沼市議会の公式見解であるかのように示して転載・引用する行為",
              "その他、本サイトの運営を妨害する行為",
            ]}
          />
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>第6条（著作権・ライセンス）</LegalSectionTitle>
          <LegalList
            items={[
              "本サイトのソースコードは AGPL-3.0 ライセンスのもとで公開しています。",
              "議案書の本文など、南魚沼市議会が公表している情報の権利は、それぞれの権利者に帰属します。",
              "運営者が作成した議案の解説文は、出典を明示していただければ自由にご利用いただけます。",
            ]}
          />
          <LegalParagraph>
            ソースコードは
            <a
              href={EXTERNAL_LINKS.GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              GitHubリポジトリ
            </a>
            で公開しています。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>第7条（サービスの変更・停止）</LegalSectionTitle>
          <LegalParagraph>
            運営者は、利用者への事前の通知なく、本サイトの内容を変更し、または提供を停止することができます。これにより利用者に生じた損害について、運営者は責任を負いません。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>第8条（規約の変更）</LegalSectionTitle>
          <LegalParagraph>
            運営者は必要に応じて本規約を変更することができます。変更後の規約は本ページに掲載した時点で効力を生じます。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>第9条（準拠法・管轄）</LegalSectionTitle>
          <LegalParagraph>
            本規約は日本法に準拠します。本サイトに関して生じた紛争については、新潟地方裁判所を第一審の専属的合意管轄裁判所とします。
          </LegalParagraph>
        </section>
      </Container>
    </LegalPageLayout>
  );
}
