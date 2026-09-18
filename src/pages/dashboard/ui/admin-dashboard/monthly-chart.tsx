import dayjs from 'dayjs'
import { ChartColumn, Table2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MonthlyStat } from '@/entities/statistics'
import { cn } from '@/shared/lib/cn'

// Taxminiy belgilar soni — haqiqiy son eng katta qiymatga qarab 2-4 orasida chiqadi
const TARGET_TICK_COUNT = 4
const numberFormat = new Intl.NumberFormat('ru-RU')

/** 1-2-5 qatoridagi "chiroyli" qadam: o'q belgilari 0 / 50 / 100 kabi toza sonlar bo'lsin. */
function getNiceStep(max: number) {
  const rough = Math.max(max, 1) / TARGET_TICK_COUNT
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const normalized = rough / magnitude
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return Math.max(1, nice * magnitude)
}

// month_name ingliz tilida keladi — nom "YYYY-MM" dan joriy dayjs tilida olinadi
function formatMonth(month: string, format: string) {
  const date = dayjs(`${month}-01`)
  return date.isValid() ? date.format(format) : month
}

type MonthlyChartProps = {
  stats: readonly MonthlyStat[]
}

/** Oxirgi 12 oy: bitta seriyali ustunli grafik, hover/fokus tooltip va jadval ko'rinishi. */
export function MonthlyChart({ stats }: MonthlyChartProps) {
  const { t } = useTranslation()
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const counts = stats.map((item) => Number(item.count) || 0)
  const total = counts.reduce((sum, value) => sum + value, 0)
  const maxCount = Math.max(0, ...counts)
  const step = getNiceStep(maxCount)
  // O'q eng katta qiymatdan keyingi birinchi toza songacha — grafik tepasi bo'sh qolmasin
  const tickCount = Math.max(1, Math.ceil(maxCount / step))
  const axisMax = step * tickCount
  const ticks = Array.from({ length: tickCount + 1 }, (_, index) => step * (tickCount - index))
  // Faqat eng katta qiymat to'g'ridan-to'g'ri yoziladi — qolganlari o'q, tooltip va jadvalda
  const peakIndex = maxCount > 0 ? counts.indexOf(maxCount) : -1

  const ViewIcon = view === 'chart' ? Table2 : ChartColumn

  return (
    <section className="bg-surface shadow-card border-line rounded-3xl border p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-heading text-[18px] font-bold tracking-tight">
            {t('dashboard.adminDashboard.monthly.title')}
          </h2>
          <p className="text-body mt-1 text-[14px]">
            {t('dashboard.adminDashboard.monthly.subtitle')}
          </p>
          <p className="text-heading mt-3 text-[14px] font-semibold">
            {t('dashboard.adminDashboard.monthly.total', { count: numberFormat.format(total) })}
          </p>
        </div>
        {stats.length > 0 && (
          <button
            type="button"
            onClick={() => setView((prev) => (prev === 'chart' ? 'table' : 'chart'))}
            className="border-line text-body hover:bg-surface-muted hover:text-heading inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-[13.5px] font-semibold transition-colors"
          >
            <ViewIcon className="size-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
            {view === 'chart'
              ? t('dashboard.adminDashboard.monthly.showTable')
              : t('dashboard.adminDashboard.monthly.showChart')}
          </button>
        )}
      </div>

      {stats.length === 0 ? (
        <p className="text-body mt-8 py-10 text-center text-[14px]">
          {t('dashboard.adminDashboard.monthly.empty')}
        </p>
      ) : view === 'table' ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-line text-neutral border-b text-[12px] tracking-wide uppercase">
                <th scope="col" className="py-3 pr-4 font-bold">
                  {t('dashboard.adminDashboard.monthly.month')}
                </th>
                <th scope="col" className="py-3 text-right font-bold">
                  {t('dashboard.adminDashboard.monthly.count')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {stats.map((item, index) => (
                <tr key={item.month}>
                  <td className="text-body py-3 pr-4 capitalize">
                    {formatMonth(item.month, 'MMMM YYYY')}
                  </td>
                  <td className="text-heading py-3 text-right font-semibold tabular-nums">
                    {numberFormat.format(counts[index])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 flex gap-3">
          {/* Y o'qi belgilari */}
          <div
            aria-hidden="true"
            className="text-neutral relative h-64 w-10 shrink-0 text-right text-[11.5px] tabular-nums"
          >
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute right-0 -translate-y-1/2"
                style={{ top: `${((axisMax - tick) / axisMax) * 100}%` }}
              >
                {numberFormat.format(tick)}
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div
              role="list"
              aria-label={t('dashboard.adminDashboard.monthly.chartLabel')}
              className="relative h-64"
              onPointerLeave={() => setActiveIndex(null)}
            >
              {/* Gridlines — ingichka, solid, fonga yaqin rang */}
              {ticks.map((tick) => (
                <div
                  key={tick}
                  aria-hidden="true"
                  className="border-line absolute inset-x-0 border-t"
                  style={{ top: `${((axisMax - tick) / axisMax) * 100}%` }}
                />
              ))}

              <div className="absolute inset-0 flex">
                {stats.map((item, index) => {
                  const value = counts[index]
                  const isActive = activeIndex === index
                  const monthLabel = formatMonth(item.month, 'MMMM YYYY')

                  return (
                    // Hover maydoni butun ustun kengligi — ingichka ustunning o'zidan kattaroq
                    <div
                      key={item.month}
                      role="listitem"
                      tabIndex={0}
                      aria-label={`${monthLabel}: ${numberFormat.format(value)}`}
                      onPointerEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onBlur={() => setActiveIndex(null)}
                      className="group relative flex h-full flex-1 items-end justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {isActive && (
                        <div
                          aria-hidden="true"
                          className="bg-primary/6 pointer-events-none absolute inset-0 rounded-lg"
                        />
                      )}

                      <div
                        className={cn(
                          'bg-primary relative w-[min(24px,60%)] rounded-t-[4px] transition-opacity',
                          activeIndex !== null && !isActive && 'opacity-60',
                        )}
                        style={{ height: `${(value / axisMax) * 100}%` }}
                      >
                        {index === peakIndex && !isActive && (
                          <span className="text-heading absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 text-[12px] font-bold whitespace-nowrap tabular-nums">
                            {numberFormat.format(value)}
                          </span>
                        )}
                      </div>

                      {isActive && (
                        <div
                          aria-hidden="true"
                          className={cn(
                            'bg-surface shadow-panel border-line pointer-events-none absolute top-2 z-10 rounded-xl border px-3 py-2 whitespace-nowrap',
                            // Chetdagi ustunlarda tooltip grafikdan chiqib ketmasin
                            index < 2 ? 'left-0' : index > stats.length - 3 ? 'right-0' : 'left-1/2 -translate-x-1/2',
                          )}
                        >
                          <p className="text-heading text-[15px] font-bold tabular-nums">
                            {numberFormat.format(value)}
                          </p>
                          <p className="text-body text-[12px] capitalize">{monthLabel}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* X o'qi: oy qisqa nomlari; tor ekranda har ikkinchisi */}
            <div aria-hidden="true" className="mt-2 flex">
              {stats.map((item, index) => (
                <span
                  key={item.month}
                  className={cn(
                    'text-neutral flex-1 text-center text-[11.5px] capitalize',
                    index % 2 === 1 && 'invisible sm:visible',
                  )}
                >
                  {formatMonth(item.month, 'MMM')}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
