'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'

export type NewsItem = {
  id: string
  slug: string
  title: string
  dateLabel: string // sformatowana data (na serwerze) — bez rozjazdu hydracji
  year: number | null
  image: string | null
  category: string | null
}

const KROK = 9

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

const selCls =
  'rounded-lg border-2 border-navy/15 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-navy'

export default function NewsyLista({ items }: { items: NewsItem[] }) {
  const [kategoria, setKategoria] = useState('all')
  const [rok, setRok] = useState('all')
  const [q, setQ] = useState('')
  const [ile, setIle] = useState(KROK)

  const kategorie = useMemo(
    () => [...new Set(items.map((i) => i.category).filter(Boolean))] as string[],
    [items],
  )
  const lata = useMemo(
    () =>
      [...new Set(items.map((i) => i.year).filter(Boolean))].sort((a, b) => (b as number) - (a as number)) as number[],
    [items],
  )

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return items.filter((i) => {
      if (kategoria !== 'all' && i.category !== kategoria) return false
      if (rok !== 'all' && String(i.year) !== rok) return false
      if (qq && !i.title.toLowerCase().includes(qq)) return false
      return true
    })
  }, [items, kategoria, rok, q])

  // reset licznika przy zmianie filtrów
  const filterKey = `${kategoria}|${rok}|${q}`
  const [lastKey, setLastKey] = useState(filterKey)
  if (filterKey !== lastKey) {
    setLastKey(filterKey)
    setIle(KROK)
  }

  const widoczne = filtered.slice(0, ile)

  return (
    <div>
      {/* WYSZUKIWARKA */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select value={kategoria} onChange={(e) => setKategoria(e.target.value)} className={selCls}>
          <option value="all">Wszystkie aktualności</option>
          {kategorie.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <select value={rok} onChange={(e) => setRok(e.target.value)} className={selCls}>
          <option value="all">Wybierz rok</option>
          {lata.map((r) => (
            <option key={r} value={String(r)}>
              {r}
            </option>
          ))}
        </select>
        <div className="flex flex-1 items-stretch overflow-hidden rounded-lg border-2 border-navy/15 bg-white">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Szukaj…"
            className="min-w-0 flex-1 px-3 py-2 text-sm text-navy outline-none"
          />
          <span className="flex items-center bg-navy px-5 text-sm font-bold uppercase tracking-wide text-white">
            Szukaj
          </span>
        </div>
      </div>

      {/* LISTA */}
      {widoczne.length === 0 ? (
        <p className="py-10 text-center text-slate-500">Brak newsów spełniających kryteria.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {widoczne.map((p) => (
            <Link
              key={p.id}
              href={`/posts/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border-2 border-navy/10 bg-white transition hover:border-brand-red hover:shadow-lg"
            >
              {p.image ? (
                <Img src={p.image} alt={p.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 w-full bg-slate-100" />
              )}
              <div className="flex flex-1 flex-col p-4">
                {p.category && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-red">{p.category}</span>
                )}
                <h2 className="mt-1 font-bold leading-snug text-navy group-hover:text-brand-red">{p.title}</h2>
                <p className="mt-auto pt-3 text-sm text-slate-500">{p.dateLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ZOBACZ WIĘCEJ */}
      {ile < filtered.length && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setIle((n) => n + KROK)}
            className="rounded-[10px] bg-navy px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-navy-800"
          >
            Zobacz więcej
          </button>
        </div>
      )}
    </div>
  )
}
