import { Award, CalendarDays, GraduationCap, Hash, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  toSelectOptions,
  useAllCertificateTypes,
  useDegrees,
  type TypeForm,
} from '@/entities/dictionary'
import {
  CustomFields,
  FormSection,
  ScoreFields,
  getCoreRule,
  getCustomFields,
  getScoreFields,
} from '@/features/certificate-form'
import { DateField, SelectField, TextField } from '@/shared/ui'

const NO_VALUES: Record<string, string> = {}
const NO_ERRORS = {}
const noop = () => {}

type TypeFormPreviewProps = {
  typeId: string
  /** Yuklanayotganda `undefined` — faqat asosiy maydonlar chiziladi */
  typeForm: TypeForm | undefined
  isLoading?: boolean
}

/**
 * Nomzod ko'radigan forma — aynan o'sha komponentlar bilan, lekin `fieldset
 * disabled` ichida. Saqlangan formani ham, tahrirlanayotgan loyihani ham chizadi.
 */
export function TypeFormPreview({ typeId, typeForm, isLoading }: TypeFormPreviewProps) {
  const { t } = useTranslation()
  const { types } = useAllCertificateTypes()
  const { degrees } = useDegrees()

  const scoreFields = getScoreFields(typeForm)
  const customFields = getCustomFields(typeForm)
  const degreeRule = getCoreRule(typeForm, 'degree')
  const examDateRule = getCoreRule(typeForm, 'exam_date')
  const examPlaceRule = getCoreRule(typeForm, 'exam_place')

  const selectPlaceholder = t('dashboard.certificateForm.fields.select')

  return (
    // disabled fieldset: hamma maydon ko'rinadi, lekin hech biri tahrirlanmaydi
    <fieldset disabled className="space-y-6" aria-busy={isLoading}>
      <legend className="sr-only">{t('dashboard.forms.preview.legend')}</legend>

      <FormSection title={t('dashboard.certificateForm.sections.main')}>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            className="sm:col-span-2"
            label={t('dashboard.certificateForm.fields.number')}
            icon={Hash}
            placeholder={t('dashboard.certificateForm.fields.numberPlaceholder')}
            value=""
            onChange={noop}
          />
          <SelectField
            label={t('dashboard.certificateForm.fields.type')}
            icon={Award}
            placeholder={selectPlaceholder}
            options={toSelectOptions(types)}
            disabled
            value={typeId}
            onChange={noop}
          />
          <DateField
            label={t('dashboard.certificateForm.fields.issueDate')}
            icon={CalendarDays}
            disabled
            value=""
            onChange={noop}
          />

          {degreeRule.enabled && (
            <SelectField
              label={degreeRule.label || t('dashboard.certificateForm.fields.degree')}
              icon={GraduationCap}
              placeholder={selectPlaceholder}
              options={toSelectOptions(degrees)}
              disabled
              value=""
              onChange={noop}
            />
          )}
          {examDateRule.enabled && (
            <DateField
              label={examDateRule.label || t('dashboard.certificateForm.fields.examDate')}
              icon={CalendarDays}
              disabled
              value=""
              onChange={noop}
            />
          )}
          {examPlaceRule.enabled && (
            <TextField
              label={examPlaceRule.label || t('dashboard.certificateForm.fields.examPlace')}
              icon={MapPin}
              placeholder={t('dashboard.certificateForm.fields.examPlacePlaceholder')}
              value=""
              onChange={noop}
            />
          )}
        </div>
      </FormSection>

      {scoreFields.length > 0 && (
        <FormSection title={t('dashboard.certificateForm.sections.scores')}>
          <ScoreFields
            fields={scoreFields}
            values={NO_VALUES}
            errors={NO_ERRORS}
            onChange={noop}
          />
        </FormSection>
      )}

      {customFields.length > 0 && (
        <FormSection title={t('dashboard.certificateForm.sections.extra')}>
          <CustomFields
            fields={customFields}
            values={NO_VALUES}
            errors={NO_ERRORS}
            onChange={noop}
          />
        </FormSection>
      )}
    </fieldset>
  )
}
