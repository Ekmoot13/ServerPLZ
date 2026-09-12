import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getAktualneKluby } from '@/lib/liga'
import { getPrzypisaniaSezonu } from '@/lib/panel'
import SezonForm, { type GrupaSezonu, type KlubOpcja } from './SezonForm'

export const dynamic = 'force-dynamic'

export default async function KlubyWSezoniePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>
}) {
  const sp = await searchParams
  const payload = await getPayload({ config })

  const [grupyRaw, klubyRes, przypisania] = await Promise.all([
    getAktualneKluby(),
    payload.find({ collection: 'kluby', limit: 0, pagination: false, depth: 0, sort: 'nazwa' }),
    getPrzypisaniaSezonu(),
  ])

  const kluby: KlubOpcja[] = (klubyRes.docs as any[]).map((d) => ({
    id: String(d.id),
    nazwa: d.nazwa || `#${d.id}`,
  }))

  const grupy: GrupaSezonu[] = grupyRaw.map((g) => ({
    poziom: g.poziom,
    poziomRaw: g.poziomRaw,
    rok: g.rok,
    zespoly: g.kluby.map((k) => ({
      poziom: g.poziom,
      poziomRaw: g.poziomRaw,
      miejsce: k.miejsce,
      nazwa: k.nazwa,
      warianty: k.warianty,
      klubMatka: k.klubMatka,
    })),
  }))

  // Stan początkowy selectów: klucz „poziomRaw|pierwszyWariant" → id klubu panelu.
  const poczatkowe: Record<string, string> = {}
  for (const g of grupy) {
    for (const z of g.zespoly) {
      const trafienie = z.warianty
        .map((w) => przypisania.poKluczu.get(`${g.poziomRaw}|${w}`))
        .find(Boolean)
      if (trafienie) poczatkowe[`${g.poziomRaw}|${z.warianty[0]}`] = trafienie.id
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Kluby w sezonie</h1>
      <p className="mb-6 max-w-3xl text-sm text-slate-600">
        Po lewej zespoły, które startują w tym sezonie (z bazy wyników), po prawej klub z panelu,
        który ma je reprezentować na stronie. Jeden klub może obsługiwać kilka poziomów — wtedy
        „Zawodnicy klubu" na stronie dzielą się na te poziomy. Zespół bez przypisania pokazuje się
        dalej, ale pod nazwą z bazy wyników i bez danych z panelu.
      </p>
      <SezonForm grupy={grupy} kluby={kluby} poczatkowe={poczatkowe} ok={sp?.ok === '1'} />
    </div>
  )
}
