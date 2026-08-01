'use client'
import React, { useEffect, useRef, useState } from 'react'

type Item = { url: string; nazwa: string }

export default function SponsorRow({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [overflowing, setOverflowing] = useState(false)

  useEffect(() => {
    const check = () => {
      const el = ref.current
      if (el) setOverflowing(el.scrollWidth > el.clientWidth + 4)
    }
    // obrazki doładowują się async — sprawdź kilka razy
    const timers = [0, 300, 800, 1500].map((d) => setTimeout(check, d))
    window.addEventListener('resize', check)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('resize', check)
    }
  }, [items])

  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 420, behavior: 'smooth' })

  return (
    <div className="relative mx-auto max-w-6xl px-10">
      {overflowing && (
        <>
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Poprzednie"
            className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-sky-500 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Następne"
            className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-sky-500 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
      <div
        ref={ref}
        className={`flex items-center gap-14 overflow-x-auto scroll-smooth px-2 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          overflowing ? 'justify-start' : 'justify-center'
        }`}
      >
        {items.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={s.url}
            alt={s.nazwa}
            title={s.nazwa}
            className="h-16 w-auto max-w-[170px] shrink-0 object-contain opacity-80 transition duration-300 hover:scale-110 hover:opacity-100"
          />
        ))}
      </div>
    </div>
  )
}
