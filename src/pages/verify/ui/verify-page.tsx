import { FileSearch, RotateCw, ScanLine, Timer } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { getHttpStatus } from '@/shared/api'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { SiteFooter } from '@/widgets/site-footer'
import { SiteHeader } from '@/widgets/site-header'
import { useReferenceVerification } from '../api/verify-api'
import { VerifyCodeForm } from './verify-code-form'
import { VerifyResult } from './verify-result'

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="bg-surface-sky flex-1">
        {/* Tor ustun ichki o'ramda: cn() Container'ning max-w'sini almashtirmaydi */}
        <Container className="py-10 sm:py-14">
          <div className="mx-auto max-w-200">{children}</div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  )
}

/** Kod kiritish bloki — /v sahifasida ham, "topilmadi" holatida ham. */
function LookupPanel({ title, text, initialCode }: { title: string; text: string; initialCode?: string }) {
  return (
    <section className="bg-surface shadow-card border-line rounded-3xl border p-6 sm:p-9">
      <span className="bg-primary-soft text-primary flex size-12 items-center justify-center rounded-xl">
        <ScanLine className="size-6" strokeWidth={2} aria-hidden="true" />
      </span>
      <h1 className="text-heading text-page mt-5 text-balance">{title}</h1>
      <p className="text-body text-lead mt-2 max-w-[60ch]">{text}</p>
      <div className="mt-7">
        <VerifyCodeForm initialCode={initialCode} />
      </div>
    </section>
  )
}

function ResultSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-hidden="true">
      <div className="bg-surface-muted h-24 rounded-2xl" />
      <div className="bg-surface-muted h-32 rounded-2xl" />
      <div className="bg-surface-muted h-40 rounded-2xl" />
    </div>
  )
}

function KeyResult({ verifyKey }: { verifyKey: string }) {
  const { t } = useTranslation()
  const { data, error, isPending, refetch, isFetching } = useReferenceVerification(verifyKey)

  if (isPending) {
    return (
      <>
        <p className="sr-only" role="status">{t('verify.loading')}</p>
        <ResultSkeleton />
      </>
    )
  }

  if (error) {
    const status = getHttpStatus(error)
    if (status === 404) {
      return (
        <LookupPanel
          title={t('verify.notFound.title')}
          text={t('verify.notFound.text')}
          // QR'dagi uuid formaga qo'yilmaydi — faqat qo'lda terilgan kod
          initialCode={verifyKey.length <= 9 ? verifyKey : undefined}
        />
      )
    }
    const tooMany = status === 429
    const Icon = tooMany ? Timer : FileSearch
    return (
      <section className="bg-surface shadow-card border-line flex flex-col items-center rounded-3xl border px-6 py-12 text-center">
        <span className="bg-surface-muted text-neutral flex size-14 items-center justify-center rounded-2xl">
          <Icon className="size-7" strokeWidth={2} aria-hidden="true" />
        </span>
        <h1 className="text-heading mt-5 text-[18px] font-bold">
          {t(tooMany ? 'verify.tooMany.title' : 'verify.error.title')}
        </h1>
        <p className="text-body mt-2 max-w-sm text-[14px]">
          {t(tooMany ? 'verify.tooMany.text' : 'verify.error.text')}
        </p>
        <Button variant="soft" className="mt-6" onClick={() => refetch()} disabled={isFetching}>
          <RotateCw className="size-4" strokeWidth={2.2} aria-hidden="true" />
          {t('verify.retry')}
        </Button>
      </section>
    )
  }

  return (
    <>
      <VerifyResult data={data} />
      <p className="text-body text-caption mt-8 px-1">
        {t('verify.another')}{' '}
        <Link to={ROUTES.verify} className="text-primary font-semibold hover:underline">
          {t('verify.anotherLink')}
        </Link>
      </p>
    </>
  )
}

/**
 * Ma'lumotnomani tekshirish — ochiq sahifa, login yo'q.
 *   /v        — qog'ozdagi kodni qo'lda kiritish;
 *   /v/:key   — QR (uuid) yoki kod bo'yicha natija.
 * QR ichidagi manzil backend'ning /v/<uuid> yo'li — u shu sahifaga yo'naltiradi
 * (REFERENCE_VERIFY_PAGE_URL), shuning uchun yo'l nomi o'zgartirilmasin.
 */
export function VerifyPage() {
  const { t } = useTranslation()
  const { key = '' } = useParams()

  return (
    <Shell>
      {key ? (
        // key — yangi kod kiritilganda eski natija holati qolib ketmasin
        <KeyResult key={key} verifyKey={key} />
      ) : (
        <LookupPanel title={t('verify.lookup.title')} text={t('verify.lookup.text')} />
      )}
    </Shell>
  )
}
