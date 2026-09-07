'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { SocialRow } from '@/components/site/SocialIcons'

type Sub = { label: string; href: string; external?: boolean }
type Item = { label: string; href: string; sub?: Sub[] }

// Menu 1:1 wg ligazeglarska.pl — tylko „Regaty” ma rozwijaną listę.
export const MENU: Item[] = [
  {
    label: 'Regaty',
    href: '/regaty',
    sub: [
      { label: 'Ekstraklasa', href: '/ekstraklasa' },
      { label: 'I Liga', href: '/1-liga' },
      { label: 'Młodzieżowa', href: '/mlodziezowa-liga-zeglarska' },
      { label: 'Ligi Regionalne', href: '/regionalne' },
      { label: 'Mistrzostwa Kobiet', href: 'https://ladiesailing.pl/', external: true },
    ],
  },
  { label: 'Kalendarz', href: '/kalendarz' },
  { label: 'Zespoły', href: '/kluby' },
  { label: 'Wyniki', href: '/wyniki' },
  { label: 'Newsy', href: '/newsy' },
  { label: 'O nas', href: '/o-nas' },
  { label: 'Media', href: '/media' },
  { label: 'Wspieramy', href: '/wspieramy' },
  { label: 'Klub', href: '/polski-klub-regatowy' },
  { label: 'Kontakt', href: '/kontakt' },
]

const linkCls = 'whitespace-nowrap px-1 py-2 text-[13px] font-bold uppercase tracking-wide text-white/90 transition hover:text-brand-red'

function DesktopItem({ item, ciemny }: { item: Item; ciemny?: boolean }) {
  const [open, setOpen] = useState(false)
  if (!item.sub) {
    return (
      <Link href={item.href} className={linkCls}>
        {item.label}
      </Link>
    )
  }
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className={linkCls + ' flex items-center gap-1'} onClick={() => setOpen((o) => !o)}>
        {item.label}
        <svg width="10" height="10" viewBox="0 0 12 12" className="mt-0.5 opacity-70" aria-hidden="true">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" />
        </svg>
      </button>
      {open && (
        <div
          className={`absolute left-0 top-full z-40 min-w-[210px] overflow-hidden rounded-lg border border-white/10 py-1 shadow-xl ${ciemny ? '' : 'bg-navy-800'}`}
          style={ciemny ? { backgroundColor: '#232323' } : undefined}
        >
          {item.sub.map((s) =>
            s.external ? (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-white/85 transition hover:bg-white/10 hover:text-brand-red"
              >
                {s.label}
              </a>
            ) : (
              <Link
                key={s.href}
                href={s.href}
                className="block px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-white/85 transition hover:bg-white/10 hover:text-brand-red"
              >
                {s.label}
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  )
}

function MobileItem({ item, onNav }: { item: Item; onNav: () => void }) {
  const [open, setOpen] = useState(false)
  if (!item.sub) {
    return (
      <Link href={item.href} onClick={onNav} className="block border-b border-white/10 py-3 text-center text-sm font-bold uppercase tracking-wide text-white hover:text-brand-red">
        {item.label}
      </Link>
    )
  }
  return (
    <div className="border-b border-white/10">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wide text-white">
        {item.label}
        <span className="text-white/60">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pb-2">
          {item.sub.map((s) =>
            s.external ? (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="block py-2 text-center text-sm font-medium text-white/80 hover:text-brand-red">
                {s.label}
              </a>
            ) : (
              <Link key={s.href} href={s.href} onClick={onNav} className="block py-2 text-center text-sm font-medium text-white/80 hover:text-brand-red">
                {s.label}
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  )
}

function CTA({ compact }: { compact?: boolean }) {
  return (
    <Link
      href="/regatowastrefakibica"
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] bg-brand-red font-bold uppercase tracking-wide text-white transition hover:bg-brand-red-dark ${
        compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-[13px]'
      }`}
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
      Śledź Regaty
    </Link>
  )
}

export default function HeaderNav({ pokazPrzycisk, ciemny = false }: { pokazPrzycisk: boolean; ciemny?: boolean }) {
  const [mobile, setMobile] = useState(false)

  return (
    <>
      {/* DESKTOP: menu */}
      <nav className="ml-6 hidden items-center gap-x-3.5 xl:flex">
        {MENU.map((it) => (
          <DesktopItem key={it.href} item={it} ciemny={ciemny} />
        ))}
      </nav>

      {/* DESKTOP: prawa strona (social + CTA) */}
      <div className="ml-auto hidden items-center gap-4 xl:flex">
        <SocialRow size={16} />
        {pokazPrzycisk && <CTA />}
      </div>

      {/* MOBILE: CTA + hamburger */}
      <div className="ml-auto flex items-center gap-3 xl:hidden">
        {pokazPrzycisk && <CTA compact />}
        <button onClick={() => setMobile(true)} aria-label="Menu" className="flex flex-col gap-1.5 p-1.5">
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
        </button>
      </div>

      {/* MOBILE: szuflada */}
      {mobile && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)} />
          <div
            className={`absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto p-5 ${ciemny ? '' : 'bg-navy'}`}
            style={ciemny ? { backgroundColor: '#191919' } : undefined}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wide text-white">Menu</span>
              <button onClick={() => setMobile(false)} aria-label="Zamknij" className="p-1 text-2xl leading-none text-white">
                ×
              </button>
            </div>
            <div className="border-t border-white/10">
              {MENU.map((it) => (
                <MobileItem key={it.href} item={it} onNav={() => setMobile(false)} />
              ))}
            </div>
            {pokazPrzycisk && (
              <div className="mt-5" onClick={() => setMobile(false)}>
                <Link
                  href="/regatowastrefakibica"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-brand-red px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  Śledź Regaty
                </Link>
              </div>
            )}
            <div className="mt-6 flex justify-center">
              <SocialRow size={20} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
