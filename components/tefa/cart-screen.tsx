import Image from 'next/image'
import { Minus, Plus, ShoppingCart, Store, Trash2, Wallet } from 'lucide-react'
import { formatRupiah } from './data'
import { ScreenHeader } from './screen-header'
import type { Product, Cart } from './types'

export function CartScreen({
  cart,
  products,
  balance,
  onQtyChange,
  onCheckout,
  onBack,
}: {
  cart: Cart
  products: Product[]
  balance: number
  onQtyChange: (id: string, qty: number) => void
  onCheckout: () => void
  onBack: () => void
}) {
  const lines = Object.entries(cart).flatMap(([id, qty]) => {
    const product = products.find((p) => p.id === id)
    return product ? [{ product, qty }] : []
  })
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0)
  const saved = lines.reduce((s, l) => s + (l.product.original_price - l.product.price) * l.qty, 0)
  const itemCount = lines.reduce((s, l) => s + l.qty, 0)
  const insufficient = total > balance

  if (lines.length === 0) {
    return (
      <>
        <ScreenHeader title="Keranjang" onBack={onBack} />
        <div className="flex flex-col items-center gap-3 px-8 py-20 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-secondary text-primary">
            <ShoppingCart className="size-9" aria-hidden="true" />
          </span>
          <p className="text-base font-bold">Keranjangmu masih kosong</p>
          <p className="text-sm text-muted-foreground">Yuk, pilih jajanan atau ATK favoritmu dulu.</p>
          <button type="button" onClick={onBack} className="mt-2 h-10 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground">
            Mulai Belanja
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <ScreenHeader title={`Keranjang (${itemCount})`} onBack={onBack} />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2.5 rounded-xl bg-secondary px-3 py-2.5 text-primary">
          <Store className="size-4.5 shrink-0" aria-hidden="true" />
          <p className="text-xs font-semibold">Ambil di Koperasi TEFA &middot; Gedung B lantai 1</p>
        </div>

        <ul className="flex flex-col divide-y divide-border rounded-xl bg-card ring-1 ring-border">
          {lines.map(({ product: p, qty }) => (
            <li key={p.id} className="flex gap-3 p-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={p.image || '/placeholder.svg'} alt={p.name} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="line-clamp-2 text-xs font-semibold leading-tight">{p.name}</p>
                <p className="text-sm font-extrabold text-primary">{formatRupiah(p.price)}</p>
                <div className="mt-auto flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onQtyChange(p.id, 0)}
                    aria-label={`Hapus ${p.name}`}
                    className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                  <div className="flex items-center rounded-full ring-1 ring-border">
                    <button
                      type="button"
                      onClick={() => onQtyChange(p.id, qty - 1)}
                      aria-label={`Kurangi ${p.name}`}
                      className="flex size-7 items-center justify-center rounded-full text-primary hover:bg-secondary"
                    >
                      <Minus className="size-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onQtyChange(p.id, qty + 1)}
                      aria-label={`Tambah ${p.name}`}
                      className="flex size-7 items-center justify-center rounded-full text-primary hover:bg-secondary"
                    >
                      <Plus className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <section aria-label="Ringkasan belanja" className="flex flex-col gap-2 rounded-xl bg-card p-3 text-sm ring-1 ring-border">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({itemCount} barang)</span>
            <span className="font-semibold">{formatRupiah(total + saved)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hemat promo siswa</span>
            <span className="font-semibold text-destructive">-{formatRupiah(saved)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="font-bold">Total</span>
            <span className="font-extrabold text-primary">{formatRupiah(total)}</span>
          </div>
        </section>

        <div className="flex items-center gap-2.5 rounded-xl bg-card p-3 ring-1 ring-border">
          <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary">
            <Wallet className="size-4" aria-hidden="true" />
          </span>
          <div className="flex-1 leading-tight">
            <p className="text-xs font-semibold">Bayar pakai Saldo Kantin</p>
            <p className="text-[11px] text-muted-foreground">Sisa saldo {formatRupiah(balance)}</p>
          </div>
        </div>
        {insufficient ? (
          <p role="alert" className="text-xs font-semibold text-destructive">
            Saldo tidak cukup. Top up di menu Profil terlebih dulu.
          </p>
        ) : null}

        <button
          type="button"
          onClick={onCheckout}
          disabled={insufficient}
          className="h-12 rounded-xl bg-accent text-sm font-extrabold text-accent-foreground shadow-sm transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Bayar & Pesan &middot; {formatRupiah(total)}
        </button>
      </div>
    </>
  )
}
