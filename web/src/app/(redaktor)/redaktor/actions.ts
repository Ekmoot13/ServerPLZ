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

  const data: any = {
    nazwa: String(formData.get('nazwa') || ''),
    aktywny: formData.get('aktywny') === 'on',
    poziomLigi: String(formData.get('poziomLigi') || '') || null,
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
  await payload.updateGlobal({
    slug: 'strefa-kibica',
    data: {
      pokazMape: formData.get('pokazMape') === 'on',
      mapaUrl: String(formData.get('mapaUrl') || ''),
      sapBase: String(formData.get('sapBase') || ''),
      leaderboardName: String(formData.get('leaderboardName') || ''),
    },
    overrideAccess: true,
  })
  revalidatePath('/')
  redirect('/redaktor/strefa-kibica?ok=1')
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
