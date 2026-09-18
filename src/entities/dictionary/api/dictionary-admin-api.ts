import { keepPreviousData, useQueryClient } from '@tanstack/react-query'
import { useGetRequest, useMutateRequest, type Paginated } from '@/shared/api'
import type { SectionAdmin } from '../model/admin-types'

/**
 * Lug'atlarni boshqarish endpointlari. Ochiq `/dictionary/<name>/` ro'yxatlaridan
 * farqi: bu yerda sahifalash, `is_active` va yozish amallari bor.
 */
const ADMIN_ENDPOINTS = {
  degrees: '/dictionary/admin/degrees/',
  languages: '/dictionary/admin/languages/',
  sections: '/dictionary/admin/sections/',
  types: '/dictionary/admin/types/',
  smsMessages: '/dictionary/admin/sms-messages/',
  statuses: '/dictionary/admin/statuses/',
} as const

export type DictionaryResource = keyof typeof ADMIN_ENDPOINTS

export const DICTIONARY_RESOURCES = Object.keys(ADMIN_ENDPOINTS) as DictionaryResource[]

export const DICTIONARY_PAGE_SIZE = 20

const EMPTY_SECTIONS: SectionAdmin[] = []

function getItemUrl(resource: DictionaryResource, id: number) {
  return `${ADMIN_ENDPOINTS[resource]}${id}/`
}

type ListArgs = {
  search: string
  page: number
}

/**
 * Bitta lug'at sahifasi. Sahifa almashganda eski ro'yxat ekranda qoladi
 * (`keepPreviousData`) — jadval har safar skeletonga tushib ketmasin.
 */
export function useDictionaryList<T>(resource: DictionaryResource, { search, page }: ListArgs) {
  const { data, isLoading, isFetching, isError, refetch } = useGetRequest<Paginated<T>>({
    url: ADMIN_ENDPOINTS[resource],
    params: { search: search || undefined, page, page_size: DICTIONARY_PAGE_SIZE },
    options: { placeholderData: keepPreviousData },
  })

  return {
    items: data?.results,
    count: data?.count ?? 0,
    isLoading,
    isFetching,
    isError,
    refetch,
  }
}

/**
 * Yaratish / tahrirlash / yashirish. Har bir amaldan keyin barcha lug'at
 * so'rovlari eskiradi: admin ro'yxati ham, formalar ishlatadigan ochiq
 * `/dictionary/...` ro'yxatlari ham — o'zgargan nom hamma joyda yangilansin.
 */
export function useDictionaryMutations(resource: DictionaryResource) {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutateRequest()

  const invalidateDictionaries = () =>
    queryClient.invalidateQueries({
      predicate: (query) => {
        const [url] = query.queryKey
        return typeof url === 'string' && url.startsWith('/dictionary/')
      },
    })

  const run = async (variables: Parameters<typeof mutateAsync>[0]) => {
    await mutateAsync(variables)
    await invalidateDictionaries()
  }

  return {
    createItem: (data: unknown) =>
      run({ url: ADMIN_ENDPOINTS[resource], method: 'POST', data }),
    updateItem: (id: number, data: unknown) =>
      run({ url: getItemUrl(resource, id), method: 'PATCH', data }),
    /** Backend yozuvni o'chirmaydi, `is_active: false` qilib yashiradi. */
    hideItem: (id: number) => run({ url: getItemUrl(resource, id), method: 'DELETE' }),
    isPending,
  }
}

// Tur formasi quruvchisida bo'lim tanlanadi — select ichida sahifalash kerak emas
const ALL_SECTIONS_PARAMS = { is_active: true, page_size: 1000 }

/** Faol bo'limlar to'liq ro'yxati — tur formasiga ball maydoni qo'shish uchun. */
export function useActiveSections() {
  const { data, isLoading } = useGetRequest<Paginated<SectionAdmin>>({
    url: ADMIN_ENDPOINTS.sections,
    params: ALL_SECTIONS_PARAMS,
  })

  return { sections: data?.results ?? EMPTY_SECTIONS, isLoading }
}
