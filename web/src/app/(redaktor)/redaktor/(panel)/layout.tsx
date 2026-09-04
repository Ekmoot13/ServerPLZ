import React from 'react'
import Link from 'next/link'
import { requireUser } from '@/lib/redaktorAuth'
import LogoutButton from './LogoutButton'

export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const label = (user as any).name || (user as any).email || 'Redaktor'

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/redaktor" className="text-lg font-bold text-sky-900">
              Panel redaktora
            </Link>
            <nav className="flex gap-4 text-sm font-medium text-slate-600">
              <Link href="/redaktor/zawodnicy" className="hover:text-sky-700">
                Zawodnicy
              </Link>
              <Link href="/redaktor/kluby" className="hover:text-sky-700">
                Kluby
              </Link>
              <Link href="/redaktor/wpisy" className="hover:text-sky-700">
                Wpisy
              </Link>
              <Link href="/redaktor/kalendarz" className="hover:text-sky-700">
                Kalendarz
              </Link>
              <Link href="/redaktor/strefa-kibica" className="hover:text-sky-700">
                Strefa Kibica
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="hidden sm:inline">{label}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
