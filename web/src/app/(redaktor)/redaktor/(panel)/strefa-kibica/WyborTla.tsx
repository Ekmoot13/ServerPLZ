'use client'
import React, { useRef, useState } from 'react'
import { uploadMedia } from '../../actions'

/**
 * Wybor zdjecia w tle sekcji informacyjnej Strefy Kibica.
 *
 * Redaktor moze wgrac plik z dysku albo wkleic gotowy adres. Pole tekstowe
 * jest zrodlem prawdy — wgranie pliku tylko je wypelnia.
 */
const inp =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

// Zgodne z experimental.serverActions.bodySizeLimit w next.config.ts
const MAX_MB = 25

export default function WyborTla({
  nazwa,
  poczatkowe,
  formId,
}: {
  nazwa: string
  poczatkowe?: string
  /** Sekcja lezy poza glownym formularzem — pole musi byc z nim zwiazane. */
  formId?: string
}) {
  const [url, setUrl] = useState(poczatkowe || '')
  const [wgrywanie, setWgrywanie] = useState(false)
  const plikRef = useRef<HTMLInputElement>(null)

  const onPlik = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const mb = file.size / 1024 / 1024
    if (mb > MAX_MB) {
      alert(`Zdjęcie ma ${mb.toFixed(1)} MB, a maksimum to ${MAX_MB} MB.`)
      return
    }

    setWgrywanie(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const wynik = await uploadMedia(fd)
      if (wynik?.url) setUrl(wynik.url)
      else alert('Serwer nie zwrócił adresu zdjęcia. Spróbuj ponownie.')
    } catch (err) {
      alert(`Nie udało się wgrać zdjęcia.\n\n${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setWgrywanie(false)
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Zdjęcie w tle sekcji informacyjnej
      </label>

      <div className="flex flex-wrap items-start gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-20 w-32 shrink-0 rounded-lg border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
            brak tła
          </div>
        )}

        <div className="min-w-[240px] flex-1">
          <input
            form={formId}
            name={nazwa}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/api/media/file/zdjecie.jpg albo https://…"
            className={inp}
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => plikRef.current?.click()}
              disabled={wgrywanie}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-sky-400 hover:text-sky-700 disabled:opacity-50"
            >
              {wgrywanie ? 'Wgrywanie…' : 'Wgraj z dysku'}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="text-sm text-slate-400 hover:text-red-600"
              >
                Usuń tło
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Zdjęcie przykrywa jasna warstwa, żeby tekst programu pozostał czytelny. Najlepiej sprawdzi
            się szeroki kadr z wody. Puste pole = zwykłe białe tło.
          </p>
        </div>
      </div>

      <input ref={plikRef} type="file" accept="image/*" className="hidden" onChange={onPlik} />
    </div>
  )
}
