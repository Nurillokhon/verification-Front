import { FileCheck2, PenLine, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import reviewImage from '@/shared/assets/verification-review.png'
import signingImage from '@/shared/assets/verification-signing.png'
import { BlockPattern, Container } from '@/shared/ui'

// Faqat kalitlar/ikonka modul darajasida saqlanadi — matn t() bilan render
// paytida olinadi, shunda til o'zgarganda ro'yxat ham yangilanadi.
const CAPABILITIES = [
  {
    id: 'officialVerification',
    icon: PenLine,
    titleKey: 'verificationSystem.capabilities.officialVerification.title',
    textKey: 'verificationSystem.capabilities.officialVerification.text',
  },
  {
    id: 'fastResults',
    icon: Zap,
    titleKey: 'verificationSystem.capabilities.fastResults.title',
    textKey: 'verificationSystem.capabilities.fastResults.text',
  },
  {
    id: 'legalStatus',
    icon: FileCheck2,
    titleKey: 'verificationSystem.capabilities.legalStatus.title',
    textKey: 'verificationSystem.capabilities.legalStatus.text',
  },
] as const

// Ikki vizual ortidan "chiqib turgan" bloklar — xaritaning ko'p qismi kartalar
// ostida qoladi, faqat chetdagi qator/ustun ko'rinadi. Belgilar izohi:
// BlockPattern'ning `rows` prop'ida.
const PATTERN_BEHIND_TOP_LEFT = [
  '..3..2.',
  '.3..2..',
  'b..2...',
  '..1....',
  '.1.....',
  '1......',
] as const

const PATTERN_BEHIND_BOTTOM_RIGHT = [
  '......1',
  '.......',
  '......2',
  '.....2.',
  '....2.3',
  '.o.3.3.',
] as const

export function VerificationSystem() {
  const { t } = useTranslation()

  return (
    <section className="bg-surface-muted overflow-hidden">
      <Container className="grid gap-14 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div>
          <h2 className="text-heading text-section max-w-[18ch]">
            {t('verificationSystem.title')}
          </h2>
          <p className="text-body text-lead mt-5 max-w-[52ch]">
            {t('verificationSystem.description')}
          </p>

          <ul className="mt-9 space-y-3">
            {CAPABILITIES.map(({ id, icon: Icon, titleKey, textKey }) => (
              <li key={id} className="bg-surface shadow-card flex gap-4 rounded-xl p-5">
                <span className="bg-primary-soft flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="text-primary size-5" strokeWidth={2.1} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-heading text-subtitle">{t(titleKey)}</h3>
                  <p className="text-body text-copy mt-1">{t(textKey)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* isolate + -z-10: naqsh shu o'ram ichida kartalar ORTIDA qoladi, lekin
            bo'lim fonidan pastga tushib ketmaydi. Chiqib turish masofasi (-6 = 24px)
            naqshning bitta katagiga teng — chetda yarim kesilgan blok qolmaydi. */}
        <div className="relative isolate grid grid-cols-2 gap-5 self-center">
          <BlockPattern
            rows={PATTERN_BEHIND_TOP_LEFT}
            className="absolute -top-6 -left-6 -z-10 w-42"
          />
          <BlockPattern
            rows={PATTERN_BEHIND_BOTTOM_RIGHT}
            className="absolute -right-6 -bottom-6 -z-10 w-42"
          />
          <div className="shadow-panel h-65 overflow-hidden rounded-2xl sm:h-75 lg:mt-14">
            {/* object-left: tor kartada kesilganda ham odam va ekran kadrda qoladi */}
            <img
              src={reviewImage}
              alt={t('verificationSystem.visuals.reviewAlt')}
              width={512}
              height={512}
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover object-left"
            />
          </div>
          <div className="shadow-panel h-75 overflow-hidden rounded-2xl sm:h-85">
            <img
              src={signingImage}
              alt={t('verificationSystem.visuals.signingAlt')}
              width={512}
              height={512}
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
