// Sprzęt — treść przeniesiona z ligazeglarska.pl/sprzet.
// Pozycje z liczbą dostają wyróżnioną liczbę, reszta jest zwykłą kartą.
import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Sprzęt — Polska Liga Żeglarska' }

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

type Pozycja = { n?: string; t: string }

const SPRZET: Pozycja[] = [
  { n: '10', t: 'nowoczesnych jachtów regatowych RS Sailing RS21' },
  { n: '10', t: 'motorówek RIB dla sędziów, obsługi technicznej i medialnej' },
  { n: '1', t: 'statek komisji regatowej' },
  { n: '3', t: 'automatyczne, zdalnie sterowane boje GPS' },
  { n: '5', t: 'przyczep podłodziowych' },
  { n: '3', t: 'auta SUV i dwa samochody ciężarowe typu VAN' },
  { n: '24', t: 'trackery GPS dla jachtów i znaków trasy wyścigu' },
  { n: '20', t: 'komunikatorów VHF łączących wszystkich członków zespołu organizacyjnego' },
  { t: 'Zestaw do transmisji LIVE z wyścigów — komputery, kamery, nadajniki, mikrofony, oświetlenie, routery.' },
  { t: 'Scena o wymiarach 15 × 3 × 5 m.' },
  { t: 'Branding brzegowy: namioty, flagi i banery.' },
  { t: 'Wyposażenie strefy dla zawodników i kibiców: ekspresy do kawy, mikrofalówki do podgrzania posiłków, dystrybutory wody.' },
]

export default function SprzetPage() {
  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-sky-500">Zaplecze</p>
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Sprzęt</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <p className="mt-6 text-white/85 md:text-lg">
            Dysponujemy profesjonalnym sprzętem, który pozwala nam organizować regaty Polskiej Ligi
            Żeglarskiej w sposób bezpieczny i atrakcyjny dla zawodników oraz kibiców.
          </p>
        </div>
      </section>

      {/* LISTA SPRZĘTU */}
      <section className="mx-auto max-w-[1200px] px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SPRZET.map((p) => (
            <div
              key={p.t}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {p.n ? (
                <span className="shrink-0 text-3xl font-extrabold leading-none text-sky-500">{p.n}</span>
              ) : (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
              )}
              <p className="text-slate-700">{p.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KONTAKT */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <h2 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Chcesz wiedzieć więcej?</h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand-red" />
          <p className="mx-auto mt-6 max-w-2xl text-white/85 md:text-lg">
            Napisz do nas, jeśli planujesz regaty lub wydarzenie i zastanawiasz się nad naszym zapleczem.
          </p>
          <div className="mt-8">
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
