import { LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'

type RouteFallbackProps = {
  /**
   * 'screen' — qobiqsiz sahifalar (bosh sahifa, kirish) uchun butun ekran;
   * 'content' — dashboard qobig'i ichidagi kontent maydoni, sidebar joyida qoladi.
   */
  variant?: 'screen' | 'content'
}

/**
 * React.lazy sahifasining chunk'i yuklanguncha ko'rsatiladigan oraliq holat.
 * role="status" + sr-only matn — skrinriderga "yuklanmoqda" deb eshittiradi,
 * chunki aylanayotgan ikonka aria-hidden.
 */
export function RouteFallback({ variant = 'content' }: RouteFallbackProps) {
  const { t } = useTranslation()

  return (
    <div
      role="status"
      aria-busy="true"
      className={cn(
        'flex items-center justify-center',
        variant === 'screen' ? 'min-h-svh' : 'min-h-[60vh]',
      )}
    >
      <LoaderCircle className="text-primary size-8 animate-spin" strokeWidth={2.4} aria-hidden="true" />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  )
}
