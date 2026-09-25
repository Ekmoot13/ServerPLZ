import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Lista, { type Wniosek } from './Lista'

export const dynamic = 'force-dynamic'

export default async function SprostowaniaPage() {
  const payload = await getPayload({ config })
  const res = await payload
    .find({
      collection: 'sprostowania' as any,
      limit: 500,
      sort: '-createdAt',
      depth: 0,
      overrideAccess: true,
    })
    .catch(() => ({ docs: [] as any[] }))

  const wnioski: Wniosek[] = (res.docs as any[]).map((d) => ({
    id: String(d.id),
    typ: d.typ || '',
    status: d.status || 'nowy',
    zawodnikId: Number(d.zawodnikId) || 0,
    zawodnikNazwa: d.zawodnikNazwa || '',
    wariantId: Number(d.wariantId) || 0,
    klubNazwa: d.klubNazwa || '',
    regatyId: Number(d.regatyId) || 0,
    regatyOpis: d.regatyOpis || '',
    kontakt: d.kontakt || '',
    uwagi: d.uwagi || '',
    notatka: d.notatka || '',
    zastosowane: !!d.zastosowane,
    createdAt: d.createdAt || '',
  }))

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Sprostowania</h1>
      <p className="mb-6 max-w-3xl text-sm text-slate-500">
        Wnioski zawodników o poprawienie ich startów, wysłane przez stronę{' '}
        <span className="font-mono text-slate-600">/sprostowanie-wynikow</span>. Akceptacja od razu nanosi
        zmianę na dane ligowe. Pamiętaj: import wyników czyści tabele <span className="font-mono">liga_*</span>,
        więc po każdej aktualizacji danych trzeba uruchomić{' '}
        <span className="font-mono text-slate-600">scripts/zastosuj-sprostowania.ts</span>.
      </p>
      <Lista wnioski={wnioski} />
    </div>
  )
}
