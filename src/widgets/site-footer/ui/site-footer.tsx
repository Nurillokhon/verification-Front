import { Globe, Share2, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ROUTES } from '@/shared/config'
import { BrandMark, BrandWordmark, Container } from '@/shared/ui'

// Faqat kalitlar modul darajasida saqlanadi — matn t() bilan render paytida
// olinadi, shunda til o'zgarganda ro'yxat ham yangilanadi.
// Alohida sahifalari hali yo'q havolalar vaqtincha bosh sahifaga olib boradi —
// sahifa tayyor bo'lgach, shu yerda faqat `to` qiymati almashtiriladi.
const LINK_GROUPS = [
  {
    id: 'platform',
    titleKey: 'footer.linkGroups.platform.title',
    links: [
      { id: 'terms', labelKey: 'footer.linkGroups.platform.links.terms', to: ROUTES.home },
      { id: 'privacy', labelKey: 'footer.linkGroups.platform.links.privacy', to: ROUTES.home },
    ],
  },
  {
    id: 'support',
    titleKey: 'footer.linkGroups.support.title',
    links: [
      {
        id: 'verificationApi',
        labelKey: 'footer.linkGroups.support.links.verificationApi',
        to: ROUTES.home,
      },
      {
        id: 'contactSupport',
        labelKey: 'footer.linkGroups.support.links.contactSupport',
        to: ROUTES.home,
      },
      {
        id: 'institutionalLogin',
        labelKey: 'footer.linkGroups.support.links.institutionalLogin',
        to: ROUTES.login,
      },
    ],
  },
] as const

const META_ICONS = [Share2, Globe, ShieldCheck]

export function SiteFooter() {
  const { t } = useTranslation()

  return (
    <footer className="bg-surface-shell">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark className="w-8" />
              {/* Brend logotipi — tarjima qilinmaydi */}
              <BrandWordmark size="md" />
            </div>
            <p className="text-body mt-3 max-w-[38ch] text-[12.5px] leading-[1.7]">
              {t('footer.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:justify-items-end">
            {LINK_GROUPS.map(({ id, titleKey, links }) => (
              <div key={id}>
                <p className="text-primary text-[11px] font-bold tracking-[0.14em] uppercase">
                  {t(titleKey)}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {links.map(({ id: linkId, labelKey, to }) => (
                    <li key={linkId}>
                      <Link
                        to={to}
                        className="text-body hover:text-primary text-[13px] transition-colors"
                      >
                        {t(labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-line mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <p className="text-neutral text-[12px]">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4">
            {META_ICONS.map((Icon, i) => (
              <Icon
                key={i}
                className="text-neutral size-4"
                strokeWidth={2}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
