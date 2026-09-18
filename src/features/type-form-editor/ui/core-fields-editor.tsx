import { useTranslation } from 'react-i18next'
import type { TypeFormCore, TypeFormCoreName, TypeFormCoreRule } from '@/entities/dictionary'
import { TextField } from '@/shared/ui'
import { CORE_FIELD_NAMES, getCoreErrorKey, type TypeFormDraftErrors } from '../model/form-draft'
import { EditorSection, Toggle } from './editor-parts'

type CoreFieldsEditorProps = {
  core: TypeFormCore
  errors: TypeFormDraftErrors
  onChange: (name: TypeFormCoreName, patch: Partial<TypeFormCoreRule>) => void
  /** Yangi maydon qo'shimcha maydon sifatida yaratiladi — asosiylari backendda qat'iy */
  onAddField: () => void
}

/** Daraja, imtihon sanasi va joyi: ko'rsatilsinmi, majburiymi va qanday nom bilan. */
export function CoreFieldsEditor({ core, errors, onChange, onAddField }: CoreFieldsEditorProps) {
  const { t } = useTranslation()

  return (
    <EditorSection
      title={t('dashboard.forms.editor.core.title')}
      description={t('dashboard.forms.editor.core.description')}
      onAdd={onAddField}
      addLabel={t('dashboard.forms.editor.actions.addCustom')}
    >
      {CORE_FIELD_NAMES.map((name) => {
        const rule = core[name]
        const error = errors[getCoreErrorKey(name)]

        return (
          <div key={name} className="border-line rounded-2xl border p-4 sm:p-5">
            <p className="text-heading text-[14.5px] font-bold">
              {t(`dashboard.forms.editor.core.names.${name}`)}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <TextField
                label={t('dashboard.forms.editor.fields.label')}
                error={error && t(error)}
                autoComplete="off"
                value={rule.label}
                onChange={(event) => onChange(name, { label: event.target.value })}
              />
              <div className="flex gap-5 sm:h-15 sm:items-center">
                <Toggle
                  label={t('dashboard.forms.editor.fields.enabled')}
                  checked={rule.enabled}
                  onChange={(enabled) => onChange(name, { enabled })}
                />
                {/* Ko'rsatilmaydigan maydon majburiy bo'la olmaydi */}
                <Toggle
                  label={t('dashboard.forms.editor.fields.required')}
                  checked={rule.enabled && rule.required}
                  disabled={!rule.enabled}
                  onChange={(required) => onChange(name, { required })}
                />
              </div>
            </div>
          </div>
        )
      })}
    </EditorSection>
  )
}
