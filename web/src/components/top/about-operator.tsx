import { EXTERNAL_LINKS } from "@/config/external-links";
import { SITE } from "@/config/site";
import { LinkButton } from "./link-button";

/**
 * 運営者と立ち位置を明示するセクション。
 *
 * fork ガイドラインが求める免責文言（政党チームみらいの運営ではない旨）と、
 * 自治体公式ではない旨をトップページ上で必ず読める位置に置く。
 */
export function AboutOperator() {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-6">
        {/* ヘッダー */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">運営について</h2>
          <p className="text-sm font-bold text-primary-accent">
            {SITE.operator}
          </p>
        </div>

        {/* コンテンツ */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-[15px] leading-[28px] text-black">
              {SITE.name}は、{SITE.municipality}
              の有志が運営している非公式のサイトです。政党チームみらいが公開している
              オープンソースの「みらい議会」を fork し、{SITE.councilName}
              向けに作り替えて運営しています。
            </p>
            <p className="text-[15px] leading-[28px] text-black">
              {SITE.disclaimer}。また、{SITE.officialDisclaimer}。
              議案の正式な内容・議決結果は、必ず{SITE.councilName}
              の公式サイトでご確認ください。
            </p>
          </div>

          {/* ボタングループ */}
          <div className="flex flex-col gap-4">
            <LinkButton
              href={EXTERNAL_LINKS.COUNCIL}
              icon={{
                src: "/icons/interview-landmark.svg",
                alt: "",
                width: 23,
                height: 22,
              }}
            >
              {SITE.councilName}（公式サイト）
            </LinkButton>

            <LinkButton
              href={EXTERNAL_LINKS.ORIGINAL_MIRAI_GIKAI}
              icon={{
                src: "/icons/info-icon.svg",
                alt: "",
                width: 23,
                height: 22,
              }}
            >
              本家「みらい議会」
            </LinkButton>

            <LinkButton
              href={EXTERNAL_LINKS.GITHUB_REPO}
              icon={{
                src: "/icons/ai-chat.svg",
                alt: "",
                width: 23,
                height: 22,
              }}
            >
              ソースコード（AGPL-3.0）
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
