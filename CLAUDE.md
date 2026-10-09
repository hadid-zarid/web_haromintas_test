# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

HARMONITAS: system for harmonizing Ranperda/Ranperkada (draft regional regulations) at Kanwil Kementerian Hukum Riau. Laravel 13 (PHP 8.3) + Inertia v2 + React 19 + Tailwind v4, one monolith. UI text, comments, and commit messages are in Indonesian; keep that convention. Business process: `docs/ALUR_SISTEM_HARMONITAS.md`. Note that `README.md` is partly stale (it still mentions mock data and importing `schema_harmonitas.sql`).

## Git: never commit or push

Claude must never run `git add`, `git commit`, or `git push` itself. After every change, end the reply with ready-to-paste commands, one per `bash` block (the user's terminal is Windows PowerShell 5.1, so no `&&` and no heredocs):

1. `git add` listing the exact changed files (not `git add .`)
2. `git commit` with one `-m` per paragraph. The message must be in Bahasa Indonesia and detailed:
   - first `-m`: `<type>(<scope>): <ringkasan singkat>`
   - next `-m`s: what changed per file/area, why, and any behaviour change or follow-up the user must do (e.g. new `.env` key)
   - last `-m`: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
3. `git push` (`git push -u origin <branch>` if the branch has no upstream yet)

## Commands

```bash
php artisan serve          # backend at :8000 (also in .claude/launch.json as "laravel")
npm run dev                # Vite, run alongside serve
npm run build
composer test              # config:clear + php artisan test
php artisan test --filter=PermohonanWorkflowServiceTest     # single class / method
php artisan test tests/Feature/AuthTest.php
./vendor/bin/pint          # PHP formatting (PSR-12)
php artisan migrate --seed
```

Tests run on in-memory SQLite (`phpunit.xml`), with reCAPTCHA disabled and the mailer set to `array`. Production uses MySQL, so migrations have to work on both.

## Architecture

**Request flow.** `routes/web.php` holds all routes, grouped as public, `guest`, `auth`, and `role:ADMIN`. A few endpoints are inline closures, such as `/api/generate-surat-docx`, which fills the root-level `SURAT SELESAI PERDA/PERKADA.docx` templates by rewriting `word/document.xml`. Controllers render Inertia pages from `resources/js/Pages/{Name}.jsx`. `HandleInertiaRequests` shares `auth.user` and the latest 20 notifications on every request. `bootstrap/app.php` renders every HTTP error through `Pages/ErrorPage.jsx`.

**Roles.** There are four roles, keyed by `role_id`: 1 ADMIN, 2 TIM_KERJA (alias POKJA, Kanwil working group), 3 BIRO_HUKUM (provincial/regency legal bureau), 4 PIMPINAN (leadership, read-only across the whole province). Use the `User::isAdmin()/isTimKerja()/isBiroHukum()/isPimpinan()` helpers. The `role:` middleware (`EnsureRole`) also logs out inactive users and treats POKJA and TIM_KERJA as the same role.

**Row-level access (IDOR).** Any controller that touches a `RancanganRegulasi` or `Dokumen` must call `authorizeRancanganAccess` / `authorizeDocumentAccess` from the `Concerns/AuthorizesRancanganAccess` trait:
- Tim Kerja only see files whose `tim_kerja_id` matches their own.
- Biro Hukum only see files in their `wilayah_biro_hukum_id`. A kabupaten whose wilayah is NULL (e.g. Pemprov Riau) is visible to every Biro Hukum user.
- Admin and Pimpinan see everything.

There are no Laravel Policies; this trait is the single source of the rules.

**Permohonan workflow.** This lives in `PermohonanController` plus `Services/PermohonanWorkflowService`.
- `status_regulasi` values: 1 Draf Awal, 2 Proses Harmonisasi, 3 Proses Fasilitasi, 4 Selesai, 5 Perlu Perbaikan.
- `jenis_dokumen` has 7 document slots.
- Status changes are mostly file-driven inside `uploadDokumen`:
  - uploading doc 2, 3, or 4 while at status 1 moves the file to status 2;
  - docs 1–5 complete moves it to status 3;
  - docs 1–5 plus 7 complete moves it to status 4 (doc 6 is optional).
- Manual status changes (`updateStatus`, and `status_id` in `update`) are meant for Biro Hukum and Admin only.
- Changes write to `audit_logs` and send notifications through `NotifikasiService`, both in-app and by email (`NotifikasiWorkflowMail`).

**Other services.**
- `PasalDiffService` + `DocumentTextExtractionService` (smalot/pdfparser, docx zip) handle per-Pasal (article-by-article) document comparison.
- `StatistikHarmonisasiService` feeds the public landing page and `/api/statistik-harmonisasi`.

**Database conventions.** Table names are singular and Indonesian (`user`, `rancangan_regulasi`, `dokumen`, `kabupaten`) with custom PKs (`user_id`, `rancangan_id`, …). Always check `$table` / `$primaryKey` on the model. Migrations must be idempotent: guard them with `Schema::hasColumn`/`hasTable`, because production DBs were originally built from SQL dumps and migrate+seed runs again on every deploy. Seeders use `upsert`. `AkunDefaultSeeder` (demo accounts) runs only outside production. `database/*.sql` files are gitignored legacy patches.

**Auth.** Email/password login with reCAPTCHA v2 (`Rules/Recaptcha`), Google OAuth via Socialite (`GoogleAuthController`, which only matches existing accounts), and password reset by email. `Rules/NoHtmlContent` is applied to free-text input to block XSS.
- `/profil` (`ProfilController`) lets any logged-in user edit their own `nama`/`no_hp` and change their password. Email, role, status, and unit stay admin-only.
- Password strength lives in one place: `Password::defaults()` in `AppServiceProvider`. Use `Password::defaults()` in every rule; the Indonesian messages for it are in `lang/en/validation.php` (app locale is still `en`).
- The `auth` route group also runs `auth.session`, so any password change (by the user, an admin, or a reset) logs out that user's other sessions. Changing a password must also rotate `remember_token`.
- `user.nip` is a legacy column: it is hidden on the model and not used anywhere. Don't reintroduce it.
- Profile photos:
  - Uploads go through `AvatarService`, which always decodes and re-encodes them with GD into a 256px JPEG with a random name. They are stored on the private `local` disk under `avatars/` and served only by `GET /avatar/{user}` (auth). Never put them in `storage/app/public`.
  - `avatar_path` is hidden. The frontend gets `auth.user.avatar_url` from `User::avatarUrl()`: a Google URL as-is, or the private route with `?v=<filename>` for cache busting.
  - `avatar_google_aktif` becomes false when a user deletes their photo, so Google login won't put the Google photo back.
  - Cropping happens in the browser (`components/modals/AvatarCropModal.jsx`, lazy-loaded `react-easy-crop`).

**Frontend.** `app.jsx` wraps every page in `AuthProvider` → `PeraturanProvider` → `ToastProvider`. Authenticated pages use `components/layout/AppLayout` (Sidebar + NotificationDropdown). Color tokens are documented in `docs/PANDUAN_COLOR_PALETTE.md` (navy + golden yellow). `resources/js/mock/` is legacy; real data comes from Inertia props.

**Responsive.** Every page must work on phones, tablets, and desktops. Write Tailwind mobile-first (`sm` 640, `md` 768, `lg` 1024) and check each page at 360, 768, and 1280px:
- No horizontal page scroll (`document.documentElement.scrollWidth` equals `clientWidth`).
- Touch targets at least 44px tall (`min-h-[44px]`); primary buttons full width on mobile (`w-full sm:w-auto`).
- Forms are one column on mobile; split into columns only from `sm`/`lg` up.
- Wide tables get `overflow-x-auto`, or switch to cards on mobile (see `ManageAccountsPage`).
- Dropdowns/popovers on mobile are anchored to the viewport with `fixed inset-x-3` (pattern in `NotificationDropdown` and the account menu in `AppLayout`).
- Long text (names, emails) must wrap or truncate (`break-words`, `break-all`, `truncate`), never push the layout wider.

**AI assistant.** `Pages/AIAssistantPage.jsx` calls a separate Python service through the same-origin `/ai-api/*` path. That service lives in its own repo, cloned to `./ai-dokumen` and gitignored. Laravel does not proxy these calls.

## Deployment (Docker, branch `docker-vps`)

`docker-compose.yml` defines these services:
- `web`: Caddy, with automatic HTTPS from `SITE_ADDRESS`. It proxies `/ai-api/*` (prefix stripped) to `ai-checker:7860` and serves everything else via `php_fastcgi app:9000`.
- `app`: PHP-FPM. Its entrypoint runs `config:cache` + `view:cache` and does **not** migrate.
- `db`: MySQL 8.4.
- `pg`: pgvector, used by the AI service. The AI code still calls its connection string `SUPABASE_DB_URL`.
- `ai-checker`

Persistent data lives in `./data/*` bind mounts; `deploy/backup.sh` backs it up.

Because `config:cache` is on in production, never call `env()` outside `config/*.php`. HTTPS is forced only when `APP_URL` starts with `https://` (`AppServiceProvider`).

Before deploying, go through `docs/CHECKLIST_SEBELUM_DEPLOY.md`.

## Repo rules (`.agents/rules/`)

- **Security:**
  - Check every read/write server-side.
  - Validate input with Form Requests (`app/Http/Requests/{Admin,Auth,Permohonan}`).
  - Never use `dangerouslySetInnerHTML` on user content.
  - Add `throttle` to public POST routes.
- **Code quality:**
  - Keep controllers thin and push logic into Services.
  - Eager-load with `->with()` and paginate lists.
  - Build mobile-first (check 360/768/1280px).
- **Accessibility:**
  - Use semantic elements: `<button>`, and Inertia `<Link>` for navigation.
  - Give every page a unique `<Head title>`.
  - Labeled inputs, visible focus, and Esc-closable modals.
