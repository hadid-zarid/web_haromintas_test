# --- Tahap 1: build asset frontend (Vite/React/Tailwind) ---
FROM node:22-slim AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Tahap 2: aplikasi Laravel (PHP-FPM) ---
FROM php:8.3-fpm AS app
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y --no-install-recommends \
      git unzip libzip-dev libpng-dev libjpeg-dev libfreetype6-dev libicu-dev libxml2-dev libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql zip gd intl bcmath mbstring xml opcache \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/php.ini /usr/local/etc/php/conf.d/zz-harmonitas.ini

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
COPY --from=assets /app/public/build ./public/build
RUN composer dump-autoload --no-dev --optimize && php artisan package:discover --ansi

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]

# --- Tahap 3: web server (Caddy, HTTPS otomatis) dengan salinan public/ untuk file statis ---
FROM caddy:2 AS web
COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=app /var/www/html/public /var/www/html/public
