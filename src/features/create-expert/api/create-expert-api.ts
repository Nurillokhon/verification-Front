import { useQueryClient } from '@tanstack/react-query'
import { EXPERT_STATISTICS_ENDPOINT } from '@/entities/expert'
import { useMutateRequest } from '@/shared/api'

const EXPERTS_ENDPOINT = '/account/experts/'

/** swagger: ExpertCreate */
export type CreateExpertBody = {
  /** "+998901234567" — bo'shliqsiz */
  phone: string
  /** 14 xonali JShShIR */
  pnfl: number
  /** "AA1234567" */
  passport: string
  password: string
  language_ids: number[]
  type_ids: number[]
}

export function useCreateExpert() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutateRequest<unknown, CreateExpertBody>({
    // Ekspertlar sahifasi ro'yxatni statistika endpointidan oladi — yangi ekspert darhol ko'rinsin
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [EXPERT_STATISTICS_ENDPOINT] }),
        queryClient.invalidateQueries({ queryKey: [EXPERTS_ENDPOINT] }),
      ]),
  })

  const createExpert = (data: CreateExpertBody) =>
    mutateAsync({ url: EXPERTS_ENDPOINT, method: 'POST', data })

  return { createExpert, isPending }
}
