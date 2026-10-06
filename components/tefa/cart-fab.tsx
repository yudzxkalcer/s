import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CartFab({ count, bump, onClick }: { count: number; bump: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Keranjang, ${count} barang`}
      className={cn(
        'absolute bottom-20 right-4 z-30 flex h-12 items-center gap-2 rounded-full bg-accent pl-3.5 pr-4 text-accent-foreground shadow-lg ring-4 ring-background transition-transform',
        bump && 'scale-110',
      )}
    >
      <span className="relative">
        <ShoppingCart className="size-5" aria-hidden="true" />
        {count > 0 ? (
          <span className="absolute -right-2.5 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white" aria-hidden="true">
            {count}
          </span>
        ) : null}
      </span>
      <span className="text-sm font-bold">Keranjang</span>
    </button>
  )
}
