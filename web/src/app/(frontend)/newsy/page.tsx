// Newsy — lista wpisów z wyszukiwarką i wczytywaniem po 9 (wzór ligazeglarska.pl/newsy).
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import NewsyLista, { type NewsItem } from './NewsyLista'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Newsy — Polska Liga Żeglarska' }

export default async function NewsyPage() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 1000,
    depth: 1,
  })

  const fmtData = (d?: string): string => {
    if (!d) return ''
    try {
      return new Date(d).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    } catch {
      return ''
    }
  }

  const items: NewsItem[] = (res.docs as any[]).map((p) => ({
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    dateLabel: fmtData(p.publishedAt),
    year: p.publishedAt ? new Date(p.publishedAt).getUTCFullYear() : null,
    image: p?.heroImage?.url || null,
    category: p?.categories?.[0]?.title || null,
  }))

  return (
    <main className="bg-slate-50">
      {/* HERO — spójny z pozostałymi podstronami */}
      <section
        className="bg-navy text-white"
        style={{
          backgroundImage: 'url(/pkr-pattern-soft.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="mx-auto max-w-[1440px] px-4 py-16 text-center md:py-20">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Newsy</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12">
        <NewsyLista items={items} />
      </section>
    </main>
  )
}
