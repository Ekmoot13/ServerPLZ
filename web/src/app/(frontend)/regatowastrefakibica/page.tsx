// Regatowa Strefa Kibica — transmisje na żywo, mapa SAP (RaceBoard), wyniki, informacje.
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import SapLeaderboard from '@/components/SapLeaderboard'
import SapViewer from '@/components/SapViewer'
import StrefaTransmisja from '@/components/StrefaTransmisja'
import { Ikona } from '@/components/strefa/ikony'
import { pobierzZdjeciaSmugMug, type ZdjecieGalerii } from '@/lib/smugmug'
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Strefa Kibica — Polska Liga Żeglarska' }

const HLS_BASE = process.env.NEXT_PUBLIC_HLS_URL || 'http://localhost:8888'

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
}

function newsData(d?: string | null): string {
  if (!d) return ''
  try {
    return new Date(d)
      .toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
      .toUpperCase()
  } catch {
    return ''
  }
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
      NA ŻYWO
    </span>
  )
}

export default async function RegatowaStrefaKibicaPage() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'transmisje',
    where: { aktywny: { equals: true } },
    limit: 50,
  })
  const streams: any[] = res.docs

  const settings: any = await payload.findGlobal({ slug: 'strefa-kibica' }).catch(() => null)
  const mapaUrl: string = settings?.mapaUrl || ''
  const pokazMape: boolean = settings?.pokazMape !== false
  const pokazTransmisje: boolean = settings?.pokazTransmisje !== false
  const pokazWyniki: boolean = settings?.pokazWyniki !== false
  const sapBase: string = settings?.sapBase || 'https://plz2026.sapsailing.com'
  const leaderboardName: string = settings?.leaderboardName || ''
  const pokazProgram: boolean = settings?.pokazProgram !== false
  const programTytul: string = settings?.programTytul || 'Śledź z nami regaty dzień po dniu'
  const programWstep: string = settings?.programWstep || ''
  const programTlo: string = settings?.programTlo || ''
  const linkiRaw: any[] = Array.isArray(settings?.linki) ? settings.linki : []
  // Tracking SAP zawsze na początku
  const jestSap = (l: any) => l?.ikona === 'sap' || /sap/i.test(`${l?.label || ''} ${l?.url || ''}`)
  const linki: any[] = [...linkiRaw].sort((a, b) => (jestSap(b) ? 1 : 0) - (jestSap(a) ? 1 : 0))
  const program: any[] = Array.isArray(settings?.program) ? settings.program : []
  const mapaEmbed: string = settings?.mapaEmbed || ''

  // ---- Galeria ----
  const pokazGalerie: boolean = settings?.pokazGalerie !== false
  const galeriaTytul: string = settings?.galeriaTytul || 'Galeria zdjęć'
  const galeriaUrl: string = settings?.galeriaUrl || ''
  const galeriaTryb: string = settings?.galeriaTryb === 'reczny' ? 'reczny' : 'auto'
  const galeriaOdKonca: boolean = settings?.galeriaKolejnosc !== 'pierwsze'
  const galeriaReczne: ZdjecieGalerii[] = (
    Array.isArray(settings?.galeriaZdjecia) ? settings.galeriaZdjecia : []
  )
    .filter((z: any) => z?.url)
    .map((z: any) => ({ obraz: String(z.url), link: String(z.link || galeriaUrl), opis: '' }))
  // W trybie automatycznym lista ręczna jest zapasem na wypadek, gdyby SmugMug
  // nie odpowiedział — sekcja nie może zostać pustą ramką.
  const zdjeciaZGalerii =
    pokazGalerie && galeriaTryb === 'auto' && galeriaUrl
      ? await pobierzZdjeciaSmugMug(galeriaUrl, 4, galeriaOdKonca)
      : []
  const galeria = (zdjeciaZGalerii.length ? zdjeciaZGalerii : galeriaReczne).slice(0, 4)

  // ---- Aktualności ----
  const pokazAktualnosci: boolean = settings?.pokazAktualnosci !== false
  const aktualnosciTytul: string = settings?.aktualnosciTytul || 'Aktualności'
  const aktualnosciKategoria: string = String(settings?.aktualnosciKategoria || '')
  const newsRes = pokazAktualnosci
    ? await payload
        .find({
          collection: 'posts',
          where: aktualnosciKategoria
            ? {
                and: [
                  { _status: { equals: 'published' } },
                  { categories: { in: [aktualnosciKategoria] } },
                ],
              }
            : { _status: { equals: 'published' } },
          sort: '-publishedAt',
          limit: 4,
          depth: 1,
        })
        .catch(() => ({ docs: [] as any[] }))
    : { docs: [] as any[] }
  const newsy = (newsRes.docs as any[]) || []

  // stan „na żywo" — pokazuj czerwone plakietki tylko gdy coś faktycznie leci
  const mapaLive = pokazMape && !!mapaUrl
  const streamLive = pokazTransmisje && streams.length > 0

  // układ dashboardu dopasowuje się do włączonych sekcji:
  // wyłączona mapa oddaje szerokość prawej kolumnie i odwrotnie,
  // a przy jednej sekcji w prawej kolumnie zajmuje ona całą wysokość.
  const prawaIle = (pokazTransmisje ? 1 : 0) + (pokazWyniki ? 1 : 0)
  const pokazDashboard = pokazMape || prawaIle > 0
  const gridCols = pokazMape && prawaIle > 0 ? 'lg:grid-cols-[1.8fr_1fr]' : 'lg:grid-cols-1'
  const prawaRows = prawaIle === 2 ? 'lg:grid-rows-2' : 'lg:grid-rows-1'

  // Gdy wyniki są jedyną sekcją, tabela dostaje tyle wysokości, ile potrzebuje.
  // Dwadzieścia załóg i szesnaście kolumn nie mieści się w 80vh na niższych
  // ekranach, a zagnieżdżony pasek przewijania w środku strony jest gorszy niż
  // dłuższa strona — kibic i tak przewija, tylko nie wie, czym.
  const tylkoWyniki = pokazWyniki && !pokazMape && !pokazTransmisje
  const wysokoscDashboardu = tylkoWyniki ? '' : 'lg:h-[80vh]'
  // Sama tabela rozciągnięta na 1600 px wygląda jak arkusz kalkulacyjny i nie
  // trzyma się linii reszty strony. Zwężamy ją do szerokości sekcji poniżej.
  const szerokoscDashboardu = tylkoWyniki ? 'max-w-5xl' : 'max-w-[1600px]'

  // Odtwarzacz ma aspect-video (wysokość liczona z szerokości), więc na pełnej
  // szerokości rozpycha wiersz o stałej wysokości. Gdy mapa jest wyłączona,
  // ograniczamy jego szerokość do tego, co zmieści się w dostępnej wysokości.
  // Wartości odpowiadają wierszom siatki lg:h-[80vh] pomniejszonym o nagłówki,
  // przeliczonym przez 16/9 (36vh -> 64vh, 74vh -> 131vh). Bez calc(...) z ukośnikiem,
  // bo Tailwind bierze go za modyfikator przezroczystości i nie generuje klasy.
  const transmisjaCap = pokazMape
    ? ''
    : prawaIle === 2
      ? 'lg:max-w-[64vh]'
      : 'lg:max-w-[131vh]'

  return (
    <main>
      {/* PASEK TYTUŁOWY */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-4 py-6">
          <h1 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Strefa Kibica</h1>
          <p className="ml-auto hidden text-sm text-white/70 md:block">
            Mapa, transmisja i wyniki na żywo — w jednym miejscu.
          </p>
        </div>
      </section>

      {/* DASHBOARD: MAPA | TRANSMISJA + WYNIKI (ciemne tło) */}
      {pokazDashboard && (
        <section className="bg-navy-900" style={patternBg}>
          <div className={`mx-auto ${szerokoscDashboardu} px-4 py-6`}>
            <div className={`grid gap-4 ${wysokoscDashboardu} ${gridCols}`}>
              {/* LEWA — MAPA SAP */}
              {pokazMape && (
                <div className="flex min-h-[360px] flex-col lg:h-full">
                  <div className="mb-2 flex items-center gap-2">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-white/85">Mapa wyścigu — pozycje łódek na żywo</h2>
                    {mapaLive && <LiveBadge />}
                  </div>
                  <div className="min-h-0 flex-1">
                    {mapaUrl ? (
                      <SapViewer src={mapaUrl} fill />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
                        <div className="mb-2 text-4xl">🗺️</div>
                        <p className="font-medium">Mapa z pozycjami łódek (SAP) pojawi się w trakcie regat.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PRAWA — TRANSMISJA (góra) + WYNIKI (dół) */}
              {prawaIle > 0 && (
                <div className={`grid gap-4 lg:h-full ${prawaRows}`}>
                  {/* TRANSMISJA */}
                  {pokazTransmisje && (
                    <div className="flex min-h-[240px] flex-col overflow-hidden">
                      <div className="mb-2 flex items-center gap-2">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-white/85">Transmisja na żywo</h2>
                        {streamLive && <LiveBadge />}
                      </div>
                      <div className="flex min-h-0 flex-1 items-center justify-center">
                        <div className={`w-full ${transmisjaCap}`}>
                          <StrefaTransmisja streams={streams} hlsBase={HLS_BASE} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WYNIKI */}
                  {pokazWyniki && (
                    <div
                      className={`flex min-w-0 flex-col ${
                        tylkoWyniki ? '' : 'min-h-[240px] overflow-hidden'
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        {/* Bez plakietki: tabela z SAP ma wlasna, a trzecie „na zywo"
                            w jednym kadrze przestaje cokolwiek znaczyc. */}
                        <h2 className="text-sm font-bold uppercase tracking-wide text-white/85">Wyniki na żywo</h2>
                      </div>
                      <div
                        className={`min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 ${
                          tylkoWyniki ? '' : 'min-h-0 flex-1 overflow-auto'
                        }`}
                      >
                        {leaderboardName ? (
                          <div className="bg-white">
                            <SapLeaderboard name={leaderboardName} base={sapBase} />
                          </div>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white/60">
                            <div className="mb-2 text-3xl">🏁</div>
                            Wyniki na żywo z danych regat pojawią się w trakcie rundy.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SEKCJA INFORMACYJNA — PROGRAM WEEKENDU (edytowalna w panelu redaktora) */}
      {pokazProgram && (
        <section className="relative bg-white">
          {/* Zdjecie w tle buduje poczucie miejsca. Jasna warstwa nad nim
              utrzymuje czytelnosc granatowych naglowkow i szarego tekstu. */}
          {programTlo && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={programTlo} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-white/88" />
            </>
          )}
          <div className="relative mx-auto max-w-5xl px-4 py-14">
            <h2 className="text-center text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">{programTytul}</h2>
            <div className="mx-auto mt-2 mb-6 h-1 w-14 rounded-full bg-brand-red" />
            {programWstep && <p className="mx-auto mb-8 max-w-3xl whitespace-pre-line text-center text-slate-700 md:text-lg">{programWstep}</p>}

            {/* szybkie linki */}
            {linki.length > 0 && (
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                {linki.map((l: any, i: number) =>
                  l?.url ? (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border-2 border-navy px-5 py-2 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
                    >
                      {l.ikona && <Ikona name={l.ikona} className="text-navy group-hover:text-white" />}
                      {l.label || l.url}
                    </a>
                  ) : null,
                )}
              </div>
            )}

            {/* program dzień po dniu */}
            {program.length > 0 && (
              <div className="space-y-6">
                {program.map((d: any, di: number) => (
                  <div key={di} className="rounded-2xl border border-slate-200 bg-white/85 p-6 backdrop-blur-sm">
                    <h3 className="font-extrabold uppercase tracking-wide text-navy">{d?.tytul}</h3>
                    <div className="mt-2 mb-4 h-0.5 w-10 rounded-full bg-brand-red" />
                    <ul className="space-y-2.5">
                      {(Array.isArray(d?.pozycje) ? d.pozycje : []).map((p: any, pi: number) => (
                        <li key={pi} className="flex items-center gap-3 text-sm text-slate-700">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center text-navy">
                            {p?.ikona ? <Ikona name={p.ikona} className="text-navy" /> : <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />}
                          </span>
                          <span className="w-24 shrink-0 font-bold text-navy">{p?.czas || ''}</span>
                          {p?.link ? (
                            <a href={p.link} target="_blank" rel="noopener noreferrer" className="font-medium text-sky-500 hover:text-sky-600 hover:underline">
                              {p.opis}
                            </a>
                          ) : (
                            <span>{p?.opis}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* lokalizacja */}
            {mapaEmbed && (
              <div className="mt-12">
                <h3 className="text-xl font-extrabold uppercase tracking-wide text-navy">Lokalizacja</h3>
                <div className="mt-2 mb-5 h-1 w-12 rounded-full bg-brand-red" />
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <iframe
                    src={mapaEmbed}
                    title="Lokalizacja regat"
                    className="h-[360px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---- GALERIA ZDJEC ----
          Granat z izobarami, tak jak naglowki pozostalych podstron. Czwarte
          zdjecie chowamy na telefonie, zeby kolumna nie ciagnela sie w nieskonczonosc. */}
      {pokazGalerie && galeria.length > 0 && (
        <section className="bg-navy text-white" style={patternBg}>
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-center text-2xl font-extrabold uppercase tracking-wide md:text-3xl">
              {galeriaTytul}
            </h2>
            <div className="mx-auto mt-2 mb-8 h-1 w-14 rounded-full bg-brand-red" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {galeria.map((z, i) => (
                <a
                  key={i}
                  href={z.link || galeriaUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block overflow-hidden rounded-2xl border border-white/15 bg-white/5 ${
                    i >= 3 ? 'hidden md:block' : ''
                  }`}
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={z.obraz}
                      alt={z.opis || 'Zdjęcie z regat'}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  {z.opis && (
                    <p className="line-clamp-2 px-3 py-2 text-xs text-white/70">{z.opis}</p>
                  )}
                </a>
              ))}
            </div>

            {galeriaUrl && (
              <div className="mt-8 text-center">
                <a
                  href={galeriaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-[10px] border-2 border-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-navy"
                >
                  Zobacz całą galerię
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---- NAJNOWSZE AKTUALNOSCI ---- */}
      {pokazAktualnosci && newsy.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-center text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">
              {aktualnosciTytul}
            </h2>
            <div className="mx-auto mt-2 mb-8 h-1 w-14 rounded-full bg-brand-red" />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              {newsy.map((p: any, i: number) => (
                <Link
                  key={p.id}
                  href={`/posts/${p.slug}`}
                  className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200 transition hover:border-brand-red hover:shadow-sm ${
                    i >= 3 ? 'hidden md:flex' : ''
                  }`}
                >
                  <div className="aspect-[3/2] overflow-hidden bg-slate-100">
                    {p?.heroImage?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.heroImage.url}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-300">
                        brak zdjęcia
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    {p?.categories?.[0]?.title && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-brand-red">
                        {p.categories[0].title}
                      </span>
                    )}
                    <h3 className="line-clamp-3 text-sm font-bold leading-snug text-navy group-hover:text-brand-red">
                      {p.title}
                    </h3>
                    <p className="mt-auto pt-2 text-[11px] text-slate-400">{newsData(p.publishedAt)}</p>
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
          </div>
        </section>
      )}
    </main>
  )
}
