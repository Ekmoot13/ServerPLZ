-- Strefa Kibica: osobne przełączniki widoczności sekcji dashboardu.
-- Payload w produkcji nie robi push schematu (next build && next start),
-- więc nowe pola globala trzeba dodać ręcznie.
--
-- Uruchomienie na serwerze:
--   docker exec -i serverplz-postgres-1 psql -U plz_user -d plz \
--     < db/migrations/2026-09-15_strefa_kibica_sekcje.sql

ALTER TABLE payload.strefa_kibica
  ADD COLUMN IF NOT EXISTS pokaz_transmisje boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS pokaz_wyniki     boolean DEFAULT true;

-- istniejący wiersz globala: nic nie chowamy bez decyzji redaktora
UPDATE payload.strefa_kibica
   SET pokaz_transmisje = COALESCE(pokaz_transmisje, true),
       pokaz_wyniki     = COALESCE(pokaz_wyniki, true);
