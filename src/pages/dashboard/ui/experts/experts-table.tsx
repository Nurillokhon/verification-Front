/** @format */

import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { generatePath, Link } from "react-router";
import { getExpertName, type ExpertStatistics } from "@/entities/expert";
import { getInitials } from "@/entities/user";
import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib/cn";
import { TableHeadRow, TableRow, Td, Th } from "@/shared/ui";

function getDetailPath(id: number) {
  return generatePath(ROUTES.expertDetail, { id: String(id) });
}

// Raqamli ustunlar o'ngga tekislanadi
const NUMBER_HEAD_CELL_CLASS_NAME = "text-right";
const NUMBER_CELL_CLASS_NAME = "text-right font-semibold tabular-nums";

function ExpertAvatar({ expert }: { expert: ExpertStatistics }) {
  const initials = expert.full_name ? getInitials(expert.full_name) : null;

  return (
    <span
      aria-hidden="true"
      className="bg-primary-soft text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
    >
      {initials ?? `#${expert.id}`}
    </span>
  );
}

export function TagList({ items }: { items: readonly string[] }) {
  if (items.length === 0) return <span className="text-neutral">—</span>;

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="bg-surface-muted text-body rounded-full px-2.5 py-0.5 text-[12px] font-semibold whitespace-nowrap"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

type StatKey =
  | "all_certificates"
  | "approved_certificates"
  | "rejected_certificates"
  | "problem_certificates"
  | "pending_reviews";

// Ustun tartibi va rangi bitta joyda — jadval va mobil kartochka bir xil ko'rinadi
const STAT_COLUMNS = [
  {
    key: "all_certificates",
    labelKey: "dashboard.experts.columns.total",
    className: "text-heading",
  },
  {
    key: "approved_certificates",
    labelKey: "dashboard.experts.columns.approved",
    className: "text-primary",
  },
  {
    key: "rejected_certificates",
    labelKey: "dashboard.experts.columns.rejected",
    className: "text-danger",
  },
  {
    key: "problem_certificates",
    labelKey: "dashboard.experts.columns.problem",
    className: "text-gold",
  },
  {
    key: "pending_reviews",
    labelKey: "dashboard.experts.columns.pending",
    className: "text-secondary",
  },
] as const satisfies readonly {
  key: StatKey;
  labelKey: string;
  className: string;
}[];

export function ExpertsTable({
  experts,
}: {
  experts: readonly ExpertStatistics[];
}) {
  const { t } = useTranslation();

  return (
    <>
      {/* lg+: jadval. Kichik ekranda ustunlar sig'maydi — pastdagi kartochkalar ro'yxati ko'rsatiladi */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-270 text-left text-[14px]">
          <thead>
            <TableHeadRow>
              <Th>{t("dashboard.experts.columns.expert")}</Th>
              <Th>{t("dashboard.experts.columns.documents")}</Th>
              <Th>{t("dashboard.experts.columns.languages")}</Th>
              <Th>{t("dashboard.experts.columns.types")}</Th>
              {STAT_COLUMNS.map((column) => (
                <Th key={column.key} className={NUMBER_HEAD_CELL_CLASS_NAME}>
                  {t(column.labelKey)}
                </Th>
              ))}
              <Th>
                <span className="sr-only">
                  {t("dashboard.experts.columns.actions")}
                </span>
              </Th>
            </TableHeadRow>
          </thead>
          <tbody className="divide-line divide-y">
            {experts.map((expert) => (
              <TableRow key={expert.id}>
                <Td>
                  <Link
                    to={getDetailPath(expert.id)}
                    className="group flex items-center gap-3"
                  >
                    <ExpertAvatar expert={expert} />
                    <div className="min-w-0">
                      <p className="text-heading group-hover:text-primary truncate font-bold transition-colors">
                        {getExpertName(expert)}
                      </p>
                      {expert.full_name && (
                        <p className="text-neutral text-[12.5px] tabular-nums">
                          {expert.phone}
                        </p>
                      )}
                    </div>
                  </Link>
                </Td>
                <Td className="whitespace-nowrap tabular-nums">
                  <p>{expert.passport || "—"}</p>
                  <p className="text-neutral text-[12.5px]">
                    {expert.pnfl || "—"}
                  </p>
                </Td>
                <Td>
                  <TagList items={expert.language} />
                </Td>
                <Td>
                  <TagList items={expert.type} />
                </Td>
                {STAT_COLUMNS.map((column) => (
                  <Td key={column.key} className={cn(NUMBER_CELL_CLASS_NAME, column.className)}>
                    {expert[column.key]}
                  </Td>
                ))}
                <Td className="text-right">
                  <Link
                    to={getDetailPath(expert.id)}
                    aria-label={`${t("dashboard.experts.view")}: ${getExpertName(expert)}`}
                    className="text-primary hover:bg-primary-soft inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13.5px] font-semibold transition-colors"
                  >
                    <Eye
                      className="size-4 shrink-0"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    {t("dashboard.experts.view")}
                  </Link>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-line divide-y lg:hidden">
        {experts.map((expert) => (
          <li key={expert.id}>
            <Link
              to={getDetailPath(expert.id)}
              className="hover:bg-surface-sky block px-5 py-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExpertAvatar expert={expert} />
                <div className="min-w-0">
                  <p className="text-heading truncate font-bold">
                    {getExpertName(expert)}
                  </p>
                  <p className="text-neutral text-[12.5px] tabular-nums">
                    {[expert.full_name && expert.phone, expert.passport]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>

              {(expert.language.length > 0 || expert.type.length > 0) && (
                <div className="mt-3">
                  <TagList items={[...expert.language, ...expert.type]} />
                </div>
              )}

              <dl className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {STAT_COLUMNS.map((column) => (
                  <div
                    key={column.key}
                    className="bg-surface-sky rounded-xl px-3 py-2"
                  >
                    <dt className="text-neutral truncate text-[11.5px] font-semibold">
                      {t(column.labelKey)}
                    </dt>
                    <dd
                      className={cn(
                        "text-[16px] font-bold tabular-nums",
                        column.className,
                      )}
                    >
                      {expert[column.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
