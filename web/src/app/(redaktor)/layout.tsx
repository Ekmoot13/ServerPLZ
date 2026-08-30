import type { Metadata } from 'next'
import React from 'react'
import '../(frontend)/globals.css'

export const metadata: Metadata = {
  title: 'Panel redaktora — PLŻ',
  robots: { index: false, follow: false },
}

export default function RedaktorRootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme wymagane — globals.css ma html{opacity:0} i odsłania dopiero z ustawionym motywem.
    <html lang="pl" data-theme="light">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  )
}
