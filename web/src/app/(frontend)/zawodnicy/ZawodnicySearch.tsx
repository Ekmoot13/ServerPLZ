'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'

export type ZawodnikItem = {
  id: number
  imie: string
  nazwisko: string
  slug: string
  starty: number
}

function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
}

export default function ZawodnicySearch({ items }: { items: ZawodnikItem[] }) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const nq = norm(q.trim())
    if (!nq) return items
    return items.filter((z) => {
      const full = norm(`${z.imie} ${z.nazwisko}`)
      const rev = norm(`${z.nazwisko} ${z.imie}`)
      return full.includes(nq) || rev.includes(nq)
    })
  }, [q, items])

  return (
    <div>
      <div className="mb-6">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Szukaj zawodnika po imieniu lub nazwisku…"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
        <p className="mt-2 text-sm text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'zawodnik' : 'zawodników'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500">Brak wyników dla „{q}".</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((z) => (
            <Link
              key={z.id}
              href={`/zawodnicy/${z.slug}`}
              className="group flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 transition hover:border-sky-400 hover:shadow-sm"
            >
              <span className="font-medium text-slate-800 group-hover:text-sky-600">
                {z.imie} {z.nazwisko}
              </span>
              <span className="ml-3 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {z.starty} {z.starty === 1 ? 'start' : 'startów'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
