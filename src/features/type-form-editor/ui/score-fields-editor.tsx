import { useTranslation } from 'react-i18next'
import type { SectionAdmin } from '@/entities/dictionary'
import { SelectField, TextField } from '@/shared/ui'
import {
  SCORE_TYPES,
  getScoreErrorKey,
  type ScoreFieldDraft,
  type ScoreType,
  type TypeFormDraftErrors,
} from '../model/form-draft'
import { EditorSection, EmptyList, ItemCard, Toggle } from './editor-parts'

type ScoreFieldsEditorProps = {
  fields: readonly ScoreFieldDraft[]
  sections: readonly SectionAdmin[]
  isSectionsLoading: boolean
  errors: TypeFormDraftErrors
  onAdd: () => void
  onChange: (uid: string, patch: Partial<ScoreFieldDraft>) => void
  onMove: (uid: string, direction: -1 | 1) => void
  onRemove: (uid: string) => void
}

/** Ball maydonlari — har biri bitta bo'limga (Listening, Reading, ...) bog'lanadi. */
export function ScoreFieldsEditor({
  fields,
  sections,
  isSectionsLoading,
  errors,
  onAdd,
  onChange,
  onMove,
  onRemove,
}: ScoreFieldsEditorProps) {
  const { t } = useTranslation()

  const sectionOptions = sections.map((section) => ({
    value: String(section.id),
    label: section.name,
  }))
  const scoreTypeOptions = SCORE_TYPES.map((type) => ({
    value: type,
    label: t(`dashboard.forms.editor.scoreTypes.${type}`),
  }))

  const getError = (field: ScoreFieldDraft, key: keyof ScoreFieldDraft) => {
    const error = errors[getScoreErrorKey(field.uid, key)]
    return error && t(error)
  }

  // Bo'lim tanlanganda nomi bo'sh bo'lsa, bo'lim nomi bilan to'ldiriladi
  const changeSection = (field: ScoreFieldDraft, sectionId: string) => {
    const section = sections.find((item) => String(item.id) === sectionId)
    onChange(field.uid, {
      section: sectionId,
      ...(!field.label.trim() && section ? { label: section.name } : {}),
    })
  }

  return (
    <EditorSection
      title={t('dashboard.forms.editor.scores.title')}
      description={t('dashboard.forms.editor.scores.description')}
      onAdd={onAdd}
      addLabel={t('dashboard.forms.editor.actions.addScore')}
    >
      {fields.length === 0 && <EmptyList>{t('dashboard.forms.editor.scores.empty')}</EmptyList>}

      {fields.map((field, index) => {
        const letter = field.scoreType === 'letter'

        return (
          <ItemCard
            key={field.uid}
            index={index}
            total={fields.length}
            title={field.label || t('dashboard.forms.editor.scores.untitled')}
            onMove={(direction) => onMove(field.uid, direction)}
            onRemove={() => onRemove(field.uid)}
          >
            <SelectField
              label={t('dashboard.forms.editor.fields.section')}
              placeholder={t('dashboard.forms.drawer.selectPlaceholder')}
              options={sectionOptions}
              disabled={isSectionsLoading}
              error={getError(field, 'section')}
              value={field.section}
              onChange={(next) => changeSection(field, next)}
            />
            <TextField
              label={t('dashboard.forms.editor.fields.label')}
              error={getError(field, 'label')}
              autoComplete="off"
              value={field.label}
              onChange={(event) => onChange(field.uid, { label: event.target.value })}
            />
            <SelectField
              className="sm:col-span-2"
              label={t('dashboard.forms.editor.fields.scoreType')}
              hint={letter ? t('dashboard.forms.editor.scores.letterHint') : undefined}
              options={scoreTypeOptions}
              value={field.scoreType}
              onChange={(next) => onChange(field.uid, { scoreType: next as ScoreType })}
            />
            {!letter && (
              <>
                <TextField
                  label={t('dashboard.forms.editor.fields.min')}
                  type="number"
                  inputMode="decimal"
                  step="any"
                  error={getError(field, 'min')}
                  value={field.min}
                  onChange={(event) => onChange(field.uid, { min: event.target.value })}
                />
                <TextField
                  label={t('dashboard.forms.editor.fields.max')}
                  type="number"
                  inputMode="decimal"
                  step="any"
                  error={getError(field, 'max')}
                  value={field.max}
                  onChange={(event) => onChange(field.uid, { max: event.target.value })}
                />
              </>
            )}
            <Toggle
              className="sm:col-span-2"
              label={t('dashboard.forms.editor.fields.required')}
              checked={field.required}
              onChange={(required) => onChange(field.uid, { required })}
            />
          </ItemCard>
        )
      })}
    </EditorSection>
  )
}
