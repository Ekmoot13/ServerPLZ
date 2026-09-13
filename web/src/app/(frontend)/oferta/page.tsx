// Oferta / Współpraca — treść przeniesiona z ligazeglarska.pl/oferta.
// Linki wewnętrzne prowadzą do naszych podstron (Wartości, Kontakt),
// prezentacja i raporty mediowe zostają na zasobach ligazeglarska.pl.
import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Oferta — Polska Liga Żeglarska' }

const U = 'https://ligazeglarska.pl/wp-content/uploads'
const HERO = `${U}/2025/11/EXR3_0021_szymon_sikora_rek_.jpg`
const PREZENTACJA = `${U}/2026/03/Czym-jest-Polska-Liga-Zeglarska-PLZ2026.pdf`
const RAPORTY =
  'https://1drv.ms/f/c/66b2b0f68e9f706a/Eh1jJ6-Ni2REuZcY_YBXyAsB6lYVecZbnAtsU7kSlsmnPw?e=owW8yE'
const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

type Blok = {
  kat: string
  tyt: string
  txt: string
  link?: { tekst: string; href: string; zewn: boolean }
}

const BLOKI: Blok[] = [
  {
    kat: 'Idea',
    tyt: 'Żeglarstwo jako narzędzie promocji',
    txt: 'Autorski koncept żeglarstwa stadionowego to doskonałe narzędzie promocyjne, łączące elementy prestiżowego sportu, networkingu i mediów, pozwalające na realizację różnorodnych celów.',
  },
  {
    kat: 'Żeglarstwo stadionowe',
    tyt: 'Format, w którym liczy się każda sekunda',
    txt: 'Nasz dynamiczny i przystępny format regat składa się z serii krótkich, pełnych pojedynków wyścigów, w których nie ma miejsca na najmniejszy błąd. W połączeniu z nowoczesnym przekazem medialnym jesteśmy atrakcyjni dla kibiców i mediów.',
  },
  {
    kat: 'Widowisko',
    tyt: 'Regaty na wyciągnięcie ręki',
    txt: 'Regaty odbywają się na widowiskowych akwenach i w atrakcyjnych lokalizacjach, takich jak molo w Sopocie czy marina w Gdyni, co gwarantuje wysoką frekwencję i emocje dla kibiców.',
  },
  {
    kat: 'Medialność',
    tyt: 'Media są fundamentem naszych projektów',
    txt: 'Prowadzimy intensywne działania z mediami ogólnopolskimi oraz na własnych kanałach w social media. Regularnie pokazują nas TVP Sport, WP Sportowe Fakty, Przegląd Sportowy Onet czy Sport.pl.',
    link: { tekst: 'Pobierz nasze raporty mediowe', href: RAPORTY, zewn: true },
  },
  {
    kat: 'Innowacje',
    tyt: 'Technologia na wodzie i w transmisji',
    txt: 'Jachty są wyposażone w tracking GPS na żywo, a system SAP Sailing pokazuje przebieg wyścigów i wyniki w czasie rzeczywistym. Liga jako pierwsza w Polsce używa elektrycznych, zdalnie sterowanych boi utrzymujących pozycję dzięki GPS. Zawodnicy udzielają wywiadów, a wyścigi są transmitowane na żywo w telewizji i internecie.',
  },
  {
    kat: 'Wartości',
    tyt: 'Moc z wiatru i wody',
    txt: 'To nasze naturalne środowisko i źródło energii do realizacji pasji oraz działania. Wierzymy w równość szans, wspieranie społeczności i aktywizację, a także w rozwój zgodny z naturą.',
    link: { tekst: 'Dowiedz się, co nas napędza', href: '/wartosci', zewn: false },
  },
]

export default function OfertaPage() {
  return (
    <main className="bg-slate-50">
      {/* HERO ze zdjęciem z regat */}
      <section className="relative bg-navy text-white">
        <Img src={HERO} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" style={patternBg} />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center md:py-24">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-sky-500">Oferta</p>
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Współpraca</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <p className="mt-6 text-white/85 md:text-lg">
            Żeglarstwo stadionowe łączy prestiżowy sport, networking i media — i daje markom
            przestrzeń do realizacji bardzo różnych celów.
          </p>
        </div>
      </section>

      {/* BLOKI OFERTY */}
      <section className="mx-auto max-w-[1200px] px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {BLOKI.map((b) => (
            <div
              key={b.kat}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:p-7"
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-500">{b.kat}</p>
              <h2 className="mt-2 text-xl font-extrabold leading-snug text-navy">{b.tyt}</h2>
              <div className="mt-3 h-1 w-12 rounded-full bg-navy/10" />
              <p className="mt-4 flex-1 text-slate-600">{b.txt}</p>
              {b.link &&
                (b.link.zewn ? (
                  <a
                    href={b.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block text-sm font-bold uppercase tracking-wide text-sky-500 hover:underline"
                  >
                    {b.link.tekst} →
                  </a>
                ) : (
                  <Link
                    href={b.link.href}
                    className="mt-5 inline-block text-sm font-bold uppercase tracking-wide text-sky-500 hover:underline"
                  >
                    {b.link.tekst} →
                  </Link>
                ))}
            </div>
          ))}
        </div>
      </section>

      {/* DOŁĄCZ DO NAS */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <h2 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Dołącz do nas!</h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand-red" />
          <p className="mx-auto mt-6 max-w-2xl text-white/85 md:text-lg">
            Zapraszamy do kontaktu i rozmów o możliwościach współpracy.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={PREZENTACJA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-[10px] bg-sky-500 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-sky-600"
            >
              Pobierz prezentację
            </a>
            <Link
              href="/kontakt"
              className="inline-block rounded-[10px] border-2 border-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-navy"
            >
              Napisz do nas
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
