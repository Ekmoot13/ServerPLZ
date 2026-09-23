# Baza danych ligowych PLŻ (Etap 1)

Dane historyczne Polskiej Ligi Żeglarskiej (2015–2025) w PostgreSQL, tabele z przedrostkiem `liga_`.
Współistnieją z tabelami aplikacji (`users`, `streams`, `events`) w tej samej bazie `plz`.

## Pliki
- `schema.sql` — schemat (przeniesiony z MySQL na PostgreSQL: IDENTITY zamiast AUTO_INCREMENT).
- `seed/*.csv` — dane (czyste: bez BOM, bez pustych kolumn ID auto-inkrement).
- `load.sh` — import: schemat + `TRUNCATE` + `COPY` w kolejności kluczy obcych + podsumowanie.

## Uruchomienie (na serwerze, z katalogu repo)
```bash
chmod +x db/load.sh
./db/load.sh
```

## Uruchomienie lokalnie (docker-compose.local.yml)

Świeża lokalna baza dostaje od Payloada wyłącznie własne tabele (`push: true`).
Tabel `liga_*` tam nie ma, więc strona główna, wyniki i profile klubów wywalają
się z `relation "liga_wynikregatmanual" does not exist`. Trzeba je założyć
i napełnić danymi z `db/import`:

```bash
docker compose -f docker-compose.local.yml exec -T postgres \n  psql -U plz_user -d plz -f - < db/schema.sql
docker compose -f docker-compose.local.yml exec -T postgres sh -c 'rm -rf /tmp/import'
docker compose -f docker-compose.local.yml cp db/import postgres:/tmp/
docker compose -f docker-compose.local.yml exec -T postgres \n  psql -U plz_user -d plz -f - < db/load_all.sql
```

Konto do panelu i wpisy testowe zakłada `web/scripts/dane-testowe-lokalnie.ts`.

## Oczekiwane liczby wierszy
| Tabela | Wierszy |
|---|---|
| ZestawienieKlubow | 84 |
| KlubWariant | 156 |
| Zawodnik | 476 |
| Regaty | 83 |
| Wyscigi | 1070 |
| Wystepowanie | 821 |
| Miejsca | 14955 |
| WynikRegatManual | 1196 |

Weryfikacja przed wdrożeniem: integralność kluczy obcych i unikalność PK sprawdzone (0 problemów),
składnia `schema.sql` potwierdzona parserem PostgreSQL (pglast).
