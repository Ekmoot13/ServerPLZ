// Newsy — lista wpisów (wzór ligazeglarska.pl/newsy). Dane z kolekcji Posts (Payload).
import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Newsy — Polska Liga Żeglarska',
}

function formatDate(d?: string): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export default async function NewsyPage() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 200,
    depth: 1,
  })
  const posts: any[] = res.docs

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-bold md:text-5xl">Newsy</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Aktualności Polskiej Ligi Żeglarskiej — relacje z regat, wyniki, zapowiedzi i wydarzenia.
          </p>
        </div>
      </section>

      {/* LISTA */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {posts.length === 0 ? (
          <p className="text-slate-500">Brak newsów.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/posts/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 transition hover:shadow-lg"
              >
                {p?.heroImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.heroImage.url} alt={p.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="h-48 w-full bg-slate-100" />
                )}
                <div className="flex flex-1 flex-col p-4">
                  {p?.categories?.[0]?.title && (
                    <span className="text-xs uppercase tracking-wide text-sky-600">
                      {p.categories[0].title}
                    </span>
                  )}
                  <h2 className="mt-1 font-semibold leading-snug text-slate-800 group-hover:text-sky-600">
                    {p.title}
                  </h2>
                  <p className="mt-auto pt-3 text-sm text-slate-500">{formatDate(p.publishedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
