// Strona ligi regionalnej — ciemny motyw z akcentem koloru ligi, sekcje naprzemiennie ciemne/białe.
// Reużywalne: każda liga podaje własny akcent, wzór i treści. Dane terminów/newsów z bazy.
import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { statusRegat } from '@/lib/kalendarz'
import { Instagram, Facebook } from 'lucide-react'

const DARK = '#191919'
const MIES = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
]
// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

function dzien(od?: string | null, doo?: string | null): string {
  if (!od) return ''
  const a = new Date(od)
  const b = doo ? new Date(doo) : a
  return a.getDate() === b.getDate() ? `${a.getDate()}` : `${a.getDate()}-${b.getDate()}`
}
function miesiac(od?: string | null): string {
  if (!od) return ''
  return MIES[new Date(od).getMonth()]
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

export type RegionCfg = {
  poziom: RegExp
  akcent: string
  pattern: string
  logo: string
  tytul: string
  podtytul: string
  opis: string[]
  kontakt: string
  zdjecia: string[]
  regulaminPdf?: string
  regulaminOpis: string
  mapaQuery: string
  ytId?: string
  wynikiOpis: string[]
  sapUrl?: string
  koordynatorTytul: string
  koordynator: { imie: string; telefon: string; email: string; tekst: string }
  social?: { instagram?: string; facebook?: string }
  sponsorGlowny?: { nazwa: string; href?: string; logo: string }
  partner?: { nazwa: string; href: string; logo: string }
}

// Nagłówek sekcji z podkreśleniem w kolorze akcentu.
function H({ children, akcent, jasny }: { children: React.ReactNode; akcent: string; jasny?: boolean }) {
  return (
    <>
      <h2 className={`text-2xl font-extrabold uppercase tracking-wide md:text-3xl ${jasny ? 'text-white' : 'text-neutral-900'}`}>
        {children}
      </h2>
      <div className="mt-2 mb-8 h-1 w-14 rounded-full" style={{ backgroundColor: akcent }} />
    </>
  )
}

export default async function RegionLeague({ cfg }: { cfg: RegionCfg }) {
  const { akcent } = cfg
  const dark: React.CSSProperties = {
    backgroundColor: DARK,
    backgroundImage: `url(${cfg.pattern})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
  }

  const payload = await getPayload({ config: configPromise })
  const kalRes = await payload
    .find({ collection: 'kalendarz' as any, limit: 100, depth: 0, sort: 'dataOd' })
    .catch(() => ({ docs: [] as any[] }))
  const terminy = (kalRes.docs as any[]).filter((t) => cfg.poziom.test(t.poziom || ''))

  const postRes = await payload
    .find({ collection: 'posts', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 3, depth: 1 })
    .catch(() => ({ docs: [] as any[] }))
  const newsy = postRes.docs as any[]

  const btnOutline = (jasny: boolean) =>
    `inline-block rounded-[10px] border-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition ${
      jasny ? 'border-white text-white hover:bg-white hover:text-neutral-900' : 'border-neutral-800 text-neutral-900 hover:bg-neutral-900 hover:text-white'
    }`

  return (
    <main>
      {/* LOGO BAND */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-[1440px] justify-center px-4 py-6">
          <Img src={cfg.logo} alt={cfg.tytul} className="h-16 w-auto object-contain" />
        </div>
      </section>

      {/* HERO */}
      <section className="text-white" style={dark}>
        <div className="mx-auto max-w-4xl px-4 py-14 text-center md:py-16">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">{cfg.tytul}</h1>
          <p className="mt-4 font-bold text-white/90">{cfg.podtytul}</p>
          <div className="mt-6 space-y-4 text-white/75">
            {cfg.opis.map((a, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: a }} />
            ))}
            <p className="font-bold text-white" dangerouslySetInnerHTML={{ __html: cfg.kontakt }} />
          </div>
        </div>
        {cfg.zdjecia.length > 0 && (
          <div className="mx-auto max-w-[1440px] px-4 pb-14">
            <div className="grid gap-6 sm:grid-cols-3">
              {cfg.zdjecia.slice(0, 3).map((z, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-white/15 shadow-xl">
                  <Img src={z} className="h-56 w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* REGULAMIN + TERMINY */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14">
          <H akcent={akcent}>Regulamin</H>
          <p className="max-w-3xl text-neutral-700">{cfg.regulaminOpis}</p>
          {cfg.regulaminPdf && (
            <div className="mt-6 text-center">
              <a href={cfg.regulaminPdf} target="_blank" rel="noopener noreferrer" className={btnOutline(false)}>
                Zobacz pełen regulamin
              </a>
            </div>
          )}

          {terminy.length > 0 && (
            <div className="mt-14">
              <H akcent={akcent}>Terminy regat {terminy[0]?.dataOd ? new Date(terminy[0].dataOd).getFullYear() : ''}</H>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {terminy.map((t) => {
                  const done = statusRegat(t) === 'odbyly-sie'
                  return (
                    <div key={t.id} className="rounded-2xl border-2 border-neutral-200 p-5 text-center">
                      <div className="flex items-center justify-center gap-2 font-bold text-neutral-900">
                        {rundaLabel(t.nazwa, t.kolejnosc)}
                        {done && <span title="Odbyły się">✅</span>}
                      </div>
                      <div className="mt-2 text-3xl font-extrabold text-neutral-900">{dzien(t.dataOd, t.dataDo)}</div>
                      <div className="text-sm font-semibold" style={{ color: akcent }}>{miesiac(t.dataOd)}</div>
                      {t.miejsce && <div className="mt-1 font-bold text-neutral-900">{t.miejsce}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SPRAWDŹ GDZIE JESTEŚMY (mapa) */}
      <section className="text-white" style={dark}>
        <div className="mx-auto max-w-[1440px] px-4 py-14">
          <H akcent={akcent} jasny>Sprawdź gdzie jesteśmy!</H>
          <div className="overflow-hidden rounded-2xl border border-white/15">
            <iframe
              title="Mapa"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(cfg.mapaQuery)}&output=embed`}
              className="h-[420px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* AKTUALNOŚCI */}
      {newsy.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-14">
            <H akcent={akcent}>Aktualności</H>
            <div className="grid gap-6 md:grid-cols-3">
              {newsy.map((p) => (
                <Link key={p.id} href={`/posts/${p.slug}`} className="group overflow-hidden rounded-2xl border border-neutral-200 transition hover:shadow-lg">
                  {p?.heroImage?.url ? (
                    <Img src={p.heroImage.url} alt={p.title} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="h-44 w-full bg-neutral-100" />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold leading-snug text-neutral-900 group-hover:text-neutral-700">{p.title}</h3>
                    <p className="mt-2 text-xs text-neutral-500">{newsData(p.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/newsy" className={btnOutline(false)}>Zobacz wszystkie aktualności</Link>
            </div>
          </div>
        </section>
      )}

      {/* ZOBACZ I DOŁĄCZ (YT) */}
      {cfg.ytId && (
        <section className="text-white" style={dark}>
          <div className="mx-auto max-w-[1440px] px-4 py-14">
            <H akcent={akcent} jasny>Zobacz i dołącz!</H>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-black shadow-xl">
              <div className="relative aspect-video">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${cfg.ytId}`}
                  title={cfg.tytul}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WYNIKI + SAP */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14">
          <H akcent={akcent}>Wyniki 2026</H>
          <div className="max-w-3xl space-y-3 text-neutral-700">
            {cfg.wynikiOpis.map((a, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: a }} />
            ))}
          </div>
          {cfg.sapUrl && (
            <a
              href={cfg.sapUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Wyniki i tracking na platformie SAP"
              className="mx-auto mt-8 block max-w-3xl overflow-hidden rounded-2xl shadow-lg transition hover:opacity-95"
            >
              <Img
                src="https://ligazeglarska.pl/wp-content/uploads/2025/11/a1c2314d-7936-4a6e-bee9-d152c284edb0.jpg"
                alt="Wyniki i tracking na platformie SAP"
                className="w-full"
              />
            </a>
          )}
        </div>
      </section>

      {/* KONTAKT KOORDYNATORA */}
      <section className="text-white" style={dark}>
        <div className="mx-auto max-w-[1440px] px-4 py-14">
          <H akcent={akcent} jasny>{cfg.koordynatorTytul}</H>
          <p className="font-bold text-white">{cfg.koordynator.imie}</p>
          {cfg.koordynator.telefon && <p className="text-white/85">{cfg.koordynator.telefon}</p>}
          <a href={`mailto:${cfg.koordynator.email}`} className="font-semibold hover:underline" style={{ color: akcent }}>
            {cfg.koordynator.email}
          </a>
          <p className="mt-3 max-w-2xl text-white/75">{cfg.koordynator.tekst}</p>
          {cfg.social && (cfg.social.instagram || cfg.social.facebook) && (
            <div className="mt-5 flex gap-4">
              {cfg.social.facebook && (
                <a href={cfg.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/85 hover:text-white">
                  <Facebook size={22} />
                </a>
              )}
              {cfg.social.instagram && (
                <a href={cfg.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/85 hover:text-white">
                  <Instagram size={22} />
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SPONSOR GŁÓWNY (opcjonalnie) */}
      {cfg.sponsorGlowny && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-14">
            <H akcent={akcent}>Sponsor Główny</H>
            <div className="text-center">
              {cfg.sponsorGlowny.href ? (
                <a href={cfg.sponsorGlowny.href} target="_blank" rel="noopener noreferrer" title={cfg.sponsorGlowny.nazwa} className="inline-block transition hover:opacity-70">
                  <Img src={cfg.sponsorGlowny.logo} alt={cfg.sponsorGlowny.nazwa} className="max-h-28 w-auto object-contain" />
                </a>
              ) : (
                <Img src={cfg.sponsorGlowny.logo} alt={cfg.sponsorGlowny.nazwa} className="mx-auto max-h-28 w-auto object-contain" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* PARTNER */}
      {cfg.partner && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-14">
            <H akcent={akcent}>Partner Lig Regionalnych PLŻ</H>
            <div className="text-center">
              <a href={cfg.partner.href} target="_blank" rel="noopener noreferrer" title={cfg.partner.nazwa} className="inline-block transition hover:opacity-70">
                <Img src={cfg.partner.logo} alt={cfg.partner.nazwa} className="max-h-28 w-auto object-contain" />
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
