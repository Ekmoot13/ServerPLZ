'use client'
import React, { useState, useTransition } from 'react'
import Flaga, { FLAGI } from './Flagi'

/**
 * Siatka sygnałów komisji regatowej — wspólna dla panelu i dla aplikacji
 * na telefonie, bo obsługuje się je tak samo.
 *
 * Podniesiona może być tylko jedna flaga. Dotknięcie innej zmienia sygnał,
 * dotknięcie tej samej ją opuszcza. O wyniku decyduje serwer, a nie ekran —
 * przy dwóch osobach z dostępem telefon może pokazywać nieaktualny stan.
 */
export default function SiatkaFlag({
  poczatkowa,
  przelacz,
}: {
  poczatkowa: string
  przelacz: (kod: string) => Promise<{ flaga: string }>
}) {
  const [flaga, setFlaga] = useState(poczatkowa)
  const [blad, setBlad] = useState('')
  const [czekam, start] = useTransition()

  const klik = (kod: string) => {
    const poprzednia = flaga
    // Natychmiastowa odpowiedź na dotknięcie; prawdę i tak przyniesie serwer.
    setFlaga(flaga === kod ? '' : kod)
    setBlad('')
    start(async () => {
      try {
        const w = await przelacz(kod)
        setFlaga(w.flaga)
      } catch (e) {
        setFlaga(poprzednia)
        setBlad(e instanceof Error ? e.message : 'Nie udało się zapisać. Spróbuj ponownie.')
      }
    })
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        {FLAGI.map((f) => {
          const aktywna = flaga === f.kod
          // Pomarańczowa to sygnał „płyniemy" — czerwone podświetlenie kłóciłoby
          // się z treścią, więc zaznaczamy ją zielenią.
          const ok = f.ton === 'ok'
          const ramka = ok
            ? 'border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-100'
            : 'border-red-600 bg-red-50 shadow-lg shadow-red-100'
          const napis = ok ? 'text-emerald-700' : 'text-red-700'
          return (
            <button
              key={f.kod}
              type="button"
              onClick={() => klik(f.kod)}
              aria-pressed={aktywna}
              className={`flex flex-col items-center gap-3 rounded-2xl border-4 px-3 py-5 text-center transition active:scale-[0.98] ${
                aktywna ? ramka : 'border-slate-200 bg-white'
              }`}
            >
              {/* Sygnały złożone są dwa razy wyższe — wspólna ramka trzyma kafle
                  w jednej linii, zamiast rozpychać rząd. */}
              <span className="flex h-20 items-center">
                <Flaga
                  kod={f.kod}
                  className={`w-auto transition ${
                    f.kod === 'APA' || f.kod === 'APH' ? 'h-20' : 'h-12'
                  } ${aktywna ? '' : 'opacity-30 grayscale'}`}
                />
              </span>
              <span
                className={`text-base font-extrabold uppercase leading-tight tracking-wide ${
                  aktywna ? napis : 'text-slate-500'
                }`}
              >
                {f.nazwa}
              </span>
              <span className="text-xs leading-snug text-slate-500">{f.znaczenie}</span>
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-center text-sm text-slate-500">
        {czekam
          ? 'Zapisywanie…'
          : flaga
            ? 'Dotknij tej samej flagi, żeby ją opuścić.'
            : 'Żaden sygnał nie jest podniesiony.'}
      </p>

      {blad && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-700">
          {blad}
        </p>
      )}
    </div>
  )
}
