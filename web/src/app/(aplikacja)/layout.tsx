import type { Metadata } from 'next'
import React from 'react'
import '../(frontend)/globals.css'

/**
 * Warstwa dla aplikacji na telefon — bez nagłówka i stopki serwisu.
 * Ekran ma być jednym narzędziem, nie stroną, po której się nawiguje.
 */
export const metadata: Metadata = {
  title: 'Flaga AP — PLŻ',
  robots: { index: false, follow: false },
  // Kolor paska systemowego po dodaniu do ekranu głównego.
  themeColor: '#17326b',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // Bez przypadkowego przybliżenia przy dwukrotnym stuknięciu w duży przycisk.
  maximumScale: 1,
}

export default function AplikacjaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" data-theme="light">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  )
}
