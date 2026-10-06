import Image from 'next/image'
import { Plus, Heart } from 'lucide-react'
import { discountPercent, formatRupiah } from './data'
import type { Product } from './types'

export function ProductCard({
  product: p,
  onAdd,
  onClick,
}: {
  product: Product
  onAdd: (id: string) => void
  onClick: (product: Product) => void
}) {
  return (
    <li className="flex flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border">
      <button
        type="button"
        onClick={() => onClick(p)}
        className="relative aspect-square bg-muted text-left"
        aria-label={`Lihat detail ${p.name}`}
      >
        <Image src={p.image || '/placeholder.svg'} alt={p.name} fill sizes="180px" className="object-cover" />
        <span className="absolute left-2 top-2 rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">
          -{discountPercent(p)}%
        </span>
        {p.stock <= 5 && p.stock > 0 && (
          <span className="absolute right-2 top-2 rounded-md bg-warning px-1.5 py-0.5 text-[10px] font-bold text-warning-foreground">
            Sisa {p.stock}
          </span>
        )}
        {p.stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/60 text-xs font-bold text-foreground">
            Stok Habis
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <h3 className="line-clamp-2 min-h-[2.5em] text-xs font-semibold leading-tight">{p.name}</h3>
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-primary">{formatRupiah(p.price)}</p>
          <p className="text-[11px] text-muted-foreground">
            <span className="sr-only">Harga normal </span>
            <s>{formatRupiah(p.original_price)}</s>
            <span className="ml-1">/ {p.unit}</span>
          </p>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onAdd(p.id)}
            disabled={p.stock === 0}
            aria-label={`Tambah ${p.name} ke keranjang`}
            className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-primary text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Keranjang
          </button>
        </div>
      </div>
    </li>
  )
}
