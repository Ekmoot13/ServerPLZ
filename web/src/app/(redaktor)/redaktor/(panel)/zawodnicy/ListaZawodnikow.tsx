'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'

export type Item = { id: string; imie: string; nazwisko: string }

function norm(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l')
}

export default function ListaZawodnikow({ items }: { items: Item[] }) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const nq = norm(q.trim())
    if (!nq) return items
    return items.filter((z) => norm(`${z.imie} ${z.nazwisko}`).includes(nq) || norm(`${z.nazwisko} ${z.imie}`).includes(nq))
  }, [q, items])

  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Szukaj zawodnika…"
        className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
      />
      <p className="mb-3 text-sm text-slate-500">{filtered.length} zawodników</p>
      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
        {filtered.slice(0, 300).map((z) => (
          <Link
            key={z.id}
            href={`/redaktor/zawodnicy/${z.id}`}
            className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50"
          >
            <span className="font-medium text-slate-800">
              {z.imie} {z.nazwisko}
            </span>
            <span className="text-sky-600">Edytuj →</span>
          </Link>
        ))}
      </div>
      {filtered.length > 300 && (
        <p className="mt-3 text-sm text-slate-400">Pokazano pierwszych 300 — zawęź wyszukiwaniem.</p>
      )}
    </div>
  )
}
