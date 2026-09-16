/**
 * Import zdjęć zawodników ze starej strony (WordPress) do kolekcji Media
 * i przypisanie ich do rekordów w kolekcji Zawodnicy.
 *
 * Zdjęcia pochodzą z eksportu WXR: powiązanie zawodnik -> `_thumbnail_id` -> załącznik.
 * Pliki zostały wcześniej pobrane, zmniejszone (max 800 px) i przemianowane
 * na `Nazwisko_Imie.jpg`. Dopasowanie do bazy idzie po imieniu i nazwisku
 * z manifestu, a nie po nazwie pliku.
 *
 * Wymaga na serwerze:
 *   web/tmp-zdjecia/manifest.tsv   (kolumny: plik, imie, nazwisko)
 *   web/tmp-zdjecia/<pliki .jpg>
 *
 * Test na kilku:  docker compose -f docker-compose.prod.yml exec -e LIMIT=3 web npm run payload -- run scripts/import-zdjecia-zawodnikow.ts
 * Pełny import:   docker compose -f docker-compose.prod.yml exec web npm run payload -- run scripts/import-zdjecia-zawodnikow.ts
 *
 * Skrypt NIE nadpisuje zawodników, którzy mają już zdjęcie — można go
 * bezpiecznie uruchomić ponownie po przerwanym imporcie.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'node:fs'
import path from 'node:path'

const KATALOG = process.env.KATALOG || '/app/tmp-zdjecia'
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity

/** Do porównań: bez ogonków, małe litery, bez podwójnych spacji. */
function norm(s: string): string {
  return (s || '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// Kod na najwyzszym poziomie z await — tak jak pozostale skrypty w tym katalogu.
// Opakowanie w funkcje wywolana bez await konczylo proces, zanim getPayload
// zdazyl sie rozwiazac (pusta petla zdarzen, kod wyjscia 0, zero komunikatow).
console.log(`== Start: katalog ${KATALOG}, limit ${LIMIT} ==`)
const payload = await getPayload({ config })
console.log('Payload zainicjalizowany.')

const manifest = path.join(KATALOG, 'manifest.tsv')
if (!fs.existsSync(manifest)) {
  console.error(`Brak pliku ${manifest}`)
  process.exit(1)
}

const wiersze = fs
  .readFileSync(manifest, 'utf8')
  .split('\n')
  .map((l) => l.replace(/\r$/, ''))
  .filter(Boolean)
  .slice(1)
  .map((l) => l.split('\t'))
  .filter((c) => c.length >= 3)

console.log(`== Import zdjęć zawodników: ${wiersze.length} pozycji w manifeście ==`)

// Cała kolekcja na raz — 553 rekordy, taniej niż zapytanie na każdego.
const wszyscy = await payload.find({ collection: 'zawodnicy' as any, limit: 2000, depth: 0 })
const indeks = new Map<string, any>()
for (const z of wszyscy.docs as any[]) {
  indeks.set(`${norm(z.imie)}|${norm(z.nazwisko)}`, z)
}

let wgrane = 0
let pominiete = 0
let brakPliku = 0
let brakZawodnika = 0
let bledy = 0

for (const [plik, imie, nazwisko] of wiersze.slice(0, LIMIT)) {
  const zawodnik = indeks.get(`${norm(imie)}|${norm(nazwisko)}`)
  if (!zawodnik) {
    brakZawodnika++
    console.log(`  – brak w bazie: ${imie} ${nazwisko}`)
    continue
  }
  if (zawodnik.zdjecie) {
    pominiete++
    continue
  }

  const sciezka = path.join(KATALOG, plik)
  if (!fs.existsSync(sciezka)) {
    brakPliku++
    console.log(`  – brak pliku: ${plik}`)
    continue
  }

  try {
    const dane = fs.readFileSync(sciezka)
    const media = await payload.create({
      collection: 'media',
      data: { alt: `${imie} ${nazwisko}` },
      file: {
        data: dane,
        mimetype: 'image/jpeg',
        name: plik,
        size: dane.length,
      },
      overrideAccess: true,
    })

    await payload.update({
      collection: 'zawodnicy' as any,
      id: zawodnik.id,
      data: { zdjecie: (media as any).id },
      overrideAccess: true,
    })

    wgrane++
    if (wgrane % 25 === 0) console.log(`  … wgrano ${wgrane}`)
  } catch (e: any) {
    bledy++
    console.log(`  ! błąd przy ${imie} ${nazwisko} (${plik}): ${e?.message || e}`)
  }
}

console.log('== Podsumowanie ==')
console.log(`  wgrane i przypisane:      ${wgrane}`)
console.log(`  pominięte (miały zdjęcie): ${pominiete}`)
console.log(`  brak zawodnika w bazie:    ${brakZawodnika}`)
console.log(`  brak pliku na dysku:       ${brakPliku}`)
console.log(`  błędy:                     ${bledy}`)
process.exit(0)
