import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { CertificateStatusBadge, normalizeStatus } from '@/entities/certificate'
import { useExpertCertificates, type ExpertCertificate } from '@/entities/expert'
import { LIST_PAGE_SIZE } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { useUrlSearchState } from '@/shared/lib/url-state'
import {
  Pagination,
  SearchInput,
  TableHeadRow,
  TableRow,
  TableSkeleton,
  Td,
  Th,
} from '@/shared/ui'
import { LoadErrorState } from '../load-error-state'
import {
  CERTIFICATE_STATUS_TABS,
  parseCertificateStatusTab,
  type CertificateStatusTab,
} from '../review-certificates/certificate-status-tab'
import { CertificateStatusTabs } from '../review-certificates/certificate-status-tabs'
import { ReviewCertificatesEmptyState } from '../review-certificates/review-certificates-states'

function matchesTab(certificate: ExpertCertificate, tab: CertificateStatusTab) {
  return tab === 'all' || normalizeStatus(certificate.status) === tab.toUpperCase()
}

type ExpertCertificatesTableProps = {
  certificates: readonly ExpertCertificate[]
  getDetailPath: (certificateId: number) => string
}

function ExpertCertificatesTable({ certificates, getDetailPath }: ExpertCertificatesTableProps) {
  const { t } = useTranslation()
  const location = useLocation()
  // Detal sahifasidagi "ortga" havolasi joriy tab/sahifa/qidiruvga qaytarishi uchun
  const linkState = { from: `${location.pathname}${location.search}` }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-[14px]">
          <thead>
            <TableHeadRow>
              <Th>{t('dashboard.reviewCertificates.columns.number')}</Th>
              <Th>{t('dashboard.reviewCertificates.columns.candidate')}</Th>
              <Th>{t('dashboard.reviewCertificates.columns.type')}</Th>
              <Th>{t('dashboard.reviewCertificates.columns.language')}</Th>
              <Th>{t('dashboard.experts.detail.reviewedAt')}</Th>
              <Th>{t('dashboard.reviewCertificates.columns.status')}</Th>
              <Th>
                <span className="sr-only">{t('dashboard.reviewCertificates.columns.actions')}</span>
              </Th>
            </TableHeadRow>
          </thead>
          <tbody className="divide-line divide-y">
            {certificates.map((item) => (
              <TableRow key={item.id}>
                <Td className="text-heading font-bold tabular-nums">
                  {item.certificate_number || '—'}
                </Td>
                <Td>{item.candidate_full_name || '—'}</Td>
                <Td>{item.certificate_type || '—'}</Td>
                <Td>{item.certificate_laanguage || '—'}</Td>
                <Td className="whitespace-nowrap tabular-nums">{item.created_at_str || '—'}</Td>
                <Td>
                  <CertificateStatusBadge status={item.status} />
                </Td>
                <Td className="text-right">
                  {item.certificate !== null && (
                    <Link
                      to={getDetailPath(item.certificate)}
                      state={linkState}
                      aria-label={`${t('dashboard.reviewCertificates.view')}: ${item.certificate_number}`}
                      className="text-primary hover:bg-primary-soft inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13.5px] font-semibold transition-colors"
                    >
                      <Eye className="size-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                      {t('dashboard.reviewCertificates.view')}
                    </Link>
                  )}
                </Td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-line divide-y md:hidden">
        {certificates.map((item) => {
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <p className="text-heading min-w-0 truncate font-bold tabular-nums">
                  {item.certificate_number || '—'}
                </p>
                <CertificateStatusBadge status={item.status} />
              </div>
              <p className="text-heading mt-1 text-[14px] font-semibold">
                {item.candidate_full_name || '—'}
              </p>
              <p className="text-body mt-0.5 text-[13.5px]">
                {[item.certificate_type, item.certificate_laanguage].filter(Boolean).join(' · ')}
              </p>
              <p className="text-neutral mt-2 text-[12.5px] tabular-nums">{item.created_at_str}</p>
            </>
          )

          return (
            <li key={item.id}>
              {item.certificate !== null ? (
                <Link
                  to={getDetailPath(item.certificate)}
                  state={linkState}
                  className="hover:bg-surface-sky block px-5 py-4 transition-colors"
                >
                  {content}
                </Link>
              ) : (
                <div className="px-5 py-4">{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}

type ExpertCertificatesPanelProps = {
  expertId: number
  getDetailPath: (certificateId: number) => string
}

/**
 * GET /main/expert-certificates/ — ekspert status qo'ygan sertifikatlar. Javob
 * paginatsiyasiz va holat filtrisiz keladi, shuning uchun tab bo'yicha saralash,
 * sonlar va sahifalash klient tomonida; qidiruv (raqam bo'yicha) esa serverda.
 */
export function ExpertCertificatesPanel({ expertId, getDetailPath }: ExpertCertificatesPanelProps) {
  const { t } = useTranslation()
  // Tab, sahifa va qidiruv URL'da saqlanadi — detal sahifasidan qaytilganda joy yo'qolmaydi
  const { page, query, searchInput, setSearchInput, setParam, goToPage, searchParams } =
    useUrlSearchState()
  const tab = parseCertificateStatusTab(searchParams.get('status'))

  const { certificates, isLoading, isFetching, isError, refetch } = useExpertCertificates({
    expert: expertId,
    search: query || undefined,
  })

  const counts = Object.fromEntries(
    CERTIFICATE_STATUS_TABS.map(({ value }) => [
      value,
      certificates.filter((item) => matchesTab(item, value)).length,
    ]),
  ) as Record<CertificateStatusTab, number>

  const filtered = certificates.filter((item) => matchesTab(item, tab))
  const totalPages = Math.ceil(filtered.length / LIST_PAGE_SIZE)
  // Filtr o'zgarib natija kamaysa, mavjud bo'lmagan sahifada qolib ketmaslik uchun
  const currentPage = Math.min(page, Math.max(totalPages, 1))
  const pageItems = filtered.slice(
    (currentPage - 1) * LIST_PAGE_SIZE,
    currentPage * LIST_PAGE_SIZE,
  )

  const changeTab = (nextTab: CertificateStatusTab) => {
    setParam('status', nextTab === 'all' ? null : nextTab)
  }

  const renderContent = () => {
    if (isLoading) return <TableSkeleton />

    if (isError && certificates.length === 0) {
      return (
        <LoadErrorState
          title={t('dashboard.certificates.loadError.title')}
          text={t('dashboard.certificates.loadError.text')}
          retry={{
            label: t('dashboard.certificates.loadError.retry'),
            onRetry: () => refetch(),
          }}
        />
      )
    }

    if (filtered.length === 0) return <ReviewCertificatesEmptyState hasQuery={Boolean(query)} />

    return (
      <div className="bg-surface shadow-card border-line overflow-hidden rounded-3xl border">
        <div className={cn('transition-opacity', isFetching && 'opacity-60')}>
          <ExpertCertificatesTable certificates={pageItems} getDetailPath={getDetailPath} />
        </div>
        {totalPages > 1 && (
          <div className="border-line border-t px-5 py-4">
            <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <CertificateStatusTabs value={tab} onChange={changeTab} counts={counts} />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          className="sm:w-full sm:max-w-md"
          label={t('dashboard.reviewCertificates.searchLabel')}
          placeholder={t('dashboard.experts.detail.searchPlaceholder')}
          value={searchInput}
          onChange={setSearchInput}
        />
        {!isLoading && filtered.length > 0 && (
          <p className="text-body text-[14px] tabular-nums">
            {t('dashboard.reviewCertificates.count', { count: filtered.length })}
          </p>
        )}
      </div>

      <div className="mt-6">{renderContent()}</div>
    </>
  )
}
