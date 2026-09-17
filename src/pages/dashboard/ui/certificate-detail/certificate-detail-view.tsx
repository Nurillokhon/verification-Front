import { ExternalLink, FileText, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CertificatePaymentBadge,
  CertificateStatusBadge,
  getCertificateFileUrl,
  getStatusTone,
  isCertificatePaid,
  type CertificateDetail,
} from '@/entities/certificate'
import { ExtraDataList } from '@/features/certificate-form'
import { cn } from '@/shared/lib/cn'
import { formatAmount, formatApiDate } from '@/shared/lib/format'
import { buttonVariants } from '@/shared/ui'
import { DashboardPageHeader } from '../dashboard-page-header'
import { CertificateCandidateCard } from './certificate-candidate-card'
import { CertificateHistory } from './certificate-history'

type DetailRow = {
  key: string
  label: string
  value: string | null | undefined
}

type CertificateDetailViewProps = {
  certificate: CertificateDetail
  /** Nomzod sahifasida — sertifikatlar ro'yxati, admin sahifasida — ekspert sahifasi */
  back: { to: string; label: string }
  /** Sarlavha yonidagi tugmalar (nomzod uchun tahrirlash/to'lash) */
  actions?: ReactNode
  /** Admin uchun — nomzod ma'lumotlari kartochkasi ko'rsatiladi */
  showCandidate?: boolean
}

export function CertificateDetailView({
  certificate,
  back,
  actions,
  showCandidate = false,
}: CertificateDetailViewProps) {
  const { t } = useTranslation()
  const isPaid = isCertificatePaid(certificate)
  const fileUrl = getCertificateFileUrl(certificate.file)
  const amount = formatAmount(certificate.amount)
  const isProblem = getStatusTone(certificate.status) === 'danger'
  const CommentIcon = isProblem ? TriangleAlert : Info

  // Backend qaytarmagan maydonlar qatori umuman ko'rsatilmaydi
  const rows = (
    [
      { key: 'type', label: t('dashboard.certificates.detail.fields.type'), value: certificate.type_name },
      {
        key: 'language',
        label: t('dashboard.certificates.detail.fields.language'),
        value: certificate.language_name,
      },
      {
        key: 'degree',
        label: t('dashboard.certificates.detail.fields.degree'),
        value: certificate.degree_name,
      },
      {
        key: 'issueDate',
        label: t('dashboard.certificates.detail.fields.issueDate'),
        value: formatApiDate(certificate.issue_date),
      },
      {
        key: 'expirationDate',
        label: t('dashboard.certificates.detail.fields.expirationDate'),
        value: formatApiDate(certificate.expiration_date),
      },
      {
        key: 'examDate',
        label: t('dashboard.certificates.detail.fields.examDate'),
        value: formatApiDate(certificate.exam_date),
      },
      {
        key: 'examPlace',
        label: t('dashboard.certificates.detail.fields.examPlace'),
        value: certificate.exam_place,
      },
      {
        key: 'createdAt',
        label: t('dashboard.certificates.detail.fields.createdAt'),
        value: certificate.created_at_str,
      },
      { key: 'expert', label: t('dashboard.certificates.detail.fields.expert'), value: certificate.expert },
      {
        key: 'invoice',
        label: t('dashboard.certificates.detail.fields.invoice'),
        value: certificate.invoice && `№ ${certificate.invoice}`,
      },
      {
        key: 'amount',
        label: t('dashboard.certificates.detail.fields.amount'),
        value: amount && `${amount} ${t('dashboard.certificateForm.currency')}`,
      },
    ] satisfies DetailRow[]
  ).filter((row) => row.value)

  return (
    <div className="mx-auto max-w-7xl">
      <DashboardPageHeader
        title={t('dashboard.certificates.detail.title', { number: certificate.number })}
        back={back}
        actions={actions}
      />

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] xl:gap-8">
        <div className="min-w-0 space-y-6">
          {certificate.comment && (
            <div
              role="note"
              className={cn(
                'flex gap-3 rounded-2xl p-4 ring-1 sm:p-5',
                isProblem
                  ? 'bg-danger/10 text-danger ring-danger/20'
                  : 'bg-primary-soft/60 text-primary ring-primary/20',
              )}
            >
              <CommentIcon className="mt-0.5 size-5 shrink-0" strokeWidth={2} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold">{t('dashboard.certificates.detail.comment')}</p>
                <p className="mt-1 text-[14px] leading-relaxed break-words">{certificate.comment}</p>
              </div>
            </div>
          )}

          <section className="bg-surface shadow-card border-line rounded-3xl border p-5 sm:p-8">
            <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b pb-5">
              <h2 className="text-heading text-[18px] font-bold tracking-tight sm:text-[20px]">
                {t('dashboard.certificates.detail.infoTitle')}
              </h2>
              <div className="flex flex-wrap gap-2">
                <CertificateStatusBadge status={certificate.status} />
                <CertificatePaymentBadge isPaid={isPaid} />
              </div>
            </div>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {rows.map(({ key, label, value }) => (
                <div key={key} className="border-line rounded-xl border px-4 py-3">
                  <dt className="text-body text-[12.5px]">{label}</dt>
                  <dd className="text-heading mt-1 text-[14px] font-semibold break-words">{value}</dd>
                </div>
              ))}
            </dl>

            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: 'soft', className: 'mt-6' })}
              >
                <FileText className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
                {t('dashboard.certificates.detail.openFile')}
                <ExternalLink className="size-3.5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
              </a>
            )}
          </section>

          <ExtraDataList
            title={t('dashboard.certificates.detail.extraTitle')}
            extraData={certificate.extra_data}
            data={certificate.data}
          />
        </div>

        <div className="min-w-0 space-y-6">
          {showCandidate && <CertificateCandidateCard certificate={certificate} />}
          <CertificateHistory certificateId={certificate.id} />
        </div>
      </div>
    </div>
  )
}
