import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import HeaderBar from './HeaderBar'

export async function Header() {
  let pokazPrzycisk = true
  try {
    const payload = await getPayload({ config: configPromise })
    const s: any = await payload.findGlobal({ slug: 'strefa-kibica' })
    pokazPrzycisk = s?.pokazPrzycisk !== false
  } catch {
    /* brak ustawień — przycisk domyślnie widoczny */
  }

  return <HeaderBar pokazPrzycisk={pokazPrzycisk} />
}
