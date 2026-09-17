import { CreditCard, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getApiErrorMessage } from '@/shared/api'
import { Button, FormAlert, type ButtonSize, type ButtonVariant } from '@/shared/ui'
import { usePaymentLink } from '../api/payment-api'

type PayButtonProps = {
  certificateId: number
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

/**
 * To'lov tugmasi: havolani `POST /main/payment-create/<id>/` dan oladi va
 * foydalanuvchini tashqi to'lov sahifasiga o'tkazadi. Sertifikatdagi `pay_url`
 * ishlatilmaydi — u 30 kunda eskiradi, bu chaqiruv esa kerak bo'lsa yangisini oladi.
 * To'lovni backend webhook orqali tasdiqlaydi, frontend emas.
 */
export function PayButton({ certificateId, variant, size, className }: PayButtonProps) {
  const { t } = useTranslation()
  const { createPaymentLink, isPending } = usePaymentLink()
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setError(null)
    try {
      const { url } = await createPaymentLink(certificateId)
      if (!url) throw new Error('empty url')
      // Tashqi manzil — router emas, to'liq o'tish
      window.location.href = url
    } catch (caught) {
      setError(getApiErrorMessage(caught, t('dashboard.payment.error')))
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isPending}
        className="w-full disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <LoaderCircle className="size-4 shrink-0 animate-spin" strokeWidth={2.4} aria-hidden="true" />
        ) : (
          <CreditCard className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
        )}
        {t('dashboard.payment.pay')}
      </Button>

      {error && <FormAlert className="mt-3 text-left">{error}</FormAlert>}
    </div>
  )
}
