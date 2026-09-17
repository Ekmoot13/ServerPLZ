/**
 * Generowanie favicona z logo Polskiej Ligi Zeglarskiej.
 *
 * Z logo bierzemy sam znak zagli — napis pod nim przy 16-32 px jest nieczytelny.
 * Tlo pozostaje przezroczyste, a bialy zagiel dostaje ciemny obrys: bez niego
 * znikalby na jasnym pasku kart przegladarki.
 *
 * Obrys nakladamy PO przeskalowaniu, osobno dla kazdego rozmiaru — obrys
 * policzony na duzym obrazie zwezilby sie przy skalowaniu do 16 px do zera.
 */
import sharp from 'sharp'
import fs from 'node:fs/promises'

const ZRODLO = '/app/public/logo.png'
const WYJSCIE = '/app/public'

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

/** Rozszerza maske o `r` pikseli we wszystkich kierunkach (dylatacja kwadratem). */
function rozszerz(maska, w, h, r) {
  const wynik = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!maska[y * w + x]) continue
      const y0 = Math.max(0, y - r)
      const y1 = Math.min(h - 1, y + r)
      const x0 = Math.max(0, x - r)
      const x1 = Math.min(w - 1, x + r)
      for (let yy = y0; yy <= y1; yy++) {
        for (let xx = x0; xx <= x1; xx++) wynik[yy * w + xx] = 1
      }
    }
  }
  return wynik
}

/** Znak na przezroczystym kwadracie, z ciemnym obrysem wokol jasnych partii. */
async function ikona(rozmiar) {
  const margines = Math.round(rozmiar * 0.08)
  const wewn = rozmiar - margines * 2

  const skala = await sharp(znak.data)
    .resize(wewn, wewn, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width: w, height: h } = skala.info
  const px = skala.data

  // Maska jasnych pikseli znaku — to one wymagaja obrysu.
  const jasne = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    const r = px[i * 4]
    const g = px[i * 4 + 1]
    const b = px[i * 4 + 2]
    const a = px[i * 4 + 3]
    if (a > 128 && r > 170 && g > 170 && b > 170) jasne[i] = 1
  }

  // Grubosc obrysu proporcjonalna do rozmiaru, minimum 1 px.
  const grubosc = Math.max(1, Math.round(rozmiar / 22))
  const obrys = rozszerz(jasne, w, h, grubosc)

  // Warstwa obrysu: ciemny granat tam, gdzie maska urosla poza oryginal.
  const warstwa = Buffer.alloc(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    if (obrys[i]) {
      warstwa[i * 4] = 16
      warstwa[i * 4 + 1] = 30
      warstwa[i * 4 + 2] = 58
      warstwa[i * 4 + 3] = 255
    }
  }

  const podklad = await sharp(warstwa, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toBuffer()
  const wierzch = await sharp(skala.data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toBuffer()

  return sharp({
    create: { width: rozmiar, height: rozmiar, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: podklad, top: margines, left: margines },
      { input: wierzch, top: margines, left: margines },
    ])
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
  naglowek.writeUInt16LE(0, 0)
  naglowek.writeUInt16LE(1, 2)
  naglowek.writeUInt16LE(obrazy.length, 4)

  const wpisy = []
  let offset = 6 + obrazy.length * 16
  for (const { rozmiar, dane } of obrazy) {
    const w = Buffer.alloc(16)
    w.writeUInt8(rozmiar >= 256 ? 0 : rozmiar, 0)
    w.writeUInt8(rozmiar >= 256 ? 0 : rozmiar, 1)
    w.writeUInt8(0, 2)
    w.writeUInt8(0, 3)
    w.writeUInt16LE(1, 4)
    w.writeUInt16LE(32, 6)
    w.writeUInt32LE(dane.length, 8)
    w.writeUInt32LE(offset, 12)
    wpisy.push(w)
    offset += dane.length
  }

  return Buffer.concat([naglowek, ...wpisy, ...obrazy.map((o) => o.dane)])
}

await fs.writeFile(
  `${WYJSCIE}/favicon.ico`,
  zrobIco([
    { rozmiar: 16, dane: bufory[16] },
    { rozmiar: 32, dane: bufory[32] },
    { rozmiar: 48, dane: bufory[48] },
  ]),
)

console.log('zapisane: favicon.ico (16/32/48), PNG 16 i 32, apple-touch-icon, icon-512')
