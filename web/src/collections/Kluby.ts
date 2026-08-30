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
