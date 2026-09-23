import { message } from 'antd'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DICTIONARY_PAGE_SIZE,
  DICTIONARY_RESOURCES,
  useDictionaryList,
  useDictionaryMutations,
  type DictionaryResource,
} from '@/entities/dictionary'
import { getApiErrorMessage } from '@/shared/api'
import { SEARCH_DEBOUNCE_MS } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { useDebouncedValue } from '@/shared/lib/debounce'
import { Button, Pagination, SearchInput, TableSkeleton } from '@/shared/ui'
import {
  DICTIONARY_RESOURCE_CONFIG,
  isHidden,
  type DictionaryRow,
} from '../model/resources'
import { DictionaryFormDrawer } from './dictionary-form-drawer'
import { DictionaryTable } from './dictionary-table'
import { DictionaryEmptyState } from './dictionary-states'

/** Yopiq drawer, tahrirlanayotgan qator yoki yaratish rejimi. */
type DrawerState = { row?: DictionaryRow } | null

/** Lug'atlarni boshqarish: chapda lug'at tanlanadi, o'ngda uning yozuvlari. */
export function DictionaryAdminPanel() {
  const { t } = useTranslation()
  const [messageApi, messageHolder] = message.useMessage()
  const [resource, setResource] = useState<DictionaryResource>('types')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [drawer, setDrawer] = useState<DrawerState>(null)

  const search = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS)
  const config = DICTIONARY_RESOURCE_CONFIG[resource]

  const { items, count, isLoading, isFetching, isError, refetch } = useDictionaryList<DictionaryRow>(
    resource,
    { search, page },
  )
  const { updateItem, hideItem, isPending } = useDictionaryMutations(resource)

  // Lug'at yoki qidiruv almashsa eski sahifa raqami yangi ro'yxatda mavjud bo'lmasligi mumkin
  const changeResource = (next: DictionaryResource) => {
    setResource(next)
    setSearchInput('')
    setPage(1)
  }

  const changeSearch = (next: string) => {
    setSearchInput(next)
    setPage(1)
  }

  const handleSaved = () => {
    messageApi.success(t('dashboard.forms.toast.saved'))
    setDrawer(null)
  }

  /**
   * Yashirish DELETE orqali (backend `is_active: false` qiladi), qayta
   * faollashtirish esa PATCH orqali — DELETE ning teskarisi yo'q.
   */
  const toggleActive = async (row: DictionaryRow) => {
    const hidden = isHidden(row)

    try {
      await (hidden ? updateItem(row.id, { is_active: true }) : hideItem(row.id))
      messageApi.success(t(hidden ? 'dashboard.forms.toast.restored' : 'dashboard.forms.toast.hidden'))
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, t('dashboard.forms.errors.apiFallback')))
    }
  }

  const totalPages = Math.ceil(count / DICTIONARY_PAGE_SIZE)

  const renderRows = () => {
    if (isLoading) return <TableSkeleton rows={6} columns={2} variant="inline" />

    if (isError && !items) {
      return (
        <div className="px-5 py-10">
          <Button variant="soft" onClick={() => refetch()}>
            {t('dashboard.forms.loadError.retry')}
          </Button>
          <p className="text-body mt-3 text-[14px]">{t('dashboard.forms.loadError.text')}</p>
        </div>
      )
    }

    if (!items || items.length === 0) return <DictionaryEmptyState hasQuery={Boolean(search)} />

    return (
      <DictionaryTable
        config={config}
        rows={items}
        isPending={isPending}
        onEdit={(row) => setDrawer({ row })}
        onToggleActive={toggleActive}
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {messageHolder}

      <nav aria-label={t('dashboard.forms.resourceNavLabel')} className="lg:sticky lg:top-6 lg:self-start">
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {DICTIONARY_RESOURCES.map((key) => {
            const { icon: Icon } = DICTIONARY_RESOURCE_CONFIG[key]
            const isActive = key === resource

            return (
              <li key={key}>
                <button
                  type="button"
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => changeResource(key)}
                  className={cn(
                    'flex w-full shrink-0 items-center gap-2.5 rounded-xl px-4 py-3 text-[14.5px] font-semibold whitespace-nowrap transition-colors',
                    isActive
                      ? 'bg-primary-soft text-primary'
                      : 'text-body hover:bg-surface-muted hover:text-heading',
                  )}
                >
                  <Icon className="size-4.5 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                  {t(`dashboard.forms.resources.${key}.title`)}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            className="sm:w-full sm:max-w-sm"
            label={t('dashboard.forms.searchLabel')}
            placeholder={t('dashboard.forms.searchPlaceholder')}
            value={searchInput}
            onChange={changeSearch}
          />

          {config.canCreate && (
            <Button type="button" onClick={() => setDrawer({})}>
              <Plus className="size-4.5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
              {t('dashboard.forms.actions.create')}
            </Button>
          )}
        </div>

        <p className="text-body mt-3 text-[13.5px]">
          {t(`dashboard.forms.resources.${resource}.description`)}
        </p>

        <div className="bg-surface shadow-card border-line mt-4 overflow-hidden rounded-3xl border">
          <div className={cn('transition-opacity', isFetching && 'opacity-60')}>{renderRows()}</div>
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-6" />
      </div>

      {drawer && (
        <DictionaryFormDrawer
          config={config}
          row={drawer.row}
          open
          onClose={() => setDrawer(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
