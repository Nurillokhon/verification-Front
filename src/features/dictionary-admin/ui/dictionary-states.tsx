import { FileQuestionMark } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SKELETON_ROWS = 6

export function DictionarySkeleton() {
  return (
    <div className="divide-line divide-y" aria-hidden="true">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-4">
          <div className="bg-surface-muted h-4 flex-1 animate-pulse rounded-full" />
          <div className="bg-surface-muted h-4 w-24 animate-pulse rounded-full" />
        </div>
      ))}
    </div>
  )
}

/** Ro'yxat bo'sh: qidiruv natijasizmi yoki lug'at umuman to'ldirilmaganmi — sabab ko'rsatiladi. */
export function DictionaryEmptyState({ hasQuery }: { hasQuery: boolean }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="bg-surface-muted text-neutral flex size-14 items-center justify-center rounded-2xl">
        <FileQuestionMark className="size-7" strokeWidth={2} aria-hidden="true" />
      </span>
      <p className="text-heading mt-5 text-[16px] font-bold">
        {t(hasQuery ? 'dashboard.forms.empty.searchTitle' : 'dashboard.forms.empty.title')}
      </p>
      <p className="text-body mt-2 max-w-sm text-[14px]">
        {t(hasQuery ? 'dashboard.forms.empty.searchText' : 'dashboard.forms.empty.text')}
      </p>
    </div>
  )
}
