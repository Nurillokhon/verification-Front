import { Select } from 'antd'
import type { LucideIcon } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/shared/lib/cn'
import type { SelectOption } from '../select-field'

type MultiSelectFieldProps = {
  label: string
  options: readonly SelectOption[]
  value: readonly string[]
  onChange: (value: string[]) => void
  placeholder?: string
  icon?: LucideIcon
  hint?: string
  error?: string
  disabled?: boolean
  loading?: boolean
  className?: string
}

/** SelectField bilan bir xil ko'rinishdagi, bir nechta qiymat tanlanadigan maydon. */
export function MultiSelectField({
  label,
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
  hint,
  error,
  disabled,
  loading,
  className,
}: MultiSelectFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className={className}>
      <label htmlFor={id} className="text-heading block px-1 text-[13.5px] font-semibold">
        {label}
      </label>

      {/* Balandlik qat'iy emas (min-h) — tanlangan teglar bir necha qatorga o'tishi mumkin */}
      <div
        data-field-control
        className={cn(
          'bg-surface-muted focus-within:ring-primary mt-2.5 flex min-h-[60px] items-center gap-3 rounded-xl px-4 py-2 ring-1 transition-shadow focus-within:ring-2',
          error ? 'ring-danger' : 'ring-transparent',
          disabled && 'opacity-60',
        )}
      >
        {Icon && (
          <Icon className="text-heading size-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
        )}
        <Select
          id={id}
          mode="multiple"
          variant="borderless"
          allowClear
          showSearch={{ optionFilterProp: 'label' }}
          className="min-w-0 flex-1 [&_.ant-select-content]:text-[16px]"
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          placeholder={placeholder}
          options={options.map((option) => ({ value: option.value, label: option.label }))}
          value={[...value]}
          disabled={disabled}
          loading={loading}
          onChange={(next) => onChange(next ?? [])}
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
