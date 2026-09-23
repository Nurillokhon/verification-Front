import { FileQuestionMark } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/shared/ui'

/** Ro'yxat bo'sh: qidiruv natijasizmi yoki lug'at umuman to'ldirilmaganmi — sabab ko'rsatiladi. */
export function DictionaryEmptyState({ hasQuery }: { hasQuery: boolean }) {
  const { t } = useTranslation()

  return (
    <EmptyState
      // Ro'yxat allaqachon kartochka ichida — ichma-ich ramka chiqmasin
      variant="inline"
      icon={FileQuestionMark}
      title={t(hasQuery ? 'dashboard.forms.empty.searchTitle' : 'dashboard.forms.empty.title')}
      text={t(hasQuery ? 'dashboard.forms.empty.searchText' : 'dashboard.forms.empty.text')}
    />
  )
}
