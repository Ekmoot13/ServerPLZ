import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import WpisForm from '../WpisForm'
import { createWpis } from '../../../actions'

export const dynamic = 'force-dynamic'

export default async function NowyWpisPage() {
  const payload = await getPayload({ config })
  const catRes = await payload.find({ collection: 'categories', limit: 0, pagination: false, sort: 'title' })
  const categories = (catRes.docs as any[]).map((c) => ({ id: String(c.id), title: c.title || '' }))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nowy wpis</h1>
      <WpisForm
        action={createWpis}
        initial={{
          title: '',
          slug: '',
          status: 'draft',
          publishedAt: '',
          trescHtml: '',
          categories: [],
        }}
        categories={categories}
      />
    </div>
  )
}
