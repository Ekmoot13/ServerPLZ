// Siatka kart z placeholderem zdjęcia + nazwą (zawodnicy klubu / obecny klub zawodnika).
// Zdjęcia dodamy później — na razie placeholder.
import React from 'react'
import Link from 'next/link'

export type CardItem = { nazwa: string; href: string; imageUrl?: string }

function initials(nazwa: string): string {
  const parts = nazwa.trim().split(/\s+/).filter(Boolean)
  return (parts[0]?.[0] || '').concat(parts[1]?.[0] || '').toUpperCase() || '?'
}

export default function ProfileCards({ title, items }: { title: string; items: CardItem[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-slate-900">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((it, i) => (
          <Link
            key={i}
            href={it.href}
            className="group overflow-hidden rounded-lg border border-slate-200 transition hover:border-sky-400 hover:shadow-sm"
          >
            {it.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.imageUrl} alt={it.nazwa} className="aspect-square w-full object-cover" />
            ) : (
              // Placeholder zdjęcia (dodamy później)
              <div className="flex aspect-square w-full items-center justify-center bg-slate-100 text-2xl font-bold text-slate-300">
                {initials(it.nazwa)}
              </div>
            )}
            <div className="p-2 text-center text-sm font-medium text-slate-700 group-hover:text-sky-600">
              {it.nazwa}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
