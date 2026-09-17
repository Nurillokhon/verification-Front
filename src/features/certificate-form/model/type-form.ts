import type {
  TypeForm,
  TypeFormCoreName,
  TypeFormCoreRule,
  TypeFormCustomField,
  TypeFormScoreField,
} from '@/entities/dictionary'

/**
 * Tur tanlanmagan yoki forma hali kelmagan holat: asosiy maydonlar chizilmaydi.
 * Qaysi maydon ko'rinishini faqat tur formasi hal qiladi, shuning uchun "ko'rinmaydi"
 * xavfsiz standart — mavjud bo'lmagan maydon uchun xato ham chiqmaydi.
 */
const HIDDEN_CORE_RULE: TypeFormCoreRule = { enabled: false, required: false, label: '' }

export function getCoreRule(form: TypeForm | undefined, name: TypeFormCoreName): TypeFormCoreRule {
  return form?.core?.[name] ?? HIDDEN_CORE_RULE
}

const EMPTY_SCORE_FIELDS: readonly TypeFormScoreField[] = []
const EMPTY_CUSTOM_FIELDS: readonly TypeFormCustomField[] = []

function byOrder(first: { order: number }, second: { order: number }) {
  return first.order - second.order
}

export function getScoreFields(form: TypeForm | undefined): readonly TypeFormScoreField[] {
  if (!form?.fields?.length) return EMPTY_SCORE_FIELDS
  return [...form.fields].sort(byOrder)
}

export function getCustomFields(form: TypeForm | undefined): readonly TypeFormCustomField[] {
  if (!form?.custom_fields?.length) return EMPTY_CUSTOM_FIELDS
  return [...form.custom_fields].sort(byOrder)
}

/**
 * Ball maydonining forma ichidagi kaliti — bo'limning bazadagi nomi. Sertifikat
 * javobidagi `extra_data[].section` ham aynan shu nom bilan keladi, shuning uchun
 * tahrirlashda eski ballar qo'shimcha moslashtirishsiz o'z maydoniga tushadi.
 * Nom bo'lmasa bo'lim ID si ishlatiladi.
 */
export function getScoreKey(field: TypeFormScoreField) {
  return field.name ?? String(field.section)
}

/** `letter` turidagi ball "B2" kabi matn; qolganlari (decimal, integer) son sifatida tekshiriladi. */
export function isNumericScore(field: TypeFormScoreField) {
  return field.score_type === 'decimal' || field.score_type === 'integer'
}

// Ball va erkin maydon xatolari asosiy maydonlar bilan bitta obyektda saqlanadi —
// prefiks nomlar to'qnashib ketmasligi uchun.
export function getScoreErrorKey(key: string) {
  return `score.${key}`
}

export function getCustomErrorKey(key: string) {
  return `custom.${key}`
}
