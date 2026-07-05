/**
 * Import zespołu (Team) z eksportu WordPressa (web/wp-import/team.json).
 * Uruchomienie: docker compose -f docker-compose.prod.yml exec web npm run payload -- run scripts/migrate-team.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

console.log('== START importu Team ==')

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.resolve(dirname, '../wp-import/team.json')

async function uploadImage(payload: any, url: string, alt: string): Promise<any> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    const name = path.basename(new URL(url).pathname) || 'foto'
    const tmp = path.join(os.tmpdir(), `${Date.now()}-${name}`)
    fs.writeFileSync(tmp, buf)
    const media = await payload.create({ collection: 'media', data: { alt: alt || name }, filePath: tmp })
    fs.unlinkSync(tmp)
    return media.id
  } catch (e) {
    console.warn(`  ! zdjęcie nieudane (${url}): ${(e as Error).message}`)
    return null
  }
}

const payload = await getPayload({ config })
const osoby: any[] = JSON.parse(fs.readFileSync(DATA, 'utf8'))
console.log(`Wczytano ${osoby.length} osób z pliku.`)

let created = 0
let skipped = 0
let order = 0

for (const o of osoby) {
  order++
  const existing = await payload.find({ collection: 'team', where: { imie: { equals: o.imie } }, limit: 1 })
  if (existing.docs.length) { skipped++; continue }
  const zdjecieId = o.zdjecie ? await uploadImage(payload, o.zdjecie, o.imie) : null
  await payload.create({
    collection: 'team',
    data: {
      imie: o.imie,
      funkcja: o.funkcja || undefined,
      zdjecie: zdjecieId || undefined,
      kolejnosc: order,
    },
  })
  created++
  console.log(`+ ${o.imie} — ${o.funkcja || '-'}${zdjecieId ? ' [foto]' : ''}`)
}

console.log(`\nGotowe. Utworzono: ${created}, pominięto: ${skipped}.`)
process.exit(0)
