import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import KlubForm, { KlubInitial, LigaKlub, LigaWariant } from '../KlubForm'
import { getKluby, getWariantyKlubow } from '@/lib/liga'

export const dynamic = 'force-dynamic'

function numbers(v: unknown): number[] {
  return Array.isArray(v) ? v.map(Number).filter((n) => Number.isFinite(n)) : []
}

// Poziomy ligi wynikają z przypisań sezonu — pokazujemy je tylko do odczytu.
function poziomyZPrzypisan(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  const etykieta = (p: string) => (p === 'Youth' ? 'Młodzieżowa' : p)
  const kolejnosc: Record<string, number> = {
    Ekstraklasa: 0,
    '1 Liga': 1,
    '2 Liga': 2,
    Młodzieżowa: 3,
  }
  const zbior = new Set<string>()
  for (const x of v as any[]) {
    if (x?.poziom) zbior.add(etykieta(String(x.poziom)))
  }
  return [...zbior].sort((a, b) => (kolejnosc[a] ?? 99) - (kolejnosc[b] ?? 99))
}

export default async function EditKlubPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ok?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const payload = await getPayload({ config })

  let doc: any = null
  try {
    doc = await payload.findByID({ collection: 'kluby', id, depth: 1 })
  } catch {
    doc = null
  }
  if (!doc) notFound()

  const zawRes = await payload.find({
    collection: 'zawodnicy',
    limit: 0,
    pagination: false,
    depth: 0,
    sort: 'nazwisko',
  })
  const zawodnicy = (zawRes.docs as any[]).map((z) => ({
    id: String(z.id),
    name: `${z.imie || ''} ${z.nazwisko || ''}`.trim(),
  }))

  const logoUrl = doc.logo && typeof doc.logo === 'object' ? doc.logo.url : undefined
  const zaloga: string[] = Array.isArray(doc.zaloga)
    ? doc.zaloga.map((z: any) => String(typeof z === 'object' ? z.id : z))
    : []

  const initial: KlubInitial = {
    nazwa: doc.nazwa || '',
    aktywny: !!doc.aktywny,
    poziomLigi: doc.poziomLigi || '',
    logoUrl,
    www: doc.www || '',
    facebook: doc.facebook || '',
    instagram: doc.instagram || '',
    youtube: doc.youtube || '',
    zaloga,
    poziomy: poziomyZPrzypisan(doc.sezonPrzypisania),
    idZestawienia: typeof doc.idZestawienia === 'number' ? doc.idZestawienia : null,
    trybPowiazania: doc.trybPowiazania === 'warianty' ? 'warianty' : 'zestawienie',
    wykluczoneWarianty: numbers(doc.wykluczoneWarianty),
    warianty: numbers(doc.warianty),
  }

  let ligaKluby: LigaKlub[] = []
  let ligaWarianty: LigaWariant[] = []
  try {
    const [kluby, warianty] = await Promise.all([getKluby(), getWariantyKlubow()])
    ligaKluby = kluby.map((k) => ({ id: k.id, nazwa: k.nazwa }))
    ligaWarianty = warianty
  } catch {
    // Baza wyników niedostępna — formularz działa bez podpowiedzi.
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edytuj klub: {initial.nazwa}</h1>
      <KlubForm
        id={String(doc.id)}
        initial={initial}
        zawodnicy={zawodnicy}
        ligaKluby={ligaKluby}
        ligaWarianty={ligaWarianty}
        ok={sp?.ok === '1'}
      />
    </div>
  )
}
