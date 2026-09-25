'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ligaQuery } from '@/lib/liga'
import {
  klubBylWRegatach,
  klubyWszystkie,
  klubyZawodnika,
  opisRegat,
  rundyKlubu,
  rundyZawodnikaWKlubie,
  type Pozycja,
} from '@/lib/sprostowania'

export type TypWniosku = 'dodanie' | 'usuniecie'

/**
 * Listy do formularza sprostowań. Formularz jest publiczny, więc każda z tych
 * funkcji sama pilnuje sensu danych — nie ufamy temu, co przyszło z przeglądarki.
 */

export async function pobierzKluby(typ: TypWniosku, idZawodnika: number): Promise<Pozycja[]> {
  if (!Number.isFinite(idZawodnika) || idZawodnika <= 0) return []
  return typ === 'usuniecie' ? klubyZawodnika(idZawodnika) : klubyWszystkie()
}

export async function pobierzRundy(
  typ: TypWniosku,
  idZawodnika: number,
  idWariantu: number,
): Promise<Pozycja[]> {
  if (!Number.isFinite(idZawodnika) || !Number.isFinite(idWariantu)) return []
  if (idZawodnika <= 0 || idWariantu <= 0) return []
  return typ === 'usuniecie'
    ? rundyZawodnikaWKlubie(idZawodnika, idWariantu)
    : rundyKlubu(idWariantu, idZawodnika)
}

async function czyWystepJest(idZawodnika: number, idWariantu: number, idRegat: number): Promise<boolean> {
  const rows = await ligaQuery<{ ile: string }>(
    `SELECT count(*) AS ile FROM liga_wystepowanie_w_regatach
      WHERE id_zawodnika = $1 AND id_wariantu_klubu = $2 AND id_regat = $3`,
    [idZawodnika, idWariantu, idRegat],
  )
  return Number(rows[0]?.ile || 0) > 0
}

async function nazwaZawodnika(id: number): Promise<string> {
  const rows = await ligaQuery<{ imie: string; nazwisko: string }>(
    `SELECT imie, nazwisko FROM liga_zawodnik WHERE id_zawodnika = $1`,
    [id],
  )
  const r = rows[0]
  return r ? `${r.imie || ''} ${r.nazwisko || ''}`.trim() : `Zawodnik ${id}`
}

async function nazwaKlubu(id: number): Promise<string> {
  const rows = await ligaQuery<{ nazwa: string }>(
    `SELECT nazwa FROM liga_klubwariant WHERE id_wariantu_klubu = $1`,
    [id],
  )
  return rows[0]?.nazwa || `Klub ${id}`
}

export type WynikWyslania = { ok: boolean; blad?: string }

export async function wyslijSprostowanie(dane: {
  typ: TypWniosku
  zawodnikId: number
  wariantId: number
  regatyId: number
  kontakt?: string
  uwagi?: string
}): Promise<WynikWyslania> {
  const { typ, zawodnikId, wariantId, regatyId } = dane
  if (typ !== 'dodanie' && typ !== 'usuniecie') return { ok: false, blad: 'Nieznany rodzaj wniosku.' }
  if (![zawodnikId, wariantId, regatyId].every((n) => Number.isFinite(n) && n > 0)) {
    return { ok: false, blad: 'Uzupełnij wszystkie pola.' }
  }

  // Ten sam warunek, który odsiewa pozycje na listach — powtórzony przy zapisie,
  // bo listy przychodzą z przeglądarki i można je obejść.
  const jest = await czyWystepJest(zawodnikId, wariantId, regatyId)
  if (typ === 'dodanie') {
    if (jest) return { ok: false, blad: 'Ten występ już jest w bazie.' }
    if (!(await klubBylWRegatach(wariantId, regatyId))) {
      return { ok: false, blad: 'Ten klub nie startował w wybranej rundzie.' }
    }
  } else if (!jest) {
    return { ok: false, blad: 'Tego występu nie ma w bazie — nie ma czego usuwać.' }
  }

  const payload = await getPayload({ config })

  // Ten sam wniosek wysłany dwa razy nie ma po co czekać w kolejce drugi raz.
  const powtorka = await payload
    .find({
      collection: 'sprostowania' as any,
      where: {
        typ: { equals: typ },
        zawodnikId: { equals: zawodnikId },
        wariantId: { equals: wariantId },
        regatyId: { equals: regatyId },
        status: { equals: 'nowy' },
      },
      limit: 1,
      overrideAccess: true,
    })
    .catch(() => ({ docs: [] as any[] }))
  if (powtorka.docs.length) {
    return { ok: false, blad: 'Taki wniosek już czeka na rozpatrzenie.' }
  }

  try {
    await payload.create({
      collection: 'sprostowania' as any,
      data: {
        typ,
        status: 'nowy',
        zawodnikId,
        zawodnikNazwa: await nazwaZawodnika(zawodnikId),
        wariantId,
        klubNazwa: await nazwaKlubu(wariantId),
        regatyId,
        regatyOpis: await opisRegat(regatyId),
        kontakt: (dane.kontakt || '').slice(0, 200),
        uwagi: (dane.uwagi || '').slice(0, 2000),
        zastosowane: false,
      } as any,
      overrideAccess: true,
    })
    return { ok: true }
  } catch (err) {
    return { ok: false, blad: err instanceof Error ? err.message : String(err) }
  }
}
