// STRONA GŁÓWNA — sekcje: aktualności → następne regaty → wprowadzenie (pop-upy) → sponsorzy.
// Cała treść edytowalna w panelu redaktora (globalny obiekt „Strona główna”).
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import React from 'react'
import Aktualnosci, { AktualnosciItem } from '@/components/home/Aktualnosci'
import Wprowadzenie from '@/components/home/Wprowadzenie'
import { statusRegat } from '@/lib/kalendarz'
import { getLatestFacebookPost, getLatestInstagramMedia } from '@/lib/social'

export const dynamic = 'force-dynamic'

const MIES = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
]
function dataRegat(od?: string | null, doo?: string | null): string {
  if (!od) return ''
  const a = new Date(od)
  const b = doo ? new Date(doo) : null
  if (!b || (a.getMonth() === b.getMonth() && a.getDate() === b.getDate())) return `${a.getDate()} ${MIES[a.getMonth()]}`
  if (a.getMonth() === b.getMonth()) return `${a.getDate()}–${b.getDate()} ${MIES[a.getMonth()]}`
  return `${a.getDate()} ${MIES[a.getMonth()]} – ${b.getDate()} ${MIES[b.getMonth()]}`
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const sg: any = await payload.findGlobal({ slug: 'strona-glowna' as any }).catch(() => null)

  const A = sg?.aktualnosci || {}
  const W = sg?.wprowadzenie || {}
  const SP = sg?.sponsorzy || {}
  const NR = sg?.nastepneRegaty || {}

  // ---- AKTUALNOŚCI: budowa elementów ----
  const items: AktualnosciItem[] = []
  const chce = (typ: string) =>
    A.tryb === 'pojedynczy' ? A.pojedynczyElement === typ : true

  if ((A.pokazBaner ?? true) && chce('baner')) {
    items.push({
      typ: 'baner',
      tytul: A.banerTytul || 'Śledź regaty na żywo',
      tekst: A.banerTekst || '',
      link: A.banerLink || '/regatowastrefakibica',
      obraz: A.banerObraz || '',
    })
  }
  if ((A.pokazFacebook ?? false) && chce('facebook')) {
    const p = await getLatestFacebookPost(A.fbPageId, A.fbToken)
    if (p) items.push({ typ: 'facebook', tekst: p.tekst, obraz: p.obraz, link: p.link })
  }
  if ((A.pokazInstagram ?? false) && chce('instagram')) {
    const p = await getLatestInstagramMedia(A.igUserId, A.igToken)
    if (p) items.push({ typ: 'instagram', tekst: p.tekst, obraz: p.obraz, link: p.link })
  }

  // ---- NASTĘPNE REGATY: z kalendarza ----
  let biezace: any = null
  let nastepne: any = null
  let ostatnie: any = null
  if (NR.pokaz ?? true) {
    const res = await payload.find({ collection: 'kalendarz' as any, limit: 300, depth: 0, sort: 'dataOd' })
    const terminy = (res.docs as any[]).map((t) => ({ ...t, _s: statusRegat(t) }))
    biezace = terminy.find((t) => t._s === 'w-trakcie') || null
    nastepne = terminy.filter((t) => t._s === 'zaplanowane').sort((a, b) => new Date(a.dataOd).getTime() - new Date(b.dataOd).getTime())[0] || null
    ostatnie = terminy.filter((t) => t._s === 'odbyly-sie').sort((a, b) => new Date(b.dataOd).getTime() - new Date(a.dataOd).getTime())[0] || null
  }
  const karty = [
    { etykieta: 'Ostatnie regaty', reg: ostatnie, kolor: 'from-slate-400 to-slate-500' },
    { etykieta: 'Trwają teraz', reg: biezace, kolor: 'from-red-500 to-orange-500' },
    { etykieta: 'Następne regaty', reg: nastepne, kolor: 'from-sky-500 to-indigo-500' },
  ].filter((k) => k.reg)

  // ---- WPROWADZENIE: akapity z pola tekstowego ----
  const akapity: string[] = String(W.tekst || '')
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  const grupySponsorow: any[] = Array.isArray(SP.grupy) ? SP.grupy : []

  return (
    <main className="bg-slate-50">
      {/* SEKCJA 1: AKTUALNOŚCI */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-6">
        {items.length > 0 ? (
          <Aktualnosci items={items} tryb={A.tryb === 'pojedynczy' ? 'pojedynczy' : 'rotacja'} />
        ) : (
          <div className="rounded-2xl bg-slate-900 p-10 text-center text-white">
            <h2 className="text-2xl font-bold">Polska Liga Żeglarska</h2>
            <Link href="/regatowastrefakibica" className="mt-4 inline-block rounded-full bg-red-600 px-6 py-2 font-bold">
              Śledź regaty →
            </Link>
          </div>
        )}
      </section>

      {/* SEKCJA 2: NASTĘPNE REGATY */}
      {karty.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">{NR.tytul || 'Regaty'}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {karty.map((k) => (
              <div key={k.etykieta} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className={`h-1.5 w-full bg-gradient-to-r ${k.kolor}`} />
                <div className="p-5">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{k.etykieta}</div>
                  <div className="text-lg font-extrabold text-slate-900">{k.reg.nazwa}</div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-900">{dataRegat(k.reg.dataOd, k.reg.dataDo)}</div>
                  {k.reg.miejsce && <div className="mt-1 text-sm font-medium text-slate-500">📍 {k.reg.miejsce}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/kalendarz" className="text-sm font-semibold text-sky-600 hover:underline">
              Pełny kalendarz →
            </Link>
          </div>
        </section>
      )}

      {/* SEKCJA 3: WPROWADZENIE */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <Wprowadzenie
          tytul={W.tytul || 'REGATY JAK NA STADIONIE'}
          akapity={akapity}
          obrazTla={W.obrazTla || ''}
          jakSieScigamyHtml={W.jakSieScigamyHtml || ''}
          poziomyObraz={W.poziomyObraz || '/poziomy-lig.png'}
          jakSledzic={Array.isArray(W.jakSledzic) ? W.jakSledzic : []}
          media={Array.isArray(W.media) ? W.media : []}
          zgloszeniaIntro={W.zgloszeniaIntro || ''}
          zgloszeniaLigi={Array.isArray(W.zgloszeniaLigi) ? W.zgloszeniaLigi : []}
        />
      </section>

      {/* SEKCJA 4: SPONSORZY */}
      {grupySponsorow.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">{SP.tytul || 'Sponsorzy i Partnerzy'}</h2>
          <div className="space-y-10">
            {grupySponsorow.map((g: any, i: number) => (
              <div key={i}>
                <h3 className="mb-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                  {g.kategoria}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
                  {(g.loga || []).map((lo: any, k: number) => {
                    const el = lo.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={lo.logoUrl} alt={lo.nazwa || ''} className="max-h-16 w-auto object-contain grayscale transition hover:grayscale-0" />
                    ) : (
                      <span className="text-sm text-slate-400">{lo.nazwa}</span>
                    )
                    return lo.link ? (
                      <a key={k} href={lo.link} target="_blank" rel="noopener noreferrer" className="block">
                        {el}
                      </a>
                    ) : (
                      <span key={k} className="block">
                        {el}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
