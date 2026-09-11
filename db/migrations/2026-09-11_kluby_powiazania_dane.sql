-- Porządek w powiązaniach klubów panelu z bazą wyników.
-- Wariant A: ID przeniesione z gołych duplikatów na wpisy z logo, duplikaty dezaktywowane.
-- Wariant B: sekcje/zespoły klubu przełączone na tryb „wybrane warianty",
--            kluby-matki dostają listę wariantów wyłączonych z wyników.
-- Kopia stanu sprzed zmian ląduje w payload.kluby_backup_20260911 (nic nie jest kasowane).

BEGIN;

CREATE TABLE IF NOT EXISTS payload.kluby_backup_20260911 AS
  SELECT id, nazwa, id_zestawienia, tryb_powiazania, wykluczone_warianty, warianty, poziom_ligi, aktywny
  FROM payload.kluby;

-- ============ A. Duplikaty: ID na wpis z logo, goły bliźniak nieaktywny ============
UPDATE payload.kluby SET id_zestawienia = 9044, poziom_ligi = 'Młodzieżowa' WHERE id = 32;  -- UKŻ Lamelka Kartuzy
UPDATE payload.kluby SET id_zestawienia = 9112, poziom_ligi = 'Młodzieżowa',
       nazwa = 'Uniwersytet Gdański' WHERE id = 55;                                          -- D4: literówka
UPDATE payload.kluby SET id_zestawienia = 9110, poziom_ligi = 'Młodzieżowa' WHERE id = 54;  -- Wydział Elektryczny PW
UPDATE payload.kluby SET id_zestawienia = 9109, poziom_ligi = 'Młodzieżowa' WHERE id = 57;  -- Żegluj Lublin
UPDATE payload.kluby SET id_zestawienia = 9111, poziom_ligi = 'Młodzieżowa' WHERE id = 56;  -- Siostry AZS AWFiS
UPDATE payload.kluby SET id_zestawienia = 9055, poziom_ligi = 'Młodzieżowa' WHERE id = 30;  -- Politechnika Morska
UPDATE payload.kluby SET id_zestawienia = 9097, poziom_ligi = '1 Liga'      WHERE id = 24;  -- Yacht Club Sopot 2
UPDATE payload.kluby SET id_zestawienia = 9117, poziom_ligi = '1 Liga'      WHERE id = 19;  -- MKŻ Mikołajki
UPDATE payload.kluby SET id_zestawienia = 9118, poziom_ligi = '1 Liga'      WHERE id = 35;  -- YKP Rzeszów
UPDATE payload.kluby SET id_zestawienia = 9119, poziom_ligi = '1 Liga'      WHERE id = 36;  -- RITS
UPDATE payload.kluby SET id_zestawienia = 9114, poziom_ligi = '1 Liga'      WHERE id = 15;  -- GQ Racing
UPDATE payload.kluby SET id_zestawienia = 9062 WHERE id = 2;                                 -- Ocean Challenge YC
UPDATE payload.kluby SET id_zestawienia = 9060 WHERE id = 28;                                -- JK Nowy Sztynort
UPDATE payload.kluby SET id_zestawienia = 9070 WHERE id = 23;                                -- PPJK

-- Gołe duplikaty (bez logo) schodzą z obiegu; ID zwalniamy, żeby nie kolidowały.
UPDATE payload.kluby SET aktywny = false, id_zestawienia = NULL
  WHERE id IN (103, 127, 125, 124, 126, 107, 122, 132, 133, 134, 129, 109, 108, 110);

-- D2: duplikat Olsztyńskiego Klubu Żeglarskiego (profil ma wpis #3 z ID 9066).
UPDATE payload.kluby SET aktywny = false WHERE id = 47;

-- ============ B. Zespoły klubu → tryb „wybrane warianty" ============
UPDATE payload.kluby SET tryb_powiazania = 'warianty', id_zestawienia = 9099,
       warianty = '[81436706]'::jsonb            WHERE id = 50;  -- YC Gdańsk Cadetti
UPDATE payload.kluby SET tryb_powiazania = 'warianty', id_zestawienia = 9099,
       warianty = '[2877157, 73579006]'::jsonb   WHERE id = 33;  -- YC Gdańsk Junior (2025 + 2026)
UPDATE payload.kluby SET tryb_powiazania = 'warianty', id_zestawienia = 9099,
       warianty = '[37119258]'::jsonb            WHERE id = 49;  -- YC Gdańsk Ryśki
UPDATE payload.kluby SET tryb_powiazania = 'warianty', id_zestawienia = 9099,
       warianty = '[94867914]'::jsonb            WHERE id = 52;  -- YC Gdańsk Sigmy
UPDATE payload.kluby SET tryb_powiazania = 'warianty', id_zestawienia = 9099,
       warianty = '[39146377, 30078914]'::jsonb  WHERE id = 34;  -- YC Gdańsk Youth (2025 + 2026)
UPDATE payload.kluby SET tryb_powiazania = 'warianty', id_zestawienia = 9101,
       warianty = '[19531518]'::jsonb            WHERE id = 37;  -- YC Sopot Youth
UPDATE payload.kluby SET tryb_powiazania = 'warianty', id_zestawienia = 9055,
       warianty = '[18112440]'::jsonb            WHERE id = 53;  -- Politechnika Morska Szczecin 2
UPDATE payload.kluby SET tryb_powiazania = 'warianty', id_zestawienia = 9028,
       warianty = '[59952554, 80098965]'::jsonb  WHERE id = 16;  -- HRM Racing Youth
-- Poniższe dwa dzielą wariant z klubem-matką (ten sam zespół pływa w dwóch ligach),
-- więc matka NIE wyklucza tego wariantu — inaczej straciłaby wyniki Ekstraklasy.
UPDATE payload.kluby SET tryb_powiazania = 'warianty', id_zestawienia = 9069,
       warianty = '[71024784]'::jsonb            WHERE id = 38;  -- AZS PG Youth
UPDATE payload.kluby SET tryb_powiazania = 'warianty', id_zestawienia = 9082,
       warianty = '[91072341]'::jsonb            WHERE id = 51;  -- On Lemon Rockstars Racing Youth

-- ============ B. Kluby-matki: warianty wyłączone z wyników ============
UPDATE payload.kluby
   SET wykluczone_warianty = '[81436706, 2877157, 73579006, 37119258, 94867914, 39146377, 30078914]'::jsonb
 WHERE id = 59;  -- Yacht Club Gdańsk (Cadetti, Junior, Ryśki, Sigmy, Youth)
UPDATE payload.kluby SET wykluczone_warianty = '[19531518]'::jsonb WHERE id = 62;  -- Yacht Club Sopot
UPDATE payload.kluby SET wykluczone_warianty = '[18112440]'::jsonb WHERE id = 30;  -- Politechnika Morska
UPDATE payload.kluby SET wykluczone_warianty = '[59952554, 80098965]'::jsonb WHERE id = 63;  -- HRM Racing

COMMIT;
