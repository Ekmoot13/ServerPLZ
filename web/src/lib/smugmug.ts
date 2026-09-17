/**
 * Zdjęcia z galerii SmugMug — bez klucza API.
 *
 * SmugMug ma wprawdzie API v2, ale wymaga ono klucza i podpisu OAuth. Strona
 * galerii dociąga zdjęcia zwykłym, publicznym endpointem `services/api/json`,
 * i to samo robimy tutaj: najpierw czytamy stronę galerii, żeby wyjąć z niej
 * identyfikatory albumu, potem pytamy o listę zdjęć.
 *
 * Dwie pułapki:
 * - SmugMug odrzuca żądania bez nagłówków przeglądarki (403), więc je wysyłamy;
 * - w HTML-u galerii jest kilka różnych „AlbumID", należących do zdjęć
 *   pochodzących z innych albumów. Bierzemy więc komplet parametrów z bloku
 *   `galleryRequestData`, z którego SmugMug sam buduje swoje zapytanie.
 *
 * Funkcja zwraca pustą listę zamiast rzucać — sekcja galerii nie może położyć
 * Strefy Kibica przez awarię cudzego serwisu. Odpowiedzi cache'ujemy na 15 minut.
 */

export type ZdjecieGalerii = {
  /** Miniatura do pokazania na stronie. */
  obraz: string
  /** Adres zdjęcia w SmugMug — tam prowadzi kliknięcie. */
  link: string
  /** Podpis albo nazwa albumu źródłowego (zwykle zawiera autora zdjęcia). */
  opis: string
}

const CACHE = { next: { revalidate: 900 } } as const

const NAGLOWKI: Record<string, string> = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'pl-PL,pl;q=0.9,en;q=0.8',
}

type DaneGalerii = {
  galleryType?: string
  albumId?: number
  albumKey?: string
  nodeId?: string
}

async function daneGalerii(urlGalerii: string): Promise<DaneGalerii | null> {
  try {
    const r = await fetch(urlGalerii, { ...CACHE, headers: NAGLOWKI })
    if (!r.ok) return null
    const html = await r.text()
    const m = html.match(/"galleryRequestData"\s*:\s*(\{[^{}]*\})/)
    if (!m) return null
    const d = JSON.parse(m[1]) as DaneGalerii
    return d?.albumId && d?.albumKey ? d : null
  } catch {
    return null
  }
}

/** Największa miniatura, która nie jest od razu zdjęciem w pełnej rozdzielczości. */
function miniatura(sizes: any): string {
  for (const k of ['L', 'M', 'X2', 'S']) {
    const s = sizes?.[k]
    if (s?.usable && typeof s?.url === 'string') return s.url
  }
  return ''
}

type Strona = { images: any[]; totalPages: number }

async function pobierzStrone(
  origin: string,
  dane: DaneGalerii,
  numer: number,
  rozmiar: number,
): Promise<Strona | null> {
  const q = new URLSearchParams({
    galleryType: dane.galleryType || 'album',
    albumId: String(dane.albumId),
    albumKey: String(dane.albumKey),
    nodeId: dane.nodeId || '',
    PageNumber: String(numer),
    imageId: '0',
    imageKey: '',
    returnModelList: 'true',
    PageSize: String(rozmiar),
    imageSizes: 'M,L',
    method: 'rpc.gallery.getalbum',
  })

  try {
    const r = await fetch(`${origin}/services/api/json/1.4.0/?${q}`, {
      ...CACHE,
      headers: { ...NAGLOWKI, accept: 'application/json,*/*' },
    })
    if (!r.ok) return null
    const d = await r.json()
    if (d?.stat !== 'ok' || !Array.isArray(d?.Images)) return null
    return { images: d.Images, totalPages: Number(d?.Pagination?.TotalPages) || 1 }
  } catch {
    return null
  }
}

/**
 * @param odKonca SmugMug zwraca zdjęcia w kolejności ustawionej w galerii, a ta
 *   zwykle idzie od najstarszych. Żeby pokazać najnowsze, sięgamy na koniec
 *   albumu; ostatnia strona bywa niepełna, więc w razie potrzeby dobieramy
 *   przedostatnią.
 */
export async function pobierzZdjeciaSmugMug(
  urlGalerii: string,
  ile = 4,
  odKonca = true,
): Promise<ZdjecieGalerii[]> {
  if (!urlGalerii) return []

  let origin: string
  try {
    origin = new URL(urlGalerii).origin
  } catch {
    return []
  }

  const dane = await daneGalerii(urlGalerii)
  if (!dane) return []

  const rozmiar = Math.min(Math.max(ile, 1), 24)
  const pierwsza = await pobierzStrone(origin, dane, 1, rozmiar)
  if (!pierwsza) return []

  let surowe = pierwsza.images
  if (odKonca && pierwsza.totalPages > 1) {
    const ostatnia = await pobierzStrone(origin, dane, pierwsza.totalPages, rozmiar)
    if (ostatnia) {
      surowe = ostatnia.images
      if (surowe.length < rozmiar && pierwsza.totalPages > 2) {
        const wczesniejsza = await pobierzStrone(origin, dane, pierwsza.totalPages - 1, rozmiar)
        if (wczesniejsza) surowe = [...wczesniejsza.images, ...surowe]
      }
    }
  }

  const zdjecia = surowe
    .filter((i) => !i?.IsVideo)
    .map((i) => ({
      obraz: miniatura(i?.Sizes),
      link: i?.LightboxUrl || i?.GalleryUrl || urlGalerii,
      opis: i?.CaptionText || i?.Title || i?.PhotoBy?.album?.name || '',
    }))
    .filter((z) => z.obraz)

  // Od końca: ostatnie zdjęcie albumu jest najnowsze, więc idzie na początek.
  return odKonca ? zdjecia.slice(-ile).reverse() : zdjecia.slice(0, ile)
}
