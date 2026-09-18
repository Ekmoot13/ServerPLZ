-- Panel: zespoly mlodziezowe Yacht Clubu Gdansk i druga zaloga Politechniki
-- Morskiej dostaly wlasne kluby-matki (zestawienia 900001-900006, zakladane
-- przez db/poprawki_klubow.sql).
--
-- Dotad ich wpisy w panelu byly podpiete trybem „warianty" do zestawienia
-- klubu-matki (9099 / 9055). Po rozdzieleniu te warianty juz tam nie leza,
-- wiec profil nowego klubu nie znajdowalby swojego wpisu — a wraz z nim logo,
-- zalogi i zdjec. Przepinamy je na wlasne zestawienia i wracamy do trybu
-- „zestawienie", bo klub ma juz teraz wylacznie swoje warianty.
--
-- Dopasowanie po skrocie, a nie po ID wpisu: panel produkcyjny i lokalny maja
-- rozne numery. UWAGA: payload.kluby NIE jest czyszczone przez load_all.sql,
-- wiec to migracja jednorazowa, a nie czesc poprawek powtarzanych po imporcie.
--
-- Uruchomienie:
--   docker cp <ten plik> serverplz-postgres-1:/tmp/m.sql
--   docker exec serverplz-postgres-1 sh -c 'psql -U $POSTGRES_USER -d $POSTGRES_DB -f /tmp/m.sql'

BEGIN;

UPDATE payload.kluby SET id_zestawienia = 900001, tryb_powiazania = 'zestawienie',
       warianty = NULL, updated_at = now() WHERE skrot = 'YCGJ';
UPDATE payload.kluby SET id_zestawienia = 900002, tryb_powiazania = 'zestawienie',
       warianty = NULL, updated_at = now() WHERE skrot = 'YCGY';
UPDATE payload.kluby SET id_zestawienia = 900003, tryb_powiazania = 'zestawienie',
       warianty = NULL, updated_at = now() WHERE skrot = 'YCGC';
UPDATE payload.kluby SET id_zestawienia = 900004, tryb_powiazania = 'zestawienie',
       warianty = NULL, updated_at = now() WHERE skrot = 'YCGR';
UPDATE payload.kluby SET id_zestawienia = 900005, tryb_powiazania = 'zestawienie',
       warianty = NULL, updated_at = now() WHERE skrot = 'YCGS';
UPDATE payload.kluby SET id_zestawienia = 900006, tryb_powiazania = 'zestawienie',
       warianty = NULL, updated_at = now() WHERE skrot = 'MUS2';

COMMIT;

SELECT skrot, nazwa, id_zestawienia, tryb_powiazania
  FROM payload.kluby
 WHERE skrot IN ('YCGJ', 'YCGY', 'YCGC', 'YCGR', 'YCGS', 'MUS2')
 ORDER BY skrot;
