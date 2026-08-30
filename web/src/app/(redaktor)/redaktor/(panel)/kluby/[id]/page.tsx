import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import KlubForm, { KlubInitial } from '../KlubForm'

export const dynamic = 'force-dynamic'

export default async function EditKlubPage({
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
    doc = await payload.findByID({ collection: 'kluby', id, depth: 1 })
  } catch {
    doc = null
  }
  if (!doc) notFound()

  const zawRes = await payload.find({
    collection: 'zawodnicy',
    limit: 0,
    pagination: false,
    depth: 0,
    sort: 'nazwisko',
  })
  const zawodnicy = (zawRes.docs as any[]).map((z) => ({
    id: String(z.id),
    name: `${z.imie || ''} ${z.nazwisko || ''}`.trim(),
  }))

  const logoUrl = doc.logo && typeof doc.logo === 'object' ? doc.logo.url : undefined
  const zaloga: string[] = Array.isArray(doc.zaloga)
    ? doc.zaloga.map((z: any) => String(typeof z === 'object' ? z.id : z))
    : []

  const initial: KlubInitial = {
    nazwa: doc.nazwa || '',
    aktywny: !!doc.aktywny,
    poziomLigi: doc.poziomLigi || '',
    logoUrl,
    www: doc.www || '',
    facebook: doc.facebook || '',
    instagram: doc.instagram || '',
    youtube: doc.youtube || '',
    zaloga,
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edytuj klub: {initial.nazwa}</h1>
      <KlubForm id={String(doc.id)} initial={initial} zawodnicy={zawodnicy} ok={sp?.ok === '1'} />
    </div>
  )
}
