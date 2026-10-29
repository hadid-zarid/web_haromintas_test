#!/usr/bin/env bash
# Pulihkan backup hasil deploy/backup.sh: MENIMPA database aplikasi, database AI, dan dokumen di instalasi ini.
# Pakai: bash deploy/restore.sh <folder-backup>
# Sebelum menimpa, kondisi sekarang otomatis dibackup ke <induk-folder-backup>/sebelum-restore/.
set -euo pipefail
export MSYS_NO_PATHCONV=1

SRC="$(cd "${1:?Pakai: bash deploy/restore.sh <folder-backup>}" && pwd)"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

echo "== Cek keutuhan file backup"
(cd "$SRC" && sha256sum -c --quiet SHA256SUMS) && echo "OK, semua file utuh"

echo
echo "Database dan dokumen di $APP_DIR akan DIGANTI dengan isi $SRC"
read -r -p "Ketik YA untuk lanjut: " JAWAB
[ "$JAWAB" = "YA" ] || { echo "Dibatalkan."; exit 1; }

tunggu_sehat() {
  for _ in $(seq 1 90); do
    [ "$(docker inspect -f '{{.State.Health.Status}}' "$(docker compose ps -q "$1")" 2>/dev/null)" = healthy ] && return 0
    sleep 2
  done
  echo "GAGAL: layanan $1 tidak sehat" >&2; exit 1
}

docker compose up -d db pg
tunggu_sehat db; tunggu_sehat pg
mkdir -p data/storage/app data/storage/logs

echo "== Backup kondisi sekarang dulu (jaga-jaga salah arah)"
bash deploy/backup.sh "$(dirname "$SRC")/sebelum-restore"

docker compose stop app web ai-checker

echo "== Pulihkan database aplikasi (MySQL)"
docker compose exec -T db sh -c 'export MYSQL_PWD="$MYSQL_ROOT_PASSWORD"; mysql -uroot -e "DROP DATABASE IF EXISTS \`$MYSQL_DATABASE\`; CREATE DATABASE \`$MYSQL_DATABASE\`;"'
zcat "$SRC/harmonitas-mysql.sql.gz" | docker compose exec -T db sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -uroot "$MYSQL_DATABASE"'

echo "== Pulihkan database AI (Postgres)"
docker compose exec -T pg sh -c 'dropdb -U aidocs --force --if-exists aidocs && createdb -U aidocs aidocs'
docker compose exec -T pg pg_restore -U aidocs -d aidocs --no-owner --no-privileges < "$SRC/ai-postgres.dump"

echo "== Pulihkan dokumen"
rm -rf data/storage/app data/storage/logs
tar -xzf "$SRC/harmonitas-storage.tar.gz" -C data/storage

echo "== Cocokkan jumlah baris"
docker compose exec -T db sh -c 'export MYSQL_PWD="$MYSQL_ROOT_PASSWORD"; for t in $(mysql -uroot -N -e "SHOW TABLES" "$MYSQL_DATABASE"); do echo "$t $(mysql -uroot -N -e "SELECT COUNT(*) FROM $t" "$MYSQL_DATABASE")"; done' | tr -d '\r' > "$SRC/.cek-baris.txt"
if diff <(tr -d '\r' < "$SRC/jumlah-baris.txt") "$SRC/.cek-baris.txt"; then echo "SAMA dengan backup"; else echo "PERINGATAN: jumlah baris berbeda (lihat di atas)"; fi
rm -f "$SRC/.cek-baris.txt"

docker compose up -d
echo "Restore selesai. Dokumen: $(find data/storage/app -type f | wc -l) file."
