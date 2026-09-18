'use client'
import React, { useEffect, useRef, useState } from 'react'
import type { DaneWynikow, Komorka } from '@/lib/sap'

/**
 * Tabela wyników na żywo.
 *
 * Pierwsze dane przychodzą z serwera (są w HTML-u, więc tabela jest od razu
 * widoczna i indeksowalna), a potem komponent sam dociąga aktualizacje z
 * /api/wyniki. W trakcie wyścigu kolejność potrafi się zmieniać co chwilę,
 * dlatego odpytujemy co pięć sekund — ale tylko gdy karta jest na wierzchu,
 * żeby nie mielić w tle cudzego serwera.
 *
 * Oznaczenia idą za tym, co pokazuje SAP w swoim leaderboardzie:
 * kolor podkreślenia mówi, w której flotylli danego lotu płynie załoga
 * (w jednym locie startują dwie dziesiątki), a czerwony wynik oznacza wyścig,
 * który właśnie trwa — te miejsca mogą się jeszcze przetasować.
 */
const FLOTYLLE: Record<string, string> = {
  'Race 1': 'decoration-sky-500',
  'Race 2': 'decoration-amber-500',
}

function Wartosc({ k, trwa }: { k: Komorka; trwa: boolean }) {
  if (k.tekst === '–') return <span className="text-slate-300">–</span>

  const podkreslenie = k.flotylla ? FLOTYLLE[k.flotylla] : null
  return (
    <span
      className={[
        podkreslenie ? `underline decoration-2 underline-offset-4 ${podkreslenie}` : '',
        trwa ? 'font-bold text-red-600' : 'text-slate-600',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {k.tekst}
    </span>
  )
}

/** Ile komórek ma wynik — miara tego, jak dużo wiadomo z danej odpowiedzi. */
function bogactwo(d: DaneWynikow): number {
  return d.wiersze.reduce((n, w) => n + w.komorki.filter((k) => k.tekst !== '–').length, 0)
}

export default function TabelaWynikow({ poczatkowe }: { poczatkowe: DaneWynikow | null }) {
  const [dane, setDane] = useState<DaneWynikow | null>(poczatkowe)
  const chude = useRef(0)

  useEffect(() => {
    let przerwane = false

    const pobierz = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const r = await fetch('/api/wyniki', { cache: 'no-store' })
        if (!r.ok) return
        const nowe = (await r.json()) as DaneWynikow | null
        if (przerwane || !nowe?.wiersze?.length) return

        setDane((poprzednie) => {
          if (!poprzednie) return nowe
          // Wyniki w trakcie regat tylko przybywają. Odpowiedź uboższa od tego,
          // co już pokazujemy, to prawie zawsze rozjazd węzłów SAP-a, a nie nowy
          // stan — nie pozwalamy jej wyczyścić tabeli.
          if (bogactwo(nowe) >= bogactwo(poprzednie)) {
            chude.current = 0
            return nowe
          }
          chude.current += 1
          // Trzy chude odpowiedzi z rzędu (~15 s) to już nie przypadek — wtedy
          // przyjmujemy, że wyniki faktycznie zostały wycofane.
          if (chude.current >= 3) {
            chude.current = 0
            return nowe
          }
          return poprzednie
        })
      } catch {
        // Cisza — kolejna próba za pięć sekund.
      }
    }

    const id = setInterval(pobierz, 5000)
    document.addEventListener('visibilitychange', pobierz)
    return () => {
      przerwane = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', pobierz)
    }
  }, [])

  if (!dane?.wiersze?.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
        Wyniki chwilowo niedostępne.
      </div>
    )
  }

  const trwaKolumna = dane.kolumnaTrwajaca
  const trwaFlotylla = dane.flotyllaTrwajaca

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-semibold text-slate-800">{dane.tytul}</h3>
          {trwaKolumna && (
            <span className="text-xs font-semibold text-red-600">
              Trwa wyścig: {trwaKolumna}
              {trwaFlotylla ? ` (${trwaFlotylla})` : ''}
            </span>
          )}
        </div>
        {dane.naZywo && (
          <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            NA ŻYWO
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-500">
              <th className="px-2 py-1.5 font-medium">#</th>
              <th className="px-2 py-1.5 font-medium">Klub</th>
              {dane.kolumny.map((c, i) => (
                <th
                  key={i}
                  className={`px-2 py-1.5 text-center font-medium ${
                    c === trwaKolumna ? 'text-red-600' : ''
                  }`}
                >
                  {c.trim()}
                </th>
              ))}
              <th className="px-2 py-1.5 text-center font-semibold text-slate-700">Σ</th>
            </tr>
          </thead>
          <tbody>
            {dane.wiersze.map((w) => (
              <tr key={w.id} className="border-t border-slate-100 hover:bg-navy/5">
                <td className="px-2 py-1.5 font-semibold text-slate-700">{w.miejsce}</td>
                <td className="whitespace-nowrap px-2 py-1.5 font-medium text-slate-800">
                  {w.nazwa}
                </td>
                {w.komorki.map((k, i) => (
                  <td key={i} className="px-2 py-1.5 text-center tabular-nums">
                    <Wartosc
                      k={k}
                      trwa={dane.kolumny[i] === trwaKolumna && k.flotylla === trwaFlotylla}
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5 text-center font-bold tabular-nums text-slate-800">
                  {w.punkty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
        <span className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-sky-500" /> Race 1
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-amber-500" /> Race 2
          </span>
          {trwaKolumna && <span className="font-semibold text-red-600">wynik nieoficjalny</span>}
        </span>
        <span>Dane: SAP Sailing Analytics</span>
      </div>
    </div>
  )
}
