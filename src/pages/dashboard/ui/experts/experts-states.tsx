import { SearchX, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/shared/ui'

/** Ekspert umuman yo'q yoki qidiruv natija bermagan holat. */
export function ExpertsEmptyState({ hasQuery }: { hasQuery: boolean }) {
  const { t } = useTranslation()

  return (
    <EmptyState
      icon={hasQuery ? SearchX : Users}
      title={t(hasQuery ? 'dashboard.experts.noResults.title' : 'dashboard.experts.empty.title')}
      text={t(hasQuery ? 'dashboard.experts.noResults.text' : 'dashboard.experts.empty.text')}
    />
  )
}
