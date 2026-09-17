import { Switch } from 'antd'
import { FileBadge, KeyRound, Languages, LoaderCircle, Phone } from 'lucide-react'
import { useId, useState, type FormEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { toSelectOptions, useAllCertificateTypes, useLanguages } from '@/entities/dictionary'
import type { Expert } from '@/entities/expert'
import { getApiErrorMessage } from '@/shared/api'
import { formatUzPhone } from '@/shared/lib/phone'
import { Button, FormAlert, MultiSelectField, PasswordField, TextField } from '@/shared/ui'
import { useUpdateExpert } from '../api/edit-expert-api'
import {
  hasErrors,
  toEditExpertData,
  toUpdateExpertBody,
  validateEditExpert,
  type EditExpertData,
  type EditExpertErrors,
} from '../model/edit-expert'

type EditExpertFormProps = {
  expert: Expert
  onCancel: () => void
  onSaved: (expert: Expert) => void
}

/** Ekspert telefoni, paroli, faolligi, tillari va turlarini tahrirlash (PNFL va pasport o'zgarmaydi). */
export function EditExpertForm({ expert, onCancel, onSaved }: EditExpertFormProps) {
  const { t } = useTranslation()
  const activeLabelId = useId()
  const { updateExpert, isPending } = useUpdateExpert(expert.id)
  const { languages, isLoading: isLanguagesLoading } = useLanguages()
  const { types, isLoading: isTypesLoading } = useAllCertificateTypes()
  const [values, setValues] = useState(() => toEditExpertData(expert))
  const [errors, setErrors] = useState<EditExpertErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const updateField = <K extends keyof EditExpertData>(field: K, value: EditExpertData[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setApiError(null)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const nextErrors = validateEditExpert(values)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setApiError(null)
    try {
      onSaved(await updateExpert(toUpdateExpertBody(values)))
    } catch (error) {
      setApiError(getApiErrorMessage(error, t('dashboard.experts.edit.errors.apiFallback')))
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <TextField
        label={t('dashboard.experts.create.phone')}
        icon={Phone}
        error={errors.phone && t(errors.phone)}
        type="tel"
        inputMode="tel"
        placeholder="+998 90 123 45 67"
        autoComplete="off"
        value={values.phone}
        onChange={(event) => updateField('phone', formatUzPhone(event.target.value))}
      />
      <PasswordField
        label={t('dashboard.experts.edit.password')}
        icon={KeyRound}
        hint={t('dashboard.experts.edit.passwordHint')}
        error={errors.password && t(errors.password)}
        placeholder="••••••••"
        autoComplete="new-password"
        value={values.password}
        onChange={(event) => updateField('password', event.target.value)}
      />
      <MultiSelectField
        label={t('dashboard.experts.create.languages')}
        icon={Languages}
        placeholder={t('dashboard.experts.create.selectPlaceholder')}
        options={toSelectOptions(languages)}
        loading={isLanguagesLoading}
        value={values.languageIds}
        onChange={(next) => updateField('languageIds', next)}
      />
      <MultiSelectField
        label={t('dashboard.experts.create.types')}
        icon={FileBadge}
        placeholder={t('dashboard.experts.create.selectPlaceholder')}
        options={toSelectOptions(types)}
        loading={isTypesLoading}
        value={values.typeIds}
        onChange={(next) => updateField('typeIds', next)}
      />

      <div className="border-line flex items-start justify-between gap-4 rounded-xl border px-4 py-3.5">
        <div className="min-w-0">
          <p id={activeLabelId} className="text-heading text-[14px] font-semibold">
            {t('dashboard.experts.edit.isActive')}
          </p>
          <p className="text-neutral mt-0.5 text-[12px] leading-normal">
            {t('dashboard.experts.edit.isActiveHint')}
          </p>
        </div>
        <Switch
          aria-labelledby={activeLabelId}
          checked={values.isActive}
          onChange={(checked) => updateField('isActive', checked)}
          className="mt-0.5 shrink-0"
        />
      </div>

      {apiError && <FormAlert>{apiError}</FormAlert>}

      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="soft"
          disabled={isPending}
          onClick={onCancel}
          className="flex-1"
        >
          {t('dashboard.experts.create.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending && (
            <LoaderCircle className="size-4 shrink-0 animate-spin" strokeWidth={2.4} aria-hidden="true" />
          )}
          {t('dashboard.experts.edit.submit')}
        </Button>
      </div>
    </form>
  )
}
