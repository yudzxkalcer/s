'use client'

import { useState } from 'react'
import { LayoutGrid, Search, PackageSearch } from 'lucide-react'
import { cn } from '@/lib/utils'
import { categories } from './data'
import { ProductCard } from './product-card'
import { ScreenHeader } from './screen-header'
import type { Product, CategoryId } from './types'

export type CategoryFilter = CategoryId | 'semua'

export function CategoryScreen({
  products,
  category,
  onCategoryChange,
  onAdd,
  onProductClick,
  autoFocusSearch,
}: {
  products: Product[]
  category: CategoryFilter
  onCategoryChange: (c: CategoryFilter) => void
  onAdd: (id: string) => void
  onProductClick: (product: Product) => void
  autoFocusSearch: boolean
}) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const visible = products.filter(
    (p) => (category === 'semua' || p.category === category) && (!q || p.name.toLowerCase().includes(q)),
  )
  const chips = [{ id: 'semua' as const, label: 'Semua', icon: LayoutGrid }, ...categories]

  return (
    <>
      <ScreenHeader title="Kategori">
        <label className="relative mt-3 block">
          <span className="sr-only">Cari produk</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            autoFocus={autoFocusSearch}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari jajanan atau ATK..."
            className="h-9 w-full rounded-full bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
      </ScreenHeader>

      <div className="no-scrollbar sticky top-0 flex gap-2 overflow-x-auto px-4 py-3" role="tablist" aria-label="Filter kategori">
        {chips.map(({ id, label, icon: Icon }) => {
          const active = category === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onCategoryChange(id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors',
                active ? 'bg-primary text-primary-foreground ring-primary' : 'bg-card text-foreground ring-border hover:bg-secondary',
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
            </button>
          )
        })}
      </div>

      <section className="px-4 pb-4" aria-live="polite">
        <p className="mb-3 text-xs text-muted-foreground">{visible.length} produk ditemukan</p>
        {visible.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={onAdd} onClick={onProductClick} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-card px-6 py-10 text-center ring-1 ring-border">
            <PackageSearch className="size-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-semibold">Produk tidak ditemukan</p>
            <p className="text-xs text-muted-foreground">Coba kata kunci atau kategori lain.</p>
          </div>
        )}
      </section>
    </>
  )
}
