import { getPayload } from 'payload'
import configPromise from '@payload-config'
import VideoPlayer from '@/components/VideoPlayer'
import YouTubePlayer from '@/components/YouTubePlayer'
import React from 'react'

export const dynamic = 'force-dynamic'

const HLS_BASE = process.env.NEXT_PUBLIC_HLS_URL || 'http://localhost:8888'

export default async function TransmisjePage() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'transmisje',
    where: { aktywny: { equals: true } },
    limit: 50,
  })
  const streams: any[] = res.docs

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          NA ŻYWO
        </span>
        <h1 className="text-3xl font-bold">Transmisje na żywo</h1>
      </div>

      {streams.length === 0 ? (
        <div className="rounded-xl bg-slate-100 p-12 text-center text-slate-500">
          <div className="mb-3 text-4xl">📡</div>
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
              <h2 className="mt-3 text-lg font-semibold">{s.tytul}</h2>
              {s.opis && <p className="mt-1 text-sm text-slate-500">{s.opis}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
