/** @format */

import { FilePlus2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useCertificates } from "@/entities/certificate";
import { LIST_PAGE_SIZE, ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib/cn";
import { useUrlSearchState } from "@/shared/lib/url-state";
import {
  buttonVariants,
  Pagination,
  SearchInput,
  TableSkeleton,
} from "@/shared/ui";
import { CertificatesEmptyState } from "./certificates/certificates-states";
import { CertificatesTable } from "./certificates/certificates-table";
import { DashboardPageHeader } from "./dashboard-page-header";
import { LoadErrorState } from "./load-error-state";

export function DashboardCertificatesPage() {
  const { t } = useTranslation();
  const { page, query, searchInput, setSearchInput, goToPage } =
    useUrlSearchState();

  const { certificates, count, isLoading, isFetching, isError, refetch } =
    useCertificates({
      search: query || undefined,
      page,
      page_size: LIST_PAGE_SIZE,
    });
  const totalPages = Math.ceil(count / LIST_PAGE_SIZE);

  const renderContent = () => {
    if (isLoading) return <TableSkeleton />;

    if (isError && certificates.length === 0) {
      return (
        <LoadErrorState
          title={t("dashboard.certificates.loadError.title")}
          text={t("dashboard.certificates.loadError.text")}
          retry={{
            label: t("dashboard.certificates.loadError.retry"),
            onRetry: () => refetch(),
          }}
        />
      );
    }

    if (certificates.length === 0)
      return <CertificatesEmptyState hasQuery={Boolean(query)} />;

    return (
      <div className="bg-surface shadow-card border-line overflow-hidden rounded-3xl border">
        <div className={cn("transition-opacity", isFetching && "opacity-60")}>
          <CertificatesTable certificates={certificates} />
        </div>
        {totalPages > 1 && (
          <div className="border-line border-t px-5 py-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={goToPage}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      <DashboardPageHeader
        title={t("dashboard.pages.certificates.title")}
        subtitle={t("dashboard.certificates.subtitle")}
        actions={
          <Link to={ROUTES.newApplication} className={buttonVariants()}>
            <FilePlus2
              className="size-4 shrink-0"
              strokeWidth={2.4}
              aria-hidden="true"
            />
            {t("dashboard.certificates.newApplication")}
          </Link>
        }
      />

      <SearchInput
        className="mt-8 sm:max-w-md"
        label={t("dashboard.certificates.searchLabel")}
        placeholder={t("dashboard.certificates.searchPlaceholder")}
        value={searchInput}
        onChange={setSearchInput}
      />

      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}
