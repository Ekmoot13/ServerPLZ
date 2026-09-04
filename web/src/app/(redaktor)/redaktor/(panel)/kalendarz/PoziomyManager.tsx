'use client'
import React, { useState } from 'react'
import { updatePoziomyKalendarza } from '../../actions'

// Edytor kolejności poziomów (lig) — ↑/↓, usuwanie, dodawanie.
// Zapisuje całą listę jako JSON do server action.
export default function PoziomyManager({ initial, ok }: { initial: string[]; ok?: boolean }) {
  const [items, setItems] = useState<string[]>(initial)
  const [nowy, setNowy] = useState('')

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = items.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    setItems(next)
  }
  const remove = (i: number) => setItems(items.filter((_, k) => k !== i))
  const add = () => {
    const v = nowy.trim()
    if (!v || items.includes(v)) {
      setNowy('')
      return
    }
    setItems([...items, v])
    setNowy('')
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Kolejność poziomów na stronie</h2>
        {ok && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Zapisano</span>
        )}
      </div>
      <p className="mb-3 text-xs text-slate-500">
        Ustaw, w jakiej kolejności poziomy (ligi) mają się wyświetlać na stronie kalendarza.
        Poziomy spoza listy pokażą się na końcu.
      </p>

      <ul className="mb-3 space-y-1.5">
        {items.length === 0 && (
          <li className="text-sm text-slate-400">Brak poziomów — dodaj poniżej.</li>
        )}
        {items.map((p, i) => (
          <li
            key={p}
            className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5"
          >
            <span className="flex items-center gap-2 text-sm text-slate-800">
              <span className="w-5 text-right text-xs text-slate-400">{i + 1}.</span>
              {p}
            </span>
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded px-2 py-0.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                title="W górę"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="rounded px-2 py-0.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                title="W dół"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded px-2 py-0.5 text-red-500 hover:bg-red-50"
                title="Usuń z listy"
              >
                ✕
              </button>
            </span>
          </li>
        ))}
      </ul>

      <div className="mb-4 flex gap-2">
        <input
          value={nowy}
          onChange={(e) => setNowy(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder="Dodaj poziom (np. 2 Liga)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Dodaj
        </button>
      </div>

      <form action={updatePoziomyKalendarza}>
        <input type="hidden" name="poziomy" value={JSON.stringify(items)} />
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          Zapisz kolejność
        </button>
      </form>
    </div>
  )
}
