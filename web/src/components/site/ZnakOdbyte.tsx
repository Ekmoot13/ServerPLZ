// Znak „odbyły się" — duży, półprzezroczysty ptaszek wypełniający kartę terminu.
// Kształt kaligraficzny (wypełnienie, nie kreska): cienki na starcie, gruby
// w załamaniu, z długim pociągnięciem w górę zwężającym się do ostrza.
// Proporcja viewBox 2:1 odpowiada proporcji karty, więc rysunek wypełnia ramkę
// bez zniekształceń. Leży pod treścią i nie łapie kliknięć.
import React from 'react'

export default function ZnakOdbyte({ kolor = 'text-emerald-500/25' }: { kolor?: string }) {
  return (
    <>
      <svg
        viewBox="0 0 200 100"
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full p-2 ${kolor}`}
      >
        <path
          fill="currentColor"
          d="M16,46 C28,49 52,63 76,80 C106,52 146,26 184,5 C187,3 190,7 186,11
             C150,38 112,70 92,96 C87,102 77,102 72,95 C54,72 30,56 14,52
             C9,50 10,45 16,46 Z"
        />
      </svg>
      <span className="sr-only">Odbyły się</span>
    </>
  )
}
