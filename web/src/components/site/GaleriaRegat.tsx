import React from 'react'
import { SMUGMUG_URL } from '@/lib/media-kit'

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

// SmugMug nie udostępnia publicznego kanału (RSS/JSON) dla konta Ligi — podgląd
// budujemy więc ze stałego zestawu zdjęć z ostatnich regat, a pełne archiwum
// otwieramy w serwisie SmugMug.
const U = 'https://ligazeglarska.pl/wp-content/uploads'
const ZDJECIA = [
  `${U}/2026/04/EXR3_0029_szymon_sikora_rek_.jpg`,
  `${U}/2026/04/EXR1_173_gwidon_libera-scaled.jpg`,
  `${U}/2026/04/MPKIMG_0241_Bartosz_Modelski.jpg`,
  `${U}/2025/11/YHR3__S_01310_Bartosz_Modelski-2.jpg`,
  `${U}/2025/11/YHR3__S_01920_Bartosz_Modelski.jpg`,
  `${U}/2025/10/PLZ_EXR4__K1A1029_Bartosz_Modelski-1.jpg`,
]

export default function GaleriaRegat() {
  return (
    <section className="mt-16 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-6 md:flex md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Galeria zdjęć</h2>
          <div className="mt-2 h-1 w-14 rounded-full bg-brand-red" />
          <p className="mt-3 max-w-xl text-slate-600">
            Pełne fotorelacje z ostatnich regat — setki zdjęć naszych fotografów w serwisie SmugMug.
          </p>
        </div>
        <div className="mt-5 shrink-0 md:mt-0">
          <a
            href={SMUGMUG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-[10px] border-2 border-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white"
          >
            Zobacz zdjęcia z regat
          </a>
        </div>
      </div>

      <a href={SMUGMUG_URL} target="_blank" rel="noopener noreferrer" className="group block p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ZDJECIA.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-lg">
              <Img src={src} className="h-28 w-full object-cover transition group-hover:scale-105" loading="lazy" />
            </div>
          ))}
        </div>
      </a>
    </section>
  )
}
