// Tabela statystyk per poziom ligi (Regaty, Wyścigi, Wygrane wyścigi, Śr. miejsce regaty/wyścig).
// (short-code: statystyki_zawodnika / statystyki_klubu)
import React from 'react'

export type StatsRow = {
  liga: string
  regaty: number
  wyscigi: number
  wygrane: number
  srReg: string
  srWys: string
}

export default function StatsTable({
  rows,
  totals,
}: {
  rows: StatsRow[]
  totals: { regaty: number; wyscigi: number; wygrane: number }
}) {
  if (rows.length === 0) return <p className="text-slate-500">Brak danych statystycznych.</p>
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-600">
            <th className="px-4 py-2 text-left font-semibold">Poziom ligi</th>
            <th className="px-4 py-2 text-center font-semibold">Regaty</th>
            <th className="px-4 py-2 text-center font-semibold">Wyścigi</th>
            <th className="px-4 py-2 text-center font-semibold">Wygrane wyścigi</th>
            <th className="px-4 py-2 text-center font-semibold">Śr. miejsce regaty</th>
            <th className="px-4 py-2 text-center font-semibold">Śr. miejsce wyścig</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100 text-slate-700">
              <td className="px-4 py-2">{r.liga}</td>
              <td className="px-4 py-2 text-center">{r.regaty}</td>
              <td className="px-4 py-2 text-center">{r.wyscigi}</td>
              <td className="px-4 py-2 text-center">{r.wygrane}</td>
              <td className="px-4 py-2 text-center">{r.srReg}</td>
              <td className="px-4 py-2 text-center">{r.srWys}</td>
            </tr>
          ))}
          <tr className="border-t border-slate-200 bg-slate-50 font-bold text-slate-800">
            <td className="px-4 py-2">SUMA</td>
            <td className="px-4 py-2 text-center">{totals.regaty}</td>
            <td className="px-4 py-2 text-center">{totals.wyscigi}</td>
            <td className="px-4 py-2 text-center">{totals.wygrane}</td>
            <td className="px-4 py-2 text-center">-</td>
            <td className="px-4 py-2 text-center">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
