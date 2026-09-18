import type { LucideIcon } from 'lucide-react'
import { useId, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/shared/lib/cn'

type TextAreaFieldProps = Omit<ComponentPropsWithoutRef<'textarea'>, 'id'> & {
  label: string
  icon?: LucideIcon
  hint?: string
  error?: string
}

const DEFAULT_ROWS = 3

/** TextField bilan bir xil ko'rinishdagi ko'p qatorli matn maydoni. */
export function TextAreaField({
  label,
  icon: Icon,
  hint,
  error,
  className,
  rows = DEFAULT_ROWS,
  ...textareaProps
}: TextAreaFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className={className}>
      <label htmlFor={id} className="text-heading block px-1 text-[13.5px] font-semibold">
        {label}
      </label>

      {/* Ikonka matnning birinchi qatoriga tenglashadi — items-center bo'lsa
          maydon o'sgan sari o'rtaga siljib ketardi. */}
      <div
        data-field-control
        className={cn(
          'bg-surface-muted focus-within:ring-primary mt-2.5 flex gap-3 rounded-xl px-4 py-4 ring-1 transition-shadow focus-within:ring-2',
          error ? 'ring-danger' : 'ring-transparent',
        )}
      >
        {Icon && (
          <Icon className="text-heading mt-1 size-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
        )}
        <textarea
          id={id}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="text-heading placeholder:text-neutral/60 min-w-0 flex-1 resize-y bg-transparent text-[16px] outline-none"
          {...textareaProps}
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
