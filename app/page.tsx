import { PhoneFrame } from '@/components/tefa/phone-frame'
import { TefaMartApp } from '@/components/tefa/tefa-mart-app'

export default function Page() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_top,oklch(0.9_0.06_230),oklch(0.96_0.04_95))] sm:p-6">
      <h1 className="sr-only">Tefa Mart — Minimarket Sekolah</h1>
      <PhoneFrame>
        <TefaMartApp />
      </PhoneFrame>
    </main>
  )
}
