'use client'
import React, { useState } from 'react'

export default function SapViewer({ src, fill = false }: { src: string; fill?: boolean }) {
  const [loading, setLoading] = useState(true)
  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 ${fill ? 'h-full' : ''}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900 text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
            <p className="text-sm">Ładowanie mapy wyścigu…</p>
          </div>
        </div>
      )}
      <iframe
        src={src}
        title="Mapa wyścigu — SAP Sailing"
        className={fill ? 'h-full min-h-[420px] w-full' : 'h-[600px] w-full'}
        onLoad={() => setLoading(false)}
        allow="fullscreen; geolocation"
      />
    </div>
  )
}
