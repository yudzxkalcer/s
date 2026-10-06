export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background sm:h-[844px] sm:max-h-[calc(100dvh-3rem)] sm:w-[390px] sm:rounded-[2.75rem] sm:border-[10px] sm:border-foreground sm:shadow-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-2 z-50 hidden h-6 w-28 -translate-x-1/2 rounded-full bg-foreground sm:block"
      />
      {children}
    </div>
  )
}
