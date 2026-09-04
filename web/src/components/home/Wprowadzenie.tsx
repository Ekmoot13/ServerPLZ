'use client'
import React, { useEffect, useState } from 'react'

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

export type LogoItem = { logoUrl?: string; link?: string; nazwa?: string }
export type MediaGrupa = { kategoria?: string; loga?: LogoItem[] }
export type LinkItem = { label?: string; url?: string }
export type ZgloszenieLiga = { nazwa?: string; logoUrl?: string; wiecejLink?: string; wyslijLink?: string }

export type WprowadzenieProps = {
  tytul: string
  akapity: string[]
  obrazTla?: string
  jakSieScigamyHtml?: string
  poziomyObraz?: string
  jakSledzic?: LinkItem[]
  media?: MediaGrupa[]
  zgloszeniaIntro?: string
  zgloszeniaLigi?: ZgloszenieLiga[]
}

type Key = 'scigamy' | 'poziomy' | 'sledzic' | 'media' | 'zgloszenia' | null

function Modal({ tytul, onClose, children }: { tytul: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative my-8 w-full max-w-4xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-xl font-bold text-slate-900">{tytul}</h3>
          <button
            onClick={onClose}
            aria-label="Zamknij"
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  )
}

const BTN = [
  { key: 'scigamy' as const, label: 'Jak się ścigamy?' },
  { key: 'poziomy' as const, label: 'Jakie są poziomy ligi?' },
  { key: 'sledzic' as const, label: 'Jak śledzić regaty?' },
  { key: 'media' as const, label: 'Jakie media nas pokazują?' },
  { key: 'zgloszenia' as const, label: 'Jak się zgłosić?' },
]

export default function Wprowadzenie(props: WprowadzenieProps) {
  const [open, setOpen] = useState<Key>(null)
  const close = () => setOpen(null)

  return (
    <div>
      {/* BANER */}
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1f44] via-[#0d2c5e] to-[#0a1f44] text-white"
        style={props.obrazTla ? { backgroundImage: `url(${props.obrazTla})`, backgroundSize: 'cover' } : undefined}
      >
        {props.obrazTla && <div className="absolute inset-0 bg-[#0a1f44]/80" />}
        <div className="relative grid gap-8 p-8 md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <h2 className="mb-5 text-2xl font-extrabold uppercase tracking-wide md:text-3xl">{props.tytul}</h2>
            <div className="space-y-3 text-sm leading-relaxed text-slate-200 md:text-base">
              {props.akapity.map((a, i) => (
                <p key={i}>{a}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2.5">
            {BTN.map((b) => (
              <button
                key={b.key}
                onClick={() => setOpen(b.key)}
                className="whitespace-nowrap rounded-full border border-white/40 bg-white/5 px-6 py-2.5 text-xs font-bold uppercase tracking-wide transition hover:bg-white hover:text-[#0a1f44] md:text-sm"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* POP-UPY */}
      {open === 'scigamy' && (
        <Modal tytul="Jak się ścigamy?" onClose={close}>
          <div
            className="prose max-w-none prose-headings:text-slate-900 prose-a:text-sky-600"
            dangerouslySetInnerHTML={{ __html: props.jakSieScigamyHtml || '<p>Wkrótce.</p>' }}
          />
        </Modal>
      )}

      {open === 'poziomy' && (
        <Modal tytul="Jakie są poziomy ligi?" onClose={close}>
          {props.poziomyObraz ? (
            <Img src={props.poziomyObraz} className="mx-auto w-full max-w-3xl rounded-lg" />
          ) : (
            <p className="text-slate-500">Brak grafiki.</p>
          )}
        </Modal>
      )}

      {open === 'sledzic' && (
        <Modal tytul="Jak śledzić regaty?" onClose={close}>
          <div className="grid gap-3 sm:grid-cols-2">
            {(props.jakSledzic || []).map((l, i) => (
              <a
                key={i}
                href={l.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 font-semibold text-slate-800 transition hover:border-sky-400 hover:bg-sky-50"
              >
                {l.label}
                <span className="text-sky-600">→</span>
              </a>
            ))}
          </div>
        </Modal>
      )}

      {open === 'media' && (
        <Modal tytul="Jakie media nas pokazują?" onClose={close}>
          <div className="space-y-8">
            {(props.media || []).map((g, i) => (
              <div key={i}>
                <h4 className="mb-4 border-b border-slate-200 pb-1 text-sm font-bold uppercase tracking-wide text-slate-500">
                  {g.kategoria}
                </h4>
                <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-4">
                  {(g.loga || []).map((lo, k) => (
                    <a
                      key={k}
                      href={lo.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-lg p-2 transition hover:bg-slate-50"
                    >
                      {lo.logoUrl ? (
                        <Img src={lo.logoUrl} className="max-h-16 w-auto object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400">{lo.nazwa}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {open === 'zgloszenia' && (
        <Modal tytul="Jak się zgłosić?" onClose={close}>
          {props.zgloszeniaIntro && <p className="mb-6 text-slate-700">{props.zgloszeniaIntro}</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(props.zgloszeniaLigi || []).map((z, i) => (
              <div key={i} className="flex flex-col rounded-xl border border-slate-200 p-5 text-center">
                <div className="mb-3 flex h-24 items-center justify-center">
                  {z.logoUrl ? (
                    <Img src={z.logoUrl} className="max-h-24 w-auto object-contain" />
                  ) : (
                    <span className="font-bold text-slate-700">{z.nazwa}</span>
                  )}
                </div>
                <div className="mb-4 text-sm font-semibold text-slate-800">{z.nazwa}</div>
                <div className="mt-auto flex flex-col gap-2">
                  {z.wiecejLink && (
                    <a
                      href={z.wiecejLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Dowiedz się więcej
                    </a>
                  )}
                  {z.wyslijLink && (
                    <a
                      href={z.wyslijLink}
                      className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-500"
                    >
                      Wyślij zgłoszenie
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}
