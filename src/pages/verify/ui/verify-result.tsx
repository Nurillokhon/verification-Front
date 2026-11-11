import { Clock, FileDown, ShieldCheck, ShieldX, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { formatApiDate } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { buttonVariants } from '@/shared/ui/button'
import type { VerifyResponse, VerifyStatus } from '../model/types'

// Holat rangi — kabinetdagi status belgilari bilan bir xil ohanglar
// (entities/certificate/ui/certificate-status-badge.tsx).
const STATUS_STYLE: Record<VerifyStatus, { icon: LucideIcon; box: string; iconBox: string }> = {
  valid: { icon: ShieldCheck, box: 'bg-primary-soft border-primary/25', iconBox: 'bg-primary text-on-primary' },
  expired: { icon: Clock, box: 'bg-gold/12 border-gold/40', iconBox: 'bg-gold text-tertiary' },
  invalid: { icon: ShieldX, box: 'bg-danger/8 border-danger/30', iconBox: 'bg-danger text-white' },
}

function StatusBanner({ data }: { data: VerifyResponse }) {
  const { t } = useTranslation()
  const style = STATUS_STYLE[data.status]
  const Icon = style.icon

  return (
    <section className={cn('flex gap-4 rounded-2xl border p-5 sm:gap-5 sm:p-6', style.box)}>
      <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', style.iconBox)}>
        <Icon className="size-6" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h1 className="text-heading text-[20px] leading-tight font-extrabold tracking-tight sm:text-[22px]">
          {t(`verify.status.${data.status}.title`)}
        </h1>
        <p className="text-body text-copy mt-1.5">
          {t(`verify.status.${data.status}.text`, {
            date: formatApiDate(data.certificate?.expiration_date) ?? '',
          })}
        </p>
      </div>
    </section>
  )
}

function Field({ label, children, mono }: { label: string; children: ReactNode; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-neutral text-overline uppercase">{label}</dt>
      <dd className={cn('text-heading text-subtitle mt-1 break-words', mono && 'font-mono tabular-nums')}>
        {children || '—'}
      </dd>
    </div>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-surface border-line rounded-2xl border p-5 sm:p-6">
      <h2 className="text-primary text-overline uppercase">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Results({ certificate }: { certificate: NonNullable<VerifyResponse['certificate']> }) {
  const { t } = useTranslation()
  const { overall, sections } = certificate
  const showCefr = sections.some((row) => row.cefr)

  if (!overall && sections.length === 0) return null

  return (
    <Card title={t('verify.results.title')}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {overall && (
          <div className="bg-primary text-on-primary flex shrink-0 flex-col items-center justify-center rounded-xl px-6 py-5 sm:min-w-40">
            <span className="text-overline uppercase opacity-80">{overall.label}</span>
            <span className="mt-1 text-[34px] leading-none font-extrabold tabular-nums">{overall.value}</span>
            {overall.cefr && (
              <span className="bg-on-primary/15 mt-3 rounded-full px-3 py-1 text-[12px] font-bold">
                CEFR · {overall.cefr}
              </span>
            )}
          </div>
        )}

        {sections.length > 0 && (
          <div className="min-w-0 flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-line border-b">
                  <th className="text-neutral text-overline pb-2 font-semibold uppercase">
                    {t('verify.results.section')}
                  </th>
                  <th className="text-neutral text-overline pb-2 text-right font-semibold uppercase">
                    {t('verify.results.score')}
                  </th>
                  {showCefr && (
                    <th className="text-neutral text-overline pb-2 pl-4 text-right font-semibold uppercase">
                      CEFR
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sections.map((row) => (
                  <tr key={row.name} className="border-line border-b last:border-b-0">
                    <td className="text-heading text-copy py-2.5 pr-4 font-medium">{row.name}</td>
                    <td className="text-heading text-copy py-2.5 text-right font-semibold tabular-nums">
                      {row.score}
                    </td>
                    {showCefr && (
                      <td className="text-body text-copy py-2.5 pl-4 text-right">{row.cefr ?? '—'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  )
}

export function VerifyResult({ data }: { data: VerifyResponse }) {
  const { t } = useTranslation()
  const { holder, certificate, reference } = data

  return (
    <div className="flex flex-col gap-4">
      <StatusBanner data={data} />

      <dl className="text-caption text-body flex flex-wrap gap-x-6 gap-y-1 px-1">
        <div className="flex gap-1.5">
          <dt>{t('verify.reference.number')}</dt>
          <dd className="text-heading font-mono font-semibold">{reference.number}</dd>
        </div>
        {reference.issued_on && (
          <div className="flex gap-1.5">
            <dt>{t('verify.reference.issuedOn')}</dt>
            <dd className="text-heading font-mono font-semibold">{formatApiDate(reference.issued_on)}</dd>
          </div>
        )}
        <div className="flex gap-1.5">
          <dt>{t('verify.reference.code')}</dt>
          <dd className="text-heading font-mono font-semibold">{reference.code}</dd>
        </div>
      </dl>

      {holder && (
        <Card title={t('verify.holder.title')}>
          <dl className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
            <Field label={t('verify.holder.fullName')}>{holder.full_name}</Field>
            <Field label={t('verify.holder.pnfl')} mono>{holder.pnfl}</Field>
            <Field label={t('verify.holder.passport')} mono>{holder.passport}</Field>
          </dl>
          <p className="text-neutral text-caption mt-4">{t('verify.holder.masked')}</p>
        </Card>
      )}

      {certificate && (
        <Card title={t('verify.certificate.title')}>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Field label={t('verify.certificate.type')}>
              {[certificate.type, certificate.language].filter(Boolean).join(' · ')}
            </Field>
            <Field label={t('verify.certificate.number')} mono>{certificate.number}</Field>
            <Field label={t('verify.certificate.issueDate')} mono>
              {formatApiDate(certificate.issue_date)}
            </Field>
            <Field label={t('verify.certificate.expirationDate')} mono>
              {formatApiDate(certificate.expiration_date)}
            </Field>
          </dl>
        </Card>
      )}

      {certificate && <Results certificate={certificate} />}

      {data.pdf_url && (
        <a
          href={data.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ className: 'self-start' })}
        >
          <FileDown className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
          {t('verify.pdf')}
        </a>
      )}
    </div>
  )
}
