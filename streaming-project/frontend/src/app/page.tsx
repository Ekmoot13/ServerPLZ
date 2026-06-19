import StreamCard from "@/components/StreamCard";
import { api } from "@/lib/api";

export const revalidate = 30; // odświeżaj listę co 30s (Next.js ISR)

export default async function HomePage() {
  let liveStreams = [];

  try {
    liveStreams = await api.getLiveStreams();
  } catch {
    // Backend niedostępny — graceful fallback
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-slate-900">Aktualnie na żywo</h2>
          {liveStreams.length > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
              {liveStreams.length}
            </span>
          )}
        </div>

        {liveStreams.length === 0 ? (
          <div className="bg-slate-100 rounded-xl p-10 text-center text-slate-500">
            <div className="text-4xl mb-3">📡</div>
            <p className="font-medium">Żadna transmisja nie trwa aktualnie</p>
            <p className="text-sm mt-1">Sprawdź harmonogram wydarzeń poniżej</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveStreams.map((s) => (
              <StreamCard key={s.id} stream={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
