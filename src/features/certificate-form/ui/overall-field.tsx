import { Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TypeFormResult } from '@/entities/dictionary'
import { SelectField, TextField } from '@/shared/ui'
import type { CertificateFormError } from '../model/certificate-form'
import { getOverallOptions, resolveCefr } from '../model/type-form'

type OverallFieldProps = {
  result: TypeFormResult
  value: string
  error?: CertificateFormError
  onChange: (value: string) => void
}

/** Chegara izohi: "0 dan 9 gacha". Faqat ikkala chegara ham berilganda. */
function useRangeHint(result: TypeFormResult) {
  const { t } = useTranslation()
  if (typeof result.min !== 'number' || typeof result.max !== 'number') return undefined
  return t('dashboard.certificateForm.fields.overallRange', { min: result.min, max: result.max })
}

/**
 * Umumiy natija maydoni (IELTS 7.0, HSK 4, B2). Ball turida matn maydoni,
 * daraja nomi yoki CEFR turida — ro'yxat.
 *
 * Nomzod qiymat kiritishi bilan pastda CEFR darajasi chiqadi — xato
 * kiritsa darhol sezadi. Haqiqiy CEFR ni backend hisoblaydi va saqlaydi.
 */
export function OverallField({ result, value, error, onChange }: OverallFieldProps) {
  const { t } = useTranslation()
  const rangeHint = useRangeHint(result)

  const label = result.label || t('dashboard.certificateForm.fields.overall')
  const options = getOverallOptions(result)
  const cefr = resolveCefr(result, value)

  // `level` turida tanlangan qiymatning o'zi CEFR - qayta yozish ortiqcha
  const showCefr = cefr && result.kind !== 'level'
  const hint = showCefr
    ? t('dashboard.certificateForm.fields.cefr', { cefr })
    : value.trim() && result.kind === 'score'
      ? t('dashboard.certificateForm.fields.cefrUnknown')
      : rangeHint
  const errorText = error && t(error.key, error.params)

  if (options.length > 0) {
    return (
      <SelectField
        label={label}
        icon={Trophy}
        error={errorText}
        hint={hint}
        placeholder={t('dashboard.certificateForm.fields.select')}
        options={options.map((option) => ({ value: option, label: option }))}
        value={value}
        onChange={onChange}
      />
    )
  }

  return (
    <TextField
      label={label}
      icon={Trophy}
      error={errorText}
      hint={hint}
      // type="number" emas: IELTS uchun "7,5" ham yozilsa bo'lsin
      inputMode="decimal"
      autoComplete="off"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
