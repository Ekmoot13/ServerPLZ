import React from 'react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Jak się ścigamy? — Polska Liga Żeglarska' }

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

const GALERIA = [
  `${U}/2025/06/MPKIMG_1317_Bartosz_Modelski.jpg`,
  `${U}/2025/05/1LR1_0000_0088_day_2_POZIOM_-1.jpg`,
  `${U}/2025/05/EXR1_276_gwidon_libera-scaled.jpg`,
  `${U}/2025/05/EXR1_256_gwidon_libera-scaled.jpg`,
]

function Naglowek({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">{children}</h2>
      <div className="mt-3 h-1 w-16 rounded-full bg-brand-red" />
    </div>
  )
}

export default function JakSieScigamyPage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-[1440px] px-4 py-16 text-center md:py-20">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Jak się ścigamy?</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <p className="mx-auto mt-6 max-w-3xl text-white/85 md:text-lg">
            Poznaj zasady żeglarstwa stadionowego — krótkie, dynamiczne wyścigi na identycznych jachtach, rozgrywane tuż
            przy brzegu, na oczach kibiców.
          </p>
        </div>
      </section>

      {/* JAK WYGLĄDAJĄ REGATY */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1100px] px-4 py-14">
          <Naglowek>Jak wyglądają regaty?</Naglowek>
          <div className="space-y-4 text-slate-700 md:text-lg">
            <p>
              Od sezonu 2026 zapewniamy <strong>10 identycznych łódek klasy RS21</strong>, na których w jednej lidze
              podczas regat żeglarskich rywalizuje 20 załóg. Załogi rotują się między jachtami co wyścig, co zapewnia
              równość szans. Na każdym poziomie Ligi odbywają się 4 rundy, czyli weekendowe regaty.
            </p>
            <p>
              Ścigamy się w najpiękniejszych polskich lokalizacjach — w Sopocie, Gdyni, Pucku i Szczecinie. Podczas jednej
              imprezy regatowej odbywa się do 30 wyścigów, trwających ok. 10 minut, które można obserwować z brzegu.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {GALERIA.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-slate-200">
                <Img src={src} className="h-32 w-full object-cover md:h-40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JAK WYGLĄDAJĄ WYŚCIGI */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-[1100px] px-4 py-14">
          <Naglowek>Jak wyglądają wyścigi?</Naglowek>
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div className="space-y-5 text-slate-700">
              <div>
                <h3 className="font-bold text-navy">Start wyścigu</h3>
                <p className="mt-1">
                  10 jachtów startuje z linii wyznaczonej przez boję i statek komisji po upływie 3-minutowej procedury
                  startowej.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-navy">Trasa wyścigu</h3>
                <p className="mt-1">
                  Załogi płyną pod wiatr, do górnych znaków w formie bramki, wpływając od środka i wypływając na zewnątrz,
                  a następnie kierują się do dolnej bramki, którą także muszą opłynąć od środka na zewnątrz.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-navy">Format wyścigu</h3>
                <p className="mt-1">Wyścig składa się z dwóch okrążeń trasy. Długość wyścigu to ok. 10 minut.</p>
              </div>
              <div>
                <h3 className="font-bold text-navy">Zakończenie wyścigu</h3>
                <p className="mt-1">Po 2 okrążeniach jachty przekraczają linię mety przy statku komisji.</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <Img src={`${U}/2026/04/PLZ2026-strona-dodatkowe.jpg`} className="w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* JAK SIĘ ŚCIGAMY */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1100px] px-4 py-14">
          <Naglowek>Jak się ścigamy?</Naglowek>
          <div className="space-y-4 text-slate-700 md:text-lg">
            <p>
              Podczas każdego weekendu ligowego w jednych regatach żeglarskich rozgrywanych jest{' '}
              <strong>aż 30 krótkich i dynamicznych wyścigów</strong>, trwających zaledwie <strong>10–12 minut</strong>.
              Dzięki obecności <strong>trzech arbitrów na wodzie</strong> wszystkie sporne sytuacje rozstrzygane są
              natychmiast — bez protestów na brzegu i zbędnych przerw w rywalizacji.
            </p>
            <p>
              Trasa ustawiana jest możliwie blisko brzegu, by kibice mogli śledzić zmagania z lądu, a załogi mogły szybko
              wymieniać się na jachtach. Wszyscy ścigają się na jednakowych jednostkach klasy <strong>RS21</strong>, które
              dostarcza organizator. Jachty mają identyczne ustawienia i żagle, a załogi rotują między nimi po niemal
              każdym wyścigu, co całkowicie wyrównuje szanse.
            </p>
            <p>
              Na starcie ligowych regat żeglarskich spotykają się <strong>różne pokolenia żeglarzy</strong> — od juniorów
              po doświadczonych zawodników. Wśród uczestników są członkowie <strong>Kadr Narodowych</strong>,{' '}
              <strong>Mistrzowie Polski, Europy i Świata</strong>, ale też ambitni amatorzy, którzy dopiero odkrywają
              emocje rywalizacji. Liga tworzy wyjątkowe środowisko, w którym każdy może stanąć na jednej linii startu z
              najlepszymi i poczuć prawdziwego ducha sportowego żeglarstwa.
            </p>
          </div>
        </div>
      </section>

      {/* NA JAKICH JACHTACH */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-[1100px] px-4 py-14">
          <Naglowek>Na jakich jachtach się ścigamy?</Naglowek>
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4 text-slate-700">
              <p>
                Pływamy na szybkich i zwrotnych jachtach klasy <strong>RS21</strong>. Jacht RS21 o długości 6,5 metra i
                wadze zaledwie 650 kg posiada lekki węglowy maszt, genaker i bom oraz trzy żagle: fok, grot i genaker.
              </p>
              <ul className="space-y-2">
                {[
                  ['Sternik', 'odpowiada za sterowanie jachtem'],
                  ['Trymer grota', 'obsługuje główny żagiel'],
                  ['Trymer żagli przednich', 'odpowiedzialny za fok i genaker'],
                  ['Dziobowy', 'manewruje żaglami i sprzętem na dziobie'],
                ].map(([rola, opis]) => (
                  <li key={rola} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-red" />
                    <span>
                      <strong className="text-navy">{rola}</strong> — {opis}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <Img src={`${U}/2025/06/Scianka-explainer-PLZ-2-scaled.jpg`} className="w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
