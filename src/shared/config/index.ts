// Backend: https://api.ilmiymarkaz.uz — endpointlar prefikssiz, root'da turadi
// (masalan /account/login/), hujjatlar esa /swagger/ manzilida.
export const API_URL = import.meta.env.VITE_API_URL ?? 'https://api.ilmiymarkaz.uz'

// JWT juftligi: access 30 daqiqa, refresh 7 kun yashaydi. Access eskirganda
// POST /account/refresh/ orqali yangisi olinadi (shared/api/axios.ts).
export const ACCESS_TOKEN_STORAGE_KEY = 'access_token'
export const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token'

// Joriy foydalanuvchi (role bilan birga) shu kalit ostida saqlanadi — backend
// ishlamasa ham UI darhol ko'rsatish uchun va rol asosidagi dashboard'ni
// dasturchi konsoldan qo'lda sinab ko'rishi uchun.
export const USER_STORAGE_KEY = 'auth_user'

// Qo'llab-quvvatlanadigan tillar. Tartib muhim emas, lekin birinchisi standart bo'lishi shart emas —
// standart til alohida DEFAULT_LANGUAGE orqali belgilanadi.
export const SUPPORTED_LANGUAGES = ['uz', 'ru'] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

// Standart va fallback til
export const DEFAULT_LANGUAGE: Language = 'uz'

export const LANGUAGE_STORAGE_KEY = 'lang'

// Ro'yxat sahifalarining standart sahifa hajmi (sertifikatlar, arizalar,
// ekspertlar). Lug'atlar ro'yxati boshqacha — entities/dictionary'dagi
// DICTIONARY_PAGE_SIZE.
export const LIST_PAGE_SIZE = 10

// Qidiruv maydonida yozish tugaganini kutish vaqti: bundan qisqasi har harfga
// so'rov yuborardi, uzunroq esa sezilarli kechikish beradi.
export const SEARCH_DEBOUNCE_MS = 400

export { ROUTES } from './routes'
