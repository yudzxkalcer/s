import Image from 'next/image'
import { Plus, Sparkles, Clock } from 'lucide-react'
import { aiPickIds, formatRupiah } from './data'
import type { Product } from './types'

export function AiSmartPick({
  products,
  onAdd,
}: {
  products: Product[]
  onAdd: (id: string) => void
}) {
  const picks = products.filter((p) => aiPickIds.includes(p.id))

  return (
    <section aria-labelledby="ai-title" className="mx-4 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.5_0.15_255)] p-4 text-primary-foreground shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-accent">
            <Sparkles className="size-3.5" aria-hidden="true" />
            AI Smart Pick
          </p>
          <h2 id="ai-title" className="mt-0.5 text-base font-bold leading-snug text-balance">
            Rekomendasi AI Buat Kamu Hari Ini
          </h2>
        </div>
      </div>
      <p className="mt-1 text-xs text-primary-foreground/80">Berdasarkan barang yang sering kamu beli</p>

      <ul className="mt-3 grid grid-cols-3 gap-2">
        {picks.map((p) => (
          <li key={p.id} className="flex flex-col overflow-hidden rounded-xl bg-card text-foreground">
            <div className="relative aspect-square bg-muted">
              <Image src={p.image || '/placeholder.svg'} alt={p.name} fill sizes="120px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-1 p-2">
              <span className="flex w-fit items-center gap-0.5 rounded bg-accent px-1 py-0.5 text-[8.5px] font-bold leading-tight text-accent-foreground">
                <Clock className="size-2.5 shrink-0" aria-hidden="true" />
                Cocok untuk jam kosong
              </span>
              <p className="line-clamp-2 text-[11px] font-semibold leading-tight">{p.name}</p>
              <div className="mt-auto flex items-center justify-between gap-1">
                <span className="whitespace-nowrap text-[11px] font-bold text-primary">{formatRupiah(p.price)}</span>
                <button
                  type="button"
                  onClick={() => onAdd(p.id)}
                  aria-label={`Tambah ${p.name} ke keranjang`}
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-90"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
