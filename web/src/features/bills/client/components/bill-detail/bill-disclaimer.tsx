import { LinkButton } from "@/components/top/link-button";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { SITE } from "@/config/site";

export function BillDisclaimer() {
  return (
    <div className="space-y-6 pt-4 pb-10">
      {/* データの出典について */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black">掲載コンテンツについて</h3>
        <p className="text-xs leading-relaxed text-mirai-text-note">
          掲載している議案の情報は、{SITE.councilName}
          が公開している議案書・会議録・議決結果・議会だよりなどの公開情報をもとに、
          {SITE.operator}がAIを活用しながら背景情報を整理したものです。
          市長提出議案（条例の制定・改正、予算、人事案件など）と議員提出議案の
          双方を対象としています。
        </p>
      </div>

      {/* 掲載コンテンツについての免責事項 */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black">免責事項</h3>
        <p className="text-xs leading-relaxed text-mirai-text-note">
          本サイトで公開する情報は、可能な限り正確かつ最新の情報を反映するよう努めていますが、その正確性・完全性・即時性について保証するものではありません。また、AIチャットは不正確または誤解を招く回答を生成する可能性があります。正確な情報は、
          {SITE.councilName}の公式サイトに掲載されている議案書・会議録・
          議決結果をご確認ください。
        </p>
        <p className="text-xs leading-relaxed text-mirai-text-note">
          {SITE.disclaimer}。また、{SITE.officialDisclaimer}。
        </p>
      </div>

      <LinkButton
        href={EXTERNAL_LINKS.COUNCIL_MINUTES}
        icon={{
          src: "/icons/question-bubble.svg",
          alt: "",
          width: 22,
          height: 22,
        }}
      >
        会議録・議決結果（公式）
      </LinkButton>
    </div>
  );
}
