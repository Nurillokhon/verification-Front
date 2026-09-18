/** @format */

import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useLogout } from "@/entities/user";
import { ROUTES } from "@/shared/config";

/** Sidebar pastki bloki: server holati indikatori + tizimdan chiqish tugmasi. */
export function SidebarFooter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useLogout();

  function handleLogout() {
    // useLogout() navigatsiya qilmaydi (u UI qatlamiga tegishli) — shu tufayli
    // logout'dan keyin /login'ga o'tish shu yerda, qo'lda bajariladi.
    logout();
    navigate(ROUTES.login);
  }

  return (
    <div className="border-line mt-auto space-y-3 border-t pt-4">
      <div className="flex items-center gap-2 px-3">
        <span aria-hidden="true" className="bg-primary size-2 rounded-full" />
        <span className="text-neutral text-[12px] font-medium">
          {t("dashboard.footer.serverStatus")}
        </span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="text-danger hover:bg-danger/10 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors"
      >
        <LogOut
          className="size-[18px] shrink-0"
          strokeWidth={2}
          aria-hidden="true"
        />
        {t("dashboard.footer.logout")}
      </button>
    </div>
  );
}
