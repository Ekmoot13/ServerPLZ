"use client";

import { useState, useEffect, useCallback } from "react";
import { api, StreamAdmin, Event } from "@/lib/api";

type Tab = "streams" | "create" | "events" | "create-event";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>("streams");
  const [streams, setStreams] = useState<StreamAdmin[]>([]);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Stream create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [streamType, setStreamType] = useState<"camera" | "youtube">("camera");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  // Event create form
  const [evTitle, setEvTitle] = useState("");
  const [evDescription, setEvDescription] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evSapId, setEvSapId] = useState("");
  const [evCreateLoading, setEvCreateLoading] = useState(false);
  const [evCreateError, setEvCreateError] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyRtmpUrl = (rtmpKey: string, id: string) => {
    const url = `rtmp://167.233.147.6:1935/live/${rtmpKey}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      });
    } else {
      const el = document.createElement("textarea");
      el.value = url;
      el.style.cssText = "position:fixed;top:-9999px;left:-9999px;";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  const fetchStreams = useCallback(async () => {
    setLoadingStreams(true);
    try {
      const data = await api.getAllStreams();
      setStreams(data);
    } catch { /* ignore */ } finally {
      setLoadingStreams(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch { /* ignore */ } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    if (token) { fetchStreams(); fetchEvents(); }
  }, [token, fetchStreams, fetchEvents]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Błąd logowania");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setStreams([]);
    setEvents([]);
  };

  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setCreateLoading(true);
    try {
      const yt = streamType === "youtube" ? youtubeUrl.trim() || undefined : undefined;
      await api.createStream(title.trim(), description.trim() || undefined, yt);
      setCreateSuccess("Transmisja utworzona!");
      setTitle(""); setDescription(""); setYoutubeUrl("");
      setTab("streams");
      fetchStreams();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Błąd tworzenia");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvCreateError("");
    setEvCreateLoading(true);
    try {
      await api.createEvent({
        title: evTitle.trim(),
        description: evDescription.trim() || undefined,
        event_date: new Date(evDate).toISOString(),
        sap_event_id: evSapId.trim() || undefined,
      });
      setEvTitle(""); setEvDescription(""); setEvDate(""); setEvSapId("");
      setTab("events");
      fetchEvents();
    } catch (err: unknown) {
      setEvCreateError(err instanceof Error ? err.message : "Błąd tworzenia");
    } finally {
      setEvCreateLoading(false);
    }
  };

  const handleDeleteStream = async (id: string) => {
    setDeleteId(id);
    try {
      await api.deleteStream(id);
      setStreams((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Błąd usuwania");
    } finally {
      setDeleteId(null);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await api.deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Błąd usuwania");
    }
  };

  const handleToggleStatus = async (stream: StreamAdmin) => {
    const newStatus = stream.status === "live" ? "offline" : "live";
    try {
      const updated = await api.updateStream(stream.id, { status: newStatus });
      setStreams((prev) => prev.map((s) => (s.id === stream.id ? updated : s)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Błąd aktualizacji");
    }
  };

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Panel Admina</h1>
          <p className="text-slate-500 text-sm mb-6">Zaloguj się kontem administratora</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hasło</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••" />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors">
              {loginLoading ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Panel Admina</h1>
        <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-600 transition-colors">Wyloguj</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit flex-wrap">
        {([["streams", `Transmisje (${streams.length})`], ["create", "+ Nowa transmisja"], ["events", `Wyniki (${events.length})`], ["create-event", "+ Nowe wydarzenie"]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => { setTab(t); setCreateError(""); setCreateSuccess(""); setEvCreateError(""); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* STREAMS LIST */}
      {tab === "streams" && (
        <div className="space-y-3">
          {loadingStreams ? (
            <div className="text-center py-12 text-slate-400">Ładowanie...</div>
          ) : streams.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-10 text-center text-slate-400">Brak transmisji. Utwórz pierwszą!</div>
          ) : streams.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full ${s.status === "live" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"}`}>
                    {s.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                    {s.status === "live" ? "NA ŻYWO" : "Offline"}
                  </span>
                  {s.youtube_url && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">YouTube</span>}
                </div>
                <h3 className="font-semibold text-slate-900 truncate">{s.title}</h3>
                {s.description && <p className="text-sm text-slate-500 truncate">{s.description}</p>}
                {!s.youtube_url && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-400">Link RTMP do kamerki:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 font-mono text-slate-700 break-all leading-relaxed">
                        rtmp://167.233.147.6:1935/live/{s.rtmp_key}
                      </code>
                      <button onClick={() => copyRtmpUrl(s.rtmp_key, s.id)}
                        className="shrink-0 text-xs px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors font-medium border border-blue-200">
                        {copiedId === s.id ? "✓ Skopiowano!" : "Kopiuj"}
                      </button>
                    </div>
                  </div>
                )}
                {s.youtube_url && <p className="text-xs text-slate-400 mt-1 truncate">{s.youtube_url}</p>}
                {s.started_at && <p className="text-xs text-slate-400 mt-1">Start: {new Date(s.started_at).toLocaleString("pl-PL")}</p>}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {s.youtube_url && (
                  <button onClick={() => handleToggleStatus(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${s.status === "live" ? "bg-slate-100 hover:bg-slate-200 text-slate-700" : "bg-green-100 hover:bg-green-200 text-green-700"}`}>
                    {s.status === "live" ? "Zakończ" : "Wznów"}
                  </button>
                )}
                <button onClick={() => { if (confirm(`Usunąć "${s.title}"?`)) handleDeleteStream(s.id); }}
                  disabled={deleteId === s.id}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 transition-colors">
                  {deleteId === s.id ? "..." : "Usuń"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE STREAM */}
      {tab === "create" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Nowa transmisja</h2>
          <div className="flex gap-2 mb-5">
            <button onClick={() => setStreamType("camera")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${streamType === "camera" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"}`}>
              📷 Kamera 360°
            </button>
            <button onClick={() => setStreamType("youtube")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${streamType === "youtube" ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-600 border-slate-300 hover:border-red-400"}`}>
              ▶ YouTube Live
            </button>
          </div>
          <form onSubmit={handleCreateStream} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tytuł *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Regaty Gdańsk 2025" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Opis (opcjonalny)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            {streamType === "youtube" ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL YouTube *</label>
                <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://www.youtube.com/watch?v=..." />
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
                Po utworzeniu zobaczysz klucz RTMP — wpisz go w kamerze jako stream key na adres{" "}
                <span className="font-mono font-semibold">rtmp://167.233.147.6:1935/live/</span>
              </div>
            )}
            {createError && <p className="text-red-500 text-sm">{createError}</p>}
            {createSuccess && <p className="text-green-600 text-sm font-medium">{createSuccess}</p>}
            <button type="submit" disabled={createLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors">
              {createLoading ? "Tworzenie..." : "Utwórz transmisję"}
            </button>
          </form>
        </div>
      )}

      {/* EVENTS LIST */}
      {tab === "events" && (
        <div className="space-y-3">
          {loadingEvents ? (
            <div className="text-center py-12 text-slate-400">Ładowanie...</div>
          ) : events.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-10 text-center text-slate-400">Brak wydarzeń. Dodaj pierwsze!</div>
          ) : events.map((ev) => (
            <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{ev.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(ev.event_date).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                {ev.description && <p className="text-sm text-slate-500 mt-1 truncate">{ev.description}</p>}
                {ev.sap_event_id && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded font-medium">SAP ID</span>
                    <code className="text-xs font-mono text-slate-600">{ev.sap_event_id}</code>
                  </div>
                )}
              </div>
              <button onClick={() => { if (confirm(`Usunąć "${ev.title}"?`)) handleDeleteEvent(ev.id); }}
                className="shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                Usuń
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CREATE EVENT */}
      {tab === "create-event" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Nowe wydarzenie / wyniki</h2>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tytuł *</label>
              <input type="text" value={evTitle} onChange={(e) => setEvTitle(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. YPLZ 2026 — finał" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Opis (opcjonalny)</label>
              <textarea value={evDescription} onChange={(e) => setEvDescription(e.target.value)} rows={2}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data wydarzenia *</label>
              <input type="datetime-local" value={evDate} onChange={(e) => setEvDate(e.target.value)} required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ID wydarzenia SAP Sailing (opcjonalny)</label>
              <input type="text" value={evSapId} onChange={(e) => setEvSapId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="dfc5682f-7cb5-41fa-982f-92fb17874694" />
              <p className="text-xs text-slate-400 mt-1">
                ID z URL: sapsailing.com/sailingserver/api/v1/events/<strong>ID</strong>
              </p>
            </div>
            {evCreateError && <p className="text-red-500 text-sm">{evCreateError}</p>}
            <button type="submit" disabled={evCreateLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors">
              {evCreateLoading ? "Tworzenie..." : "Utwórz wydarzenie"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
