import { keepPreviousData } from '@tanstack/react-query'
import { useGetRequest } from '@/shared/api'
import type { Expert, ExpertCertificate, ExpertStatistics } from '../model/types'

export const EXPERT_STATISTICS_ENDPOINT = '/main/expert-statistics/'
const EXPERTS_ENDPOINT = '/account/experts/'
const EXPERT_CERTIFICATES_ENDPOINT = '/main/expert-certificates/'

export function getExpertEndpoint(id: number) {
  return `${EXPERTS_ENDPOINT}${id}/`
}

const EMPTY_EXPERTS: ExpertStatistics[] = []
const EMPTY_EXPERT_CERTIFICATES: ExpertCertificate[] = []

/** Javob paginatsiyasiz massiv — qidiruv klient tomonida bajariladi. */
export function useExpertStatistics({ enabled = true }: { enabled?: boolean } = {}) {
  const { data, isLoading, isFetching, isError, refetch } = useGetRequest<ExpertStatistics[]>({
    url: EXPERT_STATISTICS_ENDPOINT,
    options: { enabled },
  })

  return {
    experts: Array.isArray(data) ? data : EMPTY_EXPERTS,
    isLoading,
    isFetching,
    isError,
    refetch,
  }
}

/** Bitta ekspert (faqat admin). Ekspert bo'lmagan yoki mavjud bo'lmagan ID — 404. */
export function useExpert(id: number | null) {
  const { data, isLoading, isError, error, refetch } = useGetRequest<Expert>({
    url: getExpertEndpoint(id ?? 0),
    options: { enabled: id !== null, retry: false },
  })

  return { expert: id === null ? undefined : data, isLoading, isError, error, refetch }
}

type ExpertCertificatesParams = {
  /** Admin uchun majburiy — berilmasa backend 400 qaytaradi */
  expert: number
  /** Faqat sertifikat raqami bo'yicha */
  search?: string
}

/** Ekspert status qo'ygan sertifikatlar. Javob paginatsiyasiz massiv. */
export function useExpertCertificates(params: ExpertCertificatesParams) {
  const { data, isLoading, isFetching, isError, refetch } = useGetRequest<ExpertCertificate[]>({
    url: EXPERT_CERTIFICATES_ENDPOINT,
    params,
    // Qidiruv o'zgarganda jadval bo'shab qolmasin — yangi javob kelguncha eskisi turadi
    options: { placeholderData: keepPreviousData },
  })

  return {
    certificates: Array.isArray(data) ? data : EMPTY_EXPERT_CERTIFICATES,
    isLoading,
    isFetching,
    isError,
    refetch,
  }
}
