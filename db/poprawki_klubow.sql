-- Poprawki nazw i powiazan klubow, ktorych nie da sie naprawic w panelu.
--
-- UWAGA: db/load_all.sql robi TRUNCATE na tabelach liga_*, wiec te poprawki
-- znikaja przy kazdym imporcie CSV. Ten plik jest celowo IDEMPOTENTNY —
-- uruchom go ponownie zaraz po load_all.sql:
--
--   psql -U $POSTGRES_USER -d $POSTGRES_DB -f db/poprawki_klubow.sql
--
-- Docelowo bledy powinny zostac poprawione w zrodlowym eksporcie; dopoki tak
-- sie nie stanie, zrodlem prawdy dla tych trzech klubow jest ten plik.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Jachtklub Stoczni Gdanskiej (zestawienie 9039)
--
-- Wariant 80812925 obsluguje sezony 2024 ORAZ 2026, a klub nazywal sie
-- "MOWI Jachtklub Stoczni Gdanskiej" tylko do 2025 (2025 siedzi na osobnym
-- wariancie 11484760 i tez ma MOWI). Zmiana nazwy samego wariantu poprawilaby
-- 2026 kosztem 2024, wiec zamiast tego przepinamy sezon 2026 na wariant
-- 20708529 — ten sam klub pod nazwa sprzed sponsora (uzywany w latach 2019-2023).
-- ---------------------------------------------------------------------------

UPDATE liga_miejsca m SET id_wariantu_klubu = 20708529
  FROM liga_wyscigi y JOIN liga_regaty r ON r.id_regat = y.id_regat
 WHERE m.id_wyscigu = y.id_wyscigu AND r.rok = 2026 AND m.id_wariantu_klubu = 80812925;

UPDATE liga_wystepowanie_w_regatach v SET id_wariantu_klubu = 20708529
  FROM liga_regaty r
 WHERE v.id_regat = r.id_regat AND r.rok = 2026 AND v.id_wariantu_klubu = 80812925;

UPDATE liga_wynikregatmanual wr SET id_wariantu_klubu = 20708529
  FROM liga_regaty r
 WHERE wr.regaty = r.id_regat AND r.rok = 2026 AND wr.id_wariantu_klubu = 80812925;

-- Wariant 80812925 zostaje przy 2024, wiec wraca do nazwy z tamtego sezonu.
UPDATE liga_klubwariant SET nazwa = 'MOWI Jachtklub Stoczni Gdańskiej'
 WHERE id_wariantu_klubu = 80812925;

-- ---------------------------------------------------------------------------
-- 2. Wolin (zestawienie 9093)
--
-- Odwrotna sytuacja: wariant 92127505 zostal zalozony w trakcie sezonu 2025
-- przez literowke w zrodle ("UKS Albatros Woiln") i przejal rundy 1-2 z 2025,
-- a potem caly 2026. Wyniki manualne tych rund siedza juz na 64830853, wiec
-- przepiecie rund 2025 ujednolica dane, a wariant zostaje wylacznie na 2026 —
-- pod aktualna nazwa klubu.
-- ---------------------------------------------------------------------------

UPDATE liga_miejsca m SET id_wariantu_klubu = 64830853
  FROM liga_wyscigi y JOIN liga_regaty r ON r.id_regat = y.id_regat
 WHERE m.id_wyscigu = y.id_wyscigu AND r.rok = 2025 AND m.id_wariantu_klubu = 92127505;

UPDATE liga_wystepowanie_w_regatach v SET id_wariantu_klubu = 64830853
  FROM liga_regaty r
 WHERE v.id_regat = r.id_regat AND r.rok = 2025 AND v.id_wariantu_klubu = 92127505;

UPDATE liga_wynikregatmanual wr SET id_wariantu_klubu = 64830853
  FROM liga_regaty r
 WHERE wr.regaty = r.id_regat AND r.rok = 2025 AND wr.id_wariantu_klubu = 92127505
   AND NOT EXISTS (SELECT 1 FROM liga_wynikregatmanual x
                    WHERE x.regaty = wr.regaty AND x.id_wariantu_klubu = 64830853);

UPDATE liga_klubwariant SET nazwa = 'Klub Żeglarski Wiking Wolin'
 WHERE id_wariantu_klubu = 92127505;

-- Klub zmienil nazwe na stale, wiec zestawienie (czyli profil klubu i jego slug)
-- tez idzie za nowa nazwa. Sezony 2019-2025 zachowuja w tabelach stara nazwe,
-- bo ta siedzi na wariancie 64830853. Stary slug obsluguje przekierowanie
-- w web/redirects-stare.ts.
UPDATE liga_zestawienieklubow SET nazwa = 'Klub Żeglarski Wiking Wolin'
 WHERE id_zestawienia_klubow = 9093;

-- ---------------------------------------------------------------------------
-- 3. RITS (zestawienie 9119) — w zrodle sam skrot zamiast nazwy klubu.
-- ---------------------------------------------------------------------------

UPDATE liga_klubwariant SET nazwa = 'RITS Klub Żeglarski Pionki'
 WHERE id_wariantu_klubu = 33741103;

UPDATE liga_zestawienieklubow SET nazwa = 'RITS Klub Żeglarski Pionki'
 WHERE id_zestawienia_klubow = 9119;


-- ---------------------------------------------------------------------------
-- 4. Warianty przypiete do obcego klubu-matki
--
-- Kafelek na /kluby linkuje do profilu klubu-matki (slug z nazwy zestawienia),
-- wiec wariant pod zlym zestawieniem otwiera cudza strone klubu. Oba ponizsze
-- przypadki to blad w zrodlowym eksporcie, nie w panelu.
--
--   22762275 "Nauticus Yacht Club Olsztyn" (1 Liga 2026) siedzial pod
--            zestawieniem 9055 "Politechnika Morska Szczecin".
--            Wlasciwe zestawienie: 9056 "Nauticus Olsztyn" (tam jest juz
--            wariant 25666958 z sezonu Youth 2025).
--
--   38417452 "Fundacja Baltiq Sport" (1 Liga 2026) siedzial pod zestawieniem
--            9079 "Baltic Trans Yacht Club Rewa", ktore poza tym zawiera tylko
--            wariant Rewy z 2016. Fundacja ma wlasne zestawienie 9115.
-- ---------------------------------------------------------------------------

UPDATE liga_klubwariant SET id_zestawienia_klubow = 9056 WHERE id_wariantu_klubu = 22762275;
UPDATE liga_klubwariant SET id_zestawienia_klubow = 9115 WHERE id_wariantu_klubu = 38417452;

COMMIT;

-- ---------------------------------------------------------------------------
-- Przypisania sezonu w panelu (payload.kluby.sezon_przypisania) wskazuja
-- konkretny wariant, wiec musza podazyc za przepieciem JSG.
-- ---------------------------------------------------------------------------

UPDATE payload.kluby SET sezon_przypisania = (
  SELECT jsonb_agg(CASE WHEN (el->>'wariant')::bigint = 80812925
                        THEN jsonb_set(el, '{wariant}', to_jsonb(20708529))
                        ELSE el END)
    FROM jsonb_array_elements(sezon_przypisania) el)
 WHERE sezon_przypisania @> '[{"wariant": 80812925}]';

-- Kontrola.
SELECT w.id_wariantu_klubu, w.nazwa, w.skrot, MIN(r.rok) AS od, MAX(r.rok) AS do
  FROM liga_klubwariant w
  LEFT JOIN liga_miejsca m ON m.id_wariantu_klubu = w.id_wariantu_klubu
  LEFT JOIN liga_wyscigi y ON y.id_wyscigu = m.id_wyscigu
  LEFT JOIN liga_regaty r ON r.id_regat = y.id_regat
 WHERE w.id_wariantu_klubu IN (11484760, 20708529, 80812925, 64830853, 92127505, 33741103)
 GROUP BY 1, 2, 3 ORDER BY 3, 4;

-- Kontrola przypiec z punktu 4.
SELECT w.id_wariantu_klubu, w.nazwa AS wariant, z.id_zestawienia_klubow AS zest, z.nazwa AS klub_matka
  FROM liga_klubwariant w
  JOIN liga_zestawienieklubow z ON z.id_zestawienia_klubow = w.id_zestawienia_klubow
 WHERE w.id_wariantu_klubu IN (22762275, 38417452);
