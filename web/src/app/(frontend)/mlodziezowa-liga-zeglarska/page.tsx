import React from 'react'
import LigaLanding from '@/components/site/LigaLanding'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Młodzieżowa Liga Żeglarska — Polska Liga Żeglarska' }

export default function MlodziezowaPage() {
  return <LigaLanding poziom={/m[łl]odzie/i} tytul="Młodzieżowa Liga Żeglarska" />
}
