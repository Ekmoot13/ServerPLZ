// Regatowa Strefa Kibica — transmisje na żywo, mapa SAP (RaceBoard), wyniki, informacje.
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import SapLeaderboard from '@/components/SapLeaderboard'
import SapViewer from '@/components/SapViewer'
import StrefaTransmisja from '@/components/StrefaTransmisja'
import { Ikona } from '@/components/strefa/ikony'
import React from 'react'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Strefa Kibica — Polska Liga Żeglarska' }

const HLS_BASE = process.env.NEXT_PUBLIC_HLS_URL || 'http://localhost:8888'

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
      NA ŻYWO
    </span>
  )
}

export default async function RegatowaStrefaKibicaPage() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'transmisje',
    where: { aktywny: { equals: true } },
    limit: 50,
  })
  const streams: any[] = res.docs

  const settings: any = await payload.findGlobal({ slug: 'strefa-kibica' }).catch(() => null)
  const mapaUrl: string = settings?.mapaUrl || ''
  const pokazMape: boolean = settings?.pokazMape !== false
  const sapBase: string = settings?.sapBase || 'https://plz2026.sapsailing.com'
  const leaderboardName: string = settings?.leaderboardName || ''
  const pokazProgram: boolean = settings?.pokazProgram !== false
  const programTytul: string = settings?.programTytul || 'Śledź z nami regaty dzień po dniu'
  const programWstep: string = settings?.programWstep || ''
  const linki: any[] = Array.isArray(settings?.linki) ? settings.linki : []
  const program: any[] = Array.isArray(settings?.program) ? settings.program : []
  const mapaEmbed: string = settings?.mapaEmbed || ''

  // stan „na żywo" — pokazuj czerwone plakietki tylko gdy coś faktycznie leci
  const mapaLive = pokazMape && !!mapaUrl
  const streamLive = streams.length > 0
  const wynikiLive = !!leaderboardName
  const anyLive = mapaLive || streamLive || wynikiLive

  return (
    <main>
      {/* PASEK TYTUŁOWY */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-4 py-6">
          <h1 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Strefa Kibica</h1>
          {anyLive && <LiveBadge />}
          <p className="ml-auto hidden text-sm text-white/70 md:block">
            Mapa, transmisja i wyniki na żywo — w jednym miejscu.
          </p>
        </div>
      </section>

      {/* DASHBOARD: MAPA | TRANSMISJA + WYNIKI (ciemne tło) */}
      <section className="bg-navy-900" style={patternBg}>
        <div className="mx-auto max-w-[1600px] px-4 py-6">
          <div className="grid gap-4 lg:h-[80vh] lg:grid-cols-[1.8fr_1fr]">
            {/* LEWA — MAPA SAP */}
            <div className="flex min-h-[360px] flex-col lg:h-full">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wide text-white/85">Mapa wyścigu — pozycje łódek na żywo</h2>
                {mapaLive && <LiveBadge />}
              </div>
              <div className="min-h-0 flex-1">
                {pokazMape && mapaUrl ? (
                  <SapViewer src={mapaUrl} fill />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
                    <div className="mb-2 text-4xl">🗺️</div>
                    <p className="font-medium">Mapa z pozycjami łódek (SAP) pojawi się w trakcie regat.</p>
                  </div>
                )}
              </div>
            </div>

            {/* PRAWA — TRANSMISJA (góra) + WYNIKI (dół) */}
            <div className="grid gap-4 lg:h-full lg:grid-rows-2">
              {/* TRANSMISJA */}
              <div className="flex min-h-[240px] flex-col overflow-hidden">
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-white/85">Transmisja na żywo</h2>
                  {streamLive && <LiveBadge />}
                </div>
                <div className="min-h-0 flex-1">
                  <StrefaTransmisja streams={streams} hlsBase={HLS_BASE} />
                </div>
              </div>

              {/* WYNIKI */}
              <div className="flex min-h-[240px] flex-col overflow-hidden">
                <div className="mb-2 flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-white/85">Wyniki na żywo</h2>
                  {wynikiLive && <LiveBadge />}
                </div>
                <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-white/10 bg-white/5">
                  {leaderboardName ? (
                    <div className="bg-white">
                      <SapLeaderboard name={leaderboardName} base={sapBase} />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white/60">
                      <div className="mb-2 text-3xl">🏁</div>
                      Wyniki na żywo z danych regat pojawią się w trakcie rundy.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEKCJA INFORMACYJNA — PROGRAM WEEKENDU (edytowalna w panelu redaktora) */}
      {pokazProgram && (
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">{programTytul}</h2>
            <div className="mt-2 mb-6 h-1 w-14 rounded-full bg-brand-red" />
            {programWstep && <p className="mb-6 max-w-3xl whitespace-pre-line text-slate-700 md:text-lg">{programWstep}</p>}

            {/* szybkie linki */}
            {linki.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-3">
                {linki.map((l: any, i: number) =>
                  l?.url ? (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border-2 border-navy px-5 py-2 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
                    >
                      {l.ikona && <Ikona name={l.ikona} className="text-navy group-hover:text-white" />}
                      {l.label || l.url}
                    </a>
                  ) : null,
                )}
              </div>
            )}

            {/* program dzień po dniu */}
            {program.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2">
                {program.map((d: any, di: number) => (
                  <div key={di} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <h3 className="font-extrabold uppercase tracking-wide text-navy">{d?.tytul}</h3>
                    <div className="mt-2 mb-4 h-0.5 w-10 rounded-full bg-brand-red" />
                    <ul className="space-y-2.5">
                      {(Array.isArray(d?.pozycje) ? d.pozycje : []).map((p: any, pi: number) => (
                        <li key={pi} className="flex items-center gap-3 text-sm text-slate-700">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center text-navy">
                            {p?.ikona ? <Ikona name={p.ikona} className="text-navy" /> : <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />}
                          </span>
                          {p?.czas && <span className="shrink-0 font-bold text-navy">{p.czas}</span>}
                          {p?.link ? (
                            <a href={p.link} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-red hover:underline">
                              {p.opis}
                            </a>
                          ) : (
                            <span>{p?.opis}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* lokalizacja */}
            {mapaEmbed && (
              <div className="mt-12">
                <h3 className="text-xl font-extrabold uppercase tracking-wide text-navy">Lokalizacja</h3>
                <div className="mt-2 mb-5 h-1 w-12 rounded-full bg-brand-red" />
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <iframe
                    src={mapaEmbed}
                    title="Lokalizacja regat"
                    className="h-[360px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
