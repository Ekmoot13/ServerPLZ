import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { pobierzWyniki } from '@/lib/sap'

/**
 * Tabela wyników dla Strefy Kibica — odpytywana przez przeglądarkę co kilka
 * sekund, żeby przetasowania w trwającym wyścigu były widać bez przeładowania.
 *
 * Nazwa leaderboardu i adres instancji pochodzą z ustawień panelu, a nie
 * z parametrów żądania: trasa ma nie dać się użyć jako otwarte proxy do
 * dowolnego adresu.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const s: any = await payload.findGlobal({ slug: 'strefa-kibica' }).catch(() => null)

  const nazwa: string = s?.leaderboardName || ''
  const baza: string = s?.sapBase || 'https://plz2026.sapsailing.com'
  if (!nazwa) return NextResponse.json(null, { headers: { 'cache-control': 'no-store' } })

  const dane = await pobierzWyniki(nazwa, baza).catch(() => null)
  return NextResponse.json(dane, { headers: { 'cache-control': 'no-store' } })
}
