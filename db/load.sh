#!/usr/bin/env bash
# db/load.sh — import danych ligowych PLŻ do PostgreSQL (Etap 1)
# Uruchamiać z katalogu głównego repo na serwerze:  ./db/load.sh
# Wymaga działającego stacku (docker-compose.prod.yml) i pliku .env.
# Idempotentny: czyści tabele liga_ i ładuje od nowa.

set -euo pipefail
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

if [ -f .env ]; then set -a; . ./.env; set +a; fi
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
DB_USER="${POSTGRES_USER:?brak POSTGRES_USER w .env}"
DB_NAME="${POSTGRES_DB:?brak POSTGRES_DB w .env}"
SEED="db/seed"

psql_c() { docker compose -f "$COMPOSE_FILE" exec -T postgres psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME" "$@"; }
copy_csv() {  # $1=tabela  $2=kolumny  $3=plik
  echo "  -> $1"
  cat "$SEED/$3" | psql_c -c "COPY $1 ($2) FROM STDIN WITH (FORMAT csv, HEADER true, NULL '', ENCODING 'UTF8')"
}

echo "== 1/4 Schemat =="
psql_c < db/schema.sql

echo "== 2/4 Czyszczenie tabel liga_ (idempotentnie) =="
psql_c -c "TRUNCATE liga_ZestawienieKlubow, liga_KlubWariant, liga_Zawodnik, liga_Regaty, liga_Wyscigi, liga_Wystepowanie_w_regatach, liga_Miejsca, liga_WynikRegatManual RESTART IDENTITY CASCADE;"

echo "== 3/4 Ładowanie danych (kolejność wg kluczy obcych) =="
copy_csv liga_ZestawienieKlubow       "ID_zestawienia_klubow,Nazwa"                                                                         zestawienie_klubow.csv
copy_csv liga_KlubWariant             "ID_wariantu_klubu,Skrot,Nazwa,ID_zestawienia_klubow"                                                 klub_wariant.csv
copy_csv liga_Zawodnik                "ID_Zawodnika,Imie,Nazwisko,Email,Pozycja_na_lodce,Data_wstapienia_do_PLZ,Numer_licencji,Numer_ubezpieczenia" zawodnik.csv
copy_csv liga_Regaty                  "ID_Regat,Nazwa,Liga_Poziom,Miasto,Numer_Rundy,Rok"                                                   regaty.csv
copy_csv liga_Wyscigi                 "ID_wyscigu,ID_Regat,Numer_wyscigu,Finalowy"                                                          wyscigi.csv
copy_csv liga_Wystepowanie_w_regatach "ID_Zawodnika,ID_Regat,ID_wariantu_klubu,WynikWRegatach,Trening"                                      wystepowanie.csv
copy_csv liga_Miejsca                 "ID_wyscigu,ID_wariantu_klubu,Zajete_miejsce,Kary,Numer_lodki"                                        miejsca.csv
copy_csv liga_WynikRegatManual        "regaty,ID_wariantu_klubu,miejsceWRegatach"                                                           wynik_regat_manual.csv

echo "== 4/4 Podsumowanie =="
psql_c -c "SELECT 'ZestawienieKlubow' AS tabela, count(*) FROM liga_ZestawienieKlubow
UNION ALL SELECT 'KlubWariant', count(*) FROM liga_KlubWariant
UNION ALL SELECT 'Zawodnik', count(*) FROM liga_Zawodnik
UNION ALL SELECT 'Regaty', count(*) FROM liga_Regaty
UNION ALL SELECT 'Wyscigi', count(*) FROM liga_Wyscigi
UNION ALL SELECT 'Wystepowanie', count(*) FROM liga_Wystepowanie_w_regatach
UNION ALL SELECT 'Miejsca', count(*) FROM liga_Miejsca
UNION ALL SELECT 'WynikRegatManual', count(*) FROM liga_WynikRegatManual;"
echo "== GOTOWE =="
