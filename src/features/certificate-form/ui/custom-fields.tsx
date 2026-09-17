import { useTranslation } from 'react-i18next'
import { toOptionsFromStrings, type TypeFormCustomField } from '@/entities/dictionary'
import { DateField, SelectField, TextField } from '@/shared/ui'
import type { CertificateFormErrors } from '../model/certificate-form'
import { getCustomErrorKey } from '../model/type-form'

type CustomFieldsProps = {
  fields: readonly TypeFormCustomField[]
  /** custom_fields[].key → qiymat */
  values: Record<string, string>
  errors: CertificateFormErrors
  onChange: (key: string, value: string) => void
}

const INPUT_TYPES = { text: 'text', number: 'number' } as const

/** Tur formasining `custom_fields` bo'limi — matn, son, sana yoki tanlash maydonlari. */
export function CustomFields({ fields, values, errors, onChange }: CustomFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {fields.map((field) => {
        const error = errors[getCustomErrorKey(field.key)]
        const message = error && t(error.key, error.params)
        const value = values[field.key] ?? ''

        if (field.kind === 'select') {
          return (
            <SelectField
              key={field.key}
              label={field.label}
              error={message}
              placeholder={t('dashboard.certificateForm.fields.select')}
              options={toOptionsFromStrings(field.options)}
              value={value}
              onChange={(next) => onChange(field.key, next)}
            />
          )
        }

        if (field.kind === 'date') {
          return (
            <DateField
              key={field.key}
              label={field.label}
              error={message}
              value={value}
              onChange={(next) => onChange(field.key, next)}
            />
          )
        }

        return (
          <TextField
            key={field.key}
            label={field.label}
            error={message}
            type={INPUT_TYPES[field.kind]}
            inputMode={field.kind === 'number' ? 'decimal' : undefined}
            min={field.kind === 'number' ? (field.min ?? undefined) : undefined}
            max={field.kind === 'number' ? (field.max ?? undefined) : undefined}
            maxLength={field.kind === 'text' ? field.max_length : undefined}
            value={value}
            onChange={(event) => onChange(field.key, event.target.value)}
          />
        )
      })}
    </div>
  )
}
