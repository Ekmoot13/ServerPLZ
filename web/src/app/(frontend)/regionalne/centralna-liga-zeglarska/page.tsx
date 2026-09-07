import React from 'react'
import RegionLeague, { type RegionCfg } from '@/components/site/RegionLeague'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Centralna Liga Żeglarska — Polska Liga Żeglarska' }

const U = 'https://ligazeglarska.pl/wp-content/uploads'

const CFG: RegionCfg = {
  poziom: /centraln/i,
  akcent: '#6fa300',
  pattern: '/pattern-green.png',
  logo: `${U}/2025/11/CLZ_LOGO_POZIOM_KOLOR-300x118.png`,
  tytul: 'Centralna Liga Żeglarska',
  podtytul: 'Twój pierwszy krok do ligowego żeglarstwa stadionowego na Mazowszu.',
  opis: [
    'Liga Centralna to zupełnie nowa, oficjalna Liga Regionalna Polskiej Ligi Żeglarskiej. 12 zespołów ściga się na <strong>identycznych, zapewnionych przez organizatora, nowoczesnych jachtach RS21</strong> — takich samych jak w żeglarskiej Ekstraklasie!',
    'Wyścigi są krótkie i dynamiczne oraz <strong>sędziowane na żywo przez zespół arbitrów</strong>. Idąc dalej po drabince awansów, możesz trafić do 1 Ligi, a następnie do Ekstraklasy PLŻ, gdzie najlepsze załogi w kraju walczą o Klubowe Mistrzostwo Polski.',
    'Atutem CLŻ jest nowy akwen — <strong>rozlewisko Wisły w Nowym Duninowie</strong>, zaledwie 15 minut jazdy z Płocka, które zapewnia świetne warunki do rywalizacji. Bazą regat jest przystań Klubu Żeglarskiego HALS.',
  ],
  kontakt:
    'Aby wziąć udział w Lidze Centralnej, napisz na adres <a href="mailto:info@centralnaligazeglarska.pl" style="color:#6fa300">info@centralnaligazeglarska.pl</a>.',
  zdjecia: [
    `${U}/2025/10/PLZ_FLR_0168_gwidon_libera-scaled.jpg`,
    `${U}/2025/10/PLZ_FLR_0012_gwidon_libera-scaled.jpg`,
    `${U}/2024/10/final_regionalne_szczecin_11-13-10-2024_gwidon-libera_DSC03267-scaled.jpg`,
  ],
  regulaminPdf: `${U}/2026/08/Regulamin-Centralna-Liga-Zeglarska-2026-1.2-1.pdf`,
  regulaminOpis:
    'Zapoznaj się z aktualnym regulaminem Centralnej Ligi Żeglarskiej, który określa zasady udziału w regatach, punktacji oraz przebiegu rywalizacji.',
  mapaQuery: 'Klub Żeglarski HALS, Nowy Duninów',
  ytId: 'a9UZdxlbBB0',
  wynikiOpis: [
    'Tracking GPS, pozycje jachtów, prędkości i aktualizacje wyników regat i całego sezonu na żywo.',
    '<strong>Śledź regaty Centralnej Ligi Żeglarskiej w czasie rzeczywistym na platformie SAP Sailing</strong> — kliknij przycisk poniżej.',
  ],
  sapUrl: 'https://clz2026.sapsailing.com/gwt/Home.html',
  koordynatorTytul: 'Kontakt do koordynatora Ligi Centralnej',
  koordynator: {
    imie: 'Witek Reszkowski — Centralna Liga Żeglarska',
    telefon: '+48 795 534 795',
    email: 'info@centralnaligazeglarska.pl',
    tekst: 'Masz jakiekolwiek zapytanie związane z żeglarstwem ligowym? Napisz do nas, a my postaramy się udzielić odpowiedzi.',
  },
  social: {
    instagram: 'https://www.instagram.com/centralnaligazeglarska/',
    facebook: 'https://www.facebook.com/centralnaligazeglarska',
  },
  partner: { nazwa: 'Yellow Bird', href: 'https://www.yellowbird.agency/', logo: `${U}/2025/11/yellowBird.jpg` },
}

export default function CentralnaPage() {
  return <RegionLeague cfg={CFG} />
}
