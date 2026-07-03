#!/usr/bin/env bash
# backup-db.sh — codzienny backup bazy PostgreSQL (Etap 0)
#
# Robi pg_dump z kontenera postgres, kompresuje i trzyma ostatnie N dni.
# Uruchamiaj z katalogu głównego repo (tam gdzie docker-compose.prod.yml i .env).
#
# Instalacja w cronie (codziennie o 3:00), przykład:
#   crontab -e
#   0 3 * * * cd /opt/ServerPLZ && ./scripts/backup-db.sh >> /var/log/plz-backup.log 2>&1
#
# WAŻNE: kopie warto dodatkowo synchronizować POZA serwer (np. rclone do S3/OneDrive).

set -euo pipefail

# Katalog repo = katalog nadrzędny do tego skryptu
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

# Wczytaj zmienne z .env (POSTGRES_USER, POSTGRES_DB)
if [ -f .env ]; then
	set -a
	# shellcheck disable=SC1091
	. ./.env
	set +a
fi

BACKUP_DIR="${BACKUP_DIR:-$REPO_DIR/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
STAMP="$(date +%Y%m%d_%H%M%S)"
OUT="$BACKUP_DIR/plz_${STAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Start backupu bazy '${POSTGRES_DB}'..."
docker compose -f "$COMPOSE_FILE" exec -T postgres \
	pg_dump -U "${POSTGRES_USER}" "${POSTGRES_DB}" \
	| gzip > "$OUT"

echo "[$(date)] Zapisano: $OUT ($(du -h "$OUT" | cut -f1))"

# Rotacja — usuń backupy starsze niż RETENTION_DAYS
find "$BACKUP_DIR" -name 'plz_*.sql.gz' -type f -mtime +"$RETENTION_DAYS" -delete
echo "[$(date)] Rotacja zakończona (trzymam ${RETENTION_DAYS} dni)."
