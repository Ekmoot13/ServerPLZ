// Wyniki sezonu — dane bezpośrednio z bazy (liga_*).
// Ranking Sezonu (High Point, punkty per runda) + tabele wyścig-po-wyścigu.
import React from 'react'
import Link from 'next/link'
import { getLataWynikow, getWynikiPelne } from '@/lib/liga'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Wyniki — Polska Liga Żeglarska' }

function medal(m: number): string {
  return m === 1 ? '🥇 ' : m === 2 ? '🥈 ' : m === 3 ? '🥉 ' : ''
}

export default async function WynikiPage({
  searchParams,
}: {
  searchParams: Promise<{ rok?: string }>
}) {
  const sp = await searchParams
  const lata = await getLataWynikow()
  const rok = sp.rok && lata.includes(Number(sp.rok)) ? Number(sp.rok) : lata[0]
  const ligi = rok ? await getWynikiPelne(rok) : []

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-bold md:text-5xl">Wyniki</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Ranking sezonu i wyniki poszczególnych rund Polskiej Ligi Żeglarskiej.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* WYBÓR SEZONU */}
        {lata.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {lata.map((y) => (
              <Link
                key={y}
                href={`/wyniki?rok=${y}`}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  y === rok ? 'bg-sky-600 text-white' : 'border border-slate-300 text-slate-600 hover:border-sky-400'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        )}

        {ligi.length === 0 ? (
          <p className="text-slate-500">Brak wyników dla wybranego sezonu.</p>
        ) : (
          <div className="space-y-16">
            {ligi.map((liga) => (
              <div key={liga.poziom}>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="text-2xl font-bold uppercase tracking-wide text-sky-900">{liga.poziom}</h2>
                  <div className="h-0.5 flex-1 bg-red-500/70" />
                </div>

                {/* RANKING SEZONU */}
                <h3 className="mb-3 text-lg font-semibold text-slate-800">Ranking Sezonu</h3>
                <div className="mb-8 overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600">
                        <th className="px-3 py-2 text-left font-semibold">M-sce</th>
                        <th className="px-3 py-2 text-left font-semibold">Skrót</th>
                        <th className="px-3 py-2 text-left font-semibold">Zespół</th>
                        {liga.rankingRounds.map((r) => (
                          <th key={r.id} className="px-3 py-2 text-center font-semibold">
                            {r.label}
                          </th>
                        ))}
                        <th className="px-3 py-2 text-center font-semibold">Σ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liga.ranking.map((row) => (
                        <tr key={row.skrot} className="border-t border-slate-100">
                          <td className={`px-3 py-2 ${row.miejsce <= 3 ? 'font-bold text-sky-800' : 'text-slate-700'}`}>
                            {medal(row.miejsce)}
                            {row.miejsce}
                          </td>
                          <td className="px-3 py-2 text-slate-500">{row.skrot}</td>
                          <td className="px-3 py-2">
                            <Link href={`/kluby/${row.slug}`} className="text-slate-800 hover:text-sky-600">
                              {row.klub}
                            </Link>
                          </td>
                          {liga.rankingRounds.map((r) => (
                            <td key={r.id} className="px-3 py-2 text-center text-slate-600">
                              {row.perRound[r.id] ?? ''}
                            </td>
                          ))}
                          <td className="px-3 py-2 text-center font-bold text-slate-800">{row.suma}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* WYNIKI RUND (wyścig-po-wyścigu) */}
                {liga.rundy.some((r) => r.races.length > 0) && (
                  <>
                    <h3 className="mb-3 text-lg font-semibold text-slate-800">Wyniki rund</h3>
                    <div className="space-y-3">
                      {liga.rundy
                        .filter((r) => r.races.length > 0)
                        .map((r) => (
                          <details key={r.id} className="rounded-lg border border-slate-200 bg-white">
                            <summary className="cursor-pointer list-none px-4 py-3 font-medium text-slate-800 hover:bg-slate-50">
                              {r.numer != null ? `Runda ${r.numer} — ` : ''}
                              {r.nazwa}
                              {r.miasto ? `, ${r.miasto}` : ''}
                            </summary>
                            <div className="overflow-x-auto border-t border-slate-100">
                              <table className="w-full min-w-[520px] border-collapse text-sm">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-600">
                                    <th className="px-3 py-2 text-left font-semibold">M-sce</th>
                                    <th className="px-3 py-2 text-left font-semibold">Skrót</th>
                                    <th className="px-3 py-2 text-left font-semibold">Zespół</th>
                                    {r.races.map((c) => (
                                      <th key={c.key} className="px-2 py-2 text-center font-semibold">
                                        {c.label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {r.rows.map((row) => (
                                    <tr key={row.skrot} className="border-t border-slate-100">
                                      <td className={`px-3 py-2 ${row.miejsce <= 3 ? 'font-bold text-sky-800' : 'text-slate-700'}`}>
                                        {medal(row.miejsce)}
                                        {row.miejsce}
                                      </td>
                                      <td className="px-3 py-2 text-slate-500">{row.skrot}</td>
                                      <td className="px-3 py-2">
                                        <Link href={`/kluby/${row.slug}`} className="text-slate-800 hover:text-sky-600">
                                          {row.klub}
                                        </Link>
                                      </td>
                                      {r.races.map((c) => (
                                        <td key={c.key} className="px-2 py-2 text-center text-slate-600">
                                          {row.places[c.key] ?? '-'}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </details>
                        ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
