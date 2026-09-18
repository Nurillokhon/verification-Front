import { message } from 'antd'
import { Award, Info, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toSelectOptions, useAllCertificateTypes, useTypeForm } from '@/entities/dictionary'
import { TypeFormEditor } from '@/features/type-form-editor'
import { Button, FormAlert, InfoNote, SelectField } from '@/shared/ui'
import { TypeFormPreview } from './type-form-preview'

/**
 * Admin turni tanlaydi va formaning nomzod ko'radigan ko'rinishini tekshiradi.
 * "Tahrirlash" bosilsa shu yerning o'zida forma quruvchisi ochiladi — o'ngda
 * o'zgarishlar darhol ko'rinadi.
 */
export function FormPreviewPanel() {
  const { t } = useTranslation()
  const [messageApi, messageHolder] = message.useMessage()
  const [typeId, setTypeId] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const { types, isLoading: isTypesLoading } = useAllCertificateTypes()
  const { typeForm, isLoading: isFormLoading, error } = useTypeForm(typeId)

  const handleSaved = () => {
    messageApi.success(t('dashboard.forms.toast.saved'))
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {messageHolder}

      <div className="bg-surface shadow-card border-line flex flex-col gap-4 rounded-3xl border p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <SelectField
          label={t('dashboard.forms.preview.typeLabel')}
          icon={Award}
          hint={t(isEditing ? 'dashboard.forms.editor.typeLocked' : 'dashboard.forms.preview.typeHint')}
          placeholder={t('dashboard.certificateForm.fields.select')}
          options={toSelectOptions(types)}
          // Tahrirlash paytida tur almashsa saqlanmagan o'zgarishlar boshqa turga tushib qoladi
          disabled={isTypesLoading || isEditing}
          value={typeId}
          onChange={setTypeId}
          className="w-full max-w-md"
        />

        {typeForm && !isEditing && (
          <Button type="button" onClick={() => setIsEditing(true)} className="sm:mb-7">
            <Pencil className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
            {t('dashboard.forms.editor.open')}
          </Button>
        )}
      </div>

      {!typeId && (
        <InfoNote icon={Info}>{t('dashboard.forms.preview.selectPrompt')}</InfoNote>
      )}

      {error && <FormAlert>{t('dashboard.certificateForm.errors.typeForm')}</FormAlert>}

      {typeForm && !typeForm.configured && (
        <InfoNote icon={Info}>{t('dashboard.forms.preview.notConfigured')}</InfoNote>
      )}

      {isEditing && typeForm ? (
        <TypeFormEditor
          // Boshqa tur yoki saqlangan forma — muharrir toza holatdan boshlansin
          key={typeId}
          typeId={Number(typeId)}
          typeForm={typeForm}
          renderPreview={(draftForm) => <TypeFormPreview typeId={typeId} typeForm={draftForm} />}
          onCancel={() => setIsEditing(false)}
          onSaved={handleSaved}
        />
      ) : (
        typeId &&
        !error && <TypeFormPreview typeId={typeId} typeForm={typeForm} isLoading={isFormLoading} />
      )}
    </div>
  )
}
