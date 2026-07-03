# Etap 0 — uruchomienie i zabezpieczenie serwera (runbook)

Instrukcja krok po kroku. Część 1 wykonujesz **na swoim komputerze** (porządki w repo),
część 2–6 **na serwerze VPS** przez SSH. Polecenia oznaczone `$` wpisujesz w terminalu.

Pliki konfiguracyjne Etapu 0 są już w repo:
`docker-compose.prod.yml`, `deploy/Caddyfile`, `deploy/.env.prod.example`,
`scripts/backup-db.sh`, `.gitignore`.

---

## 1. Porządki w repozytorium (na Twoim komputerze)

Źródłem prawdy jest git remote. Lokalne niezacommitowane zmiany są nieaktualne — odrzucamy je.
Foldery `backend/`, `frontend/`, `mediamtx/` w korzeniu to nieśledzone duplikaty — usuwamy je
(właściwy kod jest w `streaming-project/`).

Windows / PowerShell (Twój komputer):

```powershell
cd ścieżka\do\ServerPLZ

# 1a. Odśwież z remote
git fetch origin

# 1b. Odrzuć nieaktualne lokalne zmiany (tylko pliki śledzone przez git)
git checkout -- .

# 1c. Usuń duplikaty (składnia PowerShell — nazwy po przecinku; NIE używaj "git clean -fd")
Remove-Item -Recurse -Force backend, frontend, mediamtx

# 1d. Sprawdź: powinny zostać tylko NOWE pliki Etapu 0 jako nieśledzone
git status
```

(Odpowiednik na Linux/macOS: `rm -rf backend frontend mediamtx`.)

Następnie dodaj i zacommituj pliki Etapu 0:

```bash
git add docker-compose.prod.yml deploy/ scripts/ .gitignore
git commit -m "Etap 0: hardened compose, Caddy HTTPS, backup, gitignore"
git push
```

> Uwaga: `.gitignore` ignoruje `/backend/`, `/frontend/`, `/mediamtx/` w korzeniu (duplikaty).
> Jeśli w przyszłości podniesiesz `streaming-project/` do korzenia, usuń te trzy linie z `.gitignore`.

---

## 2. Przygotowanie serwera (VPS)

Zaloguj się na serwer i zainstaluj Dockera (jeśli go nie ma):

```bash
ssh użytkownik@167.233.147.6

# Docker + plugin compose (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"   # wyloguj się i zaloguj ponownie
docker --version && docker compose version
```

Pobierz repo na serwer (np. do /opt):

```bash
sudo mkdir -p /opt && sudo chown "$USER" /opt
cd /opt
git clone https://github.com/Ekmoot13/ServerPLZ.git
cd ServerPLZ
```

---

## 3. Konfiguracja środowiska

```bash
cp deploy/.env.prod.example .env
nano .env
```

Uzupełnij w `.env`:

- `DOMAIN` — domena (np. `staging.twojadomena.pl`); rekordy A dla `DOMAIN` i `api.DOMAIN` muszą wskazywać na IP serwera.
- `POSTGRES_PASSWORD` — wygeneruj: `openssl rand -base64 24`
- `SECRET_KEY` — wygeneruj: `openssl rand -hex 32`

---

## 4. Firewall i ochrona SSH

```bash
# Firewall — otwórz tylko SSH + HTTP + HTTPS
sudo apt update && sudo apt install -y ufw fail2ban
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose

# fail2ban — blokuje ataki brute-force na SSH (działa z domyślną konfiguracją)
sudo systemctl enable --now fail2ban
```

Zalecane dodatkowo (logowanie kluczem SSH zamiast hasła):

```bash
# Na SWOIM komputerze: skopiuj klucz publiczny na serwer
ssh-copy-id użytkownik@167.233.147.6
# Potem na serwerze w /etc/ssh/sshd_config ustaw:
#   PasswordAuthentication no
#   PermitRootLogin no
sudo systemctl restart ssh
```

Automatyczne aktualizacje bezpieczeństwa:

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 5. Uruchomienie aplikacji

```bash
cd /opt/ServerPLZ
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
docker compose -f docker-compose.prod.yml ps
```

Caddy automatycznie pobierze certyfikaty HTTPS przy pierwszym wejściu na domenę.
Sprawdź: otwórz `https://DOMAIN` w przeglądarce.

Podgląd logów:

```bash
docker compose -f docker-compose.prod.yml logs -f caddy
docker compose -f docker-compose.prod.yml logs -f backend
```

---

## 6. Backupy bazy

```bash
chmod +x scripts/backup-db.sh
./scripts/backup-db.sh            # test ręczny — zapisze plik do backups/

# Cron: codziennie o 3:00
crontab -e
# dodaj linię:
0 3 * * * cd /opt/ServerPLZ && ./scripts/backup-db.sh >> /var/log/plz-backup.log 2>&1
```

Zalecane: dodatkowa synchronizacja katalogu `backups/` poza serwer (np. `rclone` do chmury).

---

## Do zrobienia w kolejnych etapach (uwagi z Etapu 0)

- **CORS backendu**: `streaming-project/backend/main.py` ma `allow_origins` tylko dla `localhost:3000`.
  Trzeba dodać produkcyjny origin (`https://DOMAIN`) — najlepiej sterowany zmienną środowiskową.
- **Build-time `NEXT_PUBLIC_API_URL`**: Next.js wkompilowuje zmienne `NEXT_PUBLIC_*` na etapie
  budowania. Jeśli po wdrożeniu front nie łączy się z API, przekaż tę zmienną jako `build.args`
  we frontendzie (wymaga dopisania `ARG`/`ENV` w `streaming-project/frontend/Dockerfile`).
- **MediaMTX / transmisje** — świadomie pominięte na tym etapie.
