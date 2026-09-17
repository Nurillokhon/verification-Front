import { useTranslation } from 'react-i18next'
import { parseExtraData, type CertificateDataItem } from '@/entities/certificate'

type ExtraDataListProps = {
  title: string
  /** JSON satr yoki ballar massivi — parseExtraData() ikkalasini ham o'qiydi */
  extraData: unknown
  /** Tur formasidagi erkin maydonlar qiymatlari (swagger: DataItemRead[]) */
  data?: CertificateDataItem[] | null
}

type Entry = {
  key: string
  label: string
  value: string
}

function toScoreEntries(extraData: unknown): Entry[] {
  // parseExtraData() bo'lim NOMI bo'yicha kalitlaydi — yorliq sifatida shuning o'zi ishlatiladi
  return Object.entries(parseExtraData(extraData))
    .filter(([, value]) => value !== '')
    .map(([name, value]) => ({ key: name, label: name, value }))
}

function toCustomEntries(data: CertificateDataItem[] | null | undefined): Entry[] {
  return (data ?? []).flatMap((item) => {
    const value = item.value == null ? '' : String(item.value)
    // Yorliq ariza yuborilgan paytdagi nomi — tur formasi keyin o'zgarsa ham mos qoladi
    return value ? [{ key: item.key, label: item.label, value }] : []
  })
}

function EntryGrid({ entries }: { entries: readonly Entry[] }) {
  return (
    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
      {entries.map((entry) => (
        <div key={entry.key} className="border-line rounded-xl border px-4 py-3">
          <dt className="text-body text-[12.5px]">{entry.label}</dt>
          <dd className="text-heading mt-1 text-[14px] font-semibold break-words">{entry.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Sertifikatning bo'lim ballari va erkin maydonlari. Ikkalasi ham javobning
 * o'zida yorlig'i bilan keladi, shuning uchun tur formasini so'rash shart emas.
 */
export function ExtraDataList({ title, extraData, data }: ExtraDataListProps) {
  const { t } = useTranslation()
  const scores = toScoreEntries(extraData)
  const custom = toCustomEntries(data)
  if (scores.length === 0 && custom.length === 0) return null

  return (
    <section className="bg-surface shadow-card border-line rounded-3xl border p-5 sm:p-8">
      <h2 className="text-heading border-line border-b pb-5 text-[18px] font-bold tracking-tight sm:text-[20px]">
        {title}
      </h2>

      {scores.length > 0 && <EntryGrid entries={scores} />}

      {custom.length > 0 && (
        <>
          <h3 className="text-heading mt-8 text-[15px] font-bold tracking-tight">
            {t('dashboard.certificateForm.sections.extra')}
          </h3>
          <EntryGrid entries={custom} />
        </>
      )}
    </section>
  )
}
