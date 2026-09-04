'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export type AktualnosciItem =
  | { typ: 'baner'; tytul: string; tekst: string; link: string; obraz?: string }
  | {
      typ: 'facebook' | 'instagram'
      tekst: string
      obraz: string
      link: string
    }

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

function Baner({ tytul, tekst, link, obraz }: { tytul: string; tekst: string; link: string; obraz?: string }) {
  const wewn = link.startsWith('/')
  const inner = (
    <div
      className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900 p-10 text-center text-white"
      style={obraz ? { backgroundImage: `url(${obraz})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {obraz && <div className="absolute inset-0 bg-slate-900/60" />}
      <div className="relative">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Na żywo
        </span>
        <h3 className="mb-3 text-3xl font-extrabold md:text-4xl">{tytul}</h3>
        {tekst && <p className="mx-auto mb-6 max-w-xl text-slate-200">{tekst}</p>}
        <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-lg font-bold uppercase tracking-wide transition hover:bg-red-500">
          Śledź regaty →
        </span>
      </div>
    </div>
  )
  return wewn ? (
    <Link href={link} className="block">
      {inner}
    </Link>
  ) : (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  )
}

function PostCard({ item }: { item: Extract<AktualnosciItem, { typ: 'facebook' | 'instagram' }> }) {
  const marka = item.typ === 'facebook' ? 'Facebook' : 'Instagram'
  const kolor = item.typ === 'facebook' ? 'bg-[#1877F2]' : 'bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]'
  return (
    <a
      href={item.link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid min-h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-2"
    >
      <div className="relative min-h-[220px] bg-slate-100">
        {item.obraz ? (
          <Img src={item.obraz} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">brak zdjęcia</div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white ${kolor}`}>
          {marka}
        </span>
      </div>
      <div className="flex flex-col justify-center p-6">
        <p className="mb-4 line-clamp-6 whitespace-pre-line text-slate-700">{item.tekst || 'Zobacz najnowszy post.'}</p>
        <span className="text-sm font-semibold text-sky-600 group-hover:underline">Zobacz post →</span>
      </div>
    </a>
  )
}

function Render({ item }: { item: AktualnosciItem }) {
  if (item.typ === 'baner') return <Baner {...item} />
  return <PostCard item={item} />
}

export default function Aktualnosci({ items, tryb }: { items: AktualnosciItem[]; tryb: 'rotacja' | 'pojedynczy' }) {
  const [i, setI] = useState(0)
  const rotacja = tryb === 'rotacja' && items.length > 1

  useEffect(() => {
    if (!rotacja) return
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 6000)
    return () => clearInterval(t)
  }, [rotacja, items.length])

  if (items.length === 0) return null

  if (!rotacja) {
    return <Render item={items[Math.min(i, items.length - 1)]} />
  }

  return (
    <div>
      <div className="transition-opacity duration-500">
        <Render item={items[i]} />
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {items.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Slajd ${k + 1}`}
            className={`h-2.5 rounded-full transition-all ${k === i ? 'w-8 bg-sky-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
          />
        ))}
      </div>
    </div>
  )
}
