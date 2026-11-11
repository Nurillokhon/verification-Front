import { KeyRound, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router'
import { ROUTES } from '@/shared/config'
// Barrel antd'ni tortadi — ochiq sahifada komponentlar to'g'ridan-to'g'ri olinadi.
import { Button } from '@/shared/ui/button'
import { TextField } from '@/shared/ui/text-field'
import { CODE_LENGTH, formatCode, normalizeCode } from '../model/code'

/** Qog'ozdagi QR ostidagi 8 belgili kodni qo'lda kiritish. */
export function VerifyCodeForm({ initialCode = '' }: { initialCode?: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [code, setCode] = useState(() => formatCode(initialCode))
  const [error, setError] = useState<string>()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (normalizeCode(code).length !== CODE_LENGTH) {
      setError(t('verify.form.incomplete'))
      return
    }
    navigate(generatePath(ROUTES.verifyResult, { key: formatCode(code) }))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <TextField
        label={t('verify.form.label')}
        icon={KeyRound}
        value={code}
        onChange={(event) => {
          setCode(formatCode(event.target.value))
          setError(undefined)
        }}
        placeholder="7K3M-9QX2"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        inputMode="text"
        maxLength={CODE_LENGTH + 1}
        error={error}
        hint={error ? undefined : t('verify.form.hint')}
        className="flex-1"
        inputClassName="font-mono tracking-[0.2em] uppercase"
      />
      {/* Yorliq balandligicha pastga — tugma input bilan bir qatorda turadi */}
      <Button type="submit" className="h-15 sm:mt-[30px]">
        <Search className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
        {t('verify.form.submit')}
      </Button>
    </form>
  )
}
