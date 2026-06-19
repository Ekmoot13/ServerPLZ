import Link from "next/link";
import type { Stream } from "@/lib/api";

interface Props {
  stream: Stream;
}

export default function StreamCard({ stream }: Props) {
  const isLive = stream.status === "live";

  return (
    <Link
      href={`/stream/${stream.id}`}
      className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-slate-200"
    >
      <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
        <span className="text-slate-600 text-5xl">🎥</span>

        {isLive && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            NA ŻYWO
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {stream.title}
        </h3>
        <p className="text-sm text-slate-500 mt-1">{stream.owner_name}</p>

        {stream.description && (
          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{stream.description}</p>
        )}

        {stream.started_at && (
          <p className="text-xs text-slate-400 mt-3">
            {isLive ? "Trwa od: " : "Transmisja: "}
            {new Date(stream.started_at).toLocaleString("pl-PL")}
          </p>
        )}
      </div>
    </Link>
  );
}
