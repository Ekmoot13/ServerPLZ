import React from 'react'
import Link from 'next/link'
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
  const len = (v: unknown): number => (Array.isArray(v) ? v.length : 0)
  const items: Item[] = (res.docs as any[]).map((d) => ({
    id: String(d.id),
    nazwa: d.nazwa || '',
    poziomLigi: d.poziomLigi || undefined,
    idZestawienia: typeof d.idZestawienia === 'number' ? d.idZestawienia : null,
    tryb: d.trybPowiazania === 'warianty' ? 'warianty' : 'zestawienie',
    liczbaWariantow: len(d.warianty),
    wykluczone: len(d.wykluczoneWarianty),
  }))

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Kluby</h1>
        <Link
          href="/redaktor/kluby/sezon"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          Kluby w sezonie →
        </Link>
      </div>
      <ListaKlubow items={items} />
    </div>
  )
}
