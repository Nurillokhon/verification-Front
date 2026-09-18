import type {
  CustomFieldKind,
  SectionAdmin,
  TypeForm,
  TypeFormCore,
  TypeFormCoreName,
  TypeFormCustomField,
  TypeFormScoreField,
} from '@/entities/dictionary'
import type { TranslationKey } from '@/shared/config/i18n'

export const CORE_FIELD_NAMES: readonly TypeFormCoreName[] = ['degree', 'exam_date', 'exam_place']

export const SCORE_TYPES = ['decimal', 'integer', 'letter'] as const
export type ScoreType = (typeof SCORE_TYPES)[number]

export const CUSTOM_FIELD_KINDS: readonly CustomFieldKind[] = ['text', 'number', 'date', 'select']

/**
 * Ball maydoni tahrirlanayotgan holatda. Sonlar input'dagi kabi satr bo'lib
 * turadi — bo'sh qiymat "chegara yo'q" degani va yuborishda `null` bo'ladi.
 */
export type ScoreFieldDraft = {
  /** Faqat React kaliti va xato kaliti uchun — backendga yuborilmaydi */
  uid: string
  section: string
  label: string
  required: boolean
  scoreType: ScoreType
  min: string
  max: string
}

export type CustomFieldDraft = {
  uid: string
  kind: CustomFieldKind
  key: string
  label: string
  required: boolean
  /** Select variantlari — har qatorda bittadan */
  options: string
  min: string
  max: string
  maxLength: string
}

export type TypeFormDraft = {
  core: TypeFormCore
  fields: ScoreFieldDraft[]
  customFields: CustomFieldDraft[]
}

/** Xato kaliti (`core.degree.label`, `score.<uid>.section`, ...) → tarjima kaliti */
export type TypeFormDraftErrors = Record<string, TranslationKey | undefined>

const ERROR = 'dashboard.forms.editor.errors' as const

// Tartib raqami — yangi qatorlarni bir-biridan ajratish uchun yetarli
let uidCounter = 0
const createUid = () => `draft-${++uidCounter}`

const toInput = (value: number | null | undefined) =>
  value === null || value === undefined ? '' : String(value)

function toScoreType(value: string | null): ScoreType {
  return SCORE_TYPES.find((type) => type === value) ?? 'decimal'
}

function byOrder(first: { order: number }, second: { order: number }) {
  return first.order - second.order
}

function toScoreDraft(field: TypeFormScoreField): ScoreFieldDraft {
  return {
    uid: createUid(),
    section: String(field.section),
    label: field.label,
    required: field.required,
    scoreType: toScoreType(field.score_type),
    min: toInput(field.min),
    max: toInput(field.max),
  }
}

function toCustomDraft(field: TypeFormCustomField): CustomFieldDraft {
  return {
    uid: createUid(),
    kind: field.kind,
    key: field.key,
    label: field.label,
    required: field.required,
    options: (field.options ?? []).join('\n'),
    min: toInput(field.min),
    max: toInput(field.max),
    maxLength: toInput(field.max_length),
  }
}

/** Joriy forma tahrirlash uchun: `configured: false` bo'lsa ham bo'limlardan olingan maydonlar keladi. */
export function toDraft(form: TypeForm): TypeFormDraft {
  return {
    core: structuredClone(form.core),
    fields: [...form.fields].sort(byOrder).map(toScoreDraft),
    customFields: [...form.custom_fields].sort(byOrder).map(toCustomDraft),
  }
}

export function createScoreField(): ScoreFieldDraft {
  return {
    uid: createUid(),
    section: '',
    label: '',
    required: true,
    scoreType: 'decimal',
    min: '',
    max: '',
  }
}

export function createCustomField(): CustomFieldDraft {
  return {
    uid: createUid(),
    kind: 'text',
    key: '',
    label: '',
    required: false,
    options: '',
    min: '',
    max: '',
    maxLength: '',
  }
}

/** Qo'shimcha maydon kartochkasining DOM id si */
export const getCustomCardId = (uid: string) => `custom-field-${uid}`

export const getCoreErrorKey = (name: TypeFormCoreName) => `core.${name}.label`
export const getScoreErrorKey = (uid: string, key: keyof ScoreFieldDraft) => `score.${uid}.${key}`
export const getCustomErrorKey = (uid: string, key: keyof CustomFieldDraft) => `custom.${uid}.${key}`

/** Bo'sh satr — `null`, aks holda son (noto'g'ri qiymat validatsiyada ushlanadi). */
function toNumberOrNull(value: string) {
  const trimmed = value.trim()
  return trimmed ? Number(trimmed) : null
}

function parseOptions(value: string) {
  return value
    .split('\n')
    .map((option) => option.trim())
    .filter(Boolean)
}

// `data` JSON'idagi kalit: kichik lotin harflari, raqam va pastki chiziq
const CUSTOM_KEY_PATTERN = /^[a-z][a-z0-9_]*$/

/** min va max: har biri son bo'lishi, ikkalasi berilsa min ≤ max. */
function validateRange(
  min: string,
  max: string,
  errors: TypeFormDraftErrors,
  minKey: string,
  maxKey: string,
) {
  const minValue = toNumberOrNull(min)
  const maxValue = toNumberOrNull(max)

  if (minValue !== null && Number.isNaN(minValue)) errors[minKey] = `${ERROR}.number`
  if (maxValue !== null && Number.isNaN(maxValue)) errors[maxKey] = `${ERROR}.number`

  if (errors[minKey] || errors[maxKey] || minValue === null || maxValue === null) return
  if (minValue > maxValue) errors[maxKey] = `${ERROR}.range`
}

export function validateDraft(draft: TypeFormDraft): TypeFormDraftErrors {
  const errors: TypeFormDraftErrors = {}

  for (const name of CORE_FIELD_NAMES) {
    if (!draft.core[name].label.trim()) errors[getCoreErrorKey(name)] = `${ERROR}.required`
  }

  const usedSections = new Set<string>()
  for (const field of draft.fields) {
    const sectionKey = getScoreErrorKey(field.uid, 'section')

    if (!field.section) errors[sectionKey] = `${ERROR}.required`
    else if (usedSections.has(field.section)) errors[sectionKey] = `${ERROR}.duplicateSection`
    usedSections.add(field.section)

    if (!field.label.trim()) errors[getScoreErrorKey(field.uid, 'label')] = `${ERROR}.required`

    if (field.scoreType !== 'letter') {
      validateRange(
        field.min,
        field.max,
        errors,
        getScoreErrorKey(field.uid, 'min'),
        getScoreErrorKey(field.uid, 'max'),
      )
    }
  }

  const usedKeys = new Set<string>()
  for (const field of draft.customFields) {
    const keyError = getCustomErrorKey(field.uid, 'key')
    const key = field.key.trim()

    if (!key) errors[keyError] = `${ERROR}.required`
    else if (!CUSTOM_KEY_PATTERN.test(key)) errors[keyError] = `${ERROR}.keyFormat`
    else if (usedKeys.has(key)) errors[keyError] = `${ERROR}.duplicateKey`
    usedKeys.add(key)

    if (!field.label.trim()) errors[getCustomErrorKey(field.uid, 'label')] = `${ERROR}.required`

    if (field.kind === 'select' && parseOptions(field.options).length === 0) {
      errors[getCustomErrorKey(field.uid, 'options')] = `${ERROR}.options`
    }

    if (field.kind === 'number') {
      validateRange(
        field.min,
        field.max,
        errors,
        getCustomErrorKey(field.uid, 'min'),
        getCustomErrorKey(field.uid, 'max'),
      )
    }

    if (field.kind === 'text' && field.maxLength.trim()) {
      const maxLength = Number(field.maxLength)
      if (!Number.isInteger(maxLength) || maxLength <= 0) {
        errors[getCustomErrorKey(field.uid, 'maxLength')] = `${ERROR}.positiveInteger`
      }
    }
  }

  return errors
}

export function hasErrors(errors: TypeFormDraftErrors) {
  return Object.values(errors).some(Boolean)
}

/**
 * `PATCH /dictionary/admin/types/<id>/` dagi `form`. Tartib ro'yxatdagi
 * o'rnidan olinadi. Maydon turiga tegishli bo'lmagan sozlamalar yuborilmaydi
 * (masalan, matn maydonida min/max) — tur almashtirilganda eski qiymat qolib ketmasin.
 */
export function toFormBody(draft: TypeFormDraft) {
  const core = Object.fromEntries(
    CORE_FIELD_NAMES.map((name) => {
      const rule = draft.core[name]
      // Ko'rsatilmaydigan maydon majburiy bo'lib qolmasin
      return [
        name,
        { enabled: rule.enabled, required: rule.enabled && rule.required, label: rule.label.trim() },
      ]
    }),
  ) as TypeFormCore

  return {
    core,
    fields: draft.fields.map((field, index) => {
      const letter = field.scoreType === 'letter'
      return {
        kind: 'score',
        section: Number(field.section),
        label: field.label.trim(),
        required: field.required,
        score_type: field.scoreType,
        min: letter ? null : toNumberOrNull(field.min),
        max: letter ? null : toNumberOrNull(field.max),
        order: index + 1,
      }
    }),
    custom_fields: draft.customFields.map((field, index) => {
      const base = {
        kind: field.kind,
        key: field.key.trim(),
        label: field.label.trim(),
        required: field.required,
        order: index + 1,
      }

      if (field.kind === 'select') return { ...base, options: parseOptions(field.options) }
      if (field.kind === 'number') {
        return { ...base, min: toNumberOrNull(field.min), max: toNumberOrNull(field.max) }
      }
      if (field.kind === 'text' && field.maxLength.trim()) {
        return { ...base, max_length: Number(field.maxLength) }
      }
      return base
    }),
  }
}

/**
 * Tahrirlanayotgan forma nomzodga qanday ko'rinishini oldindan ko'rsatish uchun
 * `TypeForm` ko'rinishiga keltiriladi. Bo'lim tanlanmagan yoki noto'g'ri qator
 * ham chiziladi — admin o'zgarishni darhol ko'rsin.
 */
export function toPreviewForm(
  draft: TypeFormDraft,
  base: TypeForm,
  sections: readonly SectionAdmin[],
): TypeForm {
  const body = toFormBody(draft)

  return {
    ...base,
    configured: true,
    core: body.core,
    fields: body.fields.map((field, index) => {
      const section = sections.find((item) => item.id === field.section)
      const numeric = (value: number | null) => (Number.isNaN(value) ? null : value)

      return {
        ...field,
        // Kalit sifatida ishlatiladi — bo'lim tanlanmagan qatorlar to'qnashmasin
        section: field.section || -(index + 1),
        name: section?.name ?? `draft-${index}`,
        description: section?.description ?? null,
        min: numeric(field.min),
        max: numeric(field.max),
      }
    }),
    custom_fields: body.custom_fields.map((field, index) => ({
      ...field,
      key: field.key || `draft-${index}`,
    })),
  }
}
