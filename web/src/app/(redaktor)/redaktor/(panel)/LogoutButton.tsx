'use client'
import React, { useState } from 'react'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  async function logout() {
    setLoading(true)
    try {
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    } catch {
      /* ignoruj */
    }
    window.location.href = '/redaktor/login'
  }
  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
    >
      {loading ? '…' : 'Wyloguj'}
    </button>
  )
}
