import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { statusRegat, statusLabel } from '@/lib/kalendarz'

export const dynamic = 'force-dynamic'

function fmt(d?: string): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return ''
  }
}

export default async function KalendarzListPage() {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'kalendarz' as any, limit: 300, depth: 0, sort: 'dataOd' })
  const terminy = res.docs as any[]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kalendarz</h1>
        <Link
          href="/redaktor/kalendarz/nowy"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          + Nowy termin
        </Link>
      </div>
      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
        {terminy.length === 0 && <p className="px-4 py-4 text-sm text-slate-500">Brak terminów.</p>}
        {terminy.map((t) => {
          const s = statusRegat(t)
          return (
            <Link
              key={t.id}
              href={`/redaktor/kalendarz/${t.id}`}
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
            >
              <span className="min-w-0">
                <span className="font-medium text-slate-800">{t.nazwa}</span>
                <span className="ml-2 text-xs text-slate-400">
                  {fmt(t.dataOd)}
                  {t.miejsce ? ` · ${t.miejsce}` : ''}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    s === 'odbyly-sie'
                      ? 'bg-slate-200 text-slate-600'
                      : s === 'w-trakcie'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {statusLabel(s)}
                  {t.autoStatus === false ? ' (ręcznie)' : ''}
                </span>
                <span className="text-sky-600">Edytuj →</span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
