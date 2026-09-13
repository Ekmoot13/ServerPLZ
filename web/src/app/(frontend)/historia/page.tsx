import React from 'react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Historia — Polska Liga Żeglarska' }

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

const OS: { rok: string; tekst: string }[] = [
  { rok: '2013', tekst: 'Powstanie Szczecińskiej Ligi Regatowej na jachtach TOM28 z MT Partners i Polish Match Tour' },
  { rok: '2014', tekst: 'Powstanie Biznes Ligi Żeglarskiej w Sopocie na jachtach Delphia24 z GSC Yachting' },
  {
    rok: 'Jesień 2014',
    tekst:
      'Pomysł i ogłoszenia startu Polskiej Ekstraklasy Żeglarskiej, współpraca Maciek Cylupa (MT Partners, Polish Match Tour), Rafał Sawicki, Magda Czajkowska i Paweł Górski (GSC Yachting)',
  },
  { rok: 'Maj 2015', tekst: 'Pierwsze regaty Polskiej Ekstraklasy Żeglarskiej (PEZ) w Szczecinie' },
  { rok: '2015', tekst: 'Powstanie Towarzystwa Żeglarstwa Regatowego i współpraca z MT Partners' },
  { rok: '2016', tekst: 'Start współpracy z Polskim Związkiem Żeglarskim, nadanie rangi Klubowych Mistrzostw Polski w Żeglarstwie' },
  { rok: '2016', tekst: 'Start Śląskiej Ligi Regatowej na jachtach Skippi 650 z MT Partners' },
  { rok: '2017', tekst: 'Start trackingu GPS i współpraca z SAP Polska' },
  { rok: '2018', tekst: 'Pierwsze transmisje na żywo z telefonu i GoPro z motorówki RIB — Zuza Czuryło i Maciek Cylupa' },
  { rok: '2018', tekst: 'Całość Ligi przechodzi pod MT Partners' },
  { rok: '2019', tekst: 'Rozpoczęcie rozgrywek 1 Ligi, zmiana nazwy na Polska Liga Żeglarska, nowe logo' },
  { rok: '2020', tekst: '1 Liga osiąga 12 zespołów. Transmisje z wielu kamer, studio na brzegu' },
  { rok: '2021', tekst: 'Nowe jachty RS21 (9 szt) i powiększenie PLŻ z 24 do 36 zespołów' },
  { rok: '2021', tekst: 'Powstanie Warszawskiej Ligi Żeglarskiej na jachtach Skippi 650 z MT Partners' },
  { rok: '2022', tekst: 'Powstanie 2 Ligi — 9 zespołów' },
  { rok: '2022', tekst: 'Organizacja pierwszych regat Women On Water (WOW) w Sopocie' },
  { rok: '2023', tekst: 'Transmisje na żywo w Sportklub TV, 15-minutowe magazyny w Canal+Sport i Sportklub TV' },
  { rok: '2023', tekst: 'Organizacja Sailing Champions League w Sopocie' },
  { rok: '2023', tekst: 'Powstanie Wielkopolskiej Ligi Żeglarskiej na jachtach RS21 z Onboard Sailing' },
  { rok: '2023', tekst: 'WOW otrzymuje rangę Mistrzostw Polski Kobiet i sponsora tytularnego — Dr Irena Eris' },
  {
    rok: '2024',
    tekst: 'Powstanie Śląskiej Ligi Żeglarskiej (Onboard) i Mazurskiej Ligi Regatowej (Nowy Sztynort) – obie na jachtach RS21',
  },
  {
    rok: '2024',
    tekst:
      'Rezygnacja z 2 Ligi na rzecz 5 Lig Regionalnych i organizacji Finału Lig Regionalnych jako kwalifikacji do 1 Ligi — ponad 100 zespołów w całym systemie rozgrywek',
  },
  { rok: '2025', tekst: 'Start Młodzieżowej Polskiej Ligi Żeglarskiej' },
  { rok: '2025', tekst: 'Magazyny z regat Polskiej Ligi Żeglarskiej na ogólnopolskiej antenie TVP Sport' },
  {
    rok: '2026',
    tekst:
      'Nowa flota 10 jachtów RS21 — rozszerzenie Ekstraklasy, 1 Ligi, Ligi Młodzieżowej i Trójmiejskiej Ligi Żeglarskiej do 20 zespołów na każdym poziomie',
  },
]

function Karta({ tekst, prawy }: { tekst: string; prawy: boolean }) {
  // prawy = karta po prawej stronie linii (ogonek po lewej); inaczej ogonek po prawej
  return (
    <div className="relative rounded-xl bg-white p-4 text-navy shadow-lg md:text-[15px]">
      <span
        className={`absolute top-4 hidden h-3 w-3 rotate-45 bg-white md:block md:top-1/2 md:-translate-y-1/2 ${
          prawy ? '-left-1.5' : '-right-1.5'
        }`}
      />
      {tekst}
    </div>
  )
}

export default function HistoriaPage() {
  return (
    <main className="bg-navy text-white" style={patternBg}>
      {/* HERO */}
      <section className="mx-auto max-w-[1440px] px-4 pt-16 text-center md:pt-20">
        <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Historia</h1>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
        <p className="mx-auto mt-6 max-w-2xl text-white/85 md:text-lg">
          Od Szczecińskiej Ligi Regatowej po ogólnopolski system rozgrywek — zobacz, jak przez lata rozwijała się Polska
          Liga Żeglarska.
        </p>
      </section>

      {/* OŚ CZASU */}
      <section className="px-4 py-16">
        <div className="relative mx-auto max-w-5xl">
          {/* linia */}
          <div className="absolute bottom-0 top-0 left-4 w-0.5 bg-white/25 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-8 md:space-y-10">
            {OS.map((e, i) => {
              const even = i % 2 === 0
              return (
                <div key={i} className="relative pl-12 md:grid md:grid-cols-2 md:items-center md:gap-0 md:pl-0">
                  {/* węzeł */}
                  <span className="absolute left-4 top-2 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-navy md:left-1/2 md:top-1/2 md:-translate-y-1/2" />

                  {/* ROK (desktop, przeciwna kolumna) */}
                  <div
                    className={`hidden md:flex md:items-center ${
                      even ? 'md:justify-end md:pr-12' : 'md:order-2 md:justify-start md:pl-12'
                    }`}
                  >
                    <span className="text-3xl font-extrabold text-white">{e.rok}</span>
                  </div>

                  {/* KARTA */}
                  <div className={even ? 'md:pl-12' : 'md:order-1 md:pr-12'}>
                    <span className="mb-1 block text-lg font-extrabold text-white md:hidden">{e.rok}</span>
                    <Karta tekst={e.tekst} prawy={even} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
