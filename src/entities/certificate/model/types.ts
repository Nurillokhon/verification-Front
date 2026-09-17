/**
 * Swagger'da bir xil maydon ro'yxat javobida boolean, detal javobida esa string
 * deb berilgan (is_paid, is_edit) — ikkalasi ham qabul qilinadi va
 * parseApiBoolean() orqali o'qiladi.
 */
export type ApiBoolean = boolean | string | null | undefined

/** GET /main/certificates/ elementi (swagger: CertificateList) */
export type CertificateListItem = {
  id: number
  number: string
  candidate: number | null
  exam_date: string | null
  exam_place: string | null
  /** "YYYY-MM-DD" */
  issue_date: string
  expiration_date: string
  is_active: boolean
  is_paid: ApiBoolean
  created_at_str: string
  updated_at_str: string
  full_name: string
  language_name: string
  type_name: string
  degree_name: string
  /** Holat kodi — masalan NEW, PROBLEM */
  status: string
  /** Ekspert izohi (odatda PROBLEM holatida) */
  comment: string
  expert: string
  is_edit: ApiBoolean
}

/** GET /main/certificate/<id>/ (swagger: CertificateRetrive) */
export type CertificateDetail = CertificateListItem & {
  photo: string
  language: number | null
  type: number | null
  degree: number | null
  file: string | null
  pnfl: string
  passport: string
  invoice: string
  amount: string
  pay_url: string
  reference: string
  /** Bo'limlar ballari (swagger: ScoreRead[]); eski javoblarda JSON satr — parseExtraData() orqali o'qiladi */
  extra_data: CertificateScore[] | string | null
  /** Tur formasidagi erkin maydonlar qiymatlari (swagger: DataItemRead[]) */
  data?: CertificateDataItem[] | null
}

/** swagger: ScoreRead */
export type CertificateScore = {
  id: number
  /** Bo'lim NOMI (masalan "Reading"), ID emas */
  section: string | null
  score: string | null
}

/**
 * swagger: DataItemRead — tur formasidagi `custom_fields` qiymati. `label` ariza
 * yuborilgan paytdagi nomi, ya'ni tur formasi keyin o'zgarsa ham eski nom qoladi.
 */
export type CertificateDataItem = {
  key: string
  label: string
  /** text | number | date | select */
  kind: string
  value: unknown
}

/** GET /main/certificate-history/<id>/ elementi (swagger: CertificateHistoty) */
export type CertificateHistoryItem = {
  id: number
  status: string
  sms_message: string
  expert: string
  created_at_str: string
  updated_at_str: string
}

/** `status` filtri sertifikatning oxirgi statusi bo'yicha ishlaydi */
export type CertificateStatusFilter = 'new' | 'problem' | 'approved' | 'rejected'

export type CertificatesParams = {
  search?: string
  page?: number
  page_size?: number
  status?: CertificateStatusFilter
  /** Admin uchun — shu ekspertga tegishli sertifikatlar */
  expert?: number
}
