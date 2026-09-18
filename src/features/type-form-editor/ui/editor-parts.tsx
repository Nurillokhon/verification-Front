import { Switch } from 'antd'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'

const ICON_BUTTON_CLASS_NAME =
  'text-body hover:text-heading hover:bg-surface-muted flex size-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40'

type EditorSectionProps = {
  title: string
  description: string
  children: ReactNode
  /** Berilsa sarlavha yonida "Qo'shish" tugmasi chiqadi */
  onAdd?: () => void
  addLabel?: string
}

/** Muharrirning sarlavhali bo'limi — FormSection bilan bir xil kartochka. */
export function EditorSection({ title, description, children, onAdd, addLabel }: EditorSectionProps) {
  return (
    <section className="bg-surface shadow-card border-line rounded-3xl border p-5 sm:p-6">
      <div className="border-line flex flex-wrap items-start justify-between gap-3 border-b pb-5">
        <div className="min-w-0">
          <h3 className="text-heading text-[17px] font-bold tracking-tight">{title}</h3>
          <p className="text-body mt-1 text-[13px]">{description}</p>
        </div>
        {onAdd && (
          <Button type="button" variant="soft" size="sm" onClick={onAdd}>
            <Plus className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
            {addLabel}
          </Button>
        )}
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

type ItemCardProps = {
  /** Yangi qo'shilgan kartochkaga aylantirish va fokus berish uchun */
  id?: string
  index: number
  total: number
  title: string
  children: ReactNode
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}

/** Ro'yxatdagi bitta maydon: tartib raqami, yuqoriga/pastga surish va o'chirish. */
export function ItemCard({ id, index, total, title, children, onMove, onRemove }: ItemCardProps) {
  const { t } = useTranslation()

  return (
    <div id={id} className="border-line scroll-mt-6 rounded-2xl border p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="bg-primary-soft text-primary flex size-7 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold">
          {index + 1}
        </span>
        <p className="text-heading min-w-0 flex-1 truncate text-[14.5px] font-bold">{title}</p>
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            aria-label={t('dashboard.forms.editor.actions.moveUp')}
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className={ICON_BUTTON_CLASS_NAME}
          >
            <ArrowUp className="size-4" strokeWidth={2.2} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={t('dashboard.forms.editor.actions.moveDown')}
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className={ICON_BUTTON_CLASS_NAME}
          >
            <ArrowDown className="size-4" strokeWidth={2.2} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={t('dashboard.forms.editor.actions.remove')}
            onClick={onRemove}
            className={cn(ICON_BUTTON_CLASS_NAME, 'hover:text-danger')}
          >
            <Trash2 className="size-4" strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

type ToggleProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

/** Yorliqli kalit (Switch) — "Majburiy", "Ko'rsatilsin" kabi belgilar uchun. */
export function Toggle({ label, checked, onChange, disabled, className }: ToggleProps) {
  const labelId = useId()

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Switch
        size="small"
        aria-labelledby={labelId}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="shrink-0"
      />
      <span id={labelId} className={cn('text-heading text-[13.5px] font-semibold', disabled && 'opacity-50')}>
        {label}
      </span>
    </div>
  )
}

/** Ro'yxat bo'sh bo'lganda bo'lim ichidagi izoh. */
export function EmptyList({ children }: { children: ReactNode }) {
  return (
    <p className="bg-surface-muted text-body rounded-2xl px-4 py-5 text-center text-[13.5px]">
      {children}
    </p>
  )
}
