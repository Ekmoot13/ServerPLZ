-- Usuwa WYŁĄCZNIE tabele ligowe (liga_*), żeby odtworzyć je ze schema.sql w czystej postaci.
-- Tabele aplikacji (users, streams, events) i schemat payload NIE są ruszane.
DROP TABLE IF EXISTS liga_miejsca CASCADE;
DROP TABLE IF EXISTS liga_wynikregatmanual CASCADE;
DROP TABLE IF EXISTS liga_wystepowanie_w_regatach CASCADE;
DROP TABLE IF EXISTS liga_wyscigi CASCADE;
DROP TABLE IF EXISTS liga_regaty CASCADE;
DROP TABLE IF EXISTS liga_klubwariant CASCADE;
DROP TABLE IF EXISTS liga_zawodnik CASCADE;
DROP TABLE IF EXISTS liga_zestawienieklubow CASCADE;
