---
name: laravel-security
description: Comprehensive security best practices and architectural patterns for Laravel applications. Covers CSRF, XSS prevention, SQL injection defense, rate limiting, authentication hardening, authorization policies, secure file handling, session security, and audit logging.
---

# Laravel Security Best Practices & Hardening Guide

Comprehensive security patterns for Laravel 11/12+ applications.

---

## 1. Authentication & Credential Security

### 1.1 Secure Password Hashing
- Always use Laravel's default `bcrypt` (work factor 12) or `argon2id`.
- Automatically hash passwords using model casts in PHP 8.3+:
```php
protected function casts(): array
{
    return [
        'password' => 'hashed',
        'email_verified_at' => 'datetime',
    ];
}
```

### 1.2 Rate Limiting (Brute Force Protection)
- Apply rate limiters to authentication endpoints to prevent brute-force attacks:
```php
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

public function ensureIsNotRateLimited(): void
{
    $throttleKey = Str::transliterate(Str::lower($this->input('email')).'|'.$this->ip());

    if (! RateLimiter::tooManyAttempts($throttleKey, 5)) {
        return;
    }

    $seconds = RateLimiter::availableIn($throttleKey);
    throw ValidationException::withMessages([
        'email' => trans('auth.throttle', [
            'seconds' => $seconds,
            'minutes' => ceil($seconds / 60),
        ]),
    ]);
}
```

### 1.3 Session Security & Anti-Fixation
- Always regenerate the session upon login and invalidate upon logout:
```php
// On login
$request->session()->regenerate();

// On logout
Auth::guard('web')->logout();
$request->session()->invalidate();
$request->session()->regenerateToken();
```

---

## 2. Authorization & Role-Based Access Control (RBAC)

### 2.1 Role Middleware
- Guard administrative or role-sensitive routes using dedicated middleware:
```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user() || ! in_array($request->user()->role, $roles, true)) {
            abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk membuka halaman ini.');
        }

        return $next($request);
    }
}
```

### 2.2 Account Status Verification
- Check whether an account is `ACTIVE` prior to granting access:
```php
if ($user->status !== 'ACTIVE') {
    Auth::logout();
    throw ValidationException::withMessages([
        'email' => 'Akun Anda telah dinonaktifkan. Silakan hubungi Administrator Sistem.',
    ]);
}
```

---

## 3. Data Integrity & Input Validation

### 3.1 Explicit Form Requests
- Never use `$request->all()` directly in database queries or model creations.
- Always use typed, validated inputs from dedicated `FormRequest` classes:
```php
$validated = $request->validated();
```

### 3.2 SQL Injection Prevention
- Always use Eloquent ORM or prepared statements via PDO. Never concatenate raw SQL strings.
- When raw queries are needed, use parameterized bindings:
```php
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
```

### 3.3 Mass Assignment Protection
- Define explicit `#[Fillable([...])]` or `$fillable` arrays on every Eloquent model.
- Protect sensitive columns like `password`, `remember_token`, `role` (where applicable).

---

## 4. Inertia.js & Frontend Security

### 4.1 CSRF Token Handling
- Inertia automatically includes Laravel's CSRF token header (`X-XSRF-TOKEN`) with every XHR request.
- Ensure the `HandleInertiaRequests` middleware is placed in the `web` middleware group.

### 4.2 XSS (Cross-Site Scripting) Defense
- React automatically escapes rendered strings in JSX.
- Avoid using `dangerouslySetInnerHTML` unless input is thoroughly sanitized with DOMPurify.

### 4.3 Sensitive Data Exposure
- Hide private model attributes using `#[Hidden(['password', 'remember_token'])]`.
- Only share necessary user fields to the frontend in `HandleInertiaRequests`:
```php
'auth' => [
    'user' => $request->user() ? $request->user()->only([
        'id', 'name', 'email', 'nip', 'jabatan', 'no_hp', 'role', 'status', 'pokja_id', 'wilayah_id', 'avatar_path'
    ]) : null,
],
```

---

## 5. Audit Logging

- Log sensitive actions (logins, user creation, role changes, deletions) into `audit_logs`:
```php
AuditLog::create([
    'user_id'    => Auth::id(),
    'action'     => 'USER_CREATED',
    'module'     => 'USER_MANAGEMENT',
    'target_id'  => (string) $newUser->id,
    'ip_address' => $request->ip(),
    'user_agent' => $request->userAgent(),
    'payload'    => ['role' => $newUser->role, 'email' => $newUser->email],
]);
```
