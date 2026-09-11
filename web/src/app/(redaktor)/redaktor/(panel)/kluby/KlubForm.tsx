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
  idZestawienia: number | null
}

type Osoba = { id: string; name: string }
export type LigaKlub = { id: number; nazwa: string }

function norm(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l')
}

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

export default function KlubForm({
  id,
  initial,
  zawodnicy,
  ligaKluby,
  ok,
}: {
  id: string
  initial: KlubInitial
  zawodnicy: Osoba[]
  ligaKluby: LigaKlub[]
  ok?: boolean
}) {
  const [selected, setSelected] = useState<string[]>(initial.zaloga || [])
  const [q, setQ] = useState('')
  const [idZest, setIdZest] = useState<number | null>(initial.idZestawienia)
  const [qZest, setQZest] = useState('')

  const zestById = useMemo(() => {
    const m = new Map<number, string>()
    for (const k of ligaKluby) m.set(k.id, k.nazwa)
    return m
  }, [ligaKluby])

  const wynikiZest = useMemo(() => {
    const nq = norm(qZest.trim())
    if (!nq) return []
    return ligaKluby.filter((k) => norm(k.nazwa).includes(nq) || String(k.id).includes(nq)).slice(0, 8)
  }, [qZest, ligaKluby])

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
      <input type="hidden" name="idZestawienia" value={idZest == null ? '' : String(idZest)} />

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

      {/* Powiązanie z bazą wyników */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Klub w bazie wyników (ID zestawienia)
        </label>
        <p className="mb-2 text-xs text-slate-500">
          Łączy ten wpis z wynikami i profilem klubu na stronie. Zespoły młodzieżowe będące sekcją
          klubu-matki (np. Yacht Club Gdańsk Cadetti) zostaw bez powiązania — profil na stronie ma
          klub-matka.
        </p>
        {idZest != null ? (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-800 ring-1 ring-emerald-200">
            {zestById.get(idZest) || 'Nieznany klub'} <span className="text-emerald-600">#{idZest}</span>
            <button type="button" onClick={() => setIdZest(null)} className="text-red-600 hover:text-red-700">
              ✕
            </button>
          </div>
        ) : (
          <div className="mb-2 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">
            Brak powiązania
          </div>
        )}
        <div className="relative">
          <input
            value={qZest}
            onChange={(e) => setQZest(e.target.value)}
            placeholder="Wpisz nazwę klubu z bazy wyników, aby powiązać…"
            className={inputCls}
          />
          {wynikiZest.length > 0 && (
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
              {wynikiZest.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => {
                    setIdZest(k.id)
                    setQZest('')
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  {k.nazwa} <span className="text-slate-400">#{k.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>
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
