'use client'
import React, { useCallback, useState } from 'react'
import { listyDoSprostowania, rozpatrzSprostowanie, zapiszSprostowanie } from '../../actions'
import type { Pozycja } from '@/lib/sprostowania'

export type Wniosek = {
  id: string
  typ: string
  status: string
  zawodnikId: number
  zawodnikNazwa: string
  wariantId: number
  klubNazwa: string
  regatyId: number
  regatyOpis: string
  kontakt: string
  uwagi: string
  notatka: string
  zastosowane: boolean
  createdAt: string
}

const ETYKIETA_TYPU: Record<string, string> = {
  dodanie: 'Dodać występ',
  usuniecie: 'Usunąć występ',
}

const STYL_STATUSU: Record<string, string> = {
  nowy: 'bg-amber-100 text-amber-800',
  zaakceptowany: 'bg-green-100 text-green-800',
  odrzucony: 'bg-slate-200 text-slate-600',
}

function data(s: string): string {
  try {
    return new Date(s).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return ''
  }
}

const selectCls = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500'

function Wiersz({ w, odswiez }: { w: Wniosek; odswiez: () => void }) {
  const [zajety, setZajety] = useState(false)
  const [notatka, setNotatka] = useState(w.notatka || '')
  const [edycja, setEdycja] = useState(false)
  const [kluby, setKluby] = useState<Pozycja[]>([])
  const [rundy, setRundy] = useState<Pozycja[]>([])
  const [wariantId, setWariantId] = useState(String(w.wariantId))
  const [regatyId, setRegatyId] = useState(String(w.regatyId))
  const [blad, setBlad] = useState('')

  const otworzEdycje = useCallback(async () => {
    setEdycja(true)
    const listy = await listyDoSprostowania(w.typ, w.zawodnikId, Number(wariantId))
    setKluby(listy.kluby)
    setRundy(listy.rundy)
  }, [w.typ, w.zawodnikId, wariantId])

  const zmienKlub = useCallback(
    async (nowy: string) => {
      setWariantId(nowy)
      setRegatyId('')
      const listy = await listyDoSprostowania(w.typ, w.zawodnikId, Number(nowy))
      setRundy(listy.rundy)
    },
    [w.typ, w.zawodnikId],
  )

  const dzialaj = useCallback(
    async (fn: () => Promise<{ ok: boolean; blad?: string }>) => {
      setZajety(true)
      setBlad('')
      const r = await fn()
      setZajety(false)
      if (!r.ok) setBlad(r.blad || 'Nie udało się.')
      else odswiez()
    },
    [odswiez],
  )

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STYL_STATUSU[w.status] || ''}`}>
          {w.status}
        </span>
        <span className="text-sm font-bold text-navy">{ETYKIETA_TYPU[w.typ] || w.typ}</span>
        <span className="ml-auto text-xs text-slate-400">{data(w.createdAt)}</span>
      </div>

      <div className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
        <div>
          <span className="block text-xs uppercase tracking-wide text-slate-400">Zawodnik</span>
          <span className="font-medium text-slate-800">{w.zawodnikNazwa}</span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-wide text-slate-400">Klub</span>
          <span className="font-medium text-slate-800">{w.klubNazwa}</span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-wide text-slate-400">Runda</span>
          <span className="font-medium text-slate-800">{w.regatyOpis}</span>
        </div>
      </div>

      {(w.kontakt || w.uwagi) && (
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {w.kontakt && (
            <div>
              <span className="text-slate-400">Kontakt:</span> {w.kontakt}
            </div>
          )}
          {w.uwagi && (
            <div>
              <span className="text-slate-400">Uwagi:</span> {w.uwagi}
            </div>
          )}
        </div>
      )}

      {edycja && (
        <div className="mt-3 grid gap-3 rounded-lg border border-sky-200 bg-sky-50 p-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Klub</label>
            <select value={wariantId} onChange={(e) => void zmienKlub(e.target.value)} className={selectCls}>
              {kluby.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nazwa}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Runda</label>
            <select value={regatyId} onChange={(e) => setRegatyId(e.target.value)} className={selectCls}>
              <option value="">— wybierz —</option>
              {rundy.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nazwa}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              disabled={zajety || !regatyId}
              onClick={() =>
                void dzialaj(async () => {
                  const r = await zapiszSprostowanie(w.id, {
                    wariantId: Number(wariantId),
                    regatyId: Number(regatyId),
                    notatka,
                  })
                  if (r.ok) setEdycja(false)
                  return r
                })
              }
              className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
            >
              Zapisz poprawkę
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          value={notatka}
          onChange={(e) => setNotatka(e.target.value)}
          placeholder="Notatka redaktora (np. powód odrzucenia)"
          className="min-w-[200px] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500"
        />
        {!edycja && w.status === 'nowy' && (
          <button
            type="button"
            onClick={() => void otworzEdycje()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Popraw
          </button>
        )}
        <button
          type="button"
          disabled={zajety}
          onClick={() => void dzialaj(() => rozpatrzSprostowanie(w.id, 'odrzucony', notatka))}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
        >
          Odrzuć
        </button>
        <button
          type="button"
          disabled={zajety}
          onClick={() => void dzialaj(() => rozpatrzSprostowanie(w.id, 'zaakceptowany', notatka))}
          className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50"
        >
          {zajety ? 'Chwila…' : 'Akceptuj i nanieś'}
        </button>
      </div>

      {blad && <p className="mt-2 text-sm text-red-600">{blad}</p>}
    </div>
  )
}

export default function Lista({ wnioski }: { wnioski: Wniosek[] }) {
  const [filtr, setFiltr] = useState('nowy')
  const odswiez = useCallback(() => window.location.reload(), [])

  const widoczne = wnioski.filter((w) => filtr === 'wszystkie' || w.status === filtr)
  const ile = (s: string) => wnioski.filter((w) => w.status === s).length

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          ['nowy', `Nowe (${ile('nowy')})`],
          ['zaakceptowany', `Zaakceptowane (${ile('zaakceptowany')})`],
          ['odrzucony', `Odrzucone (${ile('odrzucony')})`],
          ['wszystkie', `Wszystkie (${wnioski.length})`],
        ].map(([w, etykieta]) => (
          <button
            key={w}
            type="button"
            onClick={() => setFiltr(w)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              filtr === w ? 'border-navy bg-navy text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {etykieta}
          </button>
        ))}
      </div>

      {widoczne.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          Nie ma wniosków w tej grupie.
        </p>
      ) : (
        <div className="space-y-3">
          {widoczne.map((w) => (
            <Wiersz key={w.id} w={w} odswiez={odswiez} />
          ))}
        </div>
      )}
    </div>
  )
}
