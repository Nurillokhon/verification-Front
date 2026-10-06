import { BadgeCheck, History } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { ROUTES } from '@/shared/config'
import { BlockPattern, buttonVariants, Container } from '@/shared/ui'
import { CertificatePreview } from './certificate-preview'
import { TrustBadge } from './trust-badge'

// Faqat kalitlar/ikonka modul darajasida saqlanadi — matnning o'zi t() bilan
// render paytida olinadi, shunda til o'zgarganda yangilanib turadi.
const STATS = [
  { id: 'status', icon: BadgeCheck, labelKey: 'hero.stats.status.label', valueKey: 'hero.stats.status.value' },
  { id: 'time', icon: History, labelKey: 'hero.stats.time.label', valueKey: 'hero.stats.time.value' },
] as const

// Fon naqshlari — logotipdagi "pastga bir qadam, keyin yuqoriga zina" shaklining
// kattalashtirilgan davomi. Diagonallar o'ngga ko'tariladi (logotip bilan bir
// yo'nalish) va burchakdan uzoqlashgan sari ochlashib, "erib" ketadi.
// Belgilar izohi: BlockPattern'ning `rows` prop'ida.
const PATTERN_TOP_RIGHT = [
  '....o....2...3',
  '......1.2...3.',
  '.......b...3..',
  '..........3..2',
  '.......1.2..2.',
  '........2..2..',
  '........1.1..1',
  '...o.....1..1.',
  '...........o..',
] as const

const PATTERN_BOTTOM_LEFT = [
  '....1...',
  '...1....',
  '2.2...1.',
  '.3...1.o',
  '....1...',
] as const

export function Hero() {
  const { t, i18n } = useTranslation()

  return (
    // Xom hex gradient o'rniga CSS o'zgaruvchilari: shu 3 pog'ona surface
    // token'i orqali beriladi, shunda dark rejimda gradient ham to'g'ri o'zgaradi.
    <section className="relative overflow-hidden bg-[radial-gradient(120%_110%_at_88%_15%,var(--color-surface-muted)_0%,var(--color-surface-sky)_46%,var(--color-surface)_100%)]">
      {/* Naqshlar Container'dan OLDIN turadi va Container `relative` — shunda
          matn va panel doim naqsh ustida chiziladi. Tor ekranda naqsh ikki
          baravar kichrayadi, pastki-chap bo'lagi esa sarlavha ostiga tushib
          qolmasligi uchun faqat lg'dan boshlab ko'rinadi. */}
      <BlockPattern rows={PATTERN_TOP_RIGHT} className="absolute top-0 right-0 w-49 lg:w-98" />
      <BlockPattern
        rows={PATTERN_BOTTOM_LEFT}
        className="absolute bottom-0 left-0 w-56 max-lg:hidden"
      />
      {/* xl'da chap ustun biroz kengroq: 60px sarlavhaning birinchi qatori
          ("Ishonchli sertifikat") teng ikki ustunga sig'maydi va uch qatorga sinadi. */}
      <Container className="relative grid items-center gap-14 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24 xl:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="text-heading text-display max-w-[16ch]">
            {/* uz/ru so'z tartibi farq qilgani uchun <Trans> ishlatiladi (prefix/suffix bo'lishdan afzal) */}
            {/* t va i18n aniq prop sifatida uzatiladi: React Compiler statik i18nKey/components */}
            {/* props'iga qarab elementni memoizatsiya qilib qo'yishi mumkin, shunda til */}
            {/* o'zgarganda <Trans> qayta render bo'lmay qoladi. t/i18n har chaqiriqda yangi */}
            {/* reference olib, bu memoizatsiyani bekor qiladi va til almashganda h1 yangilanadi. */}
            <Trans
              t={t}
              i18n={i18n}
              i18nKey="hero.title.full"
              components={{ highlight: <span className="text-primary" /> }}
            />
          </h1>

          <p className="text-body text-lead mt-6 max-w-[46ch]">
            {t('hero.subtitle')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link to={ROUTES.register} className={buttonVariants()}>
              {t('hero.ctaPrimary')}
            </Link>
            <Link to={ROUTES.login} className={buttonVariants({ variant: 'soft' })}>
              {t('hero.ctaSecondary')}
            </Link>
          </div>

          <div className="mt-10">
            <TrustBadge />
          </div>
        </div>

        <div className="bg-surface shadow-panel rounded-2xl p-4 sm:p-5">
          <CertificatePreview />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {STATS.map(({ id, icon: Icon, labelKey, valueKey }) => (
              <div key={id} className="bg-surface-muted rounded-xl px-5 py-4">
                <Icon className="text-primary size-5" strokeWidth={2.2} aria-hidden="true" />
                <p className="text-neutral text-caption mt-3">
                  {t(labelKey)}
                </p>
                <p className="text-heading text-subtitle mt-0.5">{t(valueKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
