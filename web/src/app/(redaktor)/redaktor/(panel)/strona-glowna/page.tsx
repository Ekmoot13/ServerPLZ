import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { updateStronaGlowna } from '../../actions'
import { GrupyEditor } from './Editors'
import { DEFAULT_GRUPY } from '@/lib/sponsorzy'

export const dynamic = 'force-dynamic'

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
const labelCls = 'mb-1 block text-sm font-medium text-slate-700'

function Sekcja({ tytul, opis, children }: { tytul: string; opis?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-slate-900">{tytul}</h2>
      {opis && <p className="mt-1 mb-4 text-sm text-slate-500">{opis}</p>}
      <div className={opis ? 'space-y-4' : 'mt-4 space-y-4'}>{children}</div>
    </section>
  )
}

export default async function StronaGlownaPanel({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const sp = await searchParams
  const payload = await getPayload({ config })
  const sg: any = await payload.findGlobal({ slug: 'strona-glowna' as any }).catch(() => ({}))
  const W = sg?.wprowadzenie || {}
  const SP = sg?.sponsorzy || {}

  return (
    <div className="max-w-4xl">
      <h1 className="mb-1 text-2xl font-bold">Strona główna</h1>
      <p className="mb-6 text-sm text-slate-500">
        Edytowalne sekcje strony głównej. Pozostałe elementy (aktualności, pasek najbliższych regat, karuzela mistrzów,
        wyniki) pobierają się automatycznie z danych.
      </p>

      {sp?.ok === '1' && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">Zapisano.</div>
      )}

      <form action={updateStronaGlowna} className="space-y-6">
        {/* WPROWADZENIE — „Regaty jak na stadionie” */}
        <Sekcja tytul="Regaty jak na stadionie" opis="Baner z tekstem i przyciskami otwierającymi pop-upy.">
          <div>
            <label className={labelCls}>Tytuł banera</label>
            <input name="wTytul" defaultValue={W.tytul || 'REGATY JAK NA STADIONIE'} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Tekst banera (akapity oddzielone pustą linią; można używać &lt;strong&gt;…&lt;/strong&gt;)</label>
            <textarea name="wTekst" defaultValue={W.tekst || ''} rows={6} className={inputCls} />
            <p className="mt-1 text-xs text-slate-400">Puste = domyślny tekst wpisany w kodzie.</p>
          </div>
          <div>
            <label className={labelCls}>Pop-up „Jakie są poziomy ligi?” — URL obrazu</label>
            <input name="poziomyObraz" defaultValue={W.poziomyObraz || '/poziomy-lig.png'} className={inputCls} />
          </div>
        </Sekcja>

        {/* SPONSORZY */}
        <Sekcja
          tytul="Sponsorzy i Partnerzy"
          opis="Grupy logotypów. Przy każdym logo suwak skali (rozmiar). Kolejność zmieniasz strzałkami."
        >
          <div>
            <label className={labelCls}>Nagłówek sekcji</label>
            <input name="spTytul" defaultValue={SP.tytul || 'Sponsorzy'} className={inputCls} />
          </div>
          <GrupyEditor name="spGrupy" initial={Array.isArray(SP.grupy) && SP.grupy.length ? SP.grupy : DEFAULT_GRUPY} />
        </Sekcja>

        <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
          <button type="submit" className="rounded-lg bg-sky-600 px-6 py-2.5 font-medium text-white hover:bg-sky-500">
            Zapisz stronę główną
          </button>
        </div>
      </form>
    </div>
  )
}
