import { CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { PayButton } from '@/features/certificate-payment'
import { ROUTES } from '@/shared/config'
import { buttonVariants } from '@/shared/ui'
import type { CertificateCreateResponse } from '../api'

/**
 * Ariza yaratilgandan keyingi holat. Yaratish endpointi to'lov yaratmaydi —
 * ariza saqlanganini tasdiqlaymiz va to'lov havolasini alohida chaqiruv bilan
 * olamiz, shuning uchun bu yerda summa hali ma'lum emas.
 */
export function ApplicationCreated({ result }: { result: CertificateCreateResponse }) {
  const { t } = useTranslation()
  const certificate = result.certificate

  return (
    <section className="bg-surface shadow-card border-line mx-auto max-w-xl rounded-3xl border px-6 py-10 text-center sm:px-10">
      <span className="bg-primary-soft text-primary mx-auto flex size-16 items-center justify-center rounded-2xl">
        <CircleCheck className="size-8" strokeWidth={2} aria-hidden="true" />
      </span>
      <h2 className="text-heading mt-6 text-[22px] font-extrabold tracking-tight">
        {t('dashboard.certificateForm.created.title')}
      </h2>
      {result.message && <p className="text-body mt-2 text-[14px]">{result.message}</p>}

      {certificate?.number && (
        <dl className="border-line mt-8 rounded-2xl border text-left">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-body text-[14px]">
              {t('dashboard.certificateForm.created.number')}
            </dt>
            <dd className="text-heading text-[14px] font-bold">{certificate.number}</dd>
          </div>
        </dl>
      )}

      <p className="text-body mt-6 text-[13.5px] leading-relaxed">
        {t('dashboard.certificateForm.created.text')}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {certificate?.id !== undefined && <PayButton certificateId={certificate.id} size="lg" />}
        <Link
          to={ROUTES.certificates}
          className={buttonVariants({ variant: 'soft', size: 'lg', className: 'w-full' })}
        >
          {t('dashboard.certificateForm.created.toList')}
        </Link>
      </div>
    </section>
  )
}
