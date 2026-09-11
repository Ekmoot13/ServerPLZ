'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'

export type Item = {
  id: string
  nazwa: string
  poziomLigi?: string
  idZestawienia?: number | null
  tryb?: 'zestawienie' | 'warianty'
  liczbaWariantow?: number
  wykluczone?: number
}

function norm(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l')
}

export default function ListaKlubow({ items }: { items: Item[] }) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const nq = norm(q.trim())
    if (!nq) return items
    return items.filter((k) => norm(k.nazwa).includes(nq))
  }, [q, items])

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Szukaj klubu…"
        className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
      />
      <p className="mb-3 text-sm text-slate-500">{filtered.length} klubów</p>
      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
        {filtered.map((k) => (
          <Link
            key={k.id}
            href={`/redaktor/kluby/${k.id}`}
            className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50"
          >
            <span className="font-medium text-slate-800">{k.nazwa}</span>
            <span className="flex items-center gap-3">
              {k.tryb === 'warianty' ? (
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-700 ring-1 ring-sky-200">
                  {k.liczbaWariantow ? `${k.liczbaWariantow} wariant(y)` : 'warianty: brak'}
                </span>
              ) : k.idZestawienia != null ? (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-200">
                  #{k.idZestawienia}
                  {k.wykluczone ? ` · −${k.wykluczone}` : ''}
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700 ring-1 ring-amber-200">
                  brak powiązania
                </span>
              )}
              {k.poziomLigi && <span className="text-xs text-slate-400">{k.poziomLigi}</span>}
              <span className="text-sky-600">Edytuj →</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
