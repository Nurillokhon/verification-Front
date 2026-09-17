import { useTranslation } from 'react-i18next'
import { generatePath, useParams } from 'react-router'
import { getExpertName, parseExpertId, useExpert } from '@/entities/expert'
import { getHttpStatus } from '@/shared/api'
import { ROUTES } from '@/shared/config'
import { formatUzPhone } from '@/shared/lib/phone'
import { CertificatesSkeleton } from './certificates/certificates-states'
import { DashboardPageHeader } from './dashboard-page-header'
import { ExpertCertificatesPanel } from './expert-detail/expert-certificates-panel'
import { ExpertProfileCard } from './expert-detail/expert-profile-card'
import { LoadErrorState } from './load-error-state'

export function DashboardExpertDetailPage() {
  const { t } = useTranslation()
  const expertId = parseExpertId(useParams().id)
  const { expert, isLoading, isError, error, refetch } = useExpert(expertId)
  const back = { to: ROUTES.experts, label: t('dashboard.experts.detail.back') }

  if (expert) {
    const getDetailPath = (id: number) =>
      generatePath(ROUTES.expertCertificate, { expertId: String(expert.id), id: String(id) })

    return (
      <div className="mx-auto max-w-7xl">
        <DashboardPageHeader
          title={getExpertName({ ...expert, phone: formatUzPhone(expert.phone) })}
          back={back}
        />

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6">
            <ExpertProfileCard expert={expert} />
          </aside>

          <section className="min-w-0">
            <h2 className="text-heading mb-4 text-[18px] font-bold">
              {t('dashboard.experts.detail.certificatesTitle')}
            </h2>
            <ExpertCertificatesPanel expertId={expert.id} getDetailPath={getDetailPath} />
          </section>
        </div>
      </div>
    )
  }

  const renderState = () => {
    if (expertId !== null && isLoading) return <CertificatesSkeleton />

    if (isError && getHttpStatus(error) !== 404) {
      return (
        <LoadErrorState
          title={t('dashboard.experts.loadError.title')}
          text={t('dashboard.experts.loadError.text')}
          retry={{ label: t('dashboard.experts.loadError.retry'), onRetry: () => refetch() }}
        />
      )
    }

    return (
      <LoadErrorState
        title={t('dashboard.experts.detail.notFound.title')}
        text={t('dashboard.experts.detail.notFound.text')}
      />
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <DashboardPageHeader title={t('dashboard.experts.detail.fallbackTitle')} back={back} />
      <div className="mt-8">{renderState()}</div>
    </div>
  )
}
