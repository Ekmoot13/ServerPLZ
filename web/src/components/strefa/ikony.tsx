import React from 'react'

// Zestaw ikon do wyboru w panelu redaktora dla pozycji programu / linków.
export const IKONY_OPCJE: { value: string; label: string }[] = [
  { value: '', label: '— brak —' },
  { value: 'gazeta', label: 'Gazeta / zapowiedź' },
  { value: 'youtube', label: 'YouTube / wideo' },
  { value: 'sap', label: 'SAP / tracking' },
  { value: 'strzalka', label: 'Strzałka (sesje)' },
  { value: 'ptaszek', label: 'Ptaszek (odprawa)' },
  { value: 'puchar', label: 'Puchar (zakończenie)' },
  { value: 'aparat', label: 'Aparat / galeria' },
  { value: 'flaga', label: 'Flaga / start' },
  { value: 'zegar', label: 'Zegar' },
  { value: 'mapa', label: 'Mapa / lokalizacja' },
  { value: 'mikrofon', label: 'Mikrofon / konferencja' },
]

const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const SVG: Record<string, React.ReactNode> = {
  gazeta: (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M4 4h13v16H6a2 2 0 0 1-2-2V4Z" />
      <path d="M17 8h3v10a2 2 0 0 1-2 2" />
      <path d="M8 8h5M8 12h5M8 16h5" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15V9l5 3-5 3Z" />
    </svg>
  ),
  strzalka: (
    <svg viewBox="0 0 24 24" {...s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M13 8l4 4-4 4" />
    </svg>
  ),
  ptaszek: (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
  puchar: (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3" />
      <path d="M12 12v4M9 20h6M10 20v-2h4v2" />
    </svg>
  ),
  aparat: (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M3 8h3l1.5-2h9L18 8h3v11H3V8Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  ),
  flaga: (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M5 3v18M5 4h11l-2 3 2 3H5" />
    </svg>
  ),
  zegar: (
    <svg viewBox="0 0 24 24" {...s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  mapa: (
    <svg viewBox="0 0 24 24" {...s}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  mikrofon: (
    <svg viewBox="0 0 24 24" {...s}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
    </svg>
  ),
}

export function Ikona({ name, className = '' }: { name?: string; className?: string }) {
  if (!name) return null
  if (name === 'sap') {
    return (
      <span className={`inline-flex h-5 items-center rounded bg-current px-1 text-[9px] font-extrabold leading-none ${className}`}>
        <span className="text-white">SAP</span>
      </span>
    )
  }
  const el = SVG[name]
  if (!el) return null
  return <span className={`inline-flex h-5 w-5 ${className}`}>{el}</span>
}
