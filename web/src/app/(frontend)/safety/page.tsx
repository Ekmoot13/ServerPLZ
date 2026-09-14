// Bezpieczeństwo — treść przeniesiona z ligazeglarska.pl/safety.
// Akcenty błękitne, kreski pod nagłówkami czerwone — jak na Ofercie i Sprzęcie.
import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Bezpieczeństwo — Polska Liga Żeglarska' }

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

const ZASADY: { tyt: string; txt: string }[] = [
  {
    tyt: 'Czysta rywalizacja w bezpiecznym otoczeniu',
    txt: 'Każdy jacht jest wyposażony w GPS, a treningi odbywają się z pakietem bezpieczeństwa (safety pack) i radiem VHF. Stały nadzór na wodzie i lądzie sprawia, że każda załoga jest przygotowana nawet na najcięższe warunki pogodowe.',
  },
  {
    tyt: 'Środki wypornościowe obowiązkowo',
    txt: 'Wszystkie załogi mają obowiązek korzystania z osobistych środków wypornościowych na treningach, w wyścigach i podczas żeglowania pomiędzy seriami wyścigów.',
  },
  {
    tyt: 'Zmiany załóg pod okiem techników',
    txt: 'Zmian załóg pomiędzy wyścigami dokonuje wyszkolona załoga techniczna.',
  },
]

const SAFETY_PACK = ['pławka dymna', '3 flary', 'Personal MOB AIS', 'radio VHF']
const PROCEDURY = ['zgłoszenie wyjścia', 'zgłoszenia z akwenu co godzinę', 'zgłoszenie powrotu']

export default function SafetyPage() {
  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-sky-500">Safety</p>
          {/* Na wąskim ekranie „Bezpieczeństwo" to jeden nierozdzielny wyraz — w text-4xl
              wychodził 14 px poza szerokość telefonu i rozjeżdżał całą stronę w bok. */}
          <h1 className="text-3xl font-extrabold uppercase tracking-wide sm:text-4xl md:text-5xl">Bezpieczeństwo</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <p className="mt-6 text-white/85 md:text-lg">
            Bezpieczeństwo to fundament Polskiej Ligi Żeglarskiej — zarówno podczas regat, jak i treningów.
          </p>
        </div>
      </section>

      {/* ZASADY */}
      <section className="mx-auto max-w-[1200px] px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {ZASADY.map((z) => (
            <div
              key={z.tyt}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-lg font-extrabold leading-snug text-navy">{z.tyt}</h2>
              <div className="mt-3 h-1 w-12 rounded-full bg-sky-500" />
              <p className="mt-4 text-slate-600">{z.txt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAFETY PACK + PROCEDURY */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-500">Wyposażenie</p>
            <h2 className="mt-2 text-xl font-extrabold text-navy">RS21 safety pack</h2>
            <ul className="mt-5 space-y-3">
              {SAFETY_PACK.map((p) => (
                <li key={p} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-500">Na wodzie</p>
            <h2 className="mt-2 text-xl font-extrabold text-navy">Procedury</h2>
            <ol className="mt-5 space-y-3">
              {PROCEDURY.map((p, i) => (
                <li key={p} className="flex items-start gap-3 text-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* KONTAKT */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <h2 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Masz pytania?</h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-brand-red" />
          <p className="mx-auto mt-6 max-w-2xl text-white/85 md:text-lg">
            Napisz do nas, jeśli chcesz poznać szczegóły naszych procedur bezpieczeństwa.
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
