import { Bell, Search, Star, Wallet, Store } from 'lucide-react'
import { formatRupiah } from './data'

export function AppHeader({
  points,
  balance,
  unreadCount = 0,
  onSearch,
  onNotifications,
}: {
  points: number
  balance: number
  unreadCount?: number
  onSearch: () => void
  onNotifications: () => void
}) {
  return (
    <header className="sticky top-0 z-30 bg-primary px-4 pb-3 pt-4 text-primary-foreground shadow-sm sm:pt-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Store className="size-4.5" aria-hidden="true" />
          </span>
          <span className="text-lg font-extrabold leading-none tracking-tight">
            Tefa<span className="text-accent">Mart</span>
          </span>
        </div>
        <label className="relative flex-1">
          <span className="sr-only">Cari produk</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="Cari jajanan atau ATK..."
            readOnly
            onClick={onSearch}
            onFocus={onSearch}
            className="h-9 w-full rounded-full bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
        <button
          type="button"
          onClick={onNotifications}
          aria-label={`Notifikasi${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ''}`}
          className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25"
        >
          <Bell className="size-5" aria-hidden="true" />
          {unreadCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          ) : null}
        </button>
      </div>

      <div className="mt-3 flex items-stretch rounded-xl bg-card text-foreground shadow-sm">
        <div className="flex flex-1 items-center gap-2.5 px-3 py-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-accent/40 text-accent-foreground">
            <Star className="size-4 fill-current" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] text-muted-foreground">Poin Siswa</p>
            <p className="text-sm font-bold">{points.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="my-2 w-px bg-border" aria-hidden="true" />
        <div className="flex flex-1 items-center gap-2.5 px-3 py-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary">
            <Wallet className="size-4" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] text-muted-foreground">Saldo Kantin</p>
            <p className="text-sm font-bold">{formatRupiah(balance)}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
