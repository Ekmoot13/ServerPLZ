'use client'
import React, { useState } from 'react'
import Link from 'next/link'

export type TableCell = { value: string; place?: number | null; href?: string }

function medal(place?: number | null): string {
  if (place === 1) return '🥇 '
  if (place === 2) return '🥈 '
  if (place === 3) return '🥉 '
  return ''
}

export default function MoreTable({
  headers,
  rows,
  limit = 3,
}: {
  headers: string[]
  rows: TableCell[][]
  limit?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = rows.length > limit
  const visible = expanded ? rows : rows.slice(0, limit)

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="bg-navy text-left text-white">
              {headers.map((h) => (
                <th key={h} className="px-4 py-2.5 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                {row.map((cell, j) => {
                  const isTop3 = cell.place != null && cell.place <= 3
                  return (
                    <td
                      key={j}
                      className={`px-4 py-2 ${isTop3 ? 'font-semibold text-navy' : 'text-slate-700'}`}
                    >
                      {medal(cell.place)}
                      {cell.href ? (
                        <Link href={cell.href} className="text-navy hover:text-brand-red">
                          {cell.value}
                        </Link>
                      ) : (
                        cell.value
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-block rounded-[10px] border-2 border-navy px-4 py-2 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
        >
          {expanded ? 'Pokaż mniej' : `Pokaż więcej (${rows.length - limit})`}
        </button>
      )}
    </div>
  )
}
