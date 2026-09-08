import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { SITE } from "@/config/site";
import { DietSessionList } from "@/features/diet-sessions/server/components/diet-session-list";
import { getDietSessionsWithCounts } from "@/features/diet-sessions/server/loaders/get-diet-sessions-with-counts";
import { routes } from "@/lib/routes";

export const metadata = {
  title: `会期から探す | ${SITE.name}`,
  description: `${SITE.councilName}の定例会・臨時会ごとに、提出された議案を一覧できます。`,
};

export default async function DietSessionsPage() {
  const sessions = await getDietSessionsWithCounts();

  return (
    <div className="bg-mirai-surface-muted">
      <Container className="pt-24 pb-8 md:pt-12">
        <DietSessionList sessions={sessions} />
      </Container>

      {/* パンくずリスト */}
      <Container className="pb-8">
        <nav className="flex items-center gap-2 text-[15px]">
          <Link href={routes.home()} className="text-black">
            TOP
          </Link>
          <ChevronRight className="h-5 w-5 text-black" />
          <span className="text-black">会期から探す</span>
        </nav>
      </Container>
    </div>
  );
}
