import type { TranslationKey } from '@/shared/config/i18n'
import {
  getFieldValue,
  type DictionaryField,
  type DictionaryResourceConfig,
  type DictionaryRow,
  isSystemRow,
} from './resources'

/** Barcha maydonlar formada satr sifatida saqlanadi — yuborishdan oldin turiga keltiriladi. */
export type DictionaryFormValues = Record<string, string>

/** Maydon kaliti → tarjima kaliti */
export type DictionaryFormErrors = Record<string, TranslationKey | undefined>

const ERROR = 'dashboard.forms.errors' as const

/** Tahrirlashda joriy qiymatlar, yaratishda bo'sh forma. */
export function toFormValues(
  config: DictionaryResourceConfig,
  row?: DictionaryRow,
): DictionaryFormValues {
  const values: DictionaryFormValues = {}

  for (const field of config.fields) {
    const value = row ? getFieldValue(row, field.key) : undefined
    values[field.key] = value === null || value === undefined ? '' : String(value)
  }

  return values
}

/** Maydon shu yozuvda o'zgartiriladimi: server belgilaydigan va tizim maydonlari bloklanadi. */
export function isFieldLocked(field: DictionaryField, row?: DictionaryRow) {
  if (field.readOnly) return true
  return Boolean(field.lockedForSystem && row && isSystemRow(row))
}

export function validateDictionaryForm(
  config: DictionaryResourceConfig,
  values: DictionaryFormValues,
  row?: DictionaryRow,
): DictionaryFormErrors {
  const errors: DictionaryFormErrors = {}

  for (const field of config.fields) {
    if (isFieldLocked(field, row)) continue

    const value = values[field.key]?.trim() ?? ''

    if (field.required && !value) {
      errors[field.key] = `${ERROR}.required`
      continue
    }

    if (field.kind === 'number' && value) {
      const parsed = Number(value)
      if (!Number.isInteger(parsed) || parsed <= 0) errors[field.key] = `${ERROR}.positiveInteger`
    }
  }

  return errors
}

export function hasErrors(errors: DictionaryFormErrors) {
  return Object.values(errors).some(Boolean)
}

/**
 * So'rov tanasi. Bloklangan maydonlar yuborilmaydi: server ularni baribir
 * e'tiborga olmaydi, lekin ortiqcha kalit 400 xatosiga sabab bo'lishi mumkin.
 * Bo'sh matn `null` bo'lib ketadi — "tozalash" saqlanishi uchun.
 */
export function toDictionaryBody(
  config: DictionaryResourceConfig,
  values: DictionaryFormValues,
  row?: DictionaryRow,
): Record<string, unknown> {
  const body: Record<string, unknown> = {}

  for (const field of config.fields) {
    if (isFieldLocked(field, row)) continue

    const value = values[field.key]?.trim() ?? ''

    if (field.kind === 'number') {
      body[field.key] = value ? Number(value) : null
      continue
    }

    body[field.key] = value || null
  }

  return body
}
