'use client'
import React from 'react'
import Link from 'next/link'
import { deleteTermin } from '../../actions'

export type TerminInitial = {
  nazwa: string
  poziom: string
  miejsce: string
  dataOd: string // ISO lub ''
  dataDo: string
  link: string
  autoStatus: boolean
  statusReczny: string
  kolejnosc: string
}

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

function dOnly(iso: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

export default function TerminForm({
  action,
  id,
  initial,
  ok,
}: {
  action: (formData: FormData) => void | Promise<void>
  id?: string
  initial: TerminInitial
  ok?: boolean
}) {
  return (
    <div className="max-w-2xl">
      <form action={action} className="space-y-5">
        {id && <input type="hidden" name="id" value={id} />}

        {ok && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            Zapisano.
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nazwa regat</label>
          <input name="nazwa" defaultValue={initial.nazwa} required className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Poziom ligi</label>
            <select name="poziom" defaultValue={initial.poziom} className={inputCls}>
              <option value="">—</option>
              <option value="Ekstraklasa">Ekstraklasa</option>
              <option value="1 Liga">1 Liga</option>
              <option value="2 Liga">2 Liga</option>
              <option value="Młodzieżowa">Młodzieżowa</option>
              <option value="Inne">Inne</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Miejsce (miasto)</label>
            <input name="miejsce" defaultValue={initial.miejsce} className={inputCls} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Data od</label>
            <input type="date" name="dataOd" defaultValue={dOnly(initial.dataOd)} required className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Data do (opcjonalnie)</label>
            <input type="date" name="dataDo" defaultValue={dOnly(initial.dataDo)} className={inputCls} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Link (opcjonalnie)</label>
          <input name="link" defaultValue={initial.link} placeholder="np. link do wyników / śledzenia" className={inputCls} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="autoStatus" defaultChecked={initial.autoStatus} />
          Automatyczne przełączanie statusu wg daty (zaplanowane → w trakcie → odbyły się)
        </label>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status ręczny (używany, gdy automat wyłączony)
          </label>
          <select name="statusReczny" defaultValue={initial.statusReczny || 'zaplanowane'} className={inputCls}>
            <option value="zaplanowane">Zaplanowane</option>
            <option value="w-trakcie">W trakcie</option>
            <option value="odbyly-sie">Odbyły się</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Kolejność (opcjonalnie)</label>
          <input type="number" name="kolejnosc" defaultValue={initial.kolejnosc} className={inputCls} />
        </div>

        <div className="flex items-center gap-3 border-t border-slate-200 pt-5">
          <button type="submit" className="rounded-lg bg-sky-600 px-5 py-2 font-medium text-white hover:bg-sky-500">
            Zapisz
          </button>
          <Link href="/redaktor/kalendarz" className="text-sm text-slate-500 hover:underline">
            ← Wróć do listy
          </Link>
        </div>
      </form>

      {id && (
        <form action={deleteTermin} className="mt-4">
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Usuń termin
          </button>
        </form>
      )}
    </div>
  )
}
