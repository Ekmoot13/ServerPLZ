'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'

export type KlubItem = {
  id: number
  nazwa: string
  slug: string
  zawodnicy: number
}

export type Grupa = {
  poziom: string
  kluby: { id: number; nazwa: string; slug: string; miejsce: number }[]
}

function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
}

export default function KlubySearch({ allItems, groups }: { allItems: KlubItem[]; groups: Grupa[] }) {
  const [q, setQ] = useState('')
  const nq = norm(q.trim())

  const filtered = useMemo(() => {
    if (!nq) return []
    return allItems.filter((k) => norm(k.nazwa).includes(nq))
  }, [nq, allItems])

  return (
    <div>
      <div className="mb-8">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Szukaj dowolnego klubu po nazwie…"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {nq ? (
        // TRYB WYSZUKIWANIA — płaska lista wszystkich klubów
        <div>
          <p className="mb-4 text-sm text-slate-500">
            {filtered.length} {filtered.length === 1 ? 'klub' : 'klubów'}
          </p>
          {filtered.length === 0 ? (
            <p className="text-slate-500">Brak wyników dla „{q}".</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((k) => (
                <Link
                  key={k.id}
                  href={`/kluby/${k.slug}`}
                  className="group rounded-lg border border-slate-200 px-4 py-3 transition hover:border-sky-400 hover:shadow-sm"
                >
                  <span className="font-medium text-slate-800 group-hover:text-sky-600">{k.nazwa}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        // TRYB DOMYŚLNY — aktywne kluby wg poziomu ligi i miejsca w sezonie
        <div className="space-y-10">
          {groups.length === 0 ? (
            <p className="text-slate-500">Brak danych o bieżącym sezonie.</p>
          ) : (
            groups.map((g) => (
              <div key={g.poziom}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-xl font-bold uppercase tracking-wide text-sky-900">{g.poziom}</h2>
                  <div className="h-0.5 flex-1 bg-red-500/70" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {g.kluby.map((k) => (
                    <Link
                      key={k.id}
                      href={`/kluby/${k.slug}`}
                      className="group flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition hover:border-sky-400 hover:shadow-sm"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                        {k.miejsce}
                      </span>
                      <span className="font-medium text-slate-800 group-hover:text-sky-600">{k.nazwa}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
          <p className="pt-2 text-sm text-slate-400">
            Pokazujemy kluby z bieżącego sezonu. Pozostałe znajdziesz przez wyszukiwarkę powyżej.
          </p>
        </div>
      )}
    </div>
  )
}
