// Profil zawodnika — elementy jak na ligazeglarska.pl (logika z short-code'ów).
// Dane z tabel liga_* (PostgreSQL). Zdjęcia: placeholder (dodamy później).
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  findZawodnikBySlug,
  getStartyZawodnika,
  getMedaleZawodnika,
  getSezonyZawodnika,
  getStatystykiZawodnika,
  getPodsumowanieZawodnika,
  getObecnyKlubZawodnika,
} from '@/lib/liga'
import MoreTable, { TableCell } from '../MoreTable'
import SummaryCards from '@/components/profile/SummaryCards'
import StatsTable from '@/components/profile/StatsTable'
import ProfileCards from '@/components/profile/ProfileCards'
import { getZawodnikPanel } from '@/lib/panel'

export const dynamic = 'force-dynamic'

function toPlace(s: string): number | null {
  return /^\d+$/.test(s) ? Number(s) : null
}

export default async function ZawodnikPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const zawodnik = await findZawodnikBySlug(slug)
  if (!zawodnik) notFound()

  const [starty, medale, sezony, statystyki, pods, obecnyKlub, panel] = await Promise.all([
    getStartyZawodnika(zawodnik.id),
    getMedaleZawodnika(zawodnik.id),
    getSezonyZawodnika(zawodnik.id),
    getStatystykiZawodnika(zawodnik.id),
    getPodsumowanieZawodnika(zawodnik.id),
    getObecnyKlubZawodnika(zawodnik.id),
    getZawodnikPanel(zawodnik.id),
  ])

  // Nadpisania z panelu redaktora
  const imie = panel?.imie || zawodnik.imie
  const nazwisko = panel?.nazwisko || zawodnik.nazwisko

  // Lista startów = dane z bazy wyników + ręczne starty z panelu, wg roku malejąco
  const startyAll = [
    ...starty.map((s) => ({
      rok: s.rok,
      regaty: s.regaty,
      miasto: s.miasto,
      klub: s.klub,
      miejsce: s.miejsce,
      place: toPlace(s.miejsce),
    })),
    ...(panel?.dodatkoweStarty || []).map((s) => ({
      rok: s.rok,
      regaty: s.regaty,
      miasto: s.miasto,
      klub: s.klub,
      miejsce: String(s.miejsce),
      place: s.miejsce > 0 ? s.miejsce : null,
    })),
  ].sort((a, b) => b.rok - a.rok)

  const startyRows: TableCell[][] = startyAll.map((s) => [
    { value: String(s.rok) },
    { value: s.regaty },
    { value: s.miasto },
    { value: s.klub },
    { value: s.miejsce, place: s.place },
  ])

  const obecnyItems = panel?.klub
    ? [{ nazwa: panel.klub.nazwa, href: `/kluby/${panel.klub.slug}` }]
    : obecnyKlub.map((k) => ({ nazwa: k.nazwa, href: `/kluby/${k.slug}` }))

  const sezonyRows: TableCell[][] = sezony.map((s) => [
    { value: String(s.rok) },
    { value: s.poziom.replace('Youth', 'Młodzieżowa') },
    { value: s.klub },
    { value: String(s.miejsce), place: s.miejsce },
  ])

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Link href="/zawodnicy" className="text-sm text-sky-400 hover:underline">
            ← Wszyscy zawodnicy
          </Link>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            {imie} {nazwisko}
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-3">
        {/* SIDEBAR */}
        <aside className="order-first lg:order-last lg:col-span-1">
          {panel?.zdjecieUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={panel.zdjecieUrl}
              alt={`${imie} ${nazwisko}`}
              className="mb-5 aspect-square w-full rounded-xl object-cover"
            />
          ) : (
            <div className="mb-5 flex aspect-square w-full items-center justify-center rounded-xl bg-slate-100 text-5xl font-bold text-slate-300">
              {(imie[0] || '') + (nazwisko[0] || '')}
            </div>
          )}
          <SummaryCards
            stars={pods.mistrzostwa}
            groups={[
              {
                cards: [
                  { label: 'Starty w regatach', value: pods.starty },
                  { label: 'Wygrane regaty', value: pods.wygraneRegaty },
                  { label: 'Zdobyte punkty', value: pods.punkty },
                ],
              },
            ]}
          />
        </aside>

        {/* MAIN */}
        <div className="space-y-12 lg:col-span-2">
          {/* HISTORIA SEZONÓW */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Historia sezonów</h2>
            {sezonyRows.length === 0 ? (
              <p className="text-slate-500">Brak sklasyfikowanych sezonów.</p>
            ) : (
              <MoreTable
                headers={['Rok', 'Poziom ligi', 'Klub', 'Miejsce w sezonie']}
                rows={sezonyRows}
                limit={3}
              />
            )}
          </div>

          {/* WYNIKI REGAT (TOP 3) — medale */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Wyniki regat (TOP 3)</h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600">
                    <th className="px-4 py-2 font-semibold">🥇 1. miejsca</th>
                    <th className="px-4 py-2 font-semibold">🥈 2. miejsca</th>
                    <th className="px-4 py-2 font-semibold">🥉 3. miejsca</th>
                    <th className="px-4 py-2 font-semibold">Suma</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100 text-slate-700">
                    <td className="px-4 py-2">{medale.zlote}</td>
                    <td className="px-4 py-2">{medale.srebrne}</td>
                    <td className="px-4 py-2">{medale.brazowe}</td>
                    <td className="px-4 py-2 font-bold">{medale.suma}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* STATYSTYKI ZAWODNIKA */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Statystyki zawodnika</h2>
            <StatsTable
              rows={statystyki.rows}
              totals={{
                regaty: statystyki.totalRegaty,
                wyscigi: statystyki.totalWyscigi,
                wygrane: statystyki.totalWygrane,
              }}
            />
          </div>

          {/* LISTA STARTÓW */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Lista startów</h2>
            {startyRows.length === 0 ? (
              <p className="text-slate-500">Brak startów w bazie.</p>
            ) : (
              <MoreTable
                headers={['Rok', 'Regaty', 'Miasto', 'Klub', 'Miejsce']}
                rows={startyRows}
                limit={5}
              />
            )}
          </div>

          {/* OBECNY KLUB */}
          <ProfileCards title="Obecny klub" items={obecnyItems} />
        </div>
      </section>
    </main>
  )
}
