// Profil klubu — elementy jak na ligazeglarska.pl (logika z short-code'ów),
// z warstwą redaktorską (Payload): nazwa, logo, poziom ligi, załoga, zdjęcia.
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  findKlubBySlug,
  getSkladKlubu,
  getSezonyKlubu,
  getStatystykiKlubu,
  getPodsumowanieKlubu,
  getStartyKlubu,
} from '@/lib/liga'
import { getKlubPanel, getZawodnicyPhotos } from '@/lib/panel'
import { getKlubMedia } from '@/lib/klubMedia'
import MoreTable, { TableCell } from '../../zawodnicy/MoreTable'
import SummaryCards, { StatGroup } from '@/components/profile/SummaryCards'
import StatsTable from '@/components/profile/StatsTable'
import PodiaTable from '@/components/profile/PodiaTable'
import ProfileCards from '@/components/profile/ProfileCards'

export const dynamic = 'force-dynamic'

export default async function KlubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const klub = await findKlubBySlug(slug)
  if (!klub) notFound()

  const [sklad, sezony, statystyki, pods, starty, panel] = await Promise.all([
    getSkladKlubu(klub.id),
    getSezonyKlubu(klub.id),
    getStatystykiKlubu(klub.id),
    getPodsumowanieKlubu(klub.id),
    getStartyKlubu(klub.id),
    getKlubPanel(klub.id),
  ])

  const photos = await getZawodnicyPhotos(sklad.players.map((p) => p.id))

  // Nadpisania z panelu redaktora
  const nazwa = panel?.nazwa || klub.nazwa
  const media = getKlubMedia(nazwa)
  const logoUrl = panel?.logoUrl || media?.logo || undefined
  const poziomLigi = panel?.poziomLigi
  const links = panel?.links || []

  // Karty "Zawodnicy klubu": jeśli redaktor ustawił załogę — używamy jej; inaczej skład z bazy wyników.
  const zawodnicyCards =
    panel?.zaloga && panel.zaloga.length > 0
      ? panel.zaloga.map((z) => ({
          nazwa: `${z.imie} ${z.nazwisko}`.trim(),
          href: `/zawodnicy/${z.slug}`,
          imageUrl: z.zdjecieUrl,
        }))
      : sklad.players.map((p) => ({
          nazwa: `${p.imie} ${p.nazwisko}`,
          href: `/zawodnicy/${p.slug}`,
          imageUrl: photos.get(p.id),
        }))

  const skladRows: TableCell[][] = sklad.players.map((p) => [
    { value: p.imie, href: `/zawodnicy/${p.slug}` },
    { value: p.nazwisko, href: `/zawodnicy/${p.slug}` },
    { value: p.ligi },
    { value: String(p.starty) },
  ])

  const sezonyRows: TableCell[][] = sezony.map((s) => [
    { value: String(s.rok) },
    { value: s.poziom.replace('Youth', 'Młodzieżowa') },
    { value: s.klub },
    { value: String(s.miejsce), place: s.miejsce },
  ])

  const startyRows: TableCell[][] = starty.map((s) => [
    { value: String(s.rok) },
    { value: s.regaty },
    { value: s.zespol },
    { value: String(s.miejsce), place: s.miejsce > 0 ? s.miejsce : null },
  ])

  const summaryGroups: StatGroup[] = [
    {
      cards: [
        { label: 'Starty w regatach', value: pods.starty },
        { label: 'Wygrane regaty', value: pods.wygraneRegaty },
        { label: 'Zdobyte punkty', value: pods.punkty },
      ],
    },
  ]
  if (pods.ekstra) {
    summaryGroups.push({
      title: 'Ekstraklasa',
      cards: [
        { label: 'Starty (Ekstraklasa)', value: pods.ekstra.starty },
        { label: 'Wygrane (Ekstraklasa)', value: pods.ekstra.wygrane },
        { label: 'Punkty (Ekstraklasa)', value: pods.ekstra.punkty },
      ],
    })
  }

  return (
    <main className="bg-slate-50">
      {/* HERO — na razie sam granat (bez zdjęcia zespołu) */}
      <section className="relative bg-navy text-white">
        <div className="relative mx-auto max-w-[1440px] px-4 pb-24 pt-10 md:pb-28">
          <Link href="/kluby" className="text-sm font-semibold text-white/80 hover:text-white">
            ← Wszystkie zespoły
          </Link>
        </div>
      </section>

      {/* KARTA TREŚCI nachodząca na hero */}
      <section className="relative z-10 mx-auto -mt-20 max-w-[1440px] px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* SIDEBAR */}
          <aside className="order-first lg:order-last lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
              <div className="mx-auto -mt-16 mb-4 flex aspect-square w-40 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt={nazwa} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-4xl font-bold text-slate-300">{nazwa.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <SummaryCards stars={pods.mistrzostwa} groups={summaryGroups} />
            </div>
          </aside>

          {/* MAIN */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg lg:col-span-2 lg:p-8">
            {/* NAGŁÓWEK KLUBU */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold uppercase tracking-wide text-navy md:text-4xl">{nazwa}</h1>
              {poziomLigi && <p className="mt-1 text-sm font-bold uppercase tracking-wide text-brand-red">{poziomLigi}</p>}
              {links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border-2 border-navy/15 px-4 py-1.5 text-sm font-semibold text-navy transition hover:border-brand-red hover:text-brand-red"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-12">
              <Sekcja tytul="Historia sezonów">
                {sezonyRows.length === 0 ? (
                  <p className="text-slate-500">Brak historii sezonów.</p>
                ) : (
                  <MoreTable headers={['Rok', 'Liga', 'Nazwa zespołu', 'Miejsce']} rows={sezonyRows} limit={3} />
                )}
              </Sekcja>

              <Sekcja tytul="Wyniki regat (TOP 3)">
                <PodiaTable rows={statystyki.podia} />
              </Sekcja>

              <Sekcja tytul="Statystyki klubu">
                <StatsTable
                  rows={statystyki.stats.rows}
                  totals={{
                    regaty: statystyki.stats.totalRegaty,
                    wyscigi: statystyki.stats.totalWyscigi,
                    wygrane: statystyki.stats.totalWygrane,
                  }}
                />
              </Sekcja>

              <ProfileCards title="Zawodnicy klubu" items={zawodnicyCards} />

              <Sekcja tytul={`Skład zespołu${sklad.rok ? ` — ${sklad.rok}` : ''}`}>
                {skladRows.length === 0 ? (
                  <p className="text-slate-500">Brak danych o składzie.</p>
                ) : (
                  <MoreTable headers={['Imię', 'Nazwisko', 'Poziom ligi', 'Starty']} rows={skladRows} limit={4} />
                )}
              </Sekcja>

              <Sekcja tytul="Lista startów">
                {startyRows.length === 0 ? (
                  <p className="text-slate-500">Brak historii startów.</p>
                ) : (
                  <MoreTable headers={['Rok', 'Regaty', 'Zespół', 'Miejsce']} rows={startyRows} limit={5} />
                )}
              </Sekcja>
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
