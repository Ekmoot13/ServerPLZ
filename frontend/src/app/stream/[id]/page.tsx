import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export const revalidate = 10;

export default async function StreamPage({ params }: Props) {
  let stream;
  try {
    stream = await api.getStream(params.id);
  } catch {
    notFound();
  }

  const isLive = stream.status === "live";

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
        ← Powrót do listy
      </Link>

      {/* Odtwarzacz */}
      <div>
        {isLive && stream.hls_url ? (
          <VideoPlayer hlsUrl={stream.hls_url} title={stream.title} />
        ) : (
          <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📴</div>
              <p className="text-slate-400 font-medium">Transmisja zakończona</p>
            </div>
          </div>
        )}
      </div>

      {/* Informacje o transmisji */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{stream.title}</h1>
            <p className="text-slate-500 mt-1">
              {stream.owner_name}
              {stream.started_at && (
                <span className="ml-3 text-sm">
                  • {new Date(stream.started_at).toLocaleString("pl-PL")}
                </span>
              )}
            </p>
          </div>

          <div>
            {isLive ? (
              <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 font-semibold text-sm px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                NA ŻYWO
              </span>
            ) : (
              <span className="inline-flex items-center bg-slate-100 text-slate-600 font-medium text-sm px-3 py-1.5 rounded-full">
                Zakończona
              </span>
            )}
          </div>
        </div>

        {stream.description && (
          <p className="mt-4 text-slate-700 leading-relaxed">{stream.description}</p>
        )}
      </div>
    </div>
  );
}
