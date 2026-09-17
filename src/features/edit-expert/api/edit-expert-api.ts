import { useQueryClient } from '@tanstack/react-query'
import { EXPERT_STATISTICS_ENDPOINT, getExpertEndpoint, type Expert } from '@/entities/expert'
import { useMutateRequest } from '@/shared/api'

/**
 * swagger: ExpertUpdate — faqat yuborilgan maydonlar o'zgaradi. PNFL va pasport
 * shaxsni belgilagani uchun tahrirlanmaydi; tillar va turlar yuborilsa to'liq almashtiriladi.
 */
export type UpdateExpertBody = {
  phone?: string
  /** Yuborilmasa parol o'zgarmaydi */
  password?: string
  is_active?: boolean
  language_ids?: number[]
  type_ids?: number[]
}

export function useUpdateExpert(id: number) {
  const queryClient = useQueryClient()
  const endpoint = getExpertEndpoint(id)
  const { mutateAsync, isPending } = useMutateRequest<Expert, UpdateExpertBody>({
    onSuccess: (expert) => {
      // Javobda yangilangan ekspert keladi — detal sahifasi qayta so'rovsiz yangilanadi
      queryClient.setQueryData([endpoint, undefined], expert)
      return queryClient.invalidateQueries({ queryKey: [EXPERT_STATISTICS_ENDPOINT] })
    },
  })

  const updateExpert = (data: UpdateExpertBody) =>
    mutateAsync({ url: endpoint, method: 'PATCH', data })

  return { updateExpert, isPending }
}
