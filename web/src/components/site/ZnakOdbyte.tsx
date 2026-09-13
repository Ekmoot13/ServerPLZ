// Znak „odbyły się" — duży, półprzezroczysty ptaszek wypełniający kartę terminu.
// Zastępuje małą emotkę ✅; leży pod treścią i nie łapie kliknięć.
import React from 'react'

export default function ZnakOdbyte({ kolor = 'text-emerald-500/25' }: { kolor?: string }) {
  return (
    <>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`pointer-events-none absolute inset-0 h-full w-full p-4 ${kolor}`}
      >
        <path d="M3.5 12.5 L9.5 19 L20.5 5" />
      </svg>
      <span className="sr-only">Odbyły się</span>
    </>
  )
}
