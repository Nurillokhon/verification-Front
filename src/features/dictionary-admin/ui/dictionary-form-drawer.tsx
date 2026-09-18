import { Drawer } from 'antd'
import { LoaderCircle, X } from 'lucide-react'
import { useState, type FormEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { useDictionaryMutations } from '@/entities/dictionary'
import { getApiErrorMessage } from '@/shared/api'
import { Button, FormAlert, SelectField, TextAreaField, TextField } from '@/shared/ui'
import {
  hasErrors,
  isFieldLocked,
  toDictionaryBody,
  toFormValues,
  validateDictionaryForm,
  type DictionaryFormErrors,
  type DictionaryFormValues,
} from '../model/dictionary-form'
import type { DictionaryField, DictionaryResourceConfig, DictionaryRow } from '../model/resources'

const FORM_ID = 'dictionary-admin-form'
const DRAWER_SIZE = 480

type DictionaryFormDrawerProps = {
  config: DictionaryResourceConfig
  /** Berilmasa — yangi yozuv yaratiladi */
  row?: DictionaryRow
  open: boolean
  onClose: () => void
  onSaved: () => void
}

/** Lug'at yozuvini yaratish yoki tahrirlash — maydonlar resurs konfiguratsiyasidan olinadi. */
export function DictionaryFormDrawer({
  config,
  row,
  open,
  onClose,
  onSaved,
}: DictionaryFormDrawerProps) {
  const { t } = useTranslation()
  const { createItem, updateItem, isPending } = useDictionaryMutations(config.resource)

  return (
    <Drawer
      open={open}
      onClose={isPending ? undefined : onClose}
      size={DRAWER_SIZE}
      // Yopilganda forma holati xotirada qolmasin — keyingi ochilishda toza forma
      destroyOnHidden
      maskClosable={!isPending}
      closable={false}
      title={
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-heading text-[18px] font-extrabold">
              {t(row ? 'dashboard.forms.drawer.editTitle' : 'dashboard.forms.drawer.createTitle', {
                resource: t(`dashboard.forms.resources.${config.resource}.item`),
              })}
            </p>
          </div>
          <button
            type="button"
            aria-label={t('dashboard.forms.drawer.cancel')}
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
            {t('dashboard.forms.drawer.cancel')}
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={isPending}
            className="disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending && (
              <LoaderCircle
                className="size-4 shrink-0 animate-spin"
                strokeWidth={2.4}
                aria-hidden="true"
              />
            )}
            {t('dashboard.forms.drawer.submit')}
          </Button>
        </div>
      }
    >
      <DictionaryForm
        config={config}
        row={row}
        save={(body) => (row ? updateItem(row.id, body) : createItem(body))}
        onSaved={onSaved}
      />
    </Drawer>
  )
}

type DictionaryFormProps = {
  config: DictionaryResourceConfig
  row?: DictionaryRow
  save: (body: Record<string, unknown>) => Promise<void>
  onSaved: () => void
}

function DictionaryForm({ config, row, save, onSaved }: DictionaryFormProps) {
  const { t } = useTranslation()
  const [values, setValues] = useState<DictionaryFormValues>(() => toFormValues(config, row))
  const [errors, setErrors] = useState<DictionaryFormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const updateField = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setApiError(null)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const nextErrors = validateDictionaryForm(config, values, row)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setApiError(null)
    try {
      await save(toDictionaryBody(config, values, row))
      onSaved()
    } catch (error) {
      setApiError(getApiErrorMessage(error, t('dashboard.forms.errors.apiFallback')))
    }
  }

  const renderField = (field: DictionaryField) => {
    const label = t(field.labelKey)
    const errorKey = errors[field.key]
    const error = errorKey ? t(errorKey) : undefined
    const hint = field.hintKey ? t(field.hintKey) : undefined
    const value = values[field.key] ?? ''
    const disabled = isFieldLocked(field, row)

    if (field.kind === 'select') {
      return (
        <SelectField
          key={field.key}
          label={label}
          error={error}
          hint={hint}
          disabled={disabled}
          placeholder={t('dashboard.forms.drawer.selectPlaceholder')}
          options={(field.options ?? []).map((option) => ({ value: option, label: option }))}
          value={value}
          onChange={(next) => updateField(field.key, next)}
        />
      )
    }

    if (field.kind === 'textarea') {
      return (
        <TextAreaField
          key={field.key}
          label={label}
          error={error}
          hint={hint}
          disabled={disabled}
          value={value}
          onChange={(event) => updateField(field.key, event.target.value)}
        />
      )
    }

    return (
      <TextField
        key={field.key}
        label={label}
        error={error}
        hint={hint}
        disabled={disabled}
        type={field.kind === 'number' ? 'number' : 'text'}
        inputMode={field.kind === 'number' ? 'numeric' : undefined}
        min={field.kind === 'number' ? 1 : undefined}
        placeholder={field.placeholder}
        autoComplete="off"
        value={value}
        onChange={(event) => updateField(field.key, event.target.value)}
      />
    )
  }

  return (
    <form id={FORM_ID} noValidate onSubmit={handleSubmit} className="space-y-5">
      {config.fields.map(renderField)}
      {apiError && <FormAlert>{apiError}</FormAlert>}
    </form>
  )
}
