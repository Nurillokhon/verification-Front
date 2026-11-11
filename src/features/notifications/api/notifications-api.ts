import { useQueryClient } from '@tanstack/react-query'
import { useGetRequest, useMutateRequest, type Paginated } from '@/shared/api'

const LIST_URL = '/main/notifications/'
const COUNT_URL = '/main/notifications/unread-count/'
const READ_ALL_URL = '/main/notifications/read-all/'
const PAGE_SIZE = 20
// Push yo'q — qo'ng'iroqcha yangisini shu oraliqda va sahifaga qaytilganda so'raydi
const POLL_INTERVAL_MS = 60_000

export type NotificationStatus = 'approved' | 'rejected' | 'problem'

/** GET /main/notifications/ qatori */
export type AppNotification = {
  id: number
  /** Ariza o'chirilgan bo'lsa null */
  certificate: number | null
  certificate_number: string
  /** "IELTS" — ariza yoki turi yo'q bo'lsa null */
  certificate_type: string | null
  status: NotificationStatus
  /** Ekspert tanlagan SMS matni, bo'lmasa bo'sh satr */
  message: string
  is_read: boolean
  read_at: string | null
  created_at: string
}

export function useUnreadNotificationCount() {
  return useGetRequest<{ count: number }>({
    url: COUNT_URL,
    options: { refetchInterval: POLL_INTERVAL_MS, refetchOnWindowFocus: true },
  })
}

/** Ro'yxat faqat panel ochiqligida so'raladi. */
export function useNotifications(enabled: boolean) {
  return useGetRequest<Paginated<AppNotification>>({
    url: LIST_URL,
    params: { page_size: PAGE_SIZE },
    options: { enabled },
  })
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient()
  const { mutate, mutateAsync, isPending } = useMutateRequest({
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [LIST_URL] }),
        queryClient.invalidateQueries({ queryKey: [COUNT_URL] }),
      ]),
  })

  const markRead = (id: number) =>
    mutateAsync({ url: `${LIST_URL}${id}/read/`, method: 'POST' })
  const markAllRead = () => mutate({ url: READ_ALL_URL, method: 'POST' })

  return { markRead, markAllRead, isPending }
}
