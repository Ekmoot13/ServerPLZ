'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Pasek „niezapisane zmiany" dla panelu redaktora.
 *
 * - wysuwa się pod nagłówkiem, gdy redaktor zmieni cokolwiek w formularzu,
 * - blokuje przejście na inną podstronę panelu (i zamknięcie karty),
 * - przy próbie wyjścia mruga trzy razy na czerwono.
 *
 * Zapisuje formularz, w którym nastąpiła ostatnia zmiana. Strona Strefy Kibica
 * ma kilka niezależnych formularzy (ustawienia + osobny na każdą transmisję),
 * a każda akcja serwera kończy się przeładowaniem — dlatego pasek pilnuje
 * jednego formularza naraz i pokazuje, którego.
 */

function nazwaFormularza(f: HTMLFormElement | null): string {
  if (!f) return 'Niezapisane zmiany'
  const etykieta = f.getAttribute('data-nazwa')
  if (etykieta) return `Niezapisane zmiany — ${etykieta}`
  return 'Niezapisane zmiany'
}

export default function NiezapisaneZmiany() {
  const [brudny, setBrudny] = useState(false)
  const [opis, setOpis] = useState('Niezapisane zmiany')
  const [miga, setMiga] = useState(0)
  const [zapisywanie, setZapisywanie] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  const brudnyRef = useRef(false)

  const sciezka = usePathname()
  const parametry = useSearchParams()
  const adres = `${sciezka}?${parametry.toString()}`

  useEffect(() => {
    brudnyRef.current = brudny
  }, [brudny])

  // Akcje serwera kończą się redirectem, ale Next nawiguje miękko — layout
  // (a z nim ten pasek) nie jest przemontowywany i stan by się zawiesił.
  // Każdy zapis przekierowuje na ?ok=<znacznik czasu>, więc zmiana adresu
  // jest sygnałem, że zapis się dopiął.
  useEffect(() => {
    setBrudny(false)
    setZapisywanie(false)
    setMiga(0)
    formRef.current = null
  }, [adres])

  // Bezpiecznik: gdyby akcja nie przekierowała (błąd walidacji, zerwana sieć),
  // pasek nie może zostać na zawsze w stanie „Zapisywanie…".
  useEffect(() => {
    if (!zapisywanie) return
    const t = setTimeout(() => setZapisywanie(false), 8000)
    return () => clearTimeout(t)
  }, [zapisywanie])

  const zamigaj = useCallback(() => {
    setMiga((n) => n + 1)
  }, [])

  // --- wykrywanie zmian ---------------------------------------------------
  useEffect(() => {
    const onZmiana = (e: Event) => {
      const el = e.target as HTMLElement | null
      if (!el) return
      // pomijamy własne przyciski paska
      if (el.closest('[data-pasek-zmian]')) return
      if (!el.closest('main')) return
      const tag = el.tagName
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') return

      // formularz pola, a gdy pole leży poza nim (edytory z atrybutem form=)
      // bierzemy główny formularz strony
      const wlasny = (el as HTMLInputElement).form
      const glowny = document.querySelector<HTMLFormElement>('form[data-glowny]')
      const f = wlasny || glowny
      formRef.current = f
      setOpis(nazwaFormularza(f))
      setBrudny(true)
    }

    document.addEventListener('input', onZmiana, true)
    document.addEventListener('change', onZmiana, true)
    return () => {
      document.removeEventListener('input', onZmiana, true)
      document.removeEventListener('change', onZmiana, true)
    }
  }, [])

  // Zapis własnym przyciskiem formularza (z pominięciem paska) — pasek ma
  // pokazać ten sam stan, zamiast wisieć z „niezapisanymi zmianami".
  useEffect(() => {
    const onWyslanie = (e: Event) => {
      const f = e.target as HTMLFormElement | null
      if (!f || f.tagName !== 'FORM') return
      if (!brudnyRef.current) return
      brudnyRef.current = false
      setZapisywanie(true)
    }
    document.addEventListener('submit', onWyslanie, true)
    return () => document.removeEventListener('submit', onWyslanie, true)
  }, [])

  // --- blokada nawigacji po panelu ---------------------------------------
  useEffect(() => {
    const onKlik = (e: MouseEvent) => {
      if (!brudnyRef.current) return
      if (e.defaultPrevented) return
      // pozwalamy na nowe karty i klik środkowym
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const el = e.target as HTMLElement | null
      const link = el?.closest('a[href]') as HTMLAnchorElement | null
      if (!link) return
      if (link.closest('[data-pasek-zmian]')) return
      if (link.target === '_blank') return

      const href = link.getAttribute('href') || ''
      // kotwice na tej samej stronie są nieszkodliwe
      if (href.startsWith('#')) return

      e.preventDefault()
      e.stopImmediatePropagation()
      zamigaj()
    }

    // capture = wyprzedzamy router Next.js
    document.addEventListener('click', onKlik, true)
    return () => document.removeEventListener('click', onKlik, true)
  }, [zamigaj])

  // --- blokada zamknięcia / odświeżenia karty -----------------------------
  useEffect(() => {
    const onWyjscie = (e: BeforeUnloadEvent) => {
      if (!brudnyRef.current) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onWyjscie)
    return () => window.removeEventListener('beforeunload', onWyjscie)
  }, [])

  const zapisz = useCallback(() => {
    const f = formRef.current || document.querySelector<HTMLFormElement>('form[data-glowny]')
    if (!f) return
    setZapisywanie(true)
    brudnyRef.current = false // żeby beforeunload nie zatrzymał wysyłki
    f.requestSubmit()
  }, [])

  const odrzuc = useCallback(() => {
    brudnyRef.current = false
    // przeładowanie przywraca stan z serwera i czyści stan edytorów klienckich
    window.location.reload()
  }, [])

  if (!brudny) return null

  return (
    <>
      <style>{`
        @keyframes pasekWysun {
          from { transform: translateY(-100%); opacity: 0 }
          to   { transform: translateY(0);     opacity: 1 }
        }
        @keyframes pasekMignij {
          0%, 100% { background-color: #fffbeb; border-color: #fcd34d }
          50%      { background-color: #fee2e2; border-color: #ef4444 }
        }
        .pasek-zmian { animation: pasekWysun .18s ease-out }
        .pasek-miga  { animation: pasekMignij .4s ease-in-out 3 }
      `}</style>

      <div
        data-pasek-zmian
        key={miga}
        className={`pasek-zmian sticky top-0 z-50 border-b bg-amber-50 ${miga > 0 ? 'pasek-miga' : 'border-amber-300'}`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5">
          <span className="text-sm font-medium text-slate-800">{opis}</span>
          <span className="hidden text-xs text-slate-500 sm:inline">
            Zapisz albo odrzuć, zanim przejdziesz dalej.
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={odrzuc}
              disabled={zapisywanie}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50"
            >
              Odrzuć zmiany
            </button>
            <button
              type="button"
              onClick={zapisz}
              disabled={zapisywanie}
              className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50"
            >
              {zapisywanie ? 'Zapisywanie…' : 'Zapisz'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
