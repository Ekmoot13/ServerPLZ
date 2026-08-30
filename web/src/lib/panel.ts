// Warstwa redaktorska (Payload) nad danymi z bazy wyników (liga_*).
// Pozwala nadpisać zdjęcia, nazwy, klub, załogę i dodać ręczne starty.
// Wszystko defensywnie — gdy panel pusty/niedostępny, zwracamy null/[] i strona działa na danych liga_.
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { klubSlug, zawodnikSlug } from './liga'

function mediaUrl(m: unknown): string | undefined {
  const o = m as any
  if (o && typeof o === 'object' && o.url && String(o.mimeType || '').startsWith('image')) return o.url
  return undefined
}

export type ZawodnikPanel = {
  imie?: string
  nazwisko?: string
  zdjecieUrl?: string
  klub?: { nazwa: string; slug: string } | null
  dodatkoweStarty: { rok: number; regaty: string; miasto: string; klub: string; miejsce: number }[]
}

export async function getZawodnikPanel(idZawodnika: number): Promise<ZawodnikPanel | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'zawodnicy',
      where: { idZawodnika: { equals: idZawodnika } },
      limit: 1,
      depth: 2,
    })
    const d = res.docs?.[0] as any
    if (!d) return null
    const klubDoc = d.klub && typeof d.klub === 'object' ? d.klub : null
    return {
      imie: d.imie || undefined,
      nazwisko: d.nazwisko || undefined,
      zdjecieUrl: mediaUrl(d.zdjecie),
      klub: klubDoc ? { nazwa: klubDoc.nazwa || '', slug: klubSlug(klubDoc.nazwa) } : null,
      dodatkoweStarty: Array.isArray(d.dodatkoweStarty)
        ? d.dodatkoweStarty.map((s: any) => ({
            rok: Number(s.rok) || 0,
            regaty: s.regaty || '',
            miasto: s.miasto || '',
            klub: s.klub || '',
            miejsce: Number(s.miejsce) || 0,
          }))
        : [],
    }
  } catch {
    return null
  }
}

// Zdjęcia zawodników po idZawodnika (do kart/list).
export async function getZawodnicyPhotos(ids: number[]): Promise<Map<number, string>> {
  const map = new Map<number, string>()
  if (ids.length === 0) return map
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'zawodnicy',
      where: { idZawodnika: { in: ids } },
      limit: 0,
      pagination: false,
      depth: 1,
    })
    for (const d of res.docs as any[]) {
      const url = mediaUrl(d.zdjecie)
      if (d.idZawodnika != null && url) map.set(d.idZawodnika, url)
    }
  } catch {
    /* panel niedostępny — brak zdjęć */
  }
  return map
}

export type KlubPanel = {
  nazwa?: string
  logoUrl?: string
  poziomLigi?: string
  links: { label: string; href: string }[]
  zaloga: { id: number | null; imie: string; nazwisko: string; slug: string; zdjecieUrl?: string }[]
}

export async function getKlubPanel(idZestawienia: number): Promise<KlubPanel | null> {
  try {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'kluby',
      where: { idZestawienia: { equals: idZestawienia } },
      limit: 1,
      depth: 2,
    })
    const d = res.docs?.[0] as any
    if (!d) return null
    const links: { label: string; href: string }[] = []
    if (d.www) links.push({ label: 'WWW', href: d.www })
    if (d.facebook) links.push({ label: 'Facebook', href: d.facebook })
    if (d.instagram) links.push({ label: 'Instagram', href: d.instagram })
    if (d.youtube) links.push({ label: 'YouTube', href: d.youtube })
    const zaloga = Array.isArray(d.zaloga)
      ? (d.zaloga as any[])
          .filter((z) => z && typeof z === 'object')
          .map((z) => ({
            id: z.idZawodnika ?? null,
            imie: z.imie || '',
            nazwisko: z.nazwisko || '',
            slug: zawodnikSlug(z.nazwisko, z.imie),
            zdjecieUrl: mediaUrl(z.zdjecie),
          }))
      : []
    return {
      nazwa: d.nazwa || undefined,
      logoUrl: mediaUrl(d.logo),
      poziomLigi: d.poziomLigi || undefined,
      links,
      zaloga,
    }
  } catch {
    return null
  }
}
