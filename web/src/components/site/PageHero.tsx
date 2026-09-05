import React from 'react'

// Wspólny nagłówek podstron — granatowy pas z tytułem (wzór ligazeglarska.pl).
export default function PageHero({
  tytul,
  podtytul,
  obraz,
}: {
  tytul: string
  podtytul?: string
  obraz?: string
}) {
  return (
    <section
      className="relative overflow-hidden bg-navy text-white"
      style={obraz ? { backgroundImage: `url(${obraz})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {obraz && <div className="absolute inset-0 bg-navy/80" />}
      <div className="relative mx-auto max-w-[1440px] px-4 py-16 md:py-20">
        <div className="h-1.5 w-16 rounded-full bg-brand-red" />
        <h1 className="mt-4 text-4xl font-extrabold uppercase tracking-wide md:text-5xl">{tytul}</h1>
        {podtytul && <p className="mt-4 max-w-2xl text-white/80">{podtytul}</p>}
      </div>
    </section>
  )
}
