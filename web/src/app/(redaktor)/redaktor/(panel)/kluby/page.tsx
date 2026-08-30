import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import ListaKlubow, { Item } from './ListaKlubow'

export const dynamic = 'force-dynamic'

export default async function KlubyListPage() {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'kluby',
    limit: 0,
    pagination: false,
    depth: 0,
    sort: 'nazwa',
  })
  const items: Item[] = (res.docs as any[]).map((d) => ({
    id: String(d.id),
    nazwa: d.nazwa || '',
    poziomLigi: d.poziomLigi || undefined,
  }))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Kluby</h1>
      <ListaKlubow items={items} />
    </div>
  )
}
