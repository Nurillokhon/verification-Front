import { useMutateRequest } from '@/shared/api'

function getPaymentCreateEndpoint(certificateId: number) {
  return `/main/payment-create/${certificateId}/`
}

/** POST /main/payment-create/<id>/ javobi (swagger: PaymentCreateResponse) */
export type PaymentLink = {
  /** 1 — muvaffaqiyat */
  status: number
  /** true — billingdan yangi invoice olindi; false — mavjud havola qaytarildi */
  is_new: boolean
  invoice: number
  /** Decimal satr, masalan "700000.00" */
  amount: string
  /** To'lov sahifasi — foydalanuvchi shu manzilga yuboriladi */
  url: string
  created_at: string
  /** Invoice shu vaqtdan keyin eskiradi; endpoint qayta chaqirilsa yangisi olinadi */
  expires_at: string
}

/**
 * Ariza uchun to'lov havolasini oladi. Endpoint idempotent: muddati o'tmagan
 * havola bo'lsa o'shanisi qaytadi, eskirgan bo'lsa billingdan yangisi olinadi —
 * shuning uchun tugmani qayta bosish xavfsiz va saqlangan `pay_url` o'rniga
 * har safar shu chaqiruv ishlatiladi.
 */
export function usePaymentLink() {
  const { mutateAsync, isPending } = useMutateRequest<PaymentLink>()

  const createPaymentLink = (certificateId: number) =>
    mutateAsync({ url: getPaymentCreateEndpoint(certificateId), method: 'POST' })

  return { createPaymentLink, isPending }
}
