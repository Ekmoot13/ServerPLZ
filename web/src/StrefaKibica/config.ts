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
      label: 'Pokaż przycisk „Śledź Regaty" (nagłówek + strona główna)',
      defaultValue: true,
    },
    {
      name: 'pokazMape',
      type: 'checkbox',
      label: 'Pokaż mapę',
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
