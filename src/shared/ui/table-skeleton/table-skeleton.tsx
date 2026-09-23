import { cn } from '@/shared/lib/cn'

type TableSkeletonProps = {
  rows?: number
  /** Har qatordagi to'ldirgich ustunlar soni (oxirgisi qisqa, "status" ustuni o'rnida). */
  columns?: number
  /** Qator boshida dumaloq avatar joyi (ekspertlar ro'yxati kabi). */
  withAvatar?: boolean
  /** EmptyState'dagi kabi: 'inline' — allaqachon kartochka ichida. */
  variant?: 'card' | 'inline'
}

/** Ro'yxat birinchi marta yuklanayotgandagi skelet — yakuniy jadval bilan bir xil to'r. */
export function TableSkeleton({
  rows = 5,
  columns = 3,
  withAvatar = false,
  variant = 'card',
}: TableSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse overflow-hidden',
        variant === 'card'
          ? 'bg-surface shadow-card border-line rounded-3xl border'
          : 'divide-line divide-y',
      )}
    >
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            'flex items-center gap-4 px-5 py-5',
            variant === 'card' && 'border-line border-b last:border-b-0',
          )}
        >
          {withAvatar && <div className="bg-surface-muted size-10 shrink-0 rounded-full" />}
          {Array.from({ length: Math.max(columns - 1, 1) }, (_, cellIndex) => (
            <div key={cellIndex} className="bg-surface-muted h-4 flex-1 rounded-full" />
          ))}
          <div className="bg-surface-muted h-4 w-20 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  )
}
