/**
 * Kody dostępu do aplikacji z flagą AP.
 *
 * Człowiek na wodzie nie powinien dostawać hasła do panelu redaktora — dostaje
 * kod ważny dobę. Kod JEST poświadczeniem: aplikacja trzyma go u siebie
 * i dołącza do każdego przełączenia flagi, więc nie ma osobnych sesji.
 *
 * Kody żyją w globalu Strefy Kibica (pole `kodyFlagi`). Jest ich kilka naraz
 * i wygasają w ciągu doby, więc osobna kolekcja byłaby cięższa niż problem.
 */

export type KodFlagi = {
  kod: string
  /** ISO — po tej chwili kod przestaje działać. */
  wygasa: string
  /** Do czyjego telefonu trafił, żeby dało się poznać, który unieważnić. */
  opis: string
}

/** Bez 0/O/1/I/L — kod przepisuje się z ekranu na ekran, często w słońcu. */
const ZNAKI = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const DLUGOSC = 8
export const WAZNOSC_GODZIN = 24

export function nowyKod(): string {
  const bajty = new Uint8Array(DLUGOSC)
  crypto.getRandomValues(bajty)
  let kod = ''
  for (const b of bajty) kod += ZNAKI[b % ZNAKI.length]
  // Dwie czwórki czytają się łatwiej niż ciąg ośmiu znaków.
  return `${kod.slice(0, 4)}-${kod.slice(4)}`
}

/** Porównanie odporne na zgadywanie po czasie odpowiedzi. */
function rowne(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

export function znormalizuj(kod: string): string {
  return String(kod || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
}

export function czytelny(kod: string): string {
  const k = znormalizuj(kod)
  return k.length === DLUGOSC ? `${k.slice(0, 4)}-${k.slice(4)}` : k
}

export function aktywne(kody: unknown): KodFlagi[] {
  const teraz = Date.now()
  return (Array.isArray(kody) ? kody : [])
    .filter((k: any) => k?.kod && k?.wygasa)
    .filter((k: any) => new Date(k.wygasa).getTime() > teraz)
    .map((k: any) => ({ kod: String(k.kod), wygasa: String(k.wygasa), opis: String(k.opis || '') }))
}

/** Zwraca dopasowany kod (z terminem ważności) albo null. */
export function znajdzKod(kody: unknown, podany: string): KodFlagi | null {
  const p = znormalizuj(podany)
  if (p.length !== DLUGOSC) return null
  return aktywne(kody).find((k) => rowne(znormalizuj(k.kod), p)) || null
}

export function kodPoprawny(kody: unknown, podany: string): boolean {
  return znajdzKod(kody, podany) !== null
}
