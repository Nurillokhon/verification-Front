import { useTranslation } from 'react-i18next'

const AVATARS = [
  { initials: 'AK', tone: 'bg-primary' },
  { initials: 'MR', tone: 'bg-secondary' },
  { initials: 'NS', tone: 'bg-neutral' },
]

// Foydalanuvchilar soni — "10,000" ko'rinishida (ming ajratkichi bilan)
// oldindan formatlab beramiz, chunki loyihada i18next number-formatting
// sozlanmagan va {{count}} xom raqam sifatida chiqib ketardi.
const TRUST_USER_COUNT = (10_000).toLocaleString('en-US')

export function TrustBadge() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {AVATARS.map(({ initials, tone }) => (
          <span
            key={initials}
            aria-hidden="true"
            // text-white emas — text-on-primary: dark rejimda bg-primary
            // ochroq bo'lib qolgani uchun bu token avtomatik mos matn
            // rangiga (deyarli qora) o'zgaradi, boshqa ikki tonda (secondary,
            // neutral) esa oq bilan bir xil yoki undan yaxshiroq kontrast beradi.
            className={`${tone} ring-surface text-on-primary flex size-8 items-center justify-center rounded-full text-micro font-semibold ring-2`}
          >
            {initials}
          </span>
        ))}
      </div>
      <p className="text-body text-copy">{t('hero.trustBadge', { count: TRUST_USER_COUNT })}</p>
    </div>
  )
}
