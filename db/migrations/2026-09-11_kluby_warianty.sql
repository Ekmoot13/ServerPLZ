-- Panel (Payload) — powiązanie klubu z bazą wyników przez warianty.
-- Payload w trybie produkcyjnym nie robi push schematu, więc kolumny dodajemy ręcznie.
-- Idempotentne: można puścić wielokrotnie.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'enum_kluby_tryb_powiazania' AND n.nspname = 'payload'
  ) THEN
    CREATE TYPE payload.enum_kluby_tryb_powiazania AS ENUM ('zestawienie', 'warianty');
  END IF;
END $$;

ALTER TABLE payload.kluby
  ADD COLUMN IF NOT EXISTS tryb_powiazania payload.enum_kluby_tryb_powiazania DEFAULT 'zestawienie',
  ADD COLUMN IF NOT EXISTS wykluczone_warianty jsonb,
  ADD COLUMN IF NOT EXISTS warianty jsonb;

UPDATE payload.kluby SET tryb_powiazania = 'zestawienie' WHERE tryb_powiazania IS NULL;
