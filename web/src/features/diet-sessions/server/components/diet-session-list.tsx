import "server-only";
import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SITE } from "@/config/site";
import { routes } from "@/lib/routes";
import { formatSessionPeriod } from "../../shared/utils/format-session-period";
import type { DietSessionWithCount } from "../loaders/get-diet-sessions-with-counts";

type Props = {
  sessions: DietSessionWithCount[];
};

export function DietSessionList({ sessions }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-bold leading-[1.4]">会期から探す</h1>
        <p className="text-sm font-medium text-mirai-text-note">
          {SITE.councilName}
          の定例会・臨時会ごとに、提出された議案を一覧できます。
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {sessions.map(({ session, publishedBillCount }) => {
          // slug が無い会期はURLを作れないので出さない
          if (!session.slug) {
            return null;
          }
          const isEmpty = publishedBillCount === 0;

          return (
            <li key={session.id}>
              <Link
                href={routes.gikaiSessionBills(session.slug) as Route}
                className="group flex items-center gap-3 rounded-lg border border-black bg-white px-5 py-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[17px] font-bold">
                      {session.name}
                    </span>
                    {session.is_active && (
                      <span className="rounded-full bg-mirai-gradient px-2.5 py-0.5 text-xs font-bold text-mirai-text">
                        会期中
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-mirai-text-note">
                    {formatSessionPeriod(session.start_date, session.end_date)}
                    {isEmpty
                      ? "　議案は準備中です"
                      : `　議案 ${publishedBillCount}件`}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-600 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
