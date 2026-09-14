import React from 'react'
import { DEFAULT_GRUPY, type SponsorGrupa, type SponsorLogo } from '@/lib/sponsorzy'

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

// Bazowa wysokość kafelka logo (px) przy skali 100%. Skala przesuwa ją w górę/dół.
// Logotypy mają jednolite płótno 4:3, więc kafelek trzyma te same proporcje —
// dzięki temu żaden logotyp nie potrafi urosnąć ponad pozostałe, nawet gdyby
// redaktor wgrał plik o innych wymiarach (object-contain wpisuje go w kafelek).
const BAZA = 112
const PROPORCJA = 4 / 3

// Grupa wycofana — nie pokazujemy jej nawet, jeśli zostałaby w danych.
const UKRYTE_GRUPY = /sponsor\s*tytularny/i

function LogoEl({ lo }: { lo: SponsorLogo }) {
  const skala = typeof lo.skala === 'number' && lo.skala > 0 ? lo.skala : 100
  const h = (BAZA * skala) / 100
  const img = (
    <span className="flex max-w-full items-center justify-center" style={{ height: `${h}px`, width: `${h * PROPORCJA}px` }}>
      <Img src={lo.logoUrl} alt={lo.nazwa || ''} className="max-h-full max-w-full object-contain" />
    </span>
  )
  return lo.link ? (
    <a href={lo.link} target="_blank" rel="noopener noreferrer" className="block transition hover:opacity-70">
      {img}
    </a>
  ) : (
    <span className="block">{img}</span>
  )
}

export default function Sponsorzy({ grupy, tytul }: { grupy?: SponsorGrupa[]; tytul?: string }) {
  const zrodlo = grupy && grupy.length ? grupy : DEFAULT_GRUPY
  const dane = zrodlo.filter((g) => !UKRYTE_GRUPY.test(g.kategoria || '') && (g.loga || []).length > 0)

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:py-16">
        <h2 className="text-center text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">{tytul || 'Sponsorzy'}</h2>
        <div className="mx-auto mt-2 mb-10 h-1 w-16 rounded-full bg-brand-red md:mb-12" />

        <div className="space-y-12 md:space-y-16">
          {dane.map((g, gi) => (
            <div key={gi}>
              {g.kategoria && (
                <>
                  <h3 className="text-center text-lg font-bold text-navy">{g.kategoria}</h3>
                  <div className="mx-auto mt-2 mb-8 h-0.5 w-12 rounded-full bg-brand-red" />
                </>
              )}
              {/* Siatka stałych kolumn (5 na desktopie) — logotypy łamią się po pięć
                  i są rozłożone jak na ligazeglarska.pl, zamiast ściskać się w jeden rząd.
                  Niepełny ostatni rząd zostaje wyśrodkowany. */}
              <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-y-10">
                {(g.loga || []).map((lo, li) => (
                  <div key={li} className="flex w-1/2 justify-center px-2 sm:w-1/3 lg:w-1/5">
                    <LogoEl lo={lo} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
