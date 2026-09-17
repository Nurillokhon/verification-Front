import { ConfigProvider, theme } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import uzUZ from 'antd/locale/uz_UZ'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import 'dayjs/locale/uz-latn'
import { useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/shared/lib/theme'

// antd tokenlardan hosila ranglarni (hover, active...) o'zi hisoblaydi, shuning
// uchun CSS o'zgaruvchisi emas, theme.css'dagi aniq hex qiymatlar beriladi.
const PALETTE = {
  light: { primary: '#00796a', danger: '#c62828', surface: '#ffffff', text: '#14181f' },
  dark: { primary: '#2dd4bf', danger: '#f87171', surface: '#0f141a', text: '#f3f6f9' },
} as const

/** ant design komponentlarini loyiha mavzusi (light/dark) va tiliga moslaydi. */
export function AntdProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()
  const { i18n } = useTranslation()
  const isRu = i18n.language === 'ru'
  const palette = PALETTE[resolvedTheme]

  useEffect(() => {
    dayjs.locale(isRu ? 'ru' : 'uz-latn')
  }, [isRu])

  return (
    <ConfigProvider
      locale={isRu ? ruRU : uzUZ}
      theme={{
        algorithm: resolvedTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: palette.primary,
          colorError: palette.danger,
          colorBgElevated: palette.surface,
          colorText: palette.text,
          fontFamily: "'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif",
          borderRadius: 12,
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
