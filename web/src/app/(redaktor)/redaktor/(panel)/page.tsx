import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

async function counts() {
  try {
    const payload = await getPayload({ config })
    const [z, k, w] = await Promise.all([
      payload.count({ collection: 'zawodnicy' }),
      payload.count({ collection: 'kluby' }),
      payload.count({ collection: 'posts' }),
    ])
    return { zawodnicy: z.totalDocs, kluby: k.totalDocs, wpisy: w.totalDocs }
  } catch {
    return { zawodnicy: 0, kluby: 0, wpisy: 0 }
  }
}

export default async function DashboardPage() {
  const c = await counts()
  const cards = [
    { href: '/redaktor/zawodnicy', title: 'Zawodnicy', desc: 'Imię, nazwisko, zdjęcie, klub, ręczne starty.', count: c.zawodnicy },
    { href: '/redaktor/kluby', title: 'Kluby', desc: 'Nazwa, logo, poziom ligi, załoga, linki.', count: c.kluby },
    { href: '/redaktor/wpisy', title: 'Wpisy', desc: 'Newsy — dodawanie i edycja artykułów.', count: c.wpisy },
    { href: '/redaktor/strefa-kibica', title: 'Strefa Kibica', desc: 'Mapa i tabela wyników pod bieżącą rundę.', count: null as any },
  ]
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pulpit</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-sky-400 hover:shadow-sm"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-slate-800">{card.title}</h2>
              <span className="text-2xl font-extrabold text-sky-900">{card.count}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
