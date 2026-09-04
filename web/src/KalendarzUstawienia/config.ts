import type { GlobalConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

// Kolejność wyświetlania poziomów (lig) na stronie /kalendarz.
// Kolejność elementów w tablicy = kolejność sekcji na stronie.
export const KalendarzUstawienia: GlobalConfig = {
  slug: 'kalendarz-ustawienia',
  label: 'Kalendarz — kolejność poziomów',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'poziomy',
      type: 'array',
      label: 'Kolejność poziomów (lig)',
      labels: { singular: 'Poziom', plural: 'Poziomy' },
      admin: {
        description:
          'Ustaw kolejność, w jakiej poziomy (ligi) mają się wyświetlać na stronie kalendarza. Poziomy spoza listy trafią na koniec.',
      },
      fields: [{ name: 'nazwa', type: 'text', required: true, label: 'Nazwa poziomu' }],
    },
  ],
}
