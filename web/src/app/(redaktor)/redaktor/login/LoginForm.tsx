'use client'
import React, { useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        setError('Nieprawidłowy e-mail lub hasło.')
        setLoading(false)
        return
      }
      // Pełne przeładowanie, żeby ciasteczko sesji zadziałało po stronie serwera.
      window.location.href = '/redaktor'
    } catch {
      setError('Błąd połączenia. Spróbuj ponownie.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-1 text-2xl font-bold">Panel redaktora</h1>
      <p className="mb-6 text-sm text-slate-500">Zaloguj się swoim kontem PLŻ.</p>

      <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="username"
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
      />

      <label className="mb-1 block text-sm font-medium text-slate-700">Hasło</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
      />

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-600 px-4 py-2 font-medium text-white transition hover:bg-sky-500 disabled:opacity-60"
      >
        {loading ? 'Logowanie…' : 'Zaloguj się'}
      </button>
    </form>
  )
}
