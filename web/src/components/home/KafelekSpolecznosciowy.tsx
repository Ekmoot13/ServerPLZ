import React from 'react'
import type { KafelekPost } from '@/lib/kafelekSpolecznosciowy'

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

const MARKA: Record<KafelekPost['platforma'], { nazwa: string; klasa: string }> = {
  youtube: { nazwa: 'YouTube', klasa: 'bg-[#FF0000]' },
  instagram: { nazwa: 'Instagram', klasa: 'bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]' },
  facebook: { nazwa: 'Facebook', klasa: 'bg-[#1877F2]' },
  tiktok: { nazwa: 'TikTok', klasa: 'bg-black' },
}

function Ikona({ platforma }: { platforma: KafelekPost['platforma'] }) {
  const wspolne = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'currentColor' } as const
  if (platforma === 'youtube')
    return (
      <svg {...wspolne} aria-hidden>
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z" />
      </svg>
    )
  if (platforma === 'instagram')
    return (
      <svg {...wspolne} aria-hidden>
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.8-.1zm0 3.4A6.4 6.4 0 1 0 18.4 12 6.4 6.4 0 0 0 12 5.6zm0 10.5A4.1 4.1 0 1 1 16.1 12 4.1 4.1 0 0 1 12 16.1zm8.1-10.7a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z" />
      </svg>
    )
  if (platforma === 'facebook')
    return (
      <svg {...wspolne} aria-hidden>
        <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z" />
      </svg>
    )
  return (
    <svg {...wspolne} aria-hidden>
      <path d="M16.6 5.8a4.8 4.8 0 0 1-1-1.4 4.9 4.9 0 0 1-.3-1.7h-3.1v12.6a2.6 2.6 0 0 1-2.6 2.5 2.6 2.6 0 1 1 .7-5.1V9.5a5.8 5.8 0 0 0-.7 0 5.7 5.7 0 1 0 5.7 5.7V8.9a7.9 7.9 0 0 0 4.6 1.5V7.3a4.7 4.7 0 0 1-3.3-1.5z" />
    </svg>
  )
}

/** Duży kafelek aktualności podmieniony na post z social mediów. */
export default function KafelekSpolecznosciowy({ post }: { post: KafelekPost }) {
  const marka = MARKA[post.platforma]
  const opis = post.opis.length > 180 ? `${post.opis.slice(0, 180).trimEnd()}…` : post.opis

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-full min-h-[300px] overflow-hidden rounded-2xl border border-slate-200 md:min-h-[440px]"
    >
      <Img src={post.obraz} alt="" className="absolute inset-0 h-full w-full object-cover" />

      {/* górna plakietka: skąd pochodzi post */}
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/70 to-transparent p-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white ${marka.klasa}`}>
          <Ikona platforma={post.platforma} />
          {marka.nazwa}
        </span>
        {post.kanal && <span className="truncate text-xs font-semibold text-white/90">{post.kanal}</span>}
      </div>

      {/* dolny opis */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5">
        {opis && <p className="line-clamp-3 text-sm font-semibold text-white md:text-base">{opis}</p>}
        <span className="mt-1 inline-block text-xs font-bold text-white/80 group-hover:underline">
          Zobacz na {marka.nazwa} →
        </span>
      </div>
    </a>
  )
}
