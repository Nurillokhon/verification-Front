import { RefreshCw, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouteError } from 'react-router'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
// Barrel (@/shared/ui) emas: u date-field/select-field orqali antd'ni ham
// tortadi, bu fayl esa eager — antd boshlang'ich bundle'ga qaytib tushardi.
import { Button, buttonVariants } from '@/shared/ui/button'

// Lazy chunk yuklanmaganda brauzerlar turlicha yozadi — Chrome/Safari
// "Failed to fetch dynamically imported module", Firefox esa
// "error loading dynamically imported module". Bu odatda yangi deploy'dan keyin
// eski sahifa ochiq qolganda yuz beradi: eski chunk fayllari serverda yo'q.
const CHUNK_LOAD_ERROR_PATTERN = /dynamically imported module|importing a module script failed/i

function isChunkLoadError(error: unknown) {
  return error instanceof Error && CHUNK_LOAD_ERROR_PATTERN.test(error.message)
}

type RouteErrorBoundaryProps = {
  /** RouteFallback'dagi kabi: 'content' — dashboard qobig'i ichidagi maydon. */
  variant?: 'screen' | 'content'
}

/**
 * Marshrut daraxtidagi har qanday render xatosi (shu jumladan lazy chunk
 * yuklanmasligi) shu yerga tushadi — busiz react-router o'zining sukut bo'yicha
 * oq sahifasini ko'rsatadi.
 */
export function RouteErrorBoundary({ variant = 'screen' }: RouteErrorBoundaryProps) {
  const error = useRouteError()
  const { t } = useTranslation()
  const isOutdated = isChunkLoadError(error)

  return (
    <div
      className={cn(
        'flex items-center justify-center p-6',
        variant === 'screen' ? 'min-h-svh' : 'min-h-[60vh]',
      )}
    >
      <div
        role="alert"
        className="bg-surface shadow-card border-line w-full max-w-md rounded-3xl border px-6 py-10 text-center sm:px-10"
      >
        <span className="bg-danger/10 text-danger mx-auto flex size-16 items-center justify-center rounded-2xl">
          <TriangleAlert className="size-8" strokeWidth={2} aria-hidden="true" />
        </span>
        <h1 className="text-heading mt-6 text-[22px] font-extrabold tracking-tight">
          {isOutdated ? t('common.routeError.outdated.title') : t('common.routeError.title')}
        </h1>
        <p className="text-body mt-2 text-[14px] leading-relaxed">
          {isOutdated ? t('common.routeError.outdated.text') : t('common.routeError.text')}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button size="lg" onClick={() => window.location.reload()}>
            <RefreshCw className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
            {t('common.routeError.retry')}
          </Button>
          {/* Oddiy <a>: xato holatida router holati ishonchsiz, to'liq qayta
              yuklash ilovani toza holatdan boshlaydi. */}
          <a
            href={ROUTES.home}
            className={buttonVariants({ variant: 'soft', size: 'lg', className: 'w-full' })}
          >
            {t('common.routeError.home')}
          </a>
        </div>
      </div>
    </div>
  )
}
