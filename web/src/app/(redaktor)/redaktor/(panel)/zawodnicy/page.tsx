import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import ListaZawodnikow, { Item } from './ListaZawodnikow'

export const dynamic = 'force-dynamic'

export default async function ZawodnicyListPage() {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'zawodnicy',
    limit: 0,
    pagination: false,
    depth: 0,
    sort: 'nazwisko',
  })
  const items: Item[] = (res.docs as any[]).map((d) => ({
    id: String(d.id),
    imie: d.imie || '',
    nazwisko: d.nazwisko || '',
  }))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Zawodnicy</h1>
      <ListaZawodnikow items={items} />
    </div>
  )
}
