'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { updateKlub } from '../../actions'

export type KlubInitial = {
  nazwa: string
  aktywny: boolean
  poziomLigi: string
  logoUrl?: string
  www: string
  facebook: string
  instagram: string
  youtube: string
  zaloga: string[]
}

type Osoba = { id: string; name: string }

function norm(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l')
}

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

export default function KlubForm({
  id,
  initial,
  zawodnicy,
  ok,
}: {
  id: string
  initial: KlubInitial
  zawodnicy: Osoba[]
  ok?: boolean
}) {
  const [selected, setSelected] = useState<string[]>(initial.zaloga || [])
  const [q, setQ] = useState('')

  const nameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const z of zawodnicy) m.set(z.id, z.name)
    return m
  }, [zawodnicy])

  const wyniki = useMemo(() => {
    const nq = norm(q.trim())
    if (!nq) return []
    return zawodnicy
      .filter((z) => !selected.includes(z.id) && norm(z.name).includes(nq))
      .slice(0, 8)
  }, [q, zawodnicy, selected])

  const add = (zid: string) => {
    setSelected((prev) => (prev.includes(zid) ? prev : [...prev, zid]))
    setQ('')
  }
  const remove = (zid: string) => setSelected((prev) => prev.filter((x) => x !== zid))

  return (
    <form action={updateKlub} className="space-y-6">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="zaloga" value={JSON.stringify(selected)} />

      {ok && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          Zapisano zmiany.
        </div>
      )}

      {/* Logo */}
      <div className="flex items-center gap-4">
        {initial.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initial.logoUrl} alt="" className="h-24 w-24 rounded-lg border border-slate-200 bg-white object-contain p-1" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
            brak
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Logo / zdjęcie (podmień)</label>
          <input type="file" name="logo" accept="image/*" className="text-sm" />
        </div>
      </div>

      {/* Nazwa */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Nazwa</label>
        <input name="nazwa" defaultValue={initial.nazwa} className={inputCls} />
      </div>

      {/* Poziom ligi + aktywny */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Poziom ligi</label>
          <select name="poziomLigi" defaultValue={initial.poziomLigi} className={inputCls}>
            <option value="">— brak —</option>
            <option value="Ekstraklasa">Ekstraklasa</option>
            <option value="1 Liga">1 Liga</option>
            <option value="2 Liga">2 Liga</option>
            <option value="Młodzieżowa">Młodzieżowa</option>
          </select>
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" name="aktywny" defaultChecked={initial.aktywny} />
          Aktywny
        </label>
      </div>

      {/* Linki */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Strona WWW</label>
          <input name="www" defaultValue={initial.www} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Facebook</label>
          <input name="facebook" defaultValue={initial.facebook} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Instagram</label>
          <input name="instagram" defaultValue={initial.instagram} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">YouTube</label>
          <input name="youtube" defaultValue={initial.youtube} className={inputCls} />
        </div>
      </div>

      {/* Załoga */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Załoga (aktualna)</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {selected.length === 0 && <span className="text-sm text-slate-400">Brak — dodaj zawodników.</span>}
          {selected.map((zid) => (
            <span key={zid} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
              {nameById.get(zid) || `#${zid}`}
              <button type="button" onClick={() => remove(zid)} className="text-red-600 hover:text-red-700">
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Wpisz nazwisko, aby dodać…"
            className={inputCls}
          />
          {wyniki.length > 0 && (
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
              {wyniki.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => add(z.id)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  {z.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-200 pt-5">
        <button type="submit" className="rounded-lg bg-sky-600 px-5 py-2 font-medium text-white hover:bg-sky-500">
          Zapisz
        </button>
        <Link href="/redaktor/kluby" className="text-sm text-slate-500 hover:underline">
          ← Wróć do listy
        </Link>
      </div>
    </form>
  )
}
