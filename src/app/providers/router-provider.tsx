/** @format */

import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider as ReactRouterProvider,
  useMatches,
} from "react-router";
import type { UserRole } from "@/entities/user";
import { ROUTES } from "@/shared/config";
import { RequireAuth } from "./require-auth";
import { RouteErrorBoundary } from "./route-error-boundary";
import { RouteFallback } from "./route-fallback";

/**
 * Nomlangan eksportni React.lazy kutadigan `{ default }` shaklga o'giradi.
 *
 * Import yo'llari ataylab to'g'ridan-to'g'ri fayldan olinadi: `@/pages/dashboard`
 * barrel'i dinamik import qilinsa, bundler barreldagi BARCHA sahifani bitta
 * chunk'ga yig'adi — bo'linishdan foyda qolmaydi. Shu sababli bu yagona joyda
 * slice'ning public API'si chetlab o'tiladi.
 */
function lazyPage<Name extends string, Props extends object = Record<never, never>>(
  load: () => Promise<Record<Name, ComponentType<Props>>>,
  name: Name,
) {
  return lazy(async () => ({ default: (await load())[name] }));
}

const HomePage = lazyPage(() => import("@/pages/home/ui/home-page"), "HomePage");
const LoginPage = lazyPage(() => import("@/pages/login/ui/login-page"), "LoginPage");
const RegisterPage = lazyPage(
  () => import("@/pages/register/ui/register-page"),
  "RegisterPage",
);
const NotFoundPage = lazyPage(
  () => import("@/pages/not-found/ui/not-found-page"),
  "NotFoundPage",
);

/**
 * antd (ConfigProvider bilan birga yarim megabaytga yaqin) faqat kabinetda
 * ishlatiladi — ochiq sahifalarda (bosh sahifa, kirish, ro'yxatdan o'tish)
 * bitta ham antd komponenti yo'q. Shuning uchun provider ilova qobig'idan
 * (app.tsx) bu yerga ko'chirildi va lazy yuklanadi: aks holda u entry chunk'ini statik ushlab
 * turardi va sahifalarni bo'lishdan boshlang'ich yuklanishga hech naf bo'lmasdi.
 * Kabinetda antd komponenti qo'shilsa — shu provider ostida bo'lishi shart.
 */
const AntdProvider = lazyPage(() => import("./antd-provider"), "AntdProvider");

// Qobiq ham lazy: u sidebar/topbar orqali @/shared/ui barrel'iga, u esa antd'ga
// bog'langan — statik import qilinsa, ochiq sahifalar uchun ham yuklanardi.
const DashboardLayout = lazyPage(
  () => import("@/widgets/dashboard-layout/ui/dashboard-layout"),
  "DashboardLayout",
);

const DashboardIndexPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-index-page"),
  "DashboardIndexPage",
);
const DashboardCertificatesPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-certificates-page"),
  "DashboardCertificatesPage",
);
const DashboardCertificateDetailPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-certificate-detail-page"),
  "DashboardCertificateDetailPage",
);
const DashboardCertificateEditPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-certificate-edit-page"),
  "DashboardCertificateEditPage",
);
const DashboardNewApplicationPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-new-application-page"),
  "DashboardNewApplicationPage",
);
const DashboardApplicationsPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-applications-page"),
  "DashboardApplicationsPage",
);
const DashboardApplicationDetailPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-application-detail-page"),
  "DashboardApplicationDetailPage",
);
const DashboardApplicationEditPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-application-edit-page"),
  "DashboardApplicationEditPage",
);
const DashboardReviewsPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-reviews-page"),
  "DashboardReviewsPage",
);
const DashboardExpertsPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-experts-page"),
  "DashboardExpertsPage",
);
const DashboardExpertDetailPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-expert-detail-page"),
  "DashboardExpertDetailPage",
);
const DashboardExpertCertificatePage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-expert-certificate-page"),
  "DashboardExpertCertificatePage",
);
const DashboardFormsPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-forms-page"),
  "DashboardFormsPage",
);
const DashboardAnalyticsPage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-analytics-page"),
  "DashboardAnalyticsPage",
);
const DashboardProfilePage = lazyPage(
  () => import("@/pages/dashboard/ui/dashboard-profile-page"),
  "DashboardProfilePage",
);

/**
 * Suspense chegarasi <Outlet /> ustida: chunk kelguncha faqat sahifa o'rni
 * fallback bilan almashadi, qobiq (sidebar/topbar) joyida qoladi.
 *
 * `key` nega kerak: react-router v7 navigatsiyani startTransition ichida
 * bajaradi, transition paytida esa React allaqachon ko'rsatilgan Suspense
 * chegarasini fallback bilan ALMASHTIRMAYDI — kalitsiz foydalanuvchi chunk
 * yuklanguncha eski sahifani, hech qanday belgisiz, "osilib qolgandek" ko'rib
 * turadi. Kalit marshrut id'si (yo'l shabloni), pathname emas: shuning uchun
 * /certificates/1 → /certificates/2 da sahifa behuda qayta mount bo'lmaydi.
 */
function SuspendedOutlet({ fallback }: { fallback: ReactNode }) {
  const matches = useMatches();

  return (
    <Suspense key={matches.at(-1)?.id} fallback={fallback}>
      <Outlet />
    </Suspense>
  );
}

type DashboardRoute = {
  path: string;
  Page: ComponentType;
  /** Berilmasa — kirgan har qanday rol ko'ra oladi (profil). */
  roles?: readonly UserRole[];
};

// Kabinet sahifalari va ularning ruxsatlari bitta jadvalda: tashqi RequireAuth
// faqat kirganlikni tekshiradi, bu yerdagi `roles` esa rolni — ruxsat berilmagan
// rol o'z bosh sahifasiga (entities/user getRoleHomeRoute) qaytariladi.
// Ruxsatlar sidebar menyusi (widgets/dashboard-layout/model/menu.ts) bilan mos
// bo'lishi kerak.
const DASHBOARD_ROUTES: readonly DashboardRoute[] = [
  { path: ROUTES.dashboard, roles: ["expert", "admin"], Page: DashboardIndexPage },
  { path: ROUTES.certificates, roles: ["candidate"], Page: DashboardCertificatesPage },
  {
    path: ROUTES.certificateDetail,
    roles: ["candidate"],
    Page: DashboardCertificateDetailPage,
  },
  { path: ROUTES.certificateEdit, roles: ["candidate"], Page: DashboardCertificateEditPage },
  { path: ROUTES.newApplication, roles: ["candidate"], Page: DashboardNewApplicationPage },
  { path: ROUTES.applications, roles: ["expert", "admin"], Page: DashboardApplicationsPage },
  {
    path: ROUTES.applicationDetail,
    roles: ["expert", "admin"],
    Page: DashboardApplicationDetailPage,
  },
  {
    path: ROUTES.applicationEdit,
    roles: ["expert", "admin"],
    Page: DashboardApplicationEditPage,
  },
  { path: ROUTES.reviews, roles: ["expert", "admin"], Page: DashboardReviewsPage },
  { path: ROUTES.experts, roles: ["admin"], Page: DashboardExpertsPage },
  { path: ROUTES.expertDetail, roles: ["admin"], Page: DashboardExpertDetailPage },
  { path: ROUTES.expertCertificate, roles: ["admin"], Page: DashboardExpertCertificatePage },
  { path: ROUTES.forms, roles: ["admin"], Page: DashboardFormsPage },
  { path: ROUTES.analytics, roles: ["admin"], Page: DashboardAnalyticsPage },
  { path: ROUTES.profile, Page: DashboardProfilePage },
];

const router = createBrowserRouter([
  {
    // Yo'lsiz ildiz: element berilmagani uchun react-router uni <Outlet /> deb
    // render qiladi. Vazifasi — butun daraxt uchun yagona errorElement.
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <SuspendedOutlet fallback={<RouteFallback variant="screen" />} />,
        children: [
          { path: ROUTES.home, element: <HomePage /> },
          { path: ROUTES.login, element: <LoginPage /> },
          { path: ROUTES.register, element: <RegisterPage /> },
          // Statik va parametrli yo'llarning hech biri mos kelmasa — 404.
          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        // Bu yerdagi Suspense qobiqning O'ZIDAN yuqorida: antd chunk'i va
        // sahifa chunk'i parallel yuklanadi, kabinet ichida yurganda esa
        // provider mount bo'lib qolgani uchun qayta kutilmaydi.
        element: (
          <Suspense fallback={<RouteFallback variant="screen" />}>
            <AntdProvider>
              <RequireAuth fallback={<RouteFallback variant="screen" />}>
                <DashboardLayout />
              </RequireAuth>
            </AntdProvider>
          </Suspense>
        ),
        children: [
          {
            element: <SuspendedOutlet fallback={<RouteFallback />} />,
            // errorElement qobiqdan PASTDA: react-router xatoni ushlagan
            // marshrutning o'z element'ini ham almashtiradi, shuning uchun uni
            // DashboardLayout'li marshrutga qo'ysak sidebar/topbar ham yo'qolardi.
            errorElement: <RouteErrorBoundary variant="content" />,
            children: DASHBOARD_ROUTES.map(({ path, roles, Page }) => ({
              path,
              element: (
                <RequireAuth roles={roles}>
                  <Page />
                </RequireAuth>
              ),
            })),
          },
        ],
      },
    ],
  },
]);

export function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}
