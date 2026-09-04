// Pobieranie najnowszego posta z Facebooka i Instagrama przez Meta Graph API.
// Tokeny i identyfikatory ustawia redaktor w panelu (globalny obiekt „Strona główna”).
// Bez tokenów funkcje zwracają null — sekcja aktualności pokaże wtedy tylko baner.

export type SocialPost = {
  siec: 'facebook' | 'instagram'
  tekst: string
  obraz: string
  link: string
  data: string
}

const GRAPH = 'https://graph.facebook.com/v21.0'

// Odświeżanie co 10 minut (Next.js data cache).
const REVALIDATE = 600

export async function getLatestFacebookPost(
  pageId?: string | null,
  token?: string | null,
): Promise<SocialPost | null> {
  if (!pageId || !token) return null
  const url = `${GRAPH}/${encodeURIComponent(pageId)}/posts?fields=message,permalink_url,full_picture,created_time&limit=1&access_token=${encodeURIComponent(token)}`
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } })
    if (!res.ok) return null
    const json: any = await res.json()
    const p = json?.data?.[0]
    if (!p) return null
    return {
      siec: 'facebook',
      tekst: p.message || '',
      obraz: p.full_picture || '',
      link: p.permalink_url || '',
      data: p.created_time || '',
    }
  } catch {
    return null
  }
}

export async function getLatestInstagramMedia(
  userId?: string | null,
  token?: string | null,
): Promise<SocialPost | null> {
  if (!userId || !token) return null
  const url = `${GRAPH}/${encodeURIComponent(userId)}/media?fields=caption,permalink,media_url,thumbnail_url,media_type,timestamp&limit=1&access_token=${encodeURIComponent(token)}`
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } })
    if (!res.ok) return null
    const json: any = await res.json()
    const p = json?.data?.[0]
    if (!p) return null
    const obraz = p.media_type === 'VIDEO' ? p.thumbnail_url || '' : p.media_url || ''
    return {
      siec: 'instagram',
      tekst: p.caption || '',
      obraz: obraz || '',
      link: p.permalink || '',
      data: p.timestamp || '',
    }
  } catch {
    return null
  }
}
