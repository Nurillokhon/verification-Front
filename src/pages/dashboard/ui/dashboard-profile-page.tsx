/** @format */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserProfile } from "@/entities/user";
import { ChangePasswordForm } from "@/features/change-password";
import { PanelHeader } from "./profile/panel-header";
import { PersonalDataPanel } from "./profile/personal-data-panel";
import { ProfilePageHeader } from "./profile/profile-page-header";
import { ProfileErrorState, ProfileSkeleton } from "./profile/profile-states";
import { ProfileSummaryCard } from "./profile/profile-summary-card";
import {
  getTabId,
  getTabPanelId,
  type ProfileTab,
} from "./profile/profile-tab";
import { ProfileTabs } from "./profile/profile-tabs";

export function DashboardProfilePage() {
  const { t } = useTranslation();
  const { profile, isLoading, refetch } = useUserProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");

  const renderContent = () => {
    if (isLoading) return <ProfileSkeleton />;
    if (!profile) return <ProfileErrorState onRetry={() => refetch()} />;

    return (
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:gap-8">
        <ProfileSummaryCard profile={profile} />

        <section className="bg-surface shadow-card border-line min-w-0 overflow-hidden rounded-3xl border">
          <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
          <div
            role="tabpanel"
            id={getTabPanelId(activeTab)}
            aria-labelledby={getTabId(activeTab)}
            className="p-5 sm:p-8 lg:p-10"
          >
            {activeTab === "personal" && (
              <PersonalDataPanel profile={profile} />
            )}
            {activeTab === "security" && (
              <>
                <PanelHeader
                  title={t("dashboard.profile.security.title")}
                  subtitle={t("dashboard.profile.security.subtitle")}
                />
                <div className="mt-8">
                  <ChangePasswordForm />
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl">
      <ProfilePageHeader />
      {renderContent()}
    </div>
  );
}
