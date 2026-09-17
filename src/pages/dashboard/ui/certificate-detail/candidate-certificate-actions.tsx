import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { generatePath, Link } from 'react-router'
import { canEditCertificate, isCertificatePaid, type CertificateDetail } from '@/entities/certificate'
import { PayButton } from '@/features/certificate-payment'
import { ROUTES } from '@/shared/config'
import { buttonVariants } from '@/shared/ui'

/** Nomzodning o'z sertifikatidagi amallari: tahrirlash va to'lash. */
export function CandidateCertificateActions({ certificate }: { certificate: CertificateDetail }) {
  const { t } = useTranslation()

  return (
    <>
      {canEditCertificate(certificate) && (
        <Link
          to={generatePath(ROUTES.certificateEdit, { id: String(certificate.id) })}
          className={buttonVariants({ variant: 'soft' })}
        >
          <Pencil className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
          {t('dashboard.certificates.detail.edit')}
        </Link>
      )}
      {/* Havola sertifikatdagi pay_url dan emas — u eskirgan bo'lishi mumkin */}
      {!isCertificatePaid(certificate) && <PayButton certificateId={certificate.id} />}
    </>
  )
}
