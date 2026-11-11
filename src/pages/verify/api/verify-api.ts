import { useGetRequest, getHttpStatus } from '@/shared/api'
import type { VerifyResponse } from '../model/types'

/**
 * Ochiq endpoint — login kerak emas, backend eskirgan tokenga ham qaramaydi.
 * `key` — QR ichidagi uuid yoki qog'ozdagi 8 belgili kod (chiziqcha bilan ham).
 *
 * 404 (topilmadi) va 429 (daqiqasiga 30 tadan ko'p) qayta so'ralmaydi: javob
 * o'zgarmaydi, takroriy so'rov esa limitni tezroq tugatadi.
 */
export function useReferenceVerification(key: string) {
  return useGetRequest<VerifyResponse>({
    url: `/main/verify/${encodeURIComponent(key)}/`,
    options: {
      enabled: key.length > 0,
      retry: (failureCount, error) => (getHttpStatus(error) ?? 500) >= 500 && failureCount < 1,
    },
  })
}
