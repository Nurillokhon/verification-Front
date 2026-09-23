import { CloudAlert, RefreshCw } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui'

type LoadErrorStateProps = {
  title: string
  text: string
  /** Berilmasa (masalan, "topilmadi" holatida) qayta urinish tugmasi chiqmaydi */
  retry?: { label: string; onRetry: () => void }
  className?: string
}

export function LoadErrorState({ title, text, retry, className }: LoadErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'bg-surface shadow-card border-line flex flex-col items-center rounded-3xl border px-6 py-14 text-center',
        className,
      )}
    >
      <span className="bg-danger/10 text-danger flex size-14 items-center justify-center rounded-2xl">
        <CloudAlert className="size-7" strokeWidth={2} aria-hidden="true" />
      </span>
      <h2 className="text-heading mt-5 text-[18px] font-bold">{title}</h2>
      <p className="text-body mt-2 max-w-sm text-[14px]">{text}</p>
      {retry && (
        <Button variant="soft" onClick={retry.onRetry} className="mt-6">
          <RefreshCw className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
          {retry.label}
        </Button>
      )}
    </div>
  )
}
