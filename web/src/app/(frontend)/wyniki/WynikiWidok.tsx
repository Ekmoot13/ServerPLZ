'use client'
import React, { useState } from 'react'
import Link from 'next/link'

// Typy zgodne z danymi z getWynikiPelne (lib/liga).
type RankRow = { miejsce: number; skrot: string; klub: string; slug: string; perRound: Record<string, any>; suma: any }
type RoundCol = { key: string; label: string }
type RoundRow = { miejsce: number; skrot: string; klub: string; slug: string; places: Record<string, any>; suma?: any }
type Runda = { id: string; numer: number | null; nazwa: string; miasto?: string; races: RoundCol[]; rows: RoundRow[] }
type Liga = {
  poziom: string
  ranking: RankRow[]
  rankingRounds: { id: string; label: string }[]
  rundy: Runda[]
}

function medal(m: number): string {
  return m === 1 ? '🥇 ' : m === 2 ? '🥈 ' : m === 3 ? '🥉 ' : ''
}

export default function WynikiWidok({ ligi, ukryjPrzelacznik = false }: { ligi: Liga[]; ukryjPrzelacznik?: boolean }) {
  const [li, setLi] = useState(0)
  const liga = ligi[Math.min(li, ligi.length - 1)]
  const rundyZWynikami = liga.rundy.filter((r) => r.races.length > 0)
  const [tab, setTab] = useState<string>('ranking')

  // reset zakładki przy zmianie ligi
  const [lastLi, setLastLi] = useState(li)
  if (li !== lastLi) {
    setLastLi(li)
    setTab('ranking')
  }

  const aktRunda = rundyZWynikami.find((r) => r.id === tab)

  return (
    <div>
      {/* SLIDER LIG */}
      {!ukryjPrzelacznik && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {ligi.map((l, i) => (
            <button
              key={l.poziom}
              onClick={() => setLi(i)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wide transition ${
                i === li
                  ? 'bg-sky-500 text-white'
                  : 'border-2 border-navy/15 bg-white text-navy hover:border-sky-500'
              }`}
            >
              {l.poziom}
            </button>
          ))}
        </div>
      )}

      {/* TYTUŁ LIGI */}
      {!ukryjPrzelacznik && (
        <div className="mb-6 text-center">
          <h2 className="inline-block text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">
            {liga.poziom}
          </h2>
          <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-brand-red" />
        </div>
      )}

      {/* ZAKŁADKI RUND */}
      <div className="mb-6 flex flex-wrap justify-center gap-1 border-b border-slate-200">
        <TabBtn active={tab === 'ranking'} onClick={() => setTab('ranking')}>
          Ranking Sezonu
        </TabBtn>
        {rundyZWynikami.map((r) => (
          <TabBtn key={r.id} active={tab === r.id} onClick={() => setTab(r.id)}>
            {r.numer != null ? `Runda ${r.numer}` : r.nazwa}
          </TabBtn>
        ))}
      </div>

      {/* TABELA */}
      {tab === 'ranking' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="px-3 py-2.5 text-left font-bold">M-ce</th>
                <th className="px-3 py-2.5 text-left font-bold">Skrót</th>
                <th className="px-3 py-2.5 text-left font-bold">Zespół</th>
                {liga.rankingRounds.map((r) => (
                  <th key={r.id} className="px-3 py-2.5 text-center font-bold">
                    {r.label}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-center font-bold">Σ</th>
              </tr>
            </thead>
            <tbody>
              {liga.ranking.map((row, idx) => (
                <tr key={row.skrot} className={idx % 2 ? 'bg-slate-50' : 'bg-white'}>
                  <td className={`px-3 py-2 ${row.miejsce <= 3 ? 'font-bold text-navy' : 'text-slate-700'}`}>
                    {medal(row.miejsce)}
                    {row.miejsce}
                  </td>
                  <td className="px-3 py-2 text-slate-500">{row.skrot}</td>
                  <td className="px-3 py-2">
                    <Link href={`/kluby/${row.slug}`} className="font-medium text-navy hover:text-sky-600">
                      {row.klub}
                    </Link>
                  </td>
                  {liga.rankingRounds.map((r) => (
                    <td key={r.id} className="px-3 py-2 text-center text-slate-600">
                      {row.perRound[r.id] ?? ''}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center font-bold text-navy">{row.suma}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : aktRunda ? (
        <div>
          <p className="mb-3 text-center text-sm font-semibold text-slate-500">
            {aktRunda.nazwa}
            {aktRunda.miasto ? `, ${aktRunda.miasto}` : ''}
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-3 py-2.5 text-left font-bold">M-ce</th>
                  <th className="px-3 py-2.5 text-left font-bold">Skrót</th>
                  <th className="px-3 py-2.5 text-left font-bold">Zespół</th>
                  {aktRunda.races.map((c) => (
                    <th key={c.key} className="px-2 py-2.5 text-center font-bold">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-3 py-2.5 text-center font-bold">Σ</th>
                </tr>
              </thead>
              <tbody>
                {aktRunda.rows.map((row, idx) => (
                  <tr key={row.skrot} className={idx % 2 ? 'bg-slate-50' : 'bg-white'}>
                    <td className={`px-3 py-2 ${row.miejsce <= 3 ? 'font-bold text-navy' : 'text-slate-700'}`}>
                      {medal(row.miejsce)}
                      {row.miejsce}
                    </td>
                    <td className="px-3 py-2 text-slate-500">{row.skrot}</td>
                    <td className="px-3 py-2">
                      <Link href={`/kluby/${row.slug}`} className="font-medium text-navy hover:text-sky-600">
                        {row.klub}
                      </Link>
                    </td>
                    {aktRunda.races.map((c) => (
                      <td key={c.key} className="px-2 py-2 text-center text-slate-600">
                        {row.places[c.key] ?? '-'}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center font-bold text-navy">{row.suma ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition ${
        active ? 'border-sky-500 text-navy' : 'border-transparent text-slate-500 hover:text-navy'
      }`}
    >
      {children}
    </button>
  )
}
