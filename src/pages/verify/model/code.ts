// Ma'lumotnomadagi QR ostidagi kod: 8 belgi, qog'ozda "7K3M-9QX2" ko'rinishida.
// Alifboda adashtiriladigan belgilar yo'q (0/O, 1/I/L) — backend'dagi
// REFERENCE_CODE_ALPHABET bilan bir xil.
export const CODE_LENGTH = 8
const CODE_ALPHABET = /[^23456789ABCDEFGHJKMNPQRSTUVWXYZ]/g

/** Kiritilgan matndan faqat kod belgilarini qoldiradi: "7k3m 9qx2" -> "7K3M9QX2". */
export function normalizeCode(value: string) {
  return value.toUpperCase().replace(CODE_ALPHABET, '').slice(0, CODE_LENGTH)
}

/** "7K3M9QX2" -> "7K3M-9QX2" (yozish davomida ham: "7K3M9" -> "7K3M-9"). */
export function formatCode(value: string) {
  const code = normalizeCode(value)
  return code.length > 4 ? `${code.slice(0, 4)}-${code.slice(4)}` : code
}
