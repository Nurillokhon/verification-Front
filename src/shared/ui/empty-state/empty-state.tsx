import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  text: string
  /** Masalan "Yangi ariza" havolasi. Berilmasa tugma qatori umuman chiqmaydi. */
  action?: ReactNode
  /**
   * 'card' — sahifa darajasida, o'z ramkasi bilan;
   * 'inline' — allaqachon kartochka ichida ko'rsatiladi, shuning uchun ramkasiz
   * va sokinroq ikonka bilan (ichma-ich ikkita kartochka chiqmasligi uchun).
   */
  variant?: 'card' | 'inline'
}

/** Ro'yxat bo'sh yoki qidiruv natija bermagan holat. */
export function EmptyState({ icon: Icon, title, text, action, variant = 'card' }: EmptyStateProps) {
  const isCard = variant === 'card'

  return (
    <div
      className={cn(
        'flex flex-col items-center px-6 py-14 text-center',
        isCard && 'bg-surface shadow-card border-line rounded-3xl border',
      )}
    >
      <span
        className={cn(
          'flex size-14 items-center justify-center rounded-2xl',
          isCard ? 'bg-primary-soft text-primary' : 'bg-surface-muted text-neutral',
        )}
      >
        <Icon className="size-7" strokeWidth={2} aria-hidden="true" />
      </span>
      <h2 className={cn('text-heading mt-5 font-bold', isCard ? 'text-[18px]' : 'text-[16px]')}>
        {title}
      </h2>
      <p className="text-body mt-2 max-w-sm text-[14px]">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
