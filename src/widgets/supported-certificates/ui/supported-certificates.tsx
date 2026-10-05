import { ArrowUpRight, BookOpen, Briefcase, Globe, GraduationCap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BlockPattern, Container } from '@/shared/ui'

// Faqat kalitlar/ikonka modul darajasida saqlanadi — matn t() bilan render
// paytida olinadi, shunda til o'zgarganda ro'yxat ham yangilanadi.
const SECONDARY_TYPES = [
  {
    id: 'toefl',
    icon: GraduationCap,
    titleKey: 'supportedCertificates.secondaryTypes.toefl.title',
    textKey: 'supportedCertificates.secondaryTypes.toefl.text',
  },
  {
    id: 'professional',
    icon: Briefcase,
    titleKey: 'supportedCertificates.secondaryTypes.professional.title',
    textKey: 'supportedCertificates.secondaryTypes.professional.text',
  },
] as const

const STATS = [
  {
    id: 'partners',
    valueKey: 'supportedCertificates.stats.partners.value',
    labelKey: 'supportedCertificates.stats.partners.label',
  },
  {
    id: 'support',
    valueKey: 'supportedCertificates.stats.support.value',
    labelKey: 'supportedCertificates.stats.support.label',
  },
  {
    id: 'accuracy',
    valueKey: 'supportedCertificates.stats.accuracy.value',
    labelKey: 'supportedCertificates.stats.accuracy.label',
  },
] as const

// IELTS kartasidagi naqsh logotip shaklini takrorlaydi: bir qadam pastga (ko'k
// blok — burilish nuqtasi), keyin o'ngga-yuqoriga zina. Zinaning oxirgi "bloki"
// — kartaning o'ng yuqori burchagidagi strelka ikonkasi (u 24px to'rning aynan
// bitta katagiga to'g'ri keladi). Belgilar izohi: BlockPattern'ning `rows` prop'ida.
const PATTERN_IELTS = [
  '.........',
  '.........',
  '......3..',
  '...2.2...',
  '....b....',
] as const

export function SupportedCertificates() {
  const { t } = useTranslation()

  return (
    <section className="bg-surface-sky">
      <Container className="py-20 lg:py-28">
        <div className="mx-auto max-w-[62ch] text-center">
          <h2 className="text-heading text-[30px] leading-[1.15] font-extrabold tracking-[-0.02em] sm:text-[36px]">
            {t('supportedCertificates.title')}
          </h2>
          <p className="text-body mx-auto mt-4 max-w-[54ch] text-[15px] leading-[1.7]">
            {t('supportedCertificates.description')}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article className="bg-surface-accent/70 relative isolate flex flex-col justify-between gap-12 overflow-hidden rounded-2xl p-7 sm:col-span-2 sm:gap-16">
            {/* w-54 = 9 katak × 24px: to'r kartaning p-7 chegarasidagi strelka bilan mos tushadi */}
            <BlockPattern rows={PATTERN_IELTS} className="absolute top-0 right-0 -z-10 w-54" />
            <div className="flex items-start justify-between">
              <span className="bg-primary/15 flex size-11 items-center justify-center rounded-xl">
                <Globe className="text-primary size-5" strokeWidth={2.1} aria-hidden="true" />
              </span>
              <ArrowUpRight className="text-heading size-5" strokeWidth={2.2} aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-heading text-[22px] font-bold">{t('supportedCertificates.ielts.title')}</h3>
              <p className="text-body mt-2 max-w-[40ch] text-[14px] leading-[1.65]">
                {t('supportedCertificates.ielts.text')}
              </p>
            </div>
          </article>

          {SECONDARY_TYPES.map(({ id, icon: Icon, titleKey, textKey }) => (
            <article key={id} className="bg-surface-muted rounded-2xl p-7">
              <span className="bg-secondary/12 flex size-11 items-center justify-center rounded-xl">
                <Icon className="text-secondary size-5" strokeWidth={2.1} aria-hidden="true" />
              </span>
              <h3 className="text-heading mt-8 text-[19px] font-bold">{t(titleKey)}</h3>
              <p className="text-body mt-2 text-[13.5px] leading-[1.65]">{t(textKey)}</p>
            </article>
          ))}
        </div>

        <article className="bg-surface shadow-card mt-5 grid items-center gap-10 rounded-2xl p-8 lg:grid-cols-2 lg:p-10">
          <div>
            <span className="bg-primary-soft flex size-11 items-center justify-center rounded-xl">
              <BookOpen className="text-primary size-5" strokeWidth={2.1} aria-hidden="true" />
            </span>
            <h3 className="text-heading mt-7 text-[22px] font-bold">
              {t('supportedCertificates.academicLocal.title')}
            </h3>
            <p className="text-body mt-3 max-w-[44ch] text-[14px] leading-[1.7]">
              {t('supportedCertificates.academicLocal.text')}
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            {STATS.map(({ id, valueKey, labelKey }) => (
              <div key={id} className="bg-surface-muted rounded-xl px-4 py-6 text-center">
                <dt className="sr-only">{t(labelKey)}</dt>
                <dd>
                  <span className="text-heading block text-[24px] font-extrabold tracking-tight">
                    {t(valueKey)}
                  </span>
                  <span className="text-neutral mt-1.5 block text-[9.5px] font-bold tracking-[0.07em] whitespace-nowrap uppercase">
                    {t(labelKey)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </article>
      </Container>
    </section>
  )
}
