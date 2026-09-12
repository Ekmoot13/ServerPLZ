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
  poziomy: string[]
  idZestawienia: number | null
  trybPowiazania: 'zestawienie' | 'warianty'
  wykluczoneWarianty: number[]
  warianty: number[]
}

type Osoba = { id: string; name: string }
export type LigaKlub = { id: number; nazwa: string }
export type LigaWariant = { id: number; skrot: string; nazwa: string; idZestawienia: number }

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
  ligaWarianty,
  ok,
}: {
  id: string
  initial: KlubInitial
  zawodnicy: Osoba[]
  ligaKluby: LigaKlub[]
  ligaWarianty: LigaWariant[]
  ok?: boolean
}) {
  const [selected, setSelected] = useState<string[]>(initial.zaloga || [])
  const [q, setQ] = useState('')
  const [tryb, setTryb] = useState<'zestawienie' | 'warianty'>(initial.trybPowiazania)
  const [idZest, setIdZest] = useState<number | null>(initial.idZestawienia)
  const [qZest, setQZest] = useState('')
  const [wykluczone, setWykluczone] = useState<number[]>(initial.wykluczoneWarianty || [])
  const [warianty, setWarianty] = useState<number[]>(initial.warianty || [])
  const [qWar, setQWar] = useState('')

  const zestById = useMemo(() => {
    const m = new Map<number, string>()
    for (const k of ligaKluby) m.set(k.id, k.nazwa)
    return m
  }, [ligaKluby])

  const wariantById = useMemo(() => {
    const m = new Map<number, LigaWariant>()
    for (const w of ligaWarianty) m.set(w.id, w)
    return m
  }, [ligaWarianty])

  const wynikiZest = useMemo(() => {
    const nq = norm(qZest.trim())
    if (!nq) return []
    return ligaKluby.filter((k) => norm(k.nazwa).includes(nq) || String(k.id).includes(nq)).slice(0, 8)
  }, [qZest, ligaKluby])

  // Warianty należące do wybranego zestawienia — historyczne nazwy i zespoły klubu.
  const wariantyZestawienia = useMemo(() => {
    if (idZest == null) return []
    return ligaWarianty
      .filter((w) => w.idZestawienia === idZest)
      .sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'))
  }, [idZest, ligaWarianty])

  const wynikiWar = useMemo(() => {
    const nq = norm(qWar.trim())
    if (!nq) return []
    return ligaWarianty
      .filter(
        (w) =>
          !warianty.includes(w.id) &&
          (norm(w.nazwa).includes(nq) || norm(w.skrot).includes(nq) || String(w.id).includes(nq)),
      )
      .slice(0, 8)
  }, [qWar, ligaWarianty, warianty])

  const toggleWykluczony = (wid: number) =>
    setWykluczone((prev) => (prev.includes(wid) ? prev.filter((x) => x !== wid) : [...prev, wid]))

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
      <input type="hidden" name="trybPowiazania" value={tryb} />
      <input type="hidden" name="wykluczoneWarianty" value={JSON.stringify(wykluczone)} />
      <input type="hidden" name="warianty" value={JSON.stringify(warianty)} />

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

      {/* Poziom ligi (wyliczany) + aktywny */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Poziom ligi</label>
          <div className="flex min-h-[42px] flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            {initial.poziomy.length > 0 ? (
              initial.poziomy.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-white px-2.5 py-0.5 text-sm text-slate-700 ring-1 ring-slate-200"
                >
                  {p}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">brak — klub nie startuje w tym sezonie</span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Ustawiane w{' '}
            <Link href="/redaktor/kluby/sezon" className="text-sky-600 hover:underline">
              Kluby w sezonie
            </Link>
            , nie tutaj.
          </p>
        </div>
        <label className="flex items-start gap-2 pt-8 text-sm">
          <input type="checkbox" name="aktywny" defaultChecked={initial.aktywny} />
          Aktywny
        </label>
      </div>

      {/* Powiązanie z bazą wyników */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <h2 className="mb-1 text-sm font-semibold text-slate-800">Powiązanie z bazą wyników</h2>
        <p className="mb-3 text-xs text-slate-500">
          Decyduje, które wyniki pokazują się na profilu tego klubu na stronie.
        </p>

        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <label
            className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-sm ${
              tryb === 'zestawienie'
                ? 'border-sky-400 bg-sky-50 ring-1 ring-sky-200'
                : 'border-slate-300 bg-white'
            }`}
          >
            <input
              type="radio"
              className="mr-2"
              checked={tryb === 'zestawienie'}
              onChange={() => setTryb('zestawienie')}
            />
            <span className="font-medium">Cały klub</span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Wszystkie warianty klubu (także dawne nazwy), z możliwością wyłączenia wybranych.
            </span>
          </label>
          <label
            className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-sm ${
              tryb === 'warianty'
                ? 'border-sky-400 bg-sky-50 ring-1 ring-sky-200'
                : 'border-slate-300 bg-white'
            }`}
          >
            <input
              type="radio"
              className="mr-2"
              checked={tryb === 'warianty'}
              onChange={() => setTryb('warianty')}
            />
            <span className="font-medium">Wybrane warianty</span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Osobny zespół, np. sekcja młodzieżowa — wskazujesz konkretne warianty.
            </span>
          </label>
        </div>

        {tryb === 'zestawienie' ? (
          <>
            <label className="mb-1 block text-sm font-medium text-slate-700">Klub w bazie wyników</label>
            {idZest != null ? (
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-800 ring-1 ring-emerald-200">
                {zestById.get(idZest) || 'Nieznany klub'}{' '}
                <span className="text-emerald-600">#{idZest}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIdZest(null)
                    setWykluczone([])
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="mb-2 inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700 ring-1 ring-amber-200">
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

            {idZest != null && (
              <div className="mt-4">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Warianty tego klubu ({wariantyZestawienia.length})
                  </span>
                  <span className="text-xs text-slate-500">
                    {wykluczone.length > 0 ? `wyłączone: ${wykluczone.length}` : 'wszystkie widoczne'}
                  </span>
                </div>
                <p className="mb-2 text-xs text-slate-500">
                  Odznacz wariant, żeby jego wyniki nie liczyły się na profilu tego klubu (np. sekcja
                  młodzieżowa mająca własny wpis). Dawne nazwy klubu zostaw zaznaczone.
                </p>
                {wariantyZestawienia.length === 0 ? (
                  <p className="text-sm text-slate-400">Brak wariantów w bazie wyników.</p>
                ) : (
                  <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    {wariantyZestawienia.map((w) => {
                      const off = wykluczone.includes(w.id)
                      return (
                        <li key={w.id}>
                          <label className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50">
                            <input
                              type="checkbox"
                              checked={!off}
                              onChange={() => toggleWykluczony(w.id)}
                            />
                            <span className={off ? 'text-slate-400 line-through' : 'text-slate-800'}>
                              {w.nazwa}
                            </span>
                            {w.skrot && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                                {w.skrot}
                              </span>
                            )}
                            <span className="ml-auto text-xs text-slate-400">#{w.id}</span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}
          </>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Warianty tego zespołu</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {warianty.length === 0 && (
                <span className="text-sm text-slate-400">Brak — dodaj warianty z bazy wyników.</span>
              )}
              {warianty.map((wid) => {
                const w = wariantById.get(wid)
                return (
                  <span
                    key={wid}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-800 ring-1 ring-emerald-200"
                  >
                    {w ? w.nazwa : `#${wid}`}
                    <span className="text-emerald-600">#{wid}</span>
                    <button
                      type="button"
                      onClick={() => setWarianty((prev) => prev.filter((x) => x !== wid))}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                )
              })}
            </div>
            <div className="relative">
              <input
                value={qWar}
                onChange={(e) => setQWar(e.target.value)}
                placeholder="Wpisz nazwę lub skrót wariantu, aby dodać…"
                className={inputCls}
              />
              {wynikiWar.length > 0 && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow">
                  {wynikiWar.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => {
                        setWarianty((prev) => (prev.includes(w.id) ? prev : [...prev, w.id]))
                        setQWar('')
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      {w.nazwa}
                      {w.skrot && <span className="ml-2 text-slate-400">{w.skrot}</span>}
                      <span className="ml-2 text-slate-400">#{w.id}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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
