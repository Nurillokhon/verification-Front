import { Eye, EyeOff, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { TableHeadRow, TableRow, Td, Th } from '@/shared/ui'
import {
  formatFieldValue,
  getRowTags,
  isHidden,
  isSystemRow,
  type DictionaryResourceConfig,
  type DictionaryRow,
} from '../model/resources'

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
          <TableHeadRow>
            <Th>{t('dashboard.forms.fields.name')}</Th>
            {columns.map((field) => (
              <Th key={field.key}>{t(field.labelKey)}</Th>
            ))}
            {config.canHide && (
              <Th>{t('dashboard.forms.columns.state')}</Th>
            )}
            <Th>
              <span className="sr-only">{t('dashboard.forms.columns.actions')}</span>
            </Th>
          </TableHeadRow>
        </thead>
        <tbody className="divide-line divide-y">
          {rows.map((row) => {
            const hidden = isHidden(row)
            const name = String(row.name ?? '') || `#${row.id}`

            return (
              <TableRow key={row.id}>
                <Td>
                  <p className={cn('text-heading font-bold', hidden && 'text-neutral')}>{name}</p>
                  {'description' in row && row.description && (
                    <p className="text-neutral mt-1 text-[12.5px]">{row.description}</p>
                  )}
                  <TagList items={getRowTags(row)} />
                </Td>

                {columns.map((field) => (
                  <Td key={field.key} className="whitespace-nowrap">
                    {formatFieldValue(row, field) ?? <span className="text-neutral">—</span>}
                  </Td>
                ))}

                {config.canHide && (
                  <Td>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap',
                        hidden ? 'bg-surface-muted text-neutral' : 'bg-primary-soft text-primary',
                      )}
                    >
                      {t(hidden ? 'dashboard.forms.state.hidden' : 'dashboard.forms.state.active')}
                    </span>
                  </Td>
                )}

                <Td className="text-right whitespace-nowrap">
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
                </Td>
              </TableRow>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
