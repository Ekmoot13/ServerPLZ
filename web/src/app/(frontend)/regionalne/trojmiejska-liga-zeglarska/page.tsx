import React from 'react'
import RegionLeague, { type RegionCfg } from '@/components/site/RegionLeague'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Trójmiejska Liga Żeglarska — Polska Liga Żeglarska' }

const U = 'https://ligazeglarska.pl/wp-content/uploads'

const CFG: RegionCfg = {
  poziom: /tr[oó]jmiejsk/i,
  akcent: '#0aa2c0',
  pattern: '/pattern-teal.png',
  logo: `${U}/2025/11/TLZ_LOGO_POZIOM_KOLOR-1-300x118.png`,
  tytul: 'Trójmiejska Liga Żeglarska',
  podtytul: 'Twój pierwszy krok do ligowego żeglarstwa stadionowego na Pomorzu.',
  opis: [
    'Liga Trójmiejska jest największą z czterech oficjalnych Lig Regionalnych Polskiej Ligi Żeglarskiej. 20 zespołów ściga się na <strong>identycznych, zapewnionych przez organizatora, nowoczesnych jachtach RS21</strong> — tych samych co w żeglarskiej Ekstraklasie!',
    'Wyścigi są krótkie i dynamiczne oraz <strong>sędziowane na żywo przez zespół arbitrów</strong>. Idąc dalej po drabince awansów, możesz trafić do 1 Ligi, a następnie do Ekstraklasy PLŻ, gdzie najlepsze załogi w kraju walczą o Klubowe Mistrzostwo Polski.',
    'TLŻ to nie tylko ambitny poziom sportowy, ale także miejsce do rozwijania swoich umiejętności i wspólnego doskonalenia regatowego rzemiosła.',
  ],
  kontakt:
    'Aby wziąć udział w Lidze Trójmiejskiej, napisz na adres <a href="mailto:info@ligazeglarska.pl" style="color:#0aa2c0">info@ligazeglarska.pl</a>.',
  zdjecia: [
    `${U}/2025/11/TLZR1_IMG_3228_Bartosz_Modelski.jpg`,
    `${U}/2025/11/TLZR2___S_04627_Bartosz_Modelski.jpg`,
    `${U}/2025/11/TLZ_R4_D2_LR_169_AdamBurdyo.jpg`,
  ],
  regulaminPdf: `${U}/2026/08/Regulamin-Trojmiejska-Liga-Zeglarska-2026-1.2-1.pdf`,
  regulaminOpis:
    'Zapoznaj się z aktualnym regulaminem Trójmiejskiej Ligi Żeglarskiej, który określa zasady udziału w regatach, punktacji oraz przebiegu rywalizacji.',
  mapaQuery: 'Sopot, Molo, Trójmiasto',
  ytId: 'a9UZdxlbBB0',
  wynikiOpis: [
    'Tracking GPS, pozycje jachtów, prędkości i aktualizacje wyników regat i całego sezonu na żywo.',
    '<strong>Śledź regaty Trójmiejskiej Ligi Żeglarskiej w czasie rzeczywistym na platformie SAP Sailing</strong> — kliknij przycisk poniżej.',
  ],
  sapUrl: 'https://tlz2026.sapsailing.com/gwt/Home.html',
  koordynatorTytul: 'Kontakt do koordynatora Ligi Trójmiejskiej',
  koordynator: {
    imie: 'Polska Liga Żeglarska',
    telefon: '',
    email: 'info@ligazeglarska.pl',
    tekst: 'Masz jakiekolwiek zapytanie związane z żeglarstwem ligowym? Napisz do nas, a my postaramy się udzielić odpowiedzi.',
  },
  social: {
    instagram: 'https://www.instagram.com/trojmiejskaligazeglarska/',
    facebook: 'https://www.facebook.com/trojmiejskaligazeglarska',
  },
  sponsorGlowny: { nazwa: 'Nissan', href: 'https://www.nissan.pl/', logo: `${U}/2024/04/4.jpg` },
  partner: { nazwa: 'Yellow Bird', href: 'https://www.yellowbird.agency/', logo: `${U}/2025/11/yellowBird.jpg` },
}

export default function TrojmiejskaPage() {
  return <RegionLeague cfg={CFG} />
}
