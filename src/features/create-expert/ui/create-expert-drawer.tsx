import { Drawer, message } from 'antd'
import { FileBadge, IdCard, Languages, LoaderCircle, Lock, Phone, X } from 'lucide-react'
import { useState, type FormEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { toSelectOptions, useAllCertificateTypes, useLanguages } from '@/entities/dictionary'
import { getApiErrorMessage } from '@/shared/api'
import { formatUzPhone } from '@/shared/lib/phone'
import { Button, FormAlert, MultiSelectField, PasswordField, TextField } from '@/shared/ui'
import { useCreateExpert } from '../api/create-expert-api'
import {
  EMPTY_CREATE_EXPERT_DATA,
  hasErrors,
  normalizePassport,
  normalizePnfl,
  toCreateExpertBody,
  validateCreateExpert,
  type CreateExpertData,
  type CreateExpertErrors,
} from '../model/create-expert'

const FORM_ID = 'create-expert-form'
const DRAWER_SIZE = 520

type CreateExpertDrawerProps = {
  open: boolean
  onClose: () => void
}

/** Admin uchun: yangi ekspert yaratish formasi o'ng tomondan ochiladigan panelda. */
export function CreateExpertDrawer({ open, onClose }: CreateExpertDrawerProps) {
  const { t } = useTranslation()
  const [messageApi, messageHolder] = message.useMessage()
  const { createExpert, isPending } = useCreateExpert()

  const handleCreated = () => {
    messageApi.success(t('dashboard.experts.create.success'))
    onClose()
  }

  return (
    <>
      {messageHolder}
      <Drawer
        open={open}
        onClose={isPending ? undefined : onClose}
        size={DRAWER_SIZE}
        // Yopilganda forma holati (parol ham) xotirada qolmasin — keyingi ochilishda toza forma
        destroyOnHidden
        maskClosable={!isPending}
        closable={false}
        title={
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-heading text-[18px] font-extrabold">
                {t('dashboard.experts.create.title')}
              </p>
              <p className="text-body mt-1 text-[13px] font-medium whitespace-normal">
                {t('dashboard.experts.create.subtitle')}
              </p>
            </div>
            <button
              type="button"
              aria-label={t('dashboard.experts.create.cancel')}
              disabled={isPending}
              onClick={onClose}
              className="text-body hover:text-heading hover:bg-surface-muted -mr-2 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="size-5" strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        }
        footer={
          <div className="flex justify-end gap-3 py-2">
            <Button type="button" variant="soft" disabled={isPending} onClick={onClose}>
              {t('dashboard.experts.create.cancel')}
            </Button>
            <Button
              type="submit"
              form={FORM_ID}
              disabled={isPending}
              className="disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending && (
                <LoaderCircle className="size-4 shrink-0 animate-spin" strokeWidth={2.4} aria-hidden="true" />
              )}
              {t('dashboard.experts.create.submit')}
            </Button>
          </div>
        }
      >
        <CreateExpertForm createExpert={createExpert} onCreated={handleCreated} />
      </Drawer>
    </>
  )
}

type CreateExpertFormProps = {
  createExpert: ReturnType<typeof useCreateExpert>['createExpert']
  onCreated: () => void
}

// Alohida komponent: lug'atlar faqat panel ochilganda so'raladi (destroyOnHidden
// tufayli yopiq panel ichidagi hech narsa mount qilinmaydi).
function CreateExpertForm({ createExpert, onCreated }: CreateExpertFormProps) {
  const { t } = useTranslation()
  const { languages, isLoading: isLanguagesLoading } = useLanguages()
  const { types, isLoading: isTypesLoading } = useAllCertificateTypes()
  const [values, setValues] = useState(EMPTY_CREATE_EXPERT_DATA)
  const [errors, setErrors] = useState<CreateExpertErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const updateField = <K extends keyof CreateExpertData>(field: K, value: CreateExpertData[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setApiError(null)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const nextErrors = validateCreateExpert(values)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setApiError(null)
    try {
      await createExpert(toCreateExpertBody(values))
      onCreated()
    } catch (error) {
      setApiError(getApiErrorMessage(error, t('dashboard.experts.create.errors.apiFallback')))
    }
  }

  return (
    <form id={FORM_ID} noValidate onSubmit={handleSubmit} className="space-y-5">
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
      <TextField
        label={t('dashboard.experts.create.pnfl')}
        icon={IdCard}
        hint={t('dashboard.experts.create.pnflHint')}
        error={errors.pnfl && t(errors.pnfl)}
        inputMode="numeric"
        placeholder="12345678901234"
        autoComplete="off"
        value={values.pnfl}
        onChange={(event) => updateField('pnfl', normalizePnfl(event.target.value))}
      />
      <TextField
        label={t('dashboard.experts.create.passport')}
        icon={IdCard}
        error={errors.passport && t(errors.passport)}
        placeholder="AA1234567"
        autoComplete="off"
        value={values.passport}
        onChange={(event) => updateField('passport', normalizePassport(event.target.value))}
      />
      <PasswordField
        label={t('dashboard.experts.create.password')}
        icon={Lock}
        hint={t('dashboard.experts.create.passwordHint')}
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

      {apiError && <FormAlert>{apiError}</FormAlert>}
    </form>
  )
}
