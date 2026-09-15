'use client'
import React, { useState } from 'react'
import { createTransmisja, updateTransmisja, deleteTransmisja } from '../../actions'

export type Transmisja = {
  id: string | number
  tytul?: string
  typ?: string
  youtubeUrl?: string
  rtmpKey?: string
  opis?: string
  aktywny?: boolean
}

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
const labelCls = 'mb-1 block text-xs font-medium text-slate-600'

/** Pola wspólne dla dodawania i edycji — link zależy od wybranego typu. */
function Pola({ t }: { t?: Transmisja }) {
  const [typ, setTyp] = useState<string>(t?.typ || 'youtube')

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[1fr_170px]">
        <div>
          <label className={labelCls}>Tytuł</label>
          <input name="tytul" defaultValue={t?.tytul || ''} placeholder="np. Kamera burtowa" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Typ</label>
          <select name="typ" value={typ} onChange={(e) => setTyp(e.target.value)} className={inputCls}>
            <option value="youtube">YouTube</option>
            <option value="kamera">Kamera (RTMP/HLS)</option>
          </select>
        </div>
      </div>

      {typ === 'youtube' ? (
        <div>
          <label className={labelCls}>Link YouTube</label>
          <input
            name="youtubeUrl"
            defaultValue={t?.youtubeUrl || ''}
            placeholder="https://www.youtube.com/watch?v=… albo /live/…"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-slate-500">
            Działa zwykły link do filmu, transmisji na żywo (<code>/live/</code>) oraz skrócony <code>youtu.be</code>.
          </p>
        </div>
      ) : (
        <div>
          <label className={labelCls}>Klucz RTMP</label>
          <input name="rtmpKey" defaultValue={t?.rtmpKey || ''} placeholder="zostaw puste, aby wygenerować" className={inputCls} />
          <p className="mt-1 text-xs text-slate-500">
            Kamera nadaje na <code>rtmp://SERWER:1935/live/&lt;klucz&gt;</code>.
          </p>
        </div>
      )}

      <div>
        <label className={labelCls}>Opis (opcjonalnie)</label>
        <input name="opis" defaultValue={t?.opis || ''} className={inputCls} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="aktywny" defaultChecked={t?.aktywny === true} />
        Aktywna — pokaż w Strefie Kibica
      </label>
    </>
  )
}

export default function TransmisjeEditor({ initial }: { initial: Transmisja[] }) {
  const [dodawanie, setDodawanie] = useState(false)
  const aktywne = initial.filter((t) => t.aktywny).length

  return (
    <div id="transmisje" className="border-t border-slate-200 pt-6">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Transmisje na żywo</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
          {initial.length} łącznie · {aktywne} aktywnych
        </span>
      </div>
      <p className="mb-4 text-sm text-slate-500">
        Źródła pokazywane w sekcji „Transmisja na żywo". Aktywnych może być kilka — redaktor przełącza
        je wtedy przyciskami nad odtwarzaczem. Nieaktywne zostają zapisane na później.
      </p>

      {initial.length === 0 && !dodawanie && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Brak transmisji. Dodaj pierwszą poniżej.
        </div>
      )}

      <div className="space-y-3">
        {initial.map((t) => (
          <form
            key={t.id}
            action={updateTransmisja}
            data-nazwa={`transmisja „${t.tytul || 'bez tytułu'}”`}
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <input type="hidden" name="id" value={String(t.id)} />
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${t.aktywny ? 'bg-red-500' : 'bg-slate-300'}`}
                title={t.aktywny ? 'Aktywna' : 'Nieaktywna'}
              />
              <span className="text-sm font-semibold text-slate-800">{t.tytul || 'Bez tytułu'}</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] uppercase text-slate-500">
                {t.typ === 'kamera' ? 'kamera' : 'youtube'}
              </span>
            </div>

            <Pola t={t} />

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500"
              >
                Zapisz
              </button>
              <button
                type="submit"
                formAction={deleteTransmisja}
                className="text-sm text-slate-400 hover:text-red-600"
              >
                Usuń
              </button>
            </div>
          </form>
        ))}
      </div>

      {dodawanie ? (
        <form action={createTransmisja} data-nazwa="nowa transmisja" className="mt-3 space-y-3 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/50 p-4">
          <h3 className="text-sm font-bold text-slate-700">Nowa transmisja</h3>
          <Pola />
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500"
            >
              Dodaj
            </button>
            <button
              type="button"
              onClick={() => setDodawanie(false)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Anuluj
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setDodawanie(true)}
          className="mt-3 rounded-lg border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-sky-400 hover:text-sky-700"
        >
          + Dodaj transmisję
        </button>
      )}
    </div>
  )
}
