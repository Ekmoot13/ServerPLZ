'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

export type ZgloszenieLiga = { nazwa?: string; logoUrl?: string; wiecejLink?: string; wyslijLink?: string; tloCiemne?: boolean }
export type Kanal = { logo?: string; nazwa?: string; opis?: string; url?: string }

export type WprowadzenieProps = {
  tytul: string
  akapity: string[]
  obrazTla?: string
  poziomyObraz?: string
  jakSledzicKanaly?: Kanal[]
  zgloszeniaIntro?: string
  zgloszeniaLigi?: ZgloszenieLiga[]
  jakSieScigamyHref?: string
  mediaHref?: string
}

type Key = 'poziomy' | 'sledzic' | 'zgloszenia' | null

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
      <div className="relative my-8 w-full max-w-4xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-xl font-bold text-slate-900">{tytul}</h3>
          <button onClick={onClose} aria-label="Zamknij" className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
            ✕
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  )
}

const btnCls =
  'whitespace-nowrap rounded-full border border-white/40 bg-transparent px-6 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-navy md:text-sm'

export default function Wprowadzenie(props: WprowadzenieProps) {
  const [open, setOpen] = useState<Key>(null)
  const close = () => setOpen(null)
  const scigamyHref = props.jakSieScigamyHref || '/jak-sie-scigamy'
  const mediaHref = props.mediaHref || '/media'

  return (
    <div>
      {/* BANER — bez ramki, układ jak w sekcji „Czym jest" */}
      <div className="grid items-center gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">{props.tytul}</h2>
          <div className="mt-2 mb-6 h-1 w-14 rounded-full bg-brand-red" />
          <div className="space-y-4 text-white/85">
            {props.akapity.map((a, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: a }} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link href={scigamyHref} className={btnCls}>Jak się ścigamy?</Link>
          <button onClick={() => setOpen('poziomy')} className={btnCls}>Jakie są poziomy ligi?</button>
          <button onClick={() => setOpen('sledzic')} className={btnCls}>Jak śledzić regaty?</button>
          <Link href={mediaHref} className={btnCls}>Jakie media nas pokazują?</Link>
          <button onClick={() => setOpen('zgloszenia')} className={btnCls}>Jak się zgłosić?</button>
        </div>
      </div>

      {/* POP-UP: poziomy ligi */}
      {open === 'poziomy' && (
        <Modal tytul="Jakie są poziomy ligi?" onClose={close}>
          {props.poziomyObraz ? (
            <Img src={props.poziomyObraz} className="mx-auto w-full max-w-3xl rounded-lg" />
          ) : (
            <p className="text-slate-500">Brak grafiki.</p>
          )}
        </Modal>
      )}

      {/* POP-UP: jak śledzić regaty (kanały) */}
      {open === 'sledzic' && (
        <Modal tytul="Jak śledzić regaty?" onClose={close}>
          <p className="mb-2 text-center text-lg font-bold text-slate-900">Obserwuj nasze kanały i bądź częścią żeglarskich emocji!</p>
          <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-slate-600">
            Śledź wyniki na żywo, oglądaj transmisje i podsumowania, zobacz rywalizację z perspektywy zawodników i poczuj
            atmosferę regat Polskiej Ligi Żeglarskiej — niezależnie od tego, gdzie jesteś.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(props.jakSledzicKanaly || []).map((k, i) => (
              <a
                key={i}
                href={k.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center rounded-xl border border-slate-200 p-5 text-center transition hover:border-sky-400 hover:shadow-sm"
              >
                <div className="flex h-12 items-center justify-center">
                  {k.logo ? <Img src={k.logo} alt={k.nazwa || ''} className="max-h-10 w-auto object-contain" /> : null}
                </div>
                <div className="mt-3 text-sm font-bold text-slate-900">{k.nazwa}</div>
                <div className="mt-1 text-xs text-slate-500">{k.opis}</div>
              </a>
            ))}
          </div>
        </Modal>
      )}

      {/* POP-UP: jak się zgłosić */}
      {open === 'zgloszenia' && (
        <Modal tytul="Jak się zgłosić?" onClose={close}>
          {props.zgloszeniaIntro && <p className="mb-6 text-slate-700">{props.zgloszeniaIntro}</p>}
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
            {(props.zgloszeniaLigi || []).map((z, i) => (
              <div key={i} className="flex flex-col items-center rounded-xl border border-slate-200 p-6 text-center">
                <div
                  className={`mb-5 flex h-32 w-full items-center justify-center overflow-hidden rounded-xl ${
                    z.tloCiemne ? 'bg-navy p-4' : ''
                  }`}
                >
                  {z.logoUrl ? (
                    <Img src={z.logoUrl} alt={z.nazwa || ''} className="max-h-full w-auto object-contain" />
                  ) : (
                    <span className={`text-lg font-bold ${z.tloCiemne ? 'text-white' : 'text-navy'}`}>{z.nazwa}</span>
                  )}
                </div>
                <div className="mt-auto flex w-full flex-col gap-2.5">
                  {z.wiecejLink && (
                    <a
                      href={z.wiecejLink}
                      className="rounded-full border-2 border-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
                    >
                      Dowiedz się więcej
                    </a>
                  )}
                  {z.wyslijLink && (
                    <a
                      href={z.wyslijLink}
                      className="rounded-full bg-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-navy-800"
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
