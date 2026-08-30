// Lista zawodników z wyszukiwarką. Dane z tabel liga_* (PostgreSQL).
import React from 'react'
import { getZawodnicy } from '@/lib/liga'
import ZawodnicySearch from './ZawodnicySearch'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Zawodnicy — Polska Liga Żeglarska',
}

export default async function ZawodnicyPage() {
  const zawodnicy = await getZawodnicy()

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-bold md:text-5xl">Zawodnicy</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Baza zawodniczek i zawodników Polskiej Ligi Żeglarskiej. Wyszukaj po nazwisku, żeby zobaczyć
            starty, historię sezonów i medale.
          </p>
        </div>
      </section>

      {/* WYSZUKIWARKA + LISTA */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <ZawodnicySearch items={zawodnicy} />
      </section>
    </main>
  )
}
