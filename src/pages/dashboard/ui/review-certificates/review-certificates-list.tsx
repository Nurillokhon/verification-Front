import { useTranslation } from 'react-i18next'
import { useCertificates } from '@/entities/certificate'
import { LIST_PAGE_SIZE } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { useUrlSearchState } from '@/shared/lib/url-state'
import { Pagination, SearchInput, TableSkeleton } from '@/shared/ui'
import { LoadErrorState } from '../load-error-state'
import { parseCertificateStatusTab, type CertificateStatusTab } from './certificate-status-tab'
import { CertificateStatusTabs } from './certificate-status-tabs'
import { ReviewCertificatesEmptyState } from './review-certificates-states'
import { ReviewCertificatesTable } from './review-certificates-table'

type ReviewCertificatesListProps = {
  getDetailPath: (id: number) => string
  /** Berilsa — faqat shu ekspertga tegishli sertifikatlar so'raladi */
  expertId?: number
  counts?: Partial<Record<CertificateStatusTab, number>>
  showExpert?: boolean
}

/**
 * GET /main/certificates/ ro'yxati: holat tablari, qidiruv va sahifalash.
 * Qaysi sertifikatlar kelishini backend rolga qarab o'zi cheklaydi
 * (admin — barcha to'langanlar, ekspert — o'z tili va turi bo'yicha).
 */
export function ReviewCertificatesList({
  getDetailPath,
  expertId,
  counts,
  showExpert,
}: ReviewCertificatesListProps) {
  const { t } = useTranslation()
  // Tab, sahifa va qidiruv URL'da saqlanadi — detal sahifasidan qaytilganda joy yo'qolmaydi
  const { page, query, searchInput, setSearchInput, setParam, goToPage, searchParams } =
    useUrlSearchState()
  const tab = parseCertificateStatusTab(searchParams.get('status'))

  const { certificates, count, isLoading, isFetching, isError, refetch } = useCertificates({
    expert: expertId,
    status: tab === 'all' ? undefined : tab,
    search: query || undefined,
    page,
    page_size: LIST_PAGE_SIZE,
  })
  const totalPages = Math.ceil(count / LIST_PAGE_SIZE)

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

    if (certificates.length === 0) return <ReviewCertificatesEmptyState hasQuery={Boolean(query)} />

    return (
      <div className="bg-surface shadow-card border-line overflow-hidden rounded-3xl border">
        <div className={cn('transition-opacity', isFetching && 'opacity-60')}>
          <ReviewCertificatesTable
            certificates={certificates}
            getDetailPath={getDetailPath}
            showExpert={showExpert}
          />
        </div>
        {totalPages > 1 && (
          <div className="border-line border-t px-5 py-4">
            <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
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
          placeholder={t('dashboard.reviewCertificates.searchPlaceholder')}
          value={searchInput}
          onChange={setSearchInput}
        />
        {!isLoading && count > 0 && (
          <p className="text-body text-[14px] tabular-nums">
            {t('dashboard.reviewCertificates.count', { count })}
          </p>
        )}
      </div>

      <div className="mt-6">{renderContent()}</div>
    </>
  )
}
