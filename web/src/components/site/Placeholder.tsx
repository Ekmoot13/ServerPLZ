import React from 'react'
import Link from 'next/link'
import PageHero from './PageHero'

// Strona-zaślepka dla pozycji menu, których treści jeszcze nie przenieśliśmy.
export default function Placeholder({ tytul }: { tytul: string }) {
  return (
    <main className="bg-slate-50">
      <PageHero tytul={tytul} />
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mb-4 text-5xl">⛵</div>
        <h2 className="text-2xl font-bold text-slate-900">Wkrótce</h2>
        <p className="mt-3 text-slate-500">
          Ta sekcja jest w przygotowaniu. Wracaj tu wkrótce — pracujemy nad zawartością.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-[10px] border-2 border-navy px-6 py-2 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
        >
          Wróć na stronę główną
        </Link>
      </section>
    </main>
  )
}
