-- Strona główna: możliwość wyłączenia przycisku „Śledź regaty" w pasku odliczania
-- (nagłówek ma własny przycisk sterowany przez strefa_kibica.pokaz_przycisk).
-- Payload nie robi push schematu w produkcji — kolumnę dodajemy ręcznie.
--
-- Uruchomienie na serwerze:
--   docker exec -i serverplz-postgres-1 psql -U plz_user -d plz \
--     < db/migrations/2026-09-15_pasek_regat_przycisk.sql

ALTER TABLE payload.strona_glowna
  ADD COLUMN IF NOT EXISTS pasek_regat_pokaz_przycisk boolean DEFAULT true;

UPDATE payload.strona_glowna
   SET pasek_regat_pokaz_przycisk = COALESCE(pasek_regat_pokaz_przycisk, true);
