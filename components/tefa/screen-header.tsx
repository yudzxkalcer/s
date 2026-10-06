import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export function ScreenHeader({ title, onBack, children }: { title: string; onBack?: () => void; children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 bg-primary px-4 pb-3 pt-4 text-primary-foreground shadow-sm sm:pt-10">
      <div className="flex h-9 items-center gap-2">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Kembali"
            className="-ml-1.5 flex size-9 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/15"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
        ) : null}
        <h1 className="text-lg font-extrabold tracking-tight">{title}</h1>
      </div>
      {children}
    </header>
  )
}
