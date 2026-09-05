'use client'
import Link from 'next/link'
import React, { useState } from 'react'

type Sub = { label: string; href: string }
type Item = { label: string; href: string; sub?: Sub[] }

// Menu wzorowane na ligazeglarska.pl (z zachowaniem naszych tras).
export const MENU: Item[] = [
  {
    label: 'Regaty',
    href: '/regaty',
    sub: [
      { label: 'Ekstraklasa', href: '/ekstraklasa' },
      { label: 'I Liga', href: '/i-liga' },
      { label: 'Młodzieżowa', href: '/mlodziezowa-liga-zeglarska' },
      { label: 'Ligi Regionalne', href: '/regionalne' },
    ],
  },
  { label: 'Kalendarz', href: '/kalendarz' },
  { label: 'Kluby', href: '/kluby' },
  { label: 'Zawodnicy', href: '/zawodnicy' },
  { label: 'Wyniki', href: '/wyniki' },
  { label: 'Newsy', href: '/newsy' },
  {
    label: 'O nas',
    href: '/o-nas',
    sub: [
      { label: 'O nas', href: '/o-nas' },
      { label: 'Historia', href: '/historia' },
      { label: 'Wartości', href: '/wartosci' },
      { label: 'Środowisko', href: '/srodowisko' },
      { label: 'Zespół', href: '/plz-team' },
    ],
  },
  { label: 'Media', href: '/media' },
  { label: 'Wspieramy', href: '/wspieramy' },
  {
    label: 'Klub',
    href: '/polski-klub-regatowy',
    sub: [
      { label: 'Polski Klub Regatowy', href: '/polski-klub-regatowy' },
      { label: 'Oferta', href: '/oferta' },
      { label: 'Sprzęt', href: '/sprzet' },
      { label: 'Bezpieczeństwo', href: '/safety' },
      { label: 'ISLA', href: '/scl-isla' },
      { label: 'Cennik', href: '/cennik' },
    ],
  },
  { label: 'Kontakt', href: '/kontakt' },
]

function DesktopItem({ item }: { item: Item }) {
  const [open, setOpen] = useState(false)
  if (!item.sub) {
    return (
      <Link
        href={item.href}
        className="px-1 py-2 text-[13px] font-bold uppercase tracking-wide text-white/90 transition hover:text-brand-red"
      >
        {item.label}
      </Link>
    )
  }
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href={item.href}
        className="flex items-center gap-1 px-1 py-2 text-[13px] font-bold uppercase tracking-wide text-white/90 transition hover:text-brand-red"
      >
        {item.label}
        <svg width="10" height="10" viewBox="0 0 12 12" className="mt-0.5 opacity-70">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      </Link>
      {open && (
        <div className="absolute left-0 top-full z-40 min-w-[220px] overflow-hidden rounded-lg border border-white/10 bg-navy-800 py-1 shadow-xl">
          {item.sub.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-white/85 transition hover:bg-white/10 hover:text-brand-red"
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileItem({ item, onNav }: { item: Item; onNav: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10">
      <div className="flex items-center justify-between">
        <Link href={item.href} onClick={onNav} className="flex-1 py-3 text-sm font-bold uppercase tracking-wide text-white">
          {item.label}
        </Link>
        {item.sub && (
          <button onClick={() => setOpen((o) => !o)} aria-label="Rozwiń" className="px-3 py-3 text-white/70">
            {open ? '−' : '+'}
          </button>
        )}
      </div>
      {item.sub && open && (
        <div className="pb-2 pl-4">
          {item.sub.map((s) => (
            <Link key={s.href} href={s.href} onClick={onNav} className="block py-2 text-sm font-medium text-white/80 hover:text-brand-red">
              {s.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function HeaderNav({ pokazPrzycisk }: { pokazPrzycisk: boolean }) {
  const [mobile, setMobile] = useState(false)

  return (
    <>
      {/* Desktop */}
      <nav className="hidden items-center gap-x-4 xl:flex">
        {MENU.map((it) => (
          <DesktopItem key={it.href} item={it} />
        ))}
      </nav>

      <div className="hidden items-center gap-3 xl:flex">
        {pokazPrzycisk && (
          <Link
            href="/regatowastrefakibica"
            className="inline-flex items-center gap-2 rounded-[10px] bg-brand-red px-5 py-2 text-[13px] font-bold uppercase tracking-wide text-white transition hover:bg-brand-red-dark"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            Śledź Regaty
          </Link>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobile(true)}
        aria-label="Menu"
        className="flex flex-col gap-1.5 p-2 xl:hidden"
      >
        <span className="block h-0.5 w-6 bg-white" />
        <span className="block h-0.5 w-6 bg-white" />
        <span className="block h-0.5 w-6 bg-white" />
      </button>

      {/* Mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-navy p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wide text-white">Menu</span>
              <button onClick={() => setMobile(false)} aria-label="Zamknij" className="p-1 text-2xl leading-none text-white">
                ×
              </button>
            </div>
            {MENU.map((it) => (
              <MobileItem key={it.href} item={it} onNav={() => setMobile(false)} />
            ))}
            {pokazPrzycisk && (
              <Link
                href="/regatowastrefakibica"
                onClick={() => setMobile(false)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-brand-red px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                Śledź Regaty
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
