export type ProfileTab = 'personal' | 'security'

// Tab va panel bir-biriga aria-controls / aria-labelledby orqali bog'lanadi
export const getTabId = (tab: ProfileTab) => `profile-tab-${tab}`
export const getTabPanelId = (tab: ProfileTab) => `profile-panel-${tab}`
