import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Osoba (Team)',
    plural: 'Team',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'imie',
    defaultColumns: ['imie', 'funkcja', 'kolejnosc'],
  },
  fields: [
    {
      name: 'imie',
      type: 'text',
      required: true,
      label: 'Imię i nazwisko',
    },
    {
      name: 'funkcja',
      type: 'text',
      label: 'Funkcja',
    },
    {
      name: 'zdjecie',
      type: 'upload',
      relationTo: 'media',
      label: 'Zdjęcie',
    },
    {
      name: 'kolejnosc',
      type: 'number',
      label: 'Kolejność',
      defaultValue: 0,
    },
  ],
}
