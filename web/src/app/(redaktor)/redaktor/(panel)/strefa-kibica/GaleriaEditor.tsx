'use client'
import React, { useState } from 'react'
import { uploadMedia } from '../../actions'

/**
 * Sekcja galerii w Strefie Kibica.
 *
 * Dwa tryby: albo zaciągamy najnowsze zdjęcia prosto z galerii SmugMug, albo
 * redaktor sam wskazuje, co ma się wyświetlić. Lista ręczna jest pod spodem
 * także w trybie automatycznym — dzięki temu przygotowany wcześniej zestaw nie
 * przepada po przełączeniu i można wrócić do niego jednym kliknięciem.
 */
type Zdjecie = { url: string; link?: string }

const inp =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
const btn =
  'rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50'
const btnDel = 'rounded-lg border border-red-200 px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50'

const MAX_MB = 25

export default function GaleriaEditor({
  formId,
  initialTryb,
  initialKolejnosc,
  initialZdjecia,
}: {
  /** Sekcja leży poza głównym formularzem — pola muszą być z nim związane. */
  formId?: string
  initialTryb: string
  initialKolejnosc: string
  initialZdjecia: Zdjecie[]
}) {
  const [tryb, setTryb] = useState(initialTryb === 'reczny' ? 'reczny' : 'auto')
  const [kolejnosc, setKolejnosc] = useState(
    initialKolejnosc === 'pierwsze' ? 'pierwsze' : 'najnowsze',
  )
  const [zdjecia, setZdjecia] = useState<Zdjecie[]>(initialZdjecia)
  const [wgrywanie, setWgrywanie] = useState<number | null>(null)

  const zmien = (i: number, pola: Partial<Zdjecie>) =>
    setZdjecia((arr) => arr.map((z, j) => (j === i ? { ...z, ...pola } : z)))

  const wgraj = async (i: number, file: File) => {
    const mb = file.size / 1024 / 1024
    if (mb > MAX_MB) {
      alert(`Zdjęcie ma ${mb.toFixed(1)} MB, a maksimum to ${MAX_MB} MB.`)
      return
    }
    setWgrywanie(i)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const wynik = await uploadMedia(fd)
      if (wynik?.url) zmien(i, { url: wynik.url })
      else alert('Serwer nie zwrócił adresu zdjęcia. Spróbuj ponownie.')
    } catch (err) {
      alert(`Nie udało się wgrać zdjęcia.\n\n${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setWgrywanie(null)
    }
  }

  return (
    <div>
      <input type="hidden" form={formId} name="galeriaTryb" value={tryb} />
      <input type="hidden" form={formId} name="galeriaKolejnosc" value={kolejnosc} />
      <input type="hidden" form={formId} name="galeriaZdjecia" value={JSON.stringify(zdjecia)} />

      <div className="mb-3">
        <span className="mb-1 block text-sm font-medium text-slate-700">Skąd brać zdjęcia</span>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={tryb === 'auto'}
              onChange={() => setTryb('auto')}
            />
            Najnowsze zdjęcia z galerii
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={tryb === 'reczny'}
              onChange={() => setTryb('reczny')}
            />
            Wskazane przeze mnie zdjęcia
          </label>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {tryb === 'auto'
            ? 'Pobieramy cztery zdjęcia z podanej wyżej galerii. Jeśli SmugMug nie odpowie, pokażemy zdjęcia z listy poniżej.'
            : 'Pokazujemy wyłącznie zdjęcia z listy poniżej, w tej kolejności.'}
        </p>
      </div>

      {tryb === 'auto' && (
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Które zdjęcia z galerii
          </label>
          <select
            value={kolejnosc}
            onChange={(e) => setKolejnosc(e.target.value)}
            className={inp + ' max-w-xs'}
          >
            <option value="najnowsze">Najnowsze (koniec galerii)</option>
            <option value="pierwsze">Pierwsze (początek galerii)</option>
          </select>
          <p className="mt-1 text-xs text-slate-500">
            SmugMug układa zdjęcia zwykle od najstarszych, dlatego „najnowsze" sięgają na koniec
            albumu. Jeśli masz galerię posortowaną odwrotnie, wybierz „pierwsze".
          </p>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            Zdjęcia wskazane ręcznie{' '}
            <span className="font-normal text-slate-500">
              (na komputerze widoczne 4, na telefonie 3)
            </span>
          </h3>
          <button
            type="button"
            className={btn}
            onClick={() => setZdjecia((z) => [...z, { url: '', link: '' }])}
          >
            + Dodaj zdjęcie
          </button>
        </div>

        {zdjecia.length === 0 && (
          <p className="py-2 text-sm text-slate-500">
            Brak zdjęć na liście
            {tryb === 'auto' ? ' — w trybie automatycznym nie jest potrzebna.' : '.'}
          </p>
        )}

        <div className="space-y-2">
          {zdjecia.map((z, i) => (
            <div key={i} className="flex items-start gap-2">
              {z.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={z.url}
                  alt=""
                  className="h-16 w-24 shrink-0 rounded-lg border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                  brak
                </div>
              )}

              <div className="min-w-0 flex-1 space-y-2">
                <input
                  className={inp}
                  placeholder="Adres zdjęcia (https://… albo /api/media/file/…)"
                  value={z.url}
                  onChange={(e) => zmien(i, { url: e.target.value })}
                />
                <input
                  className={inp}
                  placeholder="Dokąd prowadzi kliknięcie (puste = adres galerii)"
                  value={z.link || ''}
                  onChange={(e) => zmien(i, { link: e.target.value })}
                />
              </div>

              <div className="flex shrink-0 flex-col gap-2">
                <label className={`${btn} cursor-pointer text-center`}>
                  {wgrywanie === i ? 'Wgrywanie…' : 'Wgraj'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      e.target.value = ''
                      if (f) wgraj(i, f)
                    }}
                  />
                </label>
                <button
                  type="button"
                  className={btnDel}
                  onClick={() => setZdjecia((arr) => arr.filter((_, j) => j !== i))}
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
