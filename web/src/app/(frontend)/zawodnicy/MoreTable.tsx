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
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-slate-600">
              {headers.map((h) => (
                <th key={h} className="px-4 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i} className="border-t border-slate-100">
                {row.map((cell, j) => {
                  const isTop3 = cell.place != null && cell.place <= 3
                  return (
                    <td
                      key={j}
                      className={`px-4 py-2 ${isTop3 ? 'font-semibold text-sky-800' : 'text-slate-700'}`}
                    >
                      {medal(cell.place)}
                      {cell.href ? (
                        <Link href={cell.href} className="text-sky-600 hover:underline">
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
          className="mt-3 inline-block rounded-full border border-sky-800/35 px-4 py-2 text-sm font-bold text-sky-900 transition hover:border-sky-800 hover:bg-sky-50"
        >
          {expanded ? 'Pokaż mniej' : `Pokaż więcej (${rows.length - limit})`}
        </button>
      )}
    </div>
  )
}
