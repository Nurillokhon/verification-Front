import { Search } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

type SearchInputProps = {
  /** Ko'rinmas yorliq (aria-label) — qidiruv maydoni oldida matnli label yo'q. */
  label: string
  placeholder: string
  /** Berilmasa input boshqarilmaydi (topbar'dagi hozircha funksiyasiz qidiruv). */
  value?: string
  onChange?: (value: string) => void
  /** 'field' — sahifadagi to'liq maydon; 'subtle' — topbar'dagi ixcham variant. */
  variant?: 'field' | 'subtle'
  /** Kenglik uchun: masalan 'sm:w-full sm:max-w-md'. */
  className?: string
}

export function SearchInput({
  label,
  placeholder,
  value,
  onChange,
  variant = 'field',
  className,
}: SearchInputProps) {
  const isField = variant === 'field'

  return (
    <div
      // data-field-control — forma maydonlari bilan bir xil fokus uslubi uchun
      data-field-control={isField ? '' : undefined}
      className={cn(
        'flex items-center',
        isField
          ? 'bg-surface border-line focus-within:ring-primary h-12 gap-3 rounded-xl border px-4 focus-within:ring-2'
          : 'bg-surface-muted h-10 gap-2 rounded-lg px-3',
        className,
      )}
    >
      <Search
        className={cn('text-neutral shrink-0', isField ? 'size-4.5' : 'size-4')}
        strokeWidth={2}
        aria-hidden="true"
      />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange && ((event) => onChange(event.target.value))}
        className={cn(
          'text-heading placeholder:text-neutral/70 h-full min-w-0 flex-1 bg-transparent outline-none',
          isField ? 'text-[15px]' : 'text-[13.5px]',
        )}
      />
    </div>
  )
}
