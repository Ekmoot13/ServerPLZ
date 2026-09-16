// Przekierowania starych adresow profili ze strony WordPress.
// W tresci zaimportowanych newsow zostaly linki do klubow, regat i zawodnikow
// w starej postaci. Po przepieciu domeny trafiaja na nasz serwer, a czesc
// z nich nie ma juz odpowiednika — kierujemy je tam, gdzie maja sens.
//
// Kluby-warianty (mlodziezowe, drugie zalogi) prowadza do klubu-matki,
// tak samo jak robi to zakladka Zespoly.

/** Stary adres klubu -> nowy, gdy dalo sie ustalic odpowiednik. */
export const klubyNaKlub: Record<string, string> = {
  'garland-yacht-club': 'kw-garland-gliwice',
  'wiking-wolin': 'uks-albatros-wolin',
  'azs-politechnika-gdanska-youth': 'azs-politechnika-gdanska',
  'energa-gizycka-grupa-regatowa': 'gizycka-grupa-regatowa-nowy-sztynort-osada-wolnosci',
  'gizycka-grupa-regatowa-2': 'gizycka-grupa-regatowa-nowy-sztynort-osada-wolnosci',
  'hrm-racing-youth': 'hrm-racing',
  'hrm-racing-youth-2': 'hrm-racing',
  'legia-warszawa': 'legia-warszawa-2',
  'mkz-mikolajki': 'mazurski-klub-zeglarski-w-mikolajkach',
  'okz-olsztyn': 'olsztynski-klub-zeglarski',
  'on-lemon-rockstars-racing-youth': 'on-lemon-rockstars-racing',
  'pogon-szczecin': 'sejk-pogon-szczecin',
  'politechnika-morska-szczecin-2': 'politechnika-morska-szczecin',
  'rockstars-racing': 'on-lemon-rockstars-racing',
  'siostry-azs-awfis-gdansk-youth': 'siostry-ks-azs-awfis-gdansk',
  'texet-sailing-team': 'texet-jkw-sailing-team',
  'the-barking-dogs': 'the-barking-dogs-ycg',
  'uniwerystet-gdanski': 'uniwersytet-gdanski',
  'yacht-club-gdansk-cadetti': 'yacht-club-gdansk',
  'yacht-club-gdansk-junior': 'yacht-club-gdansk',
  'yacht-club-gdansk-ryski': 'yacht-club-gdansk',
  'yacht-club-gdansk-sigmy': 'yacht-club-gdansk',
  'yacht-club-gdansk-youth': 'yacht-club-gdansk',
  'yacht-club-sopot-1': 'yacht-club-sopot',
  'yacht-club-sopot-youth': 'yacht-club-sopot',
  'ykp-gdynia': 'yacht-klub-polski-gdynia',
  'ykp-lublin': 'lubelskie-ykp-lublin',
  'ykp-szczecin-2-2': 'ykp-szczecin',
  'ykp-warszawa-wow': 'ykp-warszawa',
  'ykp2-szczecin-sailing-team': 'ykp-szczecin',
}

/** Kluby bez odpowiednika w nowej bazie — kierujemy na liste klubow. */
export const klubyNaListe = [
  '4ateam',
  'auto-podlasie',
  'azs-uw-warszawa',
  'inplag-sailing-sisters',
  'mag-mechelinki',
  'mowi-women-sailing-team',
  'ocean-challenge-yc',
  'puchar-polski-jachtow-kabinowych',
  'pw-azs-warszawa',
  'sailing-factory-club',
  'sen-yachts-olsztyn',
  'sunloox-sailing-team-usa',
  'vega-cleo-sailing-team',
]

/** Stare strony regat — kierujemy na kalendarz regat. */
export const regatyNaListe = [
  '1-liga-1-runda-2024',
  '1-liga-1-runda-2025',
  '1-liga-2-runda-2024',
  '1-liga-2026-3-runda-gdynia',
  '1-liga-3-runda-2024',
  '1-runda-mlodziezowa-2026',
  'ekstraklasa-2-runda-2025',
  'ekstraklasa-2026-3-runda-gdynia',
  'final-lig-regionalnych-2024',
  'mlodziezowa-2026-2-runda-sopot',
  'mlodziezowa-2026-3-runda-gdynia',
  'women-on-water-2024',
  'women-on-water2025',
  'youth-1-runda',
]

/** Stare profile zawodnikow bez odpowiednika — kierujemy na liste zawodnikow. */
export const zawodnicyNaListe = [
  'barczynski-stanely',
  'hania-dzik',
  'marcin',
]
