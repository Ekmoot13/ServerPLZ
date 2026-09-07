'use client'
import React, { useState } from 'react'
import VideoPlayer from '@/components/VideoPlayer'
import YouTubePlayer from '@/components/YouTubePlayer'

export type Stream = {
  id: string
  typ?: string
  youtubeUrl?: string
  rtmpKey?: string
  tytul?: string
  opis?: string
}

export default function StrefaTransmisja({ streams, hlsBase }: { streams: Stream[]; hlsBase: string }) {
  const [aktywny, setAktywny] = useState(0)
  if (!streams.length) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
        <div className="mb-2 text-3xl">📡</div>
        <p className="font-medium">Transmisja pojawi się w trakcie regat.</p>
      </div>
    )
  }
  const s = streams[Math.min(aktywny, streams.length - 1)]
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="overflow-hidden rounded-xl bg-black">
        {s.typ === 'youtube' ? (
          <YouTubePlayer url={s.youtubeUrl || ''} title={s.tytul || ''} />
        ) : (
          <VideoPlayer hlsUrl={`${hlsBase}/live/${s.rtmpKey}/index.m3u8`} title={s.tytul || ''} />
        )}
      </div>
      {streams.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {streams.map((st, i) => (
            <button
              key={st.id}
              onClick={() => setAktywny(i)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                i === aktywny
                  ? 'border-brand-red bg-brand-red text-white'
                  : 'border-white/25 text-white/70 hover:border-brand-red hover:text-white'
              }`}
            >
              {st.tytul || `Kamera ${i + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
