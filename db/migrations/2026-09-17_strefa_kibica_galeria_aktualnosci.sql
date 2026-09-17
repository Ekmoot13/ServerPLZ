-- Strefa Kibica: dwie nowe sekcje na dole strony — galeria zdjęć (SmugMug)
-- i najnowsze aktualności. Payload nie robi push schematu w produkcji,
-- więc kolumny dodajemy ręcznie.
--
-- Uruchomienie na serwerze:
--   docker cp db/migrations/<ten plik> serverplz-postgres-1:/tmp/m.sql
--   docker exec serverplz-postgres-1 sh -c 'psql -U $POSTGRES_USER -d $POSTGRES_DB -f /tmp/m.sql'

ALTER TABLE payload.strefa_kibica
  ADD COLUMN IF NOT EXISTS pokaz_galerie boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS galeria_tytul varchar DEFAULT 'Galeria zdjęć',
  ADD COLUMN IF NOT EXISTS galeria_url varchar,
  ADD COLUMN IF NOT EXISTS galeria_tryb varchar DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS galeria_kolejnosc varchar DEFAULT 'najnowsze',
  ADD COLUMN IF NOT EXISTS galeria_zdjecia jsonb,
  ADD COLUMN IF NOT EXISTS pokaz_aktualnosci boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS aktualnosci_tytul varchar DEFAULT 'Aktualności',
  ADD COLUMN IF NOT EXISTS aktualnosci_kategoria varchar;
