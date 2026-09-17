import { Eye, FileText, Search, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useSearchParams } from 'react-router'
import { CertificateStatusBadge, normalizeStatus } from '@/entities/certificate'
import { useExpertCertificates, type ExpertCertificate } from '@/entities/expert'
import { cn } from '@/shared/lib/cn'
import { useDebouncedValue } from '@/shared/lib/debounce'
import { Pagination } from '@/shared/ui'
import { CertificatesSkeleton } from '../certificates/certificates-states'
import { LoadErrorState } from '../load-error-state'
import {
  CERTIFICATE_STATUS_TABS,
  parseCertificateStatusTab,
  type CertificateStatusTab,
} from '../review-certificates/certificate-status-tab'
import { CertificateStatusTabs } from '../review-certificates/certificate-status-tabs'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 400
const HEAD_CELL_CLASS_NAME = 'px-5 py-3.5 font-bold'
const CELL_CLASS_NAME = 'text-body px-5 py-4'

function matchesTab(certificate: ExpertCertificate, tab: CertificateStatusTab) {
  return tab === 'all' || normalizeStatus(certificate.status) === tab.toUpperCase()
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  const { t } = useTranslation()
  const Icon = hasQuery ? SearchX : FileText

  return (
    <div className="bg-surface shadow-card border-line flex flex-col items-center rounded-3xl border px-6 py-14 text-center">
      <span className="bg-primary-soft text-primary flex size-14 items-center justify-center rounded-2xl">
        <Icon className="size-7" strokeWidth={2} aria-hidden="true" />
      </span>
      <h2 className="text-heading mt-5 text-[18px] font-bold">
        {hasQuery
          ? t('dashboard.certificates.noResults.title')
          : t('dashboard.reviewCertificates.empty.title')}
      </h2>
      <p className="text-body mt-2 max-w-sm text-[14px]">
        {hasQuery
          ? t('dashboard.certificates.noResults.text')
          : t('dashboard.reviewCertificates.empty.text')}
      </p>
    </div>
  )
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
            <tr className="border-line text-neutral border-b text-[12px] tracking-wide uppercase">
              <th scope="col" className={HEAD_CELL_CLASS_NAME}>
                {t('dashboard.reviewCertificates.columns.number')}
              </th>
              <th scope="col" className={HEAD_CELL_CLASS_NAME}>
                {t('dashboard.reviewCertificates.columns.candidate')}
              </th>
              <th scope="col" className={HEAD_CELL_CLASS_NAME}>
                {t('dashboard.reviewCertificates.columns.type')}
              </th>
              <th scope="col" className={HEAD_CELL_CLASS_NAME}>
                {t('dashboard.reviewCertificates.columns.language')}
              </th>
              <th scope="col" className={HEAD_CELL_CLASS_NAME}>
                {t('dashboard.experts.detail.reviewedAt')}
              </th>
              <th scope="col" className={HEAD_CELL_CLASS_NAME}>
                {t('dashboard.reviewCertificates.columns.status')}
              </th>
              <th scope="col" className={HEAD_CELL_CLASS_NAME}>
                <span className="sr-only">{t('dashboard.reviewCertificates.columns.actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-line divide-y">
            {certificates.map((item) => (
              <tr key={item.id} className="hover:bg-surface-sky transition-colors">
                <td className="text-heading px-5 py-4 font-bold tabular-nums">
                  {item.certificate_number || '—'}
                </td>
                <td className={CELL_CLASS_NAME}>{item.candidate_full_name || '—'}</td>
                <td className={CELL_CLASS_NAME}>{item.certificate_type || '—'}</td>
                <td className={CELL_CLASS_NAME}>{item.certificate_laanguage || '—'}</td>
                <td className={`${CELL_CLASS_NAME} whitespace-nowrap tabular-nums`}>
                  {item.created_at_str || '—'}
                </td>
                <td className="px-5 py-4">
                  <CertificateStatusBadge status={item.status} />
                </td>
                <td className="px-5 py-4 text-right">
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
                </td>
              </tr>
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
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const query = searchParams.get('q') ?? ''
  const tab = parseCertificateStatusTab(searchParams.get('status'))
  const [searchInput, setSearchInput] = useState(query)
  const debouncedSearch = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    if (debouncedSearch === query) return

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (debouncedSearch) next.set('q', debouncedSearch)
        else next.delete('q')
        next.delete('page')
        return next
      },
      { replace: true },
    )
  }, [debouncedSearch, query, setSearchParams])

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
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  // Filtr o'zgarib natija kamaysa, mavjud bo'lmagan sahifada qolib ketmaslik uchun
  const currentPage = Math.min(page, Math.max(totalPages, 1))
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const changeTab = (nextTab: CertificateStatusTab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (nextTab === 'all') next.delete('status')
        else next.set('status', nextTab)
        next.delete('page')
        return next
      },
      { replace: true },
    )
  }

  const goToPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(nextPage))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderContent = () => {
    if (isLoading) return <CertificatesSkeleton />

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

    if (filtered.length === 0) return <EmptyState hasQuery={Boolean(query)} />

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
        <div
          data-field-control
          className="bg-surface border-line focus-within:ring-primary flex h-12 items-center gap-3 rounded-xl border px-4 focus-within:ring-2 sm:w-full sm:max-w-md"
        >
          <Search className="text-neutral size-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          <input
            type="search"
            aria-label={t('dashboard.reviewCertificates.searchLabel')}
            placeholder={t('dashboard.experts.detail.searchPlaceholder')}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="text-heading placeholder:text-neutral/70 h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none"
          />
        </div>
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
