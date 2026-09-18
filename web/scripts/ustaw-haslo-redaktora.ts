/**
 * Ustawienie hasła konta redaktora — do użytku na środowisku lokalnym.
 *
 * Konta w lokalnej bazie są niezależne od produkcyjnych: to osobna instalacja
 * Payloada, więc hasło z ligazeglarska.pl tutaj nie zadziała. Ten skrypt
 * pozwala ustawić lokalne hasło bez grzebania w tabeli — Payload sam je
 * zahashuje, tak samo jak przy zmianie hasła w panelu.
 *
 * Hasło podajesz w zmiennej środowiskowej, żeby nie wylądowało w kodzie:
 *
 *   docker exec -e EMAIL=twoj@email.pl -e HASLO='twoje-nowe-haslo' \
 *     plz-local-web-1 sh -c 'cd /app && npx payload run scripts/ustaw-haslo-redaktora.ts'
 *
 * Uwaga: polecenie trafia do historii powłoki. Jeśli to przeszkadza, wpisz je
 * ze spacją na początku (bash pomija wtedy wpis) albo potem wyczyść historię.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const email = process.env.EMAIL
const haslo = process.env.HASLO

if (!email || !haslo) {
  console.error('Podaj EMAIL i HASLO w zmiennych środowiskowych.')
  process.exit(1)
}

if (haslo.length < 8) {
  console.error('Hasło ma mieć co najmniej 8 znaków.')
  process.exit(1)
}

const payload = await getPayload({ config })

const znalezieni = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
})

const user = znalezieni.docs[0]
if (!user) {
  console.error(`Nie ma konta o adresie ${email}. Dostępne konta:`)
  const wszystkie = await payload.find({ collection: 'users', limit: 50, overrideAccess: true })
  for (const u of wszystkie.docs as any[]) console.error('  -', u.email)
  process.exit(1)
}

await payload.update({
  collection: 'users',
  id: (user as any).id,
  data: { password: haslo },
  overrideAccess: true,
})

console.log(`Hasło dla ${email} zostało ustawione. Możesz się zalogować w /redaktor/login.`)
process.exit(0)
