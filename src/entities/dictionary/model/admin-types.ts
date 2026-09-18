/**
 * Lug'atlarni boshqarish uchun admin sxemalari (swagger: *Admin).
 * Ochiq `/dictionary/<name>/` endpointlari qisqartirilgan ko'rinishni beradi;
 * bu yerdagi turlar `/dictionary/admin/<name>/` javoblariga mos keladi.
 */

/** swagger: DictionaryRef — boshqa lug'atga havola (faqat o'qish uchun). */
export type DictionaryRef = {
  id: number
  name: string
}

type AdminRecord = {
  id: number
  created_at: string
  updated_at: string
}

/**
 * `is_active: false` — yozuv yangi arizalarda ko'rinmaydi. Backend DELETE ham
 * aynan shuni qiladi: yozuv o'chirilmaydi, yashiriladi.
 */
type Hideable = {
  is_active: boolean
}

/** swagger: DegreeAdmin */
export type DegreeAdmin = AdminRecord &
  Hideable & {
    name: string
  }

/** swagger: LanguageAdmin */
export type LanguageAdmin = AdminRecord &
  Hideable & {
    name: string
    code: string
  }

/** swagger: SectionAdmin */
export type SectionAdmin = AdminRecord &
  Hideable & {
    name: string
    description: string | null
    /** Bo'lim biriktirilgan turlar — tur formasi saqlanganda avtomatik to'ldiriladi. */
    types: DictionaryRef[]
  }

/** swagger: TypeAdmin. `form` — tur formasining konfiguratsiyasi (hozircha faqat o'qiladi). */
export type TypeAdmin = AdminRecord &
  Hideable & {
    name: string
    /** Amal qilish muddati, yilda. */
    period: number
    form: unknown
  }

/** swagger: SMSMessageAdmin.code — tizim tanigan kodlar ro'yxati. */
export const SMS_MESSAGE_CODES = [
  'register',
  'notuser',
  'notfile',
  'notfound',
  'expired',
  'reupload',
  'invalid',
  'notsignature',
  'low',
  'done',
] as const

export type SmsMessageCode = (typeof SMS_MESSAGE_CODES)[number]

/** swagger: SMSMessageAdmin */
export type SmsMessageAdmin = AdminRecord &
  Hideable & {
    name: string
    code: SmsMessageCode | null
    /** true — tizim xabari: kodi o'zgartirilmaydi va o'chirilmaydi. */
    is_system: boolean
  }

/** swagger: StatusAdmin. `name` — tizim kodi, o'zgarmaydi; admin faqat `label` ni belgilaydi. */
export type StatusAdmin = AdminRecord & {
  name: string
  label: string
}
