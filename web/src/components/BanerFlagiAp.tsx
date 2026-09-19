'use client'
import React, { useEffect, useState } from 'react'
import Flaga, { opisFlagi, type KodFlagi } from './Flagi'

/**
 * Baner z sygnałem komisji regatowej na górze Strefy Kibica.
 *
 * Stan pierwszy przychodzi z serwera, dalsze z /api/flaga co pięć sekund —
 * komisja podnosi flagę na telefonie, a kibic widzi ją bez odświeżania strony.
 * Odpytujemy tylko przy karcie na wierzchu, tak samo jak tabelę wyników.
 */
export default function BanerFlagiAp({ poczatkowa }: { poczatkowa: string }) {
  const [flaga, setFlaga] = useState(poczatkowa)

  useEffect(() => {
    let przerwane = false

    const sprawdz = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const r = await fetch('/api/flaga', { cache: 'no-store' })
        if (!r.ok) return
        const d = await r.json()
        if (!przerwane && typeof d?.flaga === 'string') setFlaga(d.flaga)
      } catch {
        // Cisza — kolejna próba za pięć sekund.
      }
    }

    const id = setInterval(sprawdz, 5000)
    document.addEventListener('visibilitychange', sprawdz)
    return () => {
      przerwane = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', sprawdz)
    }
  }, [])

  const opis = opisFlagi(flaga)
  if (!opis) return null

  // Pomarańczowa mówi „płyniemy" — czerwony pas alarmowy kłóciłby się z treścią.
  const barwy =
    opis.ton === 'ok' ? 'border-emerald-800 bg-emerald-700' : 'border-red-700 bg-red-600'
  const zlozona = opis.kod === 'APA' || opis.kod === 'APH'

  return (
    <section className={`border-y-4 text-white ${barwy}`}>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-4">
        <Flaga
          kod={opis.kod as KodFlagi}
          className={`w-auto shrink-0 drop-shadow ${zlozona ? 'h-20' : 'h-12'}`}
        />
        <div>
          <p className="text-lg font-extrabold uppercase tracking-wide md:text-xl">
            {opis.znaczenie}
          </p>
          {/* Przy pomarańczowej sam nagłówek wystarcza — na telefonie drugi
              wiersz spychał Strefę Kibica poniżej krawędzi ekranu. Flagi
              wstrzymujące zostawiamy z dopiskiem, bo tam kibic czeka na
              informację, co dalej. */}
          {opis.ton !== 'ok' && (
            <p className="text-sm text-white/85">
              Sygnał komisji regatowej: flaga {opis.nazwa}. Kolejny podamy, gdy tylko zapadnie
              decyzja.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
