-- Panel (Payload) — przypisanie zespołów sezonu (poziom ligi + wariant) do klubów panelu.
-- Payload w produkcji nie robi push schematu, więc kolumnę dodajemy ręcznie. Idempotentne.

ALTER TABLE payload.kluby
  ADD COLUMN IF NOT EXISTS sezon_przypisania jsonb;
