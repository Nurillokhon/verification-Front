// GET /main/verify/<key>/ javobi (backend: apps/certificates/api/verify.py).
// `invalid` holatida holder, certificate va pdf_url — null: tasdiq olib
// tashlangan ma'lumotnoma bo'yicha shaxsiy ma'lumot ko'rsatilmaydi.

export type VerifyStatus = 'valid' | 'expired' | 'invalid'

export type VerifySection = {
  name: string
  score: string
  cefr: string | null
}

export type VerifyResponse = {
  status: VerifyStatus
  reference: {
    number: string
    code: string
    issued_on: string | null
  }
  holder: {
    full_name: string
    // Server tomonida yashirilgan: 3120********23, AD ****548
    pnfl: string
    passport: string
  } | null
  certificate: {
    type: string
    language: string
    number: string
    issue_date: string | null
    expiration_date: string | null
    // null — tur umumiy natija bermaydi (masalan TKT)
    overall: { label: string; value: string; cefr: string | null } | null
    sections: VerifySection[]
  } | null
  pdf_url: string | null
}
