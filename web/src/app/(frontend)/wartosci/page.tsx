import React from 'react'
import WartosciKafelki from '@/components/site/WartosciKafelki'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Wartości — Polska Liga Żeglarska' }

const U = 'https://ligazeglarska.pl/wp-content/uploads'
// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

const GALERIA = [
  `${U}/2025/11/EXR1_259_gwidon_libera-scaled.jpg`,
  `${U}/2025/11/1LR1_0000_0088_day_2_POZIOM_.jpg`,
  `${U}/2025/11/XR3_0037_szymon_sikora.jpg`,
  `${U}/2025/11/YHR1_IMG_2314_Bartosz_Modelski.jpg`,
  `${U}/2025/11/YHR1_IMG_1845_Bartosz_Modelski.jpg`,
  `${U}/2025/11/YHR3__S_01297_Bartosz_Modelski.jpg`,
]

export default function WartosciPage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-[1440px] px-4 py-16 text-center md:py-20">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Wartości</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <p className="mx-auto mt-6 max-w-2xl text-white/85 md:text-lg">
            To, co nas napędza — od czystej energii wiatru i wody po równość szans, rozwój społeczności i sportowy
            profesjonalizm. Najedź lub dotknij kafelek, aby poznać każdą z wartości.
          </p>
        </div>
      </section>

      {/* KAFELKI */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-[1200px] px-4 py-16">
          <WartosciKafelki />
          <p className="mx-auto mt-12 max-w-3xl text-center text-lg font-medium text-navy">
            Cenimy otwartość i współpracę, zapraszając do udziału każdego, kto podziela nasze wartości i chce się
            przyczynić do realizacji naszej misji.
          </p>
        </div>
      </section>

      {/* GALERIA */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 pb-16">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {GALERIA.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-lg">
                <Img src={src} className="h-28 w-full object-cover transition hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
