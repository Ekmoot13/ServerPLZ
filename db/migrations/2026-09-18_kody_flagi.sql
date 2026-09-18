-- Kody dostepu do aplikacji sterujacej flaga AP (wazne 24 h).
-- Trzymane w globalu Strefy Kibica, bo jest ich kilka i zyja krotko —
-- osobna kolekcja bylaby tu ciezsza niz problem.

ALTER TABLE payload.strefa_kibica
  ADD COLUMN IF NOT EXISTS kody_flagi jsonb;
