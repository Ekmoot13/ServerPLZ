import React from 'react'
import PageHero from '@/components/site/PageHero'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Polski Klub Regatowy — Polska Liga Żeglarska' }

export default function PolskiKlubRegatowyPage() {
  return (
    <main className="bg-slate-50">
      <PageHero
        tytul="Polski Klub Regatowy"
        podtytul="Stowarzyszenie Żeglarzy Ligowych i Meczowych — klub tworzony przez zawodników dla zawodników."
      />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="mb-4 text-2xl font-extrabold uppercase tracking-wide text-navy">Klub dla wszystkich</h2>
        <div className="space-y-4 text-slate-700">
          <p>
            Witamy w Polskim Klubie Regatowym — Stowarzyszeniu Żeglarzy Ligowych i Meczowych! Po 12 sezonach Polskiej Ligi
            Żeglarskiej i prawie 20 latach match racingu w Polsce wokół cykli regat Ligi i Polish Match Tour zgromadziło się
            już wielu zawodników, klubów, partnerów, kibiców i przyjaciół.
          </p>
          <p>
            PKR reprezentuje, organizuje oraz w miarę możliwości pomaga i wspiera tych, którzy tego potrzebują. Jest
            organizacją non-profit w formie stowarzyszenia — członkiem zwyczajnym Polskiego Związku Żeglarskiego, z pełnym
            wsparciem Polskiej Ligi Żeglarskiej i cyklu Polish Match Tour.
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-wide text-navy">Korzyści dla członków</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border-2 border-navy/10 p-6">
              <h3 className="mb-2 font-bold text-navy">Szkolenia i warsztaty</h3>
              <p className="text-sm text-slate-600">
                Bezpłatne szkolenia z tworzenia ofert sponsoringowych, prowadzenia mediów społecznościowych klubu oraz
                warsztaty ze stosowania przepisów regatowych.
              </p>
            </div>
            <div className="rounded-xl border-2 border-navy/10 p-6">
              <h3 className="mb-2 font-bold text-navy">Zniżki na czartery PLŻ</h3>
              <p className="text-sm text-slate-600">
                Jacht RS21: 1000 zł netto / 8 h (zamiast 1250 zł). Motorówki RIB od 360 zł netto / 8 h. Wybrany czarter 2 razy
                w roku na członka klubu.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="mb-4 text-2xl font-extrabold uppercase tracking-wide text-navy">Członkostwo</h2>
        <ol className="list-decimal space-y-3 pl-5 text-slate-700">
          <li>Wypełnij i podpisz deklarację członkowską (pola są edytowalne, można podpisać elektronicznie).</li>
          <li>
            Opłać składkę członkowską — <strong>240 zł / rok</strong>. Dane do przelewu: Polski Klub Regatowy — Stowarzyszenie
            Żeglarzy Ligowych i Meczowych, ul. Przestrzenna 11, 70-800 Szczecin, Santander{' '}
            <span className="whitespace-nowrap">94 1090 1492 0000 0001 6488 5095</span>. Tytuł: „Imię Nazwisko składka członkowska”.
          </li>
          <li>
            Wyślij podpisaną deklarację i potwierdzenie przelewu na{' '}
            <a href="mailto:biuro@polskiklubregatowy.pl" className="font-semibold text-brand-red hover:underline">
              biuro@polskiklubregatowy.pl
            </a>
            .
          </li>
        </ol>
        <p className="mt-4 text-sm text-slate-500">
          Członkostwo w PKR nie jest wymagane do startu w regatach PLŻ lub PMT.
        </p>
        <a
          href="mailto:biuro@polskiklubregatowy.pl"
          className="mt-6 inline-block rounded-[10px] bg-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-navy-800"
        >
          Napisz do nas
        </a>
      </section>
    </main>
  )
}
