import type { Expert } from '@/entities/expert'
import { formatUzPhone, isValidUzPhone, toApiPhone } from '@/shared/lib/phone'
import type { UpdateExpertBody } from '../api/edit-expert-api'

export type EditExpertData = {
  /** "+998 90 123 45 67" ko'rinishida */
  phone: string
  /** Bo'sh qolsa parol o'zgarmaydi */
  password: string
  isActive: boolean
  languageIds: string[]
  typeIds: string[]
}

type EditExpertErrorKey =
  | 'dashboard.experts.create.errors.required'
  | 'dashboard.experts.create.errors.phone'
  | 'dashboard.experts.create.errors.password'

export type EditExpertErrors = Partial<Record<keyof EditExpertData, EditExpertErrorKey>>

// swagger: ExpertUpdate.password — kamida 8 belgi
const PASSWORD_MIN_LENGTH = 8

export function toEditExpertData(expert: Expert): EditExpertData {
  return {
    phone: formatUzPhone(expert.phone),
    password: '',
    isActive: expert.is_active,
    languageIds: expert.language.map((item) => String(item.id)),
    typeIds: expert.type.map((item) => String(item.id)),
  }
}

export function validateEditExpert(data: EditExpertData): EditExpertErrors {
  return {
    phone: !data.phone
      ? 'dashboard.experts.create.errors.required'
      : isValidUzPhone(data.phone)
        ? undefined
        : 'dashboard.experts.create.errors.phone',
    password:
      data.password && data.password.length < PASSWORD_MIN_LENGTH
        ? 'dashboard.experts.create.errors.password'
        : undefined,
  }
}

export function hasErrors(errors: EditExpertErrors) {
  return Object.values(errors).some(Boolean)
}

export function toUpdateExpertBody(data: EditExpertData): UpdateExpertBody {
  return {
    phone: toApiPhone(data.phone),
    ...(data.password && { password: data.password }),
    is_active: data.isActive,
    language_ids: data.languageIds.map(Number),
    type_ids: data.typeIds.map(Number),
  }
}
