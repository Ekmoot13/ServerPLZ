import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Wspieramy — Polska Liga Żeglarska' }

const L = 'https://ligazeglarska.pl/wp-content/uploads'
const IMG = {
  kobiety: `${L}/2025/11/MPKR1__S_00474_Bartosz_Modelski-1-1024x683.jpg`,
  mlodzi: `${L}/2025/11/PLZ_EXR4__S_03921_Bartosz_Modelski-1-1024x683.jpg`,
  wosp: `${L}/2025/11/WOSP-1024x683.jpg`,
  libera: `${L}/2025/11/Libera-1024x694.jpg`,
  ewa: `${L}/2026/01/2-4-1024x683.jpg`,
  dominik: `${L}/2026/01/1-5-1024x683.jpg`,
}

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

type Tone = 'navy' | 'white'
type BlokProps = {
  tytul: string
  podtytul?: string
  akapity: string[]
  osiagniecia?: string[]
  przycisk?: { label: string; href: string; external?: boolean }
  obraz: string
  tone: Tone
}

function Blok({ tytul, podtytul, akapity, osiagniecia, przycisk, obraz, tone }: BlokProps) {
  const light = tone === 'navy'
  const btn = light
    ? 'border-white text-white hover:bg-white hover:text-navy'
    : 'border-navy text-navy hover:bg-navy hover:text-white'
  return (
    <section className={tone === 'white' ? 'bg-white' : ''}>
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <h2 className={`text-3xl font-extrabold uppercase tracking-wide md:text-4xl ${light ? 'text-white' : 'text-navy'}`}>
            {tytul}
          </h2>
          <div className="mt-3 h-1 w-16 rounded-full bg-brand-red" />
          {podtytul && <p className="mt-3 text-sm font-bold uppercase tracking-wide text-brand-red">{podtytul}</p>}
          <div className={`mt-5 space-y-4 ${light ? 'text-white/85' : 'text-slate-700'}`}>
            {akapity.map((a, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: a }} />
            ))}
          </div>
          {osiagniecia && (
            <ul className={`mt-4 list-disc space-y-1.5 pl-5 text-sm ${light ? 'text-white/90' : 'text-slate-700'}`}>
              {osiagniecia.map((o, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: o }} />
              ))}
            </ul>
          )}
          {przycisk &&
            (przycisk.external ? (
              <a
                href={przycisk.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 inline-block rounded-[10px] border-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition ${btn}`}
              >
                {przycisk.label}
              </a>
            ) : (
              <Link
                href={przycisk.href}
                className={`mt-6 inline-block rounded-[10px] border-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition ${btn}`}
              >
                {przycisk.label}
              </Link>
            ))}
        </div>
        <div className={`overflow-hidden rounded-2xl border shadow-xl ${light ? 'border-white/25' : 'border-navy/15'}`}>
          <Img src={obraz} className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  )
}

export default function WspieramyPage() {
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
      <section className="mx-auto max-w-[1440px] px-4 pt-14 pb-4 text-center md:pt-16">
        <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Wspieramy</h1>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
      </section>

      <Blok
        tone="navy"
        tytul="Żeglarstwo kobiet"
        podtytul="Wyrównujemy szanse"
        obraz={IMG.kobiety}
        przycisk={{ label: 'Odwiedź ladiesailing.pl', href: 'https://ladiesailing.pl/', external: true }}
        akapity={[
          'We wszystkich regatach Polskiej Ligi Żeglarskiej mogą brać udział kobiety i rywalizować na równym poziomie z mężczyznami — <strong>aż 7 razy w sezonie 2025 na podium regat Ligi stawały sterniczki</strong>.',
          'Od 2022 roku organizujemy <strong>Żeglarskie Mistrzostwa Polski Kobiet</strong>, czyli unikalne na skalę kraju regaty, w których biorą udział wyłącznie żeglarki. Regaty odbywają się przy sopockim Molo i łączą w jednym wydarzeniu sport, styl życia i siłę kobiet.',
          'W Mistrzostwach Polski Kobiet wzięło udział aż <strong>7 olimpijek</strong>, w tym Agata Barwińska, Agnieszka Skrzypulec-Szota czy Aleksandra Melzacka. Ścigają się tu medalistki olimpijskie, mistrzynie świata i Europy, członkinie Kadry Narodowej, ale także <strong>żeglarki amatorki i początkujące zawodniczki</strong>.',
        ]}
      />

      <Blok
        tone="white"
        tytul="Młodzi zawodnicy"
        podtytul="Rozwijamy społeczność i aktywizujemy"
        obraz={IMG.mlodzi}
        przycisk={{ label: 'Liga Młodzieżowa', href: '/mlodziezowa-liga-zeglarska' }}
        akapity={[
          'Regaty Polskiej Ligi Żeglarskiej są dostępne dla zawodników w każdym wieku i na różnych etapach kariery. Najstarszy sternik finału Ekstraklasy 2025 miał 53 lata, a najmłodszy zawodnik zaledwie 16 lat.',
          'Od 2025 roku zawodnicy do 25. roku życia rywalizują w <strong>Młodzieżowej Polskiej Lidze Żeglarskiej</strong> — na nowoczesnych jachtach zapewnionych przez organizatora, z oprawą medialną i promocją zawodników, pomagając im w rozwoju kariery.',
          'Liga Młodzieżowa to także wyciągnięta dłoń do zawodniczek i zawodników, którzy zakończyli ścieżkę olimpijską — mogą tu kontynuować karierę, a na najlepszych czeka <strong>awans do Młodzieżowej Żeglarskiej Ligi Mistrzów</strong>.',
        ]}
      />

      <Blok
        tone="navy"
        tytul="Wielka Orkiestra Świątecznej Pomocy"
        obraz={IMG.wosp}
        przycisk={{
          label: 'Zobacz nasze aukcje',
          href: 'https://allegro.pl/oferta/trening-na-regatowym-jachcie-rs21-z-medalistami-mistrzostw-swiata-i-europy-18237059313',
          external: true,
        }}
        akapity={[
          'Polska Liga Żeglarska <strong>od lat aktywnie wspiera Wielką Orkiestrę Świątecznej Pomocy</strong>, budując most między żeglarstwem a działalnością charytatywną. Włączamy w te działania nie tylko zawodników i kluby, lecz całe środowisko żeglarskie oraz sympatyków sportu.',
          'Co roku organizujemy specjalne aukcje, dzięki którym można wylicytować udział w naszych regatach i przeżyć niepowtarzalną, żeglarską przygodę u boku najlepszych — jednocześnie wspierając zbiórkę WOŚP.',
          'Podkreślamy, że sport to nie tylko emocje i zdrowa konkurencja, ale również <strong>odpowiedzialność i gotowość do niesienia pomocy</strong> — solidarność, zaangażowanie i troska o innych.',
        ]}
      />

      <Blok
        tone="white"
        tytul="Nie chcemy zapomnieć"
        obraz={IMG.libera}
        akapity={[
          'Setki tysięcy zdjęć i terabajty filmów to efekt pracy „Liberów” — Gwidona i Kacpra, ojca i syna, którzy od lat dokumentują regaty Polskiej Ligi Żeglarskiej. To oni zatrzymują emocje, budują wspomnienia i pozwalają nam wracać do najpiękniejszych momentów żeglarskich zmagań.',
          'Dziś rodzina Liberów mierzy się z trudną sytuacją zdrowotną. Jako środowisko żeglarskie chcemy im pomóc i odwdzięczyć się za lata pracy dla Ligi.',
        ]}
      />

      {/* NASI AMBASADORZY */}
      <section className="mx-auto max-w-[1440px] px-4 pt-14 pb-2 text-center">
        <h2 className="text-3xl font-extrabold uppercase tracking-wide text-white md:text-4xl">Nasi Ambasadorzy</h2>
        <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-brand-red" />
      </section>

      <Blok
        tone="navy"
        tytul="Ewa Lewandowska"
        podtytul="Klasa olimpijska 49erFX"
        obraz={IMG.ewa}
        przycisk={{ label: 'Śledź regaty Ewy', href: '/regatowastrefakibica' }}
        akapity={[
          'Ewa Lewandowska to jedna z <strong>czołowych żeglarek regatowych swojego pokolenia</strong>. Dzięki wyjątkowej dyscyplinie potrafi <strong>łączyć żeglowanie na światowym poziomie ze studiami stomatologicznymi</strong>. Ambicja, konsekwencja i czysta radość z żeglowania sprawiają, że Ewa jest naturalną <strong>Ambasadorką Młodzieżowej Polskiej Ligi Żeglarskiej</strong>.',
          'Wymagające studia i kampanię olimpijską w klasie 49erFX, którą prowadzi w załodze z Anią Zwarą, łączy z regularnymi startami w Polskiej Lidze Żeglarskiej. W 2024 roku zdobyła <strong>brązowy medal w inauguracyjnej rundzie Ekstraklasy</strong> jako sterniczka Yacht Club Gdańsk, a w sezonie 2026 poprowadzi własną załogę w Młodzieżowej Polskiej Lidze Żeglarskiej.',
        ]}
        osiagniecia={[
          '<strong>NAJLEPSZA MŁODZIEŻOWA ŻEGLARKA ŚWIATA</strong> 2024',
          '<strong>WICEMISTRZYNI EUROPY JUNIORÓW 49ERFX</strong> 2025',
          '<strong>2× MISTRZYNI ŚWIATA JUNIORÓW WORLD SAILING</strong> 2023 i 2024',
          '<strong>MISTRZYNI EUROPY 29ER</strong> 2024',
        ]}
      />

      <Blok
        tone="white"
        tytul="Dominik Buksak"
        podtytul="Klasa olimpijska 49er"
        obraz={IMG.dominik}
        przycisk={{ label: 'Śledź regaty Dominika', href: '/regatowastrefakibica' }}
        akapity={[
          'Dominik Buksak — wychowany na wodzie, żegluje od siódmego roku życia i od zawsze <strong>łączy pasję z bezkompromisową ambicją</strong> sportową. W klasie 49er wspiął się na światowy poziom, spełniając marzenie o starcie w igrzyskach olimpijskich. Podczas <strong>IO Paryż 2024 zajął 5. miejsce — najlepsze w historii polskich startów</strong> w tej klasie.',
          'Jako Ambasador Polskiej Ligi Żeglarskiej wnosi doświadczenie najwyższej próby i inspiruje kolejne pokolenia żeglarzy, <strong>startując równolegle w olimpijskiej kampanii na 49erze</strong> i w rozgrywkach ligowej Ekstraklasy z Yacht Clubem Gdańsk.',
        ]}
        osiagniecia={[
          '<strong>ZWYCIĘZCA EKSTRAKLASY — KLUBOWY MISTRZ POLSKI</strong> 2025',
          '<strong>MISTRZOSTWO POLSKI 49er — ŁĄCZNIE 5 RAZY,</strong> 2019-2022 i 2025',
          '<strong>5. MIEJSCE IGRZYSKA OLIMPIJSKIE PARYŻ</strong> 2024',
          '<strong>2× WICEMISTRZOSTWO EUROPY 49er</strong> 2018 i 2023',
        ]}
      />
    </main>
  )
}
