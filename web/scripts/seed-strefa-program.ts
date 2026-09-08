/**
 * Wypełnia sekcję informacyjną Strefy Kibica przykładowym programem weekendu
 * (na podstawie 1 Liga 2026 – 3 Runda, Gdynia). Uruchamia też push schematu
 * (dodaje nowe kolumny globala strefa-kibica, jeśli ich nie ma).
 *
 * Uruchomienie w kontenerze web:
 *   npm run payload -- run scripts/seed-strefa-program.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const YT = 'https://youtube.com/@kanalzeglarski'
const SAP = 'https://plz2026.sapsailing.com/gwt/Home.html'

const linki = [
  { label: 'Tracking SAP', url: SAP, ikona: 'sap' },
  { label: 'Zapowiedź regat', url: 'https://ligazeglarska.pl/zeglarska-1-liga-wraca-do-gry/', ikona: 'gazeta' },
  { label: 'Lista startowa', url: 'https://ligazeglarska.pl/sledz-regaty-lista-startowa-3-rundy-1-ligi-gdynia/', ikona: 'gazeta' },
  { label: 'Galeria zdjęć online', url: 'https://ligazeglarska.pl/newsy/', ikona: 'aparat' },
]

const program = [
  {
    tytul: 'Dzień treningowy — Piątek, 28 sierpnia',
    pozycje: [
      { czas: '09:00–18:00', opis: 'Sesje treningowe', link: '', ikona: 'strzalka' },
      { czas: '16:00', opis: 'Konferencja z zawodnikami', link: YT, ikona: 'youtube' },
      { czas: '21:00', opis: 'Studio eksperckie przed regatami', link: YT, ikona: 'youtube' },
    ],
  },
  {
    tytul: 'Dzień 1 — Sobota, 29 sierpnia',
    pozycje: [
      { czas: '9:00', opis: 'Odprawa w bazie regat', link: '', ikona: 'ptaszek' },
      { czas: '10:30–18:00', opis: 'Wyścigi z trackingiem GPS i wynikami na żywo', link: SAP, ikona: 'sap' },
      { czas: '21:00', opis: 'Studio eksperckie po 1. dniu regat', link: YT, ikona: 'youtube' },
    ],
  },
  {
    tytul: 'Dzień 2 — Niedziela, 30 sierpnia',
    pozycje: [
      { czas: '9:00', opis: 'Odprawa w bazie regat', link: '', ikona: 'ptaszek' },
      { czas: '10:00–15:30', opis: 'Wyścigi z trackingiem GPS i wynikami na żywo', link: SAP, ikona: 'sap' },
      { czas: '16:00', opis: 'Zakończenie regat w Marinie Gdynia', link: '', ikona: 'puchar' },
      { czas: '18:00', opis: 'Konferencja ze zwycięzcami', link: YT, ikona: 'youtube' },
    ],
  },
  {
    tytul: 'Po regatach — Poniedziałek, 31 sierpnia',
    pozycje: [
      { czas: '21:00', opis: 'Podsumowujące studio eksperckie', link: YT, ikona: 'youtube' },
      { czas: '', opis: 'Podsumowanie regat', link: 'https://ligazeglarska.pl/newsy/', ikona: 'gazeta' },
    ],
  },
]

console.log('== START seed programu Strefy Kibica ==')
const payload = await getPayload({ config })

await payload.updateGlobal({
  slug: 'strefa-kibica',
  data: {
    pokazProgram: true,
    programTytul: 'Śledź z nami regaty dzień po dniu',
    programWstep:
      'Newsy z pierwszej ręki zawsze na naszych social mediach. Wyniki i tracking na żywo na SAP Sailing. Zobacz program weekendu poniżej.',
    linki,
    program,
  } as any,
  overrideAccess: true,
})

console.log('Strefa Kibica: program przykładowy zapisany.')
process.exit(0)
