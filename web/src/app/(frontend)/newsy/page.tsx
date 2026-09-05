// Newsy — lista wpisów (wzór ligazeglarska.pl/newsy). Dane z kolekcji Posts (Payload).
import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import PageHero from '@/components/site/PageHero'

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
    <main className="bg-slate-50">
      <PageHero
        tytul="Newsy"
        podtytul="Aktualności Polskiej Ligi Żeglarskiej — relacje z regat, wyniki, zapowiedzi i wydarzenia."
      />

      <section className="mx-auto max-w-[1440px] px-4 py-12">
        {posts.length === 0 ? (
          <p className="text-slate-500">Brak newsów.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/posts/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border-2 border-navy/10 bg-white transition hover:border-brand-red hover:shadow-lg"
              >
                {p?.heroImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.heroImage.url} alt={p.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="h-48 w-full bg-slate-100" />
                )}
                <div className="flex flex-1 flex-col p-4">
                  {p?.categories?.[0]?.title && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-red">
                      {p.categories[0].title}
                    </span>
                  )}
                  <h2 className="mt-1 font-bold leading-snug text-navy group-hover:text-brand-red">
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
