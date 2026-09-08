import React from 'react'

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...p} />

type Logo = { src: string; href?: string; alt?: string }
type Tier = { tytul: string; rzedy: Logo[][] }

const B = '/sponsorzy'
const L = (slug: string, href: string, alt: string): Logo => ({ src: `${B}/${slug}.jpg`, href, alt })

// Wszystkie logotypy jednolite (800×600) — ten sam układ tierów co dotychczas.
const TIERS: Tier[] = [
  {
    tytul: 'Sponsorzy Główni',
    rzedy: [
      [
        L('pge', 'https://www.gkpge.pl/', 'PGE'),
        L('nissan', 'https://www.nissan.pl/', 'Nissan'),
        L('bank-pekao', 'https://www.pekao.com.pl/', 'Bank Pekao'),
      ],
      [L('mag', 'https://www.mag.pl/pl', 'MAG'), L('stbu', 'https://www.stbu.pl/', 'STBU')],
    ],
  },
  {
    tytul: 'Oficjalny Partner Odzieżowy',
    rzedy: [[L('c4s', 'https://www.crazy4sailing.com/', 'Crazy4Sailing')]],
  },
  {
    tytul: 'Sponsorzy i Partnerzy Regat',
    rzedy: [[L('dr-irena-eris', 'https://www.drirenaeris.com/', 'Dr Irena Eris'), L('sportofino', 'https://sportofino.com/', "S'portofino")]],
  },
  {
    tytul: 'Gospodarze Regat',
    rzedy: [
      [
        L('sopot', 'https://www.sopot.pl/', 'Sopot'),
        L('gdynia', 'https://www.gdynia.pl/', 'Gdynia'),
        L('szczecin', 'https://szczecin.eu/pl', 'Szczecin'),
        L('pomorze-zachodnie', 'https://pomorzezachodnie.travel/', 'Pomorze Zachodnie'),
      ],
      [
        L('marina-sopot', 'https://www.facebook.com/molosopockie/?locale=pl_PL', 'Marina Sopot'),
        L('marina-puck', 'https://marinapuck.com/', 'Marina Puck'),
        L('gdynia-sport', 'https://gdyniasport.pl/pl', 'Gdynia Sport'),
        L('centrum-zeglarskie', 'https://centrumzeglarskie.pl/', 'Centrum Żeglarskie'),
      ],
    ],
  },
  {
    tytul: 'Partnerzy',
    rzedy: [
      [
        L('garmin', 'https://garmin.com/pl-PL/', 'Garmin'),
        L('auramarine', 'https://auramarine.pl/', 'Auramarine'),
        L('unique-boutique', 'https://www.okularydlazeglarzy.pl/', 'Unique Boutique'),
        L('sap', 'https://www.sap.com/index.html', 'SAP'),
      ],
      [
        L('dr-coffee', 'https://dr-coffee.pl/', 'Dr.Coffee'),
        L('mk-cafe', 'https://www.mkcafehoreca.pl/', 'MK Cafe'),
        L('vulcan', 'https://vulcantc.com/pl/', 'Vulcan'),
        L('nowy-styl', 'https://www.nowystyl.com/pl/', 'Nowy Styl'),
      ],
    ],
  },
  {
    tytul: 'Partnerzy Techniczni',
    rzedy: [
      [
        L('bryt-sails', 'https://brytsails.com/', 'Bryt Sails'),
        L('harken', 'https://www.harken.pl/pl/home/', 'Harken'),
        L('rs-sailing', 'https://rs21class.pl/', 'RS Sailing'),
      ],
    ],
  },
  {
    tytul: 'Partner Wspierający',
    rzedy: [[L('pzz', 'https://pya.org.pl/polski-zwiazek-zeglarski', 'Polski Związek Żeglarski')]],
  },
  {
    tytul: 'Patronaty Honorowe',
    rzedy: [
      [L('msit', 'https://www.gov.pl/web/sport', 'Ministerstwo Sportu i Turystyki')],
      [
        L('woj-pomorskie', 'https://pomorskie.eu/', 'Marszałek Woj. Pomorskiego'),
        L('woj-zachodniopomorskie', 'https://pomorzezachodnie.travel/', 'Marszałek Woj. Zachodniopomorskiego'),
      ],
      [
        L('prezydent-sopot', 'https://www.sopot.pl/', 'Prezydentka Sopotu'),
        L('burmistrz-puck', 'https://miastopuck.pl/', 'Burmistrz Puck'),
        L('prezydent-gdyni', 'https://www.gdynia.pl/', 'Prezydent Gdyni'),
        L('prezydent-szczecina', 'https://szczecin.eu/pl', 'Prezydent Szczecina'),
      ],
    ],
  },
  {
    tytul: 'Patronaty Medialne',
    rzedy: [
      [L('onet-ps', 'https://przegladsportowy.onet.pl/', 'Onet Przegląd Sportowy'), L('tvp-sport', 'https://sport.tvp.pl/', 'TVP Sport')],
      [L('sportklub', 'https://sportklub.pl/', 'Sportklub'), L('wp-sportowefakty', 'https://sportowefakty.wp.pl/', 'WP SportoweFakty')],
      [
        L('prestiz-trojmiasto', 'https://prestiztrojmiasto.pl/', 'Prestiż Trójmiasto'),
        L('prestiz-szczecin', 'https://prestizszczecin.pl/', 'Prestiż Szczecin'),
        L('morze', 'https://www.morze.org/', 'Morze'),
        L('charter-navigator', 'https://www.charternavigator.pl/', 'Charter Navigator'),
      ],
      [L('gospodarka-morska', 'https://www.gospodarkamorska.pl/', 'Gospodarka Morska')],
    ],
  },
  {
    tytul: 'Współpraca',
    rzedy: [
      [
        L('scl', 'https://sailing-championsleague.com/', 'Sailing Champions League'),
        L('isla', 'https://isla-org.com/', 'ISLA'),
        L('zozz', 'https://www.zozz.org/', 'Zachodniopomorski OZŻ'),
      ],
      [L('sfts', 'https://sailorsforthesea.org/about-us/', 'Sailors for the Sea')],
    ],
  },
]

function LogoEl({ lo }: { lo: Logo }) {
  const img = <Img src={lo.src} alt={lo.alt || ''} className="h-16 w-auto object-contain md:h-20" />
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
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:py-16">
        <h2 className="text-center text-2xl font-extrabold uppercase tracking-wide text-navy md:text-3xl">Sponsorzy</h2>
        <div className="mx-auto mt-2 mb-10 h-1 w-16 rounded-full bg-brand-red md:mb-12" />

        <div className="space-y-10 md:space-y-14">
          {TIERS.map((t) => (
            <div key={t.tytul}>
              <h3 className="text-center text-lg font-bold text-navy">{t.tytul}</h3>
              <div className="mx-auto mt-2 mb-8 h-0.5 w-12 rounded-full bg-brand-red" />
              <div className="space-y-6">
                {t.rzedy.map((rzad, ri) => (
                  <div key={ri} className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10">
                    {rzad.map((lo, li) => (
                      <LogoEl key={li} lo={lo} />
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
