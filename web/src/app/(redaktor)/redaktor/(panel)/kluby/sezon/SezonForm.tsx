'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { zapiszPrzypisaniaSezonu } from '../../../actions'

export type ZespolSezonu = {
  poziom: string // etykieta (Młodzieżowa)
  poziomRaw: string // klucz w bazie (Youth)
  miejsce: number
  nazwa: string
  warianty: number[]
  klubMatka: string
}
export type GrupaSezonu = { poziom: string; poziomRaw: string; rok: number; zespoly: ZespolSezonu[] }
export type KlubOpcja = { id: string; nazwa: string }

function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// Klucz wiersza: poziom z bazy + pierwszy wariant zespołu.
const kluczOf = (g: GrupaSezonu, z: ZespolSezonu) => `${g.poziomRaw}|${z.warianty[0]}`

export default function SezonForm({
  grupy,
  kluby,
  poczatkowe,
  ok,
}: {
  grupy: GrupaSezonu[]
  kluby: KlubOpcja[]
  poczatkowe: Record<string, string>
  ok?: boolean
}) {
  const [wybory, setWybory] = useState<Record<string, string>>(poczatkowe)

  const indeksKlubow = useMemo(
    () => kluby.map((k) => ({ ...k, klucz: norm(k.nazwa) })),
    [kluby],
  )

  const przypisania = useMemo(() => {
    const out: { poziom: string; wariant: number; klubId: string | null }[] = []
    for (const g of grupy) {
      for (const z of g.zespoly) {
        const klubId = wybory[kluczOf(g, z)] || null
        // Zespół może mieć kilka wariantów (dawne nazwy) — przypisujemy wszystkie.
        for (const w of z.warianty) out.push({ poziom: g.poziomRaw, wariant: w, klubId })
      }
    }
    return out
  }, [grupy, wybory])

  const poziomy = useMemo(() => grupy.map((g) => g.poziomRaw), [grupy])

  const dopasujAutomatycznie = () => {
    const nowe = { ...wybory }
    for (const g of grupy) {
      for (const z of g.zespoly) {
        const k = kluczOf(g, z)
        if (nowe[k]) continue // ręcznych wyborów nie ruszamy
        const n = norm(z.nazwa)
        const trafienie =
          indeksKlubow.find((x) => x.klucz === n) ||
          indeksKlubow.find((x) => x.klucz.includes(n) || n.includes(x.klucz))
        if (trafienie) nowe[k] = trafienie.id
      }
    }
    setWybory(nowe)
  }

  const wyczysc = () => setWybory({})

  const brakujace = przypisania.filter((p) => !p.klubId).length
  const razem = grupy.reduce((n, g) => n + g.zespoly.length, 0)
  const przypisane = grupy.reduce(
    (n, g) => n + g.zespoly.filter((z) => wybory[kluczOf(g, z)]).length,
    0,
  )

  return (
    <form action={zapiszPrzypisaniaSezonu}>
      <input type="hidden" name="przypisania" value={JSON.stringify(przypisania)} />
      <input type="hidden" name="poziomy" value={JSON.stringify(poziomy)} />

      {ok && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          Zapisano przypisania.
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-sm text-slate-600">
          Przypisano <strong>{przypisane}</strong> z <strong>{razem}</strong> zespołów
          {brakujace > 0 && <span className="text-amber-700"> — reszta nie pokaże się jako klub</span>}
        </span>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={dopasujAutomatycznie}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Dopasuj po nazwie
          </button>
          <button
            type="button"
            onClick={wyczysc}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
          >
            Wyczyść
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {grupy.map((g) => (
          <section key={g.poziomRaw}>
            <h2 className="mb-1 text-lg font-bold uppercase tracking-wide text-slate-800">
              {g.poziom}
            </h2>
            <p className="mb-3 text-xs text-slate-500">
              Sezon {g.rok} — {g.zespoly.length} zespołów w rozgrywkach
            </p>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="grid grid-cols-[3rem_1fr_1fr] gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase text-slate-500">
                <span>M-ce</span>
                <span>Zespół w bazie wyników</span>
                <span>Klub w panelu (wyświetlany)</span>
              </div>
              {g.zespoly.map((z) => {
                const k = kluczOf(g, z)
                const wybrany = wybory[k] || ''
                return (
                  <div
                    key={k}
                    className="grid grid-cols-[3rem_1fr_1fr] items-center gap-3 border-b border-slate-100 px-3 py-2 last:border-b-0"
                  >
                    <span className="text-sm font-semibold text-slate-500">{z.miejsce}</span>
                    <span className="text-sm">
                      <span className="font-medium text-slate-800">{z.nazwa}</span>
                      {z.klubMatka && z.klubMatka !== z.nazwa && (
                        <span className="block text-xs text-slate-400">klub: {z.klubMatka}</span>
                      )}
                    </span>
                    <select
                      value={wybrany}
                      onChange={(e) => setWybory((p) => ({ ...p, [k]: e.target.value }))}
                      className={`w-full rounded-lg border px-2 py-1.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 ${
                        wybrany ? 'border-slate-300' : 'border-amber-300 bg-amber-50'
                      }`}
                    >
                      <option value="">— nie pokazuj —</option>
                      {kluby.map((kl) => (
                        <option key={kl.id} value={kl.id}>
                          {kl.nazwa}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-5 py-2 font-medium text-white hover:bg-sky-500"
        >
          Zapisz przypisania
        </button>
        <Link href="/redaktor/kluby" className="text-sm text-slate-500 hover:underline">
          ← Wróć do listy klubów
        </Link>
      </div>
    </form>
  )
}
