-- Kolekcja „sprostowania" — wnioski zawodników o poprawienie ich występów.
--
-- Payload w produkcji NIE robi push schematu (build produkcyjny), więc tabelę
-- zakładamy ręcznie. Struktura zdjęta 1:1 z bazy lokalnej, gdzie push ją utworzył.
--
-- Uruchomienie na serwerze:
--   docker compose -f docker-compose.prod.yml exec -T postgres \
--     psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f - < db/migrations/2026-09-25_sprostowania.sql

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
                  WHERE n.nspname = 'payload' AND t.typname = 'enum_sprostowania_typ') THEN
    CREATE TYPE payload.enum_sprostowania_typ AS ENUM ('dodanie', 'usuniecie');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
                  WHERE n.nspname = 'payload' AND t.typname = 'enum_sprostowania_status') THEN
    CREATE TYPE payload.enum_sprostowania_status AS ENUM ('nowy', 'zaakceptowany', 'odrzucony');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS payload.sprostowania (
  id             serial PRIMARY KEY,
  typ            payload.enum_sprostowania_typ    NOT NULL,
  status         payload.enum_sprostowania_status NOT NULL DEFAULT 'nowy',
  zawodnik_id    numeric NOT NULL,
  zawodnik_nazwa varchar,
  wariant_id     numeric NOT NULL,
  klub_nazwa     varchar,
  regaty_id      numeric NOT NULL,
  regaty_opis    varchar,
  kontakt        varchar,
  uwagi          varchar,
  notatka        varchar,
  zastosowane    boolean DEFAULT false,
  updated_at     timestamp(3) with time zone NOT NULL DEFAULT now(),
  created_at     timestamp(3) with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sprostowania_created_at_idx ON payload.sprostowania (created_at);
CREATE INDEX IF NOT EXISTS sprostowania_updated_at_idx ON payload.sprostowania (updated_at);

-- Payload trzyma blokady edycji dokumentów w osobnej tabeli relacji.
ALTER TABLE payload.payload_locked_documents_rels
  ADD COLUMN IF NOT EXISTS sprostowania_id integer;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'payload_locked_documents_rels_sprostowania_fk'
  ) THEN
    ALTER TABLE payload.payload_locked_documents_rels
      ADD CONSTRAINT payload_locked_documents_rels_sprostowania_fk
      FOREIGN KEY (sprostowania_id) REFERENCES payload.sprostowania(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_sprostowania_id_idx
  ON payload.payload_locked_documents_rels (sprostowania_id);

COMMIT;
