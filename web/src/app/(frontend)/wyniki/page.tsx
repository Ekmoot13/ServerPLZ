// Wyniki sezonu — dane bezpośrednio z bazy (liga_*). Logika bez zmian.
// Wygląd: przełącznik lig (slider) + zakładki rund (klient WynikiWidok).
import React from 'react'
import Link from 'next/link'
import { getLataWynikow, getWynikiPelne } from '@/lib/liga'
import WynikiWidok from './WynikiWidok'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Wyniki — Polska Liga Żeglarska' }

export default async function WynikiPage({
  searchParams,
}: {
  searchParams: Promise<{ rok?: string }>
}) {
  const sp = await searchParams
  const lata = await getLataWynikow()
  const rok = sp.rok && lata.includes(Number(sp.rok)) ? Number(sp.rok) : lata[0]
  const ligi = rok ? await getWynikiPelne(rok) : []

  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section
        className="bg-navy text-white"
        style={{
          backgroundImage: 'url(/pkr-pattern-soft.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="mx-auto max-w-[1440px] px-4 py-16 text-center md:py-20">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Wyniki</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-10">
        {/* WYBÓR SEZONU */}
        {lata.length > 1 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {lata.map((y) => (
              <Link
                key={y}
                href={`/wyniki?rok=${y}`}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  y === rok ? 'bg-navy text-white' : 'border-2 border-navy/15 text-navy hover:border-brand-red'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        )}

        {ligi.length === 0 ? (
          <p className="text-center text-slate-500">Brak wyników dla wybranego sezonu.</p>
        ) : (
          <WynikiWidok ligi={ligi as any} />
        )}
      </section>
    </main>
  )
}
