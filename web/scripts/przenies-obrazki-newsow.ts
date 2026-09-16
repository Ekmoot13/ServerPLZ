/**
 * Przeniesienie obrazków newsów ze starej strony na nasz serwer.
 *
 * Import newsów wstawił obrazki do treści jako odnośniki do
 * `ligazeglarska.pl/wp-content/uploads/...`. Po przepięciu domeny te adresy
 * przestaną działać, więc pobieramy pliki, wgrywamy do kolekcji Media
 * i podmieniamy adresy w `trescHtml`.
 *
 * MUSI zostać uruchomione ZANIM domena zostanie przepięta — inaczej nie ma
 * już skąd pobrać plików.
 *
 * Uruchomienie:
 *   docker compose -f docker-compose.prod.yml exec -e PAYLOAD_DB_PUSH=false web \
 *     npm run payload -- run scripts/przenies-obrazki-newsow.ts
 *
 * Skrypt jest odporny na ponowne uruchomienie: przetwarza tylko te posty,
 * w których nadal zostały adresy starej domeny.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import sharp from 'sharp'

const STARA = /https?:\/\/(?:www\.)?ligazeglarska\.pl\/wp-content\/uploads\/[^"'\s)]+/g
const MAX = parseInt(process.env.MAX_PX || '1600', 10)
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity

console.log(`== Przenoszenie obrazków newsów (max ${MAX} px) ==`)
const payload = await getPayload({ config })
console.log('Payload zainicjalizowany.')

const res = await payload.find({
  collection: 'posts',
  where: { trescHtml: { like: 'ligazeglarska.pl/wp-content/uploads' } },
  limit: 500,
  depth: 0,
})
const posty = res.docs as any[]
console.log(`Postów do przerobienia: ${posty.length}`)

/** URL starej strony -> nowy adres u nas (albo null, gdy nie da się pobrać). */
const mapa = new Map<string, string | null>()

async function pobierzIWgraj(url: string): Promise<string | null> {
  if (mapa.has(url)) return mapa.get(url)!

  try {
    const r = await fetch(url)
    if (!r.ok) {
      console.log(`  ! ${r.status} ${url.slice(-60)}`)
      mapa.set(url, null)
      return null
    }
    const oryginal = Buffer.from(await r.arrayBuffer())

    // PNG zostawiamy PNG (bywają to grafiki z przezroczystością), resztę na JPEG
    const czyPng = /\.png(?:$|\?)/i.test(url)
    const obrazek = sharp(oryginal).rotate().resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
    const dane = czyPng ? await obrazek.png({ compressionLevel: 9 }).toBuffer() : await obrazek.jpeg({ quality: 85, mozjpeg: true }).toBuffer()

    const bazowa = decodeURIComponent(url.split('/').pop() || 'obrazek.jpg').split('?')[0]
    const nazwa = czyPng ? bazowa.replace(/\.[^.]+$/, '.png') : bazowa.replace(/\.[^.]+$/, '.jpg')

    const media = await payload.create({
      collection: 'media',
      data: { alt: nazwa.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ') },
      file: {
        data: dane,
        mimetype: czyPng ? 'image/png' : 'image/jpeg',
        name: nazwa,
        size: dane.length,
      },
      overrideAccess: true,
    })

    const nowy = (media as any).url as string
    mapa.set(url, nowy)
    return nowy
  } catch (e: any) {
    console.log(`  ! błąd ${url.slice(-60)}: ${e?.message || e}`)
    mapa.set(url, null)
    return null
  }
}

let zmienionePosty = 0
let podmienioneAdresy = 0
let nieudane = 0

for (const post of posty.slice(0, LIMIT)) {
  const html: string = post.trescHtml || ''
  const adresy = Array.from(new Set(html.match(STARA) || []))
  if (!adresy.length) continue

  let nowyHtml = html
  let zmian = 0
  for (const adres of adresy) {
    const nowy = await pobierzIWgraj(adres)
    if (!nowy) {
      nieudane++
      continue
    }
    nowyHtml = nowyHtml.split(adres).join(nowy)
    zmian++
  }

  if (zmian) {
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { trescHtml: nowyHtml },
      overrideAccess: true,
      // Hook revalidatePost wola revalidatePath Nexta, co dziala tylko
      // w kontekscie zadania — ze skryptu wywala caly proces.
      context: { disableRevalidate: true },
    })
    zmienionePosty++
    podmienioneAdresy += zmian
    console.log(`  ✓ ${String(post.title || post.id).slice(0, 55)} — ${zmian} obrazków`)
  }
}

console.log('== Podsumowanie ==')
console.log(`  przerobione posty:     ${zmienionePosty}`)
console.log(`  podmienione adresy:    ${podmienioneAdresy}`)
console.log(`  pobrane pliki:         ${Array.from(mapa.values()).filter(Boolean).length}`)
console.log(`  nieudane pobrania:     ${nieudane}`)
process.exit(0)
