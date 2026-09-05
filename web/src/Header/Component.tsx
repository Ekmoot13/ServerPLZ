import Link from 'next/link'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import HeaderNav from './HeaderNav'

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
    <header className="sticky top-0 z-30 bg-navy text-white shadow-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Polska Liga Żeglarska" className="h-11 w-auto" />
          <span className="hidden text-base font-extrabold uppercase tracking-wide sm:inline">
            Polska Liga Żeglarska
          </span>
        </Link>
        <HeaderNav pokazPrzycisk={pokazPrzycisk} />
      </div>
    </header>
  )
}
