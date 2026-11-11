/** @format */

// Ilova marshrutlari — yo'llar bitta joyda saqlanadi, <Link to> va router
// konfiguratsiyasi shu qiymatlardan foydalanadi.
// Yo'llarda rol yo'q: qaysi rol qaysi sahifaga kira olishi router'da
// (app/providers/router-provider.tsx) RequireAuth orqali tekshiriladi.
// Parametrli yo'llar generatePath(ROUTES.certificateDetail, { id }) orqali to'ldiriladi.
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  // Ma'lumotnomani tekshirish (ochiq). QR ichidagi backend manzili /v/<uuid>
  // shu sahifaga yo'naltiradi — yo'l nomini o'zgartirmang.
  verify: "/v",
  verifyResult: "/v/:key",
  dashboard: "/dashboard",
  certificates: "/certificates",
  certificateDetail: "/certificates/:id",
  certificateEdit: "/certificates/:id/edit",
  newApplication: "/applications/new",
  applications: "/applications",
  // "/applications/new" (statik) bu yo'ldan ustun turadi — react-router statik segmentni afzal ko'radi
  applicationDetail: "/applications/:id",
  applicationEdit: "/applications/:id/edit",
  reviews: "/reviews",
  experts: "/experts",
  expertDetail: "/experts/:id",
  expertCertificate: "/experts/:expertId/certificates/:id",
  forms: "/forms",
  analytics: "/analytics",
  profile: "/profile",
} as const;
