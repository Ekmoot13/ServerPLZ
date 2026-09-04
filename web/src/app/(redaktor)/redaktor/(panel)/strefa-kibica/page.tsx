import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { updateStrefaKibica } from '../../actions'

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

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold">Strefa Kibica</h1>
      <p className="mb-6 text-sm text-slate-500">
        Ustaw mapę i tabelę wyników pod bieżącą rundę. Skopiuj z SAP adres widoku RaceBoard
        (…/gwt/RaceBoard.html?…&amp;mode=PLAYER) i wklej poniżej.
      </p>

      <form action={updateStrefaKibica} className="space-y-5">
        {sp?.ok === '1' && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            Zapisano.
          </div>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="pokazPrzycisk" defaultChecked={s?.pokazPrzycisk !== false} />
          Pokaż przycisk „Śledź Regaty" (nagłówek + strona główna)
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="pokazMape" defaultChecked={s?.pokazMape !== false} />
          Pokaż mapę na podstronie Strefy Kibica
        </label>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Mapa — URL RaceBoard (SAP)</label>
          <input
            name="mapaUrl"
            defaultValue={s?.mapaUrl || ''}
            placeholder="https://plz2026.sapsailing.com/gwt/RaceBoard.html?...&mode=PLAYER"
            className={inputCls}
          />
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

        <div className="border-t border-slate-200 pt-5">
          <button type="submit" className="rounded-lg bg-sky-600 px-5 py-2 font-medium text-white hover:bg-sky-500">
            Zapisz
          </button>
        </div>
      </form>
    </div>
  )
}
