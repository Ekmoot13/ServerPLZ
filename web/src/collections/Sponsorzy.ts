import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const KATEGORIE_SPONSOROW = [
  { label: 'Sponsorzy Główni', value: 'glowny' },
  { label: 'Oficjalny Partner Odzieżowy', value: 'odziezowy' },
  { label: 'Gospodarze i Partnerzy Regat', value: 'gospodarz' },
  { label: 'Partnerzy', value: 'partner' },
  { label: 'Partnerzy Techniczni', value: 'techniczny' },
  { label: 'Partner Wspierający', value: 'wspierajacy' },
  { label: 'Patronaty Honorowe', value: 'patronat_honorowy' },
  { label: 'Patronaty Medialne', value: 'patronat_medialny' },
  { label: 'Współpraca', value: 'wspolpraca' },
]

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
      required: true,
      defaultValue: 'partner',
      options: KATEGORIE_SPONSOROW,
    },
    {
      name: 'kolejnosc',
      type: 'number',
      label: 'Kolejność',
      defaultValue: 0,
    },
  ],
}
