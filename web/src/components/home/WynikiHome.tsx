'use client'
import React, { useState } from 'react'
import Link from 'next/link'

type RankRow = { miejsce: number; skrot: string; klub: string; slug: string; perRound: Record<string, any>; suma: any }
type RoundCol = { key: string; label: string }
type RoundRow = { miejsce: number; skrot: string; klub: string; slug: string; places: Record<string, any> }
type Runda = { id: string; numer: number | null; nazwa: string; races: RoundCol[]; rows: RoundRow[] }
type Liga = { poziom: string; ranking: RankRow[]; rankingRounds: { id: string; label: string }[]; rundy: Runda[] }

const LIMIT = 8

function TabRow({ ligi, li, setLi }: { ligi: Liga[]; li: number; setLi: (n: number) => void }) {
  return (
    <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200">
      {ligi.map((l, i) => (
        <button
          key={l.poziom}
          onClick={() => setLi(i)}
          className={`-mb-px border-b-2 px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${
            i === li ? 'border-brand-red text-navy' : 'border-transparent text-slate-500 hover:text-navy'
          }`}
        >
          {l.poziom}
        </button>
      ))}
    </div>
  )
}

export default function WynikiHome({ ligi }: { ligi: Liga[] }) {
  const [liL, setLiL] = useState(0)
  const [liR, setLiR] = useState(0)
  const lewa = ligi[Math.min(liL, ligi.length - 1)]
  const prawa = ligi[Math.min(liR, ligi.length - 1)]
  const ostatnia = [...lewa.rundy].reverse().find((r) => r.races.length > 0) || null

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      {/* OSTATNIE REGATY */}
      <div>
        <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy">Ostatnie regaty</h2>
        <div className="mt-2 mb-5 h-1 w-14 rounded-full bg-brand-red" />
        <TabRow ligi={ligi} li={liL} setLi={setLiL} />
        {ostatnia ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[340px] border-collapse text-xs sm:min-w-[520px] sm:text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-2 py-1.5 text-left font-bold sm:px-3 sm:py-2">M-sce</th>
                  <th className="px-2 py-1.5 text-left font-bold sm:px-3 sm:py-2">Skrót</th>
                  <th className="hidden px-3 py-2 text-left font-bold sm:table-cell">Zespół</th>
                  {ostatnia.races.map((c) => (
                    <th key={c.key} className="px-1.5 py-1.5 text-center font-bold sm:px-2 sm:py-2">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ostatnia.rows.slice(0, LIMIT).map((row, idx) => (
                  <tr key={row.skrot} className={idx % 2 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-2 py-1.5 font-semibold text-navy sm:px-3 sm:py-2">{row.miejsce}</td>
                    <td className="px-2 py-1.5 text-slate-500 sm:px-3 sm:py-2">{row.skrot}</td>
                    <td className="hidden max-w-[120px] truncate px-3 py-2 sm:table-cell">{row.klub}</td>
                    {ostatnia.races.map((c) => (
                      <td key={c.key} className="px-1.5 py-1.5 text-center text-slate-600 sm:px-2 sm:py-2">{row.places[c.key] ?? '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500">Brak wyników rund.</p>
        )}
      </div>

      {/* RANKING SEZONU */}
      <div>
        <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy">Ranking sezonu</h2>
        <div className="mt-2 mb-5 h-1 w-14 rounded-full bg-brand-red" />
        <TabRow ligi={ligi} li={liR} setLi={setLiR} />
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[340px] border-collapse text-xs sm:min-w-[520px] sm:text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="px-2 py-1.5 text-left font-bold sm:px-3 sm:py-2">M-sce</th>
                <th className="px-2 py-1.5 text-left font-bold sm:px-3 sm:py-2">Skrót</th>
                <th className="hidden px-3 py-2 text-left font-bold sm:table-cell">Zespół</th>
                {prawa.rankingRounds.map((r) => (
                  <th key={r.id} className="px-1.5 py-1.5 text-center font-bold sm:px-3 sm:py-2">{r.label}</th>
                ))}
                <th className="px-2 py-1.5 text-center font-bold sm:px-3 sm:py-2">Σ</th>
              </tr>
            </thead>
            <tbody>
              {prawa.ranking.slice(0, LIMIT).map((row, idx) => (
                <tr key={row.skrot} className={idx % 2 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="px-2 py-1.5 font-semibold text-navy sm:px-3 sm:py-2">{row.miejsce}</td>
                  <td className="px-2 py-1.5 text-slate-500 sm:px-3 sm:py-2">{row.skrot}</td>
                  <td className="hidden max-w-[160px] truncate px-3 py-2 sm:table-cell">{row.klub}</td>
                  {prawa.rankingRounds.map((r) => (
                    <td key={r.id} className="px-1.5 py-1.5 text-center text-slate-600 sm:px-3 sm:py-2">{row.perRound[r.id] ?? ''}</td>
                  ))}
                  <td className="px-2 py-1.5 text-center font-bold text-navy sm:px-3 sm:py-2">{row.suma}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center lg:col-span-2">
        <Link
          href="/wyniki"
          className="inline-block rounded-[10px] border-2 border-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
        >
          Zobacz wszystkie wyniki
        </Link>
      </div>
    </div>
  )
}
