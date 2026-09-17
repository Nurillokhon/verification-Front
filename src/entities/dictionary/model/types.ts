/** Lug'at elementi (swagger: Type, Degree, Status). Type'da name null bo'lishi mumkin. */
export type DictionaryItem = {
  id: number
  name: string | null
}

/** swagger: Language */
export type LanguageItem = DictionaryItem & {
  code: string
}

/** Select maydoni uchun variantlar — qiymat id satr ko'rinishida, nomi bo'lmasa "#id". */
export function toSelectOptions(items: readonly DictionaryItem[]) {
  return items.map((item) => ({ value: String(item.id), label: item.name || `#${item.id}` }))
}

// --- Tur formasi: GET /dictionary/type/<id>/form/ (swagger: TypeForm) ---

/** Asosiy maydon qoidasi (swagger: TypeFormCoreRule). `enabled: false` — maydon chizilmaydi va yuborilsa ham saqlanmaydi. */
export type TypeFormCoreRule = {
  enabled: boolean
  required: boolean
  /** Formada ko'rsatiladigan nomi — backend beradi */
  label: string
}

export type TypeFormCoreName = 'degree' | 'exam_date' | 'exam_place'

export type TypeFormCore = Record<TypeFormCoreName, TypeFormCoreRule>

/** Ball maydoni (swagger: TypeFormField) — har biri bitta bo'limga to'g'ri keladi. */
export type TypeFormScoreField = {
  /** Hozircha faqat 'score' */
  kind: string
  /** Bo'lim ID si — extra_data[].section da aynan shu qiymat yuboriladi */
  section: number
  /** Bo'limning bazadagi nomi; GET javobidagi extra_data[].section shu nom bilan keladi */
  name: string | null
  description: string | null
  label: string
  required: boolean
  /** decimal | integer | letter */
  score_type: string | null
  min: number | null
  max: number | null
  order: number
}

export type CustomFieldKind = 'text' | 'number' | 'date' | 'select'

/** Erkin maydon (swagger: TypeFormCustomField) — qiymatlari `data` JSON obyektida yuboriladi. */
export type TypeFormCustomField = {
  kind: CustomFieldKind
  /** `data` dagi kalit */
  key: string
  label: string
  required: boolean
  order: number
  /** Faqat select uchun */
  options?: string[]
  /** Faqat number uchun */
  min?: number | null
  max?: number | null
  /** Faqat text uchun */
  max_length?: number
}

export type TypeForm = {
  type: number
  type_name: string
  /** false — admin bu tur uchun forma tuzmagan; `fields` turga biriktirilgan bo'limlardan olingan */
  configured: boolean
  core: TypeFormCore
  fields: TypeFormScoreField[]
  custom_fields: TypeFormCustomField[]
}

/** Select variantlari satrlar ro'yxatidan — custom_fields[].options shu ko'rinishda keladi. */
export function toOptionsFromStrings(options: readonly string[] | undefined) {
  return (options ?? []).map((option) => ({ value: option, label: option }))
}
