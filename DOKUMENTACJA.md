# Regaty Live — Dokumentacja techniczna

## Spis treści
1. [Przegląd systemu](#1-przegląd-systemu)
2. [Architektura](#2-architektura)
3. [Wymagania i uruchomienie](#3-wymagania-i-uruchomienie)
4. [Konfiguracja środowiska](#4-konfiguracja-środowiska)
5. [Panel Admina](#5-panel-admina)
6. [Transmisje na żywo](#6-transmisje-na-żywo)
7. [Wyniki SAP Sailing](#7-wyniki-sap-sailing)
8. [Baza danych](#8-baza-danych)
9. [Migracje bazy danych](#9-migracje-bazy-danych)
10. [Przydatne komendy](#10-przydatne-komendy)
11. [Rozwiązywanie problemów](#11-rozwiązywanie-problemów)

---

## 1. Przegląd systemu

**Regaty Live** to platforma do transmisji live dla regat żeglarskich. Umożliwia:

- Transmisję na żywo z kamer RTMP (w tym kamer 360°)
- Embedowanie transmisji z YouTube Live
- Wyświetlanie wyników regat z systemu SAP Sailing
- Zarządzanie transmisjami i wydarzeniami przez panel admina

**Adres serwera:** `167.233.147.6`

| Usługa | Port | Opis |
|--------|------|-------|
| Frontend (Next.js) | 3000 | Strona publiczna |
| Backend (FastAPI) | 8000 | API REST |
| MediaMTX HLS | 8888 | Odbiór strumieni HLS |
| MediaMTX RTMP | 1935 | Przyjmowanie strumieni z kamer |
| PostgreSQL | 5432 | Baza danych |

---

## 2. Architektura

```
Kamera RTMP
    │
    ▼
MediaMTX (port 1935)
    │  RTMP → HLS
    ▼
MediaMTX HLS (port 8888)
    │
    ▼
Przeglądarka ──── HLS.js / Three.js (360°)

Backend FastAPI (port 8000)
    ├── Polling statusu streamów co 8s
    ├── Proxy do SAP Sailing API
    ├── REST API (streams, events, auth)
    └── PostgreSQL

Frontend Next.js (port 3000)
    ├── /             Strona główna (live streamy)
    ├── /stream/[id]  Odtwarzacz
    ├── /events       Wyniki regat
    └── /admin        Panel administracyjny
```

---

## 3. Wymagania i uruchomienie

### Wymagania
- Docker + Docker Compose
- Git

### Pierwsze uruchomienie

```bash
git clone https://github.com/Ekmoot13/ServerPLZ.git
cd ServerPLZ
cp .env.example .env   # lub utwórz .env ręcznie
docker compose up -d --build
```

### Aktualizacja po zmianach kodu

```bash
git pull origin main
docker compose restart backend frontend
```

### Restart wszystkich usług

```bash
docker compose restart
```

---

## 4. Konfiguracja środowiska

Plik `.env` w katalogu głównym (`/opt/ServerPLZ/.env`):

```env
# Baza danych
POSTGRES_DB=streaming
POSTGRES_USER=streaming_user
POSTGRES_PASSWORD=TWOJE_HASLO

# Backend
SECRET_KEY=DLUGI_LOSOWY_KLUCZ_JWT
HLS_BASE_URL=http://167.233.147.6:8888

# Frontend
NEXT_PUBLIC_API_URL=http://167.233.147.6:8000
NEXT_PUBLIC_HLS_BASE_URL=http://167.233.147.6:8888
```

### Tworzenie konta admina

```bash
# Wygeneruj hash hasła i ustaw od razu
docker exec serverplz-backend-1 python3 -c "
from passlib.context import CryptContext
pwd = CryptContext(schemes=['bcrypt'])
print(pwd.hash('TWOJE_HASLO'))
" | xargs -I{} docker exec serverplz-postgres-1 psql \
  -U streaming_user -d streaming \
  -c "UPDATE users SET role='admin', password_hash='{}' WHERE email='admin@example.com';"
```

Lub zarejestruj się przez `/admin` i zmień rolę w bazie:

```bash
docker exec serverplz-postgres-1 psql -U streaming_user -d streaming \
  -c "UPDATE users SET role='admin' WHERE email='twoj@email.com';"
```

---

## 5. Panel Admina

**Adres:** `http://167.233.147.6:3000/admin`

### Zakładki

| Zakładka | Opis |
|----------|------|
| Transmisje | Lista wszystkich transmisji z statusem, kluczem RTMP |
| + Nowa transmisja | Formularz tworzenia transmisji (kamera lub YouTube) |
| Wyniki | Lista wydarzeń z SAP ID |
| + Nowe wydarzenie | Formularz tworzenia wydarzenia z wynikami |

### Logowanie
Użyj emaila i hasła konta z rolą `admin`.

---

## 6. Transmisje na żywo

### Typ 1: Kamera RTMP (w tym 360°)

1. W panelu admina → **+ Nowa transmisja** → typ **Kamera 360°**
2. Wpisz tytuł i utwórz transmisję
3. Skopiuj wyświetlony link RTMP (przycisk "Kopiuj"):
   ```
   rtmp://167.233.147.6:1935/live/KLUCZ_RTMP
   ```
4. W oprogramowaniu kamery (OBS, kamera sprzętowa):
   - **Serwer RTMP:** `rtmp://167.233.147.6:1935/live/`
   - **Klucz strumienia:** `KLUCZ_RTMP`
5. Backend automatycznie wykrywa start/stop transmisji co 8 sekund i aktualizuje status

### Typ 2: YouTube Live

1. W panelu admina → **+ Nowa transmisja** → typ **YouTube Live**
2. Wklej URL transmisji YouTube (np. `https://www.youtube.com/watch?v=ABCDEF`)
3. Status można ręcznie przełączać przyciskiem "Wznów" / "Zakończ"

### Odtwarzacz 360°

Strumienie z kamer wyświetlane są w trybie 360° (sfera WebGL z Three.js).  
Obsługuje standardowe formaty HLS z kamer equirectangular.

### Auto-odświeżanie strony głównej

Strona główna odświeża się automatycznie co **15 sekund**, aby pokazywać aktualne transmisje bez ręcznego przeładowania.

---

## 7. Wyniki SAP Sailing

### Jak dodać wyniki do wydarzenia

1. Wejdź na stronę wyników regaty na **sapsailing.com**
2. Skopiuj **pełen URL API** z paska adresu lub z dokumentacji SAP Sailing. URL ma format:
   ```
   https://SUBDOMENA.sapsailing.com/sailingserver/api/v1/events/UUID
   ```
   Przykład:
   ```
   https://tlz2026.sapsailing.com/sailingserver/api/v1/events/4d1716f4-2f91-4c51-8529-becc5025e0b4
   ```
   > Uwaga: subdomena różni się dla każdej regaty (np. `tlz2026`, `yplz2026` itp.)

3. W panelu admina → **+ Nowe wydarzenie**
4. Wklej skopiowany URL w pole **"ID wydarzenia SAP Sailing"**
5. Wyniki pojawią się automatycznie na stronie `/events`

### Jak działa proxy

Przeglądarka nie może bezpośrednio odpytać `sapsailing.com` (CORS).  
Backend posiada endpoint proxy: `GET /proxy/sap?url=PELNY_URL`  
który pobiera dane server-side i zwraca je frontendowi.

---

## 8. Baza danych

### Tabele

**`users`** — konta użytkowników
| Kolumna | Typ | Opis |
|---------|-----|------|
| id | UUID | Klucz główny |
| email | VARCHAR | Unikalny email |
| password_hash | VARCHAR | Hash bcrypt |
| display_name | VARCHAR | Nazwa wyświetlana |
| role | ENUM | `admin` lub `viewer` |

**`streams`** — transmisje
| Kolumna | Typ | Opis |
|---------|-----|------|
| id | UUID | Klucz główny |
| title | VARCHAR | Tytuł transmisji |
| rtmp_key | VARCHAR(64) | Unikalny klucz RTMP |
| youtube_url | VARCHAR | URL YouTube (opcjonalny) |
| status | ENUM | `live` lub `offline` |
| started_at | TIMESTAMP | Czas startu |

**`events`** — wydarzenia / wyniki
| Kolumna | Typ | Opis |
|---------|-----|------|
| id | UUID | Klucz główny |
| title | VARCHAR | Tytuł wydarzenia |
| event_date | TIMESTAMP | Data wydarzenia |
| sap_event_id | VARCHAR(255) | Pełen URL API SAP Sailing |
| results | JSONB | Wyniki (opcjonalnie ręcznie) |

---

## 9. Migracje bazy danych

Baza tworzona jest automatycznie przy starcie backendu (`init_db()`).  
Dla zmian istniejących tabel wymagane są ręczne migracje SQL.

```bash
# Szablon
docker exec serverplz-postgres-1 psql -U streaming_user -d streaming \
  -c "ALTER TABLE nazwa_tabeli ADD COLUMN IF NOT EXISTS kolumna TYP;"
```

### Historia migracji

```sql
-- Dodanie obsługi YouTube
ALTER TABLE streams ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(255);

-- Dodanie integracji SAP Sailing
ALTER TABLE events ADD COLUMN IF NOT EXISTS sap_event_id VARCHAR(255);
```

---

## 10. Przydatne komendy

### Kontenery Docker

```bash
# Status kontenerów
docker compose ps

# Logi konkretnej usługi
docker compose logs backend --tail=50
docker compose logs frontend --tail=50
docker compose logs mediamtx --tail=50

# Restart pojedynczej usługi
docker compose restart backend
docker compose restart frontend

# Restart wszystkiego
docker compose restart

# Przebudowanie po zmianie Dockerfile
docker compose up -d --build backend
```

### Baza danych

```bash
# Połączenie z bazą
docker exec -it serverplz-postgres-1 psql -U streaming_user -d streaming

# Lista tabel
\dt

# Podgląd streamów
SELECT id, title, status, rtmp_key FROM streams;

# Podgląd wydarzeń
SELECT id, title, event_date, sap_event_id FROM events;

# Zmiana roli użytkownika na admina
UPDATE users SET role='admin' WHERE email='email@example.com';
```

### SSH na serwer

```bash
ssh root@167.233.147.6
# Katalog projektu: /opt/ServerPLZ
```

---

## 11. Rozwiązywanie problemów

### Backend nie startuje

```bash
docker compose logs backend --tail=50
```
Najczęstsze przyczyny:
- Baza danych nie jest gotowa — poczekaj chwilę i uruchom ponownie
- Brakująca kolumna w DB — uruchom odpowiednią migrację

### Transmisja nie zmienia statusu na "live"

Backend odpytuje MediaMTX co 8 sekund. Sprawdź czy MediaMTX działa:
```bash
docker compose logs mediamtx --tail=20
```
Minimalna konfiguracja MediaMTX wymaga `hlsSegmentCount: 7` (minimum).

### CORS błędy w przeglądarce

Backend jest skonfigurowany z `allow_origins=["*"]` i `allow_credentials=False`.  
Jeśli pojawią się błędy CORS, sprawdź czy backend jest uruchomiony:
```bash
curl http://167.233.147.6:8000/health
# Oczekiwana odpowiedź: {"status": "ok"}
```

### Błąd "can't subtract offset-naive and offset-aware datetimes"

Wystąpił przy tworzeniu wydarzeń — naprawiony w routerze events.py (strip timezone).

### Wyniki SAP nie ładują się

1. Sprawdź czy URL jest prawidłowy — skopiuj z sapsailing.com
2. Przetestuj URL bezpośrednio:
   ```bash
   curl "PELNY_URL_SAP_API"
   ```
3. Upewnij się że subdomena odpowiada Twojej regatcie

### Video 360° się zawiesza

Odtwarzacz używa konserwatywnych ustawień HLS.js (`lowLatencyMode: false`).  
Jeśli stream się zawiesza, sprawdź połączenie z MediaMTX i jakość sygnału kamery.
