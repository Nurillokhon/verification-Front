import type { ParseKeys } from 'i18next'

export { i18n } from './i18n'

/**
 * t() qabul qiladigan kalitlar (uz.json tuzilishidan olinadi). Kalitni ma'lumot
 * sifatida saqlaydigan joylarda — masalan, konfiguratsiya jadvallarida — `string`
 * o'rniga shu tip ishlatiladi, shunda noto'g'ri kalit compile-time'da ushlanadi.
 */
export type TranslationKey = ParseKeys

// i18next.d.ts global modul kengaytmasi sifatida ishlaydi (declare module 'i18next'),
// tsconfig "include": ["src"] orqali avtomatik dasturga qo'shiladi — bu yerda qayta eksport shart emas.
