import React from 'react'
import PageHero from '@/components/site/PageHero'
import KontaktForm from './KontaktForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Kontakt — Polska Liga Żeglarska' }

export default function KontaktPage() {
  return (
    <main className="bg-slate-50">
      <PageHero tytul="Kontakt" podtytul="Masz pytanie? Napisz do nas — odpowiemy najszybciej, jak to możliwe." />

      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 lg:grid-cols-[1fr_1.2fr]">
        {/* DANE KONTAKTOWE */}
        <div>
          <h2 className="mb-4 text-2xl font-extrabold uppercase tracking-wide text-navy">Dane kontaktowe</h2>
          <div className="space-y-5 text-slate-700">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-brand-red">E-mail</div>
              <a href="mailto:info@ligazeglarska.pl" className="text-lg font-semibold text-navy hover:underline">
                info@ligazeglarska.pl
              </a>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-brand-red">Towarzystwo Żeglarstwa Regatowego</div>
              <p className="text-sm">
                ul. Parkowa 43, 71-220 Bezrzecze, Poland
                <br />
                NIP: 851.318.97.68
              </p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-brand-red">MT Partners Maciej Cylupa Sp.k.</div>
              <p className="text-sm">
                ul. Parkowa 43, 71-220 Bezrzecze, Poland
                <br />
                NIP: 631.252.03.79
              </p>
            </div>
          </div>
        </div>

        {/* FORMULARZ */}
        <div className="rounded-2xl border-2 border-navy/10 bg-white p-6 md:p-8">
          <h2 className="mb-5 text-2xl font-extrabold uppercase tracking-wide text-navy">Napisz do nas</h2>
          <KontaktForm />
        </div>
      </section>
    </main>
  )
}
