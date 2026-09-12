import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import PasekRegat from '@/components/home/PasekRegat'
import { statusRegat } from '@/lib/kalendarz'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Ligi Regionalne — Polska Liga Żeglarska' }

const U = 'https://ligazeglarska.pl/wp-content/uploads'
// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

const PARTNERSKIE = [
  { nazwa: 'Lubelska Liga Żeglarska', href: 'https://lubelskaligazeglarska.pl/', logo: `${U}/2026/01/1-3.jpg` },
  { nazwa: 'Warszawska Liga Żeglarska', href: 'https://www.facebook.com/warszawskaligazeglarska/', logo: `${U}/2026/01/2-2.jpg` },
]
const PARTNER = { nazwa: 'Yellow Bird', href: 'https://www.yellowbird.agency/', logo: `${U}/2025/11/yellowBird.jpg` }

const LIGI = [
  { nazwa: 'Wielkopolska Liga Żeglarska', href: '/regionalne/wielkopolska-liga-zeglarska', logo: `${U}/2025/11/WLZ_LOGO_PION_KOLOR.png`, kolor: '#de5a0f' },
  { nazwa: 'Trójmiejska Liga Żeglarska', href: '/regionalne/trojmiejska-liga-zeglarska', logo: `${U}/2025/11/TLZ_LOGO_PION_KOLOR-1.png`, kolor: '#0aa2c0' },
  { nazwa: 'Centralna Liga Żeglarska', href: '/regionalne/centralna-liga-zeglarska', logo: `${U}/2025/11/CLZ_LOGO_PION_KOLOR.png`, kolor: '#6fa300' },
]

function newsData(d?: string | null): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  } catch {
    return ''
  }
}

export default async function RegionalnePage() {
  const payload = await getPayload({ config: configPromise })
  const postRes = await payload
    .find({ collection: 'posts', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 3, depth: 1 })
    .catch(() => ({ docs: [] as any[] }))
  const newsy = postRes.docs as any[]

  // Jeden licznik - do najblizszej imprezy z calej rodziny regionalnej
  // (rundy trzech lig + Final). Dzis najblizszy jest Final, w kolejnym
  // sezonie beda to po kolei rundy poszczegolnych lig.
  const POZIOMY_REGIONALNE = [...LIGI.map((l) => l.nazwa), 'Finał Lig Regionalnych']
  const kalRes = await payload
    .find({ collection: 'kalendarz' as any, limit: 200, depth: 0, sort: 'dataOd' })
    .catch(() => ({ docs: [] as any[] }))
  const terminyRegionalne = (kalRes.docs as any[]).filter((t) =>
    POZIOMY_REGIONALNE.includes((t.poziom || '').trim()),
  )
  const nastepnaImpreza = terminyRegionalne.find((t) => statusRegat(t) !== 'odbyly-sie')
  // Po sezonie zostaje ostatnia impreza z adnotacja, zeby pasek nie znikal.
  const licznik = nastepnaImpreza || terminyRegionalne[terminyRegionalne.length - 1] || null

  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Ligi Regionalne</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <p className="mt-6 text-white/85">
            <strong>Ligi Regionalne to pierwszy szczebel Polskiej Ligi Żeglarskiej.</strong> Aby rozpocząć rywalizację
            w Lidze, należy najpierw wystartować w jednej z Lig Regionalnych. Najlepsze załogi każdej z lig otrzymują
            miejsca w <strong>Finale Lig Regionalnych</strong> — specjalnych regatach kwalifikacyjnych na koniec sezonu,
            w których wyłaniane są <strong>4 najlepsze kluby awansujące do 1 Ligi</strong> na kolejny sezon.
          </p>
          <h2 className="mt-10 text-2xl font-extrabold uppercase tracking-wide">Finał Lig Regionalnych</h2>
          <p className="mt-2 font-semibold text-white/90">Tylko dla załóg, które uzyskały awans. Do zobaczenia w Szczecinie!</p>
          <a
            href="mailto:info@ligazeglarska.pl"
            className="mt-6 inline-block rounded-[10px] border-2 border-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-navy"
          >
            Zawiadomienie o regatach
          </a>
        </div>
      </section>

      {/* LICZNIK do najblizszej imprezy regionalnej (rundy lig albo Final) */}
      {licznik && (
        <PasekRegat
          pokazPrzycisk={false}
          statusTekst={nastepnaImpreza ? undefined : 'Sezon zakończony'}
          dane={{
            nazwa: licznik.nazwa,
            miejsce: (licznik.poziom || '').trim(),
            poziom: licznik.miejsce,
            dataOd: licznik.dataOd,
            dataDo: licznik.dataDo,
          }}
        />
      )}

      {/* ZOBACZ NASZE LIGI */}
      <section className="mx-auto max-w-[1440px] px-4 py-14">
        <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Zobacz nasze Ligi Regionalne</h2>
        <div className="mt-2 mb-10 h-1 w-14 rounded-full bg-brand-red" />
        <div className="grid gap-6 md:grid-cols-3">
          {LIGI.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group overflow-hidden rounded-2xl border-2 border-navy/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-2 w-full" style={{ backgroundColor: l.kolor }} />
              <div className="flex flex-col items-center p-8">
                <div className="flex h-32 items-center justify-center">
                  <Img src={l.logo} alt={l.nazwa} className="max-h-32 w-auto object-contain" />
                </div>
                <span className="mt-4 inline-block text-sm font-bold uppercase tracking-wide" style={{ color: l.kolor }}>
                  Zobacz ligę →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PARTNERSKIE LIGI REGIONALNE */}
      <section className="mx-auto max-w-[1440px] px-4 pb-14">
        <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Partnerskie Ligi Regionalne</h2>
        <div className="mt-2 mb-10 h-1 w-14 rounded-full bg-brand-red" />
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {PARTNERSKIE.map((p) => (
            <a
              key={p.href}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              title={p.nazwa}
              className="flex h-40 items-center justify-center rounded-2xl border-2 border-navy/10 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Img src={p.logo} alt={p.nazwa} className="max-h-24 w-auto object-contain" />
            </a>
          ))}
        </div>
      </section>

      {/* DOŁĄCZ DO LIGI */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Dołącz do ligi</h2>
            <div className="mt-2 mb-6 h-1 w-14 rounded-full bg-brand-red" />
            <div className="space-y-4 text-white/85">
              <p>
                Polska Liga Żeglarska to wyjątkowy projekt, który od ponad dekady łączy żeglarzy z całej Polski,{' '}
                <strong>promując sportową rywalizację, pasję i nowoczesne podejście do żeglarstwa</strong>. To cykl regat,
                w którym liczy się współpraca, precyzja i emocje na wodzie.
              </p>
              <p>
                Udział w Lidze to nie tylko sport — to również <strong>sposób na budowanie relacji i integrację środowisk
                żeglarskich, klubów czy firm</strong>. Wspólne starty wzmacniają zespół, rozwijają umiejętności i dają
                satysfakcję z każdego wyścigu.
              </p>
              <p>
                Rozgrywki odbywają się na <strong>nowoczesnych jachtach RS21</strong>, z profesjonalną obsługą i
                sędziowaniem. Niezależnie od poziomu doświadczenia, każdy uczestnik znajdzie tu atmosferę rywalizacji,
                współpracy i żeglarskiej pasji.
              </p>
              <p>
                Jeśli chcesz spróbować swoich sił, dołącz do rozgrywek w swojej okolicy — w Trójmieście, Poznaniu lub na
                Wiśle w Płocku. Napisz na{' '}
                <a href="mailto:info@ligazeglarska.pl" className="font-semibold text-brand-red hover:underline">
                  info@ligazeglarska.pl
                </a>{' '}
                — pomożemy Ci wystartować!
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/25 shadow-xl">
            <Img src={`${U}/2025/10/PLZ_FLR_0256_gwidon_libera-scaled.jpg`} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* STRUKTURA ROZGRYWEK */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-16">
          <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Oficjalna struktura rozgrywek</h2>
          <div className="mt-2 mb-8 h-1 w-16 rounded-full bg-brand-red" />
          <Img src="/poziomy-lig.png" alt="Struktura rozgrywek Polskiej Ligi Żeglarskiej" className="mx-auto w-full max-w-4xl rounded-xl" />
        </div>
      </section>

      {/* AKTUALNOŚCI */}
      {newsy.length > 0 && (
        <section className="bg-navy text-white" style={patternBg}>
          <div className="mx-auto max-w-[1440px] px-4 py-14">
            <h2 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Aktualności</h2>
            <div className="mt-2 mb-8 h-1 w-14 rounded-full bg-brand-red" />
            <div className="grid gap-6 text-left md:grid-cols-3">
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
                    <h3 className="font-bold leading-snug text-white">{p.title}</h3>
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

      {/* PARTNER LIG REGIONALNYCH */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14">
          <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Partner Lig Regionalnych PLŻ</h2>
          <div className="mt-2 mb-8 h-1 w-14 rounded-full bg-brand-red" />
          <div className="text-center">
            <a href={PARTNER.href} target="_blank" rel="noopener noreferrer" title={PARTNER.nazwa} className="inline-block transition hover:opacity-70">
              <Img src={PARTNER.logo} alt={PARTNER.nazwa} className="max-h-28 w-auto object-contain" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
