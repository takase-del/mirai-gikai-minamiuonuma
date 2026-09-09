import { LinkButton } from "@/components/top/link-button";
import { SITE_NAME } from "@/config/site";
import { routes } from "@/lib/routes";

/**
 * デスクトップメニュー: アクションボタン（サイドバー内）
 */
export function DesktopMenuActionButtons() {
  return (
    <div className="flex flex-col gap-3">
      <LinkButton
        href={routes.about()}
        icon={{
          src: "/icons/note-icon.png",
          alt: "note",
          width: 20,
          height: 20,
        }}
      >
        {SITE_NAME}とは
      </LinkButton>
    </div>
  );
}
