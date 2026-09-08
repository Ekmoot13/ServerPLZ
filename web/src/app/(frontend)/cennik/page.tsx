import React from 'react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Cennik — Polska Liga Żeglarska' }

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

function Naglowek({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="mb-6">
      <h2 className={`text-2xl font-extrabold uppercase tracking-wide md:text-3xl ${light ? 'text-white' : 'text-navy'}`}>{children}</h2>
      <div className="mt-3 h-1 w-14 rounded-full bg-brand-red" />
    </div>
  )
}

const ulCls = 'space-y-2.5 md:text-lg'
const liDark = 'flex gap-3 text-white/85'
const liLight = 'flex gap-3 text-slate-700'
const dot = (light: boolean) => (
  <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${light ? 'bg-white/70' : 'bg-brand-red'}`} />
)

export default function CennikPage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-[1440px] px-4 py-16 text-center md:py-20">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Cennik</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
        </div>
      </section>

      {/* WPISOWE DO REGAT */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-[1100px] px-4 py-14">
          <Naglowek light>Wpisowe do regat</Naglowek>
          <ul className={ulCls}>
            {[
              'Ekstraklasa – 20 000 zł / załoga',
              '1 Liga – 20 000 zł / załoga',
              'Liga Młodzieżowa – 16 000 zł / załoga',
              'Liga Trójmiejska – 17 500 zł / załoga',
            ].map((t) => (
              <li key={t} className={liDark}>
                {dot(true)}
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CZARTER */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1100px] px-4 py-14">
          <Naglowek>Czarter</Naglowek>
          <ul className={ulCls}>
            {[
              'Jacht RS21 – 1 250 zł netto / 8 godzin, 800 zł netto / 4 godziny, 3 000 zł netto / 3 dni (weekend)',
              'RIB Ava 540 – 450 zł netto / 8 godzin',
              'RIB Ava 580 – 500 zł netto / 8 godzin',
              'RIB Fastmode 100 – 550 zł netto / 8 godzin',
              'Jacht motorowy LANA, statek KS – 1 000 zł netto / 8 godzin',
            ].map((t) => (
              <li key={t} className={liLight}>
                {dot(false)}
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SZKOLENIA */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-[1100px] px-4 py-14">
          <Naglowek light>Szkolenia</Naglowek>
          <p className="text-white/85 md:text-lg">
            Akademia Regatowa na Wodzie – 3 500 zł netto / załoga, więcej szczegółów na{' '}
            <a href="https://ligazeglarska.pl/clinics/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline hover:text-brand-red">
              ligazeglarska.pl/clinics
            </a>
            .
          </p>
        </div>
      </section>

      {/* WYNAJEM SPRZĘTU */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1100px] px-4 py-14">
          <Naglowek>Wynajem sprzętu</Naglowek>
          <ul className={ulCls}>
            {[
              'Scena z podestami',
              'Namiot sferyczny 8×8 m',
              'Namiot sferyczny 6×6 m',
              'Zestaw flag zespołowych lub sponsorskich',
              'Radia VHF 20 szt',
              'System trackingowy SAP Sailing',
            ].map((t) => (
              <li key={t} className={liLight}>
                {dot(false)}
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-slate-700 md:text-lg">
            Wycena indywidualna. Zapraszamy do kontaktu mailowego na{' '}
            <a href="mailto:info@ligazeglarska.pl" className="font-semibold text-brand-red hover:underline">
              info@ligazeglarska.pl
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
