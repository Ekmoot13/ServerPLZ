import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

function fmt(d?: string): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

export default async function WpisyListPage() {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'posts',
    limit: 500,
    depth: 0,
    sort: '-publishedAt',
    draft: true,
  })
  const posts = res.docs as any[]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wpisy</h1>
        <Link
          href="/redaktor/wpisy/nowy"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          + Nowy wpis
        </Link>
      </div>
      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/redaktor/wpisy/${p.id}`}
            className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
          >
            <span className="font-medium text-slate-800">{p.title}</span>
            <span className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-slate-400">{fmt(p.publishedAt)}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  p._status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {p._status === 'published' ? 'opublikowany' : 'szkic'}
              </span>
              <span className="text-sky-600">Edytuj →</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
