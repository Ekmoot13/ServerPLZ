import { getPayload } from 'payload'
import config from '@payload-config'
import { FLAGI } from '@/components/Flagi'

/**
 * Przełączanie sygnału flagowego — wspólne dla panelu i dla aplikacji
 * na telefonie, bo zasada jest ta sama niezależnie od tego, kto klika.
 *
 * Podniesiona może być tylko jedna flaga. Ponowne kliknięcie tej samej ją
 * opuszcza, a kliknięcie innej po prostu ją zmienia — tak jak na maszcie,
 * gdzie jeden sygnał zastępuje drugi.
 *
 * Stan czytamy z bazy tuż przed zapisem, więc dwa telefony nie zgaszą sobie
 * nawzajem świeżego sygnału na podstawie nieaktualnego obrazu ekranu.
 */
export function poprawnaFlaga(kod: unknown): string {
  const k = String(kod || '').toUpperCase()
  return FLAGI.some((f) => f.kod === k) ? k : ''
}

export async function pobierzFlage(): Promise<string> {
  const payload = await getPayload({ config })
  const s: any = await payload.findGlobal({ slug: 'strefa-kibica' }).catch(() => null)
  return poprawnaFlaga(s?.flaga)
}

export async function przelaczFlageWBazie(kod: string): Promise<{ flaga: string }> {
  const nowa = poprawnaFlaga(kod)
  if (!nowa) return { flaga: await pobierzFlage() }

  const payload = await getPayload({ config })
  const s: any = await payload.findGlobal({ slug: 'strefa-kibica' }).catch(() => null)
  const obecna = poprawnaFlaga(s?.flaga)
  const docelowa = obecna === nowa ? '' : nowa

  await payload.updateGlobal({
    slug: 'strefa-kibica',
    data: { flaga: docelowa } as any,
    overrideAccess: true,
  })
  return { flaga: docelowa }
}
