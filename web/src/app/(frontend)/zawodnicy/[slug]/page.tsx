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
    <main className="bg-slate-50">
      {/* HERO — na razie sam granat */}
      <section className="relative bg-navy text-white">
        <div className="relative mx-auto max-w-[1440px] px-4 pb-24 pt-10 md:pb-28">
          <Link href="/zawodnicy" className="text-sm font-semibold text-white/80 hover:text-white">
            ← Wszyscy zawodnicy
          </Link>
        </div>
      </section>

      {/* KARTA TREŚCI nachodząca na hero */}
      <section className="relative z-10 mx-auto -mt-20 max-w-[1440px] px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* SIDEBAR */}
          <aside className="order-first lg:order-last lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
              {panel?.zdjecieUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={panel.zdjecieUrl}
                  alt={`${imie} ${nazwisko}`}
                  className="mx-auto -mt-16 mb-4 aspect-[4/5] w-56 max-w-full rounded-2xl border border-slate-200 object-cover shadow-md"
                />
              ) : (
                <div className="mx-auto -mt-16 mb-4 flex aspect-[4/5] w-56 max-w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-5xl font-bold text-slate-300 shadow-md">
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
            </div>
          </aside>

          {/* MAIN */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg lg:col-span-2 lg:p-8">
            <h1 className="mb-8 text-3xl font-extrabold uppercase tracking-wide text-navy md:text-4xl">
              {imie} {nazwisko}
            </h1>

            <div className="space-y-12">
              <Sekcja tytul="Historia sezonów">
                {sezonyRows.length === 0 ? (
                  <p className="text-slate-500">Brak sklasyfikowanych sezonów.</p>
                ) : (
                  <MoreTable
                    headers={['Rok', 'Poziom ligi', 'Klub', 'Miejsce w sezonie']}
                    rows={sezonyRows}
                    limit={3}
                  />
                )}
              </Sekcja>

              <Sekcja tytul="Wyniki regat (TOP 3)">
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[420px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-navy text-left text-white">
                        <th className="px-4 py-2.5 font-bold">🥇 1. miejsca</th>
                        <th className="px-4 py-2.5 font-bold">🥈 2. miejsca</th>
                        <th className="px-4 py-2.5 font-bold">🥉 3. miejsca</th>
                        <th className="px-4 py-2.5 font-bold">Suma</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white text-slate-700">
                        <td className="px-4 py-2">{medale.zlote}</td>
                        <td className="px-4 py-2">{medale.srebrne}</td>
                        <td className="px-4 py-2">{medale.brazowe}</td>
                        <td className="px-4 py-2 font-bold text-navy">{medale.suma}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Sekcja>

              <Sekcja tytul="Statystyki zawodnika">
                <StatsTable
                  rows={statystyki.rows}
                  totals={{
                    regaty: statystyki.totalRegaty,
                    wyscigi: statystyki.totalWyscigi,
                    wygrane: statystyki.totalWygrane,
                  }}
                />
              </Sekcja>

              <Sekcja tytul="Lista startów">
                {startyRows.length === 0 ? (
                  <p className="text-slate-500">Brak startów w bazie.</p>
                ) : (
                  <MoreTable
                    headers={['Rok', 'Regaty', 'Miasto', 'Klub', 'Miejsce']}
                    rows={startyRows}
                    limit={5}
                  />
                )}
              </Sekcja>

              <ProfileCards title="Obecny klub" items={obecnyItems} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function Sekcja({ tytul, children }: { tytul: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy">{tytul}</h2>
      <div className="mb-4 mt-2 h-1 w-12 rounded-full bg-brand-red" />
      {children}
    </div>
  )
}
