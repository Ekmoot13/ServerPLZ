'use client'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { SocialRow } from '@/components/site/SocialIcons'

// Strony lig z ciemnym motywem — stopka ma wtedy grafitowe tło.
const CIEMNE = [
  '/regionalne/wielkopolska-liga-zeglarska',
  '/regionalne/trojmiejska-liga-zeglarska',
  '/regionalne/centralna-liga-zeglarska',
]

type Item = { label: string; href: string }

const KOL_LIGA: Item[] = [
  { label: 'Wyniki 2026', href: '/wyniki' },
  { label: 'Kalendarz', href: '/kalendarz' },
  { label: 'Kluby', href: '/kluby' },
  { label: 'Ligi Regionalne', href: '/regionalne' },
  { label: 'Mistrzostwa Kobiet', href: 'https://ladiesailing.pl/' },
  { label: 'Sailing Champions League', href: '/scl-isla' },
]

const KOL_INFO: Item[] = [
  { label: 'Społeczność WhatsApp', href: 'https://chat.whatsapp.com/JQRZWPIGH7x7OAHW8QaKRH' },
  { label: 'Cennik', href: '/cennik' },
  { label: 'Regulamin Ligi', href: 'https://ligazeglarska.pl/wp-content/uploads/2026/02/Regulamin-Ekstraklasa-PLZ2026.pdf' },
  { label: 'Klasa RS21', href: 'https://rs21class.pl/' },
  { label: 'ISLA', href: '/scl-isla' },
  { label: 'Polityka Prywatności', href: '/privacy-policy' },
]

function FooterCol({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-2.5 text-sm font-semibold uppercase tracking-wide">
      {items.map((i) => (
        <li key={i.label}>
          {i.href.startsWith('http') ? (
            <a href={i.href} target="_blank" rel="noopener noreferrer" className="transition hover:text-brand-red">
              {i.label}
            </a>
          ) : (
            <Link href={i.href} className="transition hover:text-brand-red">
              {i.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

export function Footer() {
  const ciemny = CIEMNE.includes((usePathname() || '').replace(/\/$/, ''))
  return (
    <footer
      className={`border-t-4 border-brand-red text-white/80 ${ciemny ? '' : 'bg-navy'}`}
      style={ciemny ? { backgroundColor: '#191919' } : undefined}
    >
      <div className="mx-auto max-w-[1440px] px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo (grafika zawiera już napis) */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Polska Liga Żeglarska" className="h-36 w-auto" />
          </div>

          {/* Kontakt */}
          <div className="text-sm">
            <a href="mailto:info@ligazeglarska.pl" className="font-bold text-white hover:text-brand-red">
              info@ligazeglarska.pl
            </a>
            <p className="mt-4 leading-relaxed text-white/70">
              <span className="font-bold text-white">Towarzystwo Żeglarstwa Regatowego</span>
              <br />
              ul. Parkowa 43, 71-220 Bezrzecze, Poland
              <br />
              NIP: 851.318.97.68
            </p>
            <p className="mt-4 leading-relaxed text-white/70">
              <span className="font-bold text-white">MT PARTNERS Maciej Cylupa Spółka komandytowa</span>
              <br />
              ul. Parkowa 43, 71-220 Bezrzecze, Poland
              <br />
              NIP: 631.252.03.79
            </p>
          </div>

          <FooterCol items={KOL_LIGA} />
          <FooterCol items={KOL_INFO} />

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Śledź nas</h3>
            <SocialRow size={22} layout="grid" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-4 py-5 text-xs font-semibold uppercase tracking-wide text-white/60">
          Copyright © {new Date().getFullYear()} Polska Liga Żeglarska
        </div>
      </div>
    </footer>
  )
}
