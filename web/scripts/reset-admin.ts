/**
 * Tworzy lub resetuje konto administratora Payload.
 * Podaj dane przez zmienne środowiskowe ADMIN_EMAIL i ADMIN_PASSWORD.
 *
 * Uruchomienie (lokalnie):
 *   docker compose -f docker-compose.local.yml exec \
 *     -e ADMIN_EMAIL=twoj@email.pl -e ADMIN_PASSWORD='NoweHaslo123' \
 *     web npm run payload -- run scripts/reset-admin.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  console.error('Brak ADMIN_EMAIL lub ADMIN_PASSWORD.')
  process.exit(1)
}

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
})

if (existing.docs.length > 0) {
  await payload.update({
    collection: 'users',
    id: (existing.docs[0] as any).id,
    data: { password, rola: 'admin' },
    overrideAccess: true,
  })
  console.log(`Zaktualizowano hasło i rolę admina dla: ${email}`)
} else {
  await payload.create({
    collection: 'users',
    data: { email, password, rola: 'admin', name: 'Administrator' } as any,
    overrideAccess: true,
  })
  console.log(`Utworzono administratora: ${email}`)
}

process.exit(0)
