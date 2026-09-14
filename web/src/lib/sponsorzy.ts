// Domyślne dane sekcji sponsorów (lokalne, jednolite logotypy 800×600).
// Używane jako fallback na stronie głównej oraz przez seed globala strona-glowna.
//
// Kolejność grup i logotypów odwzorowuje stronę główną ligazeglarska.pl.
// Grupa „Sponsor tytularny” świadomie nie istnieje — jest wycofana.
export type SponsorLogo = { logoUrl: string; link?: string; nazwa?: string; skala?: number }
export type SponsorGrupa = { kategoria: string; loga: SponsorLogo[] }

const B = '/sponsorzy'
const L = (slug: string, link: string, nazwa: string, skala = 100): SponsorLogo => ({
  logoUrl: `${B}/${slug}.jpg`,
  link,
  nazwa,
  skala,
})

// Sponsorzy Główni są największym kafelkiem — żadna inna grupa nie może go przebić.
const GLOWNI = 125

export const DEFAULT_GRUPY: SponsorGrupa[] = [
  {
    kategoria: 'Sponsorzy Główni',
    loga: [
      L('pge', 'https://www.gkpge.pl/', 'PGE', GLOWNI),
      L('nissan', 'https://www.nissan.pl/', 'Nissan', GLOWNI),
      L('bank-pekao', 'https://www.pekao.com.pl/', 'Bank Pekao', GLOWNI),
      L('mag', 'https://www.mag.pl/pl', 'MAG', GLOWNI),
      L('stbu', 'https://www.stbu.pl/', 'STBU', GLOWNI),
    ],
  },
  {
    kategoria: 'Oficjalny Partner Odzieżowy',
    loga: [L('c4s', 'https://www.crazy4sailing.com/', 'Crazy4Sailing')],
  },
  {
    kategoria: 'Sponsorzy i Partnerzy Regat',
    loga: [
      L('dr-irena-eris', 'https://www.drirenaeris.com/', 'Dr Irena Eris'),
      L('sportofino', 'https://sportofino.com/', "S'portofino"),
    ],
  },
  {
    kategoria: 'Gospodarze Regat',
    loga: [
      L('sopot', 'https://www.sopot.pl/', 'Sopot'),
      L('puck', 'https://miastopuck.pl/', 'Puck'),
      L('gdynia', 'https://www.gdynia.pl/', 'Gdynia'),
      L('szczecin', 'https://szczecin.eu/pl', 'Szczecin'),
      L('pomorze-zachodnie', 'https://pomorzezachodnie.travel/', 'Pomorze Zachodnie'),
      L('marina-sopot', 'https://www.facebook.com/molosopockie/?locale=pl_PL', 'Marina Sopot'),
      L('marina-puck', 'https://marinapuck.com/', 'Marina Puck'),
      L('gdynia-sport', 'https://gdyniasport.pl/pl', 'Gdynia Sport'),
      L('centrum-zeglarskie', 'https://centrumzeglarskie.pl/', 'Centrum Żeglarskie'),
    ],
  },
  {
    kategoria: 'Partnerzy',
    loga: [
      L('garmin', 'https://garmin.com/pl-PL/', 'Garmin'),
      L('auramarine', 'https://auramarine.pl/', 'Auramarine'),
      L('unique-boutique', 'https://www.okularydlazeglarzy.pl/', 'Unique Boutique'),
      L('sap', 'https://www.sap.com/index.html', 'SAP'),
      L('dr-coffee', 'https://dr-coffee.pl/', 'Dr.Coffee'),
      L('mk-cafe', 'https://www.mkcafehoreca.pl/', 'MK Cafe'),
      L('vulcan', 'https://vulcantc.com/pl/', 'Vulcan'),
      L('nowy-styl', 'https://www.nowystyl.com/pl/', 'Nowy Styl'),
    ],
  },
  {
    kategoria: 'Partnerzy Techniczni',
    loga: [
      L('bryt-sails', 'https://brytsails.com/', 'Bryt Sails'),
      L('harken', 'https://www.harken.pl/pl/home/', 'Harken'),
      L('pro-protection', 'https://pro-protection.com/', 'Pro Protection'),
      L('rs-sailing', 'https://rs21class.pl/', 'RS Sailing'),
    ],
  },
  {
    kategoria: 'Partner Wspierający',
    loga: [L('pzz', 'https://pya.org.pl/polski-zwiazek-zeglarski', 'Polski Związek Żeglarski')],
  },
  {
    kategoria: 'Patronaty Honorowe',
    loga: [
      L('msit', 'https://www.gov.pl/web/sport', 'Ministerstwo Sportu i Turystyki'),
      L('woj-pomorskie', 'https://pomorskie.eu/', 'Marszałek Woj. Pomorskiego'),
      L('woj-zachodniopomorskie', 'https://pomorzezachodnie.travel/', 'Marszałek Woj. Zachodniopomorskiego'),
      L('prezydent-sopot', 'https://www.sopot.pl/', 'Prezydentka Sopotu'),
      L('burmistrz-puck', 'https://miastopuck.pl/', 'Burmistrz Puck'),
      L('prezydent-gdyni', 'https://www.gdynia.pl/', 'Prezydent Gdyni'),
      L('prezydent-szczecina', 'https://szczecin.eu/pl', 'Prezydent Szczecina'),
    ],
  },
  {
    kategoria: 'Patronaty Medialne',
    loga: [
      L('onet-ps', 'https://przegladsportowy.onet.pl/', 'Onet Przegląd Sportowy'),
      L('tvp-sport', 'https://sport.tvp.pl/', 'TVP Sport'),
      L('sportklub', 'https://sportklub.pl/', 'Sportklub'),
      L('wp-sportowefakty', 'https://sportowefakty.wp.pl/', 'WP SportoweFakty'),
      L('prestiz-trojmiasto', 'https://prestiztrojmiasto.pl/', 'Prestiż Trójmiasto'),
      L('prestiz-szczecin', 'https://prestizszczecin.pl/', 'Prestiż Szczecin'),
      L('morze', 'https://www.morze.org/', 'Morze'),
      L('charter-navigator', 'https://www.charternavigator.pl/', 'Charter Navigator'),
      L('gospodarka-morska', 'https://www.gospodarkamorska.pl/', 'Gospodarka Morska'),
      L('zeglarski-info', 'https://zeglarski.info/index.html', 'Żeglarski.info'),
    ],
  },
  {
    kategoria: 'Współpraca',
    loga: [
      L('isla', 'https://isla-org.com/', 'ISLA'),
      L('scl', 'https://sailing-championsleague.com/', 'Sailing Champions League'),
      L('zozz', 'https://www.zozz.org/', 'Zachodniopomorski OZŻ'),
      L('sfts', 'https://sailorsforthesea.org/about-us/', 'Sailors for the Sea'),
    ],
  },
]
