'use client'
import React, { useEffect, useRef, useState } from 'react'

// Konfiguracja Sender.net (pobrana z ligazeglarska.pl)
const SENDER_ACCOUNT = '6eb9a0c7c61511'
const SENDER_FORM_ID = 'dR6rqq'
const SENDER_SCRIPT = 'https://cdn.sender.net/accounts_resources/universal.js'
// Formularz hostowany przez Sender.net — używany, gdy skrypt osadzenia nie zdąży wstrzyknąć pola.
const SENDER_FALLBACK = `https://stats.sender.net/forms/${SENDER_FORM_ID}/view`

const PROBA_MS = 400
// Przy pierwszym wejściu skrypt wstrzykuje formularz od ręki. Po nawigacji klienckiej
// universal.js jest już zainicjalizowany i nie skanuje strony ponownie — wtedy nie ma
// na co czekać, od razu pokazujemy formularz hostowany.
const MAX_PROB_PIERWSZY = 9 // ~3,6 s
const MAX_PROB_KOLEJNY = 3 // ~1,2 s

type Stan = 'ladowanie' | 'gotowe' | 'zapasowy'

export default function NewsletterSekcja({ bg }: { bg?: string }) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const [stan, setStan] = useState<Stan>('ladowanie')

  useEffect(() => {
    const w = window as any

    // Kolejka `sender` musi istnieć, zanim skrypt się wczyta.
    if (!w.sender) {
      w.sender = function () {
        ;(w.sender.q = w.sender.q || []).push(arguments)
      }
      w.sender.l = Number(new Date())
      w.Sender = 'sender'
    }
    // Skrypt wstawiamy raz na całą sesję (po nawigacji klienckiej już tu jest).
    const jużZaladowany = !!document.getElementById('sender-universal')
    if (!jużZaladowany) {
      const a = document.createElement('script')
      a.id = 'sender-universal'
      a.async = true
      a.src = SENDER_SCRIPT
      document.head.appendChild(a)
    }

    // Inicjalizację wołamy przy każdym montowaniu — to ona każe skryptowi
    // przeskanować stronę w poszukiwaniu pustych pól formularza. Bez tego
    // powrót na stronę główną (nawigacja kliencka) zostawiał pusty box.
    const maxProb = jużZaladowany ? MAX_PROB_KOLEJNY : MAX_PROB_PIERWSZY
    let proby = 0
    let timer: ReturnType<typeof setTimeout>

    const sprawdz = () => {
      if (boxRef.current && boxRef.current.childElementCount > 0) {
        setStan('gotowe')
        return
      }
      if (proby >= maxProb) {
        setStan('zapasowy')
        return
      }
      proby += 1
      try {
        w.sender(SENDER_ACCOUNT)
      } catch {
        /* skrypt jeszcze się nie wczytał — kolejka zadziała później */
      }
      timer = setTimeout(sprawdz, PROBA_MS)
    }

    sprawdz()
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className="relative bg-navy"
      style={
        bg
          ? {
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }
          : undefined
      }
    >
      <div className="relative mx-auto flex max-w-[1440px] justify-center px-4 py-10 md:py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-7">
          {/* Miejsce jest zarezerwowane od pierwszej klatki, więc karta nigdy nie jest pustym boxem. */}
          <div className="relative min-h-[240px]">
            <div ref={boxRef} className="sender-form-field" data-sender-form-id={SENDER_FORM_ID} hidden={stan === 'zapasowy'} />

            {stan === 'ladowanie' && (
              <div className="absolute inset-0 animate-pulse space-y-4 pt-2" aria-hidden="true">
                <div className="mx-auto h-6 w-3/5 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-4/5 rounded bg-slate-100" />
                <div className="mt-6 h-11 w-full rounded-lg bg-slate-200" />
                <div className="h-11 w-full rounded-lg bg-navy/20" />
              </div>
            )}

            {stan === 'zapasowy' && (
              <iframe
                src={SENDER_FALLBACK}
                title="Zapisz się na newsletter"
                loading="lazy"
                className="h-[320px] w-full border-0"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
