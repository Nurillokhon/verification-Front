import { FileText, Settings2, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { getTabId, getTabPanelId, type FormsTab } from './forms-tab'

const TABS: ReadonlyArray<{ id: FormsTab; icon: LucideIcon }> = [
  { id: 'settings', icon: Settings2 },
  { id: 'preview', icon: FileText },
]

type FormsTabsProps = {
  activeTab: FormsTab
  onChange: (tab: FormsTab) => void
}

export function FormsTabs({ activeTab, onChange }: FormsTabsProps) {
  const { t } = useTranslation()

  return (
    <div
      role="tablist"
      aria-label={t('dashboard.forms.tabs.label')}
      className="border-line flex overflow-x-auto border-b"
    >
      {TABS.map(({ id, icon: Icon }) => {
        const isActive = id === activeTab

        return (
          <button
            key={id}
            type="button"
            role="tab"
            id={getTabId(id)}
            aria-selected={isActive}
            aria-controls={getTabPanelId(id)}
            onClick={() => onChange(id)}
            className={cn(
              '-mb-px flex shrink-0 items-center gap-2.5 border-b-2 px-4 py-4 text-[15px] font-semibold whitespace-nowrap transition-colors sm:px-5 sm:text-[16px]',
              isActive
                ? 'border-primary text-primary'
                : 'text-body hover:text-heading border-transparent',
            )}
          >
            <Icon className="size-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            {t(`dashboard.forms.tabs.${id}`)}
          </button>
        )
      })}
    </div>
  )
}
