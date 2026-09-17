import { isValidUzPhone, toApiPhone } from '@/shared/lib/phone'
import type { CreateExpertBody } from '../api/create-expert-api'

export type CreateExpertData = {
  /** "+998 90 123 45 67" ko'rinishida; API'ga bo'shliqsiz yuboriladi */
  phone: string
  pnfl: string
  passport: string
  password: string
  /** Select qiymatlari — id satr ko'rinishida */
  languageIds: string[]
  typeIds: string[]
}

export const EMPTY_CREATE_EXPERT_DATA: CreateExpertData = {
  phone: '',
  pnfl: '',
  passport: '',
  password: '',
  languageIds: [],
  typeIds: [],
}

// Xato matni emas, tarjima kaliti — til almashganda ko'rsatilgan xato ham tarjima bo'ladi.
type CreateExpertErrorKey =
  | 'dashboard.experts.create.errors.required'
  | 'dashboard.experts.create.errors.phone'
  | 'dashboard.experts.create.errors.pnfl'
  | 'dashboard.experts.create.errors.passport'
  | 'dashboard.experts.create.errors.password'

export type CreateExpertErrors = Partial<Record<keyof CreateExpertData, CreateExpertErrorKey>>

const REQUIRED = 'dashboard.experts.create.errors.required'
const PNFL_PATTERN = /^\d{14}$/
const PASSPORT_PATTERN = /^[A-Z]{2}\d{7}$/
// swagger: ExpertCreate.password — kamida 8 belgi
const PASSWORD_MIN_LENGTH = 8

/** Pasport kiritilayotganda: bo'shliqlar olib tashlanadi, harflar kattalashtiriladi. */
export function normalizePassport(value: string) {
  return value.replace(/\s/g, '').toUpperCase().slice(0, 9)
}

export function normalizePnfl(value: string) {
  return value.replace(/\D/g, '').slice(0, 14)
}

export function validateCreateExpert(data: CreateExpertData): CreateExpertErrors {
  return {
    phone: !data.phone
      ? REQUIRED
      : isValidUzPhone(data.phone)
        ? undefined
        : 'dashboard.experts.create.errors.phone',
    pnfl: !data.pnfl
      ? REQUIRED
      : PNFL_PATTERN.test(data.pnfl)
        ? undefined
        : 'dashboard.experts.create.errors.pnfl',
    passport: !data.passport
      ? REQUIRED
      : PASSPORT_PATTERN.test(data.passport)
        ? undefined
        : 'dashboard.experts.create.errors.passport',
    password: !data.password
      ? REQUIRED
      : data.password.length >= PASSWORD_MIN_LENGTH
        ? undefined
        : 'dashboard.experts.create.errors.password',
  }
}

export function hasErrors(errors: CreateExpertErrors) {
  return Object.values(errors).some(Boolean)
}

export function toCreateExpertBody(data: CreateExpertData): CreateExpertBody {
  return {
    phone: toApiPhone(data.phone),
    pnfl: Number(data.pnfl),
    passport: data.passport,
    password: data.password,
    language_ids: data.languageIds.map(Number),
    type_ids: data.typeIds.map(Number),
  }
}
