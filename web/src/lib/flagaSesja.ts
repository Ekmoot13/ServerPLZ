import crypto from 'node:crypto'

/**
 * Parowanie telefonu z aplikacją flag.
 *
 * Kod z panelu wpisuje się raz — potem urządzenie nosi podpisane ciasteczko
 * i wraca do przycisków od razu po otwarciu, także po restarcie telefonu.
 *
 * Ciasteczko jest HttpOnly, więc kod nie leży w pamięci dostępnej dla skryptów
 * strony, a serwer może rozpoznać sparowany telefon jeszcze przed narysowaniem
 * widoku — bez mignięcia ekranem logowania.
 *
 * Token niesie w sobie kod, a kod sprawdzamy przy każdym żądaniu wobec bieżącej
 * listy. Dzięki temu unieważnienie kodu w panelu odcina wszystkie telefony,
 * które go używały, natychmiast — bez osobnego rejestru urządzeń.
 */
export const CIASTKO = 'plz-flaga'

function sekret(): string {
  // Ten sam sekret, którym Payload podpisuje swoje sesje.
  return process.env.PAYLOAD_SECRET || 'plz-lokalny-sekret'
}

function podpis(dane: string): string {
  return crypto.createHmac('sha256', sekret()).update(dane).digest('base64url')
}

/** @param wygasaMs moment wygaśnięcia kodu — token nie żyje dłużej niż on. */
export function zrobToken(kod: string, wygasaMs: number): string {
  const dane = `${kod}.${wygasaMs}`
  return `${dane}.${podpis(dane)}`
}

export function odczytajToken(token: string | undefined): string | null {
  if (!token) return null
  const czesci = token.split('.')
  if (czesci.length !== 3) return null

  const [kod, exp, sig] = czesci
  const dane = `${kod}.${exp}`

  const oczekiwany = Buffer.from(podpis(dane))
  const podany = Buffer.from(sig)
  if (oczekiwany.length !== podany.length) return null
  if (!crypto.timingSafeEqual(oczekiwany, podany)) return null

  if (!Number(exp) || Number(exp) < Date.now()) return null
  return kod
}

/**
 * Atrybuty ciasteczka. `secure` tylko przy HTTPS — w sieci lokalnej telefon
 * łączy się po zwykłym HTTP i ciasteczko z tą flagą zostałoby odrzucone.
 */
export function opcjeCiastka(req: Request, wygasaMs: number) {
  const https =
    new URL(req.url).protocol === 'https:' ||
    req.headers.get('x-forwarded-proto') === 'https'

  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: https,
    maxAge: Math.max(0, Math.floor((wygasaMs - Date.now()) / 1000)),
  }
}
