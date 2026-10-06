'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const banners = [
  {
    id: 'istirahat',
    image: '/images/banner-istirahat.png',
    tag: 'Paket Istirahat',
    title: 'Roti + Susu Cuma 10rb',
    note: 'Berlaku jam 09.30 – 10.00',
    tone: 'bg-gradient-to-r from-primary via-primary/85 to-transparent text-primary-foreground',
    tagTone: 'bg-accent text-accent-foreground',
  },
  {
    id: 'buku',
    image: '/images/banner-buku.png',
    tag: 'Jelang Ujian',
    title: 'Diskon Buku Tulis s.d. 25%',
    note: 'Stok terbatas, buruan!',
    tone: 'bg-gradient-to-r from-accent via-accent/85 to-transparent text-accent-foreground',
    tagTone: 'bg-primary text-primary-foreground',
  },
]

export function HeroCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const goTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    const id = setInterval(() => {
      const track = trackRef.current
      if (!track) return
      const current = Math.round(track.scrollLeft / track.clientWidth)
      const next = (current + 1) % banners.length
      track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' })
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <section aria-label="Promo" aria-roledescription="carousel" className="px-4">
      <div
        ref={trackRef}
        onScroll={(e) => {
          const t = e.currentTarget
          setActive(Math.round(t.scrollLeft / t.clientWidth))
        }}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl"
      >
        {banners.map((b, i) => (
          <div
            key={b.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${banners.length}`}
            className="relative aspect-[2/1] w-full shrink-0 snap-center overflow-hidden"
          >
            <Image src={b.image || "/placeholder.svg"} alt="" fill sizes="370px" className="object-cover" priority={i === 0} />
            <div className={cn('absolute inset-0 flex flex-col justify-center gap-1 p-4 pr-[40%]', b.tone)}>
              <span className={cn('w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', b.tagTone)}>
                {b.tag}
              </span>
              <p className="text-lg font-extrabold leading-tight text-balance">{b.title}</p>
              <p className="text-[11px] font-medium opacity-90">{b.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {banners.map((b, i) => (
          <button
            key={b.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Lihat promo ${i + 1}`}
            aria-current={active === i}
            className={cn(
              'h-1.5 rounded-full transition-all',
              active === i ? 'w-5 bg-primary' : 'w-1.5 bg-primary/25',
            )}
          />
        ))}
      </div>
    </section>
  )
}
