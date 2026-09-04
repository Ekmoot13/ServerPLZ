import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import TerminForm from '../TerminForm'
import { updateTermin } from '../../../actions'

export const dynamic = 'force-dynamic'

export default async function EditTerminPage({
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
    doc = await payload.findByID({ collection: 'kalendarz' as any, id, depth: 0 })
  } catch {
    doc = null
  }
  if (!doc) notFound()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edytuj termin: {doc.nazwa}</h1>
      <TerminForm
        action={updateTermin}
        id={String(doc.id)}
        initial={{
          nazwa: doc.nazwa || '',
          poziom: doc.poziom || '',
          miejsce: doc.miejsce || '',
          dataOd: doc.dataOd || '',
          dataDo: doc.dataDo || '',
          link: doc.link || '',
          autoStatus: doc.autoStatus !== false,
          statusReczny: doc.statusReczny || 'zaplanowane',
          kolejnosc: doc.kolejnosc != null ? String(doc.kolejnosc) : '',
        }}
        ok={sp?.ok === '1'}
      />
    </div>
  )
}
