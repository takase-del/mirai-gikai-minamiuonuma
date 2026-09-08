import { LinkButton } from "@/components/top/link-button";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { SITE } from "@/config/site";

/**
 * デスクトップメニュー: アクションボタン（サイドバー内）
 */
export function DesktopMenuActionButtons() {
  return (
    <div className="flex flex-col gap-3">
      <LinkButton
        href={EXTERNAL_LINKS.COUNCIL}
        icon={{
          src: "/icons/interview-landmark.svg",
          alt: "",
          width: 20,
          height: 20,
        }}
      >
        {SITE.councilName}（公式）
      </LinkButton>
    </div>
  );
}
