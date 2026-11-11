import dayjs from 'dayjs'
import { Bell, ShieldCheck, ShieldX, TriangleAlert, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import {
  useMarkNotificationsRead,
  useNotifications,
  useUnreadNotificationCount,
  type AppNotification,
  type NotificationStatus,
} from '../api/notifications-api'

// Literal kalitlar — typed t() noto'g'ri kalitni compile-time'da ushlaydi
const STATUS_VIEW = {
  approved: {
    titleKey: 'notifications.status.approved',
    icon: ShieldCheck,
    iconBox: 'bg-primary-soft text-primary',
  },
  rejected: {
    titleKey: 'notifications.status.rejected',
    icon: ShieldX,
    iconBox: 'bg-danger/8 text-danger',
  },
  problem: {
    titleKey: 'notifications.status.problem',
    icon: TriangleAlert,
    iconBox: 'bg-gold/12 text-gold',
  },
} as const satisfies Record<
  NotificationStatus,
  { titleKey: `notifications.status.${NotificationStatus}`; icon: LucideIcon; iconBox: string }
>

function NotificationRow({
  notification,
  onSelect,
}: {
  notification: AppNotification
  onSelect: (notification: AppNotification) => void
}) {
  const { t } = useTranslation()
  const view = STATUS_VIEW[notification.status]
  const Icon = view.icon
  const subject = [
    notification.certificate_type,
    notification.certificate_number &&
      t('notifications.number', { number: notification.certificate_number }),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={cn(
        'hover:bg-surface-sky flex w-full gap-3 px-4 py-3 text-left transition-colors',
        !notification.is_read && 'bg-primary-soft/40',
      )}
    >
      <span
        className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl', view.iconBox)}
      >
        <Icon className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-heading block text-[13.5px] font-semibold">{t(view.titleKey)}</span>
        {subject && <span className="text-body block truncate text-[12.5px]">{subject}</span>}
        {/* Tasdiqlashdagi SMS matni sarlavhani takrorlaydi — faqat rad/muammoda
            ekspert yozgan sabab ko'rsatiladi */}
        {notification.message && notification.status !== 'approved' && (
          <span className="text-body mt-1 line-clamp-2 block text-[13px]">
            {notification.message}
          </span>
        )}
        <span className="text-neutral mt-1 block text-[11.5px] tabular-nums">
          {dayjs(notification.created_at).format('DD.MM.YYYY, HH:mm')}
        </span>
      </span>
      {!notification.is_read && (
        <span className="mt-1.5 shrink-0">
          <span className="bg-primary block size-2 rounded-full" aria-hidden="true" />
          <span className="sr-only">{t('notifications.unread')}</span>
        </span>
      )}
    </button>
  )
}

function PanelBody({ open, onSelect }: { open: boolean; onSelect: (n: AppNotification) => void }) {
  const { t } = useTranslation()
  const { data, isPending, isError, refetch } = useNotifications(open)

  if (isPending) {
    return (
      <div className="flex animate-pulse flex-col gap-3 p-4" aria-hidden="true">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-3">
            <div className="bg-surface-muted size-9 rounded-xl" />
            <div className="flex-1 space-y-2 py-1">
              <div className="bg-surface-muted h-3 w-2/3 rounded" />
              <div className="bg-surface-muted h-3 w-1/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-body text-[13px]">{t('notifications.error')}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-primary mt-2 text-[13px] font-semibold hover:underline"
        >
          {t('notifications.retry')}
        </button>
      </div>
    )
  }

  if (data.results.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <span className="bg-surface-muted text-neutral flex size-11 items-center justify-center rounded-xl">
          <Bell className="size-5" strokeWidth={2} aria-hidden="true" />
        </span>
        <p className="text-heading mt-3 text-[14px] font-semibold">
          {t('notifications.empty.title')}
        </p>
        <p className="text-body mt-1 max-w-64 text-[13px]">{t('notifications.empty.text')}</p>
      </div>
    )
  }

  return (
    <ul className="divide-line divide-y">
      {data.results.map((notification) => (
        <li key={notification.id}>
          <NotificationRow notification={notification} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  )
}

/**
 * Nomzodning bildirishnomalari: qo'ng'iroqcha + o'qilmaganlar soni, bosilganda
 * ro'yxat. Bildirishnomani bosish uni o'qildi qiladi va arizani ochadi.
 */
export function NotificationBell() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const { data: countData } = useUnreadNotificationCount()
  const { markRead, markAllRead, isPending } = useMarkNotificationsRead()
  const unread = countData?.count ?? 0

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function handleSelect(notification: AppNotification) {
    setOpen(false)
    // O'tishni kutib turmaydi: o'qildi belgisi tushmasa ham ariza ochilsin
    if (!notification.is_read) markRead(notification.id).catch(() => undefined)
    if (notification.certificate !== null) {
      navigate(generatePath(ROUTES.certificateDetail, { id: String(notification.certificate) }))
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          unread > 0
            ? `${t('dashboard.topbar.notifications')}: ${t('notifications.unreadCount', { count: unread })}`
            : t('dashboard.topbar.notifications')
        }
        className={cn(
          'text-heading hover:bg-surface-muted relative flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
          open && 'bg-surface-muted',
        )}
      >
        <Bell className="size-4.5" strokeWidth={2} aria-hidden="true" />
        {unread > 0 && (
          <span
            className="bg-danger ring-surface absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold text-white tabular-nums ring-2"
            aria-hidden="true"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={t('notifications.title')}
          // Telefonda qo'ng'iroqcha o'ng chetda emas (yonida avatar) — panel
          // ekran kengligida; sm'dan boshlab tugma ostida
          className="bg-surface border-line shadow-panel fixed inset-x-3 top-[68px] z-40 overflow-hidden rounded-2xl border sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-96"
        >
          <div className="border-line flex items-center justify-between gap-3 border-b px-4 py-3">
            <p className="text-heading text-[14px] font-bold">{t('notifications.title')}</p>
            <button
              type="button"
              onClick={() => markAllRead()}
              disabled={unread === 0 || isPending}
              className="text-primary text-[12.5px] font-semibold hover:underline disabled:pointer-events-none disabled:opacity-40"
            >
              {t('notifications.markAllRead')}
            </button>
          </div>
          <div className="max-h-[min(28rem,70svh)] overflow-y-auto">
            <PanelBody open={open} onSelect={handleSelect} />
          </div>
        </div>
      )}
    </div>
  )
}
