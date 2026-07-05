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
      name: 'idZestawienia',
      type: 'number',
      label: 'ID zestawienia (powiązanie z wynikami liga_)',
      admin: {
        description: 'Łącznik do bazy wyników (liga_ZestawienieKlubow).',
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
