import { cn } from '@/shared/lib/cn'

// Logotip yozuvi — ikkala qator ham brendning bir qismi, shuning uchun
// SidebarBrand'dagi `dashboard.brand.subtitle` kabi tarjima qilinmaydi
// (SiteHeader'dagi "SERTIFIKAT" bilan bir xil qoida).
const BRAND_NAME = 'SERTIFIKAT'
const BRAND_TAGLINE = 'ILMIY MARKAZ'

// Tagline harflari orasidagi keng interval tasodifiy emas: u pastki qatorni
// yuqoridagi nom kengligiga yaqinlashtiradi — logotip shu tarzda tekis
// to'rtburchak bo'lib ko'rinadi.
const SIZE_CLASSES = {
  sm: { name: 'text-[15px]', tagline: 'text-[8px] tracking-[0.3em]' },
  md: { name: 'text-[17px]', tagline: 'text-[9px] tracking-[0.28em]' },
  lg: { name: 'text-[22px]', tagline: 'text-[11px] tracking-[0.26em]' },
} as const

type BrandWordmarkProps = {
  size?: keyof typeof SIZE_CLASSES
  className?: string
}

/**
 * Brend yozuvi: qora "SERTIFIKAT" va uning ostida teal rangli "ILMIY MARKAZ".
 * Faqat <span>'lardan iborat — <Link>/<a> ichiga ham qo'yish mumkin.
 */
export function BrandWordmark({ size = 'md', className }: BrandWordmarkProps) {
  const sizes = SIZE_CLASSES[size]

  return (
    <span className={cn('flex flex-col items-start leading-none', className)}>
      <span className={cn('text-heading font-extrabold tracking-tight', sizes.name)}>
        {BRAND_NAME}
      </span>
      <span className={cn('text-primary mt-1 font-semibold', sizes.tagline)}>
        {BRAND_TAGLINE}
      </span>
    </span>
  )
}
