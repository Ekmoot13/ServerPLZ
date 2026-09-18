import React from 'react'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { kodPoprawny } from '@/lib/kodyFlagi'
import { poprawnaFlaga } from '@/lib/flaga'
import { CIASTKO, odczytajToken } from '@/lib/flagaSesja'
import AplikacjaFlagi from './AplikacjaFlagi'

export const dynamic = 'force-dynamic'

export default async function FlagaAplikacjaPage() {
  const payload = await getPayload({ config })
  const s: any = await payload.findGlobal({ slug: 'strefa-kibica' }).catch(() => null)

  // Sparowanie rozpoznajemy po stronie serwera, żeby telefon od razu dostał
  // ekran z flagami — bez mignięcia ekranem wpisywania kodu.
  const zCiastka = odczytajToken((await cookies()).get(CIASTKO)?.value)
  const polaczone = !!zCiastka && kodPoprawny(s?.kodyFlagi, zCiastka)

  return <AplikacjaFlagi polaczone={polaczone} flaga={poprawnaFlaga(s?.flaga)} />
}
