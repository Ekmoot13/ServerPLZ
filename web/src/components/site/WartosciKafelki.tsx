'use client'
import React, { useState } from 'react'

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

const U = 'https://ligazeglarska.pl/wp-content/uploads'

type Wartosc = { tytul: string; tekst: string; foto: string; ikona: React.ReactNode }

const I = {
  energia: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  ),
  rownosc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
      <path d="M12 3v18M3 7h18M6 7l-3 6a3 3 0 0 0 6 0L6 7Zm12 0-3 6a3 3 0 0 0 6 0l-3-6Z" />
    </svg>
  ),
  spolecznosc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  esg: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  ),
  aktywizacja: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M17 7h4v4" />
    </svg>
  ),
  profesjonalizm: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
}

const WARTOSCI: Wartosc[] = [
  {
    tytul: 'Czysta energia',
    ikona: I.energia,
    foto: `${U}/2025/11/EXR3_0076_szymon_sikora_rek_-e1763552320652.jpg`,
    tekst:
      'Nasza moc pochodzi od wiatru i wody. To nasze naturalne środowisko i źródło energii do realizacji pasji i rozwoju. Redukujemy emisje, zanieczyszczenia wody i minimalizujemy zużycie plastiku, stosując nowoczesne rozwiązania.',
  },
  {
    tytul: 'Równość szans',
    ikona: I.rownosc,
    foto: `${U}/2025/11/PLZ_EXR4__MG_1033_Bartosz_Modelski-e1763552215809.jpg`,
    tekst:
      'Tworzymy równe szanse w sporcie. Organizujemy regaty dedykowane dla kobiet i młodzieży, dając im możliwość rywalizacji w swoich środowiskach. Wyrównujemy ich szanse do pełnoprawnego uprawiania żeglarstwa i równej rywalizacji w duchu fair play.',
  },
  {
    tytul: 'Rozwój społeczności',
    ikona: I.spolecznosc,
    foto: `${U}/2024/03/IDEA-768x502.jpg`,
    tekst:
      'Liga jest dostępna dla wszystkich, niezależnie od wieku, płci i stanu życiowego. Promujemy i wspieramy uczestników, tworząc przestrzeń do samorealizacji. Dzięki temu ich grono stale się powiększa, tworząc wielopokoleniową społeczność. Wspieramy potrzebujących pomocy.',
  },
  {
    tytul: 'ESG',
    ikona: I.esg,
    foto: `${U}/2025/11/1LR1_0001_szymon_sikora_d1_Poziom_WM-e1763552181284.jpg`,
    tekst:
      'Rozwijamy się stabilnie, dbając o środowisko i nasze naturalne otoczenie. Wprowadzamy nowoczesne rozwiązania, eliminujemy jednorazowy plastik i usprawniamy logistykę. Wspieramy świadomość ekologiczną uczestników.',
  },
  {
    tytul: 'Aktywizacja',
    ikona: I.aktywizacja,
    foto: `${U}/2025/11/PLZ_1LR4__S_00440_Bartosz_Modelski-e1763552241157.jpg`,
    tekst:
      'Dajemy impuls do działania na każdym etapie kariery – tworzymy możliwości i ułatwiamy aktywizację zawodników zarówno w trakcie, jak i po zakończeniu ich ścieżki sportowej. Wspieramy młode talenty w realizacji pasji oraz oferujemy szanse na powrót do sportu po dłuższej przerwie.',
  },
  {
    tytul: 'Profesjonalizm',
    ikona: I.profesjonalizm,
    foto: `${U}/2025/11/PLZ_1LR4__S_00618_Bartosz_Modelski-e1763552284365.jpg`,
    tekst:
      'Bezpieczeństwo wszystkich uczestników regat to nasz priorytet. Zapewniamy czystą, sportową rywalizację na równych zasadach i w zgodzie z duchem fair play, w bezpiecznym otoczeniu i zgodnie ze standardami.',
  },
]

function Kafelek({ w }: { w: Wartosc }) {
  const [flip, setFlip] = useState(false)
  return (
    <div
      className="h-80 [perspective:1400px] md:h-[22rem]"
      onMouseEnter={() => setFlip(true)}
      onMouseLeave={() => setFlip(false)}
      onClick={() => setFlip((f) => !f)}
    >
      <div
        className="relative h-full w-full rounded-2xl shadow-md transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flip ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* PRZÓD */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-navy/10 [backface-visibility:hidden]">
          <Img src={w.foto} alt={w.tytul} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-navy/65 transition-colors duration-300" />
          <div className="relative flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-white">
            <span className="text-sky-400 drop-shadow">{w.ikona}</span>
            <h3 className="text-xl font-extrabold uppercase tracking-wide drop-shadow-md">{w.tytul}</h3>
            <div className="h-1 w-10 rounded-full bg-brand-red" />
          </div>
        </div>
        {/* TYŁ */}
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500 p-6 text-center text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-sm leading-relaxed md:text-[15px]">{w.tekst}</p>
        </div>
      </div>
    </div>
  )
}

export default function WartosciKafelki() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {WARTOSCI.map((w) => (
        <Kafelek key={w.tytul} w={w} />
      ))}
    </div>
  )
}
