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
    // ---- Flagi sygnalowe komisji regatowej ----
    {
      name: 'flaga',
      type: 'text',
      label: 'Podniesiona flaga',
      defaultValue: '',
      admin: {
        description:
          'Jedna naraz: AP (wyścigi odłożone), N (przerwane), PZ (falstart generalny), APA (koniec na dziś). Puste = brak sygnału. Przełączana z telefonu (/flaga) albo w tej zakładce.',
      },
    },
    {
      name: 'kodyFlagi',
      type: 'json',
      label: 'Kody dostępu do aplikacji z flagą',
      admin: {
        description:
          'Generowane w panelu (/redaktor/flaga). Format: lista { kod, wygasa, opis }. Kody wygasłe są usuwane przy każdym zapisie.',
      },
    },
    // ---- Galeria zdjec (SmugMug) ----
    {
      name: 'pokazGalerie',
      type: 'checkbox',
      label: 'Pokaż sekcję „Galeria zdjęć"',
      defaultValue: true,
    },
    {
      name: 'galeriaTytul',
      type: 'text',
      label: 'Nagłówek sekcji galerii',
      defaultValue: 'Galeria zdjęć',
    },
    {
      name: 'galeriaUrl',
      type: 'text',
      label: 'Adres galerii (SmugMug)',
      admin: {
        description:
          'Pełny adres galerii, np. https://ligazeglarska.smugmug.com/2026-Polska-Liga-zeglarska/Najlepsze-zdjecia-2026',
      },
    },
    {
      name: 'galeriaTryb',
      type: 'text',
      label: 'Skąd brać zdjęcia: „auto" albo „reczny"',
      defaultValue: 'auto',
      admin: {
        description:
          'Wybierane przełącznikiem w panelu redaktora. „auto" pobiera najnowsze zdjęcia z galerii, „reczny" pokazuje adresy podane niżej.',
      },
    },
    {
      name: 'galeriaKolejnosc',
      type: 'text',
      label: 'Które zdjęcia z galerii: „najnowsze" albo „pierwsze"',
      defaultValue: 'najnowsze',
      admin: {
        description:
          'SmugMug układa zdjęcia zwykle od najstarszych, więc „najnowsze" sięga na koniec albumu.',
      },
    },
    {
      name: 'galeriaZdjecia',
      type: 'json',
      label: 'Zdjęcia podane ręcznie',
      admin: { description: 'Edytowane w panelu redaktora. Format: lista { url, link }.' },
    },
    // ---- Najnowsze aktualnosci ----
    {
      name: 'pokazAktualnosci',
      type: 'checkbox',
      label: 'Pokaż sekcję „Aktualności"',
      defaultValue: true,
    },
    {
      name: 'aktualnosciTytul',
      type: 'text',
      label: 'Nagłówek sekcji aktualności',
      defaultValue: 'Aktualności',
    },
    {
      name: 'aktualnosciKategoria',
      type: 'text',
      label: 'Kategoria newsów (puste = wszystkie najnowsze)',
      admin: { description: 'Wybierana listą w panelu redaktora. Przechowujemy identyfikator kategorii.' },
    },
    {
      name: 'mapaEmbed',
      type: 'text',
      label: 'Lokalizacja — adres osadzenia mapy Google (opcjonalnie)',
      admin: { description: 'Wklej URL z „Osadź mapę" Google Maps (https://www.google.com/maps/embed?...).' },
    },
  ],
}
