import { Search, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useExpertStatistics, type ExpertStatistics } from '@/entities/expert'
import { CreateExpertDrawer } from '@/features/create-expert'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'
import { DashboardPageHeader } from './dashboard-page-header'
import { ExpertsEmptyState, ExpertsSkeleton } from './experts/experts-states'
import { ExpertsTable } from './experts/experts-table'
import { LoadErrorState } from './load-error-state'

// API paginatsiyasiz butun ro'yxatni qaytaradi — qidiruv shu yerda, so'rovsiz bajariladi
function matchesQuery(expert: ExpertStatistics, query: string) {
  return [expert.full_name, expert.phone, expert.passport, expert.pnfl, ...expert.language, ...expert.type]
    .filter((value) => value !== null && value !== undefined)
    .some((value) => String(value).toLowerCase().includes(query))
}

export function DashboardExpertsPage() {
  const { t } = useTranslation()
  const [searchInput, setSearchInput] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const query = searchInput.trim().toLowerCase()

  const { experts, isLoading, isFetching, isError, refetch } = useExpertStatistics()
  const filteredExperts = query ? experts.filter((expert) => matchesQuery(expert, query)) : experts

  const renderContent = () => {
    if (isLoading) return <ExpertsSkeleton />

    if (isError && experts.length === 0) {
      return (
        <LoadErrorState
          title={t('dashboard.experts.loadError.title')}
          text={t('dashboard.experts.loadError.text')}
          retry={{
            label: t('dashboard.experts.loadError.retry'),
            onRetry: () => refetch(),
          }}
        />
      )
    }

    if (filteredExperts.length === 0) return <ExpertsEmptyState hasQuery={Boolean(query)} />

    return (
      <div className="bg-surface shadow-card border-line overflow-hidden rounded-3xl border">
        <div className={cn('transition-opacity', isFetching && 'opacity-60')}>
          <ExpertsTable experts={filteredExperts} />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <DashboardPageHeader
        title={t('dashboard.pages.experts.title')}
        subtitle={t('dashboard.experts.subtitle')}
        actions={
          <Button type="button" onClick={() => setIsCreateOpen(true)}>
            <UserPlus className="size-4.5 shrink-0" strokeWidth={2.2} aria-hidden="true" />
            {t('dashboard.experts.create.open')}
          </Button>
        }
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          data-field-control
          className="bg-surface border-line focus-within:ring-primary flex h-12 items-center gap-3 rounded-xl border px-4 focus-within:ring-2 sm:w-full sm:max-w-md"
        >
          <Search className="text-neutral size-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          <input
            type="search"
            aria-label={t('dashboard.experts.searchLabel')}
            placeholder={t('dashboard.experts.searchPlaceholder')}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="text-heading placeholder:text-neutral/70 h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none"
          />
        </div>
        {!isLoading && experts.length > 0 && (
          <p className="text-body text-[14px] tabular-nums">
            {t('dashboard.experts.count', { count: filteredExperts.length })}
          </p>
        )}
      </div>

      <div className="mt-6">{renderContent()}</div>

      <CreateExpertDrawer open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  )
}
