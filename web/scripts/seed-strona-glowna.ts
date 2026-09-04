/**
 * Wypełnia globalny obiekt „Strona główna” domyślną treścią (na podstawie ligazeglarska.pl).
 * Uruchamia też synchronizację schematu Payload (push) — tworzy tabele globala, jeśli ich nie ma.
 *
 * UWAGA: nadpisuje całą treść sekcji. Uruchamiaj przy pierwszej konfiguracji.
 * (Tokeny FB/IG zostaną puste — redaktor wpisuje je później w panelu.)
 *
 * Uruchomienie w kontenerze web:
 *   npm run payload -- run scripts/seed-strona-glowna.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const L = 'https://ligazeglarska.pl/wp-content/uploads'

const media = [
  {
    kategoria: 'TELEWIZJA',
    loga: [
      { logoUrl: `${L}/2024/04/Logo_TVP_Sport-300x82.jpg`, link: 'https://sport.tvp.pl/86321430/polska-liga-zeglarska', nazwa: 'TVP Sport' },
      { logoUrl: `${L}/2025/11/Telewizja_Polska_-_TVP3_logo_2016.svg-300x113.png`, link: 'https://regiony.tvp.pl/', nazwa: 'TVP3' },
      { logoUrl: `${L}/2025/11/Telewizja_Polska_-_TVP2_logo_2003.svg-300x113.png`, link: 'https://tvp2.tvp.pl/', nazwa: 'TVP2' },
      { logoUrl: `${L}/2024/04/Sportklub_logo-300x55.png`, link: 'https://sportowefakty.wp.pl/sportklub', nazwa: 'Sportklub' },
      { logoUrl: `${L}/2025/11/canalsport-300x134.png`, link: 'https://www.canalplus.com/pl/canalplussport/', nazwa: 'Canal+ Sport' },
      { logoUrl: `${L}/2025/11/Tvn24_Logo.svg`, link: 'https://tvn24.pl/', nazwa: 'TVN24' },
    ],
  },
  {
    kategoria: 'PRASA',
    loga: [
      { logoUrl: `${L}/2024/04/OnetPrzeglad_logo_CMYK-1-2-1.pdf-300x138.png`, link: 'https://przegladsportowy.onet.pl/polska-liga-zeglarska', nazwa: 'Onet Przegląd Sportowy' },
      { logoUrl: `${L}/2024/04/Logo_TVP_Sport-300x82.jpg`, link: 'https://sport.tvp.pl/86321430/polska-liga-zeglarska', nazwa: 'TVP Sport' },
      { logoUrl: `${L}/2025/11/wp_sport-300x87.png`, link: 'https://sportowefakty.wp.pl/zeglarstwo', nazwa: 'WP SportoweFakty' },
      { logoUrl: `${L}/2025/11/sport_pl-300x114.png`, link: 'https://www.sport.pl/inne/0,128966.html', nazwa: 'Sport.pl' },
      { logoUrl: `${L}/2025/11/Eurosport-Logo-300x169.png`, link: 'https://eurosport.tvn24.pl/zeglarstwo', nazwa: 'Eurosport' },
      { logoUrl: `${L}/2025/11/RMF24-1-300x80.png`, link: 'https://www.rmf24.pl/', nazwa: 'RMF24' },
      { logoUrl: `${L}/2025/11/xyz-300x69.png`, link: 'https://xyz.pl/', nazwa: 'XYZ' },
      { logoUrl: `${L}/2025/11/Forbes_logo.svg-300x81.png`, link: 'https://www.forbes.pl/', nazwa: 'Forbes' },
      { logoUrl: `${L}/2026/06/2024_new_msn_logo.svg-300x118.png`, link: 'https://www.msn.com/pl-pl', nazwa: 'MSN' },
      { logoUrl: `${L}/2025/11/prestiz_trojmiejski-300x93.png`, link: 'https://prestiztrojmiasto.pl/', nazwa: 'Prestiż Trójmiejski' },
      { logoUrl: `${L}/2025/11/prestiz_szczecinski-300x141.png`, link: 'https://prestizszczecin.pl/', nazwa: 'Prestiż Szczeciński' },
      { logoUrl: `${L}/2026/06/d233ede97739d84e7579bf4edca37a22-e1781699332814-300x135.jpg`, link: 'https://noizz.pl/', nazwa: 'Noizz' },
      { logoUrl: `${L}/2024/04/MORZE-logo-300x150.jpg`, link: 'http://MORZE.ORG', nazwa: 'MORZE' },
      { logoUrl: `${L}/2026/06/ZP-logo11-300x47.png`, link: 'https://www.zawszepomorze.pl/', nazwa: 'Zawsze Pomorze' },
      { logoUrl: `${L}/2025/11/firmy__dziennikbaltycki-300x158.png`, link: 'https://dziennikbaltycki.pl/', nazwa: 'Dziennik Bałtycki' },
      { logoUrl: `${L}/2025/11/Trojmiasto-PL-300x123.jpg`, link: 'https://www.trojmiasto.pl/sport/', nazwa: 'Trójmiasto.pl' },
    ],
  },
  {
    kategoria: 'RADIO',
    loga: [
      { logoUrl: `${L}/2025/11/RMF_FM_2010_Alt.webp`, link: 'https://www.rmf24.pl/', nazwa: 'RMF FM' },
      { logoUrl: `${L}/2026/06/RMF_Maxxx_logo-300x62.png`, link: 'https://www.rmfmaxxx.pl/', nazwa: 'RMF Maxxx' },
      { logoUrl: `${L}/2025/11/pr24-logo-768x362.jpg`, link: 'https://polskieradio24.pl/', nazwa: 'Polskie Radio 24' },
      { logoUrl: `${L}/2026/06/300-1.png`, link: 'https://radioszczecin.pl/', nazwa: 'Radio Szczecin' },
      { logoUrl: `${L}/2026/06/radio-gdansk-logo-768x467.png`, link: 'https://radiogdansk.pl/', nazwa: 'Radio Gdańsk' },
    ],
  },
]

const sponsorzy = [
  {
    kategoria: 'Sponsor tytularny',
    loga: [
      { logoUrl: `${L}/2024/02/PZZ.svg`, link: 'https://pya.org.pl/polski-zwiazek-zeglarski', nazwa: 'PZŻ' },
      { logoUrl: `${L}/2024/02/World-Sailing.png`, link: 'https://www.sailing.org/', nazwa: 'World Sailing' },
      { logoUrl: `${L}/2024/02/sailing-champion-league-221x300.jpg`, link: 'https://sailing-championsleague.com/', nazwa: 'Sailing Champions League' },
      { logoUrl: `${L}/2024/02/ISLA-Logo-Colore-300x77.png`, link: 'https://isla-org.com/', nazwa: 'ISLA' },
    ],
  },
  {
    kategoria: 'Sponsorzy Główni',
    loga: [
      { logoUrl: `${L}/2024/04/2-1.jpg`, link: 'https://www.gkpge.pl/', nazwa: 'PGE' },
      { logoUrl: `${L}/2024/04/1-300x180.jpg`, link: 'https://www.nissan.pl/', nazwa: 'Nissan' },
      { logoUrl: `${L}/2024/04/3-300x180.jpg`, link: 'https://www.pekao.com.pl/', nazwa: 'Pekao' },
      { logoUrl: `${L}/2024/04/MAG-300x180.jpg`, link: 'https://www.mag.pl/pl', nazwa: 'MAG' },
      { logoUrl: `${L}/2024/04/5-1-300x180.jpg`, link: 'https://www.stbu.pl/', nazwa: 'STBU' },
    ],
  },
  {
    kategoria: 'Oficjalny Partner Odzieżowy',
    loga: [{ logoUrl: `${L}/2024/04/Crazy4Sailing_LONG-300x56.jpg`, link: 'https://www.crazy4sailing.com/', nazwa: 'Crazy4Sailing' }],
  },
  {
    kategoria: 'Sponsorzy i Partnerzy Regat',
    loga: [
      { logoUrl: `${L}/2024/04/6-1-300x180.jpg`, link: 'https://www.drirenaeris.com/', nazwa: 'Dr Irena Eris' },
      { logoUrl: `${L}/2024/04/Logo-na-strone-SPORTOFINO-300x180.jpg`, link: 'https://sportofino.com/', nazwa: 'Sportofino' },
    ],
  },
  {
    kategoria: 'Gospodarze Regat',
    loga: [
      { logoUrl: `${L}/2024/04/8-300x180.jpg`, link: 'https://www.sopot.pl/', nazwa: 'Sopot' },
      { logoUrl: `${L}/2024/04/9-300x180.jpg`, link: 'https://miastopuck.pl/', nazwa: 'Puck' },
      { logoUrl: `${L}/2024/04/10-300x180.jpg`, link: 'https://www.gdynia.pl/', nazwa: 'Gdynia' },
      { logoUrl: `${L}/2024/04/11-300x180.jpg`, link: 'https://szczecin.eu/pl', nazwa: 'Szczecin' },
      { logoUrl: `${L}/2024/04/12-300x180.jpg`, link: 'https://pomorzezachodnie.travel/', nazwa: 'Pomorze Zachodnie' },
      { logoUrl: `${L}/2024/04/Marina-Sopot-300x137.png`, link: 'https://www.facebook.com/molosopockie/', nazwa: 'Marina Sopot' },
      { logoUrl: `${L}/2024/04/Marina-Puck-300x212.jpg`, link: 'https://marinapuck.com/', nazwa: 'Marina Puck' },
      { logoUrl: `${L}/2024/04/gdynia-sport-logo-300x268.png`, link: 'https://gdyniasport.pl/pl', nazwa: 'Gdynia Sport' },
      { logoUrl: `${L}/2024/04/CZ_logo_kolor_pion-276x300.png`, link: 'https://centrumzeglarskie.pl/', nazwa: 'Centrum Żeglarskie' },
    ],
  },
  {
    kategoria: 'Partnerzy',
    loga: [
      { logoUrl: `${L}/2024/04/4-1.jpg`, link: 'https://garmin.com/pl-PL/', nazwa: 'Garmin' },
      { logoUrl: `${L}/2024/04/5-2-e1786534072250.jpg`, link: 'https://auramarine.pl/', nazwa: 'Aura Marine' },
      { logoUrl: `${L}/2024/04/DLA-ZEGLARZY_z-dopiskiem-1-768x445.jpg`, link: 'https://www.okularydlazeglarzy.pl/', nazwa: 'Okulary dla żeglarzy' },
      { logoUrl: `${L}/2024/04/7-1.jpg`, link: 'https://www.sap.com/index.html', nazwa: 'SAP' },
      { logoUrl: `${L}/2024/04/9-1.jpg`, link: 'https://dr-coffee.pl/', nazwa: 'Dr Coffee' },
      { logoUrl: `${L}/2024/04/10-1.jpg`, link: 'https://www.mkcafehoreca.pl/', nazwa: 'MK Cafe' },
      { logoUrl: `${L}/2024/04/6-2.jpg`, link: 'https://vulcantc.com/pl/', nazwa: 'Vulcan' },
      { logoUrl: `${L}/2024/04/Nowy-Styl_logo-768x296.png`, link: 'https://www.nowystyl.com/pl/', nazwa: 'Nowy Styl' },
    ],
  },
  {
    kategoria: 'Partnerzy Techniczni',
    loga: [
      { logoUrl: `${L}/2024/03/Bryt-Sails-300x53.png`, link: 'https://brytsails.com/', nazwa: 'Bryt Sails' },
      { logoUrl: `${L}/2024/04/harken-768x231.png`, link: 'https://www.harken.pl/pl/home/', nazwa: 'Harken' },
      { logoUrl: `${L}/2024/04/logo-Marine_page-0001-300x212.jpg`, link: 'https://pro-protection.com/', nazwa: 'Pro Protection' },
      { logoUrl: `${L}/2024/03/RS-Sailing1-300x178.png`, link: 'https://rs21class.pl/', nazwa: 'RS Sailing' },
    ],
  },
  {
    kategoria: 'Partner Wspierający',
    loga: [{ logoUrl: `${L}/2024/02/PZZ.svg`, link: 'https://pya.org.pl/polski-zwiazek-zeglarski', nazwa: 'PZŻ' }],
  },
  {
    kategoria: 'Patronaty Honorowe',
    loga: [
      { logoUrl: `${L}/2024/04/MSiT-300x127.png`, link: 'https://www.gov.pl/web/sport', nazwa: 'MSiT' },
      { logoUrl: `${L}/2024/04/MWP-PATRONAT-Mieczyslaw-Struk-pion-kolor-2021-300x173.png`, link: 'https://pomorskie.eu/', nazwa: 'Marszałek Woj. Pomorskiego' },
      { logoUrl: `${L}/2024/04/og_pion-300x228.jpg`, link: 'https://pomorzezachodnie.travel/', nazwa: 'Pomorze Zachodnie' },
      { logoUrl: `${L}/2024/04/Sopot-Patronat-poziom-marynarz-CMYK-300x142.jpg`, link: 'https://www.sopot.pl/', nazwa: 'Sopot' },
      { logoUrl: `${L}/2024/04/Herb-patronat-Honorowy-1-300x120.png`, link: 'https://miastopuck.pl/', nazwa: 'Puck' },
      { logoUrl: `${L}/2024/04/prezydent-miasta-gdyni-Aleksandra-Kosiorek-300x105.png`, link: 'https://www.gdynia.pl/', nazwa: 'Gdynia' },
      { logoUrl: `${L}/2024/04/Patronat-Honorowy_kolor_2-300x156.jpg`, link: 'https://szczecin.eu/pl', nazwa: 'Szczecin' },
    ],
  },
  {
    kategoria: 'Patronaty Medialne',
    loga: [
      { logoUrl: `${L}/2024/04/25-300x180.jpg`, link: 'https://przegladsportowy.onet.pl/', nazwa: 'Przegląd Sportowy' },
      { logoUrl: `${L}/2024/04/24-300x180.jpg`, link: 'https://sport.tvp.pl/', nazwa: 'TVP Sport' },
      { logoUrl: `${L}/2024/04/27-300x180.jpg`, link: 'https://sportklub.pl/', nazwa: 'Sportklub' },
      { logoUrl: `${L}/2024/04/26-e1785237607907-300x87.jpg`, link: 'https://sportowefakty.wp.pl/', nazwa: 'WP SportoweFakty' },
      { logoUrl: `${L}/2024/03/Prestiż-e1711060099398-300x121.png`, link: 'https://prestiztrojmiasto.pl/', nazwa: 'Prestiż' },
      { logoUrl: `${L}/2024/03/Prestiż-Magazyn-Szczeciński-scaled-e1711066279382-300x91.jpg`, link: 'https://prestizszczecin.pl/', nazwa: 'Prestiż Szczeciński' },
      { logoUrl: `${L}/2024/04/MORZE-logo-300x150.jpg`, link: 'https://www.morze.org/', nazwa: 'MORZE' },
      { logoUrl: `${L}/2024/04/logoCharterNavigator-300x155.png`, link: 'https://www.charternavigator.pl/', nazwa: 'Charter Navigator' },
      { logoUrl: `${L}/2024/04/Gospodarka-morska-1-300x49.png`, link: 'https://www.gospodarkamorska.pl/', nazwa: 'Gospodarka Morska' },
      { logoUrl: `${L}/2024/04/Logo-ZOZZ-03.jpg`, link: 'https://www.zozz.org/', nazwa: 'ZOZŻ' },
    ],
  },
]

const jakSieScigamyHtml = `
<h2>Jak wyglądają regaty?</h2>
<p>Od sezonu 2026 zapewniamy <strong>10 identycznych łódek klasy RS21</strong>, na których w jednej lidze rywalizuje 20 załóg. Załogi rotują się między jachtami co wyścig, co zapewnia równość szans. Na każdym poziomie Ligi odbywają się 4 rundy, czyli weekendowe regaty.</p>
<p>Ścigamy się w najpiękniejszych polskich lokalizacjach – w Sopocie, Gdyni, Pucku i Szczecinie. Podczas jednej imprezy regatowej odbywa się do 30 wyścigów, trwających ok. 10 minut, które można obserwować z brzegu.</p>
<h2>Jak wyglądają wyścigi?</h2>
<p><strong>Start:</strong> 10 jachtów startuje z linii wyznaczonej przez boję i statek komisji po upływie 3-minutowej procedury startowej.</p>
<p><strong>Trasa:</strong> załogi płyną pod wiatr do górnej bramki, następnie do dolnej bramki, opływając znaki od środka na zewnątrz.</p>
<p><strong>Format:</strong> wyścig składa się z dwóch okrążeń trasy i trwa ok. 10 minut. Po 2 okrążeniach jachty przekraczają linię mety przy statku komisji.</p>
<h2>Jak się ścigamy?</h2>
<p>Podczas każdego weekendu ligowego rozgrywanych jest <strong>aż 30 krótkich i dynamicznych wyścigów</strong>, trwających zaledwie 10–12 minut. Dzięki obecności trzech arbitrów na wodzie sporne sytuacje rozstrzygane są natychmiast.</p>
<p>Trasa ustawiana jest blisko brzegu, by kibice mogli śledzić zmagania z lądu. Wszyscy ścigają się na jednakowych jachtach klasy <strong>RS21</strong> dostarczonych przez organizatora, a załogi rotują między nimi po niemal każdym wyścigu.</p>
<h2>Na jakich jachtach się ścigamy?</h2>
<p>Pływamy na szybkich i zwrotnych jachtach klasy <strong>RS21</strong> (długość 6,5 m, waga 650 kg, węglowy maszt, genaker i trzy żagle: fok, grot i genaker). Załoga: sternik, trymer grota, trymer żagli przednich oraz dziobowy.</p>
`.trim()

console.log('== START seed strony głównej ==')
const payload = await getPayload({ config })

const data: any = {
  aktualnosci: {
    tryb: 'rotacja',
    pojedynczyElement: 'baner',
    pokazBaner: true,
    pokazFacebook: false,
    pokazInstagram: false,
    fbPageId: '',
    fbToken: '',
    igUserId: '',
    igToken: '',
    banerTytul: 'Śledź regaty na żywo',
    banerTekst: 'Transmisje na żywo, mapa wyścigu i wyniki w czasie rzeczywistym — wszystko w jednym miejscu.',
    banerLink: '/regatowastrefakibica',
    banerObraz: '',
  },
  nastepneRegaty: { pokaz: true, tytul: 'Regaty' },
  wprowadzenie: {
    tytul: 'REGATY JAK NA STADIONIE',
    tekst:
      'Od ponad 10 lat organizujemy regularne rozgrywki składające się z serii regat w Sopocie, Pucku, Gdyni i Szczecinie, w których kluby żeglarskie rywalizują o tytuł Klubowego Mistrza Polski, awans do wyższej ligi lub uniknięcie spadku.\n\n' +
      'Zapewniamy jednakowe, nowoczesne jachty RS21, dynamiczne wyścigi rozgrywane w atrakcyjnym dla zawodników i widzów formacie, nowoczesne sędziowanie na światowym poziomie i medialność. W regatach Polskiej Ligi Żeglarskiej udział biorą najlepsi polscy żeglarze wielu pokoleń: Mistrzowie Polski, Europy i Świata, medaliści Olimpijscy oraz aktualni zawodnicy Kadry Narodowej i Kadry Juniorskiej, ale także początkujący amatorzy.\n\n' +
      'Ponad 500 zawodniczek i zawodników w 120 klubach ściga się w Ekstraklasie i 1 Lidze (po 20 załóg), 6 amatorskich Ligach Regionalnych w całej Polsce oraz w Lidze Młodzieżowej do 25. roku życia.',
    obrazTla: '',
    jakSieScigamyHtml,
    poziomyObraz: '/poziomy-lig.png',
    jakSledzic: [
      { label: 'Tracking SAP (mapa i wyniki)', url: '/regatowastrefakibica' },
      { label: 'Kanał na YouTube', url: 'https://www.youtube.com/@kanalzeglarski' },
      { label: 'TVP Sport', url: 'https://sport.tvp.pl/polska-liga-zeglarska' },
      { label: 'Facebook', url: 'https://www.facebook.com/LigaZeglarska' },
      { label: 'Instagram', url: 'https://www.instagram.com/polskaligazeglarska/' },
      { label: 'Społeczność WhatsApp', url: 'https://chat.whatsapp.com/JQRZWPIGH7x7OAHW8QaKRH' },
    ],
    media,
    zgloszeniaIntro:
      'Jak zgłosić się do regat w Lidze? Zobacz, w jakich ligach mamy wolne miejsca na kolejny sezon, dowiedz się więcej i wyślij zgłoszenie.',
    zgloszeniaLigi: [
      { nazwa: 'Młodzieżowa Liga Żeglarska', logoUrl: '', wiecejLink: 'https://ligazeglarska.pl/mlodziezowa-liga-zeglarska/', wyslijLink: 'mailto:info@ligazeglarska.pl' },
      { nazwa: 'Trójmiejska Liga Żeglarska', logoUrl: `${L}/2025/11/TLZ_LOGO_PION_KOLOR-1.png`, wiecejLink: 'https://ligazeglarska.pl/regionalne/trojmiejska-liga-zeglarska/', wyslijLink: 'mailto:info@ligazeglarska.pl' },
      { nazwa: 'Wielkopolska Liga Żeglarska', logoUrl: `${L}/2025/11/WLZ_LOGO_PION_KOLOR.png`, wiecejLink: 'https://ligazeglarska.pl/regionalne/wielkopolska-liga-zeglarska/', wyslijLink: 'mailto:info@wielkopolskaligazeglarska.pl' },
      { nazwa: 'Centralna Liga Żeglarska', logoUrl: `${L}/2025/11/CLZ_LOGO_PION_KOLOR.png`, wiecejLink: 'https://ligazeglarska.pl/regionalne/centralna-liga-zeglarska/', wyslijLink: 'mailto:info@centralnaligazeglarska.pl' },
      { nazwa: 'Biznes Liga Żeglarska', logoUrl: '', wiecejLink: '', wyslijLink: 'mailto:info@ligazeglarska.pl' },
    ],
  },
  sponsorzy: { tytul: 'Sponsorzy i Partnerzy', grupy: sponsorzy },
}

await payload.updateGlobal({ slug: 'strona-glowna' as any, data, overrideAccess: true })
console.log('Strona główna: zapisano domyślną treść.')
process.exit(0)
