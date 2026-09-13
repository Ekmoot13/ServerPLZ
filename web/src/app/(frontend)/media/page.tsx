import React from 'react'
import { getLatestYouTube } from '@/lib/youtube'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Media — Polska Liga Żeglarska' }

const U = 'https://ligazeglarska.pl/wp-content/uploads'
const YT_CHANNEL = 'UC-iLVLnRVlBDvn-NMc-HjTA' // Polska Liga Żeglarska (magazyn)
const RAPORTY = 'https://1drv.ms/f/c/66b2b0f68e9f706a/Eh1jJ6-Ni2REuZcY_YBXyAsB6lYVecZbnAtsU7kSlsmnPw'

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

type Logo = { url: string; link: string; alt: string }

// Zdjęcia produkcyjne w hero (4 w rzędzie)
const HERO_FOTO = [
  `${U}/2025/11/YHR1__S_07859_Bartosz_Modelski.jpg`,
  `${U}/2025/11/1L3R_IMG_5546_Bartosz_Modelski.jpg`,
  `${U}/2025/11/1L3R_IMG_5613_Bartosz_Modelski.jpg`,
  `${U}/2025/11/MPKIMG_0580_Bartosz_Modelski.jpg`,
]

// Układ jak w oryginale: każda kategoria = rzędy logotypów.
const TELEWIZJA: Logo[][] = [
  [
    { url: `${U}/2024/04/Logo_TVP_Sport-300x82.jpg`, link: 'https://sport.tvp.pl/86321430/polska-liga-zeglarska', alt: 'TVP Sport' },
    { url: `${U}/2025/11/Telewizja_Polska_-_TVP3_logo_2016.svg-300x113.png`, link: 'https://regiony.tvp.pl/', alt: 'TVP3' },
  ],
  [
    { url: `${U}/2025/11/Telewizja_Polska_-_TVP2_logo_2003.svg-300x113.png`, link: 'https://tvp2.tvp.pl/', alt: 'TVP2' },
    { url: `${U}/2024/04/Sportklub_logo-300x55.png`, link: 'https://sportowefakty.wp.pl/sportklub', alt: 'Sportklub' },
    { url: `${U}/2025/11/canalsport-300x134.png`, link: 'https://www.canalplus.com/pl/canalplussport/', alt: 'Canal+ Sport' },
    { url: `${U}/2025/11/Tvn24_Logo.svg`, link: 'https://tvn24.pl/', alt: 'TVN24' },
  ],
]

const PRASA: Logo[][] = [
  [
    { url: `${U}/2024/04/OnetPrzeglad_logo_CMYK-1-2-1.pdf-300x138.png`, link: 'https://przegladsportowy.onet.pl/polska-liga-zeglarska', alt: 'Onet Przegląd Sportowy' },
    { url: `${U}/2024/04/Logo_TVP_Sport-300x82.jpg`, link: 'https://sport.tvp.pl/86321430/polska-liga-zeglarska', alt: 'TVP Sport' },
    { url: `${U}/2025/11/wp_sport-300x87.png`, link: 'https://sportowefakty.wp.pl/zeglarstwo', alt: 'WP SportoweFakty' },
  ],
  [
    { url: `${U}/2025/11/sport_pl-300x114.png`, link: 'https://www.sport.pl/inne/0,128966.html', alt: 'Sport.pl' },
    { url: `${U}/2025/11/Eurosport-Logo-300x169.png`, link: 'https://eurosport.tvn24.pl/zeglarstwo', alt: 'Eurosport' },
    { url: `${U}/2025/11/RMF24-1-300x80.png`, link: 'https://www.rmf24.pl/', alt: 'RMF24' },
  ],
  [
    { url: `${U}/2025/11/xyz-300x69.png`, link: 'https://xyz.pl/', alt: 'XYZ' },
    { url: `${U}/2025/11/Forbes_logo.svg-300x81.png`, link: 'https://www.forbes.pl/', alt: 'Forbes' },
    { url: `${U}/2026/06/2024_new_msn_logo.svg-300x118.png`, link: 'https://www.msn.com/pl-pl', alt: 'MSN' },
  ],
  [
    { url: `${U}/2025/11/prestiz_trojmiejski-300x93.png`, link: 'https://prestiztrojmiasto.pl/', alt: 'Prestiż Trójmiejski' },
    { url: `${U}/2025/11/prestiz_szczecinski-300x141.png`, link: 'https://prestizszczecin.pl/', alt: 'Prestiż Szczeciński' },
    { url: `${U}/2026/06/d233ede97739d84e7579bf4edca37a22-e1781699332814-300x135.jpg`, link: 'https://noizz.pl/', alt: 'Noizz' },
  ],
  [
    { url: `${U}/2024/04/MORZE-logo-300x150.jpg`, link: 'http://MORZE.ORG', alt: 'MORZE' },
    { url: `${U}/2026/06/ZP-logo11-300x47.png`, link: 'https://www.zawszepomorze.pl/', alt: 'Zawsze Pomorze' },
    { url: `${U}/2025/11/firmy__dziennikbaltycki-300x158.png`, link: 'https://dziennikbaltycki.pl/', alt: 'Dziennik Bałtycki' },
    { url: `${U}/2025/11/Trojmiasto-PL-300x123.jpg`, link: 'https://www.trojmiasto.pl/sport/', alt: 'Trójmiasto.pl' },
  ],
]

const RADIO: Logo[][] = [
  [
    { url: `${U}/2025/11/RMF_FM_2010_Alt.webp`, link: 'https://www.rmf24.pl/', alt: 'RMF FM' },
    { url: `${U}/2026/06/RMF_Maxxx_logo-300x62.png`, link: 'https://www.rmfmaxxx.pl/', alt: 'RMF Maxxx' },
    { url: `${U}/2025/11/pr24-logo-768x362.jpg`, link: 'https://polskieradio24.pl/', alt: 'Polskie Radio 24' },
    { url: `${U}/2026/06/300-1.png`, link: 'https://radioszczecin.pl/', alt: 'Radio Szczecin' },
    { url: `${U}/2026/06/radio-gdansk-logo-768x467.png`, link: 'https://radiogdansk.pl/', alt: 'Radio Gdańsk' },
  ],
]

function Kategoria({ tytul, rzedy }: { tytul: string; rzedy: Logo[][] }) {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy">{tytul}</h2>
      <div className="mt-2 mb-8 h-1 w-14 rounded-full bg-brand-red" />
      <div className="mx-auto max-w-4xl space-y-10">
        {rzedy.map((rzad, i) => (
          <div key={i} className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16">
            {rzad.map((lo, k) => (
              <a
                key={k}
                href={lo.link}
                target="_blank"
                rel="noopener noreferrer"
                title={lo.alt}
                className="flex items-center justify-center transition hover:opacity-70"
              >
                <Img src={lo.url} alt={lo.alt} className="max-h-12 w-auto object-contain" />
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function MediaPage() {
  const filmy = await getLatestYouTube(YT_CHANNEL, 5)
  const glowny = filmy[0] || null
  const pozostale = filmy.slice(1, 5)

  const patternBg: React.CSSProperties = {
    backgroundImage: 'url(/pkr-pattern-soft.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
  }

  return (
    <main className="bg-navy text-white" style={patternBg}>
      {/* HERO */}
      <section className="mx-auto max-w-[1440px] px-4 pt-14 pb-12 md:pt-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Media</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
        </div>
        <div className="mx-auto mt-10 max-w-5xl space-y-4 text-center text-white/85">
          <p>
            <strong>Media to fundament naszej działalności.</strong> Prowadzimy intensywne działania z mediami
            ogólnopolskimi oraz na własnych kanałach social media. Jesteśmy obecni w każdym medium żeglarskim w Polsce —
            stale współpracujemy z redakcjami sportowymi czołowych portali, telewizji i radiostacji ogólnopolskich. W 2025
            roku osiągnęliśmy <strong>7,5 mln zł wartości reklamowej AVE</strong> i <strong>ponad 4000 publikacji</strong>.
          </p>
          <p>
            Samodzielnie produkujemy <strong>transmisje na żywo</strong>, <strong>konferencje prasowe</strong>,{' '}
            <strong>studia eksperckie</strong> i materiały wideo, wykorzystując <strong>drony</strong>, kamery{' '}
            <strong>onboard</strong>, kamery na wodzie i brzegu oraz system śledzenia <strong>SAP GPS</strong>. Mamy własny
            zespół produkcyjny foto, wideo i prasowy.
          </p>
        </div>
        <div className="mt-8 text-center">
          <a
            href={RAPORTY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-[10px] border-2 border-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-navy"
          >
            Pobierz nasze raporty mediowe
          </a>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {HERO_FOTO.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-white/20">
              <Img src={src} className="h-40 w-full object-cover md:h-48" />
            </div>
          ))}
        </div>
      </section>

      {/* TELEWIZJA / PRASA / RADIO — na białym */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-12">
          <Kategoria tytul="Telewizja" rzedy={TELEWIZJA} />
          <Kategoria tytul="Prasa" rzedy={PRASA} />
          <Kategoria tytul="Radio" rzedy={RADIO} />
        </div>
      </section>

      {/* ZOBACZ NASZ MAGAZYN W TVP SPORT — najnowsze odcinki z YouTube */}
      <section className="mx-auto max-w-[1440px] px-4 py-14">
        <h2 className="text-2xl font-extrabold uppercase tracking-wide text-white md:text-3xl">
          Zobacz nasz magazyn w TVP Sport
        </h2>
        <div className="mt-2 mb-8 h-1 w-14 rounded-full bg-brand-red" />

        {glowny ? (
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.6fr_1fr]">
            {/* Główny film */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-black shadow-xl">
              <div className="relative aspect-video">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${glowny.id}`}
                  title={glowny.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white">{glowny.title}</h3>
              </div>
            </div>

            {/* Lista pozostałych */}
            <div className="flex h-full flex-col justify-between gap-3">
              {pozostale.map((v) => (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-1 gap-3 overflow-hidden rounded-xl border border-white/15 bg-white/5 transition hover:bg-white/10"
                >
                  <div className="relative w-40 shrink-0 self-stretch">
                    <Img src={v.thumb} alt={v.title} className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs text-white">▶</span>
                    </span>
                  </div>
                  <div className="flex flex-1 items-center py-2 pr-3">
                    <p className="line-clamp-3 text-sm font-medium text-white/90 group-hover:text-white">{v.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-white/70">Nie udało się pobrać odcinków. Zajrzyj na nasz kanał YouTube.</p>
        )}

        <div className="mt-8 text-center">
          <a
            href={`https://www.youtube.com/channel/${YT_CHANNEL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-[10px] border-2 border-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-navy"
          >
            Zobacz wszystkie odcinki
          </a>
        </div>
      </section>
    </main>
  )
}
