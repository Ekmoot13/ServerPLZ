'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RichEditor from './RichEditor'
import { zapiszWpis } from '../../actions'

export type WpisInitial = {
  title: string
  slug: string
  status: string // 'draft' | 'published'
  publishedAt: string // ISO lub ''
  heroUrl?: string
  trescHtml: string
  categories: string[] // ids
}

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

/** Ile bezczynności czekamy, zanim szkic zapisze się sam. */
const OPOZNIENIE_AUTOZAPISU = 1500
/** Jak długo wisi dymek z potwierdzeniem. */
const CZAS_DYMKA = 2600

type Stan = 'czysty' | 'brudny' | 'zapisywanie' | 'zapisano' | 'blad'

export default function WpisForm({
  id: idPoczatkowe,
  initial,
  categories,
}: {
  id?: string
  initial: WpisInitial
  categories: { id: string; title: string }[]
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [id, setId] = useState(idPoczatkowe || '')
  const [status, setStatus] = useState(initial.status || 'draft')
  const [selCats, setSelCats] = useState<string[]>(initial.categories || [])
  const [stan, setStan] = useState<Stan>('czysty')
  const [blad, setBlad] = useState('')
  // Licznik mignięć — zmiana wartości restartuje animację przycisku.
  const [miga, setMiga] = useState(0)

  const szkic = status !== 'published'

  // Wartości czytane w nasłuchach zdarzeń — tam nie widać świeżego stanu.
  const stanRef = useRef(stan)
  const szkicRef = useRef(szkic)
  const idRef = useRef(id)
  useEffect(() => {
    stanRef.current = stan
  }, [stan])
  useEffect(() => {
    szkicRef.current = szkic
  }, [szkic])
  useEffect(() => {
    idRef.current = id
  }, [id])

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dymekRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // --- zapis --------------------------------------------------------------

  const zapisz = useCallback(async (): Promise<boolean> => {
    const f = formRef.current
    if (!f) return false
    if (timerRef.current) clearTimeout(timerRef.current)
    setStan('zapisywanie')

    const fd = new FormData(f)
    if (idRef.current) fd.set('id', idRef.current)
    else fd.delete('id')

    const wynik = await zapiszWpis(fd)

    if (!wynik.ok) {
      setBlad(wynik.blad || 'Nie udało się zapisać.')
      setStan('blad')
      return false
    }

    // Nowy wpis dostał identyfikator — od tej pory nadpisujemy ten sam dokument,
    // a adres w pasku przeglądarki ma prowadzić do jego edycji.
    if (!idRef.current && wynik.id) {
      idRef.current = wynik.id
      setId(wynik.id)
      window.history.replaceState(null, '', `/redaktor/wpisy/${wynik.id}`)
    }
    // Plik zdjęcia głównego poszedł już na serwer — bez wyczyszczenia pola
    // każdy kolejny autozapis wgrywałby go jeszcze raz.
    const plik = f.querySelector<HTMLInputElement>('input[name="heroImage"]')
    if (plik?.value) plik.value = ''

    setBlad('')
    setStan('zapisano')
    if (dymekRef.current) clearTimeout(dymekRef.current)
    dymekRef.current = setTimeout(() => {
      setStan((s) => (s === 'zapisano' ? 'czysty' : s))
    }, CZAS_DYMKA)
    return true
  }, [])

  /** Coś się zmieniło: szkic zapisujemy sami, opublikowany czeka na przycisk. */
  const oznaczZmiane = useCallback(() => {
    setStan('brudny')
    if (!szkicRef.current) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      void zapisz()
    }, OPOZNIENIE_AUTOZAPISU)
  }, [zapisz])

  // Zwykłe pola formularza. Edytor treści woła `oznaczZmiane` sam — zmiana
  // ukrytego pola nie generuje zdarzenia `input`.
  useEffect(() => {
    const f = formRef.current
    if (!f) return
    const h = () => oznaczZmiane()
    f.addEventListener('input', h)
    f.addEventListener('change', h)
    return () => {
      f.removeEventListener('input', h)
      f.removeEventListener('change', h)
    }
  }, [oznaczZmiane])

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (dymekRef.current) clearTimeout(dymekRef.current)
    },
    [],
  )

  const doZapisania = stan === 'brudny' || stan === 'blad'

  // --- wyjście z edycji ---------------------------------------------------

  // Kliknięcie w odnośnik przy niezapisanych zmianach: szkic dopisujemy od ręki
  // i puszczamy dalej, opublikowany zatrzymujemy i mrugamy przyciskiem zapisu.
  useEffect(() => {
    const onKlik = (e: MouseEvent) => {
      if (stanRef.current !== 'brudny' && stanRef.current !== 'blad') return
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const el = e.target as HTMLElement | null
      const link = el?.closest('a[href]') as HTMLAnchorElement | null
      if (!link || link.target === '_blank') return
      const href = link.getAttribute('href') || ''
      if (href.startsWith('#')) return

      e.preventDefault()
      e.stopImmediatePropagation()

      if (szkicRef.current) {
        void zapisz().then((ok) => {
          if (ok) router.push(href)
          else setMiga((n) => n + 1)
        })
      } else {
        setMiga((n) => n + 1)
      }
    }
    document.addEventListener('click', onKlik, true)
    return () => document.removeEventListener('click', onKlik, true)
  }, [router, zapisz])

  useEffect(() => {
    const onWyjscie = (e: BeforeUnloadEvent) => {
      if (stanRef.current !== 'brudny' && stanRef.current !== 'blad') return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onWyjscie)
    return () => window.removeEventListener('beforeunload', onWyjscie)
  }, [])

  // --- przycisk w pasku edytora -------------------------------------------

  const przyciskZapisu = szkic ? (
    <span className="text-xs text-slate-500">
      {stan === 'zapisywanie' ? 'Zapisywanie…' : stan === 'brudny' ? 'Szkic — zapisze się sam' : 'Szkic'}
    </span>
  ) : (
    <button
      key={miga}
      type="button"
      onClick={() => void zapisz()}
      disabled={stan === 'zapisywanie'}
      className={`rounded-lg px-4 py-1.5 text-sm font-medium text-white transition disabled:opacity-60 ${
        miga > 0 && doZapisania ? 'przycisk-miga' : doZapisania ? 'bg-sky-600 hover:bg-sky-500' : 'bg-slate-400'
      }`}
    >
      {stan === 'zapisywanie' ? 'Zapisywanie…' : doZapisania ? 'Zapisz zmiany' : 'Zapisano'}
    </button>
  )

  const dtLocal = initial.publishedAt ? new Date(initial.publishedAt).toISOString().slice(0, 16) : ''

  return (
    <>
      <style>{`
        @keyframes przyciskMignij {
          0%, 100% { background-color: #0284c7 }
          50%      { background-color: #dc2626 }
        }
        .przycisk-miga { animation: przyciskMignij .4s ease-in-out 3; background-color: #dc2626 }
        @keyframes dymekWjedz {
          from { transform: translateY(8px); opacity: 0 }
          to   { transform: translateY(0);   opacity: 1 }
        }
        .dymek { animation: dymekWjedz .18s ease-out }
      `}</style>

      {/* data-wlasny-zapis: wspólny pasek „niezapisane zmiany" ma tu nie wchodzić,
          bo edytor pilnuje zapisu po swojemu. */}
      <form ref={formRef} data-wlasny-zapis className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {id && <input type="hidden" name="id" value={id} />}
        <input type="hidden" name="categories" value={JSON.stringify(selCats)} />

        {/* Tytuł */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Tytuł</label>
          <input name="title" defaultValue={initial.title} required className={inputCls} />
        </div>

        {/* Slug + data + status */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Adres (slug)</label>
            <input name="slug" defaultValue={initial.slug} placeholder="auto z tytułu" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Data publikacji</label>
            <input type="datetime-local" name="publishedAt" defaultValue={dtLocal} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputCls}
            >
              <option value="draft">Szkic</option>
              <option value="published">Opublikowany</option>
            </select>
          </div>
        </div>

        {/* Zdjęcie główne */}
        <div className="flex items-center gap-4">
          {initial.heroUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={initial.heroUrl} alt="" className="h-24 w-40 rounded-lg object-cover" />
          ) : (
            <div className="flex h-24 w-40 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
              brak
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Zdjęcie główne (podmień)</label>
            <input type="file" name="heroImage" accept="image/*" className="text-sm" />
          </div>
        </div>

        {/* Kategorie */}
        {categories.length > 0 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Kategorie</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <label
                  key={c.id}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${
                    selCats.includes(c.id)
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-slate-300 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selCats.includes(c.id)}
                    onChange={() => {
                      setSelCats((prev) =>
                        prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id],
                      )
                      oznaczZmiane()
                    }}
                  />
                  {c.title}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Treść */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Treść</label>
          <RichEditor
            name="trescHtml"
            initialHtml={initial.trescHtml}
            onZmiana={oznaczZmiane}
            akcje={przyciskZapisu}
          />
        </div>

        <div className="border-t border-slate-200 pt-5">
          <Link href="/redaktor/wpisy" className="text-sm text-slate-500 hover:underline">
            ← Wróć do listy
          </Link>
        </div>
      </form>

      {/* Dymek w lewym dolnym rogu — jedyne potwierdzenie zapisu, odkąd nie ma
          przycisku pod formularzem. */}
      {(stan === 'zapisano' || stan === 'blad') && (
        <div
          role="status"
          className={`dymek fixed bottom-4 left-4 z-50 rounded-lg px-4 py-2.5 text-sm shadow-lg ${
            stan === 'zapisano'
              ? 'border border-green-200 bg-green-50 text-green-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {stan === 'zapisano' ? 'Zmiany zapisane' : `Nie zapisano: ${blad}`}
        </div>
      )}
    </>
  )
}
