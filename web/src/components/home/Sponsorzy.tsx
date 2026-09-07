import React from 'react'

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

type Logo = { src: string; href?: string; alt?: string }
type Tier = { tytul: string; hCls: string; rzedy: Logo[][] }

const B = 'https://ligazeglarska.pl/wp-content/uploads'

// Struktura tierów i rozmiary odwzorowane 1:1 z ligazeglarska.pl
const TIERS: Tier[] = [
  {
    tytul: 'Sponsorzy Główni',
    hCls: 'max-h-16 md:max-h-24',
    rzedy: [
      [
        { src: `${B}/2024/04/PGE-SA-logo-kolor-rgb-e1788781667311.jpg`, href: 'https://www.gkpge.pl/', alt: 'PGE' },
        { src: `${B}/2024/04/1-300x180.jpg`, href: 'https://www.nissan.pl/', alt: 'Nissan' },
        { src: `${B}/2024/04/3-300x180.jpg`, href: 'https://www.pekao.com.pl/', alt: 'Bank Pekao' },
      ],
      [
        { src: `${B}/2024/04/MAG-300x180.jpg`, href: 'https://www.mag.pl/pl', alt: 'MAG' },
        { src: `${B}/2024/04/5-1-300x180.jpg`, href: 'https://www.stbu.pl/', alt: 'STBU' },
      ],
    ],
  },
  {
    tytul: 'Oficjalny Partner Odzieżowy',
    hCls: 'max-h-10 md:max-h-14',
    rzedy: [[{ src: `${B}/2024/04/Crazy4Sailing_LONG-300x56.jpg`, href: 'https://www.crazy4sailing.com/', alt: 'Crazy4Sailing' }]],
  },
  {
    tytul: 'Sponsorzy i Partnerzy Regat',
    hCls: 'max-h-16 md:max-h-20',
    rzedy: [
      [
        { src: `${B}/2024/04/6-1-300x180.jpg`, href: 'https://www.drirenaeris.com/', alt: 'Dr Irena Eris' },
        { src: `${B}/2024/04/Logo-na-strone-SPORTOFINO-300x180.jpg`, href: 'https://sportofino.com/', alt: "S'portofino" },
      ],
    ],
  },
  {
    tytul: 'Gospodarze Regat',
    hCls: 'max-h-14 md:max-h-20',
    rzedy: [
      [
        { src: `${B}/2024/04/8-300x180.jpg`, href: 'https://www.sopot.pl/', alt: 'Sopot' },
        { src: `${B}/2024/04/9-300x180.jpg`, href: 'https://miastopuck.pl/', alt: 'Puck' },
        { src: `${B}/2024/04/10-300x180.jpg`, href: 'https://www.gdynia.pl/', alt: 'Gdynia' },
        { src: `${B}/2024/04/11-300x180.jpg`, href: 'https://szczecin.eu/pl', alt: 'Szczecin' },
        { src: `${B}/2024/04/12-300x180.jpg`, href: 'https://pomorzezachodnie.travel/', alt: 'Pomorze Zachodnie' },
      ],
      [
        { src: `${B}/2024/04/Marina-Sopot-300x137.png`, href: 'https://www.facebook.com/molosopockie/?locale=pl_PL', alt: 'Marina Sopot' },
        { src: `${B}/2024/04/Marina-Puck-300x212.jpg`, href: 'https://marinapuck.com/', alt: 'Marina Puck' },
        { src: `${B}/2024/04/gdynia-sport-logo-300x268.png`, href: 'https://gdyniasport.pl/pl', alt: 'Gdynia Sport' },
        { src: `${B}/2024/04/CZ_logo_kolor_pion-276x300.png`, href: 'https://centrumzeglarskie.pl/', alt: 'Centrum Żeglarskie' },
      ],
    ],
  },
  {
    tytul: 'Partnerzy',
    hCls: 'max-h-12 md:max-h-16',
    rzedy: [
      [
        { src: `${B}/2024/04/4-1.jpg`, href: 'https://garmin.com/pl-PL/', alt: 'Garmin' },
        { src: `${B}/2024/04/5-2-e1786534072250.jpg`, href: 'https://auramarine.pl/', alt: 'Auramarine' },
        { src: `${B}/2024/04/DLA-ZEGLARZY_z-dopiskiem-1-768x445.jpg`, href: 'https://www.okularydlazeglarzy.pl/', alt: 'Unique Boutique' },
        { src: `${B}/2024/04/7-1.jpg`, href: 'https://www.sap.com/index.html', alt: 'SAP' },
      ],
      [
        { src: `${B}/2024/04/9-1.jpg`, href: 'https://dr-coffee.pl/', alt: 'Dr.Coffee' },
        { src: `${B}/2024/04/10-1.jpg`, href: 'https://www.mkcafehoreca.pl/', alt: 'MK Cafe' },
        { src: `${B}/2024/04/6-2.jpg`, href: 'https://vulcantc.com/pl/', alt: 'Vulcan' },
        { src: `${B}/2024/04/Nowy-Styl_logo-768x296.png`, href: 'https://www.nowystyl.com/pl/', alt: 'Nowy Styl' },
      ],
    ],
  },
  {
    tytul: 'Partnerzy Techniczni',
    hCls: 'max-h-10 md:max-h-14',
    rzedy: [
      [
        { src: `${B}/2024/03/Bryt-Sails-300x53.png`, href: 'https://brytsails.com/', alt: 'Bryt Sails' },
        { src: `${B}/2024/04/harken-768x231.png`, href: 'https://www.harken.pl/pl/home/', alt: 'Harken' },
        { src: `${B}/2024/04/logo-Marine_page-0001-300x212.jpg`, href: 'https://pro-protection.com/', alt: 'Marine Pro' },
        { src: `${B}/2024/03/RS-Sailing1-300x178.png`, href: 'https://rs21class.pl/', alt: 'RS Sailing' },
      ],
    ],
  },
  {
    tytul: 'Partner Wspierający',
    hCls: 'max-h-20 md:max-h-24',
    rzedy: [[{ src: `${B}/2024/02/PZZ.svg`, href: 'https://pya.org.pl/polski-zwiazek-zeglarski', alt: 'Polski Związek Żeglarski' }]],
  },
  {
    tytul: 'Patronaty Honorowe',
    hCls: 'max-h-14 md:max-h-20',
    rzedy: [
      [{ src: `${B}/2024/04/MSiT-300x127.png`, href: 'https://www.gov.pl/web/sport', alt: 'Ministerstwo Sportu i Turystyki' }],
      [
        { src: `${B}/2024/04/MWP-PATRONAT-Mieczyslaw-Struk-pion-kolor-2021-300x173.png`, href: 'https://pomorskie.eu/', alt: 'Marszałek Woj. Pomorskiego' },
        { src: `${B}/2024/04/og_pion-300x228.jpg`, href: 'https://pomorzezachodnie.travel/', alt: 'Marszałek Woj. Zachodniopomorskiego' },
      ],
      [
        { src: `${B}/2024/04/Sopot-Patronat-poziom-marynarz-CMYK-300x142.jpg`, href: 'https://www.sopot.pl/', alt: 'Prezydentka Sopotu' },
        { src: `${B}/2024/04/Herb-patronat-Honorowy-1-300x120.png`, href: 'https://miastopuck.pl/', alt: 'Burmistrz Puck' },
        { src: `${B}/2024/04/prezydent-miasta-gdyni-Aleksandra-Kosiorek-300x105.png`, href: 'https://www.gdynia.pl/', alt: 'Prezydent Gdyni' },
        { src: `${B}/2024/04/Patronat-Honorowy_kolor_2-300x156.jpg`, href: 'https://szczecin.eu/pl', alt: 'Prezydent Szczecina' },
      ],
    ],
  },
  {
    tytul: 'Patronaty Medialne',
    hCls: 'max-h-12 md:max-h-14',
    rzedy: [
      [
        { src: `${B}/2024/04/25-300x180.jpg`, href: 'https://przegladsportowy.onet.pl/', alt: 'Onet Sportowy' },
        { src: `${B}/2024/04/24-300x180.jpg`, href: 'https://sport.tvp.pl/', alt: 'TVP Sport' },
      ],
      [
        { src: `${B}/2024/04/27-300x180.jpg`, href: 'https://sportklub.pl/', alt: 'Sportklub' },
        { src: `${B}/2024/04/26-e1785237607907-300x87.jpg`, href: 'https://sportowefakty.wp.pl/', alt: 'WP SportoweFakty' },
      ],
      [
        { src: `${B}/2024/03/Prestiż-e1711060099398-300x121.png`, href: 'https://prestiztrojmiasto.pl/', alt: 'Prestiż Trójmiasto' },
        { src: `${B}/2024/03/Prestiż-Magazyn-Szczeciński-scaled-e1711066279382-300x91.jpg`, href: 'https://prestizszczecin.pl/', alt: 'Prestiż Szczecin' },
        { src: `${B}/2024/04/MORZE-logo-300x150.jpg`, href: 'https://www.morze.org/', alt: 'Morze' },
        { src: `${B}/2024/04/logoCharterNavigator-300x155.png`, href: 'https://www.charternavigator.pl/', alt: 'Charter Navigator' },
      ],
      [
        { src: `${B}/2024/04/Gospodarka-morska-1-300x49.png`, href: 'https://www.gospodarkamorska.pl/', alt: 'Gospodarka Morska' },
        { src: `${B}/2024/04/zeglarski-info-logo-jasne-tlo.svg`, href: 'https://zeglarski.info/index.html', alt: 'zeglarski.info' },
      ],
    ],
  },
  {
    tytul: 'Współpraca',
    hCls: 'max-h-16 md:max-h-20',
    rzedy: [
      [
        { src: `${B}/2024/02/sailing-champion-league-221x300.jpg`, href: 'https://sailing-championsleague.com/', alt: 'Sailing Champions League' },
        { src: `${B}/2024/02/ISLA-Logo-Colore-300x77.png`, href: 'https://isla-org.com/', alt: 'ISLA' },
        { src: `${B}/2024/04/Logo-ZOZZ-03.jpg`, href: 'https://www.zozz.org/', alt: 'Zachodniopomorski OZŻ' },
      ],
      [{ src: `${B}/2026/01/SfS_Bronze-2025-Medallion-262x300.png`, href: 'https://sailorsforthesea.org/about-us/', alt: 'Sailors for the Sea' }],
    ],
  },
]

function LogoEl({ lo, hCls }: { lo: Logo; hCls: string }) {
  const img = <Img src={lo.src} alt={lo.alt || ''} className={`${hCls} w-auto object-contain`} />
  return lo.href ? (
    <a href={lo.href} target="_blank" rel="noopener noreferrer" className="block transition hover:opacity-70">
      {img}
    </a>
  ) : (
    <span className="block">{img}</span>
  )
}

export default function Sponsorzy() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-16">
        <h2 className="text-center text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Sponsorzy</h2>
        <div className="mx-auto mt-2 mb-12 h-1 w-16 rounded-full bg-brand-red" />

        <div className="space-y-14">
          {TIERS.map((t) => (
            <div key={t.tytul}>
              <h3 className="text-center text-lg font-bold text-navy">{t.tytul}</h3>
              <div className="mx-auto mt-2 mb-8 h-0.5 w-12 rounded-full bg-brand-red" />
              <div className="space-y-8">
                {t.rzedy.map((rzad, ri) => (
                  <div key={ri} className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16">
                    {rzad.map((lo, li) => (
                      <LogoEl key={li} lo={lo} hCls={t.hCls} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
