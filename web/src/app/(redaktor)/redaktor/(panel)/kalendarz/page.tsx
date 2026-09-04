import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { statusRegat, statusLabel, orderedPoziomy, poziomIndexMap } from '@/lib/kalendarz'
import PoziomyManager from './PoziomyManager'

export const dynamic = 'force-dynamic'

function fmt(d?: string): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return ''
  }
}

export default async function KalendarzListPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>
}) {
  const sp = await searchParams
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'kalendarz' as any, limit: 300, depth: 0, sort: 'dataOd' })
  const terminy = res.docs as any[]

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
    items.sort((a, b) => new Date(a.dataOd || 0).getTime() - new Date(b.dataOd || 0).getTime())
    return { poziom, items }
  })
  groups.sort((a, b) => (idx[a.poziom] ?? 999) - (idx[b.poziom] ?? 999))

  // lista do edytora kolejności: zapisane + wszystkie występujące poziomy
  const doEdytora = orderedPoziomy(zapisane, [...groupsMap.keys()]).filter((p) => p !== 'Inne')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kalendarz</h1>
        <Link
          href="/redaktor/kalendarz/nowy"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          + Nowy termin
        </Link>
      </div>

      <PoziomyManager initial={doEdytora} ok={sp?.ok === '1'} />

      {groups.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
          Brak terminów.
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g.poziom}>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-sky-500 to-red-500" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">{g.poziom}</h2>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                  {g.items.length}
                </span>
              </div>
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
                {g.items.map((t) => {
                  const s = statusRegat(t)
                  return (
                    <Link
                      key={t.id}
                      href={`/redaktor/kalendarz/${t.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                    >
                      <span className="min-w-0">
                        <span className="font-medium text-slate-800">{t.nazwa}</span>
                        <span className="ml-2 text-xs text-slate-400">
                          {fmt(t.dataOd)}
                          {t.miejsce ? ` · ${t.miejsce}` : ''}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            s === 'odbyly-sie'
                              ? 'bg-slate-200 text-slate-600'
                              : s === 'w-trakcie'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {statusLabel(s)}
                          {t.autoStatus === false ? ' (ręcznie)' : ''}
                        </span>
                        <span className="text-sky-600">Edytuj →</span>
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
