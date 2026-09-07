// Zespoły — kluby bieżącego sezonu (na bieżąco z bazy liga_*), układ podium + rzędy per liga.
// Zdjęcia i logotypy z ligazeglarska.pl (lib/klubMedia). Dwie wyszukiwarki: zawodnik i klub.
import React from 'react'
import { getAktualneKluby, getZawodnicy, getKluby } from '@/lib/liga'
import { getKlubMedia } from '@/lib/klubMedia'
import ZespolyWidok, { type Grupa } from './ZespolyWidok'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Zespoły — Polska Liga Żeglarska' }

export default async function KlubyPage() {
  const [grupyRaw, zawodnicyRaw, klubyRaw] = await Promise.all([getAktualneKluby(), getZawodnicy(), getKluby()])

  const grupy: Grupa[] = grupyRaw.map((g) => ({
    poziom: g.poziom,
    kluby: g.kluby.map((k) => {
      const m = getKlubMedia(k.nazwa)
      return { nazwa: k.nazwa, slug: k.slug, miejsce: k.miejsce, foto: m?.foto || null, logo: m?.logo || null }
    }),
  }))

  const zawodnicy = zawodnicyRaw.map((z) => ({ imie: z.imie, nazwisko: z.nazwisko, slug: z.slug }))
  const kluby = klubyRaw.map((k) => ({ nazwa: k.nazwa, slug: k.slug }))

  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section
        className="bg-navy text-white"
        style={{
          backgroundImage: 'url(/pkr-pattern-soft.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="mx-auto max-w-[1440px] px-4 py-16 text-center md:py-20">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Zespoły</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-12">
        <ZespolyWidok grupy={grupy} zawodnicy={zawodnicy} kluby={kluby} />
      </section>
    </main>
  )
}
