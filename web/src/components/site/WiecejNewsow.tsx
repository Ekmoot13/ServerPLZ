import React from 'react'
import Link from 'next/link'

export type NewsKafel = {
  slug: string
  title: string
  data?: string | null
  kategoria?: string | null
  obraz?: string | null
}

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

function fmtData(d?: string | null): string {
  if (!d) return ''
  try {
    return new Date(d)
      .toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
      .toUpperCase()
  } catch {
    return ''
  }
}

export default function WiecejNewsow({ items, tytul = 'Więcej do przeczytania' }: { items: NewsKafel[]; tytul?: string }) {
  if (!items.length) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">{tytul}</h2>
      <div className="mt-2 mb-8 h-1 w-14 rounded-full bg-brand-red" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/posts/${p.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-md"
          >
            <div className="relative aspect-[16/10] bg-slate-100">
              {p.obraz ? (
                <Img src={p.obraz} alt={p.title} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-slate-300">brak zdjęcia</span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              {p.kategoria && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-brand-red">{p.kategoria}</span>
              )}
              <h3 className="line-clamp-3 text-sm font-bold leading-snug text-navy group-hover:text-brand-red">{p.title}</h3>
              <p className="mt-auto pt-2 text-[11px] text-slate-400">{fmtData(p.data)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/newsy"
          className="inline-block rounded-[10px] border-2 border-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
        >
          Zobacz wszystkie aktualności
        </Link>
      </div>
    </section>
  )
}
