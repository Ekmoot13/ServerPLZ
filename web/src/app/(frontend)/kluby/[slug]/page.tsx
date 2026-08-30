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
  const logoUrl = panel?.logoUrl
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
    <main>
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Link href="/kluby" className="text-sm text-sky-400 hover:underline">
            ← Wszystkie kluby
          </Link>
          <div className="mt-3 flex items-center gap-5">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={nazwa} className="h-20 w-20 rounded-lg bg-white object-contain p-1" />
            )}
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{nazwa}</h1>
              {poziomLigi && <p className="mt-1 text-sky-300">{poziomLigi}</p>}
            </div>
          </div>
          {links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/25 px-4 py-1.5 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-3">
        {/* SIDEBAR */}
        <aside className="order-first lg:order-last lg:col-span-1">
          <div className="mb-5 flex aspect-square w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-4">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={nazwa} className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-4xl font-bold text-slate-300">{nazwa.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <SummaryCards stars={pods.mistrzostwa} groups={summaryGroups} />
        </aside>

        {/* MAIN */}
        <div className="space-y-12 lg:col-span-2">
          {/* HISTORIA SEZONÓW */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Historia sezonów</h2>
            {sezonyRows.length === 0 ? (
              <p className="text-slate-500">Brak historii sezonów.</p>
            ) : (
              <MoreTable headers={['Rok', 'Liga', 'Nazwa zespołu', 'Miejsce']} rows={sezonyRows} limit={3} />
            )}
          </div>

          {/* WYNIKI REGAT (TOP 3) */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Wyniki regat (TOP 3)</h2>
            <PodiaTable rows={statystyki.podia} />
          </div>

          {/* STATYSTYKI KLUBU */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Statystyki klubu</h2>
            <StatsTable
              rows={statystyki.stats.rows}
              totals={{
                regaty: statystyki.stats.totalRegaty,
                wyscigi: statystyki.stats.totalWyscigi,
                wygrane: statystyki.stats.totalWygrane,
              }}
            />
          </div>

          {/* ZAWODNICY KLUBU (karty) */}
          <ProfileCards title="Zawodnicy klubu" items={zawodnicyCards} />

          {/* SKŁAD ZESPOŁU */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Skład zespołu{sklad.rok ? ` — ${sklad.rok}` : ''}
            </h2>
            {skladRows.length === 0 ? (
              <p className="text-slate-500">Brak danych o składzie.</p>
            ) : (
              <MoreTable headers={['Imię', 'Nazwisko', 'Poziom ligi', 'Starty']} rows={skladRows} limit={4} />
            )}
          </div>

          {/* LISTA STARTÓW (wszystkie regaty klubu) */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Lista startów</h2>
            {startyRows.length === 0 ? (
              <p className="text-slate-500">Brak historii startów.</p>
            ) : (
              <MoreTable headers={['Rok', 'Regaty', 'Zespół', 'Miejsce']} rows={startyRows} limit={5} />
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
