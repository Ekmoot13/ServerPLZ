import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { znajdzKod, kodPoprawny } from '@/lib/kodyFlagi'
import { poprawnaFlaga, przelaczFlageWBazie } from '@/lib/flaga'
import { CIASTKO, odczytajToken, opcjeCiastka, zrobToken } from '@/lib/flagaSesja'

/**
 * Sygnał flagowy komisji regatowej.
 *
 * GET  — podniesiona flaga, publicznie. Strona odpytuje to co kilka sekund,
 *        żeby baner pojawiał się i znikał bez przeładowania.
 * POST — parowanie telefonu kodem albo przełączenie sygnału. Po sparowaniu
 *        telefon nosi podpisane ciasteczko i nie wpisuje kodu ponownie.
 *
 * Panel redaktora ma własną akcję serwerową, opartą o sesję.
 */
export const dynamic = 'force-dynamic'

/**
 * Prosty hamulec na zgadywanie kodu. Trzymany w pamięci procesu — przy jednym
 * kontenerze wystarczy, a przy kilku każdy dołoży swój limit.
 */
const PROBY = new Map<string, { ile: number; do_: number }>()
const OKNO_MS = 10 * 60 * 1000
const LIMIT = 20

function zablokowany(ip: string): boolean {
  const w = PROBY.get(ip)
  return !!w && w.do_ >= Date.now() && w.ile >= LIMIT
}

function zliczNieudana(ip: string) {
  const teraz = Date.now()
  const w = PROBY.get(ip)
  if (!w || w.do_ < teraz) PROBY.set(ip, { ile: 1, do_: teraz + OKNO_MS })
  else w.ile += 1
  if (PROBY.size > 500) for (const [k, v] of PROBY) if (v.do_ < teraz) PROBY.delete(k)
}

function adres(req: Request): string {
  const f = req.headers.get('x-forwarded-for')
  return (f ? f.split(',')[0] : '') || req.headers.get('x-real-ip') || 'nieznany'
}

const BEZ_CACHE = { 'cache-control': 'no-store' }

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const s: any = await payload.findGlobal({ slug: 'strefa-kibica' }).catch(() => null)
  return NextResponse.json({ flaga: poprawnaFlaga(s?.flaga) }, { headers: BEZ_CACHE })
}

export async function POST(req: Request) {
  const ip = adres(req)
  if (zablokowany(ip)) {
    return NextResponse.json(
      { blad: 'Za dużo prób. Odczekaj kilka minut.' },
      { status: 429, headers: BEZ_CACHE },
    )
  }

  let dane: any
  try {
    dane = await req.json()
  } catch {
    return NextResponse.json({ blad: 'Nieczytelne żądanie.' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const s: any = await payload.findGlobal({ slug: 'strefa-kibica' }).catch(() => null)

  // ---- Parowanie telefonu kodem ----
  if (dane?.kod) {
    const kod = znajdzKod(s?.kodyFlagi, String(dane.kod))
    if (!kod) {
      zliczNieudana(ip)
      return NextResponse.json(
        { blad: 'Kod jest nieprawidłowy albo stracił ważność.' },
        { status: 401, headers: BEZ_CACHE },
      )
    }

    const wygasa = new Date(kod.wygasa).getTime()
    const odp = NextResponse.json(
      { flaga: poprawnaFlaga(s?.flaga), wygasa: kod.wygasa },
      { headers: BEZ_CACHE },
    )
    odp.cookies.set(CIASTKO, zrobToken(kod.kod, wygasa), opcjeCiastka(req, wygasa))
    return odp
  }

  // ---- Telefon już sparowany ----
  const zCiastka = odczytajToken((await cookies()).get(CIASTKO)?.value)
  // Kod sprawdzamy na bieżąco, więc unieważnienie go w panelu odcina telefon od razu.
  if (!zCiastka || !kodPoprawny(s?.kodyFlagi, zCiastka)) {
    return NextResponse.json(
      { blad: 'To urządzenie nie jest już sparowane. Wpisz nowy kod.' },
      { status: 401, headers: BEZ_CACHE },
    )
  }

  if (!dane?.przelacz) {
    return NextResponse.json({ flaga: poprawnaFlaga(s?.flaga) }, { headers: BEZ_CACHE })
  }

  const wynik = await przelaczFlageWBazie(String(dane.przelacz))
  return NextResponse.json(wynik, { headers: BEZ_CACHE })
}

/** Rozparowanie — „Odłącz ten telefon" w aplikacji. */
export async function DELETE(req: Request) {
  const odp = NextResponse.json({ ok: true }, { headers: BEZ_CACHE })
  odp.cookies.set(CIASTKO, '', { ...opcjeCiastka(req, Date.now()), maxAge: 0 })
  return odp
}
