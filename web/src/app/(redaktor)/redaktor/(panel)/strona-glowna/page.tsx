import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { updateStronaGlowna } from '../../actions'
import RichEditor from '../wpisy/RichEditor'
import { LinkListEditor, GrupyEditor, ZgloszeniaEditor } from './Editors'

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

export default async function StronaGlownaPanel({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>
}) {
  const sp = await searchParams
  const payload = await getPayload({ config })
  const sg: any = await payload.findGlobal({ slug: 'strona-glowna' as any }).catch(() => ({}))
  const A = sg?.aktualnosci || {}
  const NR = sg?.nastepneRegaty || {}
  const W = sg?.wprowadzenie || {}
  const SP = sg?.sponsorzy || {}

  return (
    <div className="max-w-4xl">
      <h1 className="mb-1 text-2xl font-bold">Strona główna</h1>
      <p className="mb-6 text-sm text-slate-500">
        Edytuj każdą sekcję strony głównej: zdjęcia, linki i tekst.
      </p>

      {sp?.ok === '1' && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          Zapisano.
        </div>
      )}

      <form action={updateStronaGlowna} className="space-y-6">
        {/* AKTUALNOŚCI */}
        <Sekcja tytul="1. Aktualności" opis="Baner „śledź regaty” oraz najnowsze posty z Facebooka i Instagrama.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Sposób wyświetlania</label>
              <select name="tryb" defaultValue={A.tryb || 'rotacja'} className={inputCls}>
                <option value="rotacja">Rotacja (przejście z jednego do drugiego)</option>
                <option value="pojedynczy">Pojedyncze wyświetlenie</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Element w trybie pojedynczym</label>
              <select name="pojedynczyElement" defaultValue={A.pojedynczyElement || 'baner'} className={inputCls}>
                <option value="baner">Baner „Śledź regaty”</option>
                <option value="facebook">Najnowszy post Facebook</option>
                <option value="instagram">Najnowszy post Instagram</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="pokazBaner" defaultChecked={A.pokazBaner !== false} /> Pokaż baner „Śledź regaty”
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="pokazFacebook" defaultChecked={!!A.pokazFacebook} /> Pokaż post Facebook
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="pokazInstagram" defaultChecked={!!A.pokazInstagram} /> Pokaż post Instagram
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Baner — tytuł</label>
              <input name="banerTytul" defaultValue={A.banerTytul || 'Śledź regaty na żywo'} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Baner — link</label>
              <input name="banerLink" defaultValue={A.banerLink || '/regatowastrefakibica'} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Baner — tekst</label>
            <textarea name="banerTekst" defaultValue={A.banerTekst || ''} rows={2} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Baner — URL obrazu tła (opcjonalnie)</label>
            <input name="banerObraz" defaultValue={A.banerObraz || ''} className={inputCls} />
          </div>

          <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <summary className="cursor-pointer text-sm font-medium text-slate-700">
              Integracja Facebook / Instagram (tokeny)
            </summary>
            <p className="mt-2 text-xs text-slate-500">
              Aby automatycznie pobierać najnowszy post, wklej dane z Meta Graph API. Bez nich pokaże się tylko baner.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input name="fbPageId" defaultValue={A.fbPageId || ''} placeholder="Facebook — ID strony" className={inputCls} />
              <input name="fbToken" defaultValue={A.fbToken || ''} placeholder="Facebook — token" className={inputCls} />
              <input name="igUserId" defaultValue={A.igUserId || ''} placeholder="Instagram — ID konta" className={inputCls} />
              <input name="igToken" defaultValue={A.igToken || ''} placeholder="Instagram — token" className={inputCls} />
            </div>
          </details>
        </Sekcja>

        {/* NASTĘPNE REGATY */}
        <Sekcja tytul="2. Następne regaty" opis="Sekcja bierze dane z kalendarza: ostatnie, trwające i najbliższe regaty.">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="nrPokaz" defaultChecked={NR.pokaz !== false} /> Pokaż sekcję
          </label>
          <div>
            <label className={labelCls}>Nagłówek</label>
            <input name="nrTytul" defaultValue={NR.tytul || 'Regaty'} className={inputCls} />
          </div>
        </Sekcja>

        {/* WPROWADZENIE */}
        <Sekcja tytul="3. Wprowadzenie" opis="Baner „Regaty jak na stadionie” z przyciskami otwierającymi pop-upy.">
          <div>
            <label className={labelCls}>Tytuł banera</label>
            <input name="wTytul" defaultValue={W.tytul || 'REGATY JAK NA STADIONIE'} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Tekst banera (akapity oddzielone pustą linią)</label>
            <textarea name="wTekst" defaultValue={W.tekst || ''} rows={6} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>URL obrazu tła banera (opcjonalnie)</label>
            <input name="wObrazTla" defaultValue={W.obrazTla || ''} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Pop-up „Jak się ścigamy?” — treść</label>
            <RichEditor name="jakSieScigamyHtml" initialHtml={W.jakSieScigamyHtml || ''} />
          </div>

          <div>
            <label className={labelCls}>Pop-up „Jakie są poziomy ligi?” — URL obrazu</label>
            <input name="poziomyObraz" defaultValue={W.poziomyObraz || '/poziomy-lig.png'} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Pop-up „Jak śledzić regaty?” — linki</label>
            <LinkListEditor name="jakSledzic" initial={Array.isArray(W.jakSledzic) ? W.jakSledzic : []} />
          </div>

          <div>
            <label className={labelCls}>Pop-up „Jakie media nas pokazują?” — grupy logotypów</label>
            <GrupyEditor name="media" initial={Array.isArray(W.media) ? W.media : []} />
          </div>

          <div>
            <label className={labelCls}>Pop-up „Jak się zgłosić?” — wstęp</label>
            <textarea name="zgloszeniaIntro" defaultValue={W.zgloszeniaIntro || ''} rows={2} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Pop-up „Jak się zgłosić?” — ligi</label>
            <ZgloszeniaEditor name="zgloszeniaLigi" initial={Array.isArray(W.zgloszeniaLigi) ? W.zgloszeniaLigi : []} />
          </div>
        </Sekcja>

        {/* SPONSORZY */}
        <Sekcja tytul="4. Sponsorzy" opis="Grupy logotypów sponsorów i partnerów.">
          <div>
            <label className={labelCls}>Nagłówek</label>
            <input name="spTytul" defaultValue={SP.tytul || 'Sponsorzy i Partnerzy'} className={inputCls} />
          </div>
          <GrupyEditor name="spGrupy" initial={Array.isArray(SP.grupy) ? SP.grupy : []} />
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
