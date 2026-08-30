// Tabela "Wyniki regat (TOP 3)" per poziom ligi (short-code: statystyki_klubu — sekcja podia).
import React from 'react'

export type PodiaRow = { liga: string; p1: number; p2: number; p3: number; suma: number }

export default function PodiaTable({ rows }: { rows: PodiaRow[] }) {
  if (rows.length === 0) return <p className="text-slate-500">Brak wyników.</p>
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-600">
            <th className="px-4 py-2 text-left font-semibold">Poziom ligi</th>
            <th className="px-4 py-2 text-center font-semibold">🥇 1. miejsca</th>
            <th className="px-4 py-2 text-center font-semibold">🥈 2. miejsca</th>
            <th className="px-4 py-2 text-center font-semibold">🥉 3. miejsca</th>
            <th className="px-4 py-2 text-center font-semibold">Suma</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100 text-slate-700">
              <td className="px-4 py-2">{r.liga}</td>
              <td className="px-4 py-2 text-center">{r.p1}</td>
              <td className="px-4 py-2 text-center">{r.p2}</td>
              <td className="px-4 py-2 text-center">{r.p3}</td>
              <td className="px-4 py-2 text-center font-bold">{r.suma}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
