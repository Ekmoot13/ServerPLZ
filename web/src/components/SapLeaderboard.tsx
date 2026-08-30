import React from 'react'

const SAP_BASE = process.env.SAP_BASE || 'https://tlz2026.sapsailing.com'

type RaceScore = { netPoints: number | null; rank: number; maxPointsReason?: string }
type Competitor = {
  id: string
  name: string
  shortName?: string
  rank: number
  netPoints: number | null
  raceScores: Record<string, RaceScore>
}
type Leaderboard = {
  name: string
  displayName?: string
  resultState?: string
  columnNames?: string[]
  competitors?: Competitor[]
}

async function fetchLeaderboard(name: string, base?: string): Promise<Leaderboard | null> {
  try {
    const b = base || SAP_BASE
    const res = await fetch(`${b}/sailingserver/api/v1/leaderboards/${encodeURIComponent(name)}`, {
      next: { revalidate: 30 },
    })
    if (!res.ok) return null
    return (await res.json()) as Leaderboard
  } catch {
    return null
  }
}

function cell(score?: RaceScore): string {
  if (!score) return '–'
  if (score.maxPointsReason && score.maxPointsReason !== 'NONE') return score.maxPointsReason
  if (score.netPoints == null) return '–'
  return String(score.netPoints)
}

export default async function SapLeaderboard({ name, base }: { name: string; base?: string }) {
  const data = await fetchLeaderboard(name, base)

  if (!data?.competitors?.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
        Wyniki chwilowo niedostępne.
      </div>
    )
  }

  const columns = data.columnNames || []
  const competitors = [...data.competitors].sort((a, b) => (a.rank || 999) - (b.rank || 999))
  const isLive = data.resultState === 'Live'

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="font-semibold text-slate-800">{data.displayName || data.name}</h3>
        {isLive && (
          <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            NA ŻYWO
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Klub</th>
              {columns.map((c, i) => (
                <th key={i} className="px-3 py-2 text-center font-medium">{c.trim()}</th>
              ))}
              <th className="px-3 py-2 text-center font-semibold text-slate-700">Σ</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c) => (
              <tr key={c.id} className="border-t border-slate-100 hover:bg-sky-50/50">
                <td className="px-3 py-2 font-semibold text-slate-700">{c.rank}</td>
                <td className="px-3 py-2 font-medium text-slate-800">{c.name}</td>
                {columns.map((col, i) => (
                  <td key={i} className="px-3 py-2 text-center text-slate-600">{cell(c.raceScores?.[col])}</td>
                ))}
                <td className="px-3 py-2 text-center font-bold text-slate-800">{c.netPoints ?? '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 px-4 py-2 text-right text-xs text-slate-400">
        Dane: SAP Sailing Analytics
      </div>
    </div>
  )
}
