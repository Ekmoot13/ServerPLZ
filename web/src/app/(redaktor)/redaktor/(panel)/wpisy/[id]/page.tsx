import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import WpisForm from '../WpisForm'
import { updateWpis } from '../../../actions'

export const dynamic = 'force-dynamic'

export default async function EditWpisPage({
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
    doc = await payload.findByID({ collection: 'posts', id, depth: 1, draft: true })
  } catch {
    doc = null
  }
  if (!doc) notFound()

  const catRes = await payload.find({ collection: 'categories', limit: 0, pagination: false, sort: 'title' })
  const categories = (catRes.docs as any[]).map((c) => ({ id: String(c.id), title: c.title || '' }))

  const heroUrl = doc.heroImage && typeof doc.heroImage === 'object' ? doc.heroImage.url : undefined
  const selCats: string[] = Array.isArray(doc.categories)
    ? doc.categories.map((c: any) => String(typeof c === 'object' ? c.id : c))
    : []

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edytuj wpis</h1>
      <WpisForm
        action={updateWpis}
        id={String(doc.id)}
        initial={{
          title: doc.title || '',
          slug: doc.slug || '',
          status: doc._status || 'draft',
          publishedAt: doc.publishedAt || '',
          heroUrl,
          trescHtml: doc.trescHtml || '',
          categories: selCats,
        }}
        categories={categories}
        ok={sp?.ok === '1'}
      />
    </div>
  )
}
