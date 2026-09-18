import {
  Award,
  GraduationCap,
  Languages,
  ListChecks,
  MessageSquareText,
  Tags,
  type LucideIcon,
} from 'lucide-react'
import {
  SMS_MESSAGE_CODES,
  type DegreeAdmin,
  type DictionaryResource,
  type LanguageAdmin,
  type SectionAdmin,
  type SmsMessageAdmin,
  type StatusAdmin,
  type TypeAdmin,
} from '@/entities/dictionary'
import type { TranslationKey } from '@/shared/config/i18n'

/** Bitta jadval va bitta forma barcha lug'atlarga xizmat qiladi — qatori shu union. */
export type DictionaryRow =
  | DegreeAdmin
  | LanguageAdmin
  | SectionAdmin
  | TypeAdmin
  | SmsMessageAdmin
  | StatusAdmin

export type DictionaryFieldKind = 'text' | 'textarea' | 'number' | 'select'

export type DictionaryField = {
  /** Body'dagi va javobdagi kalit */
  key: string
  labelKey: TranslationKey
  kind: DictionaryFieldKind
  required?: boolean
  /** `select` uchun qiymatlar — bular tizim kodlari, shuning uchun yorlig'i qiymatning o'zi. */
  options?: readonly string[]
  /** Server belgilaydi: formada o'chirilgan holda ko'rsatiladi va yuborilmaydi. */
  readOnly?: boolean
  /** `is_system` yozuvlarda tahrirlanmaydi (SMS kodini o'zgartirish tizimni buzadi). */
  lockedForSystem?: boolean
  hintKey?: TranslationKey
  placeholder?: string
  /** Jadvalda alohida ustun sifatida chiqadimi. `name` har doim birinchi ustun. */
  inTable?: boolean
}

export type DictionaryResourceConfig = {
  resource: DictionaryResource
  icon: LucideIcon
  /** Statusda yangi yozuv yaratib bo'lmaydi — backend faqat PATCH beradi. */
  canCreate: boolean
  canHide: boolean
  fields: readonly DictionaryField[]
}

const FIELD_LABEL = 'dashboard.forms.fields' as const

export const DICTIONARY_RESOURCE_CONFIG: Record<DictionaryResource, DictionaryResourceConfig> = {
  degrees: {
    resource: 'degrees',
    icon: GraduationCap,
    canCreate: true,
    canHide: true,
    fields: [{ key: 'name', labelKey: `${FIELD_LABEL}.name`, kind: 'text', required: true }],
  },
  languages: {
    resource: 'languages',
    icon: Languages,
    canCreate: true,
    canHide: true,
    fields: [
      { key: 'name', labelKey: `${FIELD_LABEL}.name`, kind: 'text', required: true },
      {
        key: 'code',
        labelKey: `${FIELD_LABEL}.code`,
        kind: 'text',
        required: true,
        placeholder: 'en',
        hintKey: `${FIELD_LABEL}.codeHint`,
        inTable: true,
      },
    ],
  },
  sections: {
    resource: 'sections',
    icon: ListChecks,
    canCreate: true,
    canHide: true,
    fields: [
      { key: 'name', labelKey: `${FIELD_LABEL}.name`, kind: 'text', required: true },
      { key: 'description', labelKey: `${FIELD_LABEL}.description`, kind: 'textarea' },
    ],
  },
  types: {
    resource: 'types',
    icon: Award,
    canCreate: true,
    canHide: true,
    fields: [
      { key: 'name', labelKey: `${FIELD_LABEL}.name`, kind: 'text', required: true },
      {
        key: 'period',
        labelKey: `${FIELD_LABEL}.period`,
        kind: 'number',
        required: true,
        hintKey: `${FIELD_LABEL}.periodHint`,
        inTable: true,
      },
    ],
  },
  smsMessages: {
    resource: 'smsMessages',
    icon: MessageSquareText,
    canCreate: true,
    canHide: true,
    fields: [
      { key: 'name', labelKey: `${FIELD_LABEL}.messageText`, kind: 'textarea', required: true },
      {
        key: 'code',
        labelKey: `${FIELD_LABEL}.code`,
        kind: 'select',
        options: SMS_MESSAGE_CODES,
        lockedForSystem: true,
        hintKey: `${FIELD_LABEL}.smsCodeHint`,
        inTable: true,
      },
    ],
  },
  statuses: {
    resource: 'statuses',
    icon: Tags,
    canCreate: false,
    canHide: false,
    fields: [
      {
        key: 'name',
        labelKey: `${FIELD_LABEL}.systemCode`,
        kind: 'text',
        readOnly: true,
        hintKey: `${FIELD_LABEL}.systemCodeHint`,
      },
      { key: 'label', labelKey: `${FIELD_LABEL}.label`, kind: 'text', inTable: true },
    ],
  },
}

/**
 * Qator maydonini kalit bo'yicha o'qish. Union a'zolarining maydonlari har xil,
 * shuning uchun indekslash faqat shu yerda — bitta joyda — qilinadi.
 */
export function getFieldValue(row: DictionaryRow, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

export function formatFieldValue(row: DictionaryRow, field: DictionaryField) {
  const value = getFieldValue(row, field.key)
  if (value === null || value === undefined || value === '') return null
  return String(value)
}

/** Yashirilgan yozuv — yangi arizalarda ko'rinmaydi, lekin ro'yxatda qoladi. */
export function isHidden(row: DictionaryRow) {
  return 'is_active' in row && !row.is_active
}

/** Tizim yozuvi: kodini o'zgartirib yoki o'chirib bo'lmaydi. */
export function isSystemRow(row: DictionaryRow) {
  return 'is_system' in row && row.is_system
}

/** Bo'limga biriktirilgan turlar — jadvalda nom ostida teg sifatida ko'rsatiladi. */
export function getRowTags(row: DictionaryRow): readonly string[] {
  if (!('types' in row)) return []
  return row.types.map((type) => type.name)
}
