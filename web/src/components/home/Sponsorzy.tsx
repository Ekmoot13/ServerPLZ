import React from 'react'
import { DEFAULT_GRUPY, type SponsorGrupa, type SponsorLogo } from '@/lib/sponsorzy'

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

// Bazowa wysokość logo (px) przy skali 100%. Skala przesuwa ją w górę/dół.
const BAZA = 76

function LogoEl({ lo }: { lo: SponsorLogo }) {
  const skala = typeof lo.skala === 'number' && lo.skala > 0 ? lo.skala : 100
  const img = (
    <Img
      src={lo.logoUrl}
      alt={lo.nazwa || ''}
      className="w-auto object-contain"
      style={{ height: `${(BAZA * skala) / 100}px` }}
    />
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
  const dane = grupy && grupy.length ? grupy : DEFAULT_GRUPY
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:py-16">
        <h2 className="text-center text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">{tytul || 'Sponsorzy'}</h2>
        <div className="mx-auto mt-2 mb-10 h-1 w-16 rounded-full bg-brand-red md:mb-12" />

        <div className="space-y-10 md:space-y-14">
          {dane.map((g, gi) => (
            <div key={gi}>
              {g.kategoria && (
                <>
                  <h3 className="text-center text-lg font-bold text-navy">{g.kategoria}</h3>
                  <div className="mx-auto mt-2 mb-8 h-0.5 w-12 rounded-full bg-brand-red" />
                </>
              )}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10">
                {(g.loga || []).map((lo, li) => (
                  <LogoEl key={li} lo={lo} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
