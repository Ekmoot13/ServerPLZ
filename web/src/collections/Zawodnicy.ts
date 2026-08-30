import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Zawodnicy: CollectionConfig = {
  slug: 'zawodnicy',
  labels: {
    singular: 'Zawodnik',
    plural: 'Zawodnicy',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'tytul',
    defaultColumns: ['imie', 'nazwisko', 'klub', 'aktywny'],
  },
  hooks: {
    // Automatyczny tytuł "Imię Nazwisko" (do listy i pól relacji).
    beforeChange: [
      ({ data }) => {
        if (data) data.tytul = `${data.imie || ''} ${data.nazwisko || ''}`.trim()
        return data
      },
    ],
  },
  fields: [
    {
      name: 'tytul',
      type: 'text',
      admin: { hidden: true },
    },
    {
      type: 'row',
      fields: [
        { name: 'imie', type: 'text', required: true, label: 'Imię' },
        { name: 'nazwisko', type: 'text', required: true, label: 'Nazwisko' },
      ],
    },
    {
      name: 'zdjecie',
      type: 'upload',
      relationTo: 'media',
      label: 'Zdjęcie',
    },
    {
      name: 'klub',
      type: 'relationship',
      relationTo: 'kluby',
      label: 'Klub',
      admin: { description: 'Aktualny klub zawodnika (pokazywany w sekcji „Obecny klub").' },
    },
    {
      name: 'dodatkoweStarty',
      type: 'array',
      label: 'Ręczne starty (dodatkowe regaty)',
      admin: {
        description:
          'Starty dodane ręcznie — doklejane do listy startów obok danych z bazy wyników.',
        initCollapsed: true,
      },
      labels: { singular: 'Start', plural: 'Starty' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'rok', type: 'number', label: 'Rok' },
            { name: 'miejsce', type: 'number', label: 'Miejsce' },
          ],
        },
        { name: 'regaty', type: 'text', label: 'Nazwa regat' },
        {
          type: 'row',
          fields: [
            { name: 'miasto', type: 'text', label: 'Miasto' },
            { name: 'klub', type: 'text', label: 'Klub (nazwa)' },
          ],
        },
      ],
    },
    {
      name: 'aktywny',
      type: 'checkbox',
      label: 'Aktywny',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'idZawodnika',
      type: 'number',
      label: 'ID zawodnika (powiązanie z wynikami liga_)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Łącznik do bazy wyników (liga_Zawodnik). Nie zmieniaj bez potrzeby.',
      },
    },
  ],
}
