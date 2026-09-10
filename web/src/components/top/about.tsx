import Image from "next/image";
import { SITE_DESCRIPTION, SITE_NAME } from "@/config/site";
import { routes } from "@/lib/routes";
import { LinkButton } from "./link-button";

export function About() {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-4">
        {/* ヘッダー */}
        <div className="flex flex-col gap-4">
          <h2>
            <Image
              src="/icons/about-typography.svg"
              alt="About"
              width={143}
              height={36}
              priority
            />
          </h2>
          <p className="text-sm font-bold text-primary-accent">
            {SITE_NAME}とは
          </p>
        </div>

        {/* コンテンツ */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold leading-[43.2px]">
              国会での議論を
              <br />
              できる限りわかりやすく
            </h3>
            <p className="text-[15px] leading-[28px] text-black">
              {SITE_NAME}は、{SITE_DESCRIPTION}
              です。国民の意見を政治に届けることを目指して、継続的にアップデートしていきます。
            </p>
          </div>

          {/* もっと詳しく知るボタン */}
          <LinkButton
            href={routes.about()}
            icon={{
              src: "/icons/note-icon.png",
              alt: "note",
              width: 25,
              height: 25,
            }}
          >
            {SITE_NAME}とは
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
