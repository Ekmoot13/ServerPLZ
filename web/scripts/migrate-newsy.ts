/**
 * Import Newsów z WordPressa (REST API) do kolekcji Posts.
 * - tytuł, data, slug, zdjęcie główne, kategorie (z taksonomii WP)
 * - pełna treść: HTML -> Lexical (oficjalny convertHTMLToLexical), zdjęcia w treści wgrywane do Media
 *
 * Test na kilku:  docker compose -f docker-compose.prod.yml exec -e LIMIT=3 web npm run payload -- run scripts/migrate-newsy.ts
 * Pełny import:   docker compose -f docker-compose.prod.yml exec web npm run payload -- run scripts/migrate-newsy.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'

console.log('== START importu Newsów ==')

const WP = 'https://ligazeglarska.pl/wp-json/wp/v2'
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity

function decodeEntities(s: string): string {
  return (s || '')
    .replace(/&amp;/g, '&').replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '–').replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&hellip;/g, '…').replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ').trim()
}

const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: payload.config })

async function uploadFromUrl(url: string, alt: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) return null
  const buffer = Buffer.from(await res.arrayBuffer())
  const name = (url.split('/').pop() || 'image.jpg').split('?')[0]
  const media = await payload.create({
    collection: 'media',
    data: { alt: alt || name },
    file: {
      data: buffer,
      mimetype: res.headers.get('content-type') || 'image/jpeg',
      name,
      size: buffer.length,
    },
  })
  return media.id
}

async function htmlToLexical(html: string): Promise<any> {
  const dom = new JSDOM(html)
  const imgs = dom.window.document.querySelectorAll('img')
  for (const img of Array.from(imgs)) {
    const src = img.getAttribute('src')
    if (!src) { img.remove(); continue }
    try {
      const id = await uploadFromUrl(src, img.getAttribute('alt') || '')
      if (id) {
        img.setAttribute('data-lexical-upload-id', String(id))
        img.setAttribute('data-lexical-upload-relation-to', 'media')
        img.setAttribute('src', src)
      } else {
        img.remove()
      }
    } catch {
      img.remove()
    }
  }
  const updated = dom.window.document.body.innerHTML
  return convertHTMLToLexical({ editorConfig, html: updated, JSDOM })
}

const catCache = new Map<string, any>()
async function getCategory(name: string): Promise<any> {
  if (catCache.has(name)) return catCache.get(name)
  const found = await payload.find({ collection: 'categories', where: { title: { equals: name } }, limit: 1 })
  let id: any
  if (found.docs.length) id = found.docs[0].id
  else id = (await payload.create({ collection: 'categories', data: { title: name } })).id
  catCache.set(name, id)
  return id
}

let page = 1
let total = 0
let created = 0
let skipped = 0

outer: while (true) {
  const res = await fetch(`${WP}/posts?per_page=20&page=${page}&orderby=date&order=desc&_embed=wp:featuredmedia,wp:term`)
  if (res.status === 400) break
  if (!res.ok) throw new Error(`WP posts strona ${page}: HTTP ${res.status}`)
  const posts = (await res.json()) as any[]
  if (!Array.isArray(posts) || posts.length === 0) break

  for (const p of posts) {
    if (total >= LIMIT) break outer
    total++
    const title = decodeEntities(p?.title?.rendered || '')
    if (!title) continue

    const existing = await payload.find({ collection: 'posts', where: { title: { equals: title } }, limit: 1 })
    if (existing.docs.length) { skipped++; continue }

    const feat = p?._embedded?.['wp:featuredmedia']?.[0]?.source_url
    const heroId = feat ? await uploadFromUrl(feat, title).catch(() => null) : null

    const terms = (p?._embedded?.['wp:term'] || []).flat()
    const catNames = terms
      .filter((t: any) => t?.taxonomy === 'category' && t?.name && t.name !== 'Uncategorized')
      .map((t: any) => decodeEntities(t.name))
    const catIds: any[] = []
    for (const cn of catNames) catIds.push(await getCategory(cn))

    let content: any
    try {
      content = await htmlToLexical(p?.content?.rendered || '<p></p>')
    } catch (e) {
      console.warn(`  ! treść nieudana: ${(e as Error).message}`)
      content = await htmlToLexical('<p></p>')
    }

    await payload.create({
      collection: 'posts',
      data: {
        title,
        slug: p?.slug || undefined,
        content,
        heroImage: heroId || undefined,
        categories: catIds.length ? catIds : undefined,
        publishedAt: p?.date || undefined,
        _status: 'published',
      },
    })
    created++
    console.log(`+ ${title}${heroId ? ' [hero]' : ''} (${catNames.join(', ') || 'bez kategorii'})`)
  }

  const totalPages = Number(res.headers.get('x-wp-totalpages') || '1')
  if (page >= totalPages) break
  page++
}

console.log(`\nGotowe. Utworzono: ${created}, pominięto: ${skipped}, przetworzono: ${total}.`)
process.exit(0)
