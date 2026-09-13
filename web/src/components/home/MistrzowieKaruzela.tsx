'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export type Mistrz = { rok: number; klub: string; logo: string | null; href?: string | null }
// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

function usePerView() {
  const [n, setN] = useState(5)
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w < 640) setN(2)
      else if (w < 1024) setN(3)
      else setN(5)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return n
}

export default function MistrzowieKaruzela({ items }: { items: Mistrz[] }) {
  const perView = usePerView()
  const maxIndex = Math.max(0, items.length - perView)
  const [index, setIndex] = useState(0)
  const paused = useRef(false)

  // trzymaj index w zakresie po zmianie perView
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  // auto-przewijanie o jeden co kilka sekund
  useEffect(() => {
    const t = setInterval(() => {
      if (paused.current) return
      setIndex((i) => (i >= maxIndex ? 0 : i + 1))
    }, 4000)
    return () => clearInterval(t)
  }, [maxIndex])

  const go = (i: number) => setIndex(Math.max(0, Math.min(i, maxIndex)))

  return (
    <div
      className="relative md:px-12"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <button
        onClick={() => go(index - 1)}
        aria-label="Poprzednie"
        className="absolute left-0 top-[46%] z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 text-navy shadow-md ring-1 ring-slate-200 hover:bg-slate-50 md:block"
      >
        ‹
      </button>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
        >
          {items.map((m, i) => {
            const karta = (
              <div className="flex h-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-md">
                <div className="flex h-24 items-center justify-center">
                  {m.logo ? (
                    <Img src={m.logo} alt={m.klub} className="max-h-20 w-auto object-contain" />
                  ) : (
                    <span className="text-sm font-bold text-navy">{m.klub}</span>
                  )}
                </div>
                <div className="mt-3 text-sm font-bold leading-tight text-navy">
                  {m.klub}
                  <br />
                  Mistrz Polski {m.rok}
                </div>
              </div>
            )
            return (
              <div key={i} className="shrink-0 p-2" style={{ width: `${100 / perView}%` }}>
                {m.href ? (
                  <Link href={m.href} className="block h-full">
                    {karta}
                  </Link>
                ) : (
                  karta
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button
        onClick={() => go(index + 1)}
        aria-label="Następne"
        className="absolute right-0 top-[46%] z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 text-navy shadow-md ring-1 ring-slate-200 hover:bg-slate-50 md:block"
      >
        ›
      </button>

      {/* KROPKI */}
      <div className="mt-5 flex justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Przejdź do ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-brand-red' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
