import React from 'react'
import { zawodnicyDoWyboru } from '@/lib/sprostowania'
import Formularz from './Formularz'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Sprostowanie wyników — Polska Liga Żeglarska' }

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

export default async function SprostowanieWynikowPage() {
  const zawodnicy = await zawodnicyDoWyboru()

  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <h1 className="text-3xl font-extrabold uppercase tracking-wide sm:text-4xl md:text-5xl">
            Sprostowanie wyników
          </h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <p className="mt-6 text-white/85 md:text-lg">
            Archiwum startów, zwłaszcza to sprzed lat, bywa niepełne. Jeśli na Twoim profilu brakuje rundy,
            w której żeglowałeś — albo jest taka, w której Cię nie było — zgłoś to tutaj.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <Formularz zawodnicy={zawodnicy} />

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-wide text-navy">Co dalej</h2>
          <div className="mt-2 h-1 w-12 rounded-full bg-brand-red" />
          <ul className="mt-4 space-y-2 text-slate-600">
            <li>Wniosek trafia do redakcji — nic nie zmienia się w wynikach od razu.</li>
            <li>Redakcja sprawdza zgłoszenie i nanosi poprawkę albo odrzuca wniosek.</li>
            <li>Po naniesieniu zmiana pojawia się na Twoim profilu i w statystykach klubu.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
