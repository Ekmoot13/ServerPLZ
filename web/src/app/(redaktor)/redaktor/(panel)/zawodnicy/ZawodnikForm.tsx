'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { updateZawodnik } from '../../actions'

type Start = { rok?: number; regaty?: string; miasto?: string; klub?: string; miejsce?: number }

export type ZawodnikInitial = {
  imie: string
  nazwisko: string
  aktywny: boolean
  klubId: string
  zdjecieUrl?: string
  dodatkoweStarty: Start[]
}

export default function ZawodnikForm({
  id,
  initial,
  kluby,
  ok,
}: {
  id: string
  initial: ZawodnikInitial
  kluby: { id: string; nazwa: string }[]
  ok?: boolean
}) {
  const [starty, setStarty] = useState<Start[]>(initial.dodatkoweStarty || [])

  const setRow = (i: number, patch: Partial<Start>) =>
    setStarty((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  const addRow = () => setStarty((prev) => [...prev, {}])
  const delRow = (i: number) => setStarty((prev) => prev.filter((_, idx) => idx !== i))

  const inputCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

  return (
    <form action={updateZawodnik} className="space-y-6">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dodatkoweStarty" value={JSON.stringify(starty)} />

      {ok && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          Zapisano zmiany.
        </div>
      )}

      {/* Zdjęcie */}
      <div className="flex items-center gap-4">
        {initial.zdjecieUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initial.zdjecieUrl} alt="" className="h-24 w-24 rounded-lg object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
            brak
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Zdjęcie (podmień)</label>
          <input type="file" name="zdjecie" accept="image/*" className="text-sm" />
        </div>
      </div>

      {/* Imię / nazwisko */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Imię</label>
          <input name="imie" defaultValue={initial.imie} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nazwisko</label>
          <input name="nazwisko" defaultValue={initial.nazwisko} className={inputCls} />
        </div>
      </div>

      {/* Klub */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Klub (obecny)</label>
        <select name="klub" defaultValue={initial.klubId} className={inputCls}>
          <option value="">— brak —</option>
          {kluby.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nazwa}
            </option>
          ))}
        </select>
      </div>

      {/* Aktywny */}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="aktywny" defaultChecked={initial.aktywny} />
        Aktywny
      </label>

      {/* Ręczne starty */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Ręczne starty (dodatkowe regaty)</label>
          <button type="button" onClick={addRow} className="text-sm font-medium text-sky-600 hover:underline">
            + dodaj start
          </button>
        </div>
        <div className="space-y-3">
          {starty.length === 0 && <p className="text-sm text-slate-400">Brak — dodaj ręczny start.</p>}
          {starty.map((s, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-6">
              <input
                type="number"
                placeholder="Rok"
                value={s.rok ?? ''}
                onChange={(e) => setRow(i, { rok: e.target.value ? Number(e.target.value) : undefined })}
                className={inputCls}
              />
              <input
                placeholder="Regaty"
                value={s.regaty ?? ''}
                onChange={(e) => setRow(i, { regaty: e.target.value })}
                className={`${inputCls} col-span-2`}
              />
              <input
                placeholder="Miasto"
                value={s.miasto ?? ''}
                onChange={(e) => setRow(i, { miasto: e.target.value })}
                className={inputCls}
              />
              <input
                placeholder="Klub"
                value={s.klub ?? ''}
                onChange={(e) => setRow(i, { klub: e.target.value })}
                className={inputCls}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Miejsce"
                  value={s.miejsce ?? ''}
                  onChange={(e) => setRow(i, { miejsce: e.target.value ? Number(e.target.value) : undefined })}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => delRow(i)}
                  className="shrink-0 rounded-lg border border-slate-300 px-2 text-sm text-red-600 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-200 pt-5">
        <button type="submit" className="rounded-lg bg-sky-600 px-5 py-2 font-medium text-white hover:bg-sky-500">
          Zapisz
        </button>
        <Link href="/redaktor/zawodnicy" className="text-sm text-slate-500 hover:underline">
          ← Wróć do listy
        </Link>
      </div>
    </form>
  )
}
