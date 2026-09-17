/**
 * GET /main/expert-statistics/ javobining bitta elementi. Admin barcha
 * ekspertlarni, ekspert faqat o'zini oladi. Sanoqlar notakror sertifikatlar bo'yicha.
 */
export type ExpertStatistics = {
  id: number
  // Swagger misolida ism yo'q — kelmasa UI telefon raqamini ko'rsatadi
  full_name?: string
  phone: string
  pnfl: number | string | null
  passport: string | null
  role: string
  /** Ekspert tekshira oladigan tillar nomlari */
  language: string[]
  /** Ekspert tekshira oladigan sertifikat turlari nomlari */
  type: string[]
  all_certificates: number
  approved_certificates: number
  rejected_certificates: number
  problem_certificates: number
  pending_reviews: number
  /** `all_certificates` ning aliasi */
  total_reviewed: number
}

/** swagger: ExpertRef — ekspertga biriktirilgan til, tur yoki rol */
export type ExpertRef = {
  id: number
  name: string
}

/** GET/PATCH /account/experts/<id>/ javobi (swagger: Expert) */
export type Expert = {
  id: number
  phone: string
  pnfl: number | null
  passport: string
  /** Davlat bazasidagi F.I.Sh. */
  full_name?: string
  role?: ExpertRef
  language: ExpertRef[]
  type: ExpertRef[]
  /** false — ekspert tizimga kira olmaydi */
  is_active: boolean
  created_at: string
  all_certificates: number
  approved_certificates: number
  rejected_certificates: number
  problem_certificates: number
  pending_reviews: number
}

/**
 * GET /main/expert-certificates/ elementi (swagger: ExpertCertificate) — ekspert
 * sertifikatga qo'ygan bitta status yozuvi.
 */
export type ExpertCertificate = {
  id: number
  certificate_number: string
  candidate_full_name: string
  /** Backend maydon nomidagi imlo xatosi ataylab saqlangan */
  certificate_laanguage: string
  certificate_type: string
  /** Sertifikat ID si — detal sahifasiga havola uchun */
  certificate: number | null
  status: string
  sms_message: string
  expert: string
  created_at_str: string
  updated_at_str: string
}
