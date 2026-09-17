import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const StrefaKibica: GlobalConfig = {
  slug: 'strefa-kibica',
  label: 'Strefa Kibica',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'pokazPrzycisk',
      type: 'checkbox',
      label: 'Pokaż przycisk „Śledź Regaty" w nagłówku strony',
      defaultValue: true,
    },
    // ---- Sekcje dashboardu (każdą można wyłączyć osobno) ----
    {
      name: 'pokazMape',
      type: 'checkbox',
      label: 'Pokaż sekcję „Mapa wyścigu"',
      defaultValue: true,
    },
    {
      name: 'pokazTransmisje',
      type: 'checkbox',
      label: 'Pokaż sekcję „Transmisja na żywo"',
      defaultValue: true,
    },
    {
      name: 'pokazWyniki',
      type: 'checkbox',
      label: 'Pokaż sekcję „Wyniki na żywo"',
      defaultValue: true,
    },
    {
      name: 'mapaUrl',
      type: 'text',
      label: 'Mapa — URL RaceBoard (SAP)',
      admin: {
        description:
          'Wklej pełny adres RaceBoard.html z SAP dla bieżącej rundy (…/gwt/RaceBoard.html?…&mode=PLAYER).',
      },
    },
    {
      name: 'sapBase',
      type: 'text',
      label: 'Instancja SAP (API leaderboardu)',
      defaultValue: 'https://plz2026.sapsailing.com',
      admin: { description: 'Adres instancji do pobrania tabeli wyników, np. https://plz2026.sapsailing.com' },
    },
    {
      name: 'leaderboardName',
      type: 'text',
      label: 'Nazwa leaderboardu (tabela na żywo)',
      admin: {
        description:
          'Dokładna nazwa leaderboardu z SAP, np. „Polish Sailing League 2026 (2nd divison) - Gdynia (3)".',
      },
    },
    // ---- Sekcja informacyjna pod dashboardem (program weekendu) ----
    {
      name: 'pokazProgram',
      type: 'checkbox',
      label: 'Pokaż sekcję informacyjną (program weekendu) pod dashboardem',
      defaultValue: true,
    },
    {
      name: 'programTytul',
      type: 'text',
      label: 'Nagłówek sekcji informacyjnej',
      defaultValue: 'Śledź z nami regaty dzień po dniu',
    },
    {
      name: 'programWstep',
      type: 'textarea',
      label: 'Wstęp (krótki tekst pod nagłówkiem)',
    },
    {
      name: 'programTlo',
      type: 'text',
      label: 'Zdjęcie w tle sekcji informacyjnej',
      admin: {
        description:
          'Adres zdjęcia pokazywanego w tle programu weekendu — buduje poczucie miejsca. Puste = zwykłe białe tło.',
      },
    },
    {
      name: 'linki',
      type: 'json',
      label: 'Szybkie linki (przyciski: etykieta + adres)',
      admin: { description: 'Edytowane w panelu redaktora. Format: lista { label, url }.' },
    },
    {
      name: 'program',
      type: 'json',
      label: 'Program weekendu (dni i punkty programu)',
      admin: { description: 'Edytowany w panelu redaktora. Format: lista dni { tytul, pozycje:[{czas,opis,link}] }.' },
    },
    {
      name: 'mapaEmbed',
      type: 'text',
      label: 'Lokalizacja — adres osadzenia mapy Google (opcjonalnie)',
      admin: { description: 'Wklej URL z „Osadź mapę" Google Maps (https://www.google.com/maps/embed?...).' },
    },
  ],
}
