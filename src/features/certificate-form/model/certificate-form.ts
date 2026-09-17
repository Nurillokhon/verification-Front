import {
  parseExtraData,
  type CertificateDataItem,
  type CertificateDetail,
} from '@/entities/certificate'
import type { TypeForm, TypeFormCustomField, TypeFormScoreField } from '@/entities/dictionary'
import {
  getCoreRule,
  getCustomErrorKey,
  getCustomFields,
  getScoreErrorKey,
  getScoreFields,
  getScoreKey,
  isNumericScore,
} from './type-form'

export type CertificateFormMode = 'create' | 'edit'

export type CertificateFormValues = {
  number: string
  /** Select qiymatlari — lug'at elementining id'si satr ko'rinishida */
  language: string
  type: string
  degree: string
  /** "YYYY-MM-DD" — <input type="date"> qiymati API formati bilan bir xil */
  issueDate: string
  examDate: string
  examPlace: string
  file: File | null
  /** Ball maydonlari: getScoreKey() kaliti (bo'lim nomi) → ball */
  scores: Record<string, string>
  /** Erkin maydonlar: custom_fields[].key → qiymat */
  custom: Record<string, string>
  /**
   * Tahrirlashda mavjud ballarning ID lari (bo'lim nomi → ID). Foydalanuvchi
   * o'zgartirmaydi — PATCH da yangi ball qo'shilib ketmasligi uchun kerak.
   */
  scoreIds: Record<string, number>
}

export type CertificateFieldName = Exclude<
  keyof CertificateFormValues,
  'scores' | 'custom' | 'scoreIds'
>

const EMPTY_RECORD = {} as const

export const EMPTY_CERTIFICATE_FORM: CertificateFormValues = {
  number: '',
  language: '',
  type: '',
  degree: '',
  issueDate: '',
  examDate: '',
  examPlace: '',
  file: null,
  scores: EMPTY_RECORD,
  custom: EMPTY_RECORD,
  scoreIds: EMPTY_RECORD,
}

function idToValue(id: number | null) {
  return id === null ? '' : String(id)
}

/** GET javobidagi ball ID lari — tahrirlashda extra_data[].id sifatida qaytariladi. */
function toScoreIds(raw: CertificateDetail['extra_data']): Record<string, number> {
  if (!Array.isArray(raw)) return EMPTY_RECORD

  return Object.fromEntries(
    raw.flatMap((score) =>
      typeof score.section === 'string' && score.section ? [[score.section, score.id] as const] : [],
    ),
  )
}

function toCustomValues(items: CertificateDataItem[] | null | undefined): Record<string, string> {
  if (!items?.length) return EMPTY_RECORD

  return Object.fromEntries(
    items.map((item) => [item.key, item.value == null ? '' : String(item.value)]),
  )
}

export function toCertificateFormValues(certificate: CertificateDetail): CertificateFormValues {
  return {
    number: certificate.number ?? '',
    language: idToValue(certificate.language),
    type: idToValue(certificate.type),
    degree: idToValue(certificate.degree),
    issueDate: certificate.issue_date ?? '',
    examDate: certificate.exam_date ?? '',
    examPlace: certificate.exam_place ?? '',
    file: null,
    // parseExtraData() bo'lim NOMI bo'yicha kalitlaydi — getScoreKey() bilan bir xil
    scores: parseExtraData(certificate.extra_data),
    custom: toCustomValues(certificate.data),
    scoreIds: toScoreIds(certificate.extra_data),
  }
}

// Backend chegarasi: 5 MB, faqat pdf/jpeg/png
export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const ACCEPTED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png'

// Xato matni emas, tarjima kaliti — til almashganda ko'rsatilgan xato ham tarjima bo'ladi.
const ERROR_KEYS = {
  required: 'dashboard.certificateForm.errors.required',
  number: 'dashboard.certificateForm.errors.number',
  integer: 'dashboard.certificateForm.errors.integer',
  min: 'dashboard.certificateForm.errors.min',
  max: 'dashboard.certificateForm.errors.max',
  date: 'dashboard.certificateForm.errors.date',
  option: 'dashboard.certificateForm.errors.option',
  maxLength: 'dashboard.certificateForm.errors.maxLength',
  fileRequired: 'dashboard.certificateForm.errors.fileRequired',
  fileTooLarge: 'dashboard.certificateForm.errors.fileTooLarge',
} as const

export type CertificateFormErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS]

export type CertificateFormError = {
  key: CertificateFormErrorKey
  /** Kalitdagi {{min}} / {{max}} o'rniga qo'yiladigan qiymatlar */
  params?: { min?: number; max?: number }
}

// Asosiy maydon xatolari o'z nomi bilan, qolganlari getScoreErrorKey() /
// getCustomErrorKey() bilan saqlanadi.
export type CertificateFormErrors = Record<string, CertificateFormError | undefined>

const REQUIRED: CertificateFormError = { key: ERROR_KEYS.required }

// Tur formasidan qat'i nazar har doim majburiy bo'lgan maydonlar
const ALWAYS_REQUIRED = [
  'number',
  'language',
  'type',
  'issueDate',
] as const satisfies readonly CertificateFieldName[]

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function validateRange(value: number, min: number | null | undefined, max: number | null | undefined) {
  if (typeof min === 'number' && value < min) return { key: ERROR_KEYS.min, params: { min } }
  if (typeof max === 'number' && value > max) return { key: ERROR_KEYS.max, params: { max } }
  return undefined
}

function validateScore(field: TypeFormScoreField, raw: string): CertificateFormError | undefined {
  const value = raw.trim()
  if (!value) return field.required ? REQUIRED : undefined
  if (!isNumericScore(field)) return undefined

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return { key: ERROR_KEYS.number }
  if (field.score_type === 'integer' && !Number.isInteger(parsed)) {
    return { key: ERROR_KEYS.integer }
  }

  return validateRange(parsed, field.min, field.max)
}

function validateCustom(field: TypeFormCustomField, raw: string): CertificateFormError | undefined {
  const value = raw.trim()
  if (!value) return field.required ? REQUIRED : undefined

  if (field.kind === 'number') {
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return { key: ERROR_KEYS.number }
    return validateRange(parsed, field.min, field.max)
  }

  if (field.kind === 'date') {
    return DATE_PATTERN.test(value) ? undefined : { key: ERROR_KEYS.date }
  }

  if (field.kind === 'select') {
    return field.options?.includes(value) ? undefined : { key: ERROR_KEYS.option }
  }

  if (field.max_length && value.length > field.max_length) {
    return { key: ERROR_KEYS.maxLength, params: { max: field.max_length } }
  }

  return undefined
}

/**
 * Formani tekshiradi. Asosiy maydonlarning majburiyligi tur formasidagi `core`
 * qoidalariga bo'ysunadi: o'chirilgan maydon chizilmaydi, demak tekshirilmaydi ham.
 */
export function validateCertificateForm(
  values: CertificateFormValues,
  form: TypeForm | undefined,
  mode: CertificateFormMode,
): CertificateFormErrors {
  const errors: CertificateFormErrors = {}

  for (const field of ALWAYS_REQUIRED) {
    if (!values[field].trim()) errors[field] = REQUIRED
  }

  const core = {
    degree: getCoreRule(form, 'degree'),
    examDate: getCoreRule(form, 'exam_date'),
    examPlace: getCoreRule(form, 'exam_place'),
  }

  if (core.degree.enabled && core.degree.required && !values.degree.trim()) errors.degree = REQUIRED
  if (core.examDate.enabled && core.examDate.required && !values.examDate.trim()) {
    errors.examDate = REQUIRED
  }
  if (core.examPlace.enabled && core.examPlace.required && !values.examPlace.trim()) {
    errors.examPlace = REQUIRED
  }

  // Tahrirlashda fayl ixtiyoriy — yangisi tanlanmasa serverdagisi saqlanib qoladi
  if (values.file && values.file.size > MAX_FILE_SIZE) {
    errors.file = { key: ERROR_KEYS.fileTooLarge }
  } else if (!values.file && mode === 'create') {
    errors.file = { key: ERROR_KEYS.fileRequired }
  }

  for (const field of getScoreFields(form)) {
    const key = getScoreKey(field)
    const error = validateScore(field, values.scores[key] ?? '')
    if (error) errors[getScoreErrorKey(key)] = error
  }

  for (const field of getCustomFields(form)) {
    const error = validateCustom(field, values.custom[field.key] ?? '')
    if (error) errors[getCustomErrorKey(field.key)] = error
  }

  return errors
}

export function hasErrors(errors: CertificateFormErrors) {
  return Object.values(errors).some(Boolean)
}

/**
 * Ballar `extra_data` da JSON massiv bo'lib ketadi: `[{ section, score }]`.
 * Backend elementlar soni turdagi bo'limlar soniga aniq teng bo'lishini talab
 * qiladi, shuning uchun to'ldirilmagan ixtiyoriy ball ham bo'sh matn bilan
 * yuboriladi. Tahrirlashda mavjud ball `id` bilan yangilanadi — aks holda
 * backend uning yoniga yangisini qo'shib qo'yadi.
 */
function serializeScores(
  fields: readonly TypeFormScoreField[],
  values: Record<string, string>,
  scoreIds: Record<string, number> | undefined,
) {
  return JSON.stringify(
    fields.map((field) => {
      const key = getScoreKey(field)
      const score = values[key]?.trim() ?? ''
      const id = scoreIds?.[key]

      return id === undefined ? { section: field.section, score } : { id, section: field.section, score }
    }),
  )
}

/** Erkin maydonlar `data` da JSON obyekt bo'lib ketadi; bo'sh qiymatlar yuborilmaydi. */
function serializeCustom(
  fields: readonly TypeFormCustomField[],
  values: Record<string, string>,
) {
  const entries = fields.flatMap((field) => {
    const value = values[field.key]?.trim() ?? ''
    if (!value) return []
    return [[field.key, field.kind === 'number' ? Number(value) : value] as const]
  })

  return JSON.stringify(Object.fromEntries(entries))
}

type CertificateFormDataArgs = {
  values: CertificateFormValues
  form: TypeForm | undefined
  /** Tur o'zgartirilgan bo'lsa berilmaydi — eski ball ID lari yangi bo'limlarga tegishli emas */
  scoreIds?: Record<string, number>
}

/** Fayl ham yuborilgani uchun so'rov multipart/form-data bo'ladi (Content-Type'ni axios o'zi qo'yadi). */
export function toCertificateFormData({ values, form, scoreIds }: CertificateFormDataArgs) {
  const data = new FormData()
  data.append('number', values.number.trim())
  data.append('language', values.language)
  data.append('type', values.type)
  data.append('issue_date', values.issueDate)

  // Tur formasida o'chirilgan maydon yuborilmaydi — backend uni baribir saqlamaydi
  if (getCoreRule(form, 'degree').enabled && values.degree) {
    data.append('degree', values.degree)
  }
  if (getCoreRule(form, 'exam_date').enabled && values.examDate) {
    data.append('exam_date', values.examDate)
  }
  if (getCoreRule(form, 'exam_place').enabled && values.examPlace.trim()) {
    data.append('exam_place', values.examPlace.trim())
  }

  if (values.file) data.append('file', values.file)

  const scoreFields = getScoreFields(form)
  if (scoreFields.length > 0) {
    data.append('extra_data', serializeScores(scoreFields, values.scores, scoreIds))
  }

  // Tahrirlashda yuborilgan `data` eskisini to'liq almashtiradi — bo'shatilgan
  // maydon shu yo'l bilan tozalanadi. Tur formasi kelmaguncha hech narsa
  // yuborilmaydi, aks holda mavjud qiymatlar bo'sh obyekt bilan o'chib ketardi.
  const customFields = getCustomFields(form)
  if (customFields.length > 0) {
    data.append('data', serializeCustom(customFields, values.custom))
  }

  return data
}
