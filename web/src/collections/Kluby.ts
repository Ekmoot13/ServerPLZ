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
    defaultColumns: ['nazwa', 'skrot', 'miasto', 'aktywny'],
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
      name: 'miasto',
      type: 'text',
      label: 'Miasto',
    },
    {
      name: 'rokZalozenia',
      type: 'number',
      label: 'Rok założenia',
    },
    {
      name: 'opis',
      type: 'textarea',
      label: 'Opis',
    },
    {
      name: 'strona',
      type: 'text',
      label: 'Strona WWW',
    },
    {
      name: 'aktywny',
      type: 'checkbox',
      label: 'Aktywny',
      defaultValue: true,
    },
  ],
}
