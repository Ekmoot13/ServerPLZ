// Boczne podsumowanie: gwiazdki (mistrzostwa) + kafelki liczników.
// (short-code: podsumowanie_zawodnika / podsumowanie_klubu)
import React from 'react'

export type StatCard = { label: string; value: number }
export type StatGroup = { title?: string; cards: StatCard[] }

export default function SummaryCards({ stars = 0, groups }: { stars?: number; groups: StatGroup[] }) {
  return (
    <div>
      {stars > 0 && (
        <div className="mb-3 text-center text-2xl leading-none text-yellow-400" title="Mistrzostwa Polski">
          {'★'.repeat(stars)}
        </div>
      )}
      {groups.map((g, gi) => (
        <div key={gi} className="mb-4">
          {g.title && (
            <div className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
              {g.title}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {g.cards.map((c, ci) => (
              <div
                key={ci}
                className={`rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center ${
                  c === g.cards[g.cards.length - 1] && g.cards.length % 2 === 1 ? 'col-span-2' : ''
                }`}
              >
                <div className="text-2xl font-extrabold leading-tight text-sky-900">{c.value}</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {c.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
