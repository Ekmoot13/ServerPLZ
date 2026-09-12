// Kalendarz regat — grupowany wg poziomu ligi, edytowalny w panelu.
// Status liczony na bieżąco z daty (chyba że redaktor wyłączył automat). Odbyte są wyszarzone.
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { statusRegat, orderedPoziomy, poziomIndexMap } from '@/lib/kalendarz'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Kalendarz — Polska Liga Żeglarska' }

const MIES = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
]

const U = 'https://ligazeglarska.pl/wp-content/uploads'
// eslint-disable-next-line @next/next/no-img-element
const Img = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />

// Logo i kolor wiodacy poziomu - uzywane w naglowku sekcji i w ramkach kart.
// Kolory lig regionalnych sa te same co na stronie Ligi Regionalne.
// tloLogo: logo glowne ma biale elementy, ktore gina na jasnym tle -
// takie logotypy sadzamy na granatowym kafelku, jak logo Mlodziezowej.
const STYL_POZIOMU: { test: RegExp; logo?: string; kolor: string; tloLogo?: string }[] = [
  { test: /ekstraklasa/i, logo: '/logo.png', kolor: '#17326b', tloLogo: '#17326b' },
  { test: /^(1|i)\s*liga$/i, logo: '/logo-1-liga.jpg', kolor: '#d82029' },
  { test: /m[łl]odzie|youth/i, logo: '/logo-mlodziezowa.jpg', kolor: '#0ea5e9' },
  { test: /tr[oó]jmiejsk/i, logo: `${U}/2025/11/TLZ_LOGO_PION_KOLOR-1.png`, kolor: '#0aa2c0' },
  { test: /wielkopolsk/i, logo: `${U}/2025/11/WLZ_LOGO_PION_KOLOR.png`, kolor: '#de5a0f' },
  { test: /centraln/i, logo: `${U}/2025/11/CLZ_LOGO_PION_KOLOR.png`, kolor: '#6fa300' },
  { test: /fina[łl].*regionaln/i, logo: '/logo.png', kolor: '#17326b', tloLogo: '#17326b' },
]
function stylPoziomu(poziom: string): { logo?: string; kolor: string; tloLogo?: string } {
  return STYL_POZIOMU.find((x) => x.test.test(poziom || '')) || { kolor: '#17326b' }
}

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

function fancyDate(od?: string | null, doo?: string | null): string {
  if (!od) return ''
  const a = new Date(od)
  const b = doo ? new Date(doo) : null
  const y = a.getFullYear()
  if (!b || (a.getMonth() === b.getMonth() && a.getDate() === b.getDate())) {
    return `${a.getDate()} ${MIES[a.getMonth()]} ${y}`
  }
  if (a.getMonth() === b.getMonth()) {
    return `${a.getDate()}–${b.getDate()} ${MIES[a.getMonth()]} ${y}`
  }
  return `${a.getDate()} ${MIES[a.getMonth()]} – ${b.getDate()} ${MIES[b.getMonth()]} ${y}`
}

// krótka etykieta (np. "Runda 1") wyciągnięta z nazwy, inaczej cała nazwa
function shortLabel(nazwa: string): string {
  const m = (nazwa || '').match(/runda\s*\d+/i)
  return m ? m[0].replace(/^r/, 'R') : nazwa
}

export default async function KalendarzPage() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({ collection: 'kalendarz' as any, limit: 300, depth: 0, sort: 'dataOd' })
  const terminy = res.docs as any[]

  // kolejność poziomów ustawiona przez redaktora (globalny obiekt)
  const ustawienia: any = await payload
    .findGlobal({ slug: 'kalendarz-ustawienia' as any })
    .catch(() => null)
  const zapisane: string[] = Array.isArray(ustawienia?.poziomy)
    ? ustawienia.poziomy.map((p: any) => (p?.nazwa || '').trim()).filter(Boolean)
    : []

  // grupowanie po poziomie
  const groupsMap = new Map<string, any[]>()
  for (const t of terminy) {
    const key = (t.poziom || 'Inne').trim() || 'Inne'
    if (!groupsMap.has(key)) groupsMap.set(key, [])
    groupsMap.get(key)!.push(t)
  }

  const kolejnosc = orderedPoziomy(zapisane, [...groupsMap.keys()])
  const idx = poziomIndexMap(kolejnosc)

  const groups = [...groupsMap.entries()].map(([poziom, items]) => {
    // regaty w obrębie ligi zawsze po dacie (rosnąco)
    items.sort((a, b) => new Date(a.dataOd || 0).getTime() - new Date(b.dataOd || 0).getTime())
    return { poziom, items }
  })
  groups.sort((a, b) => {
    const oa = idx[a.poziom] ?? 999
    const ob = idx[b.poziom] ?? 999
    return oa - ob
  })

  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-20">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-brand-red">Sezon 2026</p>
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Kalendarz regat</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <p className="mx-auto mt-6 max-w-2xl text-white/85 md:text-lg">
            Terminy i miejsca rozgrywek Polskiej Ligi Żeglarskiej.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {groups.length === 0 ? (
          <p className="text-slate-500">Kalendarz jest pusty — dodaj terminy w panelu.</p>
        ) : (
          <div className="space-y-14">
            {groups.map((g) => {
              const styl = stylPoziomu(g.poziom)
              return (
              <div key={g.poziom}>
                <div className="mb-6 flex items-center gap-4">
                  {styl.logo && (
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-300"
                      style={{ backgroundColor: styl.tloLogo }}
                    >
                      <Img
                        src={styl.logo}
                        alt={g.poziom}
                        className={styl.tloLogo ? 'h-9 w-9 object-contain' : 'h-full w-full object-contain'}
                      />
                    </span>
                  )}
                  <span className="h-8 w-1.5 rounded-full" style={{ backgroundColor: styl.kolor }} />
                  <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy">{g.poziom}</h2>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: `${styl.kolor}1a`, color: styl.kolor }}
                  >
                    {g.items.length}
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {g.items.map((t) => {
                    const s = statusRegat(t)
                    const past = s === 'odbyly-sie'
                    const live = s === 'w-trakcie'
                    // Kolor ligi niesie ramka i gorny pasek; odbyte regaty wyszarzamy.
                    const inner = (
                      <div
                        className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 ${
                          past ? 'opacity-70' : 'hover:-translate-y-1 hover:shadow-lg'
                        }`}
                        style={{
                          // Kolor ligi niosa ramka i pasek takze po regatach - tylko przygaszony.
                          borderColor: `${styl.kolor}${past ? '24' : '59'}`,
                          boxShadow: live ? `0 0 0 2px ${styl.kolor}` : undefined,
                        }}
                      >
                        <div
                          className="h-1.5 w-full"
                          style={{ backgroundColor: `${styl.kolor}${past ? '66' : ''}` }}
                        />
                        <div className="p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              {shortLabel(t.nazwa)}
                            </span>
                            {live && (
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                                style={{ backgroundColor: styl.kolor }}
                              >
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                                NA ŻYWO
                              </span>
                            )}
                            {past && <span className="text-emerald-600" title="Odbyły się">✓</span>}
                          </div>
                          <div className={`text-xl font-extrabold leading-tight ${past ? 'text-slate-500' : 'text-navy'}`}>
                            {fancyDate(t.dataOd, t.dataDo)}
                          </div>
                          {t.miejsce && (
                            <div className="mt-1 text-sm font-medium text-slate-500">{t.miejsce}</div>
                          )}
                          {t.link && (
                            <span
                              className="mt-3 inline-block text-sm font-semibold group-hover:underline"
                              style={{ color: styl.kolor }}
                            >
                              {live ? 'Śledź na żywo →' : past ? 'Wyniki →' : 'Szczegóły →'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                    return t.link ? (
                      <a key={t.id} href={t.link} target="_blank" rel="noopener noreferrer" className="block">
                        {inner}
                      </a>
                    ) : (
                      <div key={t.id}>{inner}</div>
                    )
                  })}
                </div>
              </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
