/**
 * Pobieranie i normalizacja tabeli wyników z SAP Sailing Analytics.
 *
 * Wydzielone z komponentu, bo z tych samych danych korzystają dwa miejsca:
 * render po stronie serwera (pierwsze wyświetlenie strony) oraz trasa
 * /api/wyniki, z której tabela dociąga aktualizacje co kilka sekund.
 */

const SAP_BASE = process.env.SAP_BASE || 'https://plz2026.sapsailing.com'

type RaceScore = {
  netPoints: number | null
  rank: number
  maxPointsReason?: string
  fleet?: string
}
type Competitor = {
  id: string
  name: string
  shortName?: string
  rank: number
  netPoints: number | null
  raceScores: Record<string, RaceScore>
}
type TrackedRace = { live?: boolean; status?: string }
type Fleet = { name?: string; resultsAreOfficial?: boolean; trackedRace?: TrackedRace | null }
type Leaderboard = {
  name: string
  displayName?: string
  resultState?: string
  columnNames?: string[]
  competitors?: Competitor[]
  trackedRacesInfo?: { raceColumnName?: string; fleets?: Fleet[] }[]
}

/** Znormalizowana tabela — tylko to, czego potrzebuje widok. */
export type Komorka = {
  tekst: string
  /** „Race 1" / „Race 2" — w jednym locie startują dwie flotylle po 10 łódek. */
  flotylla: string | null
}
export type WierszWynikow = {
  id: string
  miejsce: number
  nazwa: string
  punkty: string
  komorki: Komorka[]
}
export type DaneWynikow = {
  tytul: string
  kolumny: string[]
  wiersze: WierszWynikow[]
  naZywo: boolean
  /** Kolumna wyścigu, który właśnie trwa — jej wyniki są tymczasowe. */
  kolumnaTrwajaca: string | null
  /** Flotylla trwającego wyścigu, np. „Race 2". */
  flotyllaTrwajaca: string | null
}

function ilePunktujacych(lb: Leaderboard | null): number {
  return (lb?.competitors || []).filter((c) => (c.netPoints ?? 0) > 0).length
}

async function pobierz(name: string, base: string, wariant: string): Promise<Leaderboard | null> {
  try {
    const res = await fetch(
      `${base}/sailingserver/api/v1/leaderboards/${encodeURIComponent(name)}?w=${wariant}`,
      // Cache na cztery sekundy: przy odpytywaniu co pięć sekund tabela jest
      // praktycznie świeża, a SAP dostaje od nas stałe ~30 zapytań na minutę
      // niezależnie od tego, czy ogląda dziesięć osób, czy tysiąc.
      { next: { revalidate: 4 } },
    )
    if (!res.ok) return null
    return (await res.json()) as Leaderboard
  } catch {
    return null
  }
}

/**
 * SAP serwuje ten sam leaderboard z kilku węzłów, które w trakcie regat potrafią
 * się rozjechać: jeden zna wyniki rozegranego wyścigu, drugi zwraca same kreski.
 * Żądania trafiają do nich naprzemiennie, więc pytamy dwa razy i bierzemy
 * odpowiedź z większą liczbą wyników. Gdy regaty jeszcze się nie zaczęły, obie
 * są puste i pokazujemy pustkę — zero wyników nie jest wtedy błędem.
 */
async function pobierzSurowe(name: string, base: string): Promise<Leaderboard | null> {
  const [a, b] = await Promise.all([pobierz(name, base, 'a'), pobierz(name, base, 'b')])
  if (!a) return b
  if (!b) return a
  return ocena(b) > ocena(a) ? b : a
}

/**
 * Im więcej wiemy, tym lepsza odpowiedź. Liczba wyników jest ważniejsza, ale
 * gdy obie wersje mają ich tyle samo, wybieramy tę, która wie o trwającym
 * wyścigu — inaczej czerwone oznaczenie migałoby razem z rozjazdem węzłów.
 */
function ocena(lb: Leaderboard): number {
  return ilePunktujacych(lb) * 2 + (trwajacy(lb).kolumna ? 1 : 0)
}

function komorka(score?: RaceScore): Komorka {
  const flotylla = score?.fleet || null
  if (!score) return { tekst: '–', flotylla: null }
  if (score.maxPointsReason && score.maxPointsReason !== 'NONE')
    return { tekst: score.maxPointsReason, flotylla }
  if (score.netPoints == null) return { tekst: '–', flotylla }
  return { tekst: String(score.netPoints), flotylla }
}

/** Wyścig, który właśnie jest rozgrywany — SAP oznacza go polem `live`. */
function trwajacy(lb: Leaderboard): { kolumna: string | null; flotylla: string | null } {
  for (const info of lb.trackedRacesInfo || []) {
    for (const f of info.fleets || []) {
      if (f.trackedRace?.live) {
        return { kolumna: info.raceColumnName || null, flotylla: f.name || null }
      }
    }
  }
  return { kolumna: null, flotylla: null }
}

export async function pobierzWyniki(name: string, base?: string): Promise<DaneWynikow | null> {
  const lb = await pobierzSurowe(name, base || SAP_BASE)
  if (!lb?.competitors?.length) return null

  const kolumny = lb.columnNames || []
  const t = trwajacy(lb)

  return {
    tytul: lb.displayName || lb.name || '',
    kolumny,
    naZywo: lb.resultState === 'Live',
    kolumnaTrwajaca: t.kolumna,
    flotyllaTrwajaca: t.flotylla,
    wiersze: [...lb.competitors]
      .sort((a, b) => (a.rank || 999) - (b.rank || 999))
      .map((c) => ({
        id: c.id,
        miejsce: c.rank,
        nazwa: c.name,
        punkty: c.netPoints == null ? '–' : String(c.netPoints),
        komorki: kolumny.map((k) => komorka(c.raceScores?.[k])),
      })),
  }
}
