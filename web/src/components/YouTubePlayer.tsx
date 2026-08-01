'use client'

interface Props {
  url: string
  title?: string
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url?.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function YouTubePlayer({ url, title }: Props) {
  const videoId = extractYouTubeId(url)

  if (!videoId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-black shadow-2xl">
        <p className="text-red-400">Nieprawidłowy link YouTube</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          NA ŻYWO
        </span>
        <span className="rounded bg-red-500/90 px-2 py-1 text-xs font-medium text-white">YouTube</span>
      </div>
      <iframe
        src={embedUrl}
        title={title || 'Transmisja YouTube na żywo'}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
