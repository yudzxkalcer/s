'use client'

import Image from 'next/image'
import { Heart, Minus, Plus, ShoppingCart, Store, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { discountPercent, formatRupiah } from './data'
import { ScreenHeader } from './screen-header'
import type { Product } from './types'

export function ProductDetailScreen({
  product: p,
  isFavorite,
  onToggleFavorite,
  onAdd,
  onBack,
}: {
  product: Product
  isFavorite: boolean
  onToggleFavorite: () => void
  onAdd: (id: string) => void
  onBack: () => void
}) {
  const discount = discountPercent(p)
  const stockStatus =
    p.stock === 0
      ? { label: 'Stok Habis', tone: 'text-destructive' }
      : p.stock <= 5
        ? { label: `Sisa ${p.stock} terakhir!`, tone: 'text-warning' }
        : { label: `Stok: ${p.stock}`, tone: 'text-muted-foreground' }

  return (
    <>
      <ScreenHeader title="Detail Produk" onBack={onBack} />

      <div className="flex flex-col gap-4 p-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
          <Image src={p.image || '/placeholder.svg'} alt={p.name} fill sizes="370px" className="object-cover" priority />
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-lg bg-destructive px-2.5 py-1 text-sm font-bold text-white shadow">
              -{discount}%
            </span>
          )}
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-card/90 shadow-md backdrop-blur transition-transform active:scale-90"
          >
            <Heart
              className={cn('size-5', isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground')}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-extrabold leading-tight">{p.name}</h2>
          <p className={cn('text-xs font-semibold', stockStatus.tone)}>{stockStatus.label}</p>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-2xl font-extrabold text-primary">{formatRupiah(p.price)}</span>
          <span className="mb-0.5 text-sm text-muted-foreground">
            <s>{formatRupiah(p.original_price)}</s>
          </span>
          <span className="mb-0.5 text-xs text-muted-foreground">/ {p.unit}</span>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-secondary px-3 py-2.5 text-primary">
          <Store className="size-4.5 shrink-0" aria-hidden="true" />
          <p className="text-xs font-semibold">Ambil di Koperasi TEFA &middot; Gedung B lantai 1</p>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-card p-3 ring-1 ring-border">
          <Package className="size-4.5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">
            Pesan sekarang, ambil di kasir jalur cepat. Tunjukkan kode pesanan saat pengambilan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAdd(p.id)}
          disabled={p.stock === 0}
          className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-extrabold text-accent-foreground shadow-sm transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="size-5" aria-hidden="true" />
          {p.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
        </button>
      </div>
    </>
  )
}
