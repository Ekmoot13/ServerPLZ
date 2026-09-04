/**
 * Wypełnia kalendarz rundami sezonu 2026 (daty/miejsca z SAP plz2026).
 * Uruchamia też synchronizację schematu Payload (push) — tworzy tabelę kalendarz, jeśli jej nie ma.
 * Idempotentny: pomija terminy o istniejącej nazwie.
 *
 * Uruchomienie w kontenerze web:
 *   npm run payload -- run scripts/seed-kalendarz.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

// [nazwa, poziom, miejsce, dataOd(ms), dataDo(ms)] — posortowane wg daty
const R: [string, string, string, number, number][] = [
  ['1 Liga - Runda 1', '1 Liga', 'Sopot', 1778914800000, 1779033600000],
  ['Ekstraklasa - Runda 1', 'Ekstraklasa', 'Sopot', 1779519600000, 1779638400000],
  ['Ekstraklasa - Runda 2', 'Ekstraklasa', 'Puck', 1782543600000, 1782662400000],
  ['1 Liga - Runda 2', '1 Liga', 'Puck', 1783148400000, 1783267200000],
  ['Ekstraklasa - Runda 3', 'Ekstraklasa', 'Gdynia', 1787382000000, 1787500800000],
  ['1 Liga - Runda 3', '1 Liga', 'Gdynia', 1787986800000, 1788105600000],
  ['1 Liga - Runda 4', '1 Liga', 'Szczecin', 1789714800000, 1789837200000],
  ['Ekstraklasa - Runda 4', 'Ekstraklasa', 'Szczecin', 1790319600000, 1790442000000],
]

console.log('== START seed kalendarza ==')
const payload = await getPayload({ config })

let created = 0
let skipped = 0
for (let i = 0; i < R.length; i++) {
  const [nazwa, poziom, miejsce, od, doo] = R[i]
  const ex = await payload.find({
    collection: 'kalendarz' as any,
    where: { nazwa: { equals: nazwa } },
    limit: 1,
  })
  if (ex.docs.length) {
    skipped++
    continue
  }
  await payload.create({
    collection: 'kalendarz' as any,
    data: {
      nazwa,
      poziom,
      miejsce,
      dataOd: new Date(od).toISOString(),
      dataDo: new Date(doo).toISOString(),
      autoStatus: true,
      statusReczny: 'zaplanowane',
      kolejnosc: i + 1,
    } as any,
    overrideAccess: true,
  })
  created++
  console.log(`+ ${nazwa} (${miejsce})`)
}
console.log(`Kalendarz: utworzono ${created}, pominięto ${skipped}`)
process.exit(0)
