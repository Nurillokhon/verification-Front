import type {
  TypeForm,
  TypeFormCoreName,
  TypeFormCoreRule,
  TypeFormCustomField,
  TypeFormGrade,
  TypeFormResult,
  TypeFormScoreField,
  TypeFormScoreRange,
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

// --- Umumiy natija va CEFR -----------------------------------------------
// Backenddagi apps/dictionary/type_form.py (validate_overall) bilan bir xil
// qoida. Bu yerda faqat oldindan ko'rsatish va tekshirish: haqiqiy CEFR ni
// backend hisoblaydi va ariza saqlangan paytda yozib qo'yadi.

const NO_RESULT: TypeFormResult = { kind: 'none' }

/** Tur formasidagi natija sozlamasi; eski backend yoki sozlanmagan tur — `none`. */
export function getResult(form: TypeForm | undefined): TypeFormResult {
  return form?.result ?? NO_RESULT
}

/** Nomzod umumiy natija kiritadimi (`none` — CEFR yo'q, maydon chizilmaydi). */
export function hasOverall(result: TypeFormResult) {
  return result.kind !== 'none'
}

/** `grade` va `level` uchun tanlov variantlari; `score` uchun bo'sh. */
export function getOverallOptions(result: TypeFormResult): string[] {
  if (result.kind === 'grade') return ((result.scale ?? []) as TypeFormGrade[]).map((g) => g.name)
  if (result.kind === 'level') return result.levels ?? []
  return []
}

/** "7,5" ham qabul qilinadi — backend vergulni nuqtaga almashtiradi. */
export function parseOverallScore(raw: string): number | null {
  const value = raw.trim().replace(',', '.')
  if (!/^-?\d+(\.\d+)?$/.test(value)) return null
  return Number(value)
}

/** Kiritilgan natija uchun CEFR; shkalada yo'q bo'lsa null. */
export function resolveCefr(result: TypeFormResult, raw: string): string | null {
  const value = raw.trim()
  if (!value) return null

  if (result.kind === 'score') {
    const number = parseOverallScore(value)
    if (number === null) return null
    const range = ((result.scale ?? []) as TypeFormScoreRange[]).find(
      (item) => item.min <= number && number <= item.max,
    )
    return range?.cefr || null
  }

  if (result.kind === 'grade') {
    const grade = ((result.scale ?? []) as TypeFormGrade[]).find(
      (item) => item.name.toLowerCase() === value.toLowerCase(),
    )
    return grade?.cefr || null
  }

  if (result.kind === 'level') {
    return (result.levels ?? []).find((level) => level.toLowerCase() === value.toLowerCase()) ?? null
  }

  return null
}

// Ball va erkin maydon xatolari asosiy maydonlar bilan bitta obyektda saqlanadi —
// prefiks nomlar to'qnashib ketmasligi uchun.
export function getScoreErrorKey(key: string) {
  return `score.${key}`
}

export function getCustomErrorKey(key: string) {
  return `custom.${key}`
}
