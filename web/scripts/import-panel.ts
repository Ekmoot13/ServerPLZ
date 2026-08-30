/**
 * Import danych z bazy wyników (liga_*) do panelu Payload, żeby redaktorzy mogli je edytować.
 *  - tworzy rekordy Zawodnicy (powiązane po idZawodnika),
 *  - tworzy brakujące Kluby (powiązane po idZestawienia),
 *  - ustawia poziom ligi klubów z bieżącego sezonu.
 * Idempotentny: pomija to, co już istnieje.
 *
 * Uruchomienie w kontenerze web:
 *   npm run payload -- run scripts/import-panel.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { ligaQuery, getAktualneKluby } from '@/lib/liga'

console.log('== START importu do panelu ==')

const payload = await getPayload({ config })

// 1) ZAWODNICY -------------------------------------------------------------
const zaw = await ligaQuery<{ id_zawodnika: number; imie: string; nazwisko: string }>(
  `SELECT id_zawodnika, imie, nazwisko FROM liga_zawodnik`,
)
const existingZ = await payload.find({ collection: 'zawodnicy', limit: 0, depth: 0, pagination: false })
const haveZ = new Set<number>(existingZ.docs.map((d: any) => d.idZawodnika).filter((x: any) => x != null))

let createdZ = 0
for (const z of zaw) {
  if (haveZ.has(z.id_zawodnika)) continue
  try {
    await payload.create({
      collection: 'zawodnicy',
      data: {
        imie: z.imie || '',
        nazwisko: z.nazwisko || '',
        idZawodnika: z.id_zawodnika,
        aktywny: true,
      },
    })
    createdZ++
  } catch (e) {
    console.warn(`  ! zawodnik ${z.id_zawodnika}: ${(e as Error).message}`)
  }
}
console.log(`Zawodnicy: utworzono ${createdZ}, było ${haveZ.size}, w bazie ${zaw.length}`)

// 2) KLUBY (utwórz brakujące) ---------------------------------------------
const kl = await ligaQuery<{ id: number; nazwa: string }>(
  `SELECT id_zestawienia_klubow AS id, nazwa FROM liga_zestawienieklubow`,
)
const existingK = await payload.find({ collection: 'kluby', limit: 0, depth: 0, pagination: false })
const haveK = new Map<number, string | number>()
for (const d of existingK.docs as any[]) if (d.idZestawienia != null) haveK.set(d.idZestawienia, d.id)

let createdK = 0
for (const k of kl) {
  if (haveK.has(k.id)) continue
  try {
    const doc = await payload.create({
      collection: 'kluby',
      data: { nazwa: k.nazwa || '', idZestawienia: k.id, aktywny: false },
    })
    haveK.set(k.id, doc.id)
    createdK++
  } catch (e) {
    console.warn(`  ! klub ${k.id}: ${(e as Error).message}`)
  }
}
console.log(`Kluby: utworzono ${createdK}, razem powiązanych ${haveK.size}`)

// 3) POZIOM LIGI z bieżącego sezonu ---------------------------------------
const grupy = await getAktualneKluby()
let updP = 0
for (const g of grupy) {
  for (const c of g.kluby) {
    const docId = haveK.get(c.id)
    if (!docId) continue
    try {
      await payload.update({
        collection: 'kluby',
        id: docId as any,
        data: { poziomLigi: g.poziom, aktywny: true },
      })
      updP++
    } catch (e) {
      console.warn(`  ! poziom ${c.id}: ${(e as Error).message}`)
    }
  }
}
console.log(`Kluby: ustawiono poziom ligi dla ${updP}`)

console.log('== KONIEC ==')
process.exit(0)
