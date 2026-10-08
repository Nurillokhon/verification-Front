import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  formatOverallResult,
  parseExtraData,
  parseScoreCefr,
  type CertificateDetail,
} from '@/entities/certificate'
import { formatApiDate } from '@/shared/lib/format'
import { buttonVariants } from '@/shared/ui'

type ReviewDetailsCardProps = {
  certificate: CertificateDetail
  /** Tahrirlash mumkin bo'lsa (new/problem) — tahrirlash sahifasi manzili */
  editTo?: string
  /** Tahrirlash sahifasiga uzatiladigan router state (ro'yxatga qaytish manzili) */
  linkState?: unknown
}

export function ReviewDetailsCard({ certificate, editTo, linkState }: ReviewDetailsCardProps) {
  const { t } = useTranslation()

  // Ikki ustunli tartib: chapda raqam/tur/til, o'ngda sanalar va joy; bo'sh maydonlar ko'rsatilmaydi
  const rows = [
    { key: 'number', label: t('dashboard.review.details.number'), value: certificate.number },
    {
      key: 'issueDate',
      label: t('dashboard.certificates.detail.fields.issueDate'),
      value: formatApiDate(certificate.issue_date),
    },
    { key: 'type', label: t('dashboard.certificates.detail.fields.type'), value: certificate.type_name },
    {
      key: 'examDate',
      label: t('dashboard.certificates.detail.fields.examDate'),
      value: formatApiDate(certificate.exam_date),
    },
    {
      key: 'language',
      label: t('dashboard.certificates.detail.fields.language'),
      value: certificate.language_name,
    },
    {
      key: 'examPlace',
      label: t('dashboard.certificates.detail.fields.examPlace'),
      value: certificate.exam_place,
    },
    {
      key: 'degree',
      label: t('dashboard.certificates.detail.fields.degree'),
      value: certificate.degree_name,
    },
    {
      // IELTS "7.0 (C1)", HSK "HSK 4 (B2)" - eski arizalarda bo'sh, qator chiqmaydi
      key: 'overall',
      label: t('dashboard.certificates.detail.fields.overall'),
      value: formatOverallResult(certificate.overall_result, certificate.overall_cefr),
    },
    {
      key: 'expirationDate',
      label: t('dashboard.certificates.detail.fields.expirationDate'),
      value: formatApiDate(certificate.expiration_date),
    },
  ].filter((row) => row.value)

  const scores = Object.entries(parseExtraData(certificate.extra_data)).filter(([, value]) => value !== '')
  // Bo'lim uchun CEFR - tur formasida yoqilgan bo'lsa (IELTS: Listening 7.5 - C1)
  const scoreCefr = parseScoreCefr(certificate.extra_data)

  return (
    <section className="bg-surface shadow-card border-line rounded-2xl border p-5 sm:p-6">
      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <h2 className="text-heading text-[18px] font-bold tracking-tight">
          {t('dashboard.review.details.title')}
        </h2>
        {editTo && (
          <Link to={editTo} state={linkState} className={buttonVariants({ variant: 'soft', size: 'sm' })}>
            <Pencil className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
            {t('dashboard.review.details.edit')}
          </Link>
        )}
      </div>

      <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {rows.map(({ key, label, value }) => (
          <div key={key} className="min-w-0">
            <dt className="text-body text-[13px]">{label}</dt>
            <dd className="text-heading mt-0.5 text-[15px] break-words">{value}</dd>
          </div>
        ))}
      </dl>

      {scores.length > 0 && (
        <div className="mt-7">
          <h3 className="text-body text-[13.5px] font-semibold">{t('dashboard.review.details.scores')}</h3>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {scores.map(([name, value]) => (
              <li key={name} className="border-line rounded-xl border px-3 py-4 text-center">
                <p className="text-body truncate text-[13px]">{name}</p>
                <p className="text-secondary mt-1 text-[20px] font-bold tabular-nums">{value}</p>
                {scoreCefr[name] && (
                  <p className="text-body mt-0.5 text-[12px] font-semibold">CEFR {scoreCefr[name]}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {certificate.comment && (
        <div className="bg-surface-sky mt-6 rounded-xl px-4 py-3">
          <p className="text-body text-[12.5px] font-semibold">{t('dashboard.certificates.detail.comment')}</p>
          <p className="text-heading mt-1 text-[14px] leading-relaxed break-words">{certificate.comment}</p>
        </div>
      )}
    </section>
  )
}
