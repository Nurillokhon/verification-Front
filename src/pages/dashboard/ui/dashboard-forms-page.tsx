import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { DictionaryAdminPanel } from '@/features/dictionary-admin'
import { DashboardPageHeader } from './dashboard-page-header'
import { FormPreviewPanel } from './forms/form-preview-panel'
import {
  FORMS_TAB_PARAM,
  getTabId,
  getTabPanelId,
  toFormsTab,
  type FormsTab,
} from './forms/forms-tab'
import { FormsTabs } from './forms/forms-tabs'

/**
 * Admin sahifasi: lug'atlar (formalar nimalardan tuziladi) va tanlangan
 * sertifikat turi formasining nomzod ko'radigan ko'rinishi.
 */
export function DashboardFormsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = toFormsTab(searchParams.get(FORMS_TAB_PARAM))

  const changeTab = (tab: FormsTab) => {
    // replace: tab almashish brauzer tarixini to'ldirmasin
    setSearchParams({ [FORMS_TAB_PARAM]: tab }, { replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl">
      <DashboardPageHeader
        title={t('dashboard.pages.forms.title')}
        subtitle={t('dashboard.forms.subtitle')}
      />

      <div className="mt-8">
        <FormsTabs activeTab={activeTab} onChange={changeTab} />
      </div>

      <div
        role="tabpanel"
        id={getTabPanelId(activeTab)}
        aria-labelledby={getTabId(activeTab)}
        className="mt-6"
      >
        {activeTab === 'settings' ? <DictionaryAdminPanel /> : <FormPreviewPanel />}
      </div>
    </div>
  )
}
