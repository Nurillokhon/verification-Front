import { FileText, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/shared/ui'

/**
 * Tekshiruvga kelgan sertifikatlar ro'yxati bo'sh. Ikkala joyda ishlatiladi:
 * umumiy ro'yxat (ReviewCertificatesList) va bitta ekspert paneli
 * (ExpertCertificatesPanel).
 */
export function ReviewCertificatesEmptyState({ hasQuery }: { hasQuery: boolean }) {
  const { t } = useTranslation()

  return (
    <EmptyState
      icon={hasQuery ? SearchX : FileText}
      title={t(
        hasQuery
          ? 'dashboard.certificates.noResults.title'
          : 'dashboard.reviewCertificates.empty.title',
      )}
      text={t(
        hasQuery
          ? 'dashboard.certificates.noResults.text'
          : 'dashboard.reviewCertificates.empty.text',
      )}
    />
  )
}
