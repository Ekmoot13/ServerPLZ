// Wspólny widok strony ligi: kluby (kolejność sezonu) + terminy + wyniki + aktualności — dla wskazanego poziomu.
// Dane na bieżąco z bazy (liga_* + kolekcje Payload). Logika bez zmian, tylko widok.
import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getLataWynikow, getWynikiPelne } from '@/lib/liga'
import { getKlubMedia } from '@/lib/klubMedia'
import { statusRegat } from '@/lib/kalendarz'
import WynikiWidok from '@/app/(frontend)/wyniki/WynikiWidok'
import PasekRegat from '@/components/home/PasekRegat'

const MIES = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
]
// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

function dzienZakres(od?: string | null, doo?: string | null): string {
  if (!od) return ''
  const a = new Date(od)
  const b = doo ? new Date(doo) : a
  return a.getDate() === b.getDate() ? `${a.getDate()}` : `${a.getDate()}-${b.getDate()}`
}
function miesiac(od?: string | null, doo?: string | null): string {
  if (!od) return ''
  const a = new Date(od)
  const b = doo ? new Date(doo) : a
  return a.getMonth() === b.getMonth() ? MIES[a.getMonth()] : `${MIES[a.getMonth()]} / ${MIES[b.getMonth()]}`
}
function rundaLabel(nazwa: string, kol?: number | null): string {
  const m = (nazwa || '').match(/runda\s*\d+/i)
  if (m) return m[0].replace(/^r/, 'R')
  return kol != null ? `Runda ${kol}` : nazwa
}
function newsData(d?: string | null): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  } catch {
    return ''
  }
}

export default async function LigaLanding({
  poziom,
  tytul,
  regulamin,
  motyw,
  opis,
  zgloszenieMail,
}: {
  poziom: RegExp
  tytul: string
  regulamin?: string
  motyw?: { pattern?: string; akcent?: string }
  opis?: string[]
  zgloszenieMail?: string
}) {
  const pattern = motyw?.pattern || '/pkr-pattern-soft.png'
  const akcent = motyw?.akcent || '#d82029'
  const patternBg: React.CSSProperties = {
    backgroundImage: `url(${pattern})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
  }
  const kreska = { backgroundColor: akcent }

  const payload = await getPayload({ config: configPromise })
  const lata = await getLataWynikow()
  const rok = lata[0]
  const ligi = rok ? await getWynikiPelne(rok) : []
  const liga = ligi.find((l) => poziom.test(l.poziom)) || null

  const kluby = (liga?.ranking || []).map((r: any) => ({
    skrot: r.skrot,
    klub: r.klub,
    slug: r.slug,
    logo: getKlubMedia(r.klub)?.logo || null,
  }))

  const kalRes = await payload
    .find({ collection: 'kalendarz' as any, limit: 100, depth: 0, sort: 'dataOd' })
    .catch(() => ({ docs: [] as any[] }))
  const terminy = (kalRes.docs as any[]).filter((t) => poziom.test(t.poziom || ''))

  // Najblizsza (lub trwajaca) runda tego poziomu - do licznika odliczania.
  const najblizsza = terminy.find((t) => statusRegat(t) !== 'odbyly-sie') || null

  const postRes = await payload
    .find({ collection: 'posts', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 80, depth: 1 })
    .catch(() => ({ docs: [] as any[] }))
  const newsy = (postRes.docs as any[])
    .filter((p) => (p.categories || []).some((c: any) => poziom.test(c?.title || '')))
    .slice(0, 3)

  return (
    <main className="bg-slate-50">
      {/* HERO + KLUBY */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-[1440px] px-4 py-14 md:py-16">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">{tytul}</h1>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full" style={kreska} />
          </div>

          {kluby.length > 0 && (
            <div className="hidden gap-4 sm:grid sm:grid-cols-5 xl:grid-cols-10">
              {kluby.map((k) => (
                <Link key={k.slug} href={`/kluby/${k.slug}`} className="group block">
                  <div className="flex flex-col items-center rounded-xl bg-white p-2 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg">
                    <div className="flex h-20 w-full items-center justify-center">
                      {k.logo ? (
                        <Img src={k.logo} alt={k.klub} className="max-h-16 w-auto object-contain" />
                      ) : (
                        <span className="text-sm font-bold text-navy">{k.skrot}</span>
                      )}
                    </div>
                    <span className="mt-1 text-xs font-bold uppercase tracking-wide text-navy">{k.skrot}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LICZNIK DO NAJBLIZSZEJ RUNDY TEGO POZIOMU (bez przycisku - jest tylko na stronie glownej) */}
      {najblizsza && (
        <PasekRegat
          pokazPrzycisk={false}
          dane={{
            nazwa: najblizsza.nazwa,
            miejsce: najblizsza.miejsce,
            poziom: rundaLabel(najblizsza.nazwa, najblizsza.kolejnosc),
            dataOd: najblizsza.dataOd,
            dataDo: najblizsza.dataDo,
          }}
        />
      )}

      {/* OPIS LIGI (opcjonalny — ligi regionalne) */}
      {opis && opis.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-14">
          <div className="space-y-4 text-slate-700">
            {opis.map((a, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: a }} />
            ))}
          </div>
          {zgloszenieMail && (
            <div className="mt-6">
              <a
                href={`mailto:${zgloszenieMail}`}
                className="inline-block rounded-[10px] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90"
                style={{ backgroundColor: akcent }}
              >
                Wyślij zgłoszenie
              </a>
            </div>
          )}
        </section>
      )}

      {/* TERMINY */}
      {terminy.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 py-14">
          <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Terminy regat {rok}</h2>
          <div className="mt-2 mb-8 h-1 w-14 rounded-full" style={kreska} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {terminy.map((t) => {
              const done = statusRegat(t) === 'odbyly-sie'
              return (
                <div key={t.id} className={`rounded-2xl border-2 p-5 text-center ${done ? 'border-emerald-300 bg-emerald-50/40' : 'border-navy/10 bg-white'}`}>
                  <div className="flex items-center justify-center gap-2 font-bold text-navy">
                    {rundaLabel(t.nazwa, t.kolejnosc)}
                    {done && <span title="Odbyły się">✅</span>}
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-navy">{dzienZakres(t.dataOd, t.dataDo)}</div>
                  <div className="text-sm text-slate-500">{miesiac(t.dataOd, t.dataDo)}</div>
                  {t.miejsce && <div className="mt-1 font-bold text-navy">{t.miejsce}</div>}
                </div>
              )
            })}
          </div>
          {regulamin && (
            <div className="mt-8 text-center">
              <a
                href={regulamin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-[10px] border-2 border-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
              >
                Pobierz regulamin
              </a>
            </div>
          )}
        </section>
      )}

      {/* WYNIKI */}
      {liga && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-14">
            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Wyniki {rok}</h2>
            <div className="mt-2 mb-8 h-1 w-14 rounded-full" style={kreska} />
            <WynikiWidok ligi={[liga] as any} ukryjPrzelacznik />
            <div className="mt-8 text-center">
              <Link
                href="/wyniki"
                className="inline-block rounded-[10px] border-2 border-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
              >
                Zobacz wszystkie wyniki
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* AKTUALNOŚCI */}
      {newsy.length > 0 && (
        <section className="bg-navy text-white" style={patternBg}>
          <div className="mx-auto max-w-[1440px] px-4 py-14">
            <h2 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Aktualności</h2>
            <div className="mt-2 mb-8 h-1 w-14 rounded-full" style={kreska} />
            <div className="grid gap-6 md:grid-cols-3">
              {newsy.map((p) => (
                <Link
                  key={p.id}
                  href={`/posts/${p.slug}`}
                  className="group overflow-hidden rounded-2xl border border-white/15 bg-white/5 transition hover:bg-white/10"
                >
                  {p?.heroImage?.url ? (
                    <Img src={p.heroImage.url} alt={p.title} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="h-44 w-full bg-white/10" />
                  )}
                  <div className="p-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: akcent }}>{tytul}</span>
                    <h3 className="mt-1 font-bold leading-snug text-white">{p.title}</h3>
                    <p className="mt-2 text-xs text-white/60">{newsData(p.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/newsy"
                className="inline-block rounded-[10px] border-2 border-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-navy"
              >
                Zobacz wszystkie aktualności
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
