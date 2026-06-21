const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Stream {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  status: "live" | "offline";
  started_at: string | null;
  hls_url: string | null;
  owner_name: string;
}

export interface StreamAdmin {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string | null;
  rtmp_key: string;
  status: "live" | "offline";
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  hls_url: string | null;
  owner: { id: string; email: string; display_name: string; role: string; created_at: string };
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  stream_id: string | null;
  sap_event_id: string | null;
  results: Record<string, unknown> | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  role: "admin" | "viewer";
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Błąd API");
  }
  if (res.status === 204) return null as T;
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ access_token: string }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password }),
    }),

  register: (email: string, password: string, display_name: string) =>
    request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name }),
    }),

  me: () => request<User>("/auth/me"),

  // Streams (public)
  getLiveStreams: () => request<Stream[]>("/streams/"),
  getStream: (id: string) => request<Stream>(`/streams/${id}`),

  // Streams (admin)
  getAllStreams: () => request<StreamAdmin[]>("/streams/all"),
  createStream: (title: string, description?: string, youtube_url?: string) =>
    request<StreamAdmin>("/streams/", { method: "POST", body: JSON.stringify({ title, description, youtube_url }) }),
  updateStream: (id: string, data: { title?: string; description?: string; youtube_url?: string; status?: string }) =>
    request<StreamAdmin>(`/streams/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteStream: (id: string) =>
    request<null>(`/streams/${id}`, { method: "DELETE" }),

  // Events
  getEvents: () => request<Event[]>("/events/"),
  getEvent: (id: string) => request<Event>(`/events/${id}`),
  createEvent: (data: { title: string; description?: string; event_date: string; sap_event_id?: string }) =>
    request<Event>("/events/", { method: "POST", body: JSON.stringify(data) }),
  deleteEvent: (id: string) => request<null>(`/events/${id}`, { method: "DELETE" }),
};
