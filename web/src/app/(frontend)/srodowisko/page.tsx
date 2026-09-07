import React from 'react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Środowisko — Polska Liga Żeglarska' }

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

type Blok = {
  kategoria: string
  tytul: string
  tekst: React.ReactNode
  zdjecia: string[]
  link?: { label: string; href: string }
}

const BLOKI: Blok[] = [
  {
    kategoria: 'Dbamy o wody',
    tytul: 'Elektryczne, zdalnie sterowane boje GPS',
    tekst: (
      <>
        Napędzane elektrycznymi silnikami, zdalnie sterowane, automatyczne boje GPS{' '}
        <strong>nie niszczą dna akwenu kotwicami oraz redukują zużycie paliwa motorówki</strong> potrzebnej do obsługi
        tradycyjnych znaków trasy podczas regat. Polska Liga Żeglarska wprowadziła je jako{' '}
        <strong>pierwsza i jedyna w Polsce — tak jak SailGP czy Puchar Ameryki</strong>.
      </>
    ),
    zdjecia: [
      `${U}/2025/11/EXR1_286_gwidon_libera-scaled.jpg`,
      `${U}/2025/11/EXR3_0029_szymon_sikora_rek_.jpg`,
      `${U}/2025/11/YHR3_IMG_5258_Bartosz_Modelski.jpg`,
      `${U}/2025/11/PLZ_FLR_0231_gwidon_libera-scaled.jpg`,
    ],
    link: {
      label: 'Przeczytaj więcej o bojach elektrycznych',
      href: 'https://ligazeglarska.pl/elektryczne-automatyczne-boje-w-polskiej-lidze-zeglarskiej/',
    },
  },
  {
    kategoria: 'Ograniczamy zużycie plastiku',
    tytul: 'Dystrybutory z wodą',
    tekst: (
      <>
        Uczestnicy regat nie używają plastikowych butelek jednorazowego przeznaczenia. Zawodnicy i kibice{' '}
        <strong>korzystają z wielorazowych bidonów</strong> napełnianych wodą z zapewnianego dystrybutora wody dostępnego
        na brzegu. <strong>Zredukowaliśmy roczne zużycie o ponad 7000 butelek PET.</strong>
      </>
    ),
    zdjecia: [
      `${U}/2025/11/2024-06-02-TLZ-278.jpg`,
      `${U}/2025/11/1LR2_222_gwidon_libera_-1-scaled.jpg`,
      `${U}/2025/11/Wow-day-3-131.jpg`,
      `${U}/2025/11/EXR1_258_gwidon_libera-scaled.jpg`,
    ],
  },
  {
    kategoria: 'Zmniejszamy emisje',
    tytul: 'Logistyka',
    tekst: (
      <>
        Zmniejszyliśmy emisję dwutlenku węgla poprzez ulepszenie zarządzania logistyką i transportu jachtów, skracając
        dystans pokonywany między rundami w każdym sezonie <strong>o 15 000 km i ok. 2 250 kg CO2 mniej!</strong> W
        transporcie między poszczególnymi lokalizacjami korzystamy z hybrydowych, nowoczesnych samochodów naszego
        Sponsora Nissan.
      </>
    ),
    zdjecia: [
      `${U}/2025/11/MG_0571_09-10-25.jpg`,
      `${U}/2025/11/DJI_20251003082414_0022_D_09-10-25.jpg`,
      `${U}/2025/11/EXR3_0032_szymon_sikora_rek_.jpg`,
      `${U}/2025/11/XR3_0092_szymon_sikora.jpg`,
    ],
    link: { label: 'Zobacz jak transportujemy jachty', href: 'https://www.youtube.com/watch?v=YBEPBWQNJc4' },
  },
]

export default function SrodowiskoPage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-[1440px] px-4 py-16 text-center md:py-20">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Środowisko</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <p className="mx-auto mt-6 max-w-2xl text-white/85 md:text-lg">
            Zobacz, jak na naszych regatach minimalizujemy wpływ na środowisko naturalne.
          </p>
        </div>
      </section>

      {/* BLOKI */}
      {BLOKI.map((b, i) => {
        const dark = i % 2 === 1
        return (
          <section key={b.kategoria} className={dark ? 'bg-navy text-white' : 'bg-white'} style={dark ? patternBg : undefined}>
            <div className="mx-auto max-w-[1100px] px-4 py-14">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-brand-red">{b.kategoria}</p>
              <h2 className={`mt-1 text-2xl font-extrabold uppercase tracking-wide md:text-3xl ${dark ? 'text-white' : 'text-navy'}`}>
                {b.tytul}
              </h2>
              <div className="mt-3 h-1 w-14 rounded-full bg-brand-red" />
              <p className={`mt-5 max-w-3xl md:text-lg ${dark ? 'text-white/85' : 'text-slate-700'}`}>{b.tekst}</p>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {b.zdjecia.map((src, k) => (
                  <div key={k} className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
                    <Img src={src} className="h-44 w-full object-cover transition hover:scale-105 sm:h-48 md:h-52" />
                  </div>
                ))}
              </div>
              {b.link && (
                <div className="mt-8 text-center">
                  <a
                    href={b.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block rounded-[10px] border-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition ${
                      dark ? 'border-white text-white hover:bg-white hover:text-navy' : 'border-navy text-navy hover:bg-navy hover:text-white'
                    }`}
                  >
                    {b.link.label}
                  </a>
                </div>
              )}
            </div>
          </section>
        )
      })}

      {/* CERTYFIKAT */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-8 px-4 py-16 text-center md:flex-row md:text-left">
          <a href="https://sailorsforthesea.org/about-us/" target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Img src={`${U}/2026/01/SfS_Bronze-2025-Medallion-262x300.png`} alt="Sailors for the Sea" className="h-40 w-auto object-contain" />
          </a>
          <div>
            <h2 className="text-2xl font-extrabold uppercase tracking-wide md:text-3xl">Certyfikat Sailors for the Sea</h2>
            <div className="mt-3 h-1 w-14 rounded-full bg-brand-red md:mx-0" />
            <p className="mt-5 text-white/85 md:text-lg">
              Nasze działania na rzecz środowiska naturalnego zostały zweryfikowane przez amerykańską fundację{' '}
              <a href="https://sailorsforthesea.org/about-us/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline">
                Sailors for the Sea
              </a>{' '}
              powered by Oceana — wiodącą na świecie organizację zajmującą się ochroną mórz, która angażuje, edukuje i
              aktywizuje społeczność żeglarską oraz promuje praktyki minimalizujące wpływ regat żeglarskich na środowisko.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
