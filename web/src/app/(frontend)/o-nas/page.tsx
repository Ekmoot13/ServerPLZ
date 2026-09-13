import React from 'react'
import Link from 'next/link'
import PageHero from '@/components/site/PageHero'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'O nas — Polska Liga Żeglarska' }

const WARTOSCI = [
  { tytul: 'Równość szans', opis: 'Wszyscy ścigają się na jednakowych jachtach RS21 z rotacją załóg — o wyniku decydują umiejętności.' },
  { tytul: 'Społeczność', opis: 'Wspieramy i aktywizujemy środowisko żeglarskie — od amatorów po medalistów olimpijskich.' },
  { tytul: 'Rozwój zgodny z naturą', opis: 'Nasza moc pochodzi z wiatru i wody — to nasze naturalne środowisko i źródło energii.' },
]

export default function ONasPage() {
  return (
    <main className="bg-slate-50">
      <PageHero
        tytul="O nas"
        podtytul="Pure racing, true passion — Polska Liga Żeglarska to cykliczne ligowe rozgrywki żeglarskie wzorem innych dyscyplin sportowych."
      />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-wide text-navy">
          Czym jest Polska Liga Żeglarska?
        </h2>
        <div className="space-y-4 text-slate-700">
          <p>Polska Liga Żeglarska powstała w 2015 roku.</p>
          <p>
            Cykliczne regaty rozgrywane są na głównych poziomach — <strong>Ekstraklasa</strong>, <strong>1 Liga</strong> i{' '}
            <strong>Ligi Regionalne</strong>. Organizujemy także Żeglarskie Mistrzostwa Polski Kobiet oraz Młodzieżową Ligę
            Żeglarską dla zawodniczek i zawodników do 25. roku życia.
          </p>
          <p>
            System Polskiej Ligi Żeglarskiej to <strong>ponad 120 klubów i 500 zawodników</strong>, co stawia ją na czele
            wszystkich 24 lig na świecie. Liga jest członkiem <strong>ISLA</strong> (International Sailing League Association),
            organizacji nadzorującej Sailing Champions League. Partnerem Strategicznym jest Polski Związek Żeglarski.
          </p>
          <p>
            W regatach udział biorą najlepsi polscy żeglarze — przedstawiciele wielu pokoleń Mistrzów Polski, Europy i Świata,
            medaliści Olimpijscy, aktualni zawodnicy Kadry Narodowej i Kadry Juniorskiej, ale też żeglarze amatorzy.
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-[1440px] px-4">
          <h2 className="mb-8 text-center text-2xl font-extrabold uppercase tracking-wide text-navy">Nasze wartości</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {WARTOSCI.map((w) => (
              <div key={w.tytul} className="rounded-xl border-2 border-navy/10 p-6 transition hover:border-brand-red">
                <h3 className="mb-2 text-lg font-bold text-navy">{w.tytul}</h3>
                <p className="text-sm text-slate-600">{w.opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 text-center">
        <p className="text-slate-600">Chcesz dowiedzieć się więcej o rozgrywkach i formacie regat?</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/wyniki" className="rounded-[10px] bg-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-navy-800">
            Wyniki
          </Link>
          <Link href="/kalendarz" className="rounded-[10px] border-2 border-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white">
            Kalendarz
          </Link>
          <Link href="/kluby" className="rounded-[10px] border-2 border-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white">
            Kluby
          </Link>
        </div>
      </section>
    </main>
  )
}
