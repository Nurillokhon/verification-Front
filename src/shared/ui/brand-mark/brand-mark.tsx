import { cn } from '@/shared/lib/cn'

// public/ dagi tayyor SVG variantlari — bir xil belgi, uch xil fon uchun:
// light (oq/yorug' fon), dark (to'q fon), mono (rangli yoki rasm ustidagi
// bir rangli oq belgi).
const MARK_SOURCES = {
  light: '/mark.svg',
  dark: '/mark-on-dark.svg',
  mono: '/mark-mono-white.svg',
} as const

// SVG'ning o'z o'lchami (viewBox 0 0 50 40) — width/height atributlari nisbatni
// oldindan beradi, shunda rasm yuklanguncha layout siljimaydi (CLS).
const MARK_WIDTH = 50
const MARK_HEIGHT = 40

type BrandMarkProps = {
  /**
   * 'auto' — `dark` klassiga qarab light/dark variant o'zi almashadi;
   * 'mono' — har qanday rangli/to'q fon uchun bir rangli oq belgi.
   */
  tone?: 'auto' | 'mono'
  /** O'lchamni shu yerdan bering (masalan `w-8`) — balandlik nisbat bo'yicha. */
  className?: string
}

/**
 * Brend belgisi. Yonida doim brend nomi matn bilan turadi, shuning uchun belgi
 * dekorativ (alt="") — skrinrider brendni ikki marta o'qib bermaydi.
 */
export function BrandMark({ tone = 'auto', className }: BrandMarkProps) {
  const base = 'h-auto shrink-0 select-none'

  if (tone === 'mono') {
    return (
      <img
        src={MARK_SOURCES.mono}
        width={MARK_WIDTH}
        height={MARK_HEIGHT}
        alt=""
        aria-hidden="true"
        className={cn(base, className)}
      />
    )
  }

  // Mavzu useTheme() orqali emas, `dark:` klassi orqali almashtiriladi: `dark`
  // klassi index.html'da React render'idan OLDIN qo'yiladi, shuning uchun to'q
  // rejimda birinchi paint'da ham to'g'ri variant chiziladi (miltillash yo'q).
  return (
    <>
      <img
        src={MARK_SOURCES.light}
        width={MARK_WIDTH}
        height={MARK_HEIGHT}
        alt=""
        aria-hidden="true"
        className={cn(base, 'dark:hidden', className)}
      />
      <img
        src={MARK_SOURCES.dark}
        width={MARK_WIDTH}
        height={MARK_HEIGHT}
        alt=""
        aria-hidden="true"
        className={cn(base, 'hidden dark:block', className)}
      />
    </>
  )
}
