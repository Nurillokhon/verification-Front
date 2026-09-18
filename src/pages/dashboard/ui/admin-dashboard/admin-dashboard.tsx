import { Banknote, CreditCard, FileText, Users, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAdminStatistics, type AdminStatistics } from '@/entities/statistics'
import { useCurrentUser } from '@/entities/user'
import { cn } from '@/shared/lib/cn'
import { formatAmount } from '@/shared/lib/format'
import { DashboardPageHeader } from '../dashboard-page-header'
import { LoadErrorState } from '../load-error-state'
import { MonthlyChart } from './monthly-chart'

const numberFormat = new Intl.NumberFormat('ru-RU')

function toCount(value: unknown) {
  return Number(value) || 0
}

// paid_summ formatlangan matn ("13,300,000") — faqat ko'rinishi loyiha formatiga
// ("13 300 000") keltiriladi; tanib bo'lmasa backend matni o'zicha qoladi.
function formatRevenue(value: string | null | undefined) {
  if (!value) return '0'
  const plain = value.replace(/[,\s]/g, '')
  return /^\d+(\.\d+)?$/.test(plain) ? (formatAmount(plain) ?? value) : value
}

type StatCard = {
  key: string
  label: string
  value: string
  /** Qiymat yonidagi kichik birlik (so'm) — katta raqam bilan birga qatorga sig'masa ham ajralmaydi */
  unit?: string
  note?: string
  icon: LucideIcon
  toneClassName: string
}

function AdminStatCards({ statistics }: { statistics: AdminStatistics }) {
  const { t } = useTranslation()
  const allCertificates = toCount(statistics.all_certificates)
  const paidCertificates = toCount(statistics.paid_certificates)

  const cards: StatCard[] = [
    {
      key: 'candidates',
      label: t('dashboard.adminDashboard.stats.candidates'),
      value: numberFormat.format(toCount(statistics.all_candidates)),
      icon: Users,
      toneClassName: 'bg-secondary/10 text-secondary',
    },
    {
      key: 'certificates',
      label: t('dashboard.adminDashboard.stats.certificates'),
      value: numberFormat.format(allCertificates),
      icon: FileText,
      toneClassName: 'bg-primary-soft text-primary',
    },
    {
      key: 'paid',
      label: t('dashboard.adminDashboard.stats.paid'),
      value: numberFormat.format(paidCertificates),
      note:
        allCertificates > 0
          ? t('dashboard.adminDashboard.stats.paidShare', {
              percent: Math.round((paidCertificates / allCertificates) * 100),
            })
          : undefined,
      icon: CreditCard,
      toneClassName: 'bg-primary-soft text-primary',
    },
    {
      key: 'revenue',
      label: t('dashboard.adminDashboard.stats.revenue'),
      value: formatRevenue(statistics.paid_summ),
      unit: t('dashboard.adminDashboard.stats.currency'),
      icon: Banknote,
      toneClassName: 'bg-gold/15 text-gold',
    },
  ]

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, value, unit, note, icon: Icon, toneClassName }) => (
        <li
          key={key}
          className="bg-surface shadow-card border-line flex items-center gap-4 rounded-2xl border p-5"
        >
          <span
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-xl',
              toneClassName,
            )}
          >
            <Icon className="size-5.5" strokeWidth={2} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-body text-[13.5px]">{label}</p>
            <p className="text-heading mt-0.5 text-[24px] leading-tight font-extrabold wrap-break-word">
              {value}
              {unit && <span className="text-body ml-1.5 text-[14px] font-semibold">{unit}</span>}
            </p>
            {note && <p className="text-neutral text-[12.5px]">{note}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}

function AdminDashboardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="bg-surface-muted h-28 rounded-2xl" />
        ))}
      </div>
      <div className="bg-surface-muted h-96 rounded-3xl" />
    </div>
  )
}

/** Admin bosh sahifasi: GET /main/admin-statistics/ — umumiy ko'rsatkichlar va 12 oylik grafik. */
export function AdminDashboard() {
  const { t } = useTranslation()
  const { user } = useCurrentUser()
  const { statistics, isLoading, isError, refetch } = useAdminStatistics()

  const renderContent = () => {
    if (isLoading) return <AdminDashboardSkeleton />

    if (isError || !statistics) {
      return (
        <LoadErrorState
          title={t('dashboard.adminDashboard.loadError.title')}
          text={t('dashboard.adminDashboard.loadError.text')}
          retry={{
            label: t('dashboard.adminDashboard.loadError.retry'),
            onRetry: () => refetch(),
          }}
        />
      )
    }

    return (
      <div className="space-y-6">
        <AdminStatCards statistics={statistics} />
        <MonthlyChart
          stats={Array.isArray(statistics.monthly_stats) ? statistics.monthly_stats : []}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <DashboardPageHeader
        title={t('dashboard.pages.index.title')}
        subtitle={
          user?.full_name
            ? `${user.full_name} · ${t('dashboard.adminDashboard.subtitle')}`
            : t('dashboard.adminDashboard.subtitle')
        }
      />
      <div className="mt-8">{renderContent()}</div>
    </div>
  )
}
