export const FORMS_TABS = ['settings', 'preview'] as const

export type FormsTab = (typeof FORMS_TABS)[number]

/** Tab URL'da saqlanadi — ikkinchi tabga to'g'ridan-to'g'ri havola berish mumkin bo'lsin. */
export const FORMS_TAB_PARAM = 'tab'

export function toFormsTab(value: string | null): FormsTab {
  const tab = FORMS_TABS.find((item) => item === value)
  return tab ?? 'settings'
}

// Tab va panel bir-biriga aria-controls / aria-labelledby orqali bog'lanadi
export const getTabId = (tab: FormsTab) => `forms-tab-${tab}`
export const getTabPanelId = (tab: FormsTab) => `forms-panel-${tab}`
