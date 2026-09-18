import { useGetRequest } from '@/shared/api'
import type { AdminStatistics } from '../model/types'

const ADMIN_STATISTICS_ENDPOINT = '/main/admin-statistics/'

export function useAdminStatistics() {
  const { data, isLoading, isFetching, isError, refetch } = useGetRequest<AdminStatistics>({
    url: ADMIN_STATISTICS_ENDPOINT,
  })

  return { statistics: data, isLoading, isFetching, isError, refetch }
}
