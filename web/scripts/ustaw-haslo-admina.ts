/**
 * Ustawia nowe hasło konta panelu (Payload zapisuje je jako skrót — nie da się go odczytać).
 * Hasło podajesz w zmiennej środowiskowej, żeby nie wylądowało w argumentach polecenia.
 *
 * Uruchomienie w kontenerze web (na serwerze, z /opt/ServerPLZ):
 *   docker compose -f docker-compose.prod.yml exec \
 *     -e NOWE_HASLO='twoje-nowe-haslo' \
 *     -e EMAIL_ADMINA='tommy@ligazeglarska.pl' \
 *     web npm run payload -- run scripts/ustaw-haslo-admina.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const email = process.env.EMAIL_ADMINA
const haslo = process.env.NOWE_HASLO

if (!email || !haslo) {
  console.error('Brak EMAIL_ADMINA lub NOWE_HASLO w zmiennych środowiskowych.')
  process.exit(1)
}
if (haslo.length < 8) {
  console.error('Hasło musi mieć co najmniej 8 znaków.')
  process.exit(1)
}

const payload = await getPayload({ config })

const res = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
})
const user = res.docs?.[0]
if (!user) {
  console.error(`Nie znaleziono konta o adresie ${email}.`)
  process.exit(1)
}

await payload.update({
  collection: 'users',
  id: user.id,
  data: { password: haslo },
  overrideAccess: true,
})

// Zerujemy licznik nieudanych logowań, gdyby konto było zablokowane.
await payload.update({
  collection: 'users',
  id: user.id,
  data: { loginAttempts: 0, lockUntil: null } as any,
  overrideAccess: true,
})

console.log(`Hasło konta ${email} zostało zmienione.`)
process.exit(0)
