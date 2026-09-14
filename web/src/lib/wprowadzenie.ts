// Treść banera „REGATY JAK NA STADIONIE" — pogrubienia 1:1 jak na ligazeglarska.pl.
// Jedno źródło dla strony głównej (fallback) i dla seedów globala `strona-glowna`,
// żeby wersja w bazie nie rozjechała się z wersją w kodzie.
export const REGATY_INTRO: string[] = [
  'Od ponad 10 lat organizujemy regularne rozgrywki składające się z serii regat w Sopocie, Pucku, Gdyni i Szczecinie, w których kluby żeglarskie rywalizują o tytuł <strong>Klubowego Mistrza Polski</strong>, awans do wyższej ligi lub uniknięcie spadku.',
  'Zapewniamy <strong>jednakowe, nowoczesne jachty RS21</strong>, <strong>dynamiczne wyścigi</strong> rozgrywane w atrakcyjnym dla zawodników i widzów formacie, nowoczesne <strong>sędziowanie na światowym poziomie i medialność.</strong> W regatach Polskiej Ligi Żeglarskiej udział biorą <strong>najlepsi polscy żeglarze</strong>, przedstawiciele wielu pokoleń <strong>Mistrzów Polski, Europy i Świata, medaliści Olimpijscy</strong> oraz <strong>aktualni zawodnicy Kadry Narodowej, Kadry Juniorskiej</strong>, ale także początkujący i żeglarze amatorzy.',
  'Ponad <strong>500 zawodniczek i zawodników w 120 klubach</strong> ściga się w <strong>Ekstraklasie</strong> i <strong>1 Lidze</strong> (po 20 załóg), 6 amatorskich <strong>Ligach Regionalnych</strong> w całej Polsce dla rozpoczynających przygodę oraz w <strong>Lidze Młodzieżowej</strong> do 25. roku życia.',
]

export const REGATY_TYTUL = 'REGATY JAK NA STADIONIE'

// Format pola `wprowadzenie.tekst` w panelu: akapity oddzielone pustą linią.
export const REGATY_TEKST = REGATY_INTRO.join('\n\n')
