'use client'
import React, { useCallback, useState } from 'react'
import Flaga from '@/components/Flagi'
import SiatkaFlag from '@/components/SiatkaFlag'
import { czytelny, znormalizuj } from '@/lib/kodyFlagi'

/**
 * Aplikacja z sygnałami komisji regatowej — do zainstalowania na telefonie
 * z ekranu głównego.
 *
 * Kod z panelu wpisuje się raz: serwer odsyła podpisane ciasteczko i telefon
 * zostaje sparowany do końca ważności kodu. Po odświeżeniu, zamknięciu karty
 * czy restarcie telefonu aplikacja otwiera się od razu na flagach — serwer
 * rozpoznaje urządzenie, zanim narysuje widok.
 *
 * Ekran jest celowo ubogi: cztery duże kafle i wyraźna informacja, gdy coś nie
 * dochodzi do serwera. Obsługa odbywa się na wodzie, w rękawiczkach i w słońcu.
 */
async function wyslij(cialo: Record<string, unknown>) {
  const r = await fetch('/api/flaga', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(cialo),
    cache: 'no-store',
  })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d?.blad || 'Serwer odrzucił żądanie.')
  return d as { flaga: string }
}

export default function AplikacjaFlagi({
  polaczone,
  flaga,
}: {
  polaczone: boolean
  flaga: string
}) {
  const [sparowane, setSparowane] = useState(polaczone)
  const [wpisywany, setWpisywany] = useState('')
  const [blad, setBlad] = useState('')
  const [zajete, setZajete] = useState(false)

  const zaloguj = useCallback(async () => {
    setBlad('')
    setZajete(true)
    try {
      await wyslij({ kod: znormalizuj(wpisywany) })
      setSparowane(true)
    } catch (e) {
      setBlad(e instanceof Error ? e.message : 'Nie udało się połączyć.')
    } finally {
      setZajete(false)
    }
  }, [wpisywany])

  const przelacz = useCallback(async (sygnal: string) => wyslij({ przelacz: sygnal }), [])

  const odlacz = useCallback(async () => {
    await fetch('/api/flaga', { method: 'DELETE' }).catch(() => {})
    setSparowane(false)
    setWpisywany('')
  }, [])

  // ---- Ekran parowania ----
  if (!sparowane) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <Flaga kod="AP" className="h-20 w-auto opacity-30 grayscale" />
        <h1 className="text-center text-xl font-bold text-slate-800">Sygnały komisji regatowej</h1>
        <p className="max-w-xs text-center text-sm text-slate-500">
          Wpisz kod z panelu redaktora. Wystarczy raz — telefon zostanie sparowany do końca
          ważności kodu.
        </p>

        <input
          value={wpisywany}
          onChange={(e) => setWpisywany(czytelny(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && zaloguj()}
          placeholder="XXXX-XXXX"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          className="w-full max-w-xs rounded-2xl border-2 border-slate-300 px-4 py-4 text-center font-mono text-2xl tracking-widest outline-none focus:border-sky-500"
        />

        <button
          type="button"
          onClick={zaloguj}
          disabled={zajete || znormalizuj(wpisywany).length !== 8}
          className="w-full max-w-xs rounded-2xl bg-navy px-6 py-4 text-lg font-bold text-white disabled:opacity-40"
        >
          {zajete ? 'Sprawdzanie…' : 'Połącz'}
        </button>

        {blad && (
          <p className="max-w-xs rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-700">
            {blad}
          </p>
        )}
      </main>
    )
  }

  // ---- Ekran z sygnałami ----
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-5 px-4 py-8">
      <SiatkaFlag poczatkowa={flaga} przelacz={przelacz} />

      <button type="button" onClick={odlacz} className="mx-auto text-sm text-slate-400 underline">
        Odłącz ten telefon
      </button>
    </main>
  )
}
