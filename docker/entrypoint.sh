#!/bin/sh
set -e
cd /var/www/html

# storage/ di-mount dari disk server (data/storage), jadi struktur foldernya dipastikan ada.
mkdir -p storage/app storage/logs \
         storage/framework/cache/data storage/framework/sessions storage/framework/views \
         bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

php artisan config:cache
php artisan view:cache

exec "$@"
