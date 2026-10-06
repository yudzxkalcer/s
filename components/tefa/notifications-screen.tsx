'use client'

import { useEffect, useState } from 'react'
import { Bell, Check, CheckCheck, BellOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchNotifications, markAllNotificationsRead } from './data'
import { ScreenHeader } from './screen-header'
import type { Notification } from './types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  return `${days} hari lalu`
}

export function NotificationsScreen({
  onBack,
  onRead,
}: {
  onBack: () => void
  onRead: () => void
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    (async () => {
      try {
        const data = await fetchNotifications()
        if (active) setNotifications(data)
      } catch {
        // silent
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const handleMarkAll = async () => {
    setNotifications((list) => list.map((n) => ({ ...n, is_read: true })))
    onRead()
    try {
      await markAllNotificationsRead()
    } catch {
      // silent
    }
  }

  const unread = notifications.filter((n) => !n.is_read)

  return (
    <>
      <ScreenHeader title="Notifikasi" onBack={onBack}>
        {unread.length > 0 ? (
          <button
            type="button"
            onClick={handleMarkAll}
            className="mt-3 flex items-center gap-1.5 text-xs font-bold text-accent"
          >
            <CheckCheck className="size-3.5" aria-hidden="true" />
            Tandai semua dibaca
          </button>
        ) : null}
      </ScreenHeader>

      <div className="flex flex-col gap-2 p-4">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-card px-6 py-10 text-center ring-1 ring-border">
            <BellOff className="size-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-semibold">Belum ada notifikasi</p>
            <p className="text-xs text-muted-foreground">Notifikasi pesanan dan promo akan muncul di sini.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <article
              key={n.id}
              className={cn(
                'flex gap-3 rounded-xl p-3 ring-1 ring-border transition-colors',
                n.is_read ? 'bg-card' : 'bg-accent/10 ring-accent/30',
              )}
            >
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full',
                  n.is_read ? 'bg-secondary text-primary' : 'bg-accent text-accent-foreground',
                )}
              >
                <Bell className="size-4.5" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold leading-tight">{n.title}</p>
                  {!n.is_read && <span className="size-2 shrink-0 rounded-full bg-accent" aria-label="Belum dibaca" />}
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{n.body}</p>
                <p className="text-[10px] text-muted-foreground/80">{timeAgo(n.created_at)}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  )
}
