import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Kluby: CollectionConfig = {
  slug: 'kluby',
  labels: {
    singular: 'Klub',
    plural: 'Kluby',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'nazwa',
    defaultColumns: ['nazwa', 'skrot', 'gdzieStartuje', 'aktywny'],
  },
  fields: [
    {
      name: 'nazwa',
      type: 'text',
      required: true,
      label: 'Nazwa',
    },
    {
      name: 'skrot',
      type: 'text',
      label: 'Skrót',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'gdzieStartuje',
      type: 'text',
      label: 'Gdzie startuje (poziom ligi)',
    },
    {
      name: 'poziomLigi',
      type: 'select',
      label: 'Poziom ligi (aktualny)',
      options: [
        { label: 'Ekstraklasa', value: 'Ekstraklasa' },
        { label: '1 Liga', value: '1 Liga' },
        { label: '2 Liga', value: '2 Liga' },
        { label: 'Młodzieżowa', value: 'Młodzieżowa' },
      ],
      admin: { description: 'Poziom, na którym klub startuje w bieżącym sezonie.' },
    },
    {
      name: 'zaloga',
      type: 'relationship',
      relationTo: 'zawodnicy',
      hasMany: true,
      label: 'Załoga (aktualna)',
      admin: { description: 'Aktualny skład — pokazywany w sekcji „Zawodnicy klubu".' },
    },
    {
      name: 'trybPowiazania',
      type: 'select',
      label: 'Tryb powiązania z bazą wyników',
      defaultValue: 'zestawienie',
      options: [
        { label: 'Cały klub (zestawienie) — wszystkie warianty', value: 'zestawienie' },
        { label: 'Wybrane warianty (osobny zespół)', value: 'warianty' },
      ],
      admin: {
        description:
          '„Cały klub" zbiera wyniki wszystkich wariantów (także historycznych nazw). ' +
          '„Wybrane warianty" opisuje pojedynczy zespół, np. sekcję młodzieżową.',
      },
    },
    {
      name: 'idZestawienia',
      type: 'number',
      label: 'ID zestawienia (powiązanie z wynikami liga_)',
      admin: {
        description: 'Łącznik do bazy wyników (liga_ZestawienieKlubow).',
      },
    },
    {
      name: 'wykluczoneWarianty',
      type: 'number',
      hasMany: true,
      label: 'Warianty wyłączone z wyświetlania',
      admin: {
        description:
          'ID wariantów (liga_KlubWariant), których wyniki NIE mają się liczyć do tego klubu ' +
          '— np. sekcja młodzieżowa mająca własny wpis. Działa w trybie „Cały klub".',
      },
    },
    {
      name: 'warianty',
      type: 'number',
      hasMany: true,
      label: 'Warianty tego zespołu',
      admin: {
        description:
          'ID wariantów (liga_KlubWariant) składających się na ten zespół. Działa w trybie „Wybrane warianty".',
      },
    },
    {
      type: 'collapsible',
      label: 'Linki',
      admin: { initCollapsed: true },
      fields: [
        { name: 'www', type: 'text', label: 'Strona WWW' },
        { name: 'facebook', type: 'text', label: 'Facebook' },
        { name: 'instagram', type: 'text', label: 'Instagram' },
        { name: 'youtube', type: 'text', label: 'YouTube' },
      ],
    },
    {
      name: 'aktywny',
      type: 'checkbox',
      label: 'Aktywny',
      defaultValue: true,
    },
  ],
}
