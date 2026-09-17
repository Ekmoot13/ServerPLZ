// Zespół PLŻ — odwzorowanie strony ligazeglarska.pl/plz-team.
// Skład wpisany na sztywno (zdjęcia hotlinkowane z ligazeglarska.pl), tak jak
// logotypy klubów w lib/klubMedia — docelowo do przeniesienia do panelu.
import React from 'react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Zespół — Polska Liga Żeglarska' }

const U = '/kluby'
// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

const patternBg: React.CSSProperties = {
  backgroundImage: 'url(/pkr-pattern-soft.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
}

type Osoba = { nazwa: string; rola: string; foto: string }

const ZESPOL: Osoba[] = [
  { nazwa: "Maciek “Mac” Cylupa", rola: "Założyciel i CEO, Sędzia Główny, Arbiter IU, NJ, komentator", foto: `${U}/2024/03/1LR1_0002_szymon_sikora.jpg` },
  { nazwa: "Stanisław Konarzewski", rola: "Marketing i Komunikacja", foto: `${U}/2024/03/504984800_2213812352422310_265143873296316110_n-1.jpg` },
  { nazwa: "Dominika Ołowiak", rola: "Sędzia", foto: `${U}/2024/03/Dominika-Olowiak-2-e1763463492711.jpg` },
  { nazwa: "Iga Kuśnieruk", rola: "Strefa brzegowa i zmiany załóg", foto: `${U}/2024/03/Iga-Kusnieruk-e1763463734942.jpg` },
  { nazwa: "Julia Schmidt", rola: "Sędzia, Arbiter", foto: `${U}/2025/11/Jul9ia-Schmidt-e1763463354518.jpg` },
  { nazwa: "Gosia Górnisiewicz", rola: "Social Media", foto: `${U}/2025/03/Zdjecie-WhatsApp-2025-03-03-o-13.29.11_99b6f5a1.jpg` },
  { nazwa: "Adam Burdyło", rola: "Produkcja magazynu TV", foto: `${U}/2024/03/Adam-Burdylo-scaled.jpg` },
  { nazwa: "Filip Woźniak", rola: "Sędzia, tracking i scoring", foto: `${U}/2024/03/1-liga_3-runda_gdynia_05-07-07-2024_gwidon-libera_DSC00901-scaled-e1765814856328.jpg` },
  { nazwa: "Olaf Gałaj", rola: "Streaming i elektronika", foto: `${U}/2024/03/Olaf-Galaj-scaled.jpg` },
  { nazwa: "Anna “Andzia” Gałaj", rola: "Koordynatorka strefy brzegowej", foto: `${U}/2024/03/Anna-Galaj-scaled-e1765815295440.jpg` },
  { nazwa: "Damian Pietruszewski", rola: "Specjalista techniczny", foto: `${U}/2024/03/Damian-Pietruszewski-scaled.jpg` },
  { nazwa: "Gwidon Libera", rola: "Foto", foto: `${U}/2024/03/Gwidon-Libera-scaled.jpg` },
  { nazwa: "Kacper Libera", rola: "Wideo, Dron", foto: `${U}/2024/03/Kacper-Libera-1-scaled.jpg` },
  { nazwa: "Aleks Prusiński", rola: "Arbiter Główny Ligi, IJ, NU", foto: `${U}/2024/03/20240921_071735780_iOS-e1765820244756.jpg` },
  { nazwa: "Bogusław Moczorodyński", rola: "Arbiter, IJ, NU", foto: `${U}/2024/03/Bogus-Moczordynski-scaled-e1765820469272.jpg` },
  { nazwa: "Filip Moczorodyński", rola: "Arbiter, IJ, IU", foto: `${U}/2024/03/Filip-Moczordynski-scaled-e1765820558873.jpg` },
  { nazwa: "Maciek Fonferko", rola: "Arbiter, NJ, NU", foto: `${U}/2024/03/472880192_560563316975149_2264035233944488174_n-e1765820757932.jpg` },
  { nazwa: "Wiktor Plitko", rola: "Arbiter, NJ, NU", foto: `${U}/2024/03/Wiktor-Plitko-e1765820885658.jpg` },
  { nazwa: "Krzysztof “Kokos” Łobodziec", rola: "Komentator", foto: `${U}/2024/03/Krzysztof-Kokos-Lobodziec2-scaled-e1765820965296.jpg` },
  { nazwa: "Laura Słocka", rola: "Sędzia, w trakcie stażu na arbitra", foto: `${U}/2024/07/Laura-Slocka-scaled-e1765821090809.jpg` },
  { nazwa: "Rafał Sawicki", rola: "Komentator i ekspert", foto: `${U}/2024/03/YKP-Gdynia-Rafal-Sawicki.jpg` },
  { nazwa: "Kacper Czarkowski", rola: "Specjalista techniczny i logistyczny", foto: `${U}/2024/03/Kacper-Czarkowski-e1765815367919.jpg` },
  { nazwa: "Robert “Hajdi” Hajduk", rola: "Foto", foto: `${U}/2024/03/453897933_10233302982426591_3732787355403194956_n-e1765819894133.jpg` },
  { nazwa: "Krzysiek “Rudy” Sosnowski", rola: "Wideo", foto: `${U}/2024/03/1-liga_3-runda_gdynia_05-07-07-2024_gwidon-libera_DSC00008-scaled.jpg` },
  { nazwa: "Danek Goralski", rola: "Sędzia Główny, IRO", foto: `${U}/2024/03/Danek-Goralski--scaled-e1765820032462.jpg` },
  { nazwa: "Max Pawłowski", rola: "Sędzia Główny, IRO", foto: `${U}/2024/03/Maks-Pawlowski-scaled-e1765820084623.jpg` },
  { nazwa: "Zosia Truchanowicz", rola: "Arbiter Główny, IJ, IU, konsultant ds. przepisów", foto: `${U}/2024/03/Zosia-Truchanowicz-e1765820311278.jpg` },
  { nazwa: "Michał Jodłowski", rola: "Arbiter, IJ, IU", foto: `${U}/2024/03/Michal-Jodlowski-scaled-e1765820374186.jpg` },
  { nazwa: "Pacyfik “Pacek” Koseski", rola: "Specjalista Techniczny", foto: `${U}/2024/03/Internet_2024_04_13_RS21_Cup_Act1_D1_134_RH-e1765814990290.jpg` },
  { nazwa: "Alan Stachurski", rola: "Specjalista Techniczny", foto: `${U}/2025/11/1L3R_IMG_5702_Bartosz_Modelski-e1764851153302.jpg` },
  { nazwa: "Wojtek Kosmala", rola: "Wideo", foto: `${U}/2025/11/Wojtek-Kosmala.jpg` },
  { nazwa: "Bartek “Model” Modelski", rola: "Foto", foto: `${U}/2025/11/Bartosz-Modelski-e1765821189429.jpg` },
  { nazwa: "Marek Gałaj", rola: "Dobra dusza", foto: `${U}/2024/03/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg` },
  { nazwa: "Ewa Piksa", rola: "Administracja", foto: `${U}/2024/03/default-avatar-photo-placeholder-profile-picture-vector-21806614.jpg` },
]

export default function PlzTeamPage() {
  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Zespół</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <p className="mt-6 text-white/85 md:text-lg">
            Zobacz, kto stoi za organizacją Polskiej Ligi Żeglarskiej.
          </p>
        </div>
      </section>

      {/* LUDZIE */}
      <section className="mx-auto max-w-[1440px] px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ZESPOL.map((o) => (
            <div
              key={o.nazwa}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-square w-full overflow-hidden bg-slate-100">
                <Img
                  src={o.foto}
                  alt={o.nazwa}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <h2 className="text-base font-extrabold leading-tight text-navy">{o.nazwa}</h2>
                <p className="mt-1 text-sm text-slate-500">{o.rola}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
