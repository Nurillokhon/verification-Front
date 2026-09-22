import { useTranslation } from 'react-i18next'
import { BrandMark, BrandWordmark } from '@/shared/ui'

/** Sidebar tepasidagi brend bloki — SiteHeader'dagi logotip bilan bir xil qoida: tarjima qilinmaydi. */
export function SidebarBrand() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2.5 px-1">
      <BrandMark className="w-8" />
      <BrandWordmark size="md" />
      <span className="bg-primary-soft text-primary rounded-md px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide">
        {t('dashboard.brand.badge')}
      </span>
    </div>
  )
}
