'use client'
import React, { useEffect, useRef, useState } from 'react'

/**
 * Mapa wyścigu z SAP (widok RaceBoard) osadzona w ramce.
 *
 * Adres RaceBoard wskazuje KONKRETNY wyścig — bez `raceName` SAP odmawia. Gdy
 * redaktor zostawi pole adresu puste, składamy adres sami i włączamy `sledz`:
 * komponent pilnuje, który wyścig jest teraz aktualny, i sam się na niego
 * przestawia.
 *
 * Przełączamy bez pytania, bo strona ma chodzić także na ekranie w klubie,
 * gdzie nikt nie dotyka myszki. Cena jest taka, że komuś, kto akurat przewijał
 * oś czasu zakończonego przebiegu, ramka przeładuje się pod ręką — dlatego
 * mówimy o tym wprost plakietką nad mapą. Kto chce zostać przy jednym wyścigu,
 * ma od tego pole adresu w panelu: wpisany adres wyłącza całą automatykę.
 */
export default function SapViewer({
  src,
  fill = false,
  sledz = false,
}: {
  src: string
  fill?: boolean
  /** Czy pytać SAP o kolejne wyścigi i przestawiać się na nie. */
  sledz?: boolean
}) {
  const [adres, setAdres] = useState(src)
  const [loading, setLoading] = useState(true)
  const [przelaczono, setPrzelaczono] = useState(false)
  // Interwał ma nie wstawać od nowa po każdej zmianie adresu.
  const biezacy = useRef(src)
  // Adres przestawiamy dopiero, gdy SAP poda go dwa razy z rzędu — patrz niżej.
  const kandydat = useRef<{ adres: string; razy: number }>({ adres: '', razy: 0 })

  useEffect(() => {
    if (!sledz) return
    let przerwane = false
    let znikniecie: ReturnType<typeof setTimeout> | undefined

    const sprawdz = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const r = await fetch('/api/wyniki', { cache: 'no-store' })
        if (!r.ok) return
        const d = await r.json()
        const a = typeof d?.adresMapy === 'string' ? d.adresMapy : null
        // Pusta odpowiedź SAP-a zostawia mapę tam, gdzie była — zamiast mrugać.
        if (przerwane || !a) return
        if (a === biezacy.current) {
          kandydat.current = { adres: '', razy: 0 }
          return
        }

        // SAP potrafi na chwilę podać niepełny leaderboard i wtedy „bieżącym"
        // wyścigiem staje się poprzedni. Bez tego warunku mapa przeładowywałaby
        // się tam i z powrotem co dwadzieścia sekund — na ekranie w klubie
        // nikt by tego nie wyłączył. Żądamy więc dwóch zgodnych odpowiedzi.
        kandydat.current =
          kandydat.current.adres === a
            ? { adres: a, razy: kandydat.current.razy + 1 }
            : { adres: a, razy: 1 }
        if (kandydat.current.razy < 2) return

        kandydat.current = { adres: '', razy: 0 }
        biezacy.current = a
        setLoading(true)
        setAdres(a)
        setPrzelaczono(true)
        clearTimeout(znikniecie)
        znikniecie = setTimeout(() => setPrzelaczono(false), 8000)
      } catch {
        // Cisza — mapa dalej pokazuje to, co pokazywała.
      }
    }

    const id = setInterval(sprawdz, 20000)
    document.addEventListener('visibilitychange', sprawdz)
    return () => {
      przerwane = true
      clearInterval(id)
      clearTimeout(znikniecie)
      document.removeEventListener('visibilitychange', sprawdz)
    }
  }, [sledz])

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

      {przelaczono && !loading && (
        <p
          role="status"
          className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white shadow-lg"
        >
          Przełączono na nowy wyścig
        </p>
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
