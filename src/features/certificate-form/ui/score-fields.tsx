import { Gauge } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TypeFormScoreField } from '@/entities/dictionary'
import { TextField } from '@/shared/ui'
import type { CertificateFormErrors } from '../model/certificate-form'
import { getScoreErrorKey, getScoreKey, isNumericScore } from '../model/type-form'

type ScoreFieldsProps = {
  fields: readonly TypeFormScoreField[]
  /** getScoreKey() kaliti → ball */
  values: Record<string, string>
  errors: CertificateFormErrors
  onChange: (key: string, value: string) => void
}

/** Chegara izohi: "0 – 9". Faqat ikkala chegara ham berilganda ko'rsatiladi. */
function getRangeHint(field: TypeFormScoreField) {
  if (typeof field.min !== 'number' || typeof field.max !== 'number') return undefined
  return `${field.min} – ${field.max}`
}

/** Tur formasining `fields` bo'limi — har bir bo'lim uchun bitta ball maydoni. */
export function ScoreFields({ fields, values, errors, onChange }: ScoreFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {fields.map((field) => {
        const key = getScoreKey(field)
        const error = errors[getScoreErrorKey(key)]
        const numeric = isNumericScore(field)

        return (
          <TextField
            key={key}
            label={field.label}
            icon={Gauge}
            error={error && t(error.key, error.params)}
            hint={field.description ?? getRangeHint(field)}
            type={numeric ? 'number' : 'text'}
            inputMode={numeric ? 'decimal' : undefined}
            // integer turida brauzer o'zi butun songa cheklaydi, decimal'da esa kasr kiritishga yo'l qo'yadi
            step={numeric ? (field.score_type === 'integer' ? 1 : 'any') : undefined}
            min={field.min ?? undefined}
            max={field.max ?? undefined}
            value={values[key] ?? ''}
            onChange={(event) => onChange(key, event.target.value)}
          />
        )
      })}
    </div>
  )
}
