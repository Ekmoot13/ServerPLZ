/**
 * Domyslny obrazek podgladu (Open Graph) — pokazywany, gdy udostepniany wpis
 * nie ma wlasnego zdjecia. Wczesniej byla tu grafika promocyjna szablonu
 * Payload, czyli reklama cudzego produktu pod linkiem do PLZ.
 *
 * Format 1200x630 to standard przyjety przez Facebooka, LinkedIn i pozostale.
 */
import sharp from 'sharp'

const ZRODLO = '/app/scripts/logo-zrodlo.png'
const WYJSCIE = '/app/public/og-domyslny.jpg'
const GRANAT = '#132a54'
const SZER = 1200
const WYS = 630

// Logo w szarym wariancie jest czytelne na granacie; skalujemy do ~60% wysokosci.
const logo = await sharp(ZRODLO)
  .png()
  .resize(Math.round(WYS * 0.62), Math.round(WYS * 0.62), {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .toBuffer()

await sharp({ create: { width: SZER, height: WYS, channels: 4, background: GRANAT } })
  .composite([{ input: logo, gravity: 'center' }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(WYJSCIE)

console.log('zapisano', WYJSCIE)
