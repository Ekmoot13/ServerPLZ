// Wyznaczanie statusu regat: auto z daty (gdy autoStatus) lub ręcznie ustawiony.
export type StatusRegat = 'zaplanowane' | 'w-trakcie' | 'odbyly-sie'

export function statusRegat(ev: {
  autoStatus?: boolean | null
  statusReczny?: string | null
  dataOd?: string | null
  dataDo?: string | null
}): StatusRegat {
  // Automat wyłączony → status ręczny
  if (ev.autoStatus === false) {
    const s = ev.statusReczny
    if (s === 'w-trakcie' || s === 'odbyly-sie' || s === 'zaplanowane') return s
    return 'zaplanowane'
  }
  // Automat włączony → z daty
  const now = Date.now()
  const od = ev.dataOd ? new Date(ev.dataOd).getTime() : null
  // koniec dnia daty "do" (lub "od", gdy jednodniowe)
  const doRaw = ev.dataDo || ev.dataOd
  const doEnd = doRaw ? new Date(doRaw).getTime() + 24 * 60 * 60 * 1000 - 1 : null
  if (od == null) return 'zaplanowane'
  if (now < od) return 'zaplanowane'
  if (doEnd != null && now > doEnd) return 'odbyly-sie'
  return 'w-trakcie'
}

export function statusLabel(s: StatusRegat): string {
  return s === 'w-trakcie' ? 'W trakcie' : s === 'odbyly-sie' ? 'Odbyły się' : 'Zaplanowane'
}

// Domyślna kolejność poziomów, gdy redaktor nie ustawił własnej (globalny obiekt pusty).
export const DOMYSLNE_POZIOMY = [
  'Ekstraklasa',
  '1 Liga',
  '2 Liga',
  'Młodzieżowa',
  'Finał Lig Regionalnych',
  'Mistrzostwa Polski Kobiet',
  'Trójmiejska Liga Żeglarska',
  'Wielkopolska Liga Żeglarska',
  'Centralna Liga Żeglarska',
]

// Zwraca uporządkowaną listę poziomów (do sortowania sekcji).
// `zapisane` – kolejność ustawiona przez redaktora (z globala). `obecne` – poziomy faktycznie
// występujące w terminach. Poziomy spoza zapisanej kolejności trafiają na koniec (alfabetycznie).
export function orderedPoziomy(zapisane: string[], obecne: string[]): string[] {
  const baza = (zapisane && zapisane.length ? zapisane : DOMYSLNE_POZIOMY)
    .map((s) => (s || '').trim())
    .filter(Boolean)
  const wynik: string[] = []
  const seen = new Set<string>()
  for (const p of baza) {
    if (!seen.has(p)) {
      wynik.push(p)
      seen.add(p)
    }
  }
  const reszta = obecne
    .map((s) => (s || '').trim())
    .filter((s) => s && !seen.has(s))
    .sort((a, b) => a.localeCompare(b, 'pl'))
  for (const p of reszta) {
    if (!seen.has(p)) {
      wynik.push(p)
      seen.add(p)
    }
  }
  return wynik
}

// Mapa poziom → indeks kolejności (do porównań w sort()).
export function poziomIndexMap(kolejnosc: string[]): Record<string, number> {
  const m: Record<string, number> = {}
  kolejnosc.forEach((p, i) => {
    m[p] = i
  })
  return m
}
