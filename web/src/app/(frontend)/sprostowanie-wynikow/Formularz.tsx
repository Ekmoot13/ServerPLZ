'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { pobierzKluby, pobierzRundy, wyslijSprostowanie, type TypWniosku } from './actions'
import type { Pozycja } from '@/lib/sprostowania'

/**
 * Formularz sprostowania — trzy listy jedna po drugiej: zawodnik, klub, runda.
 *
 * Kolejne listy dociągamy dopiero po wyborze poprzedniej, bo ich zawartość od
 * niego zależy. Przy dodawaniu występu pokazujemy rundy, w których startował
 * wybrany klub; przy usuwaniu — tylko te, w których zawodnik faktycznie jest
 * zapisany. Dzięki temu nie da się wysłać wniosku, który nie ma sensu.
 */

const selectCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:bg-slate-50 disabled:text-slate-400'

function Pole({
  etykieta,
  podpowiedz,
  children,
}: {
  etykieta: string
  podpowiedz?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-navy">{etykieta}</label>
      {children}
      {podpowiedz && <p className="mt-1 text-xs text-slate-500">{podpowiedz}</p>}
    </div>
  )
}

export default function Formularz({ zawodnicy }: { zawodnicy: Pozycja[] }) {
  const [typ, setTyp] = useState<TypWniosku>('dodanie')
  const [zawodnik, setZawodnik] = useState('')
  const [klub, setKlub] = useState('')
  const [runda, setRunda] = useState('')
  const [kontakt, setKontakt] = useState('')
  const [uwagi, setUwagi] = useState('')

  const [kluby, setKluby] = useState<Pozycja[]>([])
  const [rundy, setRundy] = useState<Pozycja[]>([])
  const [ladowanie, setLadowanie] = useState<'' | 'kluby' | 'rundy'>('')
  const [wysylanie, setWysylanie] = useState(false)
  const [wynik, setWynik] = useState<{ ok: boolean; tekst: string } | null>(null)

  // Zmiana rodzaju wniosku albo zawodnika unieważnia wszystko poniżej.
  useEffect(() => {
    setKlub('')
    setRunda('')
    setKluby([])
    setRundy([])
    if (!zawodnik) return
    setLadowanie('kluby')
    pobierzKluby(typ, Number(zawodnik))
      .then(setKluby)
      .finally(() => setLadowanie(''))
  }, [typ, zawodnik])

  useEffect(() => {
    setRunda('')
    setRundy([])
    if (!zawodnik || !klub) return
    setLadowanie('rundy')
    pobierzRundy(typ, Number(zawodnik), Number(klub))
      .then(setRundy)
      .finally(() => setLadowanie(''))
  }, [typ, zawodnik, klub])

  const wyslij = useCallback(async () => {
    setWysylanie(true)
    setWynik(null)
    const odp = await wyslijSprostowanie({
      typ,
      zawodnikId: Number(zawodnik),
      wariantId: Number(klub),
      regatyId: Number(runda),
      kontakt,
      uwagi,
    })
    setWysylanie(false)
    if (odp.ok) {
      setWynik({ ok: true, tekst: 'Wniosek wysłany. Redakcja go sprawdzi i naniesie poprawkę.' })
      // Zawodnik i kontakt zostają — zwykle zgłasza się kilka rund po kolei.
      setKlub('')
      setRunda('')
      setUwagi('')
    } else {
      setWynik({ ok: false, tekst: odp.blad || 'Nie udało się wysłać wniosku.' })
    }
  }, [typ, zawodnik, klub, runda, kontakt, uwagi])

  const komplet = zawodnik && klub && runda && !wysylanie

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      {/* Rodzaj wniosku */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ['dodanie', 'Brakuje mojego startu'],
            ['usuniecie', 'Jest start, którego nie było'],
          ] as [TypWniosku, string][]
        ).map(([w, etykieta]) => (
          <button
            key={w}
            type="button"
            onClick={() => setTyp(w)}
            className={`rounded-full border-2 px-5 py-2 text-sm font-bold transition ${
              typ === w
                ? 'border-navy bg-navy text-white'
                : 'border-slate-300 text-slate-600 hover:border-navy hover:text-navy'
            }`}
          >
            {etykieta}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        <Pole etykieta="1. Zawodnik">
          <select value={zawodnik} onChange={(e) => setZawodnik(e.target.value)} className={selectCls}>
            <option value="">— wybierz z listy —</option>
            {zawodnicy.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nazwa}
              </option>
            ))}
          </select>
        </Pole>

        <Pole
          etykieta="2. Klub / zespół"
          podpowiedz={
            typ === 'usuniecie'
              ? 'Kluby, w których jesteś zapisany w naszej bazie.'
              : 'Nazwa zespołu z danego sezonu — tak, jak występował w wynikach.'
          }
        >
          <select
            value={klub}
            onChange={(e) => setKlub(e.target.value)}
            disabled={!zawodnik || ladowanie === 'kluby'}
            className={selectCls}
          >
            <option value="">
              {!zawodnik
                ? '— najpierw wybierz zawodnika —'
                : ladowanie === 'kluby'
                  ? 'wczytywanie…'
                  : kluby.length === 0
                    ? '— brak klubów do wyboru —'
                    : '— wybierz z listy —'}
            </option>
            {kluby.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nazwa}
              </option>
            ))}
          </select>
        </Pole>

        <Pole
          etykieta="3. Runda"
          podpowiedz={
            typ === 'usuniecie'
              ? 'Rundy, w których jesteś zapisany w tym klubie.'
              : 'Pokazujemy tylko rundy, w których ten klub naprawdę startował.'
          }
        >
          <select
            value={runda}
            onChange={(e) => setRunda(e.target.value)}
            disabled={!klub || ladowanie === 'rundy'}
            className={selectCls}
          >
            <option value="">
              {!klub
                ? '— najpierw wybierz klub —'
                : ladowanie === 'rundy'
                  ? 'wczytywanie…'
                  : rundy.length === 0
                    ? '— brak rund do wyboru —'
                    : '— wybierz z listy —'}
            </option>
            {rundy.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nazwa}
              </option>
            ))}
          </select>
        </Pole>

        <div className="grid gap-5 sm:grid-cols-2">
          <Pole etykieta="Kontakt (nieobowiązkowo)" podpowiedz="Gdybyśmy musieli dopytać.">
            <input
              type="text"
              value={kontakt}
              onChange={(e) => setKontakt(e.target.value)}
              placeholder="e-mail lub telefon"
              className={selectCls}
            />
          </Pole>
          <Pole etykieta="Uwagi (nieobowiązkowo)">
            <input
              type="text"
              value={uwagi}
              onChange={(e) => setUwagi(e.target.value)}
              placeholder="np. skąd wiadomo, że tam startowałem"
              className={selectCls}
            />
          </Pole>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => void wyslij()}
            disabled={!komplet}
            className="rounded-[10px] bg-navy px-7 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {wysylanie ? 'Wysyłanie…' : 'Wyślij wniosek'}
          </button>
          <span className="text-xs text-slate-500">Jeden wniosek dotyczy jednej rundy.</span>
        </div>

        {wynik && (
          <div
            role="status"
            className={`rounded-lg border px-4 py-3 text-sm ${
              wynik.ok
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {wynik.tekst}
          </div>
        )}
      </div>
    </div>
  )
}
