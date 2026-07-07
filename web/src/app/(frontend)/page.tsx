import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-dynamic'

// Klubowi Mistrzowie Polski (jak na ligazeglarska.pl)
const CHAMPIONS: { rok: number; nazwa: string }[] = [
  { rok: 2015, nazwa: 'Yacht Club Sopot' },
  { rok: 2016, nazwa: 'AZS Politechnika Gdańska' },
  { rok: 2017, nazwa: 'Yacht Club Sopot' },
  { rok: 2018, nazwa: 'Olsztyński Klub Żeglarski' },
  { rok: 2019, nazwa: 'Energa Giżycka Grupa Regatowa' },
  { rok: 2020, nazwa: 'YKP Gdynia' },
  { rok: 2021, nazwa: 'YKP Gdynia' },
  { rok: 2022, nazwa: 'YKP Gdynia' },
  { rok: 2023, nazwa: 'Yacht Club Gdańsk' },
  { rok: 2024, nazwa: 'Yacht Club Sopot' },
  { rok: 2025, nazwa: 'Yacht Club Gdańsk' },
]

function norm(s?: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatDate(d?: string): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [postsRes, klubyRes] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 6,
      depth: 1,
    }),
    payload.find({ collection: 'kluby', sort: 'nazwa', limit: 200, depth: 1 }),
  ])

  const posts: any[] = postsRes.docs

  const logoByName = new Map<string, string>()
  for (const k of klubyRes.docs as any[]) {
    if (k?.logo?.url && String(k.logo?.mimeType || '').startsWith('image')) {
      logoByName.set(norm(k.nazwa), k.logo.url)
    }
  }
  const findLogo = (nazwa: string): string | undefined => {
    const n = norm(nazwa)
    if (logoByName.has(n)) return logoByName.get(n)
    for (const [k, v] of logoByName) {
      if (k.includes(n) || n.includes(k)) return v
    }
    return undefined
  }

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-sky-400">Pure racing, true passion</p>
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">Regaty jak na stadionie</h1>
          <p className="mx-auto mb-8 max-w-2xl text-slate-300">
            Ponad 500 zawodniczek i zawodników w 120 klubach rywalizuje o tytuł Klubowego Mistrza Polski
            na jednakowych jachtach RS21.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/zgloszenia" className="rounded-md bg-sky-500 px-6 py-3 font-medium text-white hover:bg-sky-400">
              Zgłoś się
            </Link>
            <Link href="/wyniki" className="rounded-md border border-white/30 px-6 py-3 font-medium hover:bg-white/10">
              Wyniki
            </Link>
          </div>
        </div>
      </section>

      {/* AKTUALNOŚCI */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Aktualności</h2>
          <Link href="/posts" className="text-sky-600 hover:underline">Zobacz wszystkie →</Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-slate-500">Brak aktualności.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p: any) => (
              <Link
                key={p.id}
                href={`/posts/${p.slug}`}
                className="group block overflow-hidden rounded-lg border border-slate-200 transition hover:shadow-lg"
              >
                {p?.heroImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.heroImage.url} alt={p.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="h-48 w-full bg-slate-100" />
                )}
                <div className="p-4">
                  {p?.categories?.[0]?.title && (
                    <span className="text-xs uppercase tracking-wide text-sky-600">{p.categories[0].title}</span>
                  )}
                  <h3 className="mt-1 font-semibold group-hover:text-sky-600">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{formatDate(p.publishedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* REGATY JAK NA STADIONIE */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Regaty jak na stadionie</h2>
          <p className="leading-relaxed text-slate-600">
            Od ponad 10 lat organizujemy regularne rozgrywki w Sopocie, Pucku, Gdyni i Szczecinie, w których
            kluby żeglarskie rywalizują o tytuł Klubowego Mistrza Polski, awans do wyższej ligi lub uniknięcie
            spadku. Zapewniamy jednakowe, nowoczesne jachty RS21, dynamiczne wyścigi i sędziowanie na
            światowym poziomie.
          </p>
        </div>
      </section>

      {/* KLUBOWI MISTRZOWIE POLSKI */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold">Klubowi Mistrzowie Polski</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {CHAMPIONS.map((c) => {
            const logo = findLogo(c.nazwa)
            return (
              <div key={c.rok} className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-4 text-center">
                <div className="flex h-20 items-center justify-center">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt={c.nazwa} className="max-h-20 w-auto object-contain" />
                  ) : (
                    <span className="text-3xl font-bold text-slate-300">{c.rok}</span>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800">{c.nazwa}</p>
                <p className="text-xs text-slate-500">Mistrz Polski {c.rok}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-8 text-center">
          <Link href="/kluby" className="text-sky-600 hover:underline">Wszystkie kluby →</Link>
        </div>
      </section>

      {/* CZYM JEST PLŻ */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Czym jest Polska Liga Żeglarska?</h2>
          <p className="leading-relaxed text-slate-300">
            Polska Liga Żeglarska powstała w 2015 roku. Cykliczne regaty rozgrywane są na trzech głównych
            poziomach — Ekstraklasa, 1 Liga i Ligi Regionalne. Organizujemy także Żeglarskie Mistrzostwa Polski
            Kobiet oraz Młodzieżową Ligę Żeglarską. System PLŻ to ponad 120 klubów i 500 zawodników, co stawia
            ją na czele wszystkich lig żeglarskich na świecie.
          </p>
        </div>
      </section>
    </main>
  )
}
