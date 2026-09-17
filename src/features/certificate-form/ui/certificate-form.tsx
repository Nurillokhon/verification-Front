import {
  ArrowRight,
  Award,
  CalendarDays,
  GraduationCap,
  Hash,
  LoaderCircle,
  MapPin,
} from 'lucide-react'
import { useState, type FormEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  toSelectOptions,
  useCertificateTypes,
  useDefaultLanguage,
  useDegrees,
  useTypeForm,
} from '@/entities/dictionary'
import { getApiErrorMessage } from '@/shared/api'
import {
  Button,
  buttonVariants,
  FileField,
  FormAlert,
  SelectField,
  TextField,
} from '@/shared/ui'
import {
  ACCEPTED_FILE_TYPES,
  hasErrors,
  toCertificateFormData,
  validateCertificateForm,
  type CertificateFieldName,
  type CertificateFormErrors,
  type CertificateFormMode,
  type CertificateFormValues,
} from '../model/certificate-form'
import {
  getCoreRule,
  getCustomErrorKey,
  getCustomFields,
  getScoreErrorKey,
  getScoreFields,
} from '../model/type-form'
import { CustomFields } from './custom-fields'
import { FormSection } from './form-section'
import { ScoreFields } from './score-fields'

type CertificateFormProps = {
  mode: CertificateFormMode
  defaultValues: CertificateFormValues
  /** Tahrirlashda serverdagi joriy fayl havolasi */
  currentFileUrl?: string | null
  submitLabel: string
  cancelTo: string
  isPending: boolean
  /** Xato bo'lsa reject qilishi kerak — xabar forma ostida ko'rsatiladi */
  onSubmit: (data: FormData) => Promise<void>
}

/** Tur formasi kelguncha turga bog'liq maydonlar o'rnida turadigan joy egallovchi. */
function FieldsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2" aria-hidden="true">
      <div className="bg-surface-muted h-[60px] animate-pulse rounded-xl" />
      <div className="bg-surface-muted h-[60px] animate-pulse rounded-xl" />
    </div>
  )
}

/**
 * Sertifikat yaratish va tahrirlash uchun umumiy forma. Tuzilishi tanlangan
 * turga bog'liq: `GET /dictionary/type/<id>/form/` qaysi asosiy maydonlar
 * ko'rsatilishini, qanday ballar va erkin maydonlar so'ralishini aytadi.
 * So'rovni chaqiruvchi wrapper yuboradi.
 */
export function CertificateForm({
  mode,
  defaultValues,
  currentFileUrl,
  submitLabel,
  cancelTo,
  isPending,
  onSubmit,
}: CertificateFormProps) {
  const { t } = useTranslation()
  const [values, setValues] = useState(defaultValues)
  const [errors, setErrors] = useState<CertificateFormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const { language: defaultLanguage, isLoading: isLanguageLoading } = useDefaultLanguage()
  // Til formada tanlanmaydi: tahrirlashda sertifikatning o'z tili saqlanadi,
  // yangi arizada esa lug'atdagi standart til ishlatiladi.
  const languageId = values.language || String(defaultLanguage?.id ?? '')
  const isLanguageMissing = !isLanguageLoading && !languageId

  const { types, isLoading: isTypesLoading } = useCertificateTypes(languageId)
  const { degrees } = useDegrees()
  const { typeForm, isLoading: isTypeFormLoading, error: typeFormError } = useTypeForm(values.type)

  const scoreFields = getScoreFields(typeForm)
  const customFields = getCustomFields(typeForm)
  const degreeRule = getCoreRule(typeForm, 'degree')
  const examDateRule = getCoreRule(typeForm, 'exam_date')
  const examPlaceRule = getCoreRule(typeForm, 'exam_place')

  // Tur almashtirilgan bo'lsa sertifikatdagi ball ID lari yangi bo'limlarga tegishli emas
  const scoreIds = values.type === defaultValues.type ? values.scoreIds : undefined

  const updateField = <K extends CertificateFieldName>(
    field: K,
    value: CertificateFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    // Foydalanuvchi maydonni tuzata boshlashi bilan eski xato yashiriladi
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setApiError(null)
  }

  // Forma tuzilishi turga bog'liq — tur almashsa eski ball va erkin maydon qiymatlari yaroqsiz
  const changeType = (type: string) => {
    setValues((prev) => ({ ...prev, type, scores: {}, custom: {} }))
    setErrors({})
    setApiError(null)
  }

  const updateScore = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, scores: { ...prev.scores, [key]: value } }))
    setErrors((prev) => ({ ...prev, [getScoreErrorKey(key)]: undefined }))
    setApiError(null)
  }

  const updateCustom = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, custom: { ...prev.custom, [key]: value } }))
    setErrors((prev) => ({ ...prev, [getCustomErrorKey(key)]: undefined }))
    setApiError(null)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const submitValues = { ...values, language: languageId }
    const nextErrors = validateCertificateForm(submitValues, typeForm, mode)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setApiError(null)
    try {
      await onSubmit(toCertificateFormData({ values: submitValues, form: typeForm, scoreIds }))
    } catch (error) {
      setApiError(getApiErrorMessage(error, t('dashboard.certificateForm.errors.apiFallback')))
    }
  }

  const getError = (field: CertificateFieldName) => {
    const error = errors[field]
    return error && t(error.key, error.params)
  }

  const selectPlaceholder = t('dashboard.certificateForm.fields.select')

  // Bo'sh ro'yxat sabab ko'rsatiladi, aks holda o'chirilgan select tushuntirishsiz qolardi
  const typeHint =
    languageId && !isTypesLoading && types.length === 0
      ? t('dashboard.certificateForm.fields.typeEmpty')
      : undefined

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <FormSection title={t('dashboard.certificateForm.sections.main')}>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            className="sm:col-span-2"
            label={t('dashboard.certificateForm.fields.number')}
            icon={Hash}
            error={getError('number')}
            placeholder={t('dashboard.certificateForm.fields.numberPlaceholder')}
            autoComplete="off"
            maxLength={255}
            value={values.number}
            onChange={(event) => updateField('number', event.target.value)}
          />
          <SelectField
            label={t('dashboard.certificateForm.fields.type')}
            icon={Award}
            error={getError('type')}
            hint={typeHint}
            placeholder={selectPlaceholder}
            options={toSelectOptions(types)}
            disabled={!languageId}
            value={values.type}
            onChange={(event) => changeType(event.target.value)}
          />
          <TextField
            type="date"
            label={t('dashboard.certificateForm.fields.issueDate')}
            icon={CalendarDays}
            error={getError('issueDate')}
            value={values.issueDate}
            onChange={(event) => updateField('issueDate', event.target.value)}
          />

          {/* Quyidagi maydonlarni tur formasi yoqadi yoki o'chiradi; yorliqni ham backend beradi */}
          {degreeRule.enabled && (
            <SelectField
              label={degreeRule.label || t('dashboard.certificateForm.fields.degree')}
              icon={GraduationCap}
              error={getError('degree')}
              placeholder={selectPlaceholder}
              options={toSelectOptions(degrees)}
              value={values.degree}
              onChange={(event) => updateField('degree', event.target.value)}
            />
          )}
          {examDateRule.enabled && (
            <TextField
              type="date"
              label={examDateRule.label || t('dashboard.certificateForm.fields.examDate')}
              icon={CalendarDays}
              error={getError('examDate')}
              value={values.examDate}
              onChange={(event) => updateField('examDate', event.target.value)}
            />
          )}
          {examPlaceRule.enabled && (
            <TextField
              label={examPlaceRule.label || t('dashboard.certificateForm.fields.examPlace')}
              icon={MapPin}
              error={getError('examPlace')}
              placeholder={t('dashboard.certificateForm.fields.examPlacePlaceholder')}
              maxLength={255}
              value={values.examPlace}
              onChange={(event) => updateField('examPlace', event.target.value)}
            />
          )}
        </div>

        {isTypeFormLoading && (
          <div className="mt-6">
            <FieldsSkeleton />
          </div>
        )}
      </FormSection>

      {isLanguageMissing && <FormAlert>{t('dashboard.certificateForm.errors.language')}</FormAlert>}

      {typeFormError && <FormAlert>{t('dashboard.certificateForm.errors.typeForm')}</FormAlert>}

      {scoreFields.length > 0 && (
        <FormSection title={t('dashboard.certificateForm.sections.scores')}>
          <ScoreFields
            fields={scoreFields}
            values={values.scores}
            errors={errors}
            onChange={updateScore}
          />
        </FormSection>
      )}

      {customFields.length > 0 && (
        <FormSection title={t('dashboard.certificateForm.sections.extra')}>
          <CustomFields
            fields={customFields}
            values={values.custom}
            errors={errors}
            onChange={updateCustom}
          />
        </FormSection>
      )}

      <FormSection title={t('dashboard.certificateForm.sections.file')}>
        <FileField
          label={t('dashboard.certificateForm.fields.file')}
          chooseLabel={t('dashboard.certificateForm.fields.fileChoose')}
          removeLabel={t('dashboard.certificateForm.fields.fileRemove')}
          hint={
            mode === 'edit'
              ? t('dashboard.certificateForm.fields.fileKeepHint')
              : t('dashboard.certificateForm.fields.fileHint')
          }
          error={getError('file')}
          accept={ACCEPTED_FILE_TYPES}
          file={values.file}
          onChange={(file) => updateField('file', file)}
        />
        {currentFileUrl && !values.file && (
          <p className="text-body mt-4 px-1 text-[13.5px]">
            {t('dashboard.certificateForm.fields.fileCurrent')}:{' '}
            <a
              href={currentFileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              {t('dashboard.certificates.detail.openFile')}
            </a>
          </p>
        )}
      </FormSection>

      {apiError && <FormAlert>{apiError}</FormAlert>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link to={cancelTo} className={buttonVariants({ variant: 'soft', size: 'lg' })}>
          {t('dashboard.certificateForm.cancel')}
        </Link>
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          // Tur formasi kelmaguncha yuborilsa ballar va erkin maydonlar tushib qolardi
          disabled={isPending || isTypeFormLoading || isLanguageLoading || isLanguageMissing}
          className="disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitLabel}
          {isPending ? (
            <LoaderCircle className="size-5 shrink-0 animate-spin" strokeWidth={2.4} aria-hidden="true" />
          ) : (
            <ArrowRight className="size-5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
          )}
        </Button>
      </div>
    </form>
  )
}
