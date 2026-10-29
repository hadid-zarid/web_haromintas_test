#!/usr/bin/env bash
# Backup DB aplikasi + database AI + dokumen ke satu folder bertanggal.
# Pakai: bash deploy/backup.sh [folder-tujuan]   (default: $BACKUP_DEST atau /var/backups/harmonitas)
# Jalan di server Linux maupun Git Bash Windows. Pulihkan dengan deploy/restore.sh.
# .env TIDAK ikut (berisi rahasia); simpan terpisah sekali saja.
set -euo pipefail
export MSYS_NO_PATHCONV=1

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:-${BACKUP_DEST:-/var/backups/harmonitas}}"
OUT="$DEST/$(date +%F_%H%M%S)"
mkdir -p "$OUT"
chmod 700 "$OUT" 2>/dev/null || true
cd "$APP_DIR"

docker compose exec -T db sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqldump -uroot --single-transaction --routines --triggers --events --hex-blob --default-character-set=utf8mb4 "$MYSQL_DATABASE"' | gzip > "$OUT/harmonitas-mysql.sql.gz"
docker compose exec -T db sh -c 'export MYSQL_PWD="$MYSQL_ROOT_PASSWORD"; for t in $(mysql -uroot -N -e "SHOW TABLES" "$MYSQL_DATABASE"); do echo "$t $(mysql -uroot -N -e "SELECT COUNT(*) FROM $t" "$MYSQL_DATABASE")"; done' | tr -d '\r' > "$OUT/jumlah-baris.txt"
docker compose exec -T pg pg_dump -U aidocs -d aidocs -Fc > "$OUT/ai-postgres.dump"
tar -czf "$OUT/harmonitas-storage.tar.gz" -C data/storage app logs

zcat "$OUT/harmonitas-mysql.sql.gz" | tail -1 | grep -q 'Dump completed' || { echo "GAGAL: dump MySQL tidak lengkap" >&2; exit 1; }
(cd "$OUT" && sha256sum -- * > SHA256SUMS)
echo "Backup selesai: $OUT"
ls -lh "$OUT"
