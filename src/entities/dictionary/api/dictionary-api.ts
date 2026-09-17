import { useGetRequest, type Paginated } from '@/shared/api'
import type { DictionaryItem, LanguageItem, TypeForm } from '../model/types'

const ENDPOINTS = {
  language: '/dictionary/language/',
  type: '/dictionary/type/',
  degree: '/dictionary/degree/',
} as const

function getTypeFormEndpoint(typeId: string) {
  return `${ENDPOINTS.type}${typeId}/form/`
}

// Lug'atlar kamdan-kam o'zgaradi — sahifalar orasida o'tganda qayta so'ralmasin
const DICTIONARY_STALE_TIME = 30 * 60 * 1000

// Sahifalangan lug'at bitta so'rovda to'liq olinadi — select ichida sahifalash kerak emas
const FULL_PAGE_PARAMS = { page_size: 1000 }

const EMPTY_LANGUAGES: LanguageItem[] = []
const EMPTY_ITEMS: DictionaryItem[] = []

// swagger: language va type sahifalanmagan massiv qaytaradi
export function useLanguages() {
  const { data, isLoading } = useGetRequest<LanguageItem[]>({
    url: ENDPOINTS.language,
    options: { staleTime: DICTIONARY_STALE_TIME },
  })

  return { languages: data ?? EMPTY_LANGUAGES, isLoading }
}

/**
 * Ariza formasidagi sertifikat tili. Foydalanuvchi uni tanlamaydi — tizim
 * faqat ingliz tili sertifikatlarini qabul qiladi, shuning uchun til lug'atdan
 * kodi bo'yicha topiladi. Topilmasa forma buni xato sifatida ko'rsatadi:
 * tasodifiy tilni jimgina yuborgandan ko'ra to'xtash yaxshiroq.
 */
export const DEFAULT_LANGUAGE_CODE = 'en'

export function useDefaultLanguage() {
  const { languages, isLoading } = useLanguages()

  return {
    language: languages.find((item) => item.code === DEFAULT_LANGUAGE_CODE),
    isLoading,
  }
}

/**
 * Sertifikat turlari. `languageId` berilsa ro'yxat shu tilga filtrlanadi
 * (tili ko'rsatilmagan turlar hamma til uchun amal qiladi va baribir tushadi).
 * Til tanlanmaguncha so'rov yuborilmaydi — tur tildan keyin tanlanadi.
 */
export function useCertificateTypes(languageId?: string) {
  const { data, isLoading } = useGetRequest<DictionaryItem[]>({
    url: ENDPOINTS.type,
    params: languageId ? { language: languageId } : undefined,
    options: { staleTime: DICTIONARY_STALE_TIME, enabled: Boolean(languageId) },
  })

  return { types: data ?? EMPTY_ITEMS, isLoading }
}

/** Til filtrisiz barcha faol sertifikat turlari — masalan, ekspertga tur biriktirish uchun. */
export function useAllCertificateTypes({ enabled = true }: { enabled?: boolean } = {}) {
  const { data, isLoading } = useGetRequest<DictionaryItem[]>({
    url: ENDPOINTS.type,
    options: { staleTime: DICTIONARY_STALE_TIME, enabled },
  })

  return { types: data ?? EMPTY_ITEMS, isLoading }
}

// swagger: degree sahifalangan javob qaytaradi
export function useDegrees() {
  const { data, isLoading } = useGetRequest<Paginated<DictionaryItem>>({
    url: ENDPOINTS.degree,
    params: FULL_PAGE_PARAMS,
    options: { staleTime: DICTIONARY_STALE_TIME },
  })

  return { degrees: data?.results ?? EMPTY_ITEMS, isLoading }
}

/**
 * Tanlangan tur uchun forma tavsifi: qaysi asosiy maydonlar ko'rsatiladi,
 * qanday ballar va erkin maydonlar so'raladi. Tur tanlanmaguncha so'rov
 * yuborilmaydi; faol bo'lmagan yoki mavjud bo'lmagan turda backend 404 qaytaradi.
 */
export function useTypeForm(typeId?: string) {
  const { data, isLoading, error } = useGetRequest<TypeForm>({
    url: typeId ? getTypeFormEndpoint(typeId) : ENDPOINTS.type,
    options: { staleTime: DICTIONARY_STALE_TIME, enabled: Boolean(typeId), retry: false },
  })

  return { typeForm: typeId ? data : undefined, isLoading: Boolean(typeId) && isLoading, error }
}
