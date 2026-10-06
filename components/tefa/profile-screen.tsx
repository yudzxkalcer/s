import { ChevronRight, ClipboardList, Gift, HelpCircle, LogOut, PlusCircle, ShoppingCart, Star, Wallet } from 'lucide-react'
import { formatRupiah } from './data'

export function ProfileScreen({
  points,
  balance,
  orderCount,
  onTopUp,
  onOpenOrders,
  onOpenCart,
}: {
  points: number
  balance: number
  orderCount: number
  onTopUp: () => void
  onOpenOrders: () => void
  onOpenCart: () => void
}) {
  const menu = [
    { label: 'Pesanan Saya', icon: ClipboardList, onClick: onOpenOrders },
    { label: 'Keranjang Belanja', icon: ShoppingCart, onClick: onOpenCart },
    { label: 'Tukar Poin', icon: Gift, tag: 'Segera' },
    { label: 'Bantuan & FAQ', icon: HelpCircle },
  ]

  return (
    <>
      <header className="bg-primary px-4 pb-14 pt-6 text-primary-foreground sm:pt-12">
        <h1 className="sr-only">Profil</h1>
        <div className="flex items-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent text-lg font-extrabold text-accent-foreground ring-4 ring-primary-foreground/20">
            RP
          </span>
          <div className="leading-tight">
            <p className="text-base font-bold">Rizky Pratama</p>
            <p className="text-xs text-primary-foreground/80">XI RPL 2 &middot; NIS 2024.0187</p>
          </div>
        </div>
      </header>

      <div className="-mt-10 flex flex-col gap-4 px-4 pb-4">
        <section aria-label="Ringkasan akun" className="grid grid-cols-3 divide-x divide-border rounded-xl bg-card py-3 text-center shadow-sm ring-1 ring-border">
          <div className="px-2">
            <Star className="mx-auto size-4 fill-accent text-accent" aria-hidden="true" />
            <p className="mt-1 text-sm font-bold">{points.toLocaleString('id-ID')}</p>
            <p className="text-[10px] text-muted-foreground">Poin</p>
          </div>
          <div className="px-2">
            <Wallet className="mx-auto size-4 text-primary" aria-hidden="true" />
            <p className="mt-1 text-sm font-bold">{formatRupiah(balance)}</p>
            <p className="text-[10px] text-muted-foreground">Saldo</p>
          </div>
          <div className="px-2">
            <ClipboardList className="mx-auto size-4 text-primary" aria-hidden="true" />
            <p className="mt-1 text-sm font-bold">{orderCount}</p>
            <p className="text-[10px] text-muted-foreground">Pesanan</p>
          </div>
        </section>

        <button
          type="button"
          onClick={onTopUp}
          className="flex items-center gap-3 rounded-xl bg-accent px-4 py-3 text-left text-accent-foreground shadow-sm active:scale-[0.99]"
        >
          <PlusCircle className="size-6 shrink-0" aria-hidden="true" />
          <span className="flex-1 leading-tight">
            <span className="block text-sm font-extrabold">Top Up Saldo Kantin</span>
            <span className="block text-[11px]">Tambah {formatRupiah(20000)} sekali ketuk</span>
          </span>
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>

        <ul className="flex flex-col divide-y divide-border rounded-xl bg-card ring-1 ring-border">
          {menu.map(({ label, icon: Icon, onClick, tag }) => (
            <li key={label}>
              <button
                type="button"
                onClick={onClick}
                disabled={!onClick}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-semibold transition-colors hover:bg-secondary/60 disabled:cursor-default disabled:hover:bg-transparent"
              >
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {tag ? <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">{tag}</span> : null}
                <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <button type="button" className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-destructive">
          <LogOut className="size-4" aria-hidden="true" />
          Keluar
        </button>
      </div>
    </>
  )
}
