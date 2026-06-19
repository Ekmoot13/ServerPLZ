"use client";

interface Props {
  url: string;
  title?: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function YouTubePlayer({ url, title }: Props) {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return (
      <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
        <p className="text-red-400">Nieprawidłowy URL YouTube</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`;

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-black" style={{ aspectRatio: "16/9" }}>
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          NA ŻYWO
        </span>
        <span className="bg-red-500/90 text-white text-xs px-2 py-1 rounded font-medium">YouTube</span>
      </div>
      <iframe
        src={embedUrl}
        title={title || "Transmisja YouTube na żywo"}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
