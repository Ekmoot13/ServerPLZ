/**
 * Dane startowe dla środowiska LOKALNEGO (docker-compose.local.yml).
 *
 * Świeża lokalna baza jest pusta — nie ma konta, więc nie da się wejść do
 * panelu, ani wpisu, na którym można by sprawdzić edytor. Ten skrypt zakłada
 * konto redaktora oraz dwa wpisy: szkic i opublikowany, bo edytor zachowuje się
 * inaczej w każdym z tych stanów (szkic zapisuje się sam, opublikowany czeka
 * na przycisk).
 *
 * NIE URUCHAMIAĆ NA PRODUKCJI — hasło podajesz w zmiennej środowiskowej i jest
 * z założenia jednorazowe.
 *
 *   docker compose -f docker-compose.local.yml exec \
 *     -e EMAIL=redaktor@plz.test -e HASLO='...' \
 *     web npx payload run scripts/dane-testowe-lokalnie.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

// Payload sprawdza format adresu, więc „@localhost” bez domeny nie przechodzi.
const email = process.env.EMAIL || 'redaktor@plz.test'
const haslo = process.env.HASLO

if (!haslo || haslo.length < 8) {
  console.error('Podaj HASLO (min. 8 znaków) w zmiennej środowiskowej.')
  process.exit(1)
}

const payload = await getPayload({ config })

// --- konto ------------------------------------------------------------------
const sa = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
})
if (sa.docs.length) {
  await payload.update({
    collection: 'users',
    id: (sa.docs[0] as any).id,
    data: { password: haslo },
    overrideAccess: true,
  })
  console.log(`Zaktualizowano hasło konta ${email}`)
} else {
  await payload.create({
    collection: 'users',
    data: { email, password: haslo, name: 'Redaktor lokalny' } as any,
    overrideAccess: true,
  })
  console.log(`Założono konto ${email}`)
}

// --- kategoria --------------------------------------------------------------
const kat = await payload.find({
  collection: 'categories',
  where: { title: { equals: 'Ekstraklasa' } },
  limit: 1,
  overrideAccess: true,
})
const katId =
  (kat.docs[0] as any)?.id ||
  (await payload.create({ collection: 'categories', data: { title: 'Ekstraklasa' }, overrideAccess: true })).id

// --- wpisy ------------------------------------------------------------------
const TRESC = `<h2>Śródtytuł na rozgrzewkę</h2>
<p>Akapit z <strong>pogrubieniem</strong>, <em>kursywą</em> i <a href="/wyniki">odnośnikiem wewnętrznym</a>.</p>
<ul><li>pierwszy punkt</li><li>drugi punkt</li></ul>
<table><tbody><tr><th>Runda</th><th>Miasto</th></tr><tr><td>1</td><td>Sopot</td></tr></tbody></table>`

const wpisy = [
  { title: '[TEST] Szkic do sprawdzenia autozapisu', slug: 'test-szkic', _status: 'draft' },
  { title: '[TEST] Wpis opublikowany', slug: 'test-opublikowany', _status: 'published' },
]

for (const w of wpisy) {
  const jest = await payload.find({
    collection: 'posts',
    where: { slug: { equals: w.slug } },
    limit: 1,
    overrideAccess: true,
  })
  if (jest.docs.length) {
    console.log(`Wpis "${w.title}" już jest — pomijam`)
    continue
  }
  await payload.create({
    collection: 'posts',
    data: {
      title: w.title,
      slug: w.slug,
      trescHtml: TRESC,
      categories: [katId],
      publishedAt: new Date().toISOString(),
      _status: w._status,
    } as any,
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  console.log(`Dodano wpis "${w.title}"`)
}

console.log('Gotowe. Zaloguj się na /redaktor/login')
process.exit(0)
