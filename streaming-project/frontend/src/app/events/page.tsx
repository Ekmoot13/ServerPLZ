import { api } from "@/lib/api";

export const revalidate = 60;

export default async function EventsPage() {
  let events = [];
  try {
    events = await api.getEvents();
  } catch {
    // graceful fallback
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Wyniki Regat</h1>

      {events.length === 0 ? (
        <div className="bg-slate-100 rounded-xl p-10 text-center text-slate-500">
          <div className="text-4xl mb-3">🏆</div>
          <p className="font-medium">Brak wyników do wyświetlenia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{event.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(event.event_date).toLocaleDateString("pl-PL", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {event.description && (
                <p className="mt-3 text-slate-600">{event.description}</p>
              )}

              {event.results && (
                <div className="mt-4">
                  <h3 className="font-semibold text-slate-700 mb-2">Wyniki:</h3>
                  <pre className="bg-slate-50 rounded-lg p-4 text-sm text-slate-800 overflow-auto">
                    {JSON.stringify(event.results, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
