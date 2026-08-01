import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Transmisje: CollectionConfig = {
  slug: 'transmisje',
  labels: {
    singular: 'Transmisja',
    plural: 'Transmisje',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'tytul',
    defaultColumns: ['tytul', 'typ', 'aktywny'],
  },
  fields: [
    {
      name: 'tytul',
      type: 'text',
      required: true,
      label: 'Tytuł',
    },
    {
      name: 'typ',
      type: 'select',
      required: true,
      defaultValue: 'kamera',
      label: 'Typ',
      options: [
        { label: 'Kamera (RTMP/HLS)', value: 'kamera' },
        { label: 'YouTube', value: 'youtube' },
      ],
    },
    {
      name: 'rtmpKey',
      type: 'text',
      label: 'Klucz RTMP',
      defaultValue: () => Math.random().toString(36).slice(2, 12),
      admin: {
        description: 'Kamera nadaje na rtmp://SERWER:1935/live/<klucz>. Odtwarzanie: HLS z tego klucza.',
        condition: (data) => data?.typ === 'kamera',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'Link YouTube',
      admin: {
        condition: (data) => data?.typ === 'youtube',
      },
    },
    {
      name: 'opis',
      type: 'textarea',
      label: 'Opis',
    },
    {
      name: 'aktywny',
      type: 'checkbox',
      label: 'Aktywna (na żywo)',
      defaultValue: false,
    },
  ],
}
