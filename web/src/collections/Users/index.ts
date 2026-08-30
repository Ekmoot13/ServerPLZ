import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    // Do panelu administratora /admin wchodzą tylko NIE-redaktorzy (admini).
    // Redaktorzy pracują wyłącznie w osobnym panelu /redaktor.
    admin: ({ req: { user } }) => Boolean(user) && (user as any)?.rola !== 'redaktor',
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'rola'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'rola',
      type: 'select',
      label: 'Rola',
      defaultValue: 'redaktor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Redaktor', value: 'redaktor' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Redaktor korzysta tylko z panelu /redaktor. Administrator ma dostęp do /admin.',
      },
    },
  ],
  timestamps: true,
}
