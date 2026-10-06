'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle2, ClipboardList, Loader2, PackageCheck, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRupiah } from './data'
import { ScreenHeader } from './screen-header'
import type { Order, OrderStatus } from './types'

const statusStyle: Record<OrderStatus, { label: string; className: string }> = {
  diproses: { label: 'Disiapkan', className: 'bg-secondary text-primary' },
  siap: { label: 'Siap Diambil', className: 'bg-accent text-accent-foreground' },
  selesai: { label: 'Selesai', className: 'bg-muted text-muted-foreground' },
}

export function OrdersScreen({
  orders,
  onPicked,
  onReorder,
  onShop,
}: {
  orders: Order[]
  onPicked: (id: string) => void
  onReorder: (order: Order) => void
  onShop: () => void
}) {
  const [view, setView] = useState<'aktif' | 'riwayat'>('aktif')
  const active = orders.filter((o) => o.status !== 'selesai')
  const history = orders.filter((o) => o.status === 'selesai')
  const list = view === 'aktif' ? active : history

  return (
    <>
      <ScreenHeader title="Pesanan Saya">
        <div className="mt-3 grid grid-cols-2 rounded-full bg-primary-foreground/15 p-1" role="tablist" aria-label="Jenis pesanan">
          {(['aktif', 'riwayat'] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={cn(
                'rounded-full py-1.5 text-xs font-bold transition-colors',
                view === v ? 'bg-card text-primary' : 'text-primary-foreground/85',
              )}
            >
              {v === 'aktif' ? `Aktif (${active.length})` : `Riwayat (${history.length})`}
            </button>
          ))}
        </div>
      </ScreenHeader>

      <div className="flex flex-col gap-3 p-4">
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-card px-6 py-10 text-center ring-1 ring-border">
            <ClipboardList className="size-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-semibold">{view === 'aktif' ? 'Tidak ada pesanan aktif' : 'Belum ada riwayat'}</p>
            <button type="button" onClick={onShop} className="mt-1 text-xs font-bold text-primary">
              Belanja sekarang
            </button>
          </div>
        ) : (
          list.map((o) => <OrderCard key={o.id} order={o} onPicked={onPicked} onReorder={onReorder} />)
        )}
      </div>
    </>
  )
}

function OrderCard({ order: o, onPicked, onReorder }: { order: Order; onPicked: (id: string) => void; onReorder: (o: Order) => void }) {
  const status = statusStyle[o.status]
  return (
    <article className="flex flex-col gap-3 rounded-xl bg-card p-3 shadow-sm ring-1 ring-border">
      <div className="flex items-center justify-between">
        <div className="leading-tight">
          <p className="text-sm font-bold">{o.code}</p>
          <p className="text-[11px] text-muted-foreground">{o.pickup_time}</p>
        </div>
        <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold', status.className)}>{status.label}</span>
      </div>

      <ul className="flex flex-col gap-2">
        {o.items.map(({ product_id, qty, product: p }) => {
          if (!p) return null
          return (
            <li key={product_id} className="flex items-center gap-2.5">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image src={p.image || '/placeholder.svg'} alt="" fill sizes="40px" className="object-cover" />
              </div>
              <p className="flex-1 truncate text-xs font-medium">{p.name}</p>
              <span className="text-xs text-muted-foreground">x{qty}</span>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center justify-between border-t border-border pt-2.5 text-sm">
        <span className="text-muted-foreground">Total</span>
        <span className="font-extrabold text-primary">{formatRupiah(o.total)}</span>
      </div>

      {o.status === 'diproses' ? (
        <p className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-primary">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Pesananmu sedang disiapkan petugas koperasi...
        </p>
      ) : null}

      {o.status === 'siap' ? (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-accent bg-accent/15 px-3 py-2.5">
            <PackageCheck className="size-6 shrink-0 text-accent-foreground" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-[11px] text-muted-foreground">Tunjukkan kode ini di kasir</p>
              <p className="text-xl font-extrabold tracking-widest">{o.code}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPicked(o.id)}
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-bold text-primary-foreground active:scale-[0.98]"
          >
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Sudah Diambil
          </button>
        </div>
      ) : null}

      {o.status === 'selesai' ? (
        <button
          type="button"
          onClick={() => onReorder(o)}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-primary text-xs font-bold text-primary hover:bg-secondary"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Beli Lagi
        </button>
      ) : null}
    </article>
  )
}
