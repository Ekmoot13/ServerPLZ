// Warstwa dostępu do danych ligowych (tabele liga_* w schemacie public, PostgreSQL).
// Port logiki short-code'ów WordPress (Zawodnik: starty, sezony, medale) na SQL/TS.
// UWAGA: po konwersji z MySQL nazwy tabel/kolumn są małymi literami (bez cudzysłowów).
import { Pool } from 'pg'

const g = globalThis as unknown as { __ligaPool?: Pool }

export const ligaPool: Pool =
  g.__ligaPool ||
  (g.__ligaPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
  }))

export async function ligaQuery<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await ligaPool.query(text, params)
  return res.rows as T[]
}

// --- slug zawodnika: jak sanitize_title("Nazwisko Imie") -> "nazwisko-imie" ---
export function normalizeForSlug(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // usuń znaki diakrytyczne
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function zawodnikSlug(nazwisko?: string, imie?: string): string {
  return normalizeForSlug(`${nazwisko || ''} ${imie || ''}`)
}

// --- Typy ---
export type ZawodnikListItem = {
  id: number
  imie: string
  nazwisko: string
  slug: string
  starty: number
}

export type StartRow = {
  rok: number
  regaty: string
  miasto: string
  klub: string
  miejsce: string // liczba lub "Brak danych"
}

export type SezonRow = {
  rok: number
  poziom: string
  klub: string
  miejsce: number
}

export type Medale = { zlote: number; srebrne: number; brazowe: number; suma: number }

// --- Lista zawodników (do strony /zawodnicy z wyszukiwarką) ---
export async function getZawodnicy(): Promise<ZawodnikListItem[]> {
  const rows = await ligaQuery<{ id_zawodnika: number; imie: string; nazwisko: string; starty: string }>(
    `SELECT z.id_zawodnika, z.imie, z.nazwisko, COUNT(wr.id_wystepowania) AS starty
     FROM liga_zawodnik z
     LEFT JOIN liga_wystepowanie_w_regatach wr ON wr.id_zawodnika = z.id_zawodnika
     GROUP BY z.id_zawodnika, z.imie, z.nazwisko
     ORDER BY z.nazwisko ASC, z.imie ASC`,
  )
  return rows.map((r) => ({
    id: r.id_zawodnika,
    imie: r.imie || '',
    nazwisko: r.nazwisko || '',
    slug: zawodnikSlug(r.nazwisko, r.imie),
    starty: Number(r.starty) || 0,
  }))
}

// --- Znajdź zawodnika po slug (dopasowanie po znormalizowanej nazwie) ---
export async function findZawodnikBySlug(
  slug: string,
): Promise<{ id: number; imie: string; nazwisko: string } | null> {
  const rows = await ligaQuery<{ id_zawodnika: number; imie: string; nazwisko: string }>(
    `SELECT id_zawodnika, imie, nazwisko FROM liga_zawodnik`,
  )
  for (const r of rows) {
    const s1 = zawodnikSlug(r.nazwisko, r.imie)
    const s2 = zawodnikSlug(r.imie, r.nazwisko)
    if (s1 === slug || s2 === slug) {
      return { id: r.id_zawodnika, imie: r.imie || '', nazwisko: r.nazwisko || '' }
    }
  }
  return null
}

// --- Lista startów zawodnika (short-code: wyniki_zawodnika) ---
export async function getStartyZawodnika(idZawodnika: number): Promise<StartRow[]> {
  const rows = await ligaQuery<{
    rok: number
    regaty: string
    miasto: string
    klub: string
    miejsce: string | null
  }>(
    `SELECT
        r.rok AS rok,
        r.nazwa AS regaty,
        r.miasto AS miasto,
        COALESCE(m.nazwa_manual, kw.nazwa) AS klub,
        COALESCE(m.miejsce::text, wr.wynikwregatach::text, 'Brak danych') AS miejsce
     FROM liga_wystepowanie_w_regatach wr
     JOIN liga_regaty r ON r.id_regat = wr.id_regat
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = wr.id_wariantu_klubu
     LEFT JOIN (
        SELECT wrm.regaty AS id_regat, kw2.skrot, wrm.miejscewregatach AS miejsce, kw2.nazwa AS nazwa_manual
        FROM liga_wynikregatmanual wrm
        JOIN liga_klubwariant kw2 ON kw2.id_wariantu_klubu = wrm.id_wariantu_klubu
     ) m ON m.id_regat = wr.id_regat AND m.skrot = kw.skrot
     WHERE wr.id_zawodnika = $1
     ORDER BY r.rok DESC, r.nazwa ASC`,
    [idZawodnika],
  )
  return rows.map((r) => ({
    rok: Number(r.rok) || 0,
    regaty: (r.regaty || '').replace('Youth', 'Młodzieżowa'),
    miasto: r.miasto || '',
    klub: (r.klub || '').trim(),
    miejsce: r.miejsce == null ? 'Brak danych' : String(r.miejsce),
  }))
}

// --- Medale zawodnika (short-code: medale_zawodnika) ---
export async function getMedaleZawodnika(idZawodnika: number): Promise<Medale> {
  const rows = await ligaQuery<{ zlote: string; srebrne: string; brazowe: string }>(
    `SELECT
        SUM(CASE WHEN m.miejscewregatach = 1 THEN 1 ELSE 0 END) AS zlote,
        SUM(CASE WHEN m.miejscewregatach = 2 THEN 1 ELSE 0 END) AS srebrne,
        SUM(CASE WHEN m.miejscewregatach = 3 THEN 1 ELSE 0 END) AS brazowe
     FROM liga_wystepowanie_w_regatach wr
     JOIN liga_klubwariant kw_player ON kw_player.id_wariantu_klubu = wr.id_wariantu_klubu
     JOIN liga_wynikregatmanual m ON m.regaty = wr.id_regat
     JOIN liga_klubwariant kw_result ON kw_result.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE wr.id_zawodnika = $1 AND kw_player.skrot = kw_result.skrot`,
    [idZawodnika],
  )
  const r = rows[0] || { zlote: '0', srebrne: '0', brazowe: '0' }
  const zlote = Number(r.zlote) || 0
  const srebrne = Number(r.srebrne) || 0
  const brazowe = Number(r.brazowe) || 0
  return { zlote, srebrne, brazowe, suma: zlote + srebrne + brazowe }
}

// --- Historia sezonów zawodnika (short-code: podsumowanie_sezonu_zawodnika) ---
// Ranking sezonowy metodą High Point (max flota - miejsce + 1; +1 gdy rok<=2017 i 1. miejsce).
export async function getSezonyZawodnika(idZawodnika: number): Promise<SezonRow[]> {
  // A) sezony i skróty klubów, w których pływał zawodnik
  const teams = await ligaQuery<{ rok: number; liga_poziom: string; skrot: string }>(
    `SELECT DISTINCT r.rok, r.liga_poziom, kw.skrot
     FROM liga_wystepowanie_w_regatach wr
     JOIN liga_regaty r ON r.id_regat = wr.id_regat
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = wr.id_wariantu_klubu
     WHERE wr.id_zawodnika = $1`,
    [idZawodnika],
  )
  if (teams.length === 0) return []

  const playerSeasonSkroty = new Map<string, string[]>()
  const seasonsSet = new Set<string>()
  for (const t of teams) {
    if (t.rok == null || t.liga_poziom == null) continue
    const key = `${t.rok}|${t.liga_poziom}`
    if (!playerSeasonSkroty.has(key)) playerSeasonSkroty.set(key, [])
    playerSeasonSkroty.get(key)!.push(t.skrot)
    seasonsSet.add(key)
  }
  const seasonKeys = [...seasonsSet]
  if (seasonKeys.length === 0) return []

  // B) wszystkie wyniki (cała flota) w tych sezonach
  const raw = await ligaQuery<{
    rok: number
    liga_poziom: string
    id_regat: number
    klubnazwa: string
    klubskrot: string
    miejsce: number
  }>(
    `SELECT r.rok, r.liga_poziom, r.id_regat,
            kw.nazwa AS klubnazwa, kw.skrot AS klubskrot,
            m.miejscewregatach AS miejsce
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE (r.rok || '|' || r.liga_poziom) = ANY($1) AND m.miejscewregatach > 0`,
    [seasonKeys],
  )
  if (raw.length === 0) return []

  // a) liczebność floty na rundę
  const boatsPerRound = new Map<number, number>()
  for (const row of raw) {
    boatsPerRound.set(row.id_regat, (boatsPerRound.get(row.id_regat) || 0) + 1)
  }
  // b) maks. flota w sezonie
  const seasonMaxFleet = new Map<string, number>()
  for (const row of raw) {
    const sk = `${row.rok}|${row.liga_poziom}`
    seasonMaxFleet.set(sk, Math.max(seasonMaxFleet.get(sk) || 0, boatsPerRound.get(row.id_regat) || 0))
  }
  // c) sumowanie punktów per sezon per skrót klubu
  type Team = { punkty: number; miejsca: number[]; nazwa: string; skrot: string }
  const sezony = new Map<string, Map<string, Team>>()
  for (const row of raw) {
    const sk = `${row.rok}|${row.liga_poziom}`
    const teamKey = row.klubskrot
    if (!sezony.has(sk)) sezony.set(sk, new Map())
    const bucket = sezony.get(sk)!
    if (!bucket.has(teamKey)) {
      bucket.set(teamKey, { punkty: 0, miejsca: [], nazwa: row.klubnazwa, skrot: row.klubskrot })
    }
    const m = Number(row.miejsce)
    let pkt = (seasonMaxFleet.get(sk) || 0) - m + 1
    if (Number(row.rok) <= 2017 && m === 1) pkt += 1
    const team = bucket.get(teamKey)!
    team.punkty += pkt
    team.miejsca.push(m)
    team.nazwa = row.klubnazwa
  }

  // d) ranking sezonu + odnalezienie klubów zawodnika
  const out: SezonRow[] = []
  for (const [sk, bucket] of sezony) {
    const teamsArr = [...bucket.values()]
    teamsArr.sort((a, b) => {
      if (a.punkty !== b.punkty) return b.punkty - a.punkty
      // tie-break: więcej lepszych miejsc
      const cA = countPlaces(a.miejsca)
      const cB = countPlaces(b.miejsca)
      for (let i = 1; i <= 50; i++) {
        const d = (cB.get(i) || 0) - (cA.get(i) || 0)
        if (d !== 0) return d
      }
      return 0
    })
    const [rokStr, liga] = sk.split('|')
    const playerSkroty = playerSeasonSkroty.get(sk) || []
    let rank = 1
    for (const t of teamsArr) {
      if (playerSkroty.includes(t.skrot)) {
        out.push({ rok: Number(rokStr), poziom: liga, klub: t.nazwa, miejsce: rank })
      }
      rank++
    }
  }
  out.sort((a, b) => b.rok - a.rok)
  return out
}

function countPlaces(miejsca: number[]): Map<number, number> {
  const m = new Map<number, number>()
  for (const x of miejsca) m.set(x, (m.get(x) || 0) + 1)
  return m
}

// ============================ KLUBY ============================

export type KlubListItem = {
  id: number
  nazwa: string
  slug: string
  zawodnicy: number
}

export type SkladPlayer = {
  id: number
  imie: string
  nazwisko: string
  slug: string
  starty: number
  ligi: string
}

export type KlubSezonRow = {
  rok: number
  poziom: string
  klub: string
  miejsce: number
}

export function klubSlug(nazwa?: string): string {
  return normalizeForSlug(nazwa || '')
}

// --- Lista klubów (zestawienia) do /kluby z wyszukiwarką ---
export async function getKluby(): Promise<KlubListItem[]> {
  const rows = await ligaQuery<{ id: number; nazwa: string; zawodnicy: string }>(
    `SELECT zk.id_zestawienia_klubow AS id, zk.nazwa,
            COUNT(DISTINCT wr.id_zawodnika) AS zawodnicy
     FROM liga_zestawienieklubow zk
     LEFT JOIN liga_klubwariant kw ON kw.id_zestawienia_klubow = zk.id_zestawienia_klubow
     LEFT JOIN liga_wystepowanie_w_regatach wr ON wr.id_wariantu_klubu = kw.id_wariantu_klubu
     GROUP BY zk.id_zestawienia_klubow, zk.nazwa
     ORDER BY zk.nazwa ASC`,
  )
  return rows.map((r) => ({
    id: r.id,
    nazwa: r.nazwa || '',
    slug: klubSlug(r.nazwa),
    zawodnicy: Number(r.zawodnicy) || 0,
  }))
}

export async function findKlubBySlug(slug: string): Promise<{ id: number; nazwa: string } | null> {
  const rows = await ligaQuery<{ id_zestawienia_klubow: number; nazwa: string }>(
    `SELECT id_zestawienia_klubow, nazwa FROM liga_zestawienieklubow`,
  )
  for (const r of rows) {
    if (klubSlug(r.nazwa) === slug) return { id: r.id_zestawienia_klubow, nazwa: r.nazwa || '' }
  }
  return null
}

// --- Skład klubu z ostatniego roku (short-code: sklad_klubu) ---
export async function getSkladKlubu(
  idZestawienia: number,
): Promise<{ rok: number | null; players: SkladPlayer[] }> {
  const rokRows = await ligaQuery<{ rok: number }>(
    `SELECT MAX(r.rok) AS rok
     FROM liga_wystepowanie_w_regatach wr
     JOIN liga_regaty r ON r.id_regat = wr.id_regat
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = wr.id_wariantu_klubu
     WHERE kw.id_zestawienia_klubow = $1`,
    [idZestawienia],
  )
  const rok = rokRows[0]?.rok ? Number(rokRows[0].rok) : null
  if (!rok) return { rok: null, players: [] }

  const rows = await ligaQuery<{
    id_zawodnika: number
    imie: string
    nazwisko: string
    starty: string
    ligi: string
  }>(
    `SELECT z.id_zawodnika, z.imie, z.nazwisko,
            COUNT(wr.id_wystepowania) AS starty,
            string_agg(DISTINCT r.liga_poziom, ', ') AS ligi
     FROM liga_wystepowanie_w_regatach wr
     JOIN liga_regaty r ON r.id_regat = wr.id_regat
     JOIN liga_zawodnik z ON z.id_zawodnika = wr.id_zawodnika
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = wr.id_wariantu_klubu
     WHERE kw.id_zestawienia_klubow = $1 AND r.rok = $2
     GROUP BY z.id_zawodnika, z.imie, z.nazwisko
     ORDER BY starty DESC, z.nazwisko ASC, z.imie ASC`,
    [idZestawienia, rok],
  )
  const players: SkladPlayer[] = rows.map((r) => ({
    id: r.id_zawodnika,
    imie: r.imie || '',
    nazwisko: r.nazwisko || '',
    slug: zawodnikSlug(r.nazwisko, r.imie),
    starty: Number(r.starty) || 0,
    ligi: (r.ligi || '').replace(/Youth/g, 'Młodzieżowa'),
  }))
  return { rok, players }
}

// --- Historia sezonów klubu (short-code: wyniki_klubu_sezony), ranking High Point ---
export async function getSezonyKlubu(idZestawienia: number): Promise<KlubSezonRow[]> {
  const seasonRows = await ligaQuery<{ sk: string }>(
    `SELECT DISTINCT (r.rok || '|' || r.liga_poziom) AS sk
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE kw.id_zestawienia_klubow = $1`,
    [idZestawienia],
  )
  const seasonKeys = seasonRows.map((r) => r.sk).filter(Boolean)
  if (seasonKeys.length === 0) return []

  const raw = await ligaQuery<{
    rok: number
    liga_poziom: string
    id_regat: number
    klubnazwa: string
    klubskrot: string
    rodzicid: number
    miejsce: number
  }>(
    `SELECT r.rok, r.liga_poziom, r.id_regat,
            kw.nazwa AS klubnazwa, kw.skrot AS klubskrot,
            kw.id_zestawienia_klubow AS rodzicid,
            m.miejscewregatach AS miejsce
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE (r.rok || '|' || r.liga_poziom) = ANY($1) AND m.miejscewregatach > 0`,
    [seasonKeys],
  )
  if (raw.length === 0) return []

  const boatsPerRound = new Map<number, number>()
  for (const row of raw) boatsPerRound.set(row.id_regat, (boatsPerRound.get(row.id_regat) || 0) + 1)

  const seasonMaxFleet = new Map<string, number>()
  for (const row of raw) {
    const sk = `${row.rok}|${row.liga_poziom}`
    seasonMaxFleet.set(sk, Math.max(seasonMaxFleet.get(sk) || 0, boatsPerRound.get(row.id_regat) || 0))
  }

  type Team = { punkty: number; miejsca: number[]; nazwa: string; isTarget: boolean }
  const sezony = new Map<string, Map<string, Team>>()
  for (const row of raw) {
    const sk = `${row.rok}|${row.liga_poziom}`
    const teamKey = row.klubskrot
    if (!sezony.has(sk)) sezony.set(sk, new Map())
    const bucket = sezony.get(sk)!
    if (!bucket.has(teamKey)) {
      bucket.set(teamKey, { punkty: 0, miejsca: [], nazwa: row.klubnazwa, isTarget: false })
    }
    const team = bucket.get(teamKey)!
    if (Number(row.rodzicid) === idZestawienia) team.isTarget = true
    const m = Number(row.miejsce)
    let pkt = (seasonMaxFleet.get(sk) || 0) - m + 1
    if (Number(row.rok) <= 2017 && m === 1) pkt += 1
    team.punkty += pkt
    team.miejsca.push(m)
    team.nazwa = row.klubnazwa
  }

  const out: KlubSezonRow[] = []
  for (const [sk, bucket] of sezony) {
    const teamsArr = [...bucket.values()]
    teamsArr.sort((a, b) => {
      if (a.punkty !== b.punkty) return b.punkty - a.punkty
      const cA = countPlaces(a.miejsca)
      const cB = countPlaces(b.miejsca)
      for (let i = 1; i <= 30; i++) {
        const d = (cB.get(i) || 0) - (cA.get(i) || 0)
        if (d !== 0) return d
      }
      return 0
    })
    const [rokStr, liga] = sk.split('|')
    let rank = 1
    for (const t of teamsArr) {
      if (t.isTarget) out.push({ rok: Number(rokStr), poziom: liga, klub: t.nazwa, miejsce: rank })
      rank++
    }
  }
  out.sort((a, b) => (a.rok !== b.rok ? b.rok - a.rok : a.miejsce - b.miejsce))
  return out
}

// ============================ STATYSTYKI / PODSUMOWANIA ============================

export type StatLiga = {
  liga: string
  regaty: number
  wyscigi: number
  wygrane: number
  srReg: string
  srWys: string
}
export type StatystykiTabela = {
  rows: StatLiga[]
  totalRegaty: number
  totalWyscigi: number
  totalWygrane: number
}
export type Podsumowanie = {
  starty: number
  wygraneRegaty: number
  punkty: number
  mistrzostwa: number
  ekstra?: { starty: number; wygrane: number; punkty: number }
}
export type PodiumLiga = { liga: string; p1: number; p2: number; p3: number; suma: number }
export type KlubStart = { rok: number; regaty: string; zespol: string; miejsce: number }

function fmt2(n: number): string {
  return n.toFixed(2).replace('.', ',')
}
function ligaLabel(s: string): string {
  return (s || '').replace(/Youth/g, 'Młodzieżowa')
}

// --- Statystyki zawodnika (short-code: statystyki_zawodnika) ---
export async function getStatystykiZawodnika(idZawodnika: number): Promise<StatystykiTabela> {
  const regaty = await ligaQuery<{
    liga: string
    liczbaregat: string
    sumamiejsc: string
    regatyzwynikiem: string
  }>(
    `SELECT r.liga_poziom AS liga,
            COUNT(DISTINCT wr.id_regat) AS liczbaregat,
            SUM(COALESCE(m.miejsce, wr.wynikwregatach, 0)) AS sumamiejsc,
            COUNT(DISTINCT CASE WHEN COALESCE(m.miejsce, wr.wynikwregatach, 0) > 0 THEN wr.id_regat END) AS regatyzwynikiem
     FROM liga_wystepowanie_w_regatach wr
     JOIN liga_regaty r ON r.id_regat = wr.id_regat
     JOIN liga_klubwariant kw ON wr.id_wariantu_klubu = kw.id_wariantu_klubu
     LEFT JOIN (
        SELECT wrm.regaty AS id_regat, kw2.skrot, wrm.miejscewregatach AS miejsce
        FROM liga_wynikregatmanual wrm
        JOIN liga_klubwariant kw2 ON kw2.id_wariantu_klubu = wrm.id_wariantu_klubu
     ) m ON m.id_regat = wr.id_regat AND m.skrot = kw.skrot
     WHERE wr.id_zawodnika = $1
     GROUP BY r.liga_poziom`,
    [idZawodnika],
  )
  const wyscigi = await ligaQuery<{
    liga: string
    liczbabiegow: string
    sumamiejscbieg: string
    wygranebiegi: string
  }>(
    `SELECT r.liga_poziom AS liga,
            COUNT(m.id_miejsca) AS liczbabiegow,
            SUM(m.zajete_miejsce) AS sumamiejscbieg,
            SUM(CASE WHEN m.zajete_miejsce = 1 THEN 1 ELSE 0 END) AS wygranebiegi
     FROM liga_wystepowanie_w_regatach wr
     JOIN liga_regaty r ON r.id_regat = wr.id_regat
     JOIN liga_wyscigi w ON w.id_regat = r.id_regat
     JOIN liga_klubwariant kw ON wr.id_wariantu_klubu = kw.id_wariantu_klubu
     JOIN liga_miejsca m ON m.id_wyscigu = w.id_wyscigu
     JOIN liga_klubwariant kw_m ON m.id_wariantu_klubu = kw_m.id_wariantu_klubu
     WHERE wr.id_zawodnika = $1 AND kw.skrot = kw_m.skrot
     GROUP BY r.liga_poziom`,
    [idZawodnika],
  )

  type Acc = { regaty: number; sumRegaty: number; regatyZWynikiem: number; wyscigi: number; sumWys: number; wygrane: number }
  const byLiga = new Map<string, Acc>()
  const ensure = (l: string): Acc => {
    if (!byLiga.has(l)) byLiga.set(l, { regaty: 0, sumRegaty: 0, regatyZWynikiem: 0, wyscigi: 0, sumWys: 0, wygrane: 0 })
    return byLiga.get(l)!
  }
  for (const r of regaty) {
    const a = ensure(r.liga)
    a.regaty = Number(r.liczbaregat) || 0
    a.sumRegaty = Number(r.sumamiejsc) || 0
    a.regatyZWynikiem = Number(r.regatyzwynikiem) || 0
  }
  for (const w of wyscigi) {
    const a = ensure(w.liga)
    a.wyscigi = Number(w.liczbabiegow) || 0
    a.sumWys = Number(w.sumamiejscbieg) || 0
    a.wygrane = Number(w.wygranebiegi) || 0
  }

  const rows: StatLiga[] = []
  let tReg = 0,
    tWys = 0,
    tWyg = 0
  for (const [liga, a] of [...byLiga.entries()].sort((x, y) => x[0].localeCompare(y[0]))) {
    const dzielnik = a.regatyZWynikiem > 0 ? a.regatyZWynikiem : a.regaty > 0 ? a.regaty : 1
    rows.push({
      liga: ligaLabel(liga),
      regaty: a.regaty,
      wyscigi: a.wyscigi,
      wygrane: a.wygrane,
      srReg: a.regaty > 0 ? fmt2(a.sumRegaty / dzielnik) : '-',
      srWys: a.wyscigi > 0 ? fmt2(a.sumWys / a.wyscigi) : '-',
    })
    tReg += a.regaty
    tWys += a.wyscigi
    tWyg += a.wygrane
  }
  return { rows, totalRegaty: tReg, totalWyscigi: tWys, totalWygrane: tWyg }
}

// --- Podsumowanie zawodnika (short-code: podsumowanie_zawodnika) ---
export async function getPodsumowanieZawodnika(idZawodnika: number): Promise<Podsumowanie> {
  const map = await ligaQuery<{ rok: number; liga_poziom: string; id_regat: number; skrot: string }>(
    `SELECT DISTINCT r.rok, r.liga_poziom, wr.id_regat, kw.skrot
     FROM liga_wystepowanie_w_regatach wr
     JOIN liga_regaty r ON r.id_regat = wr.id_regat
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = wr.id_wariantu_klubu
     WHERE wr.id_zawodnika = $1`,
    [idZawodnika],
  )
  if (map.length === 0) return { starty: 0, wygraneRegaty: 0, punkty: 0, mistrzostwa: 0 }

  const participation = new Map<string, Map<number, string>>() // sk -> (id_regat -> skrot)
  const seasons = new Set<string>()
  for (const r of map) {
    if (r.liga_poziom == null) continue
    const sk = `${r.rok}|${r.liga_poziom}`
    if (!participation.has(sk)) participation.set(sk, new Map())
    participation.get(sk)!.set(r.id_regat, r.skrot)
    seasons.add(sk)
  }
  const seasonKeys = [...seasons]

  const all = await ligaQuery<{
    rok: number
    liga_poziom: string
    id_regat: number
    wid: number
    skrot: string
    miejsce: number
  }>(
    `SELECT r.rok, r.liga_poziom, r.id_regat, kw.id_wariantu_klubu AS wid, kw.skrot, m.miejscewregatach AS miejsce
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE (r.rok || '|' || r.liga_poziom) = ANY($1) AND m.miejscewregatach > 0`,
    [seasonKeys],
  )
  if (all.length === 0) return { starty: 0, wygraneRegaty: 0, punkty: 0, mistrzostwa: 0 }

  const boatsPerRound = new Map<number, number>()
  for (const row of all) boatsPerRound.set(row.id_regat, (boatsPerRound.get(row.id_regat) || 0) + 1)
  const seasonMaxFleet = new Map<string, number>()
  for (const row of all) {
    const sk = `${row.rok}|${row.liga_poziom}`
    seasonMaxFleet.set(sk, Math.max(seasonMaxFleet.get(sk) || 0, boatsPerRound.get(row.id_regat) || 0))
  }

  type RankTeam = { punkty: number; miejsca: number[]; skrot: string }
  const ranking = new Map<string, Map<number, RankTeam>>() // sk -> (wid -> team)
  let starty = 0,
    wygraneRegaty = 0,
    punkty = 0
  for (const row of all) {
    const sk = `${row.rok}|${row.liga_poziom}`
    const m = Number(row.miejsce)
    let pkt = (seasonMaxFleet.get(sk) || 0) - m + 1
    if (Number(row.rok) <= 2017 && m === 1) pkt += 1

    if (!ranking.has(sk)) ranking.set(sk, new Map())
    const rmap = ranking.get(sk)!
    if (!rmap.has(row.wid)) rmap.set(row.wid, { punkty: 0, miejsca: [], skrot: row.skrot })
    const t = rmap.get(row.wid)!
    t.punkty += pkt
    t.miejsca.push(m)

    const part = participation.get(sk)
    if (part && part.get(row.id_regat) === row.skrot) {
      starty++
      punkty += pkt
      if (m === 1) wygraneRegaty++
    }
  }

  // Mistrzostwa = zwycięstwa w Ekstraklasie w sezonach, w których zawodnik startował w zwycięskim klubie
  let mistrzostwa = 0
  for (const [sk, rmap] of ranking) {
    const [, liga] = sk.split('|')
    if (liga !== 'Ekstraklasa') continue
    const teams = [...rmap.values()].sort((a, b) => {
      if (a.punkty !== b.punkty) return b.punkty - a.punkty
      const cA = countPlaces(a.miejsca)
      const cB = countPlaces(b.miejsca)
      for (let i = 1; i <= 50; i++) {
        const d = (cB.get(i) || 0) - (cA.get(i) || 0)
        if (d !== 0) return d
      }
      return 0
    })
    const winner = teams[0]
    const part = participation.get(sk)
    if (winner && part && [...part.values()].includes(winner.skrot)) mistrzostwa++
  }

  return { starty, wygraneRegaty, punkty, mistrzostwa }
}

// --- Obecny klub zawodnika (ostatni rok) — karty ---
export async function getObecnyKlubZawodnika(
  idZawodnika: number,
): Promise<{ id: number; nazwa: string; slug: string }[]> {
  const rows = await ligaQuery<{ id: number; nazwa: string }>(
    `SELECT DISTINCT zk.id_zestawienia_klubow AS id, zk.nazwa
     FROM liga_wystepowanie_w_regatach wr
     JOIN liga_regaty r ON r.id_regat = wr.id_regat
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = wr.id_wariantu_klubu
     JOIN liga_zestawienieklubow zk ON zk.id_zestawienia_klubow = kw.id_zestawienia_klubow
     WHERE wr.id_zawodnika = $1
       AND r.rok = (SELECT MAX(r2.rok) FROM liga_wystepowanie_w_regatach wr2
                    JOIN liga_regaty r2 ON r2.id_regat = wr2.id_regat
                    WHERE wr2.id_zawodnika = $1)`,
    [idZawodnika],
  )
  return rows.map((r) => ({ id: r.id, nazwa: r.nazwa || '', slug: klubSlug(r.nazwa) }))
}

// --- Statystyki klubu + TOP3 podia (short-code: statystyki_klubu) ---
export async function getStatystykiKlubu(
  idZestawienia: number,
): Promise<{ podia: PodiumLiga[]; stats: StatystykiTabela }> {
  const seasonRows = await ligaQuery<{ sk: string }>(
    `SELECT DISTINCT (r.rok || '|' || r.liga_poziom) AS sk
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE kw.id_zestawienia_klubow = $1`,
    [idZestawienia],
  )
  const seasonKeys = seasonRows.map((r) => r.sk).filter(Boolean)

  const raw =
    seasonKeys.length === 0
      ? []
      : await ligaQuery<{ liga_poziom: string; rodzicid: number; miejsce: number }>(
          `SELECT r.liga_poziom, kw.id_zestawienia_klubow AS rodzicid, m.miejscewregatach AS miejsce
           FROM liga_wynikregatmanual m
           JOIN liga_regaty r ON r.id_regat = m.regaty
           JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
           WHERE (r.rok || '|' || r.liga_poziom) = ANY($1) AND m.miejscewregatach > 0`,
          [seasonKeys],
        )

  type Reg = { n: number; sum: number; p1: number; p2: number; p3: number }
  const statsRegaty = new Map<string, Reg>()
  for (const row of raw) {
    if (Number(row.rodzicid) !== idZestawienia) continue
    const l = row.liga_poziom
    if (!statsRegaty.has(l)) statsRegaty.set(l, { n: 0, sum: 0, p1: 0, p2: 0, p3: 0 })
    const s = statsRegaty.get(l)!
    const m = Number(row.miejsce)
    s.n++
    s.sum += m
    if (m === 1) s.p1++
    else if (m === 2) s.p2++
    else if (m === 3) s.p3++
  }

  const wyscigi = await ligaQuery<{
    liga: string
    liczbawyscigow: string
    sredniemiejsce: string
    wygrane: string
  }>(
    `SELECT r.liga_poziom AS liga,
            COUNT(DISTINCT w.id_wyscigu) AS liczbawyscigow,
            AVG(m.zajete_miejsce) AS sredniemiejsce,
            SUM(CASE WHEN m.zajete_miejsce = 1 THEN 1 ELSE 0 END) AS wygrane
     FROM liga_miejsca m
     JOIN liga_wyscigi w ON w.id_wyscigu = m.id_wyscigu
     JOIN liga_regaty r ON r.id_regat = w.id_regat
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE kw.id_zestawienia_klubow = $1
     GROUP BY r.liga_poziom`,
    [idZestawienia],
  )
  const wyscigiByLiga = new Map<string, { n: number; avg: number; wygrane: number }>()
  for (const w of wyscigi) {
    wyscigiByLiga.set(w.liga, {
      n: Number(w.liczbawyscigow) || 0,
      avg: Number(w.sredniemiejsce) || 0,
      wygrane: Number(w.wygrane) || 0,
    })
  }

  const ligaKeys = [...new Set([...statsRegaty.keys(), ...wyscigiByLiga.keys()])].sort((a, b) =>
    a.localeCompare(b),
  )

  const podia: PodiumLiga[] = []
  const rows: StatLiga[] = []
  let tReg = 0,
    tWys = 0,
    tWyg = 0
  for (const liga of ligaKeys) {
    const s = statsRegaty.get(liga) || { n: 0, sum: 0, p1: 0, p2: 0, p3: 0 }
    const w = wyscigiByLiga.get(liga)
    podia.push({ liga: ligaLabel(liga), p1: s.p1, p2: s.p2, p3: s.p3, suma: s.p1 + s.p2 + s.p3 })
    rows.push({
      liga: ligaLabel(liga),
      regaty: s.n,
      wyscigi: w ? w.n : 0,
      wygrane: w ? w.wygrane : 0,
      srReg: s.n > 0 ? fmt2(s.sum / s.n) : '-',
      srWys: w ? fmt2(w.avg) : '-',
    })
    tReg += s.n
    tWys += w ? w.n : 0
    tWyg += w ? w.wygrane : 0
  }
  return { podia, stats: { rows, totalRegaty: tReg, totalWyscigi: tWys, totalWygrane: tWyg } }
}

// --- Podsumowanie klubu (short-code: podsumowanie_klubu) ---
export async function getPodsumowanieKlubu(idZestawienia: number): Promise<Podsumowanie> {
  const seasonRows = await ligaQuery<{ sk: string }>(
    `SELECT DISTINCT (r.rok || '|' || r.liga_poziom) AS sk
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE kw.id_zestawienia_klubow = $1`,
    [idZestawienia],
  )
  const seasonKeys = seasonRows.map((r) => r.sk).filter(Boolean)
  if (seasonKeys.length === 0) return { starty: 0, wygraneRegaty: 0, punkty: 0, mistrzostwa: 0 }

  const all = await ligaQuery<{
    rok: number
    liga_poziom: string
    id_regat: number
    skrot: string
    rodzicid: number
    miejsce: number
  }>(
    `SELECT r.rok, r.liga_poziom, r.id_regat, kw.skrot, kw.id_zestawienia_klubow AS rodzicid, m.miejscewregatach AS miejsce
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE (r.rok || '|' || r.liga_poziom) = ANY($1) AND m.miejscewregatach > 0`,
    [seasonKeys],
  )
  if (all.length === 0) return { starty: 0, wygraneRegaty: 0, punkty: 0, mistrzostwa: 0 }

  const boatsPerRound = new Map<number, number>()
  for (const row of all) boatsPerRound.set(row.id_regat, (boatsPerRound.get(row.id_regat) || 0) + 1)
  const seasonMaxFleet = new Map<string, number>()
  for (const row of all) {
    const sk = `${row.rok}|${row.liga_poziom}`
    seasonMaxFleet.set(sk, Math.max(seasonMaxFleet.get(sk) || 0, boatsPerRound.get(row.id_regat) || 0))
  }

  type Team = { punkty: number; miejsca: number[]; isTarget: boolean }
  const sezony = new Map<string, Map<string, Team>>()
  let starty = 0,
    wygraneRegaty = 0,
    ekstraStarty = 0,
    ekstraWygrane = 0
  for (const row of all) {
    const sk = `${row.rok}|${row.liga_poziom}`
    const isEkstra = row.liga_poziom === 'Ekstraklasa'
    if (!sezony.has(sk)) sezony.set(sk, new Map())
    const bucket = sezony.get(sk)!
    if (!bucket.has(row.skrot)) bucket.set(row.skrot, { punkty: 0, miejsca: [], isTarget: false })
    const t = bucket.get(row.skrot)!
    const m = Number(row.miejsce)
    if (Number(row.rodzicid) === idZestawienia) {
      t.isTarget = true
      starty++
      if (m === 1) wygraneRegaty++
      if (isEkstra) {
        ekstraStarty++
        if (m === 1) ekstraWygrane++
      }
    }
    let pkt = (seasonMaxFleet.get(sk) || 0) - m + 1
    if (Number(row.rok) <= 2017 && m === 1) pkt += 1
    t.punkty += pkt
    t.miejsca.push(m)
  }

  let mistrzostwa = 0,
    punkty = 0,
    ekstraPunkty = 0
  for (const [sk, bucket] of sezony) {
    const [, liga] = sk.split('|')
    const teams = [...bucket.values()].sort((a, b) => {
      if (a.punkty !== b.punkty) return b.punkty - a.punkty
      const cA = countPlaces(a.miejsca)
      const cB = countPlaces(b.miejsca)
      for (let i = 1; i <= 50; i++) {
        const d = (cB.get(i) || 0) - (cA.get(i) || 0)
        if (d !== 0) return d
      }
      return 0
    })
    if (teams[0]?.isTarget && liga === 'Ekstraklasa') mistrzostwa++
    for (const t of teams) {
      if (t.isTarget) {
        punkty += t.punkty
        if (liga === 'Ekstraklasa') ekstraPunkty += t.punkty
      }
    }
  }

  const res: Podsumowanie = { starty, wygraneRegaty, punkty, mistrzostwa }
  if (ekstraStarty > 0) res.ekstra = { starty: ekstraStarty, wygrane: ekstraWygrane, punkty: ekstraPunkty }
  return res
}

// --- Lista startów klubu (short-code: wyniki_klubu) ---
export async function getStartyKlubu(idZestawienia: number): Promise<KlubStart[]> {
  const rows = await ligaQuery<{ rok: number; regaty: string; zespol: string; miejsce: number }>(
    `SELECT r.rok, r.nazwa AS regaty, kw.nazwa AS zespol, wrm.miejscewregatach AS miejsce
     FROM liga_wynikregatmanual wrm
     JOIN liga_regaty r ON r.id_regat = wrm.regaty
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = wrm.id_wariantu_klubu
     WHERE kw.id_zestawienia_klubow = $1
     ORDER BY r.rok DESC, r.nazwa ASC`,
    [idZestawienia],
  )
  return rows.map((r) => ({
    rok: Number(r.rok) || 0,
    regaty: ligaLabel(r.regaty || ''),
    zespol: r.zespol || '',
    miejsce: Number(r.miejsce) || 0,
  }))
}

// --- Aktualne kluby pogrupowane wg poziomu ligi, uszeregowane wg miejsca w bieżącym sezonie ---
export type AktualnaGrupa = {
  poziom: string
  kluby: { id: number; nazwa: string; slug: string; miejsce: number }[]
}

export async function getAktualneKluby(): Promise<AktualnaGrupa[]> {
  // Najnowszy sezon dla każdego poziomu ligi
  const seasons = await ligaQuery<{ liga_poziom: string; rok: number }>(
    `SELECT r.liga_poziom, MAX(r.rok) AS rok
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     WHERE r.liga_poziom IS NOT NULL
     GROUP BY r.liga_poziom`,
  )

  const groups: AktualnaGrupa[] = []
  for (const s of seasons) {
    const rows = await ligaQuery<{ id: number; klubnazwa: string; id_regat: number; miejsce: number }>(
      `SELECT zk.id_zestawienia_klubow AS id, zk.nazwa AS klubnazwa, r.id_regat, m.miejscewregatach AS miejsce
       FROM liga_wynikregatmanual m
       JOIN liga_regaty r ON r.id_regat = m.regaty
       JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
       JOIN liga_zestawienieklubow zk ON zk.id_zestawienia_klubow = kw.id_zestawienia_klubow
       WHERE r.rok = $1 AND r.liga_poziom = $2 AND m.miejscewregatach > 0`,
      [s.rok, s.liga_poziom],
    )
    if (rows.length === 0) continue

    const boats = new Map<number, number>()
    for (const row of rows) boats.set(row.id_regat, (boats.get(row.id_regat) || 0) + 1)
    const maxFleet = Math.max(0, ...boats.values())

    type T = { punkty: number; miejsca: number[]; nazwa: string }
    const byClub = new Map<number, T>()
    for (const row of rows) {
      if (!byClub.has(row.id)) byClub.set(row.id, { punkty: 0, miejsca: [], nazwa: row.klubnazwa })
      const t = byClub.get(row.id)!
      const m = Number(row.miejsce)
      let pkt = maxFleet - m + 1
      if (Number(s.rok) <= 2017 && m === 1) pkt += 1
      t.punkty += pkt
      t.miejsca.push(m)
      t.nazwa = row.klubnazwa
    }

    const ranked = [...byClub.entries()]
      .map(([id, t]) => ({ id, ...t }))
      .sort((a, b) => {
        if (a.punkty !== b.punkty) return b.punkty - a.punkty
        const cA = countPlaces(a.miejsca)
        const cB = countPlaces(b.miejsca)
        for (let i = 1; i <= 50; i++) {
          const d = (cB.get(i) || 0) - (cA.get(i) || 0)
          if (d !== 0) return d
        }
        return 0
      })

    groups.push({
      poziom: ligaLabel(s.liga_poziom),
      kluby: ranked.map((r, idx) => ({
        id: r.id,
        nazwa: r.nazwa,
        slug: klubSlug(r.nazwa),
        miejsce: idx + 1,
      })),
    })
  }

  const order: Record<string, number> = { Ekstraklasa: 0, '1 Liga': 1, Młodzieżowa: 2 }
  const widoczne = groups.filter((g) => !/2\s*liga/i.test(g.poziom)) // nie wypisujemy 2 Ligi
  widoczne.sort(
    (a, b) => (order[a.poziom] ?? 99) - (order[b.poziom] ?? 99) || a.poziom.localeCompare(b.poziom),
  )
  return widoczne
}

// ============================ WYNIKI (per sezon) ============================

export type WynikiRunda = {
  id: number
  nazwa: string
  miasto: string
  numer: number | null
  rows: { miejsce: number; klub: string; slug: string }[]
}
export type WynikiOverall = { miejsce: number; klub: string; slug: string; punkty: number }
export type WynikiLiga = { poziom: string; overall: WynikiOverall[]; rundy: WynikiRunda[] }

export async function getLataWynikow(): Promise<number[]> {
  const rows = await ligaQuery<{ rok: number }>(
    `SELECT DISTINCT r.rok
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     WHERE r.rok IS NOT NULL
     ORDER BY r.rok DESC`,
  )
  return rows.map((r) => Number(r.rok))
}

export async function getWynikiSezonu(rok: number): Promise<WynikiLiga[]> {
  const rows = await ligaQuery<{
    id_regat: number
    nazwa: string
    liga_poziom: string
    miasto: string
    numer_rundy: number
    klub: string
    skrot: string
    miejsce: number
  }>(
    `SELECT r.id_regat, r.nazwa, r.liga_poziom, r.miasto, r.numer_rundy,
            kw.nazwa AS klub, kw.skrot, m.miejscewregatach AS miejsce
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE r.rok = $1 AND m.miejscewregatach > 0
     ORDER BY r.liga_poziom, r.numer_rundy NULLS LAST, m.miejscewregatach`,
    [rok],
  )

  const byLiga = new Map<string, typeof rows>()
  for (const row of rows) {
    if (!byLiga.has(row.liga_poziom)) byLiga.set(row.liga_poziom, [] as any)
    byLiga.get(row.liga_poziom)!.push(row)
  }

  const out: WynikiLiga[] = []
  for (const [poziom, lrows] of byLiga) {
    // rundy
    const rundMap = new Map<number, WynikiRunda>()
    for (const row of lrows) {
      if (!rundMap.has(row.id_regat)) {
        rundMap.set(row.id_regat, {
          id: row.id_regat,
          nazwa: ligaLabel(row.nazwa || ''),
          miasto: row.miasto || '',
          numer: row.numer_rundy != null ? Number(row.numer_rundy) : null,
          rows: [],
        })
      }
      rundMap.get(row.id_regat)!.rows.push({
        miejsce: Number(row.miejsce),
        klub: row.klub || '',
        slug: klubSlug(row.klub),
      })
    }
    const rundy = [...rundMap.values()].sort((a, b) => (a.numer ?? 999) - (b.numer ?? 999))

    // klasyfikacja generalna (High Point, grupowanie po skrócie)
    const boats = new Map<number, number>()
    for (const row of lrows) boats.set(row.id_regat, (boats.get(row.id_regat) || 0) + 1)
    const maxFleet = Math.max(0, ...boats.values())
    const teams = new Map<string, { punkty: number; miejsca: number[]; klub: string }>()
    for (const row of lrows) {
      const key = row.skrot
      if (!teams.has(key)) teams.set(key, { punkty: 0, miejsca: [], klub: row.klub || '' })
      const t = teams.get(key)!
      const m = Number(row.miejsce)
      let pkt = maxFleet - m + 1
      if (rok <= 2017 && m === 1) pkt += 1
      t.punkty += pkt
      t.miejsca.push(m)
      t.klub = row.klub || ''
    }
    const ranked = [...teams.values()].sort((a, b) => {
      if (a.punkty !== b.punkty) return b.punkty - a.punkty
      const cA = countPlaces(a.miejsca)
      const cB = countPlaces(b.miejsca)
      for (let i = 1; i <= 50; i++) {
        const d = (cB.get(i) || 0) - (cA.get(i) || 0)
        if (d !== 0) return d
      }
      return 0
    })
    const overall: WynikiOverall[] = ranked.map((t, i) => ({
      miejsce: i + 1,
      klub: t.klub,
      slug: klubSlug(t.klub),
      punkty: t.punkty,
    }))

    out.push({ poziom: ligaLabel(poziom), overall, rundy })
  }

  const order: Record<string, number> = { Ekstraklasa: 0, '1 Liga': 1, '2 Liga': 2, Młodzieżowa: 3 }
  out.sort((a, b) => (order[a.poziom] ?? 99) - (order[b.poziom] ?? 99) || a.poziom.localeCompare(b.poziom))
  return out
}

// --- Wyniki pełne: Ranking Sezonu (punkty per runda) + tabele wyścig-po-wyścigu ---
export type WRound = { id: number; label: string }
export type WRankRow = {
  miejsce: number
  skrot: string
  klub: string
  slug: string
  perRound: Record<number, number>
  suma: number
}
export type WRaceCol = { key: string; label: string }
export type WRoundDetail = {
  id: number
  nazwa: string
  miasto: string
  numer: number | null
  races: WRaceCol[]
  rows: { miejsce: number; skrot: string; klub: string; slug: string; places: Record<string, string> }[]
}
export type WLigaPelna = {
  poziom: string
  rankingRounds: WRound[]
  ranking: WRankRow[]
  rundy: WRoundDetail[]
}

function fmtPlace(v: unknown): string {
  const n = Number(v)
  if (!isFinite(n) || n <= 0) return '-'
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ',')
}

export async function getWynikiPelne(rok: number): Promise<WLigaPelna[]> {
  const standings = await ligaQuery<{
    id_regat: number
    nazwa: string
    liga_poziom: string
    miasto: string
    numer_rundy: number
    skrot: string
    klub: string
    miejsce: number
  }>(
    `SELECT r.id_regat, r.nazwa, r.liga_poziom, r.miasto, r.numer_rundy,
            kw.skrot, kw.nazwa AS klub, m.miejscewregatach AS miejsce
     FROM liga_wynikregatmanual m
     JOIN liga_regaty r ON r.id_regat = m.regaty
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = m.id_wariantu_klubu
     WHERE r.rok = $1 AND m.miejscewregatach > 0
     ORDER BY r.liga_poziom, r.numer_rundy NULLS LAST, m.miejscewregatach`,
    [rok],
  )
  const races = await ligaQuery<{
    id_regat: number
    liga_poziom: string
    id_wyscigu: number
    numer_wyscigu: string
    finalowy: boolean
    skrot: string
    zajete_miejsce: string
  }>(
    `SELECT r.id_regat, r.liga_poziom, w.id_wyscigu, w.numer_wyscigu, w.finalowy, kw.skrot, mi.zajete_miejsce
     FROM liga_miejsca mi
     JOIN liga_wyscigi w ON w.id_wyscigu = mi.id_wyscigu
     JOIN liga_regaty r ON r.id_regat = w.id_regat
     JOIN liga_klubwariant kw ON kw.id_wariantu_klubu = mi.id_wariantu_klubu
     WHERE r.rok = $1`,
    [rok],
  )

  // grupowanie po lidze
  const ligi = new Map<string, typeof standings>()
  for (const s of standings) {
    if (!ligi.has(s.liga_poziom)) ligi.set(s.liga_poziom, [] as any)
    ligi.get(s.liga_poziom)!.push(s)
  }

  const out: WLigaPelna[] = []
  for (const [poziom, srows] of ligi) {
    // rundy (kolejność wg numer_rundy)
    const roundMeta = new Map<number, { id: number; nazwa: string; miasto: string; numer: number | null }>()
    for (const s of srows) {
      if (!roundMeta.has(s.id_regat)) {
        roundMeta.set(s.id_regat, {
          id: s.id_regat,
          nazwa: ligaLabel(s.nazwa || ''),
          miasto: s.miasto || '',
          numer: s.numer_rundy != null ? Number(s.numer_rundy) : null,
        })
      }
    }
    const roundsSorted = [...roundMeta.values()].sort((a, b) => (a.numer ?? 999) - (b.numer ?? 999))

    // etykiety kolumn (miasto; przy powtórce dopisz numer)
    const miastoCount = new Map<string, number>()
    for (const r of roundsSorted) miastoCount.set(r.miasto, (miastoCount.get(r.miasto) || 0) + 1)
    const rankingRounds: WRound[] = roundsSorted.map((r) => ({
      id: r.id,
      label:
        (miastoCount.get(r.miasto) || 0) > 1 || !r.miasto
          ? `${r.miasto || 'Runda'}${r.numer != null ? ` (R${r.numer})` : ''}`
          : r.miasto,
    }))

    // liczebność floty na rundę
    const roundFleet = new Map<number, number>()
    for (const s of srows) roundFleet.set(s.id_regat, (roundFleet.get(s.id_regat) || 0) + 1)

    // ranking High Point z punktami per runda
    type Agg = { skrot: string; klub: string; perRound: Record<number, number>; miejsca: number[]; suma: number }
    const agg = new Map<string, Agg>()
    for (const s of srows) {
      if (!agg.has(s.skrot)) agg.set(s.skrot, { skrot: s.skrot, klub: s.klub || '', perRound: {}, miejsca: [], suma: 0 })
      const a = agg.get(s.skrot)!
      const fleet = roundFleet.get(s.id_regat) || 0
      const m = Number(s.miejsce)
      let pkt = fleet - m + 1
      if (rok <= 2017 && m === 1) pkt += 1
      a.perRound[s.id_regat] = pkt
      a.miejsca.push(m)
      a.suma += pkt
      a.klub = s.klub || a.klub
    }
    const ranked = [...agg.values()].sort((x, y) => {
      if (x.suma !== y.suma) return y.suma - x.suma
      const cX = countPlaces(x.miejsca)
      const cY = countPlaces(y.miejsca)
      for (let i = 1; i <= 50; i++) {
        const d = (cY.get(i) || 0) - (cX.get(i) || 0)
        if (d !== 0) return d
      }
      return 0
    })
    const ranking: WRankRow[] = ranked.map((a, i) => ({
      miejsce: i + 1,
      skrot: a.skrot,
      klub: a.klub,
      slug: klubSlug(a.klub),
      perRound: a.perRound,
      suma: a.suma,
    }))

    // szczegóły rund: wyścig-po-wyścigu
    const racesLiga = races.filter((r) => r.liga_poziom === poziom)
    const rundy: WRoundDetail[] = []
    for (const rm of roundsSorted) {
      const rr = racesLiga.filter((x) => x.id_regat === rm.id)
      // kolumny wyścigów
      const raceMeta = new Map<number, { numer: string; finalowy: boolean }>()
      for (const x of rr) if (!raceMeta.has(x.id_wyscigu)) raceMeta.set(x.id_wyscigu, { numer: x.numer_wyscigu, finalowy: !!x.finalowy })
      const raceList = [...raceMeta.entries()].sort((a, b) => {
        const fa = a[1].finalowy ? 1 : 0
        const fb = b[1].finalowy ? 1 : 0
        if (fa !== fb) return fa - fb
        return (parseInt(a[1].numer) || 0) - (parseInt(b[1].numer) || 0)
      })
      const races2: WRaceCol[] = raceList.map(([id, meta]) => ({
        key: String(id),
        label: meta.finalowy ? `Fi${meta.numer ? ' ' + meta.numer : ''}` : `F${meta.numer}`,
      }))
      // miejsca per klub
      const placesBy = new Map<string, Record<string, string>>()
      for (const x of rr) {
        if (!placesBy.has(x.skrot)) placesBy.set(x.skrot, {})
        placesBy.get(x.skrot)![String(x.id_wyscigu)] = fmtPlace(x.zajete_miejsce)
      }
      // wiersze wg końcowego miejsca w rundzie
      const finalOfRound = srows.filter((s) => s.id_regat === rm.id).sort((a, b) => Number(a.miejsce) - Number(b.miejsce))
      const rows = finalOfRound.map((s) => ({
        miejsce: Number(s.miejsce),
        skrot: s.skrot,
        klub: s.klub || '',
        slug: klubSlug(s.klub),
        places: placesBy.get(s.skrot) || {},
      }))
      rundy.push({ id: rm.id, nazwa: rm.nazwa, miasto: rm.miasto, numer: rm.numer, races: races2, rows })
    }

    out.push({ poziom: ligaLabel(poziom), rankingRounds, ranking, rundy })
  }

  const order: Record<string, number> = { Ekstraklasa: 0, '1 Liga': 1, '2 Liga': 2, Młodzieżowa: 3 }
  out.sort((a, b) => (order[a.poziom] ?? 99) - (order[b.poziom] ?? 99) || a.poziom.localeCompare(b.poziom))
  return out
}
