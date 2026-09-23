/** @format */

import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { generatePath, Link } from "react-router";
import {
  CertificatePaymentBadge,
  CertificateStatusBadge,
  isCertificatePaid,
  type CertificateListItem,
} from "@/entities/certificate";
import { ROUTES } from "@/shared/config";
import { formatApiDate } from "@/shared/lib/format";
import { TableHeadRow, TableRow, Td, Th } from "@/shared/ui";

function getDetailPath(id: number) {
  return generatePath(ROUTES.certificateDetail, { id: String(id) });
}

export function CertificatesTable({
  certificates,
}: {
  certificates: readonly CertificateListItem[];
}) {
  const { t } = useTranslation();

  return (
    <>
      {/* md+: jadval. Kichik ekranda ustunlar sig'maydi — pastdagi kartochkalar ro'yxati ko'rsatiladi */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-190 text-left text-[14px]">
          <thead>
            <TableHeadRow>
              <Th>{t("dashboard.certificates.columns.number")}</Th>
              <Th>{t("dashboard.certificates.columns.type")}</Th>
              <Th>{t("dashboard.certificates.columns.language")}</Th>
              <Th>{t("dashboard.certificates.columns.degree")}</Th>
              <Th>{t("dashboard.certificates.columns.issueDate")}</Th>
              <Th>{t("dashboard.certificates.columns.status")}</Th>
              <Th>{t("dashboard.certificates.columns.payment")}</Th>
              <Th>
                <span className="sr-only">
                  {t("dashboard.certificates.columns.actions")}
                </span>
              </Th>
            </TableHeadRow>
          </thead>
          <tbody className="divide-line divide-y">
            {certificates.map((certificate) => (
              <TableRow key={certificate.id}>
                <Td>
                  <Link
                    to={getDetailPath(certificate.id)}
                    className="text-heading hover:text-primary font-bold tabular-nums transition-colors"
                  >
                    {certificate.number}
                  </Link>
                </Td>
                <Td>{certificate.type_name || "—"}</Td>
                <Td>{certificate.language_name || "—"}</Td>
                <Td>{certificate.degree_name || "—"}</Td>
                <Td className="whitespace-nowrap tabular-nums">
                  {formatApiDate(certificate.issue_date) ?? "—"}
                </Td>
                <Td>
                  <CertificateStatusBadge status={certificate.status} />
                </Td>
                <Td>
                  <CertificatePaymentBadge
                    isPaid={isCertificatePaid(certificate)}
                  />
                </Td>
                <Td className="text-right">
                  <Link
                    to={getDetailPath(certificate.id)}
                    aria-label={`${t("dashboard.certificates.view")}: ${certificate.number}`}
                    className="text-primary hover:bg-primary-soft inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13.5px] font-semibold transition-colors"
                  >
                    <Eye
                      className="size-4 shrink-0"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    {t("dashboard.certificates.view")}
                  </Link>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-line divide-y md:hidden">
        {certificates.map((certificate) => (
          <li key={certificate.id}>
            <Link
              to={getDetailPath(certificate.id)}
              className="hover:bg-surface-sky block px-5 py-4 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-heading min-w-0 truncate font-bold tabular-nums">
                  {certificate.number}
                </p>
                <CertificateStatusBadge status={certificate.status} />
              </div>
              <p className="text-body mt-1 text-[13.5px]">
                {[
                  certificate.type_name,
                  certificate.language_name,
                  certificate.degree_name,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-neutral text-[12.5px] tabular-nums">
                  {formatApiDate(certificate.issue_date)}
                </span>
                <CertificatePaymentBadge
                  isPaid={isCertificatePaid(certificate)}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
