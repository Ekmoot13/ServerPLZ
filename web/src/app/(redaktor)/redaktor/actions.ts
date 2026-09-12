'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/redaktorAuth'

function toId(v: string): number | string {
  const n = Number(v)
  return Number.isFinite(n) && String(n) === v ? n : v
}

async function uploadIfPresent(
  payload: any,
  formData: FormData,
  field: string,
): Promise<number | string | undefined> {
  const file = formData.get(field)
  if (!file || typeof file === 'string') return undefined
  const f = file as File
  if (!f.size) return undefined
  const buf = Buffer.from(await f.arrayBuffer())
  const media = await payload.create({
    collection: 'media',
    data: { alt: f.name || 'zdjęcie' },
    file: {
      data: buf,
      mimetype: f.type || 'image/jpeg',
      name: f.name || `upload-${Date.now()}.jpg`,
      size: f.size,
    },
    overrideAccess: true,
  })
  return media.id
}

export async function updateZawodnik(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })
  const id = String(formData.get('id'))

  const klub = String(formData.get('klub') || '')
  const startyRaw = String(formData.get('dodatkoweStarty') || '')

  const data: any = {
    imie: String(formData.get('imie') || ''),
    nazwisko: String(formData.get('nazwisko') || ''),
    aktywny: formData.get('aktywny') === 'on',
    klub: klub ? toId(klub) : null,
  }
  if (startyRaw) {
    try {
      data.dodatkoweStarty = JSON.parse(startyRaw)
    } catch {
      /* pomiń błędny JSON */
    }
  }
  const zdjecie = await uploadIfPresent(payload, formData, 'zdjecie')
  if (zdjecie !== undefined) data.zdjecie = zdjecie

  await payload.update({ collection: 'zawodnicy', id, data, overrideAccess: true })
  revalidatePath('/zawodnicy')
  redirect(`/redaktor/zawodnicy/${id}?ok=1`)
}

export async function updateKlub(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })
  const id = String(formData.get('id'))

  const zalogaRaw = String(formData.get('zaloga') || '')
  let zaloga: (number | string)[] = []
  if (zalogaRaw) {
    try {
      zaloga = (JSON.parse(zalogaRaw) as any[]).map((x) => toId(String(x)))
    } catch {
      zaloga = []
    }
  }

  const idZestawieniaRaw = String(formData.get('idZestawienia') || '').trim()
  const tryb = String(formData.get('trybPowiazania') || 'zestawienie')
  const parseIds = (key: string): number[] => {
    try {
      const arr = JSON.parse(String(formData.get(key) || '[]')) as unknown[]
      return Array.isArray(arr) ? arr.map(Number).filter((n) => Number.isFinite(n)) : []
    } catch {
      return []
    }
  }

  // Uwaga: poziomLigi NIE jest tu zapisywane — wynika z przypisań w „Kluby w sezonie".
  const data: any = {
    nazwa: String(formData.get('nazwa') || ''),
    aktywny: formData.get('aktywny') === 'on',
    idZestawienia: idZestawieniaRaw && /^\d+$/.test(idZestawieniaRaw) ? Number(idZestawieniaRaw) : null,
    trybPowiazania: tryb === 'warianty' ? 'warianty' : 'zestawienie',
    wykluczoneWarianty: parseIds('wykluczoneWarianty'),
    warianty: parseIds('warianty'),
    www: String(formData.get('www') || ''),
    facebook: String(formData.get('facebook') || ''),
    instagram: String(formData.get('instagram') || ''),
    youtube: String(formData.get('youtube') || ''),
    zaloga,
  }
  const logo = await uploadIfPresent(payload, formData, 'logo')
  if (logo !== undefined) data.logo = logo

  await payload.update({ collection: 'kluby', id, data, overrideAccess: true })
  revalidatePath('/kluby')
  redirect(`/redaktor/kluby/${id}?ok=1`)
}

// ============================ KLUBY W SEZONIE ============================

// Kolejność „ważności" poziomów — do wyliczenia pola „Poziom ligi".
const POZIOM_RANGA: Record<string, number> = {
  Ekstraklasa: 0,
  '1 Liga': 1,
  '2 Liga': 2,
  Youth: 3,
  Młodzieżowa: 3,
}
const POZIOM_ETYKIETA = (p: string): string => (p === 'Youth' ? 'Młodzieżowa' : p)

/**
 * Zapisuje mapowanie „zespół sezonu (poziom + wariant) → klub panelu".
 * Dostaje komplet zespołów z edytowanych poziomów, więc przypisania dla tych
 * poziomów są nadpisywane w całości; przypisania z innych poziomów zostają.
 */
export async function zapiszPrzypisaniaSezonu(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })

  type Wiersz = { poziom: string; wariant: number; klubId: string | null }
  let wiersze: Wiersz[] = []
  let poziomy: string[] = []
  try {
    wiersze = JSON.parse(String(formData.get('przypisania') || '[]'))
    poziomy = JSON.parse(String(formData.get('poziomy') || '[]'))
  } catch {
    wiersze = []
  }
  const edytowane = new Set(poziomy)

  // Docelowy stan: klub → lista { poziom, wariant }
  const docelowe = new Map<string, { poziom: string; wariant: number }[]>()
  for (const w of wiersze) {
    if (!w?.klubId || !w.poziom || !Number.isFinite(Number(w.wariant))) continue
    if (!docelowe.has(w.klubId)) docelowe.set(w.klubId, [])
    docelowe.get(w.klubId)!.push({ poziom: w.poziom, wariant: Number(w.wariant) })
  }

  const res = await payload.find({
    collection: 'kluby',
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  for (const d of res.docs as any[]) {
    const id = String(d.id)
    const stare: { poziom: string; wariant: number }[] = Array.isArray(d.sezonPrzypisania)
      ? d.sezonPrzypisania
          .map((x: any) => ({ poziom: String(x?.poziom || ''), wariant: Number(x?.wariant) }))
          .filter((x: any) => x.poziom && Number.isFinite(x.wariant))
      : []

    // Zachowujemy przypisania z poziomów, których ten formularz nie dotyczył.
    const zachowane = stare.filter((s) => !edytowane.has(s.poziom))
    const nowe = [...zachowane, ...(docelowe.get(id) || [])]

    const bezZmian =
      nowe.length === stare.length &&
      nowe.every((n) => stare.some((s) => s.poziom === n.poziom && s.wariant === n.wariant))
    if (bezZmian) continue

    const najwyzszy = [...nowe]
      .map((n) => n.poziom)
      .sort((a, b) => (POZIOM_RANGA[a] ?? 99) - (POZIOM_RANGA[b] ?? 99))[0]

    await payload.update({
      collection: 'kluby',
      id: d.id,
      data: {
        sezonPrzypisania: nowe,
        poziomLigi: najwyzszy ? POZIOM_ETYKIETA(najwyzszy) : null,
      } as any,
      overrideAccess: true,
    })
  }

  revalidatePath('/kluby')
  revalidatePath('/redaktor/kluby')
  redirect('/redaktor/kluby/sezon?ok=1')
}

// ============================ WPISY (NEWSY) ============================

function slugify(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function wpisData(formData: FormData): any {
  const title = String(formData.get('title') || '').trim()
  let slug = String(formData.get('slug') || '').trim()
  if (!slug) slug = slugify(title)
  const data: any = {
    title: title || 'Bez tytułu',
    slug: slug || undefined,
    trescHtml: String(formData.get('trescHtml') || ''),
    _status: formData.get('status') === 'published' ? 'published' : 'draft',
  }
  const publishedAt = String(formData.get('publishedAt') || '')
  if (publishedAt) {
    const d = new Date(publishedAt)
    if (!isNaN(d.getTime())) data.publishedAt = d.toISOString()
  }
  const cats = String(formData.get('categories') || '')
  if (cats) {
    try {
      data.categories = (JSON.parse(cats) as any[]).map((x) => toId(String(x)))
    } catch {
      /* pomiń */
    }
  }
  return data
}

export async function createWpis(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })
  const data = wpisData(formData)
  const hero = await uploadIfPresent(payload, formData, 'heroImage')
  if (hero !== undefined) data.heroImage = hero
  const doc = await payload.create({
    collection: 'posts',
    data,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  revalidatePath('/newsy')
  revalidatePath('/')
  redirect(`/redaktor/wpisy/${(doc as any).id}?ok=1`)
}

export async function updateWpis(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })
  const id = String(formData.get('id'))
  const data = wpisData(formData)
  const hero = await uploadIfPresent(payload, formData, 'heroImage')
  if (hero !== undefined) data.heroImage = hero
  await payload.update({
    collection: 'posts',
    id,
    data,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  revalidatePath('/newsy')
  revalidatePath('/')
  redirect(`/redaktor/wpisy/${id}?ok=1`)
}

export async function updateStrefaKibica(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })
  const data: any = {
    pokazPrzycisk: formData.get('pokazPrzycisk') === 'on',
    pokazMape: formData.get('pokazMape') === 'on',
    mapaUrl: String(formData.get('mapaUrl') || ''),
    sapBase: String(formData.get('sapBase') || ''),
    leaderboardName: String(formData.get('leaderboardName') || ''),
    pokazProgram: formData.get('pokazProgram') === 'on',
    programTytul: String(formData.get('programTytul') || ''),
    programWstep: String(formData.get('programWstep') || ''),
    linki: parseJson<any[]>(String(formData.get('linki') || ''), []),
    program: parseJson<any[]>(String(formData.get('program') || ''), []),
    mapaEmbed: String(formData.get('mapaEmbed') || ''),
  }
  await payload.updateGlobal({ slug: 'strefa-kibica', data, overrideAccess: true })
  revalidatePath('/')
  revalidatePath('/regatowastrefakibica')
  redirect('/redaktor/strefa-kibica?ok=1')
}

// ============================ KALENDARZ ============================

function terminData(formData: FormData): any {
  const data: any = {
    nazwa: String(formData.get('nazwa') || '').trim() || 'Regaty',
    poziom: String(formData.get('poziom') || '') || null,
    miejsce: String(formData.get('miejsce') || ''),
    link: String(formData.get('link') || ''),
    autoStatus: formData.get('autoStatus') === 'on',
    statusReczny: String(formData.get('statusReczny') || 'zaplanowane'),
  }
  const dOd = String(formData.get('dataOd') || '')
  data.dataOd = dOd ? new Date(dOd).toISOString() : new Date().toISOString()
  const dDo = String(formData.get('dataDo') || '')
  data.dataDo = dDo ? new Date(dDo).toISOString() : null
  const kol = String(formData.get('kolejnosc') || '')
  data.kolejnosc = kol ? Number(kol) : null
  return data
}

export async function createTermin(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })
  const doc = await payload.create({
    collection: 'kalendarz' as any,
    data: terminData(formData),
    overrideAccess: true,
  })
  revalidatePath('/kalendarz')
  redirect(`/redaktor/kalendarz/${(doc as any).id}?ok=1`)
}

export async function updateTermin(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })
  const id = String(formData.get('id'))
  await payload.update({
    collection: 'kalendarz' as any,
    id,
    data: terminData(formData),
    overrideAccess: true,
  })
  revalidatePath('/kalendarz')
  redirect(`/redaktor/kalendarz/${id}?ok=1`)
}

export async function deleteTermin(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })
  const id = String(formData.get('id'))
  await payload.delete({ collection: 'kalendarz' as any, id, overrideAccess: true })
  revalidatePath('/kalendarz')
  redirect('/redaktor/kalendarz')
}

// Zapis kolejności poziomów kalendarza (globalny obiekt kalendarz-ustawienia).
export async function updatePoziomyKalendarza(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })
  const raw = String(formData.get('poziomy') || '')
  let lista: string[] = []
  try {
    lista = (JSON.parse(raw) as any[]).map((x) => String(x || '').trim()).filter(Boolean)
  } catch {
    lista = []
  }
  // usuń duplikaty, zachowując kolejność
  const seen = new Set<string>()
  const poziomy = lista
    .filter((p) => (seen.has(p) ? false : (seen.add(p), true)))
    .map((nazwa) => ({ nazwa }))

  await payload.updateGlobal({
    slug: 'kalendarz-ustawienia' as any,
    data: { poziomy } as any,
    overrideAccess: true,
  })
  revalidatePath('/kalendarz')
  redirect('/redaktor/kalendarz?ok=1')
}

// ============================ STRONA GŁÓWNA ============================

function parseJson<T>(raw: string, fallback: T): T {
  try {
    const v = JSON.parse(raw)
    return v ?? fallback
  } catch {
    return fallback
  }
}

export async function updateStronaGlowna(formData: FormData) {
  await requireUser()
  const payload = await getPayload({ config })
  const g = (k: string) => String(formData.get(k) || '')

  // Zapisujemy tylko żywe sekcje (reszta strony bierze dane automatycznie).
  const data: any = {
    wprowadzenie: {
      tytul: g('wTytul'),
      tekst: g('wTekst'),
      poziomyObraz: g('poziomyObraz'),
    },
    sponsorzy: {
      tytul: g('spTytul'),
      grupy: parseJson<any[]>(g('spGrupy'), []),
    },
  }

  await payload.updateGlobal({ slug: 'strona-glowna' as any, data, overrideAccess: true })
  revalidatePath('/')
  redirect('/redaktor/strona-glowna?ok=1')
}

// Upload obrazka z edytora treści — zwraca URL do wstawienia.
export async function uploadMedia(formData: FormData): Promise<{ url?: string }> {
  await requireUser()
  const payload = await getPayload({ config })
  const file = formData.get('file')
  if (!file || typeof file === 'string') return {}
  const f = file as File
  if (!f.size) return {}
  const buf = Buffer.from(await f.arrayBuffer())
  const media = await payload.create({
    collection: 'media',
    data: { alt: f.name || 'zdjęcie' },
    file: {
      data: buf,
      mimetype: f.type || 'image/jpeg',
      name: f.name || `upload-${Date.now()}.jpg`,
      size: f.size,
    },
    overrideAccess: true,
  })
  return { url: (media as any).url }
}
