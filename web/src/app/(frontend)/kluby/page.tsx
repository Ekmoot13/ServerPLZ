// Lista klubów: domyślnie aktywne kluby wg poziomu ligi i miejsca w bieżącym sezonie,
// wyszukiwarka przeszukuje wszystkie kluby. Dane z tabel liga_* (PostgreSQL).
import React from 'react'
import { getKluby, getAktualneKluby } from '@/lib/liga'
import KlubySearch from './KlubySearch'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Kluby — Polska Liga Żeglarska',
}

export default async function KlubyPage() {
  const [kluby, grupy] = await Promise.all([getKluby(), getAktualneKluby()])

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-bold md:text-5xl">Kluby</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Kluby bieżącego sezonu wg poziomu ligi. Wybierz klub, żeby zobaczyć skład zespołu, statystyki
            i historię sezonów. Pozostałe kluby znajdziesz przez wyszukiwarkę.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <KlubySearch allItems={kluby} groups={grupy} />
      </section>
    </main>
  )
}
