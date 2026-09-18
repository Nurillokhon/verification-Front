import { useTranslation } from 'react-i18next'
import { useCurrentUser } from '@/entities/user'
import { AdminDashboard } from './admin-dashboard/admin-dashboard'
import { DashboardPlaceholderPage } from './dashboard-placeholder-page'
import { ExpertDashboard } from './expert-dashboard/expert-dashboard'

// /dashboard ekspert va admin uchun umumiy — har bir rol o'z bosh sahifasini ko'radi
export function DashboardIndexPage() {
  const { t } = useTranslation()
  const { role } = useCurrentUser()

  if (role === 'expert') return <ExpertDashboard />
  if (role === 'admin') return <AdminDashboard />

  return (
    <DashboardPlaceholderPage
      title={t('dashboard.pages.index.title')}
      note={t('dashboard.pages.comingSoon')}
    />
  )
}
