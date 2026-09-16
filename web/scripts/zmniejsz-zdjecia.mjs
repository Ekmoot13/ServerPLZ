import sharp from 'sharp'
import { readdir, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'

const WE = '/zdjecia-in'
const WY = '/zdjecia-out'
const MAX = 800

await mkdir(WY, { recursive: true })
const pliki = (await readdir(WE)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))

let przed = 0
let po = 0
let bledy = 0

for (const f of pliki) {
  const we = path.join(WE, f)
  const wy = path.join(WY, f.replace(/\.(png|webp)$/i, '.jpg'))
  try {
    przed += (await stat(we)).size
    await sharp(we)
      .rotate() // uwzglednij orientacje EXIF
      .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(wy)
    po += (await stat(wy)).size
  } catch (e) {
    bledy++
    console.log('BLAD:', f, e.message)
  }
}

const mb = (b) => (b / 1048576).toFixed(1) + ' MB'
console.log(`plikow: ${pliki.length}, bledow: ${bledy}`)
console.log(`przed: ${mb(przed)}  ->  po: ${mb(po)}`)
