import { cn } from '@/shared/lib/cn'

// Logotip (public/mark.svg) bilan bir xil to'r: har bir katak 10 birlik, blok esa
// 9 birlik — bloklar orasida 1 birlik tirqish qoladi. Naqsh shu sabab logotipning
// kattalashtirilgan davomidek ko'rinadi, alohida bezakdek emas.
const CELL = 10
const BLOCK = 9
const INSET = (CELL - BLOCK) / 2

// Xarita belgilari → to'ldirish shaffofligi. Rang emas, aynan shaffoflik:
// blok ostidagi fon (gradient, karta rangi) ko'rinib turadi va naqsh ikkala
// mavzuda ham fonga "singib" turadi.
const FILL_OPACITY: Record<string, number> = { '1': 0.06, '2': 0.11, '3': 0.18 }
const ACCENT_OPACITY = 0.45
const OUTLINE_OPACITY = 0.22

type BlockPatternProps = {
  /**
   * Naqsh xaritasi — har bir satr bitta qator, har bir belgi bitta katak:
   * `.` bo'sh · `1` `2` `3` to'ldirilgan blok (ochdan to'qqa) ·
   * `o` faqat konturi · `b` ko'k aksent bloki (logotipdagi kabi — bitta bo'lsin).
   */
  rows: readonly string[]
  /** Kenglikni shu yerdan bering (masalan `w-60`) — balandlik nisbat bo'yicha. */
  className?: string
}

/**
 * Brend bloklaridan yig'ilgan dekorativ fon naqshi. Faqat bezak — skrinriderdan
 * yashirilgan va sichqoncha hodisalarini ushlamaydi. Joylashuvni (absolute,
 * burchak) chaqiruvchi `className` orqali beradi.
 */
export function BlockPattern({ rows, className }: BlockPatternProps) {
  const cols = Math.max(...rows.map((row) => row.length))

  return (
    <svg
      viewBox={`0 0 ${cols * CELL} ${rows.length * CELL}`}
      aria-hidden="true"
      className={cn('text-primary pointer-events-none h-auto select-none', className)}
    >
      {rows.flatMap((row, rowIndex) =>
        [...row].map((symbol, colIndex) => {
          if (symbol === '.') return null

          const rect = {
            x: colIndex * CELL + INSET,
            y: rowIndex * CELL + INSET,
            width: BLOCK,
            height: BLOCK,
          }
          const key = `${colIndex}-${rowIndex}`

          if (symbol === 'o') {
            return (
              <rect
                key={key}
                {...rect}
                fill="none"
                stroke="currentColor"
                strokeOpacity={OUTLINE_OPACITY}
                // Kontur naqsh o'lchamidan qat'i nazar doim 1px bo'lib qoladi
                vectorEffect="non-scaling-stroke"
              />
            )
          }

          if (symbol === 'b') {
            return <rect key={key} {...rect} className="fill-secondary" fillOpacity={ACCENT_OPACITY} />
          }

          return <rect key={key} {...rect} fill="currentColor" fillOpacity={FILL_OPACITY[symbol]} />
        }),
      )}
    </svg>
  )
}
