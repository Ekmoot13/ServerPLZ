import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { updateStrefaKibica } from '../../actions'
import GaleriaEditor from './GaleriaEditor'
import ProgramEditor from './ProgramEditor'
import TransmisjeEditor from './TransmisjeEditor'
import WyborTla from './WyborTla'

export const dynamic = 'force-dynamic'

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

export default async function StrefaKibicaSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>
}) {
  const sp = await searchParams
  const payload = await getPayload({ config })
  const s: any = await payload.findGlobal({ slug: 'strefa-kibica' }).catch(() => ({}))
  const transRes = await payload
    .find({ collection: 'transmisje' as any, limit: 100, depth: 0, sort: '-aktywny' })
    .catch(() => ({ docs: [] as any[] }))
  const transmisje = (transRes.docs as any[]) || []
  const katRes = await payload
    .find({ collection: 'categories', limit: 200, depth: 0, sort: 'title' })
    .catch(() => ({ docs: [] as any[] }))
  const kategorie = (katRes.docs as any[]) || []

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold">Strefa Kibica</h1>
      <p className="mb-6 text-sm text-slate-500">
        Ustaw mapę i tabelę wyników pod bieżącą rundę. Skopiuj z SAP adres widoku RaceBoard
        (…/gwt/RaceBoard.html?…&amp;mode=PLAYER) i wklej poniżej.
      </p>

      <form id="ustawienia-strefy" data-glowny data-nazwa="ustawienia Strefy Kibica" action={updateStrefaKibica} className="space-y-5">
        {!!sp?.ok && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            Zapisano.
          </div>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="pokazPrzycisk" defaultChecked={s?.pokazPrzycisk !== false} />
          Pokaż przycisk „Śledź Regaty" w nagłówku strony
          <span className="text-xs text-slate-500">
            (przycisk w pasku regat ustawiasz w zakładce Strona główna)
          </span>
        </label>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-1 text-sm font-bold text-slate-700">Sekcje dashboardu</h2>
          <p className="mb-3 text-xs text-slate-500">
            Odznacz, by ukryć sekcję na stronie. Pozostałe automatycznie rozłożą się na wolnym
            miejscu. Po wyłączeniu wszystkich trzech cały ciemny dashboard znika.
          </p>

          <label className="flex items-center gap-2 py-1 text-sm">
            <input type="checkbox" name="pokazMape" defaultChecked={s?.pokazMape !== false} />
            Mapa wyścigu — pozycje łódek na żywo (SAP)
          </label>

          <label className="flex items-center gap-2 py-1 text-sm">
            <input type="checkbox" name="pokazTransmisje" defaultChecked={s?.pokazTransmisje !== false} />
            Transmisja na żywo
          </label>

          <label className="flex items-center gap-2 py-1 text-sm">
            <input type="checkbox" name="pokazWyniki" defaultChecked={s?.pokazWyniki !== false} />
            Wyniki na żywo (tabela z SAP)
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Mapa — URL RaceBoard (SAP){' '}
            <span className="font-normal text-slate-400">— opcjonalne</span>
          </label>
          <input
            name="mapaUrl"
            defaultValue={s?.mapaUrl || ''}
            placeholder="zostaw puste, żeby mapa sama szła za wyścigiem"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-slate-500">
            Puste pole = mapa sama pokazuje trwający wyścig, a między wyścigami ostatni
            rozegrany. Adres składamy z nazwy leaderboardu poniżej, więc nie trzeba go
            podmieniać po każdym starcie. Wpisz własny tylko wtedy, gdy chcesz na stałe
            zatrzymać mapę na konkretnym wyścigu.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Instancja SAP (API tabeli wyników)</label>
          <input
            name="sapBase"
            defaultValue={s?.sapBase || 'https://plz2026.sapsailing.com'}
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nazwa leaderboardu (tabela na żywo)</label>
          <input
            name="leaderboardName"
            defaultValue={s?.leaderboardName || ''}
            placeholder="Polish Sailing League 2026 (2nd divison) - Gdynia (3)"
            className={inputCls}
          />
        </div>

      </form>

      {/* Transmisje mają własne formularze (zapis per pozycja), więc nie mogą
          leżeć wewnątrz głównego — stąd przerwa i atrybut form= w polach niżej. */}
      <div className="mt-6">
        <TransmisjeEditor initial={transmisje} />
      </div>

      {/* ---- SEKCJA INFORMACYJNA (PROGRAM WEEKENDU) ---- */}
      <div className="mt-6 space-y-5">
        <div className="border-t border-slate-200 pt-6">
          <h2 className="mb-4 text-lg font-bold">Sekcja informacyjna (pod dashboardem)</h2>

          <label className="mb-4 flex items-center gap-2 text-sm">
            <input type="checkbox" form="ustawienia-strefy" name="pokazProgram" defaultChecked={s?.pokazProgram !== false} />
            Pokaż sekcję informacyjną (program weekendu)
          </label>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">Nagłówek</label>
            <input form="ustawienia-strefy" name="programTytul" defaultValue={s?.programTytul || 'Śledź z nami regaty dzień po dniu'} className={inputCls} />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">Wstęp</label>
            <textarea form="ustawienia-strefy" name="programWstep" defaultValue={s?.programWstep || ''} rows={2} className={inputCls} />
          </div>

          <div className="mb-4">
            <WyborTla nazwa="programTlo" poczatkowe={s?.programTlo || ''} formId="ustawienia-strefy" />
          </div>

          <ProgramEditor
            formId="ustawienia-strefy"
            initialLinki={Array.isArray(s?.linki) ? s.linki : []}
            initialProgram={Array.isArray(s?.program) ? s.program : []}
          />

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">Lokalizacja — adres osadzenia mapy Google (opcjonalnie)</label>
            <input
              form="ustawienia-strefy"
              name="mapaEmbed"
              defaultValue={s?.mapaEmbed || ''}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className={inputCls}
            />
          </div>
        </div>

        {/* ---- GALERIA ZDJEC ---- */}
        <div className="border-t border-slate-200 pt-6">
          <h2 className="mb-4 text-lg font-bold">Galeria zdjęć (na dole strony)</h2>

          <label className="mb-4 flex items-center gap-2 text-sm">
            <input type="checkbox" form="ustawienia-strefy" name="pokazGalerie" defaultChecked={s?.pokazGalerie !== false} />
            Pokaż sekcję galerii
          </label>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">Nagłówek</label>
            <input form="ustawienia-strefy" name="galeriaTytul" defaultValue={s?.galeriaTytul || 'Galeria zdjęć'} className={inputCls} />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">Adres galerii (SmugMug)</label>
            <input
              form="ustawienia-strefy"
              name="galeriaUrl"
              defaultValue={s?.galeriaUrl || ''}
              placeholder="https://ligazeglarska.smugmug.com/2026-Polska-Liga-zeglarska/..."
              className={inputCls}
            />
            <p className="mt-1 text-xs text-slate-500">
              Nagłówek sekcji i przycisk pod zdjęciami prowadzą pod ten adres.
            </p>
          </div>

          <GaleriaEditor
            formId="ustawienia-strefy"
            initialTryb={s?.galeriaTryb || 'auto'}
            initialKolejnosc={s?.galeriaKolejnosc || 'najnowsze'}
            initialZdjecia={Array.isArray(s?.galeriaZdjecia) ? s.galeriaZdjecia : []}
          />
        </div>

        {/* ---- AKTUALNOSCI ---- */}
        <div className="border-t border-slate-200 pt-6">
          <h2 className="mb-4 text-lg font-bold">Aktualności (na samym dole)</h2>

          <label className="mb-4 flex items-center gap-2 text-sm">
            <input type="checkbox" form="ustawienia-strefy" name="pokazAktualnosci" defaultChecked={s?.pokazAktualnosci !== false} />
            Pokaż sekcję aktualności
          </label>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">Nagłówek</label>
            <input form="ustawienia-strefy" name="aktualnosciTytul" defaultValue={s?.aktualnosciTytul || 'Aktualności'} className={inputCls} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Kategoria</label>
            <select
              form="ustawienia-strefy"
              name="aktualnosciKategoria"
              defaultValue={s?.aktualnosciKategoria || ''}
              className={inputCls}
            >
              <option value="">Wszystkie najnowsze</option>
              {kategorie.map((k) => (
                <option key={k.id} value={String(k.id)}>
                  {k.title}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Pokazujemy cztery najnowsze wpisy — na telefonie trzy.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5">
          <button type="submit" form="ustawienia-strefy" className="rounded-lg bg-sky-600 px-5 py-2 font-medium text-white hover:bg-sky-500">
            Zapisz
          </button>
        </div>
      </div>
    </div>
  )
}
