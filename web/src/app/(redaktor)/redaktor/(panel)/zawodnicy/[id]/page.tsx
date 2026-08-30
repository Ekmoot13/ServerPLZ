import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import ZawodnikForm, { ZawodnikInitial } from '../ZawodnikForm'

export const dynamic = 'force-dynamic'

export default async function EditZawodnikPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ok?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const payload = await getPayload({ config })

  let doc: any = null
  try {
    doc = await payload.findByID({ collection: 'zawodnicy', id, depth: 1 })
  } catch {
    doc = null
  }
  if (!doc) notFound()

  const klubyRes = await payload.find({
    collection: 'kluby',
    limit: 0,
    pagination: false,
    depth: 0,
    sort: 'nazwa',
  })
  const kluby = (klubyRes.docs as any[]).map((k) => ({ id: String(k.id), nazwa: k.nazwa || '' }))

  const zdjecieUrl = doc.zdjecie && typeof doc.zdjecie === 'object' ? doc.zdjecie.url : undefined
  const klubId = doc.klub ? String(typeof doc.klub === 'object' ? doc.klub.id : doc.klub) : ''

  const initial: ZawodnikInitial = {
    imie: doc.imie || '',
    nazwisko: doc.nazwisko || '',
    aktywny: !!doc.aktywny,
    klubId,
    zdjecieUrl,
    dodatkoweStarty: Array.isArray(doc.dodatkoweStarty)
      ? doc.dodatkoweStarty.map((s: any) => ({
          rok: s.rok ?? undefined,
          regaty: s.regaty ?? '',
          miasto: s.miasto ?? '',
          klub: s.klub ?? '',
          miejsce: s.miejsce ?? undefined,
        }))
      : [],
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">
        Edytuj: {initial.imie} {initial.nazwisko}
      </h1>
      <ZawodnikForm id={String(doc.id)} initial={initial} kluby={kluby} ok={sp?.ok === '1'} />
    </div>
  )
}
