'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export type PasekDane = {
  nazwa: string
  miejsce?: string
  poziom?: string
  dataOd: string // ISO
  dataDo?: string | null
  link?: string
}

const MIES = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU']

function zakresDat(od: Date, doo?: Date | null): string {
  const y = od.getFullYear()
  if (doo && (doo.getDate() !== od.getDate() || doo.getMonth() !== od.getMonth())) {
    if (doo.getMonth() === od.getMonth()) return `${od.getDate()}–${doo.getDate()} ${MIES[od.getMonth()]} ${y}`
    return `${od.getDate()} ${MIES[od.getMonth()]} – ${doo.getDate()} ${MIES[doo.getMonth()]} ${y}`
  }
  return `${od.getDate()} ${MIES[od.getMonth()]} ${y}`
}

function Box({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="min-w-[2ch] text-center text-2xl font-extrabold leading-none tabular-nums md:text-3xl">
        {String(v).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/55">{label}</span>
    </div>
  )
}

export default function PasekRegat({
  dane,
  pokazPrzycisk = true,
}: {
  dane: PasekDane
  /** Strony poziomow ligi pokazuja sam licznik - bez przycisku Sledz regaty. */
  pokazPrzycisk?: boolean
}) {
  const od = new Date(dane.dataOd)
  const doo = dane.dataDo ? new Date(dane.dataDo) : null
  // cel: 10:30 w dniu rozpoczęcia regat
  const cel = new Date(od)
  cel.setHours(10, 30, 0, 0)

  const [teraz, setTeraz] = useState<number | null>(null)
  useEffect(() => {
    setTeraz(Date.now())
    const t = setInterval(() => setTeraz(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = teraz === null ? null : Math.max(0, cel.getTime() - teraz)
  const trwa = teraz !== null && diff === 0
  const dni = diff === null ? 0 : Math.floor(diff / 86400000)
  const godz = diff === null ? 0 : Math.floor((diff % 86400000) / 3600000)
  const min = diff === null ? 0 : Math.floor((diff % 3600000) / 60000)
  const sek = diff === null ? 0 : Math.floor((diff % 60000) / 1000)

  const link = dane.link || '/regatowastrefakibica'

  return (
    <div className="border-b border-white/10 bg-navy-900 text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 px-4 py-3 md:flex-row md:justify-between md:gap-6">
        {/* lokalizacja + data */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <span className="text-lg font-extrabold uppercase tracking-wide md:text-xl">{dane.miejsce || dane.nazwa}</span>
          <span className="text-sm text-white/70">{zakresDat(od, doo)}</span>
        </div>

        {/* odliczanie */}
        <div className="flex items-center gap-2 md:gap-3">
          {trwa ? (
            <span className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-brand-red">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-red" /> Trwają regaty
            </span>
          ) : (
            <>
              <Box v={dni} label="dni" />
              <span className="pb-4 text-xl font-bold text-white/40">:</span>
              <Box v={godz} label="godz" />
              <span className="pb-4 text-xl font-bold text-white/40">:</span>
              <Box v={min} label="min" />
              <span className="pb-4 text-xl font-bold text-white/40">:</span>
              <Box v={sek} label="sek" />
            </>
          )}
        </div>

        {/* poziom ligi + przycisk */}
        <div className="flex items-center gap-4">
          {dane.poziom && (
            <span
              className={`${pokazPrzycisk ? 'hidden sm:block ' : ''}text-sm font-extrabold uppercase tracking-wide text-white`}
            >
              {dane.poziom}
            </span>
          )}
          {pokazPrzycisk && (
            <Link
              href={link}
              className="whitespace-nowrap rounded-full bg-brand-red px-5 py-2 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-brand-red-dark md:text-sm"
            >
              Śledź regaty
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
