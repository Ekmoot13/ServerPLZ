import Link from 'next/link'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const NAV: { label: string; href: string }[] = [
  { label: 'Regaty', href: '/regaty' },
  { label: 'Kalendarz', href: '/kalendarium-2026' },
  { label: 'Zespoły', href: '/kluby' },
  { label: 'Zawodnicy', href: '/zawodnicy' },
  { label: 'Wyniki', href: '/wyniki' },
  { label: 'Newsy', href: '/newsy' },
  { label: 'O nas', href: '/o-nas' },
  { label: 'Media', href: '/media' },
  { label: 'Kontakt', href: '/kontakt' },
]

export async function Header() {
  let pokazPrzycisk = true
  try {
    const payload = await getPayload({ config: configPromise })
    const s: any = await payload.findGlobal({ slug: 'strefa-kibica' })
    pokazPrzycisk = s?.pokazPrzycisk !== false
  } catch {
    /* brak ustawień — przycisk domyślnie widoczny */
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Polska Liga Żeglarska" className="h-10 w-auto" />
          <span className="text-lg font-bold tracking-wide">POLSKA LIGA ŻEGLARSKA</span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-medium">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-slate-200 transition hover:text-sky-400">
                {n.label}
              </Link>
            ))}
          </nav>
          {pokazPrzycisk && (
            <Link
              href="/regatowastrefakibica"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-500"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              Śledź Regaty
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
