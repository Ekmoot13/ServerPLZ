import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import PageHero from '@/components/site/PageHero'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Media — Polska Liga Żeglarska' }

export default async function MediaPage() {
  const payload = await getPayload({ config: configPromise })
  const sg: any = await payload.findGlobal({ slug: 'strona-glowna' as any }).catch(() => null)
  const grupy: any[] = Array.isArray(sg?.wprowadzenie?.media) ? sg.wprowadzenie.media : []

  return (
    <main className="bg-slate-50">
      <PageHero tytul="Media" podtytul="Media to fundament naszej działalności." />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="space-y-4 text-slate-700">
          <p>
            Prowadzimy intensywne działania z mediami ogólnopolskimi oraz na własnych kanałach social media. Jesteśmy obecni
            w każdym medium żeglarskim w Polsce — stale współpracujemy z redakcjami sportowymi czołowych portali, telewizji
            i radiostacji ogólnopolskich. W 2025 roku osiągnęliśmy <strong>7,5 mln zł wartości reklamowej AVE</strong> i{' '}
            <strong>ponad 4000 publikacji</strong>.
          </p>
          <p>
            Samodzielnie produkujemy transmisje na żywo, konferencje prasowe, studia eksperckie i materiały wideo — z użyciem
            dronów, kamer onboard, kamer na wodzie i brzegu oraz systemu śledzenia SAP GPS. Mamy własny zespół produkcyjny
            foto, wideo i prasowy.
          </p>
        </div>
        <a
          href="https://1drv.ms/f/c/66b2b0f68e9f706a/Eh1jJ6-Ni2REuZcY_YBXyAsB6lYVecZbnAtsU7kSlsmnPw"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-[10px] bg-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-navy-800"
        >
          Pobierz nasze raporty mediowe
        </a>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16">
        {grupy.length === 0 ? (
          <p className="text-center text-slate-500">
            Logotypy mediów można dodać w panelu redaktora (Strona główna → pop-up „Media”).
          </p>
        ) : (
          <div className="space-y-12">
            {grupy.map((g: any, i: number) => (
              <div key={i}>
                <h2 className="mb-6 border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-[0.2em] text-navy">
                  {g.kategoria}
                </h2>
                <div className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {(g.loga || []).map((lo: any, k: number) => {
                    const el = lo.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={lo.logoUrl} alt={lo.nazwa || ''} className="max-h-16 w-auto object-contain" />
                    ) : (
                      <span className="text-sm text-slate-400">{lo.nazwa}</span>
                    )
                    return lo.link ? (
                      <a key={k} href={lo.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-lg p-2 transition hover:bg-white">
                        {el}
                      </a>
                    ) : (
                      <span key={k} className="flex items-center justify-center p-2">{el}</span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
