-- Strona główna: duży kafelek aktualności można czasowo podmienić
-- na najnowszy post z social mediów (YouTube / Instagram / Facebook / TikTok).
-- Payload nie robi push schematu w produkcji — kolumny dodajemy ręcznie.
--
-- Uruchomienie na serwerze (po jednej komendzie):
--   docker exec serverplz-postgres-1 psql -U plz_user -d plz -c "<ALTER ...>"

ALTER TABLE payload.strona_glowna
  ADD COLUMN IF NOT EXISTS kafelek_glowny_tryb            varchar DEFAULT 'newsy',
  ADD COLUMN IF NOT EXISTS kafelek_glowny_platforma       varchar DEFAULT 'youtube',
  ADD COLUMN IF NOT EXISTS kafelek_glowny_zrodlo          varchar DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS kafelek_glowny_kanal_id        varchar,
  ADD COLUMN IF NOT EXISTS kafelek_glowny_post_url        varchar,
  ADD COLUMN IF NOT EXISTS kafelek_glowny_wygasa          timestamp(3) with time zone,
  ADD COLUMN IF NOT EXISTS kafelek_glowny_reczna_nazwa    varchar,
  ADD COLUMN IF NOT EXISTS kafelek_glowny_reczny_obraz    varchar,
  ADD COLUMN IF NOT EXISTS kafelek_glowny_reczny_opis     varchar;
