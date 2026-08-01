'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface Props {
  hlsUrl: string
  title?: string
}

export default function VideoPlayer({ hlsUrl, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setLoading(true)
    setError(null)

    if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        enableWorker: true,
      })
      hlsRef.current = hls
      hls.loadSource(hlsUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false)
        video.play().catch(() => {})
      })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError('Nie można załadować transmisji. Sprawdź, czy stream jest aktywny.')
          setLoading(false)
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl
      video.addEventListener('loadedmetadata', () => {
        setLoading(false)
        video.play().catch(() => {})
      })
    } else {
      setError('Twoja przeglądarka nie obsługuje odtwarzania HLS.')
      setLoading(false)
    }

    return () => {
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [hlsUrl])

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
            <p className="text-sm text-white">Ładowanie transmisji…</p>
          </div>
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90">
          <div className="px-6 text-center">
            <div className="mb-3 text-4xl">📡</div>
            <p className="font-medium text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm text-white transition-colors hover:bg-sky-500"
            >
              Odśwież
            </button>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="h-full w-full"
          controls
          playsInline
          muted
          aria-label={title || 'Transmisja na żywo'}
        />
      )}

      {title && !error && (
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          NA ŻYWO
        </div>
      )}
    </div>
  )
}
