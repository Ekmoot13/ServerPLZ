// Kalendarz regat — grupowany wg poziomu ligi, edytowalny w panelu.
// Status liczony na bieżąco z daty (chyba że redaktor wyłączył automat). Odbyte są wyszarzone.
import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { statusRegat, orderedPoziomy, poziomIndexMap } from '@/lib/kalendarz'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Kalendarz — Polska Liga Żeglarska' }

const MIES = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
]

function fancyDate(od?: string | null, doo?: string | null): string {
  if (!od) return ''
  const a = new Date(od)
  const b = doo ? new Date(doo) : null
  const y = a.getFullYear()
  if (!b || (a.getMonth() === b.getMonth() && a.getDate() === b.getDate())) {
    return `${a.getDate()} ${MIES[a.getMonth()]} ${y}`
  }
  if (a.getMonth() === b.getMonth()) {
    return `${a.getDate()}–${b.getDate()} ${MIES[a.getMonth()]} ${y}`
  }
  return `${a.getDate()} ${MIES[a.getMonth()]} – ${b.getDate()} ${MIES[b.getMonth()]} ${y}`
}

// krótka etykieta (np. "Runda 1") wyciągnięta z nazwy, inaczej cała nazwa
function shortLabel(nazwa: string): string {
  const m = (nazwa || '').match(/runda\s*\d+/i)
  return m ? m[0].replace(/^r/, 'R') : nazwa
}

export default async function KalendarzPage() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({ collection: 'kalendarz' as any, limit: 300, depth: 0, sort: 'dataOd' })
  const terminy = res.docs as any[]

  // kolejność poziomów ustawiona przez redaktora (globalny obiekt)
  const ustawienia: any = await payload
    .findGlobal({ slug: 'kalendarz-ustawienia' as any })
    .catch(() => null)
  const zapisane: string[] = Array.isArray(ustawienia?.poziomy)
    ? ustawienia.poziomy.map((p: any) => (p?.nazwa || '').trim()).filter(Boolean)
    : []

  // grupowanie po poziomie
  const groupsMap = new Map<string, any[]>()
  for (const t of terminy) {
    const key = (t.poziom || 'Inne').trim() || 'Inne'
    if (!groupsMap.has(key)) groupsMap.set(key, [])
    groupsMap.get(key)!.push(t)
  }

  const kolejnosc = orderedPoziomy(zapisane, [...groupsMap.keys()])
  const idx = poziomIndexMap(kolejnosc)

  const groups = [...groupsMap.entries()].map(([poziom, items]) => {
    // regaty w obrębie ligi zawsze po dacie (rosnąco)
    items.sort((a, b) => new Date(a.dataOd || 0).getTime() - new Date(b.dataOd || 0).getTime())
    return { poziom, items }
  })
  groups.sort((a, b) => {
    const oa = idx[a.poziom] ?? 999
    const ob = idx[b.poziom] ?? 999
    return oa - ob
  })

  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Sezon 2026</p>
          <h1 className="text-4xl font-bold md:text-5xl">Kalendarz regat</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Terminy i miejsca rozgrywek Polskiej Ligi Żeglarskiej. Statusy aktualizują się automatycznie.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {groups.length === 0 ? (
          <p className="text-slate-500">Kalendarz jest pusty — dodaj terminy w panelu.</p>
        ) : (
          <div className="space-y-14">
            {groups.map((g) => (
              <div key={g.poziom}>
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-8 w-1.5 rounded-full bg-gradient-to-b from-sky-500 to-red-500" />
                  <h2 className="text-2xl font-extrabold uppercase tracking-wide text-slate-900">{g.poziom}</h2>
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {g.items.length}
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {g.items.map((t) => {
                    const s = statusRegat(t)
                    const past = s === 'odbyly-sie'
                    const live = s === 'w-trakcie'
                    const accent = live
                      ? 'from-red-500 to-orange-500'
                      : past
                        ? 'from-slate-400 to-slate-500'
                        : 'from-sky-500 to-indigo-500'
                    const inner = (
                      <div
                        className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 ${
                          past ? 'border-slate-200 opacity-70' : 'border-slate-200 hover:-translate-y-1 hover:shadow-lg'
                        } ${live ? 'ring-2 ring-red-500/70' : ''}`}
                      >
                        <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />
                        <div className="p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              {shortLabel(t.nazwa)}
                            </span>
                            {live && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                                NA ŻYWO
                              </span>
                            )}
                            {past && <span className="text-emerald-600" title="Odbyły się">✓</span>}
                          </div>
                          <div className={`text-xl font-extrabold leading-tight ${past ? 'text-slate-500' : 'text-slate-900'}`}>
                            {fancyDate(t.dataOd, t.dataDo)}
                          </div>
                          {t.miejsce && (
                            <div className="mt-1 text-sm font-medium text-slate-500">📍 {t.miejsce}</div>
                          )}
                          {t.link && (
                            <span className="mt-3 inline-block text-sm font-medium text-sky-600 group-hover:underline">
                              {live ? 'Śledź na żywo →' : past ? 'Wyniki →' : 'Szczegóły →'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                    return t.link ? (
                      <a key={t.id} href={t.link} target="_blank" rel="noopener noreferrer" className="block">
                        {inner}
                      </a>
                    ) : (
                      <div key={t.id}>{inner}</div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
