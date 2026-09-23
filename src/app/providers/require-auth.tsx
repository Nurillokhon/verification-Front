import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { getRoleHomeRoute, useCurrentUser, type UserRole } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { RouteFallback } from './route-fallback'

type RequireAuthProps = {
  /** Sahifaga kira oladigan rollar. Berilmasa — faqat kirganlik tekshiriladi. */
  roles?: readonly UserRole[]
  /** Profil so'rovi ketayotganda ko'rsatiladigan holat. */
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Rol useCurrentUser'dan olinadi: avval localStorage'dagi foydalanuvchi, token
 * bo'lsa profil so'rovi kelgach — serverdagi rol. Token yo'q, lekin
 * localStorage'da qo'lda yozilgan foydalanuvchi bo'lsa ham kiritiladi — dasturchi
 * rolga qarab dashboard'ni shu yo'l bilan sinab ko'radi (soxta token yozilsa,
 * birinchi so'rovning 401'i axios interceptor orqali /login'ga uloqtirardi).
 */
export function RequireAuth({ roles, fallback, children }: RequireAuthProps) {
  const { role, isLoading } = useCurrentUser()

  if (!role) {
    // Token bor, lekin saqlangan foydalanuvchi yo'q — rol profil so'rovidan
    // kutiladi. Bo'sh ekran emas, lazy sahifalardagi bilan bir xil yuklanish
    // holati ko'rsatiladi.
    if (isLoading) return fallback ?? <RouteFallback />
    return <Navigate to={ROUTES.login} replace />
  }

  // Rolning bosh sahifasi har doim o'sha rolga ochiq, shuning uchun bu
  // yo'naltirish halqaga aylanmaydi
  if (roles && !roles.includes(role)) return <Navigate to={getRoleHomeRoute(role)} replace />

  return children
}
