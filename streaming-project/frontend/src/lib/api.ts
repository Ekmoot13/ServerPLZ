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

export interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  stream_id: string | null;
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

  // Streams
  getLiveStreams: () => request<Stream[]>("/streams/"),
  getAllStreams: () => request<Stream[]>("/streams/all"),
  getStream: (id: string) => request<Stream>(`/streams/${id}`),
  createStream: (title: string, description?: string, youtube_url?: string) =>
    request<Stream>("/streams/", { method: "POST", body: JSON.stringify({ title, description, youtube_url }) }),

  // Events
  getEvents: () => request<Event[]>("/events/"),
  getEvent: (id: string) => request<Event>(`/events/${id}`),
};
