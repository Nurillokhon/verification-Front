/** @format */

import { Bell, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CurrentUser } from "@/entities/user";
import { LanguageSwitcher, SearchInput, ThemeSwitcher } from "@/shared/ui";
import { UserChip } from "./user-chip";

type TopbarProps = {
  user: CurrentUser | null;
  onOpenSidebar: () => void;
};

/** Yuqori panel: mobil hamburger, qidiruv (hozircha funksiyasiz), til/mavzu almashtirgichlar, bildirishnoma va foydalanuvchi chipi. */
export function Topbar({ user, onOpenSidebar }: TopbarProps) {
  const { t } = useTranslation();

  return (
    <header className="border-line bg-surface sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label={t("dashboard.topbar.openMenu")}
        className="text-heading hover:bg-surface-muted flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors lg:hidden"
      >
        <Menu className="size-5" strokeWidth={2} aria-hidden="true" />
      </button>

      <SearchInput
        variant="subtle"
        className="min-w-0 max-w-md flex-1"
        label={t("dashboard.topbar.searchPlaceholder")}
        placeholder={t("dashboard.topbar.searchPlaceholder")}
      />

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
        <ThemeSwitcher />
        <LanguageSwitcher />
        <button
          type="button"
          aria-label={t("dashboard.topbar.notifications")}
          className="text-heading hover:bg-surface-muted flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors"
        >
          <Bell className="size-4.5" strokeWidth={2} aria-hidden="true" />
        </button>
        <div className="border-line ml-1 border-l pl-2.5 sm:pl-3">
          <UserChip user={user} />
        </div>
      </div>
    </header>
  );
}
