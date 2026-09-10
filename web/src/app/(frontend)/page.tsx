// STRONA GŁÓWNA — odwzorowanie ligazeglarska.pl: newsy (hero), Regaty jak na stadionie,
// Klubowi Mistrzowie Polski, Ostatnie regaty/Ranking, Czym jest liga, magazyn (YT), sponsorzy.
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import React from 'react'
import Wprowadzenie from '@/components/home/Wprowadzenie'
import MistrzowieKaruzela, { type Mistrz } from '@/components/home/MistrzowieKaruzela'
import WynikiHome from '@/components/home/WynikiHome'
import NewsletterSekcja from '@/components/home/NewsletterSekcja'
import Sponsorzy from '@/components/home/Sponsorzy'
import PasekRegat from '@/components/home/PasekRegat'
import { getLataWynikow, getWynikiPelne, getKluby, klubSlug } from '@/lib/liga'
import { getKlubMedia } from '@/lib/klubMedia'
import { getPlaylistVideos } from '@/lib/youtube'

export const dynamic = 'force-dynamic'

const U = 'https://ligazeglarska.pl/wp-content/uploads'
const YT_PLAYLIST = 'PLU9WwmeQjjruaBtobyLupCsmIvs4pJGjW'
const HERO_BG = `${U}/2026/05/1LR1_0059_szymon_sikora.jpg`
// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

const MISTRZOWIE_DATA = [
  { rok: 2015, klub: 'Yacht Club Sopot' },
  { rok: 2016, klub: 'AZS Politechnika Gdańska' },
  { rok: 2017, klub: 'Yacht Club Sopot' },
  { rok: 2018, klub: 'Olsztyński Klub Żeglarski' },
  { rok: 2019, klub: 'Giżycka Grupa Regatowa' },
  { rok: 2020, klub: 'YKP Gdynia' },
  { rok: 2021, klub: 'YKP Gdynia' },
  { rok: 2022, klub: 'Balex YKP Gdynia' },
  { rok: 2023, klub: 'Yacht Club Gdańsk' },
  { rok: 2024, klub: 'Yacht Club Sopot' },
  { rok: 2025, klub: 'Yacht Club Gdańsk' },
]

const GALERIA = [
  `${U}/2026/04/EXR3_0029_szymon_sikora_rek_.jpg`,
  `${U}/2025/11/YHR3__S_01310_Bartosz_Modelski-2.jpg`,
  `${U}/2026/04/MPKIMG_0241_Bartosz_Modelski.jpg`,
  `${U}/2025/11/YHR3__S_01920_Bartosz_Modelski.jpg`,
  `${U}/2026/04/EXR1_173_gwidon_libera-scaled.jpg`,
  `${U}/2025/10/PLZ_EXR4__K1A1029_Bartosz_Modelski-1.jpg`,
]

const JAK_SLEDZIC_KANALY = [
  { logo: `${U}/2025/03/2-1.png`, nazwa: 'Tracking SAP', opis: 'Pozycje jachtów, prędkość i wyniki na żywo.', url: 'https://www.sapsailing.com/' },
  { logo: `${U}/2025/03/1.png`, nazwa: 'Kanał na YouTube', opis: 'Konferencje, studia eksperckie i magazyny sportowe.', url: 'https://www.youtube.com/@kanalzeglarski' },
  { logo: `${U}/2025/05/Logo_TVP_Sport-1024x280.jpg`, nazwa: 'TVP Sport', opis: 'Magazyny podsumowujące po każdej rundzie regat.', url: 'https://sport.tvp.pl/86321430/polska-liga-zeglarska' },
  { logo: `${U}/2025/03/3-1.png`, nazwa: 'Facebook', opis: 'Transmisje live, relacje na bieżąco prosto z wody.', url: 'https://www.facebook.com/LigaZeglarska' },
  { logo: `${U}/2025/03/4.png`, nazwa: 'Instagram', opis: 'Wydarzenia z pierwszej ręki i krótkie podsumowania.', url: 'https://www.instagram.com/polskaligazeglarska/' },
  { logo: `${U}/2025/05/Projekt-bez-nazwy.jpg`, nazwa: 'WhatsApp', opis: 'Najważniejsze ogłoszenia w naszej społeczności.', url: 'https://chat.whatsapp.com/JQRZWPIGH7x7OAHW8QaKRH' },
]

const REGATY_INTRO = [
  'Od ponad 10 lat organizujemy regularne rozgrywki składające się z serii regat w Sopocie, Pucku, Gdyni i Szczecinie, w których kluby żeglarskie rywalizują o tytuł <strong>Klubowego Mistrza Polski</strong>, awans do wyższej ligi lub uniknięcie spadku.',
  'Zapewniamy <strong>jednakowe, nowoczesne jachty RS21</strong>, <strong>dynamiczne wyścigi</strong> rozgrywane w atrakcyjnym dla zawodników i widzów formacie, nowoczesne <strong>sędziowanie na światowym poziomie i medialność.</strong> W regatach Polskiej Ligi Żeglarskiej udział biorą <strong>najlepsi polscy żeglarze</strong>, przedstawiciele wielu pokoleń <strong>Mistrzów Polski, Europy i Świata, medaliści Olimpijscy</strong> oraz <strong>aktualni zawodnicy Kadry Narodowej, Kadry Juniorskiej</strong>, ale także początkujący i żeglarze amatorzy.',
  'Ponad <strong>500 zawodniczek i zawodników w 120 klubach</strong> ściga się w <strong>Ekstraklasie</strong> i <strong>1 Lidze</strong> (po 20 załóg), 6 amatorskich <strong>Ligach Regionalnych</strong> w całej Polsce dla rozpoczynających przygodę oraz w <strong>Lidze Młodzieżowej</strong> do 25. roku życia.',
]

const ZGLOSZENIA_LIGI = [
  {
    nazwa: 'Młodzieżowa Liga Żeglarska',
    logoUrl: `${U}/2025/10/Projekt-bez-nazwy-scaled-e1761668969140.png`,
    wiecejLink: '/mlodziezowa-liga-zeglarska',
    wyslijLink: 'mailto:info@ligazeglarska.pl',
    tloCiemne: true,
  },
  {
    nazwa: 'Trójmiejska Liga Żeglarska',
    logoUrl: `${U}/2025/11/TLZ_LOGO_PION_KOLOR-1.png`,
    wiecejLink: '/regionalne/trojmiejska-liga-zeglarska',
    wyslijLink: 'mailto:info@ligazeglarska.pl',
  },
  {
    nazwa: 'Wielkopolska Liga Żeglarska',
    logoUrl: `${U}/2025/11/WLZ_LOGO_PION_KOLOR.png`,
    wiecejLink: '/regionalne/wielkopolska-liga-zeglarska',
    wyslijLink: 'mailto:info@wielkopolskaligazeglarska.pl',
  },
  {
    nazwa: 'Centralna Liga Żeglarska',
    logoUrl: `${U}/2025/11/CLZ_LOGO_PION_KOLOR.png`,
    wiecejLink: '/regionalne/centralna-liga-zeglarska',
    wyslijLink: 'mailto:info@centralnaligazeglarska.pl',
  },
]

const O_NAS_LINKI = [
  { label: 'Historia', href: '/historia' },
  { label: 'Wartości', href: '/wartosci' },
  { label: 'Środowisko', href: '/srodowisko' },
  { label: 'Wspieramy', href: '/wspieramy' },
  { label: 'Zespół', href: '/plz-team' },
]

function newsData(d?: string | null): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).toUpperCase()
  } catch {
    return ''
  }
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const sg: any = await payload.findGlobal({ slug: 'strona-glowna' as any }).catch(() => null)
  const W = sg?.wprowadzenie || {}
  const SP = sg?.sponsorzy || {}
  const grupySponsorow: any[] = Array.isArray(SP.grupy) ? SP.grupy : []

  const newsRes = await payload
    .find({ collection: 'posts', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 5, depth: 1 })
    .catch(() => ({ docs: [] as any[] }))
  const news = (newsRes.docs as any[]) || []
  const glowny = news[0] || null
  const poboczne = news.slice(1, 5)

  const lata = await getLataWynikow()
  const rok = lata[0]
  const ligi = rok ? await getWynikiPelne(rok) : []

  const filmy = await getPlaylistVideos(YT_PLAYLIST, 4)
  const yt0 = filmy[0] || null

  const klubyLista = await getKluby().catch(() => [] as any[])
  const slugSet = new Set((klubyLista as any[]).map((k) => k.slug))
  const mistrzowie: Mistrz[] = MISTRZOWIE_DATA.map((m) => {
    const slug = klubSlug(m.klub)
    return {
      ...m,
      logo: getKlubMedia(m.klub)?.logo || null,
      href: slugSet.has(slug) ? `/kluby/${slug}` : null,
    }
  })

  // najbliższa (lub trwająca) regata z kalendarza do paska odliczania
  const dzis = new Date()
  dzis.setHours(0, 0, 0, 0)
  const kalRes = await payload
    .find({
      collection: 'kalendarz' as any,
      where: { or: [{ dataOd: { greater_than_equal: dzis.toISOString() } }, { dataDo: { greater_than_equal: dzis.toISOString() } }] },
      sort: 'dataOd',
      limit: 1,
      depth: 0,
    })
    .catch(() => ({ docs: [] as any[] }))
  const nastRegata: any = (kalRes.docs as any[])?.[0] || null

  return (
    <main className="bg-slate-50">
      {/* PASEK NAJBLIŻSZYCH REGAT (tylko strona główna) */}
      {nastRegata && (
        <PasekRegat
          dane={{
            nazwa: nastRegata.nazwa,
            miejsce: nastRegata.miejsce,
            poziom: nastRegata.poziom,
            dataOd: nastRegata.dataOd,
            dataDo: nastRegata.dataDo,
            link: nastRegata.link,
          }}
        />
      )}

      {/* HERO — NEWSY na tle zdjęcia */}
      <section className="relative bg-navy">
        <Img src={HERO_BG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-navy/20" />
        <div className="relative mx-auto max-w-[1440px] px-4 py-10 md:py-14">
          <div className="rounded-2xl bg-white p-5 shadow-2xl md:p-6">
            {glowny ? (
              <div className="grid items-stretch gap-5 lg:grid-cols-[1.5fr_1fr]">
                {/* DUŻY */}
                <Link href={`/posts/${glowny.slug}`} className="group relative block h-full min-h-[300px] overflow-hidden rounded-2xl border border-slate-200 md:min-h-[440px]">
                  {glowny?.heroImage?.url ? (
                    <Img src={glowny.heroImage.url} alt={glowny.title} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-slate-100" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                    {glowny?.categories?.[0]?.title && (
                      <span className="text-[11px] font-bold uppercase tracking-wide text-brand-red">{glowny.categories[0].title}</span>
                    )}
                    <h2 className="text-xl font-extrabold text-white group-hover:underline md:text-2xl">{glowny.title}</h2>
                    <p className="mt-1 text-xs font-semibold text-white/80">{newsData(glowny.publishedAt)}</p>
                  </div>
                </Link>
                {/* 4 MNIEJSZE */}
                <div className="flex h-full flex-col justify-between gap-3">
                  {poboczne.map((p) => (
                    <Link
                      key={p.id}
                      href={`/posts/${p.slug}`}
                      className="group flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-brand-red hover:shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        {p?.categories?.[0]?.title && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-brand-red">{p.categories[0].title}</span>
                        )}
                        <h3 className="line-clamp-3 text-sm font-bold leading-snug text-navy group-hover:text-brand-red">{p.title}</h3>
                        <p className="mt-1 text-[11px] text-slate-400">{newsData(p.publishedAt)}</p>
                      </div>
                      {p?.heroImage?.url && (
                        <Img src={p.heroImage.url} alt={p.title} className="h-20 w-28 shrink-0 rounded-lg object-cover" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-10 text-center text-slate-500">Brak newsów.</p>
            )}
            <div className="mt-5 text-center">
              <Link href="/newsy" className="inline-block rounded-[10px] border-2 border-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white">
                Zobacz wszystkie aktualności
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REGATY JAK NA STADIONIE */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-[1440px] px-4 py-10 md:py-14">
          <Wprowadzenie
            tytul={W.tytul || 'REGATY JAK NA STADIONIE'}
            akapity={(() => {
              const a = String(W.tekst || '').split(/\n\s*\n/).map((s: string) => s.trim()).filter(Boolean)
              return a.length ? a : REGATY_INTRO
            })()}
            jakSieScigamyHref="/jak-sie-scigamy"
            mediaHref="/media"
            poziomyObraz={W.poziomyObraz || '/poziomy-lig.png'}
            jakSledzicKanaly={JAK_SLEDZIC_KANALY}
            zgloszeniaIntro="Zobacz, w jakich ligach mamy wolne miejsca na kolejny sezon, dowiedz się więcej i wyślij zgłoszenie."
            zgloszeniaLigi={ZGLOSZENIA_LIGI}
          />
        </div>
      </section>

      {/* KLUBOWI MISTRZOWIE POLSKI */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 md:py-14">
          <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Klubowi Mistrzowie Polski</h2>
          <div className="mt-2 mb-8 h-1 w-14 rounded-full bg-brand-red" />
          <MistrzowieKaruzela items={mistrzowie} />
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSekcja bg={`${U}/2026/02/WhatsApp-Image-2026-02-10-at-15.46.31.jpeg`} />

      {/* OSTATNIE REGATY / RANKING */}
      {ligi.length > 0 && (
        <section className="bg-slate-50">
          <div className="mx-auto max-w-[1440px] px-4 py-10 md:py-14">
            <WynikiHome ligi={ligi as any} />
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {GALERIA.map((src, i) => (
                <div key={i} className="overflow-hidden rounded-lg">
                  <Img src={src} className="h-28 w-full object-cover transition hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CZYM JEST POLSKA LIGA ŻEGLARSKA */}
      <section id="o-nas" className="scroll-mt-24 bg-navy text-white" style={patternBg}>
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-10 md:py-14 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Czym jest Polska Liga Żeglarska?</h2>
            <div className="mt-2 mb-6 h-1 w-14 rounded-full bg-brand-red" />
            <div className="space-y-4 text-white/85">
              <p><strong>Polska Liga Żeglarska powstała w 2015 roku.</strong> Cykliczne regaty rozgrywane są na głównych poziomach — Ekstraklasa, 1 Liga, Ligi Regionalne. Organizujemy także Żeglarskie Mistrzostwa Polski Kobiet oraz Młodzieżową Ligę Żeglarską dla zawodniczek i zawodników do 25. roku życia.</p>
              <p>System Polskiej Ligi Żeglarskiej to <strong>ponad 120 klubów i 500 zawodników</strong>, co stawia ją na czele wszystkich 24 lig na świecie. Liga jest członkiem ISLA, organizacji nadzorującej Sailing Champions League. Partnerem Strategicznym jest Polski Związek Żeglarski.</p>
              <p>Nasza <strong>moc pochodzi z wiatru i wody</strong> — to nasze naturalne środowisko i źródło energii. Wierzymy w <strong>równość szans</strong>, wspieranie <strong>społeczności</strong> i aktywizację, a także w <strong>rozwój zgodny z naturą</strong>.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {O_NAS_LINKI.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full border-2 border-white/40 px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wide transition hover:bg-white hover:text-navy">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ZOBACZ NASZ MAGAZYN */}
      {yt0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-10 md:py-14">
            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Zobacz nasz magazyn</h2>
            <div className="mt-2 mb-8 h-1 w-14 rounded-full bg-brand-red" />
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm md:p-6">
              <div className="grid items-stretch gap-5 lg:grid-cols-[1.6fr_1fr] md:gap-6">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-md ring-1 ring-black/5">
                  <div className="relative aspect-video">
                    <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${yt0.id}`} title={yt0.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                  </div>
                </div>
                <div className="flex h-full flex-col gap-4">
                  {filmy.slice(1, 4).map((v) => (
                    <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="group flex flex-1 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-red/40 hover:shadow-md">
                      <div className="flex flex-1 items-center">
                        <p className="line-clamp-3 text-base font-bold leading-snug text-navy transition group-hover:text-brand-red md:text-lg">{v.title}</p>
                      </div>
                      <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-xl border border-slate-200 md:w-48">
                        <Img src={v.thumb} alt={v.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 pl-0.5 text-white shadow-lg transition group-hover:scale-110">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M8 5v14l11-7z" /></svg>
                          </span>
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <a href={`https://www.youtube.com/playlist?list=${YT_PLAYLIST}`} target="_blank" rel="noopener noreferrer" className="inline-block rounded-[10px] border-2 border-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white">
                Zobacz wszystkie odcinki
              </a>
            </div>
          </div>
        </section>
      )}

      {/* WSPÓŁPRACA */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-10 md:py-14 lg:grid-cols-[auto_1fr_auto] lg:gap-12">
          <div className="flex justify-center lg:justify-start">
            <Img src={`${U}/2024/02/PLZ-Business-200x300.png`} alt="Polska Liga Żeglarska Business" className="h-32 w-auto object-contain md:h-40" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Współpraca</h2>
            <div className="mt-2 mb-6 h-1 w-14 rounded-full bg-brand-red" />
            <div className="space-y-4 text-white/85">
              <p>
                <strong>Autorski koncept regat w formie Żeglarstwa Stadionowego</strong> to doskonałe narzędzie promocyjne
                łączące w sobie elementy prestiżowego sportu, networkingu i mediów.
              </p>
              <p>
                Forma i proces realizacji są zgodne ze światowymi trendami w sporcie żeglarskim. Łączymy{' '}
                <strong>profesjonalną organizację, media, widowiskowość</strong> oraz <strong>dopasowane świadczenia</strong>{' '}
                dla sponsorów, partnerów i uczestników. Nasze projekty w polskim żeglarstwie oferują{' '}
                <strong>nowy wymiar rywalizacji</strong> żeglarskiej, <strong>prestiżu i jakości</strong> regat, dzięki
                ciągłemu rozwojowi, stale rosnącemu zainteresowaniu i wysokim standardom sportowym.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:w-56 lg:pt-2">
            {[
              { label: 'Oferta', href: 'https://ligazeglarska.pl/oferta/' },
              { label: 'Media', href: '/media' },
              { label: 'Sprzęt', href: 'https://ligazeglarska.pl/#' },
              { label: 'Bezpieczeństwo', href: 'https://ligazeglarska.pl/safety/' },
            ].map((b) => (
              <a
                key={b.label}
                href={b.href}
                className="whitespace-nowrap rounded-full border border-white/40 bg-transparent px-6 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-navy md:text-sm"
              >
                {b.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORZY */}
      <Sponsorzy grupy={grupySponsorow} tytul={SP.tytul || 'Sponsorzy'} />
    </main>
  )
}
