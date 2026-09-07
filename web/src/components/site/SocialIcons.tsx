import React from 'react'
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react'

// Linki social Polskiej Ligi Żeglarskiej (kolejność jak w oryginale).
export const SOCIAL = [
  { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/LigaZeglarska/' },
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/polskaligazeglarska/' },
  { key: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@ligazeglarska' },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/c/ocszeglarskikanalsportowy' },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://chat.whatsapp.com/JQRZWPIGH7x7OAHW8QaKRH' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://pl.linkedin.com/company/polska-liga-zeglarska' },
] as const

function Icon({ k, size }: { k: string; size: number }) {
  switch (k) {
    case 'facebook':
      return <Facebook size={size} />
    case 'instagram':
      return <Instagram size={size} />
    case 'youtube':
      return <Youtube size={size} />
    case 'linkedin':
      return <Linkedin size={size} />
    case 'tiktok':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.5 3c.32 2.05 1.53 3.42 3.5 3.6v2.53c-1.2.03-2.37-.32-3.5-.98v5.6a5.6 5.6 0 11-5.6-5.6c.3 0 .6.03.9.08v2.62a3 3 0 102.1 2.86V3h2.6z"
          />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 3.5A8.5 8.5 0 004.6 16.3L3.5 20.5l4.3-1.12A8.5 8.5 0 1012 3.5zm0 1.8a6.7 6.7 0 015.72 10.18l.28.47-.63 2.28-2.32-.6-.45.26A6.7 6.7 0 1112 5.3zM8.9 8.05c-.15 0-.4.06-.6.3-.2.24-.78.76-.78 1.85 0 1.1.8 2.15.9 2.3.12.15 1.57 2.5 3.9 3.4 1.94.75 2.33.6 2.75.56.42-.04 1.36-.55 1.55-1.09.2-.54.2-1 .14-1.1-.06-.1-.22-.15-.46-.27-.24-.12-1.36-.67-1.57-.75-.2-.08-.36-.12-.5.12-.15.24-.58.75-.7.9-.14.15-.27.17-.5.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.4-1.32-1.63-.13-.24-.01-.37.1-.48.11-.11.24-.29.36-.43.12-.15.16-.24.24-.4.08-.15.04-.3-.02-.42-.06-.12-.5-1.3-.72-1.78-.17-.4-.35-.4-.5-.4z"
          />
        </svg>
      )
    default:
      return null
  }
}

export function SocialRow({
  size = 18,
  tone = 'light',
  layout = 'row',
  className = '',
}: {
  size?: number
  tone?: 'light' | 'dark'
  layout?: 'row' | 'grid'
  className?: string
}) {
  const color = tone === 'light' ? 'text-white/85 hover:text-white' : 'text-navy hover:text-brand-red'
  const wrap = layout === 'grid' ? 'grid w-max grid-cols-3 gap-3' : 'flex items-center gap-3'
  return (
    <div className={`${wrap} ${className}`}>
      {SOCIAL.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className={`inline-flex items-center justify-center transition ${color}`}
        >
          <Icon k={s.key} size={size} />
        </a>
      ))}
    </div>
  )
}
