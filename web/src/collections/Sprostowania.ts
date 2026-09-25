import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

/**
 * Wnioski zawodników o poprawienie ich występów w regatach.
 *
 * Archiwum sprzed lat jest niepełne — zawodnik widzi na swoim profilu brakującą
 * rundę albo taką, w której nie startował, i zgłasza to przez stronę
 * /sprostowanie-wynikow. Redaktor akceptuje, odrzuca albo poprawia.
 *
 * Nazwy zawodnika, klubu i rund zapisujemy jako tekst obok identyfikatorów.
 * Dane ligowe wjeżdżają od nowa przy każdym imporcie (load_all.sql robi
 * TRUNCATE), więc identyfikator sam w sobie nie gwarantuje, że za pół roku
 * będzie się dało odczytać, czego wniosek dotyczył.
 *
 * Kolekcja jest zapisywalna przez każdego (formularz jest publiczny), ale
 * czytać i zmieniać może ją tylko zalogowany redaktor.
 */
export const Sprostowania: CollectionConfig = {
  slug: 'sprostowania',
  labels: {
    singular: 'Sprostowanie',
    plural: 'Sprostowania',
  },
  access: {
    create: () => true, // publiczny formularz zawodnika
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'zawodnikNazwa',
    defaultColumns: ['zawodnikNazwa', 'typ', 'regatyOpis', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'typ',
      type: 'select',
      required: true,
      label: 'Rodzaj wniosku',
      options: [
        { label: 'Dodanie występu', value: 'dodanie' },
        { label: 'Usunięcie występu', value: 'usuniecie' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'nowy',
      label: 'Status',
      options: [
        { label: 'Nowy', value: 'nowy' },
        { label: 'Zaakceptowany', value: 'zaakceptowany' },
        { label: 'Odrzucony', value: 'odrzucony' },
      ],
    },

    // --- czego dotyczy ---
    {
      type: 'row',
      fields: [
        { name: 'zawodnikId', type: 'number', required: true, label: 'ID zawodnika' },
        { name: 'zawodnikNazwa', type: 'text', label: 'Zawodnik' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'wariantId', type: 'number', required: true, label: 'ID wariantu klubu' },
        { name: 'klubNazwa', type: 'text', label: 'Klub / zespół' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'regatyId', type: 'number', required: true, label: 'ID regat' },
        { name: 'regatyOpis', type: 'text', label: 'Runda' },
      ],
    },

    // --- kto zgłasza ---
    {
      name: 'kontakt',
      type: 'text',
      label: 'Kontakt do zgłaszającego (e-mail lub telefon)',
      admin: { description: 'Podawany dobrowolnie — pozwala dopytać, zanim wniosek trafi do bazy.' },
    },
    { name: 'uwagi', type: 'textarea', label: 'Uwagi zgłaszającego' },

    // --- obsługa ---
    {
      name: 'notatka',
      type: 'textarea',
      label: 'Notatka redaktora',
      admin: { description: 'Widoczna tylko w panelu — np. powód odrzucenia.' },
    },
    {
      name: 'zastosowane',
      type: 'checkbox',
      defaultValue: false,
      label: 'Naniesione na dane ligowe',
      admin: {
        description:
          'Import danych czyści tabele liga_*, więc po każdej aktualizacji wyników trzeba ponownie ' +
          'uruchomić scripts/zastosuj-sprostowania.ts. Ten znacznik mówi, czy zmiana siedzi w bazie.',
      },
    },
  ],
  timestamps: true,
}
