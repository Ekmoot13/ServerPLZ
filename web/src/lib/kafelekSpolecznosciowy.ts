/**
 * Pobieranie postu do dużego kafelka aktualności na stronie głównej.
 *
 * Co która platforma potrafi:
 * - YouTube   — najnowszy film z kanału/playlisty przez publiczny kanał RSS (bez klucza API),
 *               albo pojedynczy film przez oEmbed.
 * - TikTok    — wyłącznie pojedynczy film przez oEmbed. „Najnowszy z konta" wymagałby
 *               zatwierdzonej aplikacji TikTok Display API, której nie mamy.
 * - Instagram — najnowszy post przez Graph API (konto Business/Creator + długożyciowy token).
 * - Facebook  — najnowszy post strony przez Graph API (token strony).
 *
 * Meta wycofała publiczny oEmbed, więc dla Instagrama i Facebooka bez tokenu
 * zostaje uzupełnienie obrazka i opisu ręcznie w panelu.
 *
 * Każda funkcja zwraca null zamiast rzucać — strona główna nie może się wywalić
 * przez cudze API. Odpowiedzi cache'ujemy na 10 minut.
 */

export type Platforma = 'youtube' | 'instagram' | 'facebook' | 'tiktok'

export type KafelekPost = {
  platforma: Platforma
  link: string
  obraz: string
  opis: string
  kanal: string
}

const CACHE = { next: { revalidate: 600 } } as const

async function json(url: string): Promise<any | null> {
  try {
    const r = await fetch(url, CACHE)
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}

async function tekst(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, CACHE)
    if (!r.ok) return null
    return await r.text()
  } catch {
    return null
  }
}

function wyciagnij(xml: string, tag: string): string {
  // [^] to "dowolny znak, wraz z nową linią" — w odróżnieniu od [\s\S] nie
  // wymaga ukośników, które literał szablonowy i tak by zjadł.
  const m = xml.match(new RegExp(`<${tag}[^>]*>([^]*?)</${tag}>`))
  return m ? m[1].trim() : ''
}

function odkoduj(s: string): string {
  return (
    s
      // encje liczbowe — Instagram koduje tak polskie znaki i emoji
      .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // &amp; na końcu, żeby nie rozkodować dwa razy
      .replace(/&amp;/g, '&')
  )
}

/** Wartość <meta property="og:..."> ze strony. */
function og(html: string, nazwa: string): string {
  const wzory = [
    new RegExp(`<meta[^>]+property=["']og:${nazwa}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:${nazwa}["']`, 'i'),
  ]
  for (const w of wzory) {
    const m = html.match(w)
    if (m) return odkoduj(m[1])
  }
  return ''
}

/**
 * Instagram i Facebook nie mają już publicznego oEmbed, ale nadal serwują
 * znaczniki Open Graph — to samo, z czego korzysta podgląd linku w komunikatorach.
 * Dzięki temu redaktor wkleja sam link, bez tokenu i bez ręcznego obrazka.
 *
 * Adresy zdjęć z CDN-u Mety wygasają, więc pobieramy je przy renderze (cache 10 min),
 * zamiast zapisywać na stałe w bazie.
 */
export async function zLinkuOpenGraph(url: string, platforma: Platforma): Promise<KafelekPost | null> {
  const czysty = url.trim()
  if (!czysty) return null

  let html: string | null = null
  try {
    const r = await fetch(czysty, {
      ...CACHE,
      // bez nagłówka robota Instagram odsyła ekran logowania zamiast metadanych
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; facebookexternalhit/1.1)' },
    })
    if (r.ok) html = await r.text()
  } catch {
    return null
  }
  if (!html) return null

  const obraz = og(html, 'image')
  if (!obraz) return null

  const tytul = og(html, 'title')
  // og:title ma postać: „Nazwa konta on Instagram: <opis>"
  const m = tytul.match(/^(.*?)\s+on\s+(?:Instagram|Facebook)\s*:\s*([\s\S]*)$/i)
  const kanal = m ? m[1].trim() : og(html, 'site_name')
  const opisSurowy = m ? m[2] : og(html, 'description')

  return {
    platforma,
    link: czysty,
    obraz,
    opis: opisSurowy.replace(/^["„]|["”]$/g, '').trim(),
    kanal,
  }
}

/** Najnowszy film z kanału (UC…) lub playlisty (PL…/UU…) przez RSS. */
export async function youtubeZKanalu(id: string): Promise<KafelekPost | null> {
  const czysty = id.trim()
  if (!czysty) return null
  const param = czysty.startsWith('UC') ? 'channel_id' : 'playlist_id'
  const xml = await tekst(`https://www.youtube.com/feeds/videos.xml?${param}=${encodeURIComponent(czysty)}`)
  if (!xml) return null

  // Feed kanału jest posortowany od najnowszego, ale feed playlisty idzie
  // w kolejności playlisty — dlatego wybieramy wpis o najpóźniejszej dacie.
  const wpisy = xml.split('<entry>').slice(1)
  if (!wpisy.length) return null

  let entry = ''
  let najnowsza = -Infinity
  for (const w of wpisy) {
    const tresc = w.slice(0, w.indexOf('</entry>'))
    const data = Date.parse(wyciagnij(tresc, 'published'))
    if (Number.isFinite(data) && data > najnowsza) {
      najnowsza = data
      entry = tresc
    }
  }
  if (!entry) return null

  const videoId = wyciagnij(entry, 'yt:videoId')
  if (!videoId) return null

  return {
    platforma: 'youtube',
    link: `https://www.youtube.com/watch?v=${videoId}`,
    obraz: await miniaturkaYoutube(videoId),
    opis: odkoduj(wyciagnij(entry, 'title')),
    // nazwa kanału siedzi w <author><name>, a przy playliście w <title> kanału
    kanal: odkoduj(wyciagnij(entry.slice(entry.indexOf('<author>')), 'name')) || odkoduj(wyciagnij(xml, 'title')),
  }
}

/**
 * maxresdefault istnieje tylko dla części filmów (m.in. nie dla starszych
 * i niektórych Shorts) — pusty obrazek zepsułby cały kafelek, więc sprawdzamy
 * i schodzimy do hqdefault, które YouTube generuje zawsze.
 */
async function miniaturkaYoutube(videoId: string): Promise<string> {
  const max = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
  try {
    const r = await fetch(max, { method: 'HEAD', ...CACHE })
    if (r.ok) return max
  } catch {
    /* schodzimy niżej */
  }
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

/** Pojedynczy film YouTube albo TikTok przez oEmbed (bez żadnych kluczy). */
export async function zLinkuOembed(url: string, platforma: Platforma): Promise<KafelekPost | null> {
  const czysty = url.trim()
  if (!czysty) return null

  const endpoint =
    platforma === 'tiktok'
      ? `https://www.tiktok.com/oembed?url=${encodeURIComponent(czysty)}`
      : `https://www.youtube.com/oembed?url=${encodeURIComponent(czysty)}&format=json`

  const d = await json(endpoint)
  if (!d) return null

  return {
    platforma,
    link: czysty,
    obraz: d.thumbnail_url || '',
    opis: d.title || '',
    kanal: d.author_name || '',
  }
}

/** Najnowszy post z Instagrama (Graph API, konto Business/Creator). */
export async function instagramNajnowszy(userId: string, token: string): Promise<KafelekPost | null> {
  if (!token?.trim()) return null
  const id = userId?.trim() || 'me'
  const t = encodeURIComponent(token.trim())
  const pola = 'caption,media_type,media_url,thumbnail_url,permalink,username'

  // Meta ma dwie rownolegle sciezki i to, ktora zadziala, zalezy od sposobu
  // uwierzytelnienia: Instagram Login -> graph.instagram.com/me/media,
  // Facebook Login (konto IG spiete ze strona) -> graph.facebook.com/{id}/media.
  // Probujemy po kolei, zeby nie zalezec od tego, ktora droge wybral redaktor.
  const adresy = [
    `https://graph.instagram.com/${encodeURIComponent(id)}/media?fields=${pola}&limit=1&access_token=${t}`,
    `https://graph.facebook.com/v21.0/${encodeURIComponent(id)}/media?fields=${pola}&limit=1&access_token=${t}`,
  ]

  let post: any = null
  for (const adres of adresy) {
    const d = await json(adres)
    post = d?.data?.[0]
    if (post) break
  }
  if (!post) return null

  return {
    platforma: 'instagram',
    link: post.permalink || '',
    // filmy oddają miniaturkę w osobnym polu
    obraz: post.media_type === 'VIDEO' ? post.thumbnail_url || '' : post.media_url || '',
    opis: post.caption || '',
    kanal: post.username ? `@${post.username}` : '',
  }
}

/** Najnowszy post ze strony na Facebooku (Graph API, token strony). */
export async function facebookNajnowszy(pageId: string, token: string): Promise<KafelekPost | null> {
  if (!pageId?.trim() || !token?.trim()) return null
  const pola = 'message,full_picture,permalink_url'
  const d = await json(
    `https://graph.facebook.com/v21.0/${encodeURIComponent(pageId.trim())}/posts?fields=${pola}&limit=1&access_token=${encodeURIComponent(token.trim())}`,
  )
  const post = d?.data?.[0]
  if (!post) return null

  return {
    platforma: 'facebook',
    link: post.permalink_url || '',
    obraz: post.full_picture || '',
    opis: post.message || '',
    kanal: '',
  }
}

/** Czy podmiana jest aktywna — pusta data znaczy „bezterminowo". */
export function podmianaAktywna(sg: any, teraz: Date = new Date()): boolean {
  const k = sg?.kafelekGlowny
  if (!k || k.tryb !== 'platforma') return false
  if (!k.wygasa) return true
  const do_ = new Date(k.wygasa)
  if (Number.isNaN(do_.getTime())) return true
  return do_.getTime() > teraz.getTime()
}

/**
 * Zwraca post do dużego kafelka albo null, gdy podmiana jest wyłączona,
 * wygasła lub platforma nic nie oddała (wtedy strona pokazuje zwykły news).
 */
export async function pobierzKafelek(sg: any): Promise<KafelekPost | null> {
  if (!podmianaAktywna(sg)) return null

  const k = sg.kafelekGlowny
  const platforma: Platforma = k.platforma || 'youtube'
  const A = sg?.aktualnosci || {}

  let post: KafelekPost | null = null

  if (k.zrodlo === 'link') {
    // YouTube i TikTok mają oEmbed; Instagram i Facebook oddają Open Graph
    post =
      platforma === 'youtube' || platforma === 'tiktok'
        ? await zLinkuOembed(k.postUrl || '', platforma)
        : await zLinkuOpenGraph(k.postUrl || '', platforma)
    // gdyby oEmbed zawiódł, Open Graph bywa drugą szansą
    if (!post) post = await zLinkuOpenGraph(k.postUrl || '', platforma)
    if (!post && k.postUrl) {
      post = { platforma, link: k.postUrl, obraz: '', opis: '', kanal: '' }
    }
  } else if (platforma === 'youtube') {
    post = await youtubeZKanalu(k.kanalId || '')
  } else if (platforma === 'instagram') {
    post = await instagramNajnowszy(A.igUserId || '', A.igToken || '')
  } else if (platforma === 'facebook') {
    post = await facebookNajnowszy(A.fbPageId || '', A.fbToken || '')
  } else if (platforma === 'tiktok') {
    // brak API do „najnowszego z konta" — jedyne wyjście to wklejony link
    post = await zLinkuOembed(k.postUrl || '', 'tiktok')
  }

  if (!post) return null

  // ręczne uzupełnienia mają pierwszeństwo — służą do łatania braków
  const obraz = k.recznyObraz?.trim() || post.obraz
  const opis = k.recznyOpis?.trim() || post.opis
  const kanal = k.recznaNazwa?.trim() || post.kanal

  // bez obrazka i bez linku kafelek nie ma sensu
  if (!post.link || !obraz) return null

  return { ...post, obraz, opis, kanal }
}
