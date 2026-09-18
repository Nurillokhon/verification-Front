import { Eye, EyeOff, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import {
  formatFieldValue,
  getRowTags,
  isHidden,
  isSystemRow,
  type DictionaryResourceConfig,
  type DictionaryRow,
} from '../model/resources'

const HEAD_CELL_CLASS_NAME = 'px-5 py-3.5 font-bold'
const CELL_CLASS_NAME = 'text-body px-5 py-4'
const ACTION_CLASS_NAME =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'

type DictionaryTableProps = {
  config: DictionaryResourceConfig
  rows: readonly DictionaryRow[]
  isPending: boolean
  onEdit: (row: DictionaryRow) => void
  onToggleActive: (row: DictionaryRow) => void
}

function TagList({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null

  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="bg-surface-muted text-body rounded-full px-2.5 py-0.5 text-[12px] font-semibold whitespace-nowrap"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export function DictionaryTable({
  config,
  rows,
  isPending,
  onEdit,
  onToggleActive,
}: DictionaryTableProps) {
  const { t } = useTranslation()
  const columns = config.fields.filter((field) => field.inTable)

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-160 text-left text-[14px]">
        <thead>
          <tr className="border-line text-neutral border-b text-[12px] tracking-wide uppercase">
            <th scope="col" className={HEAD_CELL_CLASS_NAME}>
              {t('dashboard.forms.fields.name')}
            </th>
            {columns.map((field) => (
              <th key={field.key} scope="col" className={HEAD_CELL_CLASS_NAME}>
                {t(field.labelKey)}
              </th>
            ))}
            {config.canHide && (
              <th scope="col" className={HEAD_CELL_CLASS_NAME}>
                {t('dashboard.forms.columns.state')}
              </th>
            )}
            <th scope="col" className={HEAD_CELL_CLASS_NAME}>
              <span className="sr-only">{t('dashboard.forms.columns.actions')}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-line divide-y">
          {rows.map((row) => {
            const hidden = isHidden(row)
            const name = String(row.name ?? '') || `#${row.id}`

            return (
              <tr key={row.id} className="hover:bg-surface-sky transition-colors">
                <td className="px-5 py-4">
                  <p className={cn('text-heading font-bold', hidden && 'text-neutral')}>{name}</p>
                  {'description' in row && row.description && (
                    <p className="text-neutral mt-1 text-[12.5px]">{row.description}</p>
                  )}
                  <TagList items={getRowTags(row)} />
                </td>

                {columns.map((field) => (
                  <td key={field.key} className={cn(CELL_CLASS_NAME, 'whitespace-nowrap')}>
                    {formatFieldValue(row, field) ?? <span className="text-neutral">—</span>}
                  </td>
                ))}

                {config.canHide && (
                  <td className={CELL_CLASS_NAME}>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap',
                        hidden ? 'bg-surface-muted text-neutral' : 'bg-primary-soft text-primary',
                      )}
                    >
                      {t(hidden ? 'dashboard.forms.state.hidden' : 'dashboard.forms.state.active')}
                    </span>
                  </td>
                )}

                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onEdit(row)}
                    className={cn(ACTION_CLASS_NAME, 'text-primary hover:bg-primary-soft')}
                  >
                    <Pencil className="size-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                    {t('dashboard.forms.actions.edit')}
                  </button>

                  {/* Tizim xabarini yashirib bo'lmaydi — tizim uni yuborishda qidiradi */}
                  {config.canHide && !isSystemRow(row) && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => onToggleActive(row)}
                      className={cn(
                        ACTION_CLASS_NAME,
                        'text-body hover:bg-surface-muted hover:text-heading ml-1',
                      )}
                    >
                      {hidden ? (
                        <Eye className="size-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                      ) : (
                        <EyeOff className="size-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                      )}
                      {t(hidden ? 'dashboard.forms.actions.restore' : 'dashboard.forms.actions.hide')}
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
