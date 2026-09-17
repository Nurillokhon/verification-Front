import { message } from 'antd'
import dayjs from 'dayjs'
import {
  CalendarDays,
  FileCheck2,
  IdCard,
  Pencil,
  Phone,
  ScanLine,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Expert } from '@/entities/expert'
import { EditExpertForm } from '@/features/edit-expert'
import { cn } from '@/shared/lib/cn'
import { formatUzPhone } from '@/shared/lib/phone'
import { Button } from '@/shared/ui'
import { TagList } from '../experts/experts-table'

type DetailRow = {
  key: string
  icon: LucideIcon
  label: string
  value: string | undefined
}

function ExpertDetails({ expert }: { expert: Expert }) {
  const { t } = useTranslation()

  // Backend qaytarmagan maydonlar qatori ko'rsatilmaydi
  const rows = (
    [
      {
        key: 'phone',
        icon: Phone,
        label: t('dashboard.experts.detail.phone'),
        value: expert.phone && formatUzPhone(expert.phone),
      },
      {
        key: 'passport',
        icon: ScanLine,
        label: t('dashboard.experts.detail.passport'),
        value: expert.passport,
      },
      {
        key: 'pnfl',
        icon: IdCard,
        label: t('dashboard.experts.detail.pnfl'),
        value: expert.pnfl ? String(expert.pnfl) : undefined,
      },
      {
        key: 'createdAt',
        icon: CalendarDays,
        label: t('dashboard.experts.detail.createdAt'),
        value: expert.created_at ? dayjs(expert.created_at).format('DD.MM.YYYY HH:mm') : undefined,
      },
      {
        key: 'total',
        icon: FileCheck2,
        label: t('dashboard.experts.detail.total'),
        value: String(expert.all_certificates),
      },
    ] satisfies DetailRow[]
  ).filter((row) => row.value)

  return (
    <>
      <dl className="space-y-2.5">
        {rows.map(({ key, icon: Icon, label, value }) => (
          <div key={key} className="border-line flex items-center gap-3 rounded-xl border px-4 py-3">
            <dt className="text-body flex min-w-0 items-center gap-2.5 text-[13.5px]">
              <Icon className="text-primary size-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
              {label}
            </dt>
            <dd className="text-heading ml-auto text-right text-[13.5px] font-bold tracking-wide tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-neutral mb-2 text-[12px] font-bold tracking-wide uppercase">
            {t('dashboard.experts.detail.languages')}
          </p>
          <TagList items={expert.language.map((item) => item.name)} />
        </div>
        <div>
          <p className="text-neutral mb-2 text-[12px] font-bold tracking-wide uppercase">
            {t('dashboard.experts.detail.types')}
          </p>
          <TagList items={expert.type.map((item) => item.name)} />
        </div>
      </div>
    </>
  )
}

/** Chap ustun: ekspert rekvizitlari va shu joyning o'zida tahrirlash formasi. */
export function ExpertProfileCard({ expert }: { expert: Expert }) {
  const { t } = useTranslation()
  const [messageApi, messageHolder] = message.useMessage()
  const [isEditing, setIsEditing] = useState(false)

  const handleSaved = () => {
    messageApi.success(t('dashboard.experts.edit.success'))
    setIsEditing(false)
  }

  return (
    <section className="bg-surface shadow-card border-line rounded-3xl border p-5 sm:p-6">
      {messageHolder}

      <div className="flex items-start gap-4">
        <span className="bg-primary-soft text-primary flex size-14 shrink-0 items-center justify-center rounded-2xl">
          <UserRound className="size-7" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-heading text-[16px] leading-snug font-extrabold wrap-break-word uppercase">
            {expert.full_name?.trim() || formatUzPhone(expert.phone)}
          </h2>
          <span
            className={cn(
              'mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
              expert.is_active ? 'bg-primary-soft text-primary' : 'bg-danger/10 text-danger',
            )}
          >
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            {expert.is_active
              ? t('dashboard.experts.detail.active')
              : t('dashboard.experts.detail.inactive')}
          </span>
        </div>
      </div>

      <div className="border-line mt-5 border-t pt-5">
        {isEditing ? (
          <>
            <h3 className="text-heading mb-4 text-[15px] font-bold">
              {t('dashboard.experts.edit.title')}
            </h3>
            <EditExpertForm
              expert={expert}
              onCancel={() => setIsEditing(false)}
              onSaved={handleSaved}
            />
          </>
        ) : (
          <>
            <ExpertDetails expert={expert} />
            <Button
              type="button"
              variant="soft"
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full"
            >
              <Pencil className="size-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
              {t('dashboard.experts.detail.edit')}
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
