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
