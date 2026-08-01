/**
 * Import Sponsorów z ligazeglarska.pl do kolekcji Sponsorzy (pobiera logotypy do Media).
 * Uruchomienie (lokalnie):
 *   docker compose -f docker-compose.local.yml exec web npm run payload -- run scripts/migrate-sponsorzy.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import os from 'os'
import path from 'path'

console.log('== START importu Sponsorów ==')

const B = 'https://ligazeglarska.pl/wp-content/uploads'
const SPONSORS: { nazwa: string; kategoria: string; logo: string }[] = [
  // Sponsorzy Główni
  { nazwa: 'PGE', kategoria: 'glowny', logo: `${B}/2024/04/2-1.jpg` },
  { nazwa: 'Nissan', kategoria: 'glowny', logo: `${B}/2024/04/1-300x180.jpg` },
  { nazwa: 'Bank Pekao', kategoria: 'glowny', logo: `${B}/2024/04/3-300x180.jpg` },
  { nazwa: 'MAG Morska Agencja Gdynia', kategoria: 'glowny', logo: `${B}/2024/04/MAG-300x180.jpg` },
  { nazwa: 'STBU', kategoria: 'glowny', logo: `${B}/2024/04/5-1-300x180.jpg` },
  // Oficjalny Partner Odzieżowy
  { nazwa: 'Crazy4Sailing', kategoria: 'odziezowy', logo: `${B}/2024/04/Crazy4Sailing_LONG-300x56.jpg` },
  // Gospodarze i Partnerzy Regat
  { nazwa: 'Sopot', kategoria: 'gospodarz', logo: `${B}/2024/04/8-300x180.jpg` },
  { nazwa: 'Puck', kategoria: 'gospodarz', logo: `${B}/2024/04/9-300x180.jpg` },
  { nazwa: 'Gdynia', kategoria: 'gospodarz', logo: `${B}/2024/04/10-300x180.jpg` },
  { nazwa: 'Szczecin', kategoria: 'gospodarz', logo: `${B}/2024/04/11-300x180.jpg` },
  { nazwa: 'Dr Irena Eris', kategoria: 'gospodarz', logo: `${B}/2024/04/6-1-300x180.jpg` },
  { nazwa: 'Sportofino', kategoria: 'gospodarz', logo: `${B}/2024/04/Logo-na-strone-SPORTOFINO-300x180.jpg` },
  { nazwa: 'Pomorze Zachodnie', kategoria: 'gospodarz', logo: `${B}/2024/04/12-300x180.jpg` },
  // Partnerzy
  { nazwa: 'Garmin', kategoria: 'partner', logo: `${B}/2024/04/4-1.jpg` },
  { nazwa: 'Aura Marine', kategoria: 'partner', logo: `${B}/2024/04/5-2.jpg` },
  { nazwa: 'Oakley / Unique Boutique', kategoria: 'partner', logo: `${B}/2024/04/3-1.jpg` },
  { nazwa: 'SAP', kategoria: 'partner', logo: `${B}/2024/04/7-1.jpg` },
  { nazwa: 'MK Cafe Professional', kategoria: 'partner', logo: `${B}/2024/04/10-1.jpg` },
  { nazwa: 'Vulcan Training & Consultancy', kategoria: 'partner', logo: `${B}/2024/04/6-2.jpg` },
  { nazwa: 'Nowy Styl', kategoria: 'partner', logo: `${B}/2024/04/8-1.jpg` },
  // Partnerzy Techniczni
  { nazwa: 'Bryt Sails', kategoria: 'techniczny', logo: `${B}/2024/03/Bryt-Sails-300x53.png` },
  { nazwa: 'Harken', kategoria: 'techniczny', logo: `${B}/2024/04/harken-768x231.png` },
  { nazwa: 'Marine PRO-PPF', kategoria: 'techniczny', logo: `${B}/2024/04/logo-Marine_page-0001-300x212.jpg` },
  { nazwa: 'RS Sailing', kategoria: 'techniczny', logo: `${B}/2024/03/RS-Sailing1-300x178.png` },
  // Partner Wspierający
  { nazwa: 'Polski Związek Żeglarski', kategoria: 'wspierajacy', logo: `${B}/2024/02/PZZ.svg` },
  // Patronaty Honorowe
  { nazwa: 'Ministerstwo Sportu i Turystyki', kategoria: 'patronat_honorowy', logo: `${B}/2024/04/MSiT-300x127.png` },
  { nazwa: 'Marszałek Województwa Pomorskiego', kategoria: 'patronat_honorowy', logo: `${B}/2024/04/MWP-PATRONAT-Mieczyslaw-Struk-pion-kolor-2021-300x173.png` },
  { nazwa: 'Województwo Zachodniopomorskie', kategoria: 'patronat_honorowy', logo: `${B}/2024/04/og_pion-300x228.jpg` },
  { nazwa: 'Miasto Sopot', kategoria: 'patronat_honorowy', logo: `${B}/2024/04/Sopot-Patronat-poziom-marynarz-CMYK-300x142.jpg` },
  { nazwa: 'Miasto Puck', kategoria: 'patronat_honorowy', logo: `${B}/2024/04/Herb-patronat-Honorowy-1-300x120.png` },
  { nazwa: 'Miasto Gdynia', kategoria: 'patronat_honorowy', logo: `${B}/2024/04/prezydent-miasta-gdyni-Aleksandra-Kosiorek-300x105.png` },
  { nazwa: 'Miasto Szczecin', kategoria: 'patronat_honorowy', logo: `${B}/2024/04/Patronat-Honorowy_kolor_2-300x156.jpg` },
  // Patronaty Medialne
  { nazwa: 'Przegląd Sportowy Onet', kategoria: 'patronat_medialny', logo: `${B}/2024/04/25-300x180.jpg` },
  { nazwa: 'TVP Sport', kategoria: 'patronat_medialny', logo: `${B}/2024/04/24-300x180.jpg` },
  { nazwa: 'Sportklub', kategoria: 'patronat_medialny', logo: `${B}/2024/04/27-300x180.jpg` },
  { nazwa: 'Sportowe Fakty', kategoria: 'patronat_medialny', logo: `${B}/2024/04/26-300x180.jpg` },
  { nazwa: 'Prestiż Trójmiasto', kategoria: 'patronat_medialny', logo: `${B}/2024/03/Prestiż-e1711060099398-300x121.png` },
  { nazwa: 'Prestiż Szczecin', kategoria: 'patronat_medialny', logo: `${B}/2024/03/Prestiż-Magazyn-Szczeciński-scaled-e1711066279382-300x91.jpg` },
  { nazwa: 'Morze', kategoria: 'patronat_medialny', logo: `${B}/2024/04/MORZE-logo-300x150.jpg` },
  { nazwa: 'Charter Navigator', kategoria: 'patronat_medialny', logo: `${B}/2024/04/logoCharterNavigator-300x155.png` },
  { nazwa: 'Gospodarka Morska', kategoria: 'patronat_medialny', logo: `${B}/2024/04/Gospodarka-morska-1-300x49.png` },
  // Współpraca
  { nazwa: 'Sailing Champions League', kategoria: 'wspolpraca', logo: `${B}/2024/02/sailing-champion-league-221x300.jpg` },
  { nazwa: 'ISLA', kategoria: 'wspolpraca', logo: `${B}/2024/02/ISLA-Logo-Colore-300x77.png` },
  { nazwa: 'ZOZŻ', kategoria: 'wspolpraca', logo: `${B}/2024/04/Logo-ZOZZ-03.jpg` },
  { nazwa: 'Sailors for the Sea', kategoria: 'wspolpraca', logo: `${B}/2026/01/SfS_Bronze-2025-Medallion-262x300.png` },
]

const payload = await getPayload({ config })

async function uploadFromUrl(url: string, alt: string): Promise<any> {
  const res = await fetch(encodeURI(url))
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const name = decodeURIComponent((url.split('/').pop() || 'logo').split('?')[0])
  const media = await payload.create({
    collection: 'media',
    context: { disableRevalidate: true },
    data: { alt },
    file: {
      data: buffer,
      mimetype: res.headers.get('content-type') || 'image/jpeg',
      name,
      size: buffer.length,
    },
  })
  return media.id
}

let created = 0
let skipped = 0
let failed = 0

for (let i = 0; i < SPONSORS.length; i++) {
  const s = SPONSORS[i]
  const existing = await payload.find({ collection: 'sponsorzy', where: { nazwa: { equals: s.nazwa } }, limit: 1 })
  if (existing.docs.length) {
    skipped++
    continue
  }
  try {
    const logoId = await uploadFromUrl(s.logo, s.nazwa)
    await payload.create({
      collection: 'sponsorzy',
      context: { disableRevalidate: true },
      data: { nazwa: s.nazwa, kategoria: s.kategoria, logo: logoId, kolejnosc: i },
    })
    created++
    console.log(`+ [${s.kategoria}] ${s.nazwa}`)
  } catch (e) {
    failed++
    console.warn(`  ! POMINIĘTO "${s.nazwa}": ${(e as Error).message}`)
  }
}

console.log(`\nGotowe. Utworzono: ${created}, pominięto: ${skipped}, błędy: ${failed}.`)
process.exit(0)
