'use client'
import React, { useRef } from 'react'

type Champ = { rok: number; nazwa: string; logo?: string }

export default function ChampionsCarousel({ champions }: { champions: Champ[] }) {
  const ref = useRef<HTMLDivElement>(null)

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 460, behavior: 'smooth' })
  }

  return (
    <div className="relative mx-auto max-w-6xl px-4">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Poprzednie"
        className="absolute -left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-sky-500"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Następne"
        className="absolute -right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-sky-500"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto scroll-smooth px-1 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {champions.map((c, idx) => (
          <div
            key={idx}
            className="flex w-44 shrink-0 flex-col items-center rounded-xl bg-white p-5 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/20"
          >
            <div className="flex h-16 items-center justify-center">
              {c.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.logo} alt={c.nazwa} className="max-h-16 w-auto object-contain" />
              ) : (
                <span className="text-3xl font-bold text-slate-300">{c.rok}</span>
              )}
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">{c.nazwa}</p>
            <p className="text-xs font-medium text-sky-600">Mistrz Polski {c.rok}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
