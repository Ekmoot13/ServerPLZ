'use client'
import React, { useState, useTransition } from 'react'
import { wygenerujKodFlagi, usunKodFlagi } from '../../actions'
import type { KodFlagi } from '@/lib/kodyFlagi'

/**
 * Kody dostępu do aplikacji z flagą.
 *
 * Sędzia na wodzie dostaje kod, a nie hasło do panelu — kod wygasa po dobie
 * i da się go unieważnić w jednej chwili, gdyby telefon zginął.
 */
const btn =
  'rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50'

function zostalo(wygasa: string): string {
  const ms = new Date(wygasa).getTime() - Date.now()
  if (ms <= 0) return 'wygasł'
  const godz = Math.floor(ms / 3600000)
  if (godz >= 1) return `jeszcze ${godz} godz.`
  return `jeszcze ${Math.max(1, Math.round(ms / 60000))} min`
}

export default function KodyFlagi({ poczatkowe }: { poczatkowe: KodFlagi[] }) {
  const [kody, setKody] = useState<KodFlagi[]>(poczatkowe)
  const [opis, setOpis] = useState('')
  const [blad, setBlad] = useState('')
  const [czekam, start] = useTransition()

  const dodaj = () =>
    start(async () => {
      setBlad('')
      try {
        setKody(await wygenerujKodFlagi(opis))
        setOpis('')
      } catch {
        setBlad('Nie udało się wygenerować kodu.')
      }
    })

  const usun = (kod: string) =>
    start(async () => {
      setBlad('')
      try {
        setKody(await usunKodFlagi(kod))
      } catch {
        setBlad('Nie udało się unieważnić kodu.')
      }
    })

  return (
    <div className="mt-10 border-t border-slate-200 pt-6">
      <h2 className="mb-1 text-lg font-bold">Dostęp z telefonu</h2>
      <p className="mb-4 text-sm text-slate-500">
        Wygeneruj kod i podaj go osobie na wodzie. Otwiera aplikację pod adresem{' '}
        <code className="rounded bg-slate-100 px-1">/flaga</code> i działa 24 godziny — bez
        dawania komukolwiek hasła do panelu.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={opis}
          onChange={(e) => setOpis(e.target.value)}
          placeholder="Dla kogo (np. Marek — komisja)"
          className="min-w-[200px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
        <button type="button" onClick={dodaj} disabled={czekam} className={btn}>
          {czekam ? 'Chwila…' : '+ Nowy kod'}
        </button>
      </div>

      {blad && (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {blad}
        </p>
      )}

      {kody.length === 0 ? (
        <p className="text-sm text-slate-500">Brak aktywnych kodów.</p>
      ) : (
        <ul className="space-y-2">
          {kody.map((k) => (
            <li
              key={k.kod}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <span className="font-mono text-xl font-bold tracking-widest text-navy">{k.kod}</span>
              <span className="text-sm text-slate-500">{zostalo(k.wygasa)}</span>
              {k.opis && <span className="text-sm text-slate-400">· {k.opis}</span>}
              <button
                type="button"
                onClick={() => usun(k.kod)}
                disabled={czekam}
                className="ml-auto rounded-lg border border-red-200 px-2.5 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                Unieważnij
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
