-- Strefa Kibica: zdjęcie w tle sekcji informacyjnej (program weekendu).
-- Payload nie robi push schematu w produkcji — kolumnę dodajemy ręcznie.
--
-- Uruchomienie na serwerze:
--   docker exec serverplz-postgres-1 psql -U plz_user -d plz -c "<ALTER ...>"

ALTER TABLE payload.strefa_kibica
  ADD COLUMN IF NOT EXISTS program_tlo varchar;
