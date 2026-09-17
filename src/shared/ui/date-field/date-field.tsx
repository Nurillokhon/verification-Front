import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { LucideIcon } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/shared/lib/cn'

/** API formati — qiymat doim shu ko'rinishdagi satr sifatida saqlanadi. */
const VALUE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_FORMAT = 'DD.MM.YYYY'

type DateFieldProps = {
  label: string
  /** "YYYY-MM-DD" yoki bo'sh satr. */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: LucideIcon
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}

/** TextField bilan bir xil ko'rinishdagi sana maydoni — ant design DatePicker ustida. */
export function DateField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  hint,
  error,
  disabled,
  className,
}: DateFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint
  const parsed = value ? dayjs(value, VALUE_FORMAT) : null

  return (
    <div className={className}>
      <label htmlFor={id} className="text-heading block px-1 text-[13.5px] font-semibold">
        {label}
      </label>

      <div
        data-field-control
        className={cn(
          'bg-surface-muted focus-within:ring-primary mt-2.5 flex h-15 items-center gap-3 rounded-xl px-4 ring-1 transition-shadow focus-within:ring-2',
          error ? 'ring-danger' : 'ring-transparent',
          disabled && 'opacity-60',
        )}
      >
        {Icon && (
          <Icon className="text-heading size-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
        )}
        <DatePicker
          id={id}
          variant="borderless"
          className="h-full min-w-0 flex-1 [&_input]:text-[16px]!"
          suffixIcon={null}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          format={DISPLAY_FORMAT}
          placeholder={placeholder ?? DISPLAY_FORMAT.toLowerCase()}
          value={parsed?.isValid() ? parsed : null}
          disabled={disabled}
          onChange={(date) => onChange(date ? date.format(VALUE_FORMAT) : '')}
        />
      </div>

      {message && (
        <p
          id={messageId}
          className={cn(
            'mt-2 px-1',
            error ? 'text-danger text-[12px] font-medium' : 'text-neutral text-[11.5px]',
          )}
        >
          {message}
        </p>
      )}
    </div>
  )
}
