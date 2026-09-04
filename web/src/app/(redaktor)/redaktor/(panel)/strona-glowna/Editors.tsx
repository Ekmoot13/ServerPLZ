'use client'
import React, { useState } from 'react'

const inp =
  'w-full rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200'

function moveArr<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir
  if (j < 0 || j >= arr.length) return arr
  const next = arr.slice()
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

// eslint-disable-next-line @next/next/no-img-element
const Prev = ({ src }: { src?: string }) =>
  src ? <img src={src} alt="" className="max-h-10 w-auto rounded border border-slate-200 bg-white object-contain p-0.5" /> : null

// ---------- Edytor linków {label,url} ----------
export function LinkListEditor({ name, initial }: { name: string; initial: any[] }) {
  const [rows, setRows] = useState<any[]>(initial || [])
  const set = (i: number, k: string, v: string) => setRows(rows.map((r, x) => (x === i ? { ...r, [k]: v } : r)))
  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input className={inp} placeholder="Nazwa" value={r.label || ''} onChange={(e) => set(i, 'label', e.target.value)} />
          <input className={inp} placeholder="URL" value={r.url || ''} onChange={(e) => set(i, 'url', e.target.value)} />
          <button type="button" onClick={() => setRows(moveArr(rows, i, -1))} className="px-1 text-slate-400 hover:text-slate-700">↑</button>
          <button type="button" onClick={() => setRows(moveArr(rows, i, 1))} className="px-1 text-slate-400 hover:text-slate-700">↓</button>
          <button type="button" onClick={() => setRows(rows.filter((_, x) => x !== i))} className="px-1 text-red-500 hover:text-red-700">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => setRows([...rows, { label: '', url: '' }])} className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50">
        + Dodaj link
      </button>
    </div>
  )
}

// ---------- Edytor grup logotypów [{kategoria, loga:[{logoUrl,link,nazwa}]}] ----------
export function GrupyEditor({ name, initial }: { name: string; initial: any[] }) {
  const [grupy, setGrupy] = useState<any[]>(initial || [])

  const updateGrupa = (gi: number, patch: any) => setGrupy(grupy.map((g, x) => (x === gi ? { ...g, ...patch } : g)))
  const updateLogo = (gi: number, li: number, k: string, v: string) =>
    setGrupy(grupy.map((g, x) => (x === gi ? { ...g, loga: (g.loga || []).map((l: any, y: number) => (y === li ? { ...l, [k]: v } : l)) } : g)))
  const addLogo = (gi: number) => updateGrupa(gi, { loga: [...(grupy[gi].loga || []), { logoUrl: '', link: '', nazwa: '' }] })
  const delLogo = (gi: number, li: number) => updateGrupa(gi, { loga: (grupy[gi].loga || []).filter((_: any, y: number) => y !== li) })
  const moveLogo = (gi: number, li: number, dir: -1 | 1) => updateGrupa(gi, { loga: moveArr(grupy[gi].loga || [], li, dir) })

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(grupy)} />
      {grupy.map((g, gi) => (
        <div key={gi} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <input
              className={inp + ' font-semibold'}
              placeholder="Nazwa kategorii"
              value={g.kategoria || ''}
              onChange={(e) => updateGrupa(gi, { kategoria: e.target.value })}
            />
            <button type="button" onClick={() => setGrupy(moveArr(grupy, gi, -1))} className="px-1 text-slate-400 hover:text-slate-700">↑</button>
            <button type="button" onClick={() => setGrupy(moveArr(grupy, gi, 1))} className="px-1 text-slate-400 hover:text-slate-700">↓</button>
            <button type="button" onClick={() => setGrupy(grupy.filter((_, x) => x !== gi))} className="whitespace-nowrap rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50">
              usuń grupę
            </button>
          </div>
          <div className="space-y-2">
            {(g.loga || []).map((l: any, li: number) => (
              <div key={li} className="flex items-center gap-2 rounded border border-slate-200 bg-white px-2 py-1">
                <Prev src={l.logoUrl} />
                <input className={inp} placeholder="URL logo" value={l.logoUrl || ''} onChange={(e) => updateLogo(gi, li, 'logoUrl', e.target.value)} />
                <input className={inp} placeholder="Link" value={l.link || ''} onChange={(e) => updateLogo(gi, li, 'link', e.target.value)} />
                <input className={inp + ' max-w-[120px]'} placeholder="Nazwa" value={l.nazwa || ''} onChange={(e) => updateLogo(gi, li, 'nazwa', e.target.value)} />
                <button type="button" onClick={() => moveLogo(gi, li, -1)} className="px-1 text-slate-400 hover:text-slate-700">↑</button>
                <button type="button" onClick={() => moveLogo(gi, li, 1)} className="px-1 text-slate-400 hover:text-slate-700">↓</button>
                <button type="button" onClick={() => delLogo(gi, li)} className="px-1 text-red-500 hover:text-red-700">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => addLogo(gi)} className="rounded border border-slate-300 bg-white px-3 py-1 text-xs hover:bg-slate-50">
              + Dodaj logo
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setGrupy([...grupy, { kategoria: '', loga: [] }])}
        className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
      >
        + Dodaj kategorię
      </button>
    </div>
  )
}

// ---------- Edytor lig zgłoszeń ----------
export function ZgloszeniaEditor({ name, initial }: { name: string; initial: any[] }) {
  const [rows, setRows] = useState<any[]>(initial || [])
  const set = (i: number, k: string, v: string) => setRows(rows.map((r, x) => (x === i ? { ...r, [k]: v } : r)))
  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      {rows.map((r, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Prev src={r.logoUrl} />
            <input className={inp + ' font-semibold'} placeholder="Nazwa ligi" value={r.nazwa || ''} onChange={(e) => set(i, 'nazwa', e.target.value)} />
            <button type="button" onClick={() => setRows(moveArr(rows, i, -1))} className="px-1 text-slate-400 hover:text-slate-700">↑</button>
            <button type="button" onClick={() => setRows(moveArr(rows, i, 1))} className="px-1 text-slate-400 hover:text-slate-700">↓</button>
            <button type="button" onClick={() => setRows(rows.filter((_, x) => x !== i))} className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50">usuń</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={inp} placeholder="URL logo" value={r.logoUrl || ''} onChange={(e) => set(i, 'logoUrl', e.target.value)} />
            <input className={inp} placeholder="Link „Dowiedz się więcej”" value={r.wiecejLink || ''} onChange={(e) => set(i, 'wiecejLink', e.target.value)} />
            <input className={inp} placeholder="Link „Wyślij zgłoszenie” (mailto:…)" value={r.wyslijLink || ''} onChange={(e) => set(i, 'wyslijLink', e.target.value)} />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setRows([...rows, { nazwa: '', logoUrl: '', wiecejLink: '', wyslijLink: '' }])} className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50">
        + Dodaj ligę
      </button>
    </div>
  )
}
