import type { Metadata } from "next";
import { Container } from "@/components/layouts/container";
import {
  LegalList,
  LegalPageLayout,
  LegalParagraph,
  LegalSectionTitle,
} from "@/components/layouts/legal-page-layout";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `プライバシーポリシー | ${SITE.name}`,
  description: `${SITE.name}のプライバシーポリシー`,
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      className="bg-transparent pt-24 md:pt-12"
      title="プライバシーポリシー"
      enLabel="Privacy Policy"
      description={`${SITE.operatorName}（以下「運営者」といいます）が運営する${SITE.name}における、利用者情報の取り扱いについてご説明します。`}
    >
      <Container className="space-y-8">
        <p className="text-sm text-mirai-text-muted">
          最終更新日：{SITE.policyUpdatedAt}
        </p>

        <section className="space-y-4">
          <LegalSectionTitle>1. 基本方針</LegalSectionTitle>
          <LegalParagraph>
            本サイトは、{SITE.councilName}
            が公表している議案情報をわかりやすく伝えることを目的としています。この目的に、利用者を個人として識別する情報は必要ないと考えています。そのため本サイトは、
            <strong>
              会員登録の仕組みを設けず、氏名・住所・電話番号・メールアドレスなどの個人情報を利用者から取得しません。
            </strong>
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>2. 取得する情報</LegalSectionTitle>
          <LegalParagraph>
            本サイトが取得するのは、以下の情報に限られます。
          </LegalParagraph>
          <LegalList
            items={[
              "表示設定のCookie：議案の説明を「やさしく／詳しく」のどちらで表示するかという設定を、次回以降も保つために利用者の端末に保存します。この設定だけを保存するもので、閲覧履歴の記録や個人の識別には利用しません。",
              "サーバーのアクセスログ：本サイトを稼働させているホスティング事業者（Vercel Inc.）が、サービスの提供と障害対応のために、IPアドレス・アクセス日時・閲覧されたページ・ブラウザの種類などを自動的に記録します。運営者はこれを、表示速度や不具合の把握といった運用の目的でのみ確認します。",
            ]}
          />
          <LegalParagraph>
            なお本サイトは、
            <strong>アクセス解析ツールを導入していません。</strong>
            Google Analytics
            をはじめとする解析目的のCookieや広告のトラッキングは使用していません。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>3. 取得しない情報</LegalSectionTitle>
          <LegalParagraph>
            誤解を避けるため、本サイトが取得しないものを明示します。
          </LegalParagraph>
          <LegalList
            items={[
              "氏名、住所、電話番号、メールアドレス、生年月日その他の個人を識別できる情報",
              "利用者による入力内容（本サイトには、意見や問い合わせを送信する機能を設けていません）",
              "他サイトでの閲覧履歴、広告識別子、位置情報",
            ]}
          />
          <LegalParagraph>
            お問い合わせは第7条に記載のメールアドレス宛にお送りいただく形をとっています。メールでご連絡いただいた場合、その内容と送信元のメールアドレスは、回答のために必要な範囲で運営者が保有します。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>4. 第三者への提供</LegalSectionTitle>
          <LegalParagraph>
            運営者は、取得した情報を第三者に提供・販売しません。ただし、本サイトの稼働には以下の事業者のサービスを利用しており、前条までに記載した範囲の情報が各事業者において取り扱われます。
          </LegalParagraph>
          <LegalList
            items={[
              "Vercel Inc.（アメリカ合衆国）：本サイトのホスティング。アクセスログおよび表示速度の計測情報が記録されます。",
              "Supabase Inc.（シンガポール）：議案データの保管。議案の情報のみを保存しており、利用者に関する情報は含みません。",
            ]}
          />
          <LegalParagraph>
            法令に基づく開示請求があった場合は、これに応じることがあります。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>5. Cookieの無効化</LegalSectionTitle>
          <LegalParagraph>
            表示設定のCookieは、ブラウザの設定でいつでも削除・拒否できます。拒否した場合も本サイトは問題なくご利用いただけますが、表示の切り替え設定がページを移動するたびに初期値へ戻ります。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>6. 本ポリシーの変更</LegalSectionTitle>
          <LegalParagraph>
            本サイトの機能追加などにより取得する情報が変わる場合は、本ポリシーを改訂したうえで、本ページに変更後の内容と最終更新日を掲載します。
          </LegalParagraph>
        </section>

        <section className="space-y-4">
          <LegalSectionTitle>7. お問い合わせ窓口</LegalSectionTitle>
          <LegalParagraph>
            本ポリシーおよび本サイトの情報の取り扱いに関するお問い合わせは、以下までご連絡ください。
          </LegalParagraph>
          <LegalList
            items={[
              `運営者：${SITE.operatorName}`,
              `メール：${SITE.contactEmail}`,
            ]}
          />
        </section>
      </Container>
    </LegalPageLayout>
  );
}
