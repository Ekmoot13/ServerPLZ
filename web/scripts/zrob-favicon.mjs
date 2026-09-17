/**
 * Generowanie favicona z logo Polskiej Ligi Zeglarskiej.
 *
 * Z logo bierzemy sam znak zagli — napis pod nim przy 16-32 px jest nieczytelny.
 * Tlo pozostaje przezroczyste (decyzja redaktora): na ciemnym pasku kart widac
 * pelny znak, na jasnym bialy zagiel zlewa sie z tlem i zostaje sam czerwony.
 */
import sharp from 'sharp'
import fs from 'node:fs/promises'

const ZRODLO = '/app/public/logo.png'
const WYJSCIE = '/app/public'

// Sam znak (bez napisu) siedzi w gornej czesci kwadratu 1000x1000.
// Zrodlo jest w formacie webp — najpierw dekodujemy do PNG, bo wycinanie
// bezposrednio na webp konczy sie bledem "bad extract area".
const caly = await sharp(ZRODLO).png().toBuffer()
const { width: szer, height: wys } = await sharp(caly).metadata()

// Uwaga: sharp stosuje trim PRZED extract niezaleznie od kolejnosci wywolan,
// wiec musza to byc dwa osobne przebiegi.
const gora = await sharp(caly)
  .extract({ left: 0, top: 0, width: szer, height: Math.round(wys * 0.62) })
  .toBuffer()

const znak = await sharp(gora).trim().toBuffer({ resolveWithObject: true })

console.log('znak po przycieciu:', znak.info.width + 'x' + znak.info.height)

/**
 * Znak na przezroczystym kwadracie, z marginesem oddechowym.
 * Uwaga: bialy zagiel jest niewidoczny na jasnym tle paska kart — swiadomy
 * wybor, bo ikona ma byc samym znakiem, bez plamy tla.
 */
async function ikona(rozmiar) {
  const margines = Math.round(rozmiar * 0.08)
  const wewn = rozmiar - margines * 2
  const skala = await sharp(znak.data)
    .resize(wewn, wewn, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  return sharp({
    create: { width: rozmiar, height: rozmiar, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: skala, top: margines, left: margines }])
    .png()
    .toBuffer()
}

const rozmiary = [16, 32, 48, 180, 512]
const bufory = {}
for (const r of rozmiary) {
  bufory[r] = await ikona(r)
}

await fs.writeFile(`${WYJSCIE}/favicon-16x16.png`, bufory[16])
await fs.writeFile(`${WYJSCIE}/favicon-32x32.png`, bufory[32])
await fs.writeFile(`${WYJSCIE}/apple-touch-icon.png`, bufory[180])
await fs.writeFile(`${WYJSCIE}/icon-512.png`, bufory[512])

/**
 * ICO z osadzonymi obrazami PNG (obslugiwane od Windows Vista).
 * Naglowek: 6 bajtow + po 16 bajtow na kazdy obraz.
 */
function zrobIco(obrazy) {
  const naglowek = Buffer.alloc(6)
  naglowek.writeUInt16LE(0, 0) // zarezerwowane
  naglowek.writeUInt16LE(1, 2) // typ: ikona
  naglowek.writeUInt16LE(obrazy.length, 4)

  const wpisy = []
  let offset = 6 + obrazy.length * 16
  for (const { rozmiar, dane } of obrazy) {
    const w = Buffer.alloc(16)
    w.writeUInt8(rozmiar >= 256 ? 0 : rozmiar, 0) // szerokosc
    w.writeUInt8(rozmiar >= 256 ? 0 : rozmiar, 1) // wysokosc
    w.writeUInt8(0, 2) // liczba kolorow palety
    w.writeUInt8(0, 3) // zarezerwowane
    w.writeUInt16LE(1, 4) // plaszczyzny
    w.writeUInt16LE(32, 6) // bity na piksel
    w.writeUInt32LE(dane.length, 8)
    w.writeUInt32LE(offset, 12)
    wpisy.push(w)
    offset += dane.length
  }

  return Buffer.concat([naglowek, ...wpisy, ...obrazy.map((o) => o.dane)])
}

const ico = zrobIco([
  { rozmiar: 16, dane: bufory[16] },
  { rozmiar: 32, dane: bufory[32] },
  { rozmiar: 48, dane: bufory[48] },
])
await fs.writeFile(`${WYJSCIE}/favicon.ico`, ico)

console.log('zapisane: favicon.ico (16/32/48), favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, icon-512.png')
