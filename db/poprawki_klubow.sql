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


-- ---------------------------------------------------------------------------
-- 5. Nazwy klubow sezonu 2026 — zgodnie z leaderboardami SAP
--
-- Sprawdzone 2026-09-18 wzgledem trzech zrodel:
--   plz2026  „Polska Liga Zeglarska 2026 (Ekstraklasa) Overall"
--   plz2026  „Polska Liga Zeglarska 2026 (1 Liga) Overall"
--   yplz2026 „Mlodziezowa Polska Liga Zeglarska 2026 Overall"
-- Mlodziezowa zgadzala sie w calosci.
--
-- Tam, gdzie klub ma juz wariant z wlasciwa nazwa, PRZEPINAMY sezon 2026
-- zamiast zmieniac nazwe wariantu — inaczej poprawka rozlewa sie na starsze
-- sezony (tak bylo z JSG). Nazwy zmieniamy tylko przy literowkach i zapisie.
-- ---------------------------------------------------------------------------

-- FLO: 2026 siedzi na wariancie „Jacht Klub Wielkopolski Flota Online",
--      a klub ma wariant „WKS Flota Gdynia" (uzywany w 2025).
UPDATE liga_miejsca m SET id_wariantu_klubu = 5117166
  FROM liga_wyscigi y JOIN liga_regaty r ON r.id_regat = y.id_regat
 WHERE m.id_wyscigu = y.id_wyscigu AND r.rok = 2026 AND m.id_wariantu_klubu = 74220210;
UPDATE liga_wystepowanie_w_regatach v SET id_wariantu_klubu = 5117166
  FROM liga_regaty r
 WHERE v.id_regat = r.id_regat AND r.rok = 2026 AND v.id_wariantu_klubu = 74220210;
UPDATE liga_wynikregatmanual wr SET id_wariantu_klubu = 5117166
  FROM liga_regaty r
 WHERE wr.regaty = r.id_regat AND r.rok = 2026 AND wr.id_wariantu_klubu = 74220210;

-- YKP Gdynia: 2026 trafilo na wariant z lat 2019-2021 („Yacht Klub Polski
--      Gdynia"), a od 2023 klub wystepuje jako „YKP Gdynia".
UPDATE liga_miejsca m SET id_wariantu_klubu = 9704316
  FROM liga_wyscigi y JOIN liga_regaty r ON r.id_regat = y.id_regat
 WHERE m.id_wyscigu = y.id_wyscigu AND r.rok = 2026 AND m.id_wariantu_klubu = 77473926;
UPDATE liga_wystepowanie_w_regatach v SET id_wariantu_klubu = 9704316
  FROM liga_regaty r
 WHERE v.id_regat = r.id_regat AND r.rok = 2026 AND v.id_wariantu_klubu = 77473926;
UPDATE liga_wynikregatmanual wr SET id_wariantu_klubu = 9704316
  FROM liga_regaty r
 WHERE wr.regaty = r.id_regat AND r.rok = 2026 AND wr.id_wariantu_klubu = 77473926;

-- HRM: wariant 59952554 („HRM Racing Youth") obsluguje w 2026 Ekstraklase
--      I Mlodziezowa naraz, wiec zmiana nazwy jest niemozliwa. Ekstraklase
--      przepinamy na seniorski wariant 12403011 („HRM Racing"), Mlodziezowa
--      zostaje. Zrobione recznie na produkcji 2026-09-12 — tutaj, zeby
--      przetrwalo import.
UPDATE liga_miejsca m SET id_wariantu_klubu = 12403011
  FROM liga_wyscigi y JOIN liga_regaty r ON r.id_regat = y.id_regat
 WHERE m.id_wyscigu = y.id_wyscigu AND r.rok = 2026 AND r.liga_poziom = 'Ekstraklasa'
   AND m.id_wariantu_klubu = 59952554;
UPDATE liga_wystepowanie_w_regatach v SET id_wariantu_klubu = 12403011
  FROM liga_regaty r
 WHERE v.id_regat = r.id_regat AND r.rok = 2026 AND r.liga_poziom = 'Ekstraklasa'
   AND v.id_wariantu_klubu = 59952554;
UPDATE liga_wynikregatmanual wr SET id_wariantu_klubu = 12403011
  FROM liga_regaty r
 WHERE wr.regaty = r.id_regat AND r.rok = 2026 AND r.liga_poziom = 'Ekstraklasa'
   AND wr.id_wariantu_klubu = 59952554;

-- Literowka i zapis nazwy — te same warianty wystepuja w starszych sezonach,
-- ale poprawka jest tam rownie sluszna, wiec zmieniamy nazwe wprost.
UPDATE liga_klubwariant SET nazwa = 'Yacht Club Białołęka' WHERE id_wariantu_klubu = 74174186;
UPDATE liga_klubwariant SET nazwa = 'Texet JKW Sailing Team' WHERE id_wariantu_klubu = 39262660;
UPDATE liga_klubwariant SET nazwa = 'Jacht Klub Stoczni Gdańskiej' WHERE id_wariantu_klubu = 20708529;


-- ---------------------------------------------------------------------------
-- 6. Pozostale nazwy sezonu 2026 — decyzja usera 2026-09-18: bierzemy nazwy
--    z SAP-a.
--
-- WOL i SPO to pojedyncze warianty (WOL tylko 2026, SPO 2025-2026) albo roznica
-- czysto zapisowa, wiec wystarczy zmiana nazwy.
--
-- YKL i GGR sa trudniejsze: ich warianty obsluguja tez starsze sezony
-- (YKL 2022-2025, GGR 2022), a nazwy z SAP-a dotycza sezonu 2026 — „Energa"
-- to sponsor, ktorego w 2022 nie bylo. Zamiast przepisywac historie zakladamy
-- osobne warianty na 2026 i przepinamy na nie tegoroczne wyniki. ID z zakresu
-- 9xx xxx xxx sa celowo poza zakresem zrodlowego eksportu (max ~99 mln), zeby
-- nigdy nie zderzyly sie z ID z CSV.
-- ---------------------------------------------------------------------------

UPDATE liga_klubwariant SET nazwa = 'UKS Wiking Wolin' WHERE id_wariantu_klubu = 92127505;
UPDATE liga_klubwariant SET nazwa = 'Sport Vita Ski&Sail' WHERE id_wariantu_klubu = 53387446;

INSERT INTO liga_klubwariant (id_wariantu_klubu, skrot, nazwa, id_zestawienia_klubow)
VALUES (900000001, 'YKL', 'Yacht Klub Polski Lublin', 9105),
       (900000002, 'GGR', 'Energa Giżycka Grupa Regatowa', 9016)
ON CONFLICT (id_wariantu_klubu) DO UPDATE
   SET skrot = EXCLUDED.skrot,
       nazwa = EXCLUDED.nazwa,
       id_zestawienia_klubow = EXCLUDED.id_zestawienia_klubow;

-- YKL: sezon 2026 na nowy wariant, lata 2022-2025 zostaja pod stara nazwa.
UPDATE liga_miejsca m SET id_wariantu_klubu = 900000001
  FROM liga_wyscigi y JOIN liga_regaty r ON r.id_regat = y.id_regat
 WHERE m.id_wyscigu = y.id_wyscigu AND r.rok = 2026 AND m.id_wariantu_klubu = 73113253;
UPDATE liga_wystepowanie_w_regatach v SET id_wariantu_klubu = 900000001
  FROM liga_regaty r
 WHERE v.id_regat = r.id_regat AND r.rok = 2026 AND v.id_wariantu_klubu = 73113253;
UPDATE liga_wynikregatmanual wr SET id_wariantu_klubu = 900000001
  FROM liga_regaty r
 WHERE wr.regaty = r.id_regat AND r.rok = 2026 AND wr.id_wariantu_klubu = 73113253;

-- GGR: to samo, rok 2022 zostaje bez sponsora w nazwie.
UPDATE liga_miejsca m SET id_wariantu_klubu = 900000002
  FROM liga_wyscigi y JOIN liga_regaty r ON r.id_regat = y.id_regat
 WHERE m.id_wyscigu = y.id_wyscigu AND r.rok = 2026 AND m.id_wariantu_klubu = 37537849;
UPDATE liga_wystepowanie_w_regatach v SET id_wariantu_klubu = 900000002
  FROM liga_regaty r
 WHERE v.id_regat = r.id_regat AND r.rok = 2026 AND v.id_wariantu_klubu = 37537849;
UPDATE liga_wynikregatmanual wr SET id_wariantu_klubu = 900000002
  FROM liga_regaty r
 WHERE wr.regaty = r.id_regat AND r.rok = 2026 AND wr.id_wariantu_klubu = 37537849;


-- ---------------------------------------------------------------------------
-- 7. Zespoly mlodziezowe i drugie zalogi jako osobne kluby (decyzja 2026-09-18)
--
-- Yacht Club Gdansk wystawia w 2026 az piec zespolow mlodziezowych, a
-- Politechnika Morska Szczecin druga zaloge. Dopoki siedza pod jednym
-- zestawieniem, maja wspolny profil i wspolne statystyki, a na liscie zespolow
-- kazdy kafelek prowadzi do klubu-matki. Zakladamy im wlasne zestawienia.
--
-- Uwaga na ciaglosc historii: ten sam zespol ma w kazdym sezonie inny wariant
-- (Junior to YCJ w 2025 i YCGJ w 2026), wiec grupujemy po ZESPOLE, nie po
-- wariancie — inaczej rocznik 2025 wyladowalby w osobnym klubie niz 2026.
--
-- Pierwsza druzyna zostaje pod 9099 razem z wariantem „HRM Racing Yacht Club
-- Gdansk" (2019-2021) — to ta sama zaloga pod nazwa sponsora, nie osobny klub.
--
-- ID 9000xx sa poza zakresem zrodlowego eksportu (9000-9119).
-- ---------------------------------------------------------------------------

INSERT INTO liga_zestawienieklubow (id_zestawienia_klubow, nazwa)
VALUES (900001, 'Yacht Club Gdańsk Junior'),
       (900002, 'Yacht Club Gdańsk Youth'),
       (900003, 'Yacht Club Gdańsk Cadetti'),
       (900004, 'Yacht Club Gdańsk Ryśki'),
       (900005, 'Yacht Club Gdańsk Sigmy'),
       (900006, 'Politechnika Morska Szczecin 2')
ON CONFLICT (id_zestawienia_klubow) DO UPDATE SET nazwa = EXCLUDED.nazwa;

UPDATE liga_klubwariant SET id_zestawienia_klubow = 900001
 WHERE id_wariantu_klubu IN (2877157, 73579006);   -- Junior: 2025 + 2026
UPDATE liga_klubwariant SET id_zestawienia_klubow = 900002
 WHERE id_wariantu_klubu IN (39146377, 30078914);  -- Youth: 2025 + 2026
UPDATE liga_klubwariant SET id_zestawienia_klubow = 900003
 WHERE id_wariantu_klubu = 81436706;               -- Cadetti
UPDATE liga_klubwariant SET id_zestawienia_klubow = 900004
 WHERE id_wariantu_klubu = 37119258;               -- Ryśki
UPDATE liga_klubwariant SET id_zestawienia_klubow = 900005
 WHERE id_wariantu_klubu = 94867914;               -- Sigmy
UPDATE liga_klubwariant SET id_zestawienia_klubow = 900006
 WHERE id_wariantu_klubu = 18112440;               -- Politechnika Morska Szczecin 2

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

-- Kontrola punktu 5: nazwy sezonu 2026 wedlug ligi.
SELECT r.liga_poziom, w.skrot, w.nazwa
  FROM liga_wynikregatmanual m
  JOIN liga_regaty r ON r.id_regat = m.regaty
  JOIN liga_klubwariant w ON w.id_wariantu_klubu = m.id_wariantu_klubu
 WHERE r.rok = 2026 AND w.skrot IN ('FLO', 'YKP', 'HRM', 'YCB', 'TXT', 'JSG', 'WOL', 'SPO', 'YKL', 'GGR')
 GROUP BY 1, 2, 3 ORDER BY 2, 1;

-- Kontrola punktu 7: kazdy zespol ma wlasnego klub-matke.
SELECT z.id_zestawienia_klubow AS zest, z.nazwa AS klub_matka, w.skrot, w.nazwa AS wariant
  FROM liga_zestawienieklubow z
  JOIN liga_klubwariant w ON w.id_zestawienia_klubow = z.id_zestawienia_klubow
 WHERE z.id_zestawienia_klubow IN (9055, 9099, 900001, 900002, 900003, 900004, 900005, 900006)
 ORDER BY z.id_zestawienia_klubow, w.skrot;
