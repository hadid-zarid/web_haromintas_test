# Security Rules — Laravel + Inertia — Read Before Writing Code

Non-negotiable constraints for any feature involving auth, user input, database access, APIs, or file handling. Apply by default — don't wait to be asked per feature.

## 1. Auth & Access Control
- Use Laravel's built-in auth (Breeze/Fortify/Sanctum) rather than hand-rolling session/token logic.
- Every protected action gets checked server-side via Policies/Gates or route middleware (`auth`, `can:`) — never rely on hiding a button/link in the Vue/React page.
- Check for IDOR: use route-model binding + Policy checks (`$this->authorize('update', $post)`) so a user can't edit another user's resource by changing an ID in the URL.
- Passwords: Laravel hashes with bcrypt by default via `Hash::make()` — don't override with something weaker.

## 2. Injection & Input Handling
- Use Eloquent or the Query Builder — they parameterize automatically. Never drop to raw `DB::statement()`/`DB::select()` with concatenated strings; if raw SQL is unavoidable, use `?` bindings.
- Validate all input server-side via Form Requests (`php artisan make:request`), even if the Vue/React form also validates client-side.
- Blade: never use `{!! !!}` on user-supplied content — only `{{ }}`. On the Inertia/Vue side, avoid `v-html` on unsanitized content (React: avoid `dangerouslySetInnerHTML`).
- File uploads: validate with Laravel's `file`/`mimes`/`max` rules; store outside the public webroot when possible.

## 3. Session & Transit Security
- Enforce HTTPS in production.
- `config/session.php`: `secure` => true, `http_only` => true, `same_site` => 'lax' or 'strict'.
- CSRF: Laravel's `VerifyCsrfToken` middleware + Inertia's built-in XSRF-TOKEN handling covers this automatically — don't disable it or exclude routes without a specific reason.
- Prefer Sanctum's session-based auth (standard for Inertia SPAs) over exposing token-based API auth unless you actually need a separate public API.

## 4. Secrets & Config
- `.env` is gitignored by default — keep it that way, never commit `.env.production` values.
- Use `config('services.x.key')` in application code, not `env()` directly outside `config/*.php` files — `env()` calls outside config break once `php artisan config:cache` runs in production, and can leak into cached config.
- Separate `.env` values per environment; rotate keys if one ever leaks into a commit.

## 5. API Design
- Rate limit via Laravel's built-in `throttle` middleware on login, registration, and any public form/API route.
- CORS: configure `config/cors.php` with an explicit `allowed_origins` list — don't leave it wildcarded in production.
- Set request size/upload limits both in PHP config and validation rules.

## 6. Dependencies
- Run `composer audit` for PHP/Laravel packages and `npm audit` for the Vue/React + Vite frontend — Inertia apps have both.
- Keep Laravel itself on a supported, patched version.
- Remove unused Composer/npm packages.

## 7. Errors & Logging
- **`APP_DEBUG=false` in production, always.** Leaving it `true` exposes full stack traces, file paths, and `.env` values (including secrets) to any visitor who triggers an error.
- Use Laravel's `Log` facade for server-side logging; never log passwords, tokens, or full request bodies containing PII.
- Custom error pages (`resources/views/errors/`) so users never see raw exceptions.

## 8. Performance (so it doesn't lag)
- Watch for N+1 queries — Eloquent's classic trap. Use `->with()` eager loading, and consider `Model::preventLazyLoading()` in local/dev to catch them early.
- Index columns used in `where`/`orderBy` via migrations.
- Paginate with `->paginate()` — never return a whole table to an Inertia page prop.
- Push slow work (emails, exports, notifications) to Laravel Queues instead of blocking the request.

---

**Before marking any feature done, confirm:**
1. Is every write/read path checked server-side via a Policy/Gate/middleware?
2. Is every query going through Eloquent/Query Builder, or safely bound if raw?
3. Is `APP_DEBUG` false and are secrets out of the codebase entirely?
4. Does this route have `throttle` if it's public-facing?
5. Would this leak internal errors to a user who pokes at it wrong?
