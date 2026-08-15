// STRONA GŁÓWNA = Strefa Kibica (transmisje na żywo, mapa SAP, wyniki, informacje).
// Stara strona główna została odpięta do page-stara-glowna.tsx.
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import VideoPlayer from '@/components/VideoPlayer'
import YouTubePlayer from '@/components/YouTubePlayer'
import SapLeaderboard from '@/components/SapLeaderboard'
import SapViewer from '@/components/SapViewer'
import React from 'react'

export const dynamic = 'force-dynamic'

const HLS_BASE = process.env.NEXT_PUBLIC_HLS_URL || 'http://localhost:8888'

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
      NA ŻYWO
    </span>
  )
}

const SAP_VIEWER = `${process.env.SAP_MAP_BASE || 'https://plz2026.sapsailing.com'}/gwt/Home.html`

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'transmisje',
    where: { aktywny: { equals: true } },
    limit: 50,
  })
  const streams: any[] = res.docs

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-4"><LiveBadge /></div>
          <h1 className="text-4xl font-bold md:text-5xl">Strefa Kibica</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Oglądaj regaty na żywo — transmisje z kamer (w tym 360°), mapa wyścigu i wyniki
            w czasie rzeczywistym w jednym miejscu.
          </p>
        </div>
      </section>

      {/* TRANSMISJE NA ŻYWO */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-2xl font-bold">Transmisje na żywo</h2>
          <Link href="/transmisje" className="text-sm text-sky-600 hover:underline">wszystkie →</Link>
        </div>
        {streams.length === 0 ? (
          <div className="rounded-xl bg-slate-100 p-10 text-center text-slate-500">
            <div className="mb-2 text-4xl">📡</div>
            <p className="font-medium">Obecnie nie trwają żadne transmisje.</p>
            <p className="text-sm">Zajrzyj tu w trakcie regat.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {streams.map((s) => (
              <div key={s.id}>
                {s.typ === 'youtube' ? (
                  <YouTubePlayer url={s.youtubeUrl} title={s.tytul} />
                ) : (
                  <VideoPlayer hlsUrl={`${HLS_BASE}/live/${s.rtmpKey}/index.m3u8`} title={s.tytul} />
                )}
                <h3 className="mt-3 text-lg font-semibold">{s.tytul}</h3>
                {s.opis && <p className="mt-1 text-sm text-slate-500">{s.opis}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MAPA I WYNIKI NA ŻYWO (SAP) */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-2xl font-bold">Mapa wyścigu i wyniki na żywo</h2>
          <div className="mb-8">
            <SapViewer src={SAP_VIEWER} />
            <p className="mt-2 text-right text-xs text-slate-400">
              Mapa i replay: SAP Sailing Analytics.{' '}
              <a href={SAP_VIEWER} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                Otwórz w nowej karcie →
              </a>
            </p>
          </div>
          <SapLeaderboard name="Trójmiejska Liga Żeglarska 2026 Overall" />
        </div>
      </section>

      {/* INFORMACJE O REGATACH */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-6 text-2xl font-bold">Informacje o regatach</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-6">
            <h3 className="mb-2 font-semibold">Terminarz i miejsce</h3>
            <p className="text-sm text-slate-500">Najbliższe rundy i lokalizacje pojawią się tutaj z kalendarza sezonu.</p>
            <Link href="/kalendarium-2026" className="mt-3 inline-block text-sm text-sky-600 hover:underline">Kalendarz →</Link>
          </div>
          <div className="rounded-xl border border-slate-200 p-6">
            <h3 className="mb-2 font-semibold">Lista startowa</h3>
            <p className="text-sm text-slate-500">Załogi biorące udział w rundzie — do podpięcia z danych regat.</p>
            <Link href="/kluby" className="mt-3 inline-block text-sm text-sky-600 hover:underline">Kluby →</Link>
          </div>
          <div className="rounded-xl border border-slate-200 p-6">
            <h3 className="mb-2 font-semibold">Wyniki</h3>
            <p className="text-sm text-slate-500">Klasyfikacja rundy i ranking sezonu.</p>
            <Link href="/wyniki" className="mt-3 inline-block text-sm text-sky-600 hover:underline">Wyniki →</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
