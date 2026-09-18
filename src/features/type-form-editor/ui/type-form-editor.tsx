import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState, type FormEventHandler, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useActiveSections,
  useDictionaryMutations,
  type TypeForm,
  type TypeFormCoreName,
  type TypeFormCoreRule,
} from '@/entities/dictionary'
import { getApiErrorMessage } from '@/shared/api'
import { Button, FormAlert } from '@/shared/ui'
import {
  createCustomField,
  createScoreField,
  getCustomCardId,
  hasErrors,
  toDraft,
  toFormBody,
  toPreviewForm,
  validateDraft,
  type CustomFieldDraft,
  type ScoreFieldDraft,
  type TypeFormDraft,
  type TypeFormDraftErrors,
} from '../model/form-draft'
import { CoreFieldsEditor } from './core-fields-editor'
import { CustomFieldsEditor } from './custom-fields-editor'
import { ScoreFieldsEditor } from './score-fields-editor'

type TypeFormEditorProps = {
  typeId: number
  /** Joriy forma — tahrirlash shundan boshlanadi */
  typeForm: TypeForm
  /**
   * Nomzod ko'radigan forma — sahifa qatlami chizadi (ariza formasining
   * komponentlari boshqa feature'da). Har o'zgarishda yangi forma beriladi.
   */
  renderPreview: (form: TypeForm) => ReactNode
  onCancel: () => void
  onSaved: () => void
}

/** `uid` bo'yicha qatorni bir pog'ona yuqoriga yoki pastga suradi. */
function move<T extends { uid: string }>(items: T[], uid: string, direction: -1 | 1) {
  const index = items.findIndex((item) => item.uid === uid)
  const target = index + direction
  if (index < 0 || target < 0 || target >= items.length) return items

  const next = [...items]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

function patchItem<T extends { uid: string }>(items: T[], uid: string, patch: Partial<T>) {
  return items.map((item) => (item.uid === uid ? { ...item, ...patch } : item))
}

/**
 * Sertifikat turi formasining quruvchisi: chapda sozlamalar, o'ngda nomzod
 * ko'radigan natija. Saqlanganda backend turning bo'limlarini ball
 * maydonlariga tenglashtiradi.
 */
export function TypeFormEditor({
  typeId,
  typeForm,
  renderPreview,
  onCancel,
  onSaved,
}: TypeFormEditorProps) {
  const { t } = useTranslation()
  const { sections, isLoading: isSectionsLoading } = useActiveSections()
  const { updateItem, isPending } = useDictionaryMutations('types')

  const [draft, setDraft] = useState<TypeFormDraft>(() => toDraft(typeForm))
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  // Asosiy bo'limdan qo'shilgan maydon pastda chiziladi — unga aylantirib, fokus beriladi
  const focusUidRef = useRef<string | null>(null)

  useEffect(() => {
    const uid = focusUidRef.current
    if (!uid) return
    focusUidRef.current = null

    const card = document.getElementById(getCustomCardId(uid))
    card?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    card?.querySelector<HTMLElement>('input:not([role="combobox"])')?.focus({ preventScroll: true })
  }, [draft])

  // Xatolar birinchi saqlash urinishidan keyin ko'rsatiladi va har o'zgarishda yangilanadi
  const errors: TypeFormDraftErrors = isSubmitted ? validateDraft(draft) : {}

  const updateDraft = (updater: (prev: TypeFormDraft) => TypeFormDraft) => {
    setDraft(updater)
    setApiError(null)
  }

  const changeCore = (name: TypeFormCoreName, patch: Partial<TypeFormCoreRule>) =>
    updateDraft((prev) => ({ ...prev, core: { ...prev.core, [name]: { ...prev.core[name], ...patch } } }))

  const scoreHandlers = {
    onAdd: () => updateDraft((prev) => ({ ...prev, fields: [...prev.fields, createScoreField()] })),
    onChange: (uid: string, patch: Partial<ScoreFieldDraft>) =>
      updateDraft((prev) => ({ ...prev, fields: patchItem(prev.fields, uid, patch) })),
    onMove: (uid: string, direction: -1 | 1) =>
      updateDraft((prev) => ({ ...prev, fields: move(prev.fields, uid, direction) })),
    onRemove: (uid: string) =>
      updateDraft((prev) => ({ ...prev, fields: prev.fields.filter((item) => item.uid !== uid) })),
  }

  const addCustomField = () => {
    const field = createCustomField()
    updateDraft((prev) => ({ ...prev, customFields: [...prev.customFields, field] }))
    focusUidRef.current = field.uid
  }

  const customHandlers = {
    onAdd: addCustomField,
    onChange: (uid: string, patch: Partial<CustomFieldDraft>) =>
      updateDraft((prev) => ({ ...prev, customFields: patchItem(prev.customFields, uid, patch) })),
    onMove: (uid: string, direction: -1 | 1) =>
      updateDraft((prev) => ({ ...prev, customFields: move(prev.customFields, uid, direction) })),
    onRemove: (uid: string) =>
      updateDraft((prev) => ({
        ...prev,
        customFields: prev.customFields.filter((item) => item.uid !== uid),
      })),
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setIsSubmitted(true)

    if (hasErrors(validateDraft(draft))) {
      setApiError(t('dashboard.forms.editor.errors.fixFields'))
      return
    }

    setApiError(null)
    try {
      await updateItem(typeId, { form: toFormBody(draft) })
      onSaved()
    } catch (error) {
      setApiError(getApiErrorMessage(error, t('dashboard.forms.errors.apiFallback')))
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
      <form noValidate onSubmit={handleSubmit} className="min-w-0 space-y-6">
        <CoreFieldsEditor
          core={draft.core}
          errors={errors}
          onChange={changeCore}
          onAddField={addCustomField}
        />
        <ScoreFieldsEditor
          fields={draft.fields}
          sections={sections}
          isSectionsLoading={isSectionsLoading}
          errors={errors}
          {...scoreHandlers}
        />
        <CustomFieldsEditor fields={draft.customFields} errors={errors} {...customHandlers} />

        {apiError && <FormAlert>{apiError}</FormAlert>}

        {/* Uzun formada tugmalar ko'rinib tursin */}
        <div className="bg-surface/90 border-line sticky bottom-4 z-10 flex justify-end gap-3 rounded-2xl border p-3 backdrop-blur">
          <Button type="button" variant="soft" disabled={isPending} onClick={onCancel}>
            {t('dashboard.forms.drawer.cancel')}
          </Button>
          <Button type="submit" disabled={isPending} className="disabled:cursor-not-allowed disabled:opacity-70">
            {isPending && (
              <LoaderCircle className="size-4 shrink-0 animate-spin" strokeWidth={2.4} aria-hidden="true" />
            )}
            {t('dashboard.forms.drawer.submit')}
          </Button>
        </div>
      </form>

      <div className="min-w-0 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
        <p className="text-neutral mb-3 px-1 text-[12px] font-bold tracking-wide uppercase">
          {t('dashboard.forms.editor.livePreview')}
        </p>
        {renderPreview(toPreviewForm(draft, typeForm, sections))}
      </div>
    </div>
  )
}
