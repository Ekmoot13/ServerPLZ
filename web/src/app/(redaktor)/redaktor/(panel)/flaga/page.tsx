import React from 'react'
import { aktywne } from '@/lib/kodyFlagi'
import { pobierzFlage } from '@/lib/flaga'
import { getPayload } from 'payload'
import config from '@payload-config'
import { przelaczFlage } from '../../actions'
import SiatkaFlag from '@/components/SiatkaFlag'
import KodyFlagi from './KodyFlagi'

export const dynamic = 'force-dynamic'

export default async function FlagaPage() {
  const payload = await getPayload({ config })
  const s: any = await payload.findGlobal({ slug: 'strefa-kibica' }).catch(() => ({}))
  const flaga = await pobierzFlage()

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-2xl font-bold">Flagi</h1>
      <p className="mb-5 text-sm text-slate-500">
        Sygnały komisji regatowej. Podniesiona flaga pojawia się banerem na górze Strefy Kibica.
        Przełączysz je tutaj albo z telefonu — aplikacja pod adresem /flaga otwiera się kodem
        z dołu tej strony.
      </p>

      <SiatkaFlag poczatkowa={flaga} przelacz={przelaczFlage} />
      <KodyFlagi poczatkowe={aktywne(s?.kodyFlagi)} />
    </div>
  )
}
