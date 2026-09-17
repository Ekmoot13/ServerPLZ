import React from 'react'
import LigaLanding from '@/components/site/LigaLanding'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Ekstraklasa — Polska Liga Żeglarska' }

const REGULAMIN = '/kluby/2026/02/Regulamin-Ekstraklasa-PLZ2026.pdf'

export default function EkstraklasaPage() {
  return <LigaLanding poziom={/ekstraklasa/i} tytul="Ekstraklasa" regulamin={REGULAMIN} />
}
