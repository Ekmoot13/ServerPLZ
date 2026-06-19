"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface Props {
  hlsUrl: string;
  title?: string;
}

export default function VideoPlayer({ hlsUrl, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setLoading(true);
    setError(null);

    if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        enableWorker: true,
      });
      hlsRef.current = hls;

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError("Nie można załadować transmisji. Sprawdź czy stream jest aktywny.");
          setLoading(false);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari natywnie obsługuje HLS
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        video.play().catch(() => {});
      });
    } else {
      setError("Twoja przeglądarka nie obsługuje odtwarzania HLS.");
      setLoading(false);
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [hlsUrl]);

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm">Ładowanie transmisji...</p>
          </div>
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90">
          <div className="text-center px-6">
            <div className="text-4xl mb-3">📡</div>
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Odśwież
            </button>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          playsInline
          muted
          aria-label={title || "Transmisja na żywo"}
        />
      )}

      {title && !error && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          NA ŻYWO
        </div>
      )}
    </div>
  );
}
