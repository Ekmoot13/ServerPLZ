import React from 'react'
import RegionLeague, { type RegionCfg } from '@/components/site/RegionLeague'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Wielkopolska Liga Żeglarska — Polska Liga Żeglarska' }

const U = 'https://ligazeglarska.pl/wp-content/uploads'

const CFG: RegionCfg = {
  poziom: /wielkopolsk/i,
  akcent: '#de5a0f',
  pattern: '/pattern-orange.png',
  logo: `${U}/2025/11/WLZ_LOGO_POZIOM_KOLOR-300x118.png`,
  tytul: 'Wielkopolska Liga Żeglarska',
  podtytul: 'Twój pierwszy krok do ligowego żeglarstwa stadionowego w Wielkopolsce.',
  opis: [
    'Liga Wielkopolska jest jedną z największych oficjalnych Lig Regionalnych Polskiej Ligi Żeglarskiej. 16 zespołów ściga się na <strong>identycznych, zapewnionych przez organizatora, nowoczesnych jachtach RS21</strong> — takich samych jak w żeglarskiej Ekstraklasie!',
    'Wyścigi są krótkie i dynamiczne oraz <strong>sędziowane na żywo przez zespół arbitrów</strong>. Idąc dalej po drabinie awansów, możesz trafić do 1 Ligi, a następnie do Ekstraklasy PLŻ, gdzie najlepsze załogi w kraju walczą o Klubowe Mistrzostwo Polski.',
    'WLŻ to nie tylko ambitny poziom sportowy, ale także miejsce do rozwijania swoich umiejętności i wspólnego doskonalenia regatowego rzemiosła.',
  ],
  kontakt:
    'Aby wziąć udział w Lidze Wielkopolskiej, napisz na adres <a href="mailto:info@wielkopolskaligazeglarska.pl" style="color:#de5a0f">info@wielkopolskaligazeglarska.pl</a>.',
  zdjecia: [
    `${U}/2025/11/WLZ-runda-1-grupa-A-11.05.2025-62-scaled.jpg`,
    `${U}/2025/11/WLZ-runda-1-grupa-A-11.05.2025-83-scaled.jpg`,
    `${U}/2025/11/WLZ-runda-1-dzien-2-FB-91-scaled.jpg`,
  ],
  regulaminPdf: `${U}/2026/02/Regulamin-WLZ-2026-1.1.pdf`,
  regulaminOpis:
    'Zapoznaj się z aktualnym regulaminem Wielkopolskiej Ligi Żeglarskiej, który określa zasady udziału w regatach, punktacji oraz przebiegu rywalizacji.',
  mapaQuery: 'Jacht Klub Wielkopolski, Wilków Morskich 17/19, Poznań',
  ytId: 'K0pgcMGJVhc',
  wynikiOpis: [
    'Tracking GPS, pozycje jachtów, prędkości i aktualizacje wyników regat i całego sezonu na żywo.',
    '<strong>Śledź regaty Wielkopolskiej Ligi Żeglarskiej w czasie rzeczywistym na platformie SAP Sailing</strong> — kliknij przycisk poniżej.',
  ],
  sapUrl: 'https://wlz2026.sapsailing.com/gwt/Home.html',
  koordynatorTytul: 'Kontakt do koordynatora Ligi Wielkopolskiej',
  koordynator: {
    imie: 'Piotr Małecki — Wielkopolska Liga Żeglarska',
    telefon: '+48 510 791 215',
    email: 'info@wielkopolskaligazeglarska.pl',
    tekst: 'Masz jakiekolwiek zapytanie związane z żeglarstwem ligowym? Napisz do nas, a my postaramy się udzielić odpowiedzi.',
  },
  social: {
    instagram: 'https://www.instagram.com/wielkopolskaligazeglarska/',
    facebook: 'https://www.facebook.com/wielkopolskaligazeglarska',
  },
  partner: { nazwa: 'Yellow Bird', href: 'https://www.yellowbird.agency/', logo: `${U}/2025/11/yellowBird.jpg` },
}

export default function WielkopolskaPage() {
  return <RegionLeague cfg={CFG} />
}
