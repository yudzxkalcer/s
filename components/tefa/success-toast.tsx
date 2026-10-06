import { CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SuccessToast({
  visible,
  message,
  onClose,
}: {
  visible: boolean
  message: string
  onClose: () => void
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'absolute inset-x-3 top-3 z-50 transition-all duration-300 sm:top-9',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0',
      )}
    >
      {visible && (
        <div className="flex items-start gap-2.5 rounded-xl bg-success p-3 text-success-foreground shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p className="flex-1 text-sm font-medium leading-snug">
            <span className="font-bold">{message}</span>
          </p>
          <button type="button" onClick={onClose} aria-label="Tutup notifikasi" className="rounded p-0.5 hover:bg-white/15">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
