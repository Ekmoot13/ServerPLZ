/**
 * Odświeża tytuł i treść banera „REGATY JAK NA STADIONIE" w globalu strona-glowna.
 * Stary seed zapisał wersję bez pogrubień — ten skrypt wgrywa treść z <strong>,
 * zgodną z ligazeglarska.pl. Pozostałych pól globala nie rusza.
 *
 * Uruchomienie w kontenerze web:
 *   npm run payload -- run scripts/seed-wprowadzenie.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { REGATY_TEKST, REGATY_TYTUL } from '../src/lib/wprowadzenie'

console.log('== START: treść banera wprowadzenia ==')
const payload = await getPayload({ config })

const obecny: any = await payload.findGlobal({ slug: 'strona-glowna' as any })

await payload.updateGlobal({
  slug: 'strona-glowna' as any,
  data: {
    wprowadzenie: {
      ...(obecny?.wprowadzenie || {}),
      tytul: REGATY_TYTUL,
      tekst: REGATY_TEKST,
    },
  } as any,
  overrideAccess: true,
})

const po: any = await payload.findGlobal({ slug: 'strona-glowna' as any })
const akapity = String(po?.wprowadzenie?.tekst || '').split(/\n\s*\n/).filter(Boolean)
const pogrubienia = (String(po?.wprowadzenie?.tekst || '').match(/<strong>/g) || []).length
console.log(`Zapisano: ${akapity.length} akapity, ${pogrubienia} pogrubień.`)
process.exit(0)
