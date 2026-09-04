// Kalendarz regat — edytowalny w panelu. Status liczony na bieżąco z daty (chyba że redaktor
// wyłączył automat i ustawił ręcznie). Odbyte regaty są wyszarzone.
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { statusRegat, statusLabel } from '@/lib/kalendarz'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Kalendarz — Polska Liga Żeglarska' }

function fmtDate(d?: string | null): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return ''
  }
}
function fmtRange(od?: string | null, doo?: string | null): string {
  const a = fmtDate(od)
  const b = doo ? fmtDate(doo) : ''
  if (b && b !== a) return `${a} – ${b}`
  return a
}

export default async function KalendarzPage() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({ collection: 'kalendarz' as any, limit: 300, depth: 0, sort: 'dataOd' })
  const terminy = (res.docs as any[]).slice().sort((a, b) => {
    const ka = a.kolejnosc ?? 1e9
    const kb = b.kolejnosc ?? 1e9
    if (ka !== kb) return ka - kb
    return new Date(a.dataOd || 0).getTime() - new Date(b.dataOd || 0).getTime()
  })

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h1 className="text-4xl font-bold md:text-5xl">Kalendarz</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Terminy i miejsca regat Polskiej Ligi Żeglarskiej w sezonie.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        {terminy.length === 0 ? (
          <p className="text-slate-500">Kalendarz jest pusty — dodaj terminy w panelu.</p>
        ) : (
          <div className="space-y-4">
            {terminy.map((t) => {
              const s = statusRegat(t)
              const past = s === 'odbyly-sie'
              const live = s === 'w-trakcie'
              return (
                <div
                  key={t.id}
                  className={`flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
                    past ? 'border-slate-200 bg-slate-50 opacity-70' : 'border-slate-200 bg-white'
                  } ${live ? 'ring-2 ring-red-500/60' : ''}`}
                >
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      {t.poziom && (
                        <span className="rounded bg-sky-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-sky-800">
                          {t.poziom}
                        </span>
                      )}
                      {live && (
                        <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                          W trakcie
                        </span>
                      )}
                      {past && (
                        <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                          Odbyły się
                        </span>
                      )}
                      {s === 'zaplanowane' && (
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          Zaplanowane
                        </span>
                      )}
                    </div>
                    <h2 className={`text-lg font-semibold ${past ? 'text-slate-600' : 'text-slate-900'}`}>
                      {t.nazwa}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {fmtRange(t.dataOd, t.dataDo)}
                      {t.miejsce ? ` · ${t.miejsce}` : ''}
                    </p>
                  </div>
                  {t.link && (
                    <a
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium ${
                        live
                          ? 'bg-red-600 text-white hover:bg-red-500'
                          : past
                            ? 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                            : 'bg-sky-600 text-white hover:bg-sky-500'
                      }`}
                    >
                      {live ? 'Śledź na żywo →' : past ? 'Wyniki →' : 'Szczegóły →'}
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
