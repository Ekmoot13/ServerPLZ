import Link from 'next/link'
import React from 'react'

type Item = { label: string; href: string }

const KOL_LIGA: Item[] = [
  { label: 'Wyniki 2026', href: '/wyniki' },
  { label: 'Kalendarz', href: '/kalendarium-2026' },
  { label: 'Kluby', href: '/kluby' },
  { label: 'Ligi Regionalne', href: '/regionalne' },
  { label: 'Mistrzostwa Kobiet', href: 'https://ladiesailing.pl/' },
  { label: 'Sailing Champions League', href: '/scl-isla' },
]

const KOL_INFO: Item[] = [
  { label: 'Społeczność WhatsApp', href: 'https://chat.whatsapp.com/JQRZWPIGH7x7OAHW8QaKRH' },
  { label: 'Cennik', href: '/cennik' },
  { label: 'Regulamin Ligi', href: '/regulamin' },
  { label: 'Klasa RS21', href: 'https://rs21class.pl/' },
  { label: 'ISLA', href: '/scl-isla' },
  { label: 'Polityka Prywatności', href: '/privacy-policy' },
]

const SOCIAL: Item[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/LigaZeglarska/' },
  { label: 'Instagram', href: 'https://www.instagram.com/polskaligazeglarska/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@ligazeglarska' },
  { label: 'YouTube', href: 'https://www.youtube.com/c/ocszeglarskikanalsportowy' },
  { label: 'LinkedIn', href: 'https://pl.linkedin.com/company/polska-liga-zeglarska' },
]

function FooterCol({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">{title}</h3>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.label}>
            {i.href.startsWith('http') ? (
              <a href={i.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {i.label}
              </a>
            ) : (
              <Link href={i.href} className="hover:text-white">
                {i.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Polska Liga Żeglarska" className="h-10 w-auto" />
              <span className="text-lg font-bold text-white">POLSKA LIGA ŻEGLARSKA</span>
            </div>
            <p className="text-sm text-slate-400">Pure racing, true passion</p>
            <a href="mailto:info@ligazeglarska.pl" className="mt-4 block text-sm hover:text-white">
              info@ligazeglarska.pl
            </a>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Towarzystwo Żeglarstwa Regatowego
              <br />
              ul. Parkowa 43, 71-220 Bezrzecze
              <br />
              NIP: 851.318.97.68
            </p>
          </div>
          <FooterCol title="Liga" items={KOL_LIGA} />
          <FooterCol title="Informacje" items={KOL_INFO} />
          <FooterCol title="Śledź nas" items={SOCIAL} />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Polska Liga Żeglarska
        </div>
      </div>
    </footer>
  )
}
