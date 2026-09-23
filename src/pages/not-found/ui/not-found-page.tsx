import { Compass } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ROUTES } from '@/shared/config'
// Barrel antd'ni tortadi (route-error-boundary'dagi izohga qarang).
import { buttonVariants } from '@/shared/ui/button'

/** Hech bir marshrutga tushmagan manzil uchun 404 sahifasi. */
export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <section className="bg-surface shadow-card border-line w-full max-w-md rounded-3xl border px-6 py-10 text-center sm:px-10">
        <span className="bg-primary-soft text-primary mx-auto flex size-16 items-center justify-center rounded-2xl">
          <Compass className="size-8" strokeWidth={2} aria-hidden="true" />
        </span>
        <p className="text-primary mt-6 text-[13px] font-bold tracking-[0.2em]">404</p>
        <h1 className="text-heading mt-2 text-[22px] font-extrabold tracking-tight">
          {t('common.notFound.title')}
        </h1>
        <p className="text-body mt-2 text-[14px] leading-relaxed">{t('common.notFound.text')}</p>
        <Link
          to={ROUTES.home}
          className={buttonVariants({ size: 'lg', className: 'mt-8 w-full' })}
        >
          {t('common.notFound.home')}
        </Link>
      </section>
    </div>
  )
}
