/** @format */

import { Lock, UserRound, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/cn";
import { getTabId, getTabPanelId, type ProfileTab } from "./profile-tab";

const TABS: ReadonlyArray<{ id: ProfileTab; icon: LucideIcon }> = [
  { id: "personal", icon: UserRound },
  { id: "security", icon: Lock },
];

type ProfileTabsProps = {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
};

export function ProfileTabs({ activeTab, onChange }: ProfileTabsProps) {
  const { t } = useTranslation();

  return (
    <div
      role="tablist"
      aria-label={t("dashboard.profile.tabs.label")}
      className="border-line bg-surface-sky flex overflow-x-auto border-b px-3 sm:px-6"
    >
      {TABS.map(({ id, icon: Icon }) => {
        const isActive = id === activeTab;

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
              "-mb-px flex shrink-0 items-center gap-2.5 border-b-2 px-4 py-5 text-[15px] font-semibold whitespace-nowrap transition-colors sm:px-5 sm:text-[16px]",
              isActive
                ? "border-primary text-primary"
                : "text-body hover:text-heading border-transparent",
            )}
          >
            <Icon
              className="size-4.5 shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            {t(`dashboard.profile.tabs.${id}`)}
          </button>
        );
      })}
    </div>
  );
}
