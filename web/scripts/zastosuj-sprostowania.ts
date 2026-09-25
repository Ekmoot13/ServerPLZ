/**
 * Nanosi ponownie wszystkie zaakceptowane sprostowania na dane ligowe.
 *
 * DO URUCHOMIENIA PO KAŻDYM IMPORCIE WYNIKÓW. `db/load_all.sql` zaczyna od
 * TRUNCATE tabel `liga_*`, więc poprawki naniesione przez redakcję znikają
 * razem ze starymi danymi. Same wnioski leżą w Payloadzie (tabele `payload.*`),
 * którego import nie dotyka — ten skrypt przekłada je z powrotem.
 *
 * Jest idempotentny: dodanie nie zdubluje istniejącego wpisu, usunięcie
 * nieistniejącego nic nie zmienia. Można puszczać wielokrotnie.
 *
 *   docker compose -f docker-compose.prod.yml exec web \
 *     npm run payload -- run scripts/zastosuj-sprostowania.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { ligaQuery } from '../src/lib/liga'

console.log('== Nanoszenie zaakceptowanych sprostowań ==')

const payload = await getPayload({ config })

const res = await payload.find({
  collection: 'sprostowania' as any,
  where: { status: { equals: 'zaakceptowany' } },
  // Chronologicznie: dla tego samego występu mogą istnieć wnioski sprzeczne
  // (najpierw ktoś prosi o dodanie, potem redakcja przyjmuje usunięcie).
  // Nakładane po kolei dają ten sam stan, co w panelu — wygrywa ostatnia decyzja.
  sort: 'createdAt',
  limit: 0,
  pagination: false,
  depth: 0,
  overrideAccess: true,
})

const wnioski = res.docs as any[]
if (wnioski.length === 0) {
  console.log('Nie ma zaakceptowanych sprostowań — nic do roboty.')
  process.exit(0)
}

let dodane = 0
let usuniete = 0
let pominiete = 0

for (const w of wnioski) {
  const zawodnik = Number(w.zawodnikId)
  const wariant = Number(w.wariantId)
  const regaty = Number(w.regatyId)
  const opis = `${w.zawodnikNazwa || zawodnik} — ${w.klubNazwa || wariant} — ${w.regatyOpis || regaty}`

  if (![zawodnik, wariant, regaty].every((n) => Number.isFinite(n) && n > 0)) {
    console.warn(`  ! pomijam (braki w danych): ${opis}`)
    pominiete++
    continue
  }

  try {
    if (w.typ === 'usuniecie') {
      await ligaQuery(
        `DELETE FROM liga_wystepowanie_w_regatach
          WHERE id_zawodnika = $1 AND id_wariantu_klubu = $2 AND id_regat = $3`,
        [zawodnik, wariant, regaty],
      )
      usuniete++
      console.log(`- ${opis}`)
    } else {
      // Odtworzenie wymaga, żeby zawodnik, klub i regaty nadal istniały po imporcie.
      await ligaQuery(
        `INSERT INTO liga_wystepowanie_w_regatach (id_zawodnika, id_regat, id_wariantu_klubu)
         SELECT $1, $3, $2
          WHERE EXISTS (SELECT 1 FROM liga_zawodnik      WHERE id_zawodnika = $1)
            AND EXISTS (SELECT 1 FROM liga_klubwariant   WHERE id_wariantu_klubu = $2)
            AND EXISTS (SELECT 1 FROM liga_regaty        WHERE id_regat = $3)
            AND NOT EXISTS (
              SELECT 1 FROM liga_wystepowanie_w_regatach
               WHERE id_zawodnika = $1 AND id_wariantu_klubu = $2 AND id_regat = $3
            )`,
        [zawodnik, wariant, regaty],
      )
      dodane++
      console.log(`+ ${opis}`)
    }
  } catch (err) {
    console.warn(`  ! błąd przy „${opis}": ${err instanceof Error ? err.message : String(err)}`)
    pominiete++
  }
}

console.log(`\nGotowe. Dodane: ${dodane}, usunięte: ${usuniete}, pominięte: ${pominiete}.`)
process.exit(0)
