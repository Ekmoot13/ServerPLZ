// Zespoły — kluby bieżącego sezonu (na bieżąco z bazy liga_*), układ podium + rzędy per liga.
// Zdjęcia i logotypy z ligazeglarska.pl (lib/klubMedia). Dwie wyszukiwarki: zawodnik i klub.
import React from 'react'
import { getAktualneKluby, getZawodnicy, getKluby } from '@/lib/liga'
import { getKlubMedia } from '@/lib/klubMedia'
import { getKlubyKarty, getPrzypisaniaSezonu } from '@/lib/panel'
import ZespolyWidok, { type Grupa } from './ZespolyWidok'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Zespoły — Polska Liga Żeglarska' }

export default async function KlubyPage() {
  const [grupyRaw, zawodnicyRaw, klubyRaw, karty, przypisania] = await Promise.all([
    getAktualneKluby(),
    getZawodnicy(),
    getKluby(),
    getKlubyKarty(),
    getPrzypisaniaSezonu(),
  ])

  const grupy: Grupa[] = grupyRaw.map((g) => ({
    poziom: g.poziom,
    kluby: g.kluby.map((k) => {
      // Przypisanie z „Kluby w sezonie" decyduje, jako który klub panelu pokazuje się zespół.
      const przypisany = k.warianty
        .map((w) => przypisania.poKluczu.get(`${g.poziomRaw}|${w}`))
        .find(Boolean)
      // Bez przypisania zostajemy przy nazwie z bazy wyników (zgodnej z Rankingiem Sezonu).
      const zPanelu =
        przypisany ||
        k.warianty.map((w) => karty.poWariancie.get(w)).find(Boolean) ||
        karty.poZestawieniu.get(k.id)
      const nazwa = przypisany?.nazwa || k.nazwa
      // Nazwa z panelu pomaga też znaleźć grafikę, gdy w bazie zespół nazywa się inaczej
      // niż w mapie zdjęć (np. „Yacht Klub Polski Gdynia" vs „YKP Gdynia").
      const m = getKlubMedia(nazwa) || getKlubMedia(k.nazwa) || (zPanelu?.nazwa ? getKlubMedia(zPanelu.nazwa) : null)
      return {
        nazwa,
        slug: k.slug,
        miejsce: k.miejsce,
        foto: m?.foto || null,
        logo: przypisany?.logoUrl || m?.logo || zPanelu?.logoUrl || null,
      }
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
