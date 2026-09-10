/**
 * Wypełnia sekcję „Sponsorzy" globala strona-glowna jednolitymi, lokalnymi logotypami
 * (w tierach, każdy ze skalą 100%). Uruchamia też push schematu (dodaje pole `skala`).
 *
 * Uruchomienie w kontenerze web:
 *   npm run payload -- run scripts/seed-sponsorzy.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { DEFAULT_GRUPY } from '../src/lib/sponsorzy'

console.log('== START seed sponsorów ==')
const payload = await getPayload({ config })

await payload.updateGlobal({
  slug: 'strona-glowna',
  data: {
    sponsorzy: {
      tytul: 'Sponsorzy',
      grupy: DEFAULT_GRUPY,
    },
  } as any,
  overrideAccess: true,
})

console.log(`Sponsorzy: zapisano ${DEFAULT_GRUPY.length} grup, ${DEFAULT_GRUPY.reduce((n, g) => n + g.loga.length, 0)} logotypów.`)
process.exit(0)
