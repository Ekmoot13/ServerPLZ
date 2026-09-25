import { ligaQuery } from './liga'

/**
 * Listy do formularza sprostowań — zawodnicy, kluby i rundy.
 *
 * Formularz jest kaskadowy i celowo nie pozwala złożyć wniosku, który nie ma
 * sensu: przy dodawaniu występu pokazujemy wyłącznie te rundy, w których dany
 * klub naprawdę startował, a przy usuwaniu — wyłącznie te, w których zawodnik
 * faktycznie jest zapisany.
 */

export type Pozycja = { id: number; nazwa: string }

/**
 * „2026 runda 1 Sopot — 1 Liga".
 *
 * Poziom ligi na końcu nie jest ozdobą: ten sam zespół potrafi w jednym sezonie
 * jechać na dwóch poziomach (np. HRM Racing Youth w 2026 startował i w 1 Lidze,
 * i w Młodzieżowej), a wtedy „2026 runda 1 Sopot" wskazuje na dwie różne
 * regaty i nie da się ich rozróżnić.
 */
function opisRundy(rok: unknown, numer: unknown, miasto: unknown, poziom?: unknown): string {
  const czesci = [String(rok || '').trim()]
  if (numer != null && String(numer).trim() !== '') czesci.push(`runda ${numer}`)
  const m = String(miasto || '').trim()
  if (m) czesci.push(m)
  const opis = czesci.filter(Boolean).join(' ')
  const p = String(poziom || '').trim().replace(/^Youth$/i, 'Młodzieżowa')
  return p ? `${opis} — ${p}` : opis
}

/** Wszyscy zawodnicy z bazy wyników, alfabetycznie po nazwisku. */
export async function zawodnicyDoWyboru(): Promise<Pozycja[]> {
  const rows = await ligaQuery<{ id: number; imie: string; nazwisko: string }>(
    `SELECT id_zawodnika AS id, imie, nazwisko
       FROM liga_zawodnik
      ORDER BY nazwisko, imie`,
  )
  return rows.map((r) => ({
    id: Number(r.id),
    nazwa: `${r.nazwisko || ''} ${r.imie || ''}`.trim() || `Zawodnik ${r.id}`,
  }))
}

type WierszKlubu = { id: number; nazwa: string; poziomy: string; odRoku: number; doRoku: number }

/**
 * Ta sama nazwa zespołu potrafi należeć do kilku wariantów — „HRM Racing Youth"
 * istnieje osobno dla Młodzieżowej i dla 1 Ligi. Na liście wyglądałyby
 * identycznie, więc powtórzonym nazwom dopisujemy poziom i lata startów.
 * Nazwom unikalnym nic nie dopisujemy, żeby nie zaśmiecać listy.
 */
function rozroznijNazwy(rows: WierszKlubu[]): Pozycja[] {
  const ile = new Map<string, number>()
  for (const r of rows) ile.set(r.nazwa, (ile.get(r.nazwa) || 0) + 1)

  return rows.map((r) => {
    const nazwa = r.nazwa || `Klub ${r.id}`
    if ((ile.get(r.nazwa) || 0) < 2) return { id: Number(r.id), nazwa }
    const poziom = String(r.poziomy || '').replace(/Youth/gi, 'Młodzieżowa')
    const lata = r.odRoku === r.doRoku ? String(r.odRoku) : `${r.odRoku}–${r.doRoku}`
    const dopisek = [poziom, lata].filter(Boolean).join(', ')
    return { id: Number(r.id), nazwa: dopisek ? `${nazwa} (${dopisek})` : nazwa }
  })
}

/**
 * Kluby do wyboru przy DODAWANIU występu — wszystkie, które kiedykolwiek
 * startowały. Zawodnika w nich jeszcze nie ma, więc nie mamy po czym filtrować.
 */
export async function klubyWszystkie(): Promise<Pozycja[]> {
  const rows = await ligaQuery<WierszKlubu>(
    `SELECT kw.id_wariantu_klubu AS id, kw.nazwa,
            string_agg(DISTINCT r.liga_poziom, ', ') AS poziomy,
            min(r.rok) AS "odRoku", max(r.rok) AS "doRoku"
       FROM liga_klubwariant kw
       JOIN liga_wynikregatmanual m ON m.id_wariantu_klubu = kw.id_wariantu_klubu
       JOIN liga_regaty r ON r.id_regat = m.regaty
      GROUP BY kw.id_wariantu_klubu, kw.nazwa
      ORDER BY kw.nazwa`,
  )
  return rozroznijNazwy(rows)
}

/** Kluby, w których zawodnik już figuruje — do USUWANIA występu. */
export async function klubyZawodnika(idZawodnika: number): Promise<Pozycja[]> {
  const rows = await ligaQuery<WierszKlubu>(
    `SELECT kw.id_wariantu_klubu AS id, kw.nazwa,
            string_agg(DISTINCT r.liga_poziom, ', ') AS poziomy,
            min(r.rok) AS "odRoku", max(r.rok) AS "doRoku"
       FROM liga_wystepowanie_w_regatach w
       JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = w.id_wariantu_klubu
       JOIN liga_regaty r ON r.id_regat = w.id_regat
      WHERE w.id_zawodnika = $1
      GROUP BY kw.id_wariantu_klubu, kw.nazwa
      ORDER BY kw.nazwa`,
    [idZawodnika],
  )
  return rozroznijNazwy(rows)
}

/**
 * Rundy, w których startował dany klub — do DODAWANIA występu.
 *
 * Udział klubu bierzemy z tabeli wyników regat: jeśli klub ma tam wpis, to
 * znaczy, że w tych regatach był. Rundy, w których zawodnik już jest zapisany,
 * odpadają — nie ma sensu prosić o coś, co w bazie stoi.
 */
export async function rundyKlubu(idWariantu: number, idZawodnika: number): Promise<Pozycja[]> {
  const rows = await ligaQuery<{ id: number; rok: number; numer: number; miasto: string; poziom: string }>(
    `SELECT r.id_regat AS id, r.rok, r.numer_rundy AS numer, r.miasto, r.liga_poziom AS poziom
       FROM liga_wynikregatmanual m
       JOIN liga_regaty r ON r.id_regat = m.regaty
      WHERE m.id_wariantu_klubu = $1
        AND NOT EXISTS (
          SELECT 1 FROM liga_wystepowanie_w_regatach w
           WHERE w.id_regat = r.id_regat
             AND w.id_wariantu_klubu = $1
             AND w.id_zawodnika = $2
        )
      GROUP BY r.id_regat, r.rok, r.numer_rundy, r.miasto, r.liga_poziom
      ORDER BY r.rok DESC, r.numer_rundy`,
    [idWariantu, idZawodnika],
  )
  return rows.map((r) => ({ id: Number(r.id), nazwa: opisRundy(r.rok, r.numer, r.miasto, r.poziom) }))
}

/** Rundy, w których zawodnik figuruje w danym klubie — do USUWANIA występu. */
export async function rundyZawodnikaWKlubie(idZawodnika: number, idWariantu: number): Promise<Pozycja[]> {
  const rows = await ligaQuery<{ id: number; rok: number; numer: number; miasto: string; poziom: string }>(
    `SELECT DISTINCT r.id_regat AS id, r.rok, r.numer_rundy AS numer, r.miasto, r.liga_poziom AS poziom
       FROM liga_wystepowanie_w_regatach w
       JOIN liga_regaty r ON r.id_regat = w.id_regat
      WHERE w.id_zawodnika = $1 AND w.id_wariantu_klubu = $2
      ORDER BY r.rok DESC, r.numer_rundy`,
    [idZawodnika, idWariantu],
  )
  return rows.map((r) => ({ id: Number(r.id), nazwa: opisRundy(r.rok, r.numer, r.miasto, r.poziom) }))
}

/** Opis rundy po identyfikatorze — do zapisania obok wniosku. */
export async function opisRegat(idRegat: number): Promise<string> {
  const rows = await ligaQuery<{ rok: number; numer: number; miasto: string; poziom: string }>(
    `SELECT rok, numer_rundy AS numer, miasto, liga_poziom AS poziom FROM liga_regaty WHERE id_regat = $1`,
    [idRegat],
  )
  const r = rows[0]
  return r ? opisRundy(r.rok, r.numer, r.miasto, r.poziom) : `Regaty ${idRegat}`
}

/** Czy klub faktycznie startował w tych regatach — ostatnie sito przed zapisem. */
export async function klubBylWRegatach(idWariantu: number, idRegat: number): Promise<boolean> {
  const rows = await ligaQuery<{ ile: string }>(
    `SELECT count(*) AS ile FROM liga_wynikregatmanual
      WHERE id_wariantu_klubu = $1 AND regaty = $2`,
    [idWariantu, idRegat],
  )
  return Number(rows[0]?.ile || 0) > 0
}
