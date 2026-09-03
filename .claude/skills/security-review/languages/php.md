# PHP / Laravel Security Patterns

## Framework Detection

| Indicator | Framework |
|-----------|-----------|
| `artisan`, `bootstrap/app.php`, `Illuminate\`, `composer.json` has `laravel/framework` | Laravel |
| `Inertia::render`, `@inertiajs`, `HandleInertiaRequests` | Laravel + Inertia (SPA-style, props serialized to JS) |
| `extends FormRequest`, `->validated()` | Laravel form-request validation |
| `Symfony\Component\HttpFoundation`, `bin/console` | Symfony |
| `$app->get(`, `slim/slim` | Slim |
| raw `$_GET` / `$_POST` / `$_REQUEST`, `mysqli_`, `PDO` by hand | Plain PHP (no framework mitigations — scrutinize everything) |

---

## This Project's Conventions (HARMONITAS)

Read this before flagging — the app's defenses are hand-rolled, so the framework will not save a missing check.

| Area | How this codebase does it | Review implication |
|------|---------------------------|--------------------|
| **Authorization** | **No Policies, no Gates, no `$this->authorize()`.** The base `Controller` is empty. Access control = the `EnsureRole` middleware (`role:ADMIN` alias, set in `bootstrap/app.php`) **plus** manual `authorizeRancanganAccess()` / `authorizeDocumentAccess()` methods called inside `PermohonanController`. | For every controller action reachable by `auth` alone, confirm it calls one of those guards (or checks `$user->isAdmin()` etc.). A `findOrFail($id)` with no follow-up check = IDOR. There is no safety net. |
| **Validation** | `FormRequest` classes in `app/Http/Requests/**`, plus the custom `App\Rules\NoHtmlContent` denylist rule on free-text fields. | `->validated()` only returns whitelisted keys — trust it. But check the FormRequest's `authorize()` and its `Rule::in([...])` lists (see self-assignable role, below). |
| **Frontend** | Inertia + React 19. Only one Blade file (`resources/views/app.blade.php`). Props returned from controllers are serialized into the page and visible in view-source / XHR. | XSS surface is mostly React (see `languages/javascript.md`). The real PHP-side risk is **over-fetching into Inertia props**. |
| **File storage** | Uploads sanitized (`preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $name)`) and stored in `storage/app/secure_drafts/**` (outside web root), served back through controller actions with `X-Content-Type-Options: nosniff`. | Good baseline. Still check: extension trust, path resolution, and access checks on the serving action. |
| **Config** | `.env` is git-ignored (not committed). `APP_DEBUG=true` locally. Custom exception handler in `bootstrap/app.php` renders `exception`/`file`/`line`/`trace` into an Inertia `ErrorPage` **when `config('app.debug')` is true**. | Not a finding on a dev box. **Is** a finding if anything ships/deploys with `APP_DEBUG=true` — full stack traces to the browser. |

---

## Server-Controlled Values (NEVER Flag)

These come from the operator, not the attacker:

```php
// SAFE: config and env are deployment configuration
config('services.google.client_secret')
config('app.url')
env('DB_PASSWORD')                       // (flag only if the value is hardcoded in a COMMITTED file)

// SAFE: path helpers with string literals
base_path('SURAT SELESAI PERDA.docx')
storage_path('app/secure_drafts')
resource_path('views/app.blade.php')

// SAFE: framework constants / server state
$request->ip()
$request->userAgent()
now(), auth()->id()
```

Only flag config/env if the **value itself is a hardcoded secret in committed code**, or if the value is somehow built from request input.

---

## Do Not Flag (Laravel Auto-Protections)

```php
// SAFE: Query Builder / Eloquent parameterize everything
User::where('email', $request->input('email'))->first();
RancanganRegulasi::findOrFail($id);
$q->where('judul_rancangan', 'like', "%{$search}%");     // value is bound, not concatenated into SQL
DB::table('user')->where('status', $status)->get();

// SAFE: whereRaw / selectRaw WITH bindings (real example from HomeController.php)
$query->whereRaw('YEAR(COALESCE(tanggal_dibuat, created_at)) = ?', [$selectedYear]);
// The SQL string is a constant; user data goes through the [ ? ] binding array. Not injection.

// SAFE: Blade auto-escapes
{{ $user->nama }}
{{ $permohonan->judul_rancangan }}

// SAFE: FormRequest returns only whitelisted keys
$validated = $request->validated();
$rancangan->update($validated);          // safe IF the FormRequest rules() don't whitelist sensitive columns

// SAFE: CSRF is automatic on the `web` group
// (Laravel's ValidateCsrfTokens middleware) — POST/PUT/DELETE web routes are protected unless
// explicitly listed in validateCsrfTokens(except: [...]) in bootstrap/app.php

// SAFE: password hashing
'password' => 'hashed',                  // cast in the model
Hash::make($plain);  Hash::check($plain, $hash);

// SAFE: signed / throttled routes
URL::signedRoute(...);   Route::...->middleware('throttle:6,1');
```

---

## Flag These (Laravel-Specific)

### SQL / Eloquent injection

```php
// FLAG: string interpolation into raw SQL
DB::select("SELECT * FROM user WHERE email = '{$email}'");            // FLAG
$q->whereRaw("judul_rancangan LIKE '%{$search}%'");                   // FLAG (concatenated, not bound)
$q->orderByRaw($request->input('sort'));                             // FLAG
DB::statement("UPDATE user SET role_id = {$id}");                     // FLAG
Model::where(DB::raw("name = '{$x}'"));                              // FLAG

// FLAG: column / direction / table name from request (bindings don't protect identifiers)
$q->orderBy($request->input('sort_by'), $request->input('sort_dir'));  // FLAG unless both are
                                                                      // checked against an allowlist
// The codebase does this correctly in PermohonanController::index via $allowedSorts[...] — that
// allowlist pattern is the fix; flag any orderBy/orderByRaw that lacks it.
```

### Mass assignment

```php
// FLAG: unguarded models / bulk assign from raw input
protected $guarded = [];                          // FLAG: everything fillable
Model::unguard();                                 // FLAG
$user->forceFill($request->all());               // FLAG: bypasses $fillable
User::create($request->all());                    // FLAG: use ->validated()
$user->fill($request->input());                   // FLAG

// FLAG: sensitive column in $fillable reachable from a non-privileged request
// User::$fillable includes 'role_id', 'status', 'google_id'.
//  - Admin-only path (StoreUserRequest::authorize() checks isAdmin()) → OK
//  - ANY self-service path (profile update, register) that passes 'role_id'/'status'
//    through to create()/update() → privilege escalation, FLAG
```

### Broken access control / IDOR

```php
// FLAG: load-by-id then use, with no ownership/role check
public function show($id) {
    $rancangan = RancanganRegulasi::findOrFail($id);
    return Inertia::render('Detail', ['permohonan' => $rancangan]);   // FLAG: no authorizeRancanganAccess()
}

// FLAG: route protected only by `auth`, action has no in-controller guard
// (there are no Policies here, so `auth` alone = any logged-in user, any tenant)

// FLAG: self-assignable privilege in a FormRequest
// app/Http/Requests/Auth/RegisterRequest.php:
//   authorize() { return true; }
//   rules() { 'role' => Rule::in(['BIRO_HUKUM', 'POKJA', 'PIMPINAN']) }
// BIRO_HUKUM / PIMPINAN get read access to ALL regulations (authorizeRancanganAccess()).
// → If a POST /register route is wired to this request, a public user picks their own
//   privileged role. VERIFY the route exists in routes/web.php before rating severity:
//   currently no such route is registered (likely dead code) — note it, flag Critical if wired.

// FLAG: EnsureRole bypass surface
// EnsureRole aliases POKJA<->TIM_KERJA. Check any new role string is handled and that
// `$user->status !== 'ACTIVE'` still forces logout.
```

### Blade / server-rendered XSS

```blade
{{-- FLAG: unescaped output --}}
{!! $request->input('q') !!}
{!! $comment->body !!}
<div>@php echo $userInput; @endphp</div>

{{-- FLAG: user data in a dangerous attribute position --}}
<a href="{{ $userProvidedUrl }}">           {{-- check for javascript: --}}
<script>var x = {!! json_encode($data) !!}</script>   {{-- OK only if $data has no user HTML and
                                                          JSON_HEX_TAG flags are set --}}
```
Only `app.blade.php` exists today; still flag any new `{!! !!}` on non-constant input.

### Inertia prop leakage (the main PHP-side data risk here)

```php
// FLAG: whole Eloquent model handed to the client
return Inertia::render('PeraturanDetailPage', [
    'permohonan' => $rancangan,          // CHECK: does this model / its loaded relations carry
                                         // internal columns, other users' PII, tokens?
    'user' => User::find($id),           // FLAG: $hidden only strips password/remember_token;
                                         // email, nip, no_hp, google_id, role_id still ship
]);

// FLAG: shared props in HandleInertiaRequests::share() that expose more than the current user needs
// (that file already hand-picks fields — good; flag it if someone swaps in `$user->toArray()`).

// Fix pattern: ->only([...]) / a resource / an explicit array of safe fields.
```

### File upload & path handling

```php
// FLAG: trusting client-supplied file metadata
$ext  = $file->getClientOriginalExtension();   // attacker-set; used for the mimes decision in
$mime = $file->getClientMimeType();            // UploadDokumenRequest — prefer $file->extension()
$name = $file->getClientOriginalName();        // (content sniff) or a strict `mimes:pdf,doc,docx` rule
// Compensating controls present: files stored outside web root + served with nosniff. Note, don't
// necessarily flag Critical — but a .php/.phtml/.svg/.html slipping through + inline serving = XSS/RCE.

// FLAG: request/DB value concatenated into a filesystem path
$path = storage_path('app/' . $dokumen->path_file);          // CHECK: is path_file ever attacker-set?
$tmp  = $dir . '/Surat_' . strtoupper($request->input('type')) . '.docx';  // FLAG (real:
//   routes/web.php /api/generate-surat-docx). `type` is not allow-listed before being used in a
//   path passed to copy()/unlink()/response()->download() → path traversal / arbitrary .docx write.
//   Fix: `in_array($type, ['perda','perkada'], true)` before any filesystem use.

// FLAG: unbounded / unauthenticated file operations
copy($src, base_path($attackerInfluencedName));   // writing inside the app dir at runtime
readfile($request->input('file'));                 // arbitrary file read
Storage::disk('public')->put($userPath, $content); // path traversal in $userPath
```

### CSRF exemptions

```php
// bootstrap/app.php
$middleware->validateCsrfTokens(except: [
    'api/generate-surat-docx',        // FLAG: this endpoint also does copy() into base_path()
]);                                   // — a state-changing, CSRF-exempt, cookie-authenticated route.
// For each except[] entry: is it truly stateless? Is it token-authenticated (not just session)?
// A session-authed, side-effecting route in except[] is CSRF-able.
```

### SSRF / open redirect

```php
Http::get($request->input('url'));                 // FLAG: SSRF if URL is user-controlled
file_get_contents($request->input('src'));         // FLAG
Socialite::driver('google')->redirectUrl($request->input('cb'));  // FLAG: open redirect via OAuth cb
return redirect($request->input('next'));          // FLAG: open redirect (allowlist or use ->intended())
return redirect(config('app.frontend_url'));       // SAFE: server-controlled
```

### Command / code execution

```php
exec($cmd); shell_exec($cmd); system($cmd); passthru($cmd); proc_open($cmd, ...); `$cmd`;  // FLAG if
Process::run($request->input('cmd'));              // FLAG (Laravel Process facade)
eval($x); assert($userString);                     // FLAG: Critical
unserialize($request->input('data'));              // FLAG: Critical (object injection); use json_decode
extract($request->all());                          // FLAG: variable injection
call_user_func($request->input('fn'), ...);        // FLAG
$class = $request->input('type'); new $class();    // FLAG: arbitrary instantiation
```

### Debug / information disclosure

```php
dd($x); dump($x); ray($x); var_dump($x);           // FLAG: left in committed code
info($request->all()); Log::debug($user->toArray());   // FLAG: logging secrets / full PII

// bootstrap/app.php exception handler: returns get_class($e), file, line, trace to the Inertia
// ErrorPage when config('app.debug'). FLAG as High IF the deploy config has APP_DEBUG=true.
// APP_DEBUG=true + APP_ENV=production anywhere → FLAG.
```

### Cryptography / randomness

```php
md5($password); sha1($password); hash('sha256', $password);   // FLAG: use Hash::make / bcrypt / argon
md5($file);                                                   // SAFE: non-security checksum
mt_rand(); rand(); uniqid(); array_rand();                    // FLAG if used for tokens / secrets /
                                                             // filenames that must be unguessable
Str::random(40); random_bytes(32); random_int(...);           // SAFE for tokens
// Real note: /api/generate-surat-docx uses uniqid() for a temp filename — low risk (temp, deleted
// after send) but predictable; Str::random() is the correct choice.
```

---

## General PHP (framework-agnostic)

### Always Flag

```php
// Code execution
eval($userInput);
assert($userString);
create_function(...);                    // legacy, removed in PHP 8 but flag in older code
preg_replace('/x/e', $userInput, $s);    // /e modifier (removed in 7.0) — flag in legacy

// Object injection
unserialize($userData);                  // even with allowed_classes, prefer json
phar://... path from user input          // Phar deserialization on file ops (is_file, file_exists…)

// Command injection
system(), exec(), shell_exec(), passthru(), popen(), proc_open(), pcntl_exec(), backticks
// with ANY user input, even via escapeshellarg if the whole command string is built by concat

// LDAP / mail / header
ldap_search($conn, $base, "(uid={$user})");           // LDAP injection
mail($to, $subj, $body, "From: {$userInput}");        // header injection
header("Location: " . $userInput);                     // header injection / open redirect
```

### Check Context

```php
// Path traversal — is the path user/DB-derived?
fopen($p), file_get_contents($p), readfile($p), include $p, require $p, unlink($p),
new SplFileObject($p), DirectoryIterator($p)
// include/require with user input = RCE, not just disclosure.

// SSRF — is the URL user-controlled?
curl_setopt($ch, CURLOPT_URL, $u); file_get_contents($httpUrl); fsockopen($host, ...);

// XXE — external entity loading
simplexml_load_string($xml);                          // FLAG if libxml_disable_entity_loader(false)
                                                     // or PHP < 8.0 without LIBXML_NONET
DOMDocument->loadXML($xml, LIBXML_NOENT);             // FLAG: LIBXML_NOENT expands entities

// Type juggling / auth bypass
if ($hash == $userInput)                              // FLAG: use hash_equals()
if ($token == $stored)                                // FLAG: use hash_equals()
strcmp($a, $b) == 0 with array input                  // returns null → == 0 true
in_array($needle, $arr)                               // FLAG: missing strict=true
switch ($userInput) with loose numeric cases

// Weak comparison in loose language
"0e123" == "0e456"    // true (magic hashes) — flag == on hash comparisons
```

### Input Sources (attacker-controlled)

```php
$_GET $_POST $_REQUEST $_COOKIE $_FILES $_SERVER['HTTP_*'] php://input
$request->input() ->query() ->post() ->json() ->all() ->header() ->cookie()
->file() ->route('param') ->getContent()
$request->user()                          // NOT attacker-controlled (authenticated identity)
```

---

## Grep Patterns

```bash
# Raw SQL without bindings
grep -rnE "DB::(raw|select|statement|unprepared)\(|->(whereRaw|orderByRaw|havingRaw|selectRaw|fromRaw)\(" --include="*.php" app/

# orderBy / column from request (identifier injection)
grep -rnE "->orderBy\(\s*\\\$request->|->orderBy\(\s*request\(" --include="*.php" app/

# Mass assignment
grep -rnE "\\\$guarded\s*=\s*\[\s*\]|::unguard\(|forceFill\(|->(create|update|fill)\(\s*\\\$request->(all|input)\(\)" --include="*.php" app/

# Unescaped Blade
grep -rn "{!!" --include="*.blade.php" resources/

# Whole model into Inertia props
grep -rnE "Inertia::render\(|->with\(" --include="*.php" app/ | grep -vE "only\(|toResource|Resource::"

# CSRF exemptions
grep -rnE "validateCsrfTokens|VerifyCsrfToken|\\\$except" --include="*.php" bootstrap/ app/

# Dangerous callables / deserialization / exec
grep -rnE "\b(eval|assert|unserialize|extract|system|exec|shell_exec|passthru|proc_open|popen)\s*\(" --include="*.php" app/ routes/

# Client-trusted file metadata
grep -rnE "getClientOriginalName|getClientOriginalExtension|getClientMimeType" --include="*.php" app/

# Request/DB value in a filesystem path
grep -rnE "(storage_path|base_path|public_path|storage::)\s*\(\s*['\"][^'\"]*['\"]\s*\.\s*\\\$" --include="*.php" app/ routes/

# Debug left in code / debug in prod
grep -rnE "\b(dd|dump|ray|var_dump|print_r)\s*\(" --include="*.php" app/ routes/
grep -nE "APP_DEBUG\s*=\s*true|APP_ENV\s*=\s*production" .env .env.* 2>/dev/null

# Weak comparison on secrets / weak crypto
grep -rnE "==\s*\\\$?(hash|token|sig|signature|mac)|\b(md5|sha1)\s*\(|\b(mt_rand|uniqid)\s*\(" --include="*.php" app/
```
