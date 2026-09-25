#!/usr/bin/env bash
# Backup harian DB + file upload. Cron: 0 2 * * * /opt/harmonitas/deploy/backup.sh
set -euo pipefail

APP_DIR=/opt/harmonitas
DEST=/var/backups/harmonitas
STAMP=$(date +%F)
mkdir -p "$DEST"
cd "$APP_DIR"

docker compose exec -T db sh -c 'mysqldump --single-transaction -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' | gzip > "$DEST/db-$STAMP.sql.gz"
tar -czf "$DEST/storage-$STAMP.tar.gz" -C data/storage app
docker compose exec -T pg pg_dump -U aidocs -d aidocs --schema=public --no-owner --no-privileges -Fc > "$DEST/ai-postgres-$STAMP.dump"

find "$DEST" -type f -mtime +14 -delete

# Salinan di luar VPS (opsional): rclone copy "$DEST" gdrive:harmonitas-backup
