import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Polski Klub Regatowy — Polska Liga Żeglarska' }

// Grafiki z ligazeglarska.pl (hotlink — do podmiany na własne uploady w razie potrzeby).
const IMG = {
  burgee: 'https://ligazeglarska.pl/wp-content/uploads/2026/03/PKR-logo-kontra.png',
  bg: 'https://ligazeglarska.pl/wp-content/uploads/2026/03/BG-PKR-1.jpg',
  dolacz: 'https://ligazeglarska.pl/wp-content/uploads/2026/03/PLZ2026-Baner-newsletterWWW-1024x683.jpg',
  lodki: 'https://ligazeglarska.pl/wp-content/uploads/2026/03/EXR1_208_gwidon_libera-1024x683.jpg',
}

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

function Heading({ children, tone = 'dark', center = false }: { children: React.ReactNode; tone?: 'dark' | 'light'; center?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <h2 className={`text-3xl font-extrabold uppercase tracking-wide md:text-4xl ${tone === 'light' ? 'text-white' : 'text-navy'}`}>
        {children}
      </h2>
      <div className={`mt-3 h-1 w-16 rounded-full bg-brand-red ${center ? 'mx-auto' : ''}`} />
    </div>
  )
}

const btnLight =
  'inline-block rounded-[10px] border-2 border-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-navy'
const btnDark =
  'inline-block rounded-[10px] border-2 border-navy px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-navy transition hover:bg-navy hover:text-white'
const frame = 'overflow-hidden rounded-2xl border border-white/25 shadow-xl'

export default function PolskiKlubRegatowyPage() {
  // Wzór koncentrycznych okręgów jako tło sekcji, „przyklejony” do ekranu (fixed) —
  // przy przewijaniu wzór stoi w miejscu, jak w oryginale. Przezroczystość wypalona w pliku.
  const patternBg: React.CSSProperties = {
    backgroundImage: 'url(/pkr-pattern-soft.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
  }

  return (
    <main>
      {/* HERO */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-[1440px] px-4 pt-6 pb-14 text-center md:pt-8 md:pb-16">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide md:text-5xl">Polski Klub Regatowy</h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
          <Img src={IMG.burgee} className="mx-auto mt-10 h-40 w-auto md:h-52" />
          <p className="mt-4 font-serif text-xl tracking-wide text-white/90">POLSKI KLUB REGATOWY</p>
        </div>
      </section>

      {/* KLUB DLA WSZYSTKICH */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 pb-16 lg:grid-cols-2">
          <div>
            <Heading tone="light">Klub dla wszystkich</Heading>
            <div className="mt-5 space-y-4 text-white/85">
              <p><strong>Witamy w Polskim Klubie Regatowym — Stowarzyszeniu Żeglarzy Ligowych i Meczowych!</strong></p>
              <p>
                Po 12 sezonach Polskiej Ligi Żeglarskiej i prawie 20 latach match racingu w Polsce, wokół cykli regat Ligi
                i Polish Match Tour zgromadziło się już wielu zawodników, klubów, partnerów, kibiców i przyjaciół. Dla wielu
                jest to miejsce do realizacji sportowej pasji. Nadszedł więc czas na powstanie nowego środowiska — klubu
                stowarzyszającego wszystkich ludzi wokół Ligi Żeglarskiej i Polish Match.
              </p>
              <p>
                Polski Klub Regatowy reprezentuje, organizuje oraz w miarę możliwości pomaga i wspiera tych, którzy tego
                potrzebują. <strong>PKR jest organizacją non-profit w formie stowarzyszenia jako członek zwyczajny Polskiego
                Związku Żeglarskiego z pełnym wsparciem Polskiej Ligi Żeglarskiej i cyklu Polish Match Tour.</strong>
              </p>
              <p>
                Zapraszamy do niego wszystkich chętnych — to klub tworzony przez zawodników dla zawodników, blisko wody
                i regat, dla ludzi z pasją i radością z żeglowania.
              </p>
            </div>
            <a href="mailto:biuro@polskiklubregatowy.pl" className={`mt-6 ${btnLight}`}>Przeczytaj statut</a>
          </div>
          <div className={frame}>
            <Img src={IMG.dolacz} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* KORZYŚCI DLA CZŁONKÓW */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 pt-16 pb-8">
          <Heading>Korzyści dla członków</Heading>
          <div className="mt-5 max-w-4xl space-y-4 text-slate-700">
            <div>
              <p className="font-bold text-navy">Szkolenia i warsztaty</p>
              <p>
                Planujemy <strong>bezpłatne szkolenia</strong> z tworzenia ofert sponsoringowych dla projektów żeglarskich,
                prowadzenia mediów społecznościowych klubu żeglarskiego oraz warsztaty ze stosowania przepisów regatowych.
              </p>
            </div>
            <div>
              <p className="font-bold text-navy">Zniżki na czartery PLŻ — wybrany czarter 2 razy w roku na członka klubu</p>
              <p className="mt-1 font-semibold text-slate-800">Jacht RS21:</p>
              <ul className="list-disc pl-5">
                <li>1 250 zł netto / 8 godzin, <strong>po rabacie 1000 zł netto</strong></li>
                <li>800 zł netto / 4 godziny, <strong>po rabacie 640 zł netto</strong></li>
              </ul>
              <p className="mt-2 font-semibold text-slate-800">Motorówki RIB:</p>
              <ul className="list-disc pl-5">
                <li>RIB Ava 540 — 450 zł netto / 8 godzin, <strong>po rabacie 360 zł netto</strong></li>
                <li>RIB Ava 580 — 500 zł netto / 8 godzin, <strong>po rabacie 400 zł netto</strong></li>
                <li>RIB Fastmode 100 — 550 zł netto / 8 godzin, <strong>po rabacie 440 zł netto</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CZŁONKOSTWO */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 pt-8 pb-16">
          <Heading>Członkostwo</Heading>
          <ol className="mt-5 max-w-4xl list-decimal space-y-3 pl-5 text-slate-700">
            <li>Wypełnij i podpisz (np. elektronicznie, pola są edytowalne) <strong>deklarację członkowską</strong> — do pobrania poniżej.</li>
            <li>
              <strong>Opłać składkę członkowską — 240 zł/rok.</strong> Dane do przelewu:
              <ul className="mt-1 list-disc pl-5 text-sm">
                <li>Polski Klub Regatowy — Stowarzyszenie Żeglarzy Ligowych i Meczowych</li>
                <li>Adres: ul. Przestrzenna 11, 70-800 Szczecin</li>
                <li>Bank i numer konta: Santander <span className="whitespace-nowrap">94 1090 1492 0000 0001 6488 5095</span></li>
                <li>Tytuł przelewu: Imię Nazwisko składka członkowska</li>
              </ul>
            </li>
            <li>
              <strong>Wyślij podpisaną deklarację i potwierdzenie przelewu</strong> na adres{' '}
              <a href="mailto:biuro@polskiklubregatowy.pl" className="font-semibold text-brand-red hover:underline">biuro@polskiklubregatowy.pl</a>.
            </li>
          </ol>
          <div className="max-w-4xl">
            <p className="mt-4 text-sm text-slate-500">Członkostwo w PKR nie jest wymagane do startu w jakichkolwiek regatach PLŻ lub PMT.</p>
            <p className="mt-1 text-sm text-slate-500">Masz pytania? Napisz do nas.</p>
            <div className="mt-8">
              <a href="mailto:biuro@polskiklubregatowy.pl" className={btnDark}>Pobierz deklarację</a>
            </div>
          </div>
        </div>
      </section>

      {/* ZAWODNICY PKR */}
      <section className="bg-navy text-white" style={patternBg}>
        <div className="mx-auto max-w-[1440px] px-4 py-16">
          <Heading tone="light" center>Zawodnicy PKR</Heading>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-extrabold uppercase tracking-wide">Dominik Buksak</h3>
              <p className="mt-1 text-sm font-bold uppercase tracking-wide text-brand-red">Klasa olimpijska 49er</p>
              <div className="mt-5 space-y-4 text-white/85">
                <p>
                  Dominik Buksak — wychowany na wodzie, żegluje od siódmego roku życia i od zawsze <strong>łączy pasję
                  z bezkompromisową ambicją</strong> sportową. W klasie 49er wspiął się na światowy poziom, spełniając marzenie
                  o starcie w igrzyskach olimpijskich. Podczas <strong>IO Paryż 2024 zajął 5. miejsce — najlepsze w historii
                  polskich startów</strong> w tej klasie.
                </p>
                <p>
                  Równocześnie będąc reprezentantem PKR w kampanii olimpijskiej oraz Ambasadorem PLŻ, wnosi doświadczenie
                  najwyższej próby i inspiruje kolejne pokolenia żeglarzy, <strong>startując równolegle na 49erze</strong> i w
                  rozgrywkach ligowej Ekstraklasy z Yacht Clubem Gdańsk.
                </p>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm">
                <li><strong>ZWYCIĘZCA EKSTRAKLASY — KLUBOWY MISTRZ POLSKI</strong> 2025</li>
                <li><strong>MISTRZOSTWO POLSKI 49er — ŁĄCZNIE 5 RAZY,</strong> 2019-2022 i 2025</li>
                <li><strong>5. MIEJSCE IGRZYSKA OLIMPIJSKIE PARYŻ</strong> 2024</li>
                <li><strong>2× WICEMISTRZOSTWO EUROPY 49er</strong> 2018 i 2023</li>
              </ul>
              <Link href="/regatowastrefakibica" className={`mt-6 ${btnLight}`}>Śledź regaty Dominika</Link>
            </div>
            <div className={frame}>
              <Img src={IMG.bg} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
