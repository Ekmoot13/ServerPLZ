// STRONA GŁÓWNA — tymczasowa (Strefa Kibica przeniesiona na /regatowastrefakibica).
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let pokazPrzycisk = true
  try {
    const payload = await getPayload({ config: configPromise })
    const s: any = await payload.findGlobal({ slug: 'strefa-kibica' })
    pokazPrzycisk = s?.pokazPrzycisk !== false
  } catch {
    /* brak ustawień — przycisk domyślnie widoczny */
  }

  return (
    <main>
      <section className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-28 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Polska Liga Żeglarska" className="mb-8 h-24 w-auto" />
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">Polska Liga Żeglarska</h1>
          <p className="mb-10 max-w-xl text-slate-300">
            Strona w przygotowaniu — wkrótce pojawi się tu pełna zawartość. W międzyczasie śledź regaty
            na żywo w Strefie Kibica.
          </p>
          {pokazPrzycisk && (
            <Link
              href="/regatowastrefakibica"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-lg font-bold uppercase tracking-wide text-white transition hover:bg-red-500"
            >
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
              Śledź Regaty
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}
