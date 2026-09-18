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

/** Ilu zawodnikow ma juz jakikolwiek wynik — miara „bogactwa" odpowiedzi. */
function ilePunktujacych(lb: Leaderboard | null): number {
  return (lb?.competitors || []).filter((c) => (c.netPoints ?? 0) > 0).length
}

async function pobierz(name: string, base: string, wariant: string): Promise<Leaderboard | null> {
  try {
    const res = await fetch(
      `${base}/sailingserver/api/v1/leaderboards/${encodeURIComponent(name)}?w=${wariant}`,
      { next: { revalidate: 30 } },
    )
    if (!res.ok) return null
    return (await res.json()) as Leaderboard
  } catch {
    return null
  }
}

/**
 * SAP serwuje ten sam leaderboard z kilku wezlow, ktore w trakcie regat potrafia
 * sie rozjechac: jeden zna juz wyniki rozegranego wyscigu, drugi zwraca same
 * kreski. Zadania trafiaja do nich naprzemiennie, wiec co druga odpowiedz bywa
 * pusta i tabela „gasla" na 30 sekund, az do kolejnego odswiezenia.
 *
 * Pytamy wiec dwa razy (rozny parametr = rozny wpis w cache Next.js, wiec
 * realnie dwa zapytania) i bierzemy odpowiedz z wieksza liczba wynikow. Gdy
 * regaty faktycznie sie jeszcze nie zaczely, obie sa puste i pokazujemy pustke
 * — zero wynikow nie jest wtedy bledem.
 */
async function fetchLeaderboard(name: string, base?: string): Promise<Leaderboard | null> {
  const b = base || SAP_BASE
  const a = await pobierz(name, b, 'a')
  if (ilePunktujacych(a) > 0) return a
  const c = await pobierz(name, b, 'b')
  if (!a) return c
  if (!c) return a
  return ilePunktujacych(c) > ilePunktujacych(a) ? c : a
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
              <tr key={c.id} className="border-t border-slate-100 hover:bg-navy/5">
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
