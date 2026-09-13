'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'

export type KlubKarta = { nazwa: string; slug: string; miejsce: number; foto: string | null; logo: string | null }
export type Grupa = { poziom: string; kluby: KlubKarta[] }
export type Zawodnik = { imie: string; nazwisko: string; slug: string }
export type KlubProsty = { nazwa: string; slug: string }

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

function norm(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l')
}

// Układ rzędów per liga (wg ustaleń). rows = rozmiary rzędów, relegacja = ile ostatnich to strefa spadkowa, awans = ile miejsc awansuje (podświetlenie).
const CONF: { test: RegExp; rows: number[]; relegacja: number; awans: number }[] = [
  { test: /ekstraklasa/i, rows: [3, 4, 4, 5, 4], relegacja: 4, awans: 0 },
  { test: /1\s*liga|i\s*liga/i, rows: [4, 4, 4, 3, 5], relegacja: 5, awans: 1 },
  { test: /m[łl]odzie/i, rows: [3, 4, 4, 4, 5], relegacja: 0, awans: 0 },
]
function confFor(poziom: string) {
  return CONF.find((c) => c.test.test(poziom)) || { rows: [4, 4, 4, 4, 4], relegacja: 0, awans: 0 }
}

function chunk(items: KlubKarta[], rows: number[]): KlubKarta[][] {
  const out: KlubKarta[][] = []
  let i = 0
  let ri = 0
  while (i < items.length) {
    const size = rows[Math.min(ri, rows.length - 1)]
    out.push(items.slice(i, i + size))
    i += size
    ri++
  }
  return out
}

function Karta({ k, total, awans, relegacja }: { k: KlubKarta; total: number; awans: number; relegacja: number }) {
  const podium = k.miejsce <= 3
  const isAwans = awans > 0 && k.miejsce > 3 && k.miejsce <= 3 + awans
  const isSpadek = relegacja > 0 && k.miejsce > total - relegacja
  const pasek = podium
    ? k.miejsce === 1
      ? 'from-yellow-400 to-amber-500'
      : k.miejsce === 2
        ? 'from-slate-300 to-slate-400'
        : 'from-amber-600 to-amber-700'
    : isAwans
      ? 'from-emerald-400 to-emerald-600'
      : isSpadek
        ? 'from-red-500 to-red-700'
        : 'from-navy to-navy'
  const medal = k.miejsce === 1 ? '🥇' : k.miejsce === 2 ? '🥈' : k.miejsce === 3 ? '🥉' : ''

  return (
    <Link href={`/kluby/${k.slug}`} className="group block w-[240px] max-w-full">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className={`h-1.5 w-full bg-gradient-to-r ${pasek}`} />
        {/* ZDJĘCIE + NAZWA */}
        <div className="relative h-40 bg-navy">
          {k.foto && <Img src={k.foto} className="h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-navy/55" />
          <span className="absolute left-2 top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-white/90 px-1.5 text-sm font-extrabold text-navy">
            {medal || k.miejsce}
          </span>
          {isAwans && (
            <span className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Awans
            </span>
          )}
          {isSpadek && (
            <span className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Spadek
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 p-3 text-center">
            <span className="text-sm font-bold leading-tight text-white drop-shadow">{k.nazwa}</span>
          </div>
        </div>
        {/* LOGO */}
        <div className="flex h-20 items-center justify-center p-2">
          {k.logo ? (
            <Img src={k.logo} className="max-h-16 w-auto object-contain" />
          ) : (
            <span className="text-xs text-slate-400">{k.nazwa}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

function Szukajka({
  placeholder,
  wyniki,
}: {
  placeholder: string
  wyniki: (q: string) => { label: string; href: string }[]
}) {
  const [q, setQ] = useState('')
  const res = q.trim() ? wyniki(q) : []
  return (
    <div className="relative w-full max-w-md">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border-2 border-navy/15 px-4 py-3 text-navy outline-none focus:border-navy"
      />
      {res.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
          {res.map((r, i) => (
            <Link
              key={i}
              href={r.href}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-red"
              onClick={() => setQ('')}
            >
              {r.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ZespolyWidok({
  grupy,
  zawodnicy,
  kluby,
}: {
  grupy: Grupa[]
  zawodnicy: Zawodnik[]
  kluby: KlubProsty[]
}) {
  const szukajZawodnika = useMemo(
    () => (q: string) => {
      const nq = norm(q.trim())
      return zawodnicy
        .filter((z) => norm(`${z.imie} ${z.nazwisko}`).includes(nq))
        .slice(0, 8)
        .map((z) => ({ label: `${z.imie} ${z.nazwisko}`, href: `/zawodnicy/${z.slug}` }))
    },
    [zawodnicy],
  )
  const szukajKlubu = useMemo(
    () => (q: string) => {
      const nq = norm(q.trim())
      return kluby
        .filter((k) => norm(k.nazwa).includes(nq))
        .slice(0, 8)
        .map((k) => ({ label: k.nazwa, href: `/kluby/${k.slug}` }))
    },
    [kluby],
  )

  return (
    <div>
      {/* WYSZUKIWARKI */}
      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <div className="text-center">
          <h2 className="text-xl font-extrabold uppercase tracking-wide text-navy">Wyszukaj zawodnika</h2>
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-brand-red" />
          <div className="mt-4 flex justify-center">
            <Szukajka placeholder="Wpisz imię lub nazwisko zawodnika…" wyniki={szukajZawodnika} />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-extrabold uppercase tracking-wide text-navy">Wyszukaj klub</h2>
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-brand-red" />
          <div className="mt-4 flex justify-center">
            <Szukajka placeholder="Wpisz nazwę klubu…" wyniki={szukajKlubu} />
          </div>
        </div>
      </div>

      {/* LIGI */}
      <div className="space-y-16">
        {grupy.map((g) => {
          const conf = confFor(g.poziom)
          const total = g.kluby.length
          const relegStart = conf.relegacja > 0 ? total - conf.relegacja : Infinity
          const chunks = chunk(g.kluby, conf.rows)
          return (
            <div key={g.poziom}>
              <div className="mb-8 text-center">
                <h2 className="inline-block text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">
                  {g.poziom}
                </h2>
                <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-brand-red" />
              </div>

              <div className="space-y-6">
                {chunks.map((row, ri) => {
                  const firstMiejsce = row[0]?.miejsce ?? 0
                  const pokazSpadek = conf.relegacja > 0 && firstMiejsce > relegStart
                  return (
                    <div key={ri}>
                      {pokazSpadek && (
                        <p className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-red-600">
                          Strefa spadkowa
                        </p>
                      )}
                      <div className="flex flex-wrap justify-center gap-5">
                        {row.map((k) => (
                          <Karta key={k.slug} k={k} total={total} awans={conf.awans} relegacja={conf.relegacja} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
