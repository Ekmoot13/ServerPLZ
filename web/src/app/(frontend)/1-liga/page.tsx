import React from 'react'
import LigaLanding from '@/components/site/LigaLanding'

export const dynamic = 'force-dynamic'
export const metadata = { title: '1 Liga — Polska Liga Żeglarska' }

const REGULAMIN = 'https://ligazeglarska.pl/wp-content/uploads/2026/02/Regulamin-Ekstraklasa-PLZ2026.pdf'

export default function JedynkaLigaPage() {
  return <LigaLanding poziom={/^\s*(1|i)\s*liga\s*$/i} tytul="1 Liga" regulamin={REGULAMIN} />
}
