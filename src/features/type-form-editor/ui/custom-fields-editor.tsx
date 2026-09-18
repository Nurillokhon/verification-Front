import { useTranslation } from 'react-i18next'
import type { CustomFieldKind } from '@/entities/dictionary'
import { SelectField, TextAreaField, TextField } from '@/shared/ui'
import {
  CUSTOM_FIELD_KINDS,
  getCustomCardId,
  getCustomErrorKey,
  type CustomFieldDraft,
  type TypeFormDraftErrors,
} from '../model/form-draft'
import { EditorSection, EmptyList, ItemCard, Toggle } from './editor-parts'

type CustomFieldsEditorProps = {
  fields: readonly CustomFieldDraft[]
  errors: TypeFormDraftErrors
  onAdd: () => void
  onChange: (uid: string, patch: Partial<CustomFieldDraft>) => void
  onMove: (uid: string, direction: -1 | 1) => void
  onRemove: (uid: string) => void
}

/** Qo'shimcha maydonlar — matn, son, sana yoki tanlash; qiymati arizaning `data` sida saqlanadi. */
export function CustomFieldsEditor({
  fields,
  errors,
  onAdd,
  onChange,
  onMove,
  onRemove,
}: CustomFieldsEditorProps) {
  const { t } = useTranslation()

  const kindOptions = CUSTOM_FIELD_KINDS.map((kind) => ({
    value: kind,
    label: t(`dashboard.forms.editor.kinds.${kind}`),
  }))

  const getError = (field: CustomFieldDraft, key: keyof CustomFieldDraft) => {
    const error = errors[getCustomErrorKey(field.uid, key)]
    return error && t(error)
  }

  return (
    <EditorSection
      title={t('dashboard.forms.editor.custom.title')}
      description={t('dashboard.forms.editor.custom.description')}
      onAdd={onAdd}
      addLabel={t('dashboard.forms.editor.actions.addCustom')}
    >
      {fields.length === 0 && <EmptyList>{t('dashboard.forms.editor.custom.empty')}</EmptyList>}

      {fields.map((field, index) => (
        <ItemCard
          key={field.uid}
          id={getCustomCardId(field.uid)}
          index={index}
          total={fields.length}
          title={field.label || t('dashboard.forms.editor.custom.untitled')}
          onMove={(direction) => onMove(field.uid, direction)}
          onRemove={() => onRemove(field.uid)}
        >
          <SelectField
            label={t('dashboard.forms.editor.fields.kind')}
            options={kindOptions}
            value={field.kind}
            onChange={(next) => onChange(field.uid, { kind: next as CustomFieldKind })}
          />
          <TextField
            label={t('dashboard.forms.editor.fields.key')}
            hint={t('dashboard.forms.editor.custom.keyHint')}
            placeholder="passport_series"
            autoComplete="off"
            spellCheck={false}
            error={getError(field, 'key')}
            value={field.key}
            onChange={(event) => onChange(field.uid, { key: event.target.value })}
          />
          <TextField
            className="sm:col-span-2"
            label={t('dashboard.forms.editor.fields.label')}
            autoComplete="off"
            error={getError(field, 'label')}
            value={field.label}
            onChange={(event) => onChange(field.uid, { label: event.target.value })}
          />

          {field.kind === 'select' && (
            <TextAreaField
              className="sm:col-span-2"
              label={t('dashboard.forms.editor.fields.options')}
              hint={t('dashboard.forms.editor.custom.optionsHint')}
              rows={4}
              error={getError(field, 'options')}
              value={field.options}
              onChange={(event) => onChange(field.uid, { options: event.target.value })}
            />
          )}

          {field.kind === 'number' && (
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

          {field.kind === 'text' && (
            <TextField
              className="sm:col-span-2"
              label={t('dashboard.forms.editor.fields.maxLength')}
              hint={t('dashboard.forms.editor.custom.maxLengthHint')}
              type="number"
              inputMode="numeric"
              min={1}
              error={getError(field, 'maxLength')}
              value={field.maxLength}
              onChange={(event) => onChange(field.uid, { maxLength: event.target.value })}
            />
          )}

          <Toggle
            className="sm:col-span-2"
            label={t('dashboard.forms.editor.fields.required')}
            checked={field.required}
            onChange={(required) => onChange(field.uid, { required })}
          />
        </ItemCard>
      ))}
    </EditorSection>
  )
}
