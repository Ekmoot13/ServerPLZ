/**
 * Wypełnia kalendarz pełnym harmonogramem sezonu 2026 (wg kalendarium PLŻ).
 * Uruchamia też synchronizację schematu Payload (push) — tworzy tabelę kalendarz, jeśli jej nie ma.
 * Upsert: aktualizuje istniejące terminy (po nazwie) i dodaje brakujące.
 *
 * Uruchomienie w kontenerze web:
 *   npm run payload -- run scripts/seed-kalendarz.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

type Row = { poziom: string; nazwa: string; miejsce: string; od: string; do: string; kolejnosc: number }

const R: Row[] = [
  // Ekstraklasa
  { poziom: 'Ekstraklasa', nazwa: 'Ekstraklasa - Runda 1', miejsce: 'Sopot', od: '2026-05-22', do: '2026-05-24', kolejnosc: 1 },
  { poziom: 'Ekstraklasa', nazwa: 'Ekstraklasa - Runda 2', miejsce: 'Puck', od: '2026-06-26', do: '2026-06-28', kolejnosc: 2 },
  { poziom: 'Ekstraklasa', nazwa: 'Ekstraklasa - Runda 3', miejsce: 'Gdynia', od: '2026-08-21', do: '2026-08-23', kolejnosc: 3 },
  { poziom: 'Ekstraklasa', nazwa: 'Ekstraklasa - Runda 4', miejsce: 'Szczecin', od: '2026-09-24', do: '2026-09-26', kolejnosc: 4 },
  // 1 Liga
  { poziom: '1 Liga', nazwa: '1 Liga - Runda 1', miejsce: 'Sopot', od: '2026-05-15', do: '2026-05-17', kolejnosc: 1 },
  { poziom: '1 Liga', nazwa: '1 Liga - Runda 2', miejsce: 'Puck', od: '2026-07-03', do: '2026-07-05', kolejnosc: 2 },
  { poziom: '1 Liga', nazwa: '1 Liga - Runda 3', miejsce: 'Gdynia', od: '2026-08-28', do: '2026-08-30', kolejnosc: 3 },
  { poziom: '1 Liga', nazwa: '1 Liga - Runda 4', miejsce: 'Szczecin', od: '2026-09-17', do: '2026-09-19', kolejnosc: 4 },
  // Młodzieżowa
  { poziom: 'Młodzieżowa', nazwa: 'Młodzieżowa - Runda 1', miejsce: 'Sopot', od: '2026-04-24', do: '2026-04-26', kolejnosc: 1 },
  { poziom: 'Młodzieżowa', nazwa: 'Młodzieżowa - Runda 2', miejsce: 'Sopot', od: '2026-06-12', do: '2026-06-14', kolejnosc: 2 },
  { poziom: 'Młodzieżowa', nazwa: 'Młodzieżowa - Runda 3', miejsce: 'Gdynia', od: '2026-07-17', do: '2026-07-19', kolejnosc: 3 },
  { poziom: 'Młodzieżowa', nazwa: 'Młodzieżowa - Runda 4', miejsce: 'Szczecin', od: '2026-09-28', do: '2026-09-30', kolejnosc: 4 },
  // Finał Lig Regionalnych
  { poziom: 'Finał Lig Regionalnych', nazwa: 'Finał Lig Regionalnych', miejsce: 'Szczecin', od: '2026-10-02', do: '2026-10-04', kolejnosc: 1 },
  // Mistrzostwa Polski Kobiet
  { poziom: 'Mistrzostwa Polski Kobiet', nazwa: 'Mistrzostwa Polski Kobiet', miejsce: 'Sopot', od: '2026-06-05', do: '2026-06-07', kolejnosc: 1 },
  // Trójmiejska Liga Żeglarska
  { poziom: 'Trójmiejska Liga Żeglarska', nazwa: 'Trójmiejska Liga - Runda 1', miejsce: 'Sopot', od: '2026-04-17', do: '2026-04-19', kolejnosc: 1 },
  { poziom: 'Trójmiejska Liga Żeglarska', nazwa: 'Trójmiejska Liga - Runda 2', miejsce: 'Sopot', od: '2026-06-19', do: '2026-06-21', kolejnosc: 2 },
  { poziom: 'Trójmiejska Liga Żeglarska', nazwa: 'Trójmiejska Liga - Runda 3', miejsce: 'Puck', od: '2026-07-10', do: '2026-07-12', kolejnosc: 3 },
  { poziom: 'Trójmiejska Liga Żeglarska', nazwa: 'Trójmiejska Liga - Runda 4', miejsce: 'Gdynia', od: '2026-08-14', do: '2026-08-16', kolejnosc: 4 },
  // Wielkopolska Liga Żeglarska
  { poziom: 'Wielkopolska Liga Żeglarska', nazwa: 'Wielkopolska Liga - Runda 1', miejsce: 'Poznań', od: '2026-04-24', do: '2026-04-26', kolejnosc: 1 },
  { poziom: 'Wielkopolska Liga Żeglarska', nazwa: 'Wielkopolska Liga - Runda 2', miejsce: 'Poznań', od: '2026-05-29', do: '2026-05-31', kolejnosc: 2 },
  { poziom: 'Wielkopolska Liga Żeglarska', nazwa: 'Wielkopolska Liga - Runda 3', miejsce: 'Poznań', od: '2026-06-19', do: '2026-06-21', kolejnosc: 3 },
  // Centralna Liga Żeglarska
  { poziom: 'Centralna Liga Żeglarska', nazwa: 'Centralna Liga - Runda 1', miejsce: 'Płock (Nowy Duninów)', od: '2026-07-10', do: '2026-07-12', kolejnosc: 1 },
  { poziom: 'Centralna Liga Żeglarska', nazwa: 'Centralna Liga - Runda 2', miejsce: 'Płock (Nowy Duninów)', od: '2026-07-31', do: '2026-08-02', kolejnosc: 2 },
  { poziom: 'Centralna Liga Żeglarska', nazwa: 'Centralna Liga - Runda 3', miejsce: 'Płock (Nowy Duninów)', od: '2026-08-28', do: '2026-08-30', kolejnosc: 3 },
]

const iso = (d: string) => new Date(`${d}T12:00:00.000Z`).toISOString()

console.log('== START seed kalendarza (pełny 2026) ==')
const payload = await getPayload({ config })

let created = 0
let updated = 0
for (const r of R) {
  const data = {
    nazwa: r.nazwa,
    poziom: r.poziom,
    miejsce: r.miejsce,
    dataOd: iso(r.od),
    dataDo: iso(r.do),
    autoStatus: true,
    statusReczny: 'zaplanowane',
    kolejnosc: r.kolejnosc,
  } as any
  const ex = await payload.find({
    collection: 'kalendarz' as any,
    where: { nazwa: { equals: r.nazwa } },
    limit: 1,
  })
  if (ex.docs.length) {
    await payload.update({ collection: 'kalendarz' as any, id: (ex.docs[0] as any).id, data, overrideAccess: true })
    updated++
    console.log(`~ ${r.nazwa}`)
  } else {
    await payload.create({ collection: 'kalendarz' as any, data, overrideAccess: true })
    created++
    console.log(`+ ${r.nazwa}`)
  }
}
console.log(`Kalendarz: utworzono ${created}, zaktualizowano ${updated}`)
process.exit(0)
