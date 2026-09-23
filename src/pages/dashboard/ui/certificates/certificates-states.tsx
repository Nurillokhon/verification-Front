import { FilePlus2, FileText, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ROUTES } from '@/shared/config'
import { buttonVariants, EmptyState } from '@/shared/ui'

/** Sertifikat umuman yo'q (yangi ariza taklif qilinadi) yoki qidiruv natija bermagan holat. */
export function CertificatesEmptyState({ hasQuery }: { hasQuery: boolean }) {
  const { t } = useTranslation()

  return (
    <EmptyState
      icon={hasQuery ? SearchX : FileText}
      title={t(
        hasQuery ? 'dashboard.certificates.noResults.title' : 'dashboard.certificates.empty.title',
      )}
      text={t(
        hasQuery ? 'dashboard.certificates.noResults.text' : 'dashboard.certificates.empty.text',
      )}
      action={
        hasQuery ? undefined : (
          <Link to={ROUTES.newApplication} className={buttonVariants()}>
            <FilePlus2 className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
            {t('dashboard.certificates.newApplication')}
          </Link>
        )
      }
    />
  )
}
