import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Kalendarz: CollectionConfig = {
  slug: 'kalendarz',
  labels: {
    singular: 'Termin regat',
    plural: 'Kalendarz',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'nazwa',
    defaultColumns: ['nazwa', 'poziom', 'miejsce', 'dataOd'],
  },
  fields: [
    {
      name: 'nazwa',
      type: 'text',
      required: true,
      label: 'Nazwa regat',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'poziom',
          type: 'text',
          label: 'Poziom / liga (np. Ekstraklasa, 1 Liga, Młodzieżowa — możesz dodać własny)',
        },
        { name: 'miejsce', type: 'text', label: 'Miejsce (miasto)' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'dataOd',
          type: 'date',
          required: true,
          label: 'Data od',
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } },
        },
        {
          name: 'dataDo',
          type: 'date',
          label: 'Data do',
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } },
        },
      ],
    },
    { name: 'link', type: 'text', label: 'Link (opcjonalny — np. do wyników / śledzenia)' },
    {
      name: 'autoStatus',
      type: 'checkbox',
      label: 'Automatyczne przełączanie statusu wg daty',
      defaultValue: true,
      admin: {
        description:
          'Włączone: status ustala się sam z daty (zaplanowane → w trakcie → odbyły się). Wyłączone: używany jest status ręczny poniżej.',
      },
    },
    {
      name: 'statusReczny',
      type: 'select',
      label: 'Status ręczny (gdy automat wyłączony)',
      defaultValue: 'zaplanowane',
      options: [
        { label: 'Zaplanowane', value: 'zaplanowane' },
        { label: 'W trakcie', value: 'w-trakcie' },
        { label: 'Odbyły się', value: 'odbyly-sie' },
      ],
    },
    {
      name: 'kolejnosc',
      type: 'number',
      label: 'Kolejność (opcjonalnie; domyślnie wg daty)',
      admin: { position: 'sidebar' },
    },
  ],
}
