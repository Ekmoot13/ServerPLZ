-- Strefa Kibica: sygnal flagowy komisji regatowej, przelaczany z telefonu.
--
-- Jedna flaga naraz, wiec zwykla kolumna tekstowa z kodem sygnalu:
--   '' (brak) | 'AP' | 'N' | 'PZ' | 'APA'
-- Payload nie robi push schematu w produkcji, wiec dodajemy recznie.

ALTER TABLE payload.strefa_kibica
  ADD COLUMN IF NOT EXISTS flaga varchar DEFAULT '';
