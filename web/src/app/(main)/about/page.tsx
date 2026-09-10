import type { Metadata } from "next";
import { SITE_NAME } from "@/config/site";
import { AboutPage } from "@/features/about/server/components/about-page";

export const metadata: Metadata = {
  title: `${SITE_NAME}について`,
  description: `${SITE_NAME}がどんなサービスか、チームみらいや本家「みらい議会」とどういう関係かを説明しています。`,
};

export default function Page() {
  return <AboutPage />;
}
