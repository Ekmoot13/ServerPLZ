'use client'
import React, { useEffect, useState } from 'react'

/**
 * Mapa wyścigu z SAP (widok RaceBoard) osadzona w ramce.
 *
 * Adres RaceBoard wskazuje KONKRETNY wyścig — bez `raceName` SAP odmawia. Gdy
 * redaktor zostawi pole adresu puste, składamy adres sami i włączamy `sledz`:
 * komponent dopytuje, który wyścig jest teraz aktualny, i proponuje przejście
 * na niego.
 *
 * Celowo nie przełączamy mapy sami. Kibic może właśnie odtwarzać zakończony
 * przebieg albo przewijać oś czasu — podmiana ramki pod ręką skasowałaby mu to
 * bez ostrzeżenia. Pokazujemy więc pasek „trwa nowy wyścig" i zostawiamy
 * decyzję jemu.
 */
export default function SapViewer({
  src,
  fill = false,
  sledz = false,
}: {
  src: string
  fill?: boolean
  /** Czy pytać SAP o kolejne wyścigi i proponować przejście na nie. */
  sledz?: boolean
}) {
  const [adres, setAdres] = useState(src)
  const [nowy, setNowy] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sledz) return
    let przerwane = false

    const sprawdz = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const r = await fetch('/api/wyniki', { cache: 'no-store' })
        if (!r.ok) return
        const d = await r.json()
        const a = typeof d?.adresMapy === 'string' ? d.adresMapy : null
        if (!przerwane && a && a !== adres) setNowy(a)
      } catch {
        // Cisza — mapa dalej pokazuje to, co pokazywała.
      }
    }

    const id = setInterval(sprawdz, 20000)
    document.addEventListener('visibilitychange', sprawdz)
    return () => {
      przerwane = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', sprawdz)
    }
  }, [sledz, adres])

  const przejdz = () => {
    if (!nowy) return
    setLoading(true)
    setAdres(nowy)
    setNowy(null)
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 ${fill ? 'h-full' : ''}`}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900 text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
            <p className="text-sm">Ładowanie mapy wyścigu…</p>
          </div>
        </div>
      )}

      {nowy && (
        <button
          type="button"
          onClick={przejdz}
          className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-red-600"
        >
          Trwa nowy wyścig — pokaż
        </button>
      )}

      <iframe
        key={adres}
        src={adres}
        title="Mapa wyścigu — SAP Sailing"
        className={fill ? 'h-full min-h-[420px] w-full' : 'h-[600px] w-full'}
        onLoad={() => setLoading(false)}
        allow="fullscreen; geolocation"
      />
    </div>
  )
}
