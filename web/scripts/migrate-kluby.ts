/**
 * Import Klubów z eksportu WordPressa (dane w web/wp-import/kluby.json).
 * Tworzy rekordy w kolekcji "kluby" i wgrywa logo (pobierane z publicznych adresów).
 * Idempotentny: pomija kluby, które już istnieją (po nazwie).
 *
 * Uruchomienie na serwerze (w kontenerze web):
 *   docker compose -f docker-compose.prod.yml exec web npm run payload -- run scripts/migrate-kluby.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

console.log('== START importu Klubów ==')

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.resolve(dirname, '../wp-import/kluby.json')

async function uploadImage(payload: any, url: string, alt: string): Promise<any> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    const name = path.basename(new URL(url).pathname) || 'logo'
    const tmp = path.join(os.tmpdir(), `${Date.now()}-${name}`)
    fs.writeFileSync(tmp, buf)
    const media = await payload.create({
      collection: 'media',
      data: { alt: alt || name },
      filePath: tmp,
    })
    fs.unlinkSync(tmp)
    return media.id
  } catch (e) {
    console.warn(`  ! logo nieudane (${url}): ${(e as Error).message}`)
    return null
  }
}

const payload = await getPayload({ config })
const kluby: any[] = JSON.parse(fs.readFileSync(DATA, 'utf8'))
console.log(`Wczytano ${kluby.length} klubów z pliku.`)

let created = 0
let skipped = 0

for (const k of kluby) {
  const existing = await payload.find({
    collection: 'kluby',
    where: { nazwa: { equals: k.nazwa } },
    limit: 1,
  })
  if (existing.docs.length) {
    skipped++
    continue
  }

  const logoId = k.logo ? await uploadImage(payload, k.logo, k.nazwa) : null

  await payload.create({
    collection: 'kluby',
    data: {
      nazwa: k.nazwa,
      skrot: k.skrot || undefined,
      logo: logoId || undefined,
      gdzieStartuje: k.gdzieStartuje || undefined,
      www: k.www || undefined,
      facebook: k.facebook || undefined,
      instagram: k.instagram || undefined,
      youtube: k.youtube || undefined,
      idZestawienia: k.idZestawienia ?? undefined,
      aktywny: true,
    },
  })
  created++
  console.log(`+ ${k.nazwa} (${k.skrot || '-'})${logoId ? ' [logo]' : ''}`)
}

console.log(`\nGotowe. Utworzono: ${created}, pominięto (już istniały): ${skipped}.`)
process.exit(0)
