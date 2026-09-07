'use client'
import React, { useState } from 'react'
import { IKONY_OPCJE, Ikona } from '@/components/strefa/ikony'

type Link = { label: string; url: string; ikona?: string }
type Pozycja = { czas: string; opis: string; link: string; ikona?: string }
type Dzien = { tytul: string; pozycje: Pozycja[] }

const inp = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
const sel = 'rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none focus:border-sky-500'
const btn = 'rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50'
const btnDel = 'rounded-lg border border-red-200 px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50'

export default function ProgramEditor({
  initialLinki,
  initialProgram,
}: {
  initialLinki: Link[]
  initialProgram: Dzien[]
}) {
  const [linki, setLinki] = useState<Link[]>(initialLinki.length ? initialLinki : [])
  const [program, setProgram] = useState<Dzien[]>(initialProgram.length ? initialProgram : [])

  return (
    <div className="space-y-8">
      <input type="hidden" name="linki" value={JSON.stringify(linki)} />
      <input type="hidden" name="program" value={JSON.stringify(program)} />

      {/* SZYBKIE LINKI */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Szybkie linki</h3>
          <button type="button" className={btn} onClick={() => setLinki((l) => [...l, { label: '', url: '' }])}>
            + Dodaj link
          </button>
        </div>
        <div className="space-y-2">
          {linki.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-navy">
                <Ikona name={l.ikona} />
              </span>
              <select
                className={sel}
                value={l.ikona || ''}
                onChange={(e) => setLinki((arr) => arr.map((x, j) => (j === i ? { ...x, ikona: e.target.value } : x)))}
              >
                {IKONY_OPCJE.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <input
                className={inp}
                placeholder="Etykieta (np. Lista startowa)"
                value={l.label}
                onChange={(e) => setLinki((arr) => arr.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              />
              <input
                className={inp}
                placeholder="https://…"
                value={l.url}
                onChange={(e) => setLinki((arr) => arr.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
              />
              <button type="button" className={btnDel} onClick={() => setLinki((arr) => arr.filter((_, j) => j !== i))}>
                ✕
              </button>
            </div>
          ))}
          {linki.length === 0 && <p className="text-sm text-slate-400">Brak linków — dodaj pierwszy.</p>}
        </div>
      </div>

      {/* PROGRAM WEEKENDU */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Program weekendu (dni)</h3>
          <button
            type="button"
            className={btn}
            onClick={() => setProgram((p) => [...p, { tytul: '', pozycje: [] }])}
          >
            + Dodaj dzień
          </button>
        </div>

        <div className="space-y-5">
          {program.map((d, di) => (
            <div key={di} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex gap-2">
                <input
                  className={inp}
                  placeholder="Nagłówek dnia (np. Dzień 1 – Sobota, 29 sierpnia)"
                  value={d.tytul}
                  onChange={(e) => setProgram((p) => p.map((x, j) => (j === di ? { ...x, tytul: e.target.value } : x)))}
                />
                <button type="button" className={btnDel} onClick={() => setProgram((p) => p.filter((_, j) => j !== di))}>
                  Usuń dzień
                </button>
              </div>

              <div className="space-y-2 pl-1">
                {d.pozycje.map((pz, pi) => (
                  <div key={pi} className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-navy">
                      <Ikona name={pz.ikona} />
                    </span>
                    <select
                      className={sel}
                      value={pz.ikona || ''}
                      onChange={(e) =>
                        setProgram((p) =>
                          p.map((x, j) =>
                            j === di ? { ...x, pozycje: x.pozycje.map((y, k) => (k === pi ? { ...y, ikona: e.target.value } : y)) } : x,
                          ),
                        )
                      }
                    >
                      {IKONY_OPCJE.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <input
                      className={`${inp} max-w-[130px]`}
                      placeholder="Godzina"
                      value={pz.czas}
                      onChange={(e) =>
                        setProgram((p) =>
                          p.map((x, j) =>
                            j === di ? { ...x, pozycje: x.pozycje.map((y, k) => (k === pi ? { ...y, czas: e.target.value } : y)) } : x,
                          ),
                        )
                      }
                    />
                    <input
                      className={inp}
                      placeholder="Opis (np. Wyścigi z trackingiem GPS)"
                      value={pz.opis}
                      onChange={(e) =>
                        setProgram((p) =>
                          p.map((x, j) =>
                            j === di ? { ...x, pozycje: x.pozycje.map((y, k) => (k === pi ? { ...y, opis: e.target.value } : y)) } : x,
                          ),
                        )
                      }
                    />
                    <input
                      className={`${inp} max-w-[220px]`}
                      placeholder="Link (opcjonalny)"
                      value={pz.link}
                      onChange={(e) =>
                        setProgram((p) =>
                          p.map((x, j) =>
                            j === di ? { ...x, pozycje: x.pozycje.map((y, k) => (k === pi ? { ...y, link: e.target.value } : y)) } : x,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      className={btnDel}
                      onClick={() =>
                        setProgram((p) => p.map((x, j) => (j === di ? { ...x, pozycje: x.pozycje.filter((_, k) => k !== pi) } : x)))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={btn}
                  onClick={() =>
                    setProgram((p) => p.map((x, j) => (j === di ? { ...x, pozycje: [...x.pozycje, { czas: '', opis: '', link: '' }] } : x)))
                  }
                >
                  + Dodaj punkt
                </button>
              </div>
            </div>
          ))}
          {program.length === 0 && <p className="text-sm text-slate-400">Brak dni — dodaj pierwszy dzień.</p>}
        </div>
      </div>
    </div>
  )
}
