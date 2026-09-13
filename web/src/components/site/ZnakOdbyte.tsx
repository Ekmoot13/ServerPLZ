// Znak „odbyły się" — duży, półprzezroczysty ptaszek rozciągnięty na całą kartę terminu.
// Zastępuje małą emotkę; leży pod treścią i nie łapie kliknięć.
// preserveAspectRatio="none" rozciąga rysunek na pełną ramkę, a non-scaling-stroke
// pilnuje, żeby kreska została równej grubości mimo nierównego skalowania osi.
import React from 'react'

export default function ZnakOdbyte({ kolor = 'text-emerald-500/25' }: { kolor?: string }) {
  return (
    <>
      <svg
        viewBox="0 0 24 24"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full p-3 ${kolor}`}
      >
        <path
          d="M2 13 L9 19.5 L22 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={12}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="sr-only">Odbyły się</span>
    </>
  )
}
