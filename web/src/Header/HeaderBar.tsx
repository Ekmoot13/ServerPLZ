'use client'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import HeaderNav from './HeaderNav'

// Strony lig z ciemnym motywem — header ma wtedy grafitowe tło (dopisuj kolejne po migracji).
const CIEMNE = [
  '/regionalne/wielkopolska-liga-zeglarska',
  '/regionalne/trojmiejska-liga-zeglarska',
  '/regionalne/centralna-liga-zeglarska',
]

// Pasek nagłówka. Na stronach lig regionalnych (ciemny motyw) tło headera jest grafitowe.
export default function HeaderBar({ pokazPrzycisk }: { pokazPrzycisk: boolean }) {
  const path = (usePathname() || '').replace(/\/$/, '')
  const ciemny = CIEMNE.includes(path)

  return (
    <header
      className={`sticky top-0 z-30 text-white shadow-md ${ciemny ? '' : 'bg-navy'}`}
      style={ciemny ? { backgroundColor: '#191919' } : undefined}
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Polska Liga Żeglarska" className="h-14 w-auto" />
        </Link>
        <HeaderNav pokazPrzycisk={pokazPrzycisk} ciemny={ciemny} />
      </div>
    </header>
  )
}
