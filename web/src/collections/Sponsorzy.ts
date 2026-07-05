import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Sponsorzy: CollectionConfig = {
  slug: 'sponsorzy',
  labels: {
    singular: 'Sponsor',
    plural: 'Sponsorzy',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'nazwa',
    defaultColumns: ['nazwa', 'kategoria', 'kolejnosc'],
  },
  fields: [
    {
      name: 'nazwa',
      type: 'text',
      required: true,
      label: 'Nazwa',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link',
    },
    {
      name: 'kategoria',
      type: 'select',
      label: 'Kategoria',
      defaultValue: 'partner',
      options: [
        { label: 'Sponsor tytularny', value: 'tytularny' },
        { label: 'Sponsor główny', value: 'glowny' },
        { label: 'Partner', value: 'partner' },
        { label: 'Partner techniczny', value: 'techniczny' },
        { label: 'Patronat honorowy', value: 'patronat_honorowy' },
        { label: 'Patronat medialny', value: 'patronat_medialny' },
        { label: 'Gospodarz / Partner regat', value: 'gospodarz' },
      ],
    },
    {
      name: 'kolejnosc',
      type: 'number',
      label: 'Kolejność',
      defaultValue: 0,
    },
  ],
}
