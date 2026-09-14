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
function findRichText(fields: any[], name: string): any {
  for (const f of fields || []) {
    if (f?.name === name && f?.type === 'richText') return f
    if (f?.fields) { const r = findRichText(f.fields, name); if (r) return r }
    if (f?.tabs) { for (const t of f.tabs) { const r = findRichText(t.fields, name); if (r) return r } }
  }
  return null
}
const postsColl: any = payload.config.collections.find((c: any) => c.slug === 'posts')
const contentField = findRichText(postsColl.fields, 'content')
const editorConfig = await editorConfigFactory.fromField({ field: contentField })

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
  // Lexical dostaje treść bez obrazków i osadzeń — węzły upload nie przechodzą
  // walidacji relacji, a pełny HTML (z grafikami) i tak trafia do `trescHtml`,
  // które renderuje strona artykułu. Tak samo robi import z plików XML.
  const dom = new JSDOM(html)
  dom.window.document.querySelectorAll('img, iframe, script, style').forEach((el) => el.remove())
  return convertHTMLToLexical({ editorConfig, html: dom.window.document.body.innerHTML, JSDOM })
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
let failed = 0

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

    const rawHtml: string = p?.content?.rendered || ''

    const existing = await payload.find({ collection: 'posts', where: { title: { equals: title } }, limit: 1 })
    if (existing.docs.length) {
      // Wpis już jest, ale mógł powstać bez treści HTML — uzupełniamy, bo to jej
      // używa strona artykułu (obrazki w treści).
      const doc: any = existing.docs[0]
      if (!doc.trescHtml && rawHtml) {
        try {
          await payload.update({
            collection: 'posts',
            id: doc.id,
            context: { disableRevalidate: true },
            data: { trescHtml: rawHtml },
          })
          console.log(`~ uzupełniono treść HTML: ${title}`)
        } catch {
          /* pomiń */
        }
      }
      skipped++
      continue
    }

    const feat = p?._embedded?.['wp:featuredmedia']?.[0]?.source_url
    const heroId = feat ? await uploadFromUrl(feat, title).catch(() => null) : null

    const terms = (p?._embedded?.['wp:term'] || []).flat()
    const catNames = terms
      .filter((t: any) => t?.taxonomy === 'category' && t?.name && t.name !== 'Uncategorized')
      .map((t: any) => decodeEntities(t.name))
    const catIds: any[] = []
    for (const cn of catNames) catIds.push(await getCategory(cn))

    // treść z fallbackiem na zajawkę/tytuł, gdy pusta
    let contentHtml = rawHtml
    const textOnly = contentHtml.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').trim()
    if (!textOnly) {
      const exc = (p?.excerpt?.rendered || '').replace(/<[^>]+>/g, '').trim()
      contentHtml = exc ? p.excerpt.rendered : `<p>${title}</p>`
    }

    let content: any
    try {
      content = await htmlToLexical(contentHtml)
    } catch (e) {
      console.warn(`  ! treść nieudana (${title}): ${(e as Error).message}`)
      content = await htmlToLexical(`<p>${title}</p>`)
    }

    try {
      await payload.create({
        collection: 'posts',
        context: { disableRevalidate: true },
        data: {
          title,
          slug: p?.slug || undefined,
          content,
          trescHtml: contentHtml || undefined,
          heroImage: heroId || undefined,
          categories: catIds.length ? catIds : undefined,
          publishedAt: p?.date || undefined,
          _status: 'published',
        },
      })
      created++
      console.log(`+ ${title}${heroId ? ' [hero]' : ''} (${catNames.join(', ') || 'bez kategorii'})`)
    } catch (e: any) {
      failed++
      let detail = (e as Error).message
      try {
        if (e?.data?.errors) detail += ' :: ' + JSON.stringify(e.data.errors)
      } catch {}
      console.warn(`  ! POMINIĘTO "${title}": ${detail}`)
    }
  }

  const totalPages = Number(res.headers.get('x-wp-totalpages') || '1')
  if (page >= totalPages) break
  page++
}

console.log(`\nGotowe. Utworzono: ${created}, pominięto: ${skipped}, błędy: ${failed}, przetworzono: ${total}.`)
process.exit(0)
