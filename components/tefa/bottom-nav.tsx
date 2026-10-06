import { Home, LayoutGrid, ClipboardList, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NavTab = 'beranda' | 'kategori' | 'pesanan' | 'profil'

const items: { id: NavTab; label: string; icon: typeof Home }[] = [
  { id: 'beranda', label: 'Beranda', icon: Home },
  { id: 'kategori', label: 'Kategori', icon: LayoutGrid },
  { id: 'pesanan', label: 'Pesanan', icon: ClipboardList },
  { id: 'profil', label: 'Profil', icon: User },
]

export function BottomNav({
  active,
  onChange,
  orderBadge,
}: {
  active: string
  onChange: (tab: NavTab) => void
  orderBadge: number
}) {
  return (
    <nav aria-label="Navigasi utama" className="absolute inset-x-0 bottom-0 z-30 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-4">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          const badge = id === 'pesanan' ? orderBadge : 0
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" aria-hidden="true" />}
                <span className="relative">
                  <Icon className="size-5.5" strokeWidth={isActive ? 2.4 : 2} aria-hidden="true" />
                  {badge ? (
                    <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                      {badge}
                      <span className="sr-only"> pesanan aktif</span>
                    </span>
                  ) : null}
                </span>
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
