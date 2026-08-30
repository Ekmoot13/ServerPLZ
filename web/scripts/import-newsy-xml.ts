/**
 * Import Newsów z eksportów WordPress (WXR .xml) do kolekcji Posts.
 * Pliki: web/wp-import/newsy-*.xml
 *  - tytuł, slug, data, kategorie
 *  - treść HTML -> Lexical (obrazki w treści wgrywane do Media)
 *  - zdjęcie główne z załącznika (po _thumbnail_id)
 * Idempotentny: pomija wpisy o istniejącym tytule.
 *
 * Test:  docker compose -f docker-compose.local.yml exec -e LIMIT=3 web npm run payload -- run scripts/import-newsy-xml.ts
 * Pełny: docker compose -f docker-compose.local.yml exec web npm run payload -- run scripts/import-newsy-xml.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

console.log('== START importu Newsów z XML ==')

const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity
const dirname = path.dirname(fileURLToPath(import.meta.url))
const IMPORT_DIR = path.resolve(dirname, '../wp-import')

function stripCdata(s: string): string {
  if (!s) return ''
  const m = s.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  return (m ? m[1] : s).trim()
}
function decodeEntities(s: string): string {
  return (s || '')
    .replace(/&amp;/g, '&').replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '–').replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
    .replace(/&hellip;/g, '…').replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ').trim()
}
function pick(item: string, tag: string): string {
  const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return m ? m[1] : ''
}

// Wczytaj wszystkie itemy ze wszystkich plików
const files = fs.existsSync(IMPORT_DIR)
  ? fs.readdirSync(IMPORT_DIR).filter((f) => /^newsy-.*\.xml$/i.test(f))
  : []
if (files.length === 0) {
  console.error(`Brak plików newsy-*.xml w ${IMPORT_DIR}`)
  process.exit(1)
}
let allItems: string[] = []
for (const f of files) {
  const data = fs.readFileSync(path.join(IMPORT_DIR, f), 'utf-8')
  const items = data.match(/<item>[\s\S]*?<\/item>/g) || []
  allItems = allItems.concat(items)
  console.log(`  ${f}: ${items.length} itemów`)
}

// Mapa załączników: post_id -> url (dla zdjęć głównych)
const attByPost = new Map<string, string>()
for (const it of allItems) {
  if (!/<wp:post_type><!\[CDATA\[attachment\]\]><\/wp:post_type>/.test(it)) continue
  const id = (it.match(/<wp:post_id>(\d+)<\/wp:post_id>/) || [])[1]
  const url = stripCdata(pick(it, 'wp:attachment_url'))
  if (id && url) attByPost.set(id, url)
}
console.log(`Załączniki: ${attByPost.size}`)

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
const editorConfig = await editorConfigFactory.fromField({ field: findRichText(postsColl.fields, 'content') })

async function uploadFromUrl(url: string, alt: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) return null
  const buffer = Buffer.from(await res.arrayBuffer())
  const name = (url.split('/').pop() || 'image.jpg').split('?')[0]
  const media = await payload.create({
    collection: 'media',
    data: { alt: alt || name },
    file: { data: buffer, mimetype: res.headers.get('content-type') || 'image/jpeg', name, size: buffer.length },
  })
  return media.id
}

async function htmlToLexical(html: string): Promise<any> {
  // Treść Lexical bez obrazków/osadzeń (pełny HTML z obrazkami trzymamy w trescHtml i renderujemy na stronie).
  const dom = new JSDOM(html)
  dom.window.document.querySelectorAll('img, iframe, script, style').forEach((el) => el.remove())
  return convertHTMLToLexical({ editorConfig, html: dom.window.document.body.innerHTML, JSDOM })
}

const catCache = new Map<string, any>()
async function getCategory(name: string): Promise<any> {
  if (catCache.has(name)) return catCache.get(name)
  const found = await payload.find({ collection: 'categories', where: { title: { equals: name } }, limit: 1 })
  const id = found.docs.length ? found.docs[0].id : (await payload.create({ collection: 'categories', data: { title: name } })).id
  catCache.set(name, id)
  return id
}

let total = 0, created = 0, skipped = 0, failed = 0

for (const it of allItems) {
  if (!/<wp:post_type><!\[CDATA\[post\]\]><\/wp:post_type>/.test(it)) continue
  if (!/<wp:status><!\[CDATA\[publish\]\]><\/wp:status>/.test(it)) continue
  if (total >= LIMIT) break
  total++

  const title = decodeEntities(stripCdata(pick(it, 'title')))
  if (!title) continue

  const rawHtml = stripCdata(pick(it, 'content:encoded'))

  const existing = await payload.find({ collection: 'posts', where: { title: { equals: title } }, limit: 1 })
  if (existing.docs.length) {
    const doc: any = existing.docs[0]
    if (!doc.trescHtml && rawHtml) {
      try {
        await payload.update({ collection: 'posts', id: doc.id, context: { disableRevalidate: true }, data: { trescHtml: rawHtml } })
        console.log(`~ uzupełniono treść HTML: ${title}`)
      } catch {
        /* pomiń */
      }
    }
    skipped++
    continue
  }

  const slug = stripCdata(pick(it, 'wp:post_name')) || undefined
  const dateRaw = stripCdata(pick(it, 'wp:post_date'))
  const publishedAt = dateRaw ? new Date(dateRaw.replace(' ', 'T')).toISOString() : undefined

  // kategorie (domain="category")
  const catNames = Array.from(
    it.matchAll(/<category domain="category"[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g),
  )
    .map((m) => decodeEntities(m[1]))
    .filter((n) => n && n.toLowerCase() !== 'uncategorized' && n.toLowerCase() !== 'bez-kategorii')
  const catIds: any[] = []
  for (const cn of catNames) catIds.push(await getCategory(cn))

  // zdjęcie główne z załącznika po _thumbnail_id
  const thumbId = (it.match(/<wp:meta_key><!\[CDATA\[_thumbnail_id\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(\d+)\]\]>/) || [])[1]
  const heroUrl = thumbId ? attByPost.get(thumbId) : undefined
  const heroId = heroUrl ? await uploadFromUrl(heroUrl, title).catch(() => null) : null

  // treść
  let contentHtml = rawHtml
  const textOnly = contentHtml.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').trim()
  if (!textOnly) contentHtml = `<p>${title}</p>`

  let content: any
  try {
    content = await htmlToLexical(contentHtml)
  } catch (e) {
    console.warn(`  ! treść nieudana (${title}): ${(e as Error).message}`)
    try { content = await htmlToLexical(`<p>${title}</p>`) } catch { content = undefined }
  }

  try {
    await payload.create({
      collection: 'posts',
      context: { disableRevalidate: true },
      data: {
        title,
        slug,
        content,
        trescHtml: rawHtml || undefined,
        heroImage: heroId || undefined,
        categories: catIds.length ? catIds : undefined,
        publishedAt,
        _status: 'published',
      },
    })
    created++
    console.log(`+ ${title}${heroId ? ' [hero]' : ''} (${catNames.join(', ') || 'bez kat.'})`)
  } catch (e: any) {
    // Awaryjnie: zapisz bez treści Lexical (strona i tak renderuje trescHtml)
    try {
      await payload.create({
        collection: 'posts',
        context: { disableRevalidate: true },
        data: {
          title,
          slug,
          trescHtml: rawHtml || undefined,
          heroImage: heroId || undefined,
          categories: catIds.length ? catIds : undefined,
          publishedAt,
          _status: 'published',
        },
      })
      created++
      console.log(`+ ${title} (bez treści Lexical)`)
    } catch (e2: any) {
      failed++
      let detail = (e2 as Error).message
      try { if (e2?.data?.errors) detail += ' :: ' + JSON.stringify(e2.data.errors) } catch {}
      console.warn(`  ! POMINIĘTO "${title}": ${detail}`)
    }
  }
}

console.log(`\nGotowe. Utworzono: ${created}, pominięto: ${skipped}, błędy: ${failed}, przetworzono: ${total}.`)
process.exit(0)
