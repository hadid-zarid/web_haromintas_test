---
name: laravel-patterns
description: Enterprise architecture patterns for Laravel applications. Covers thin controllers, Form Requests, Eloquent models, relationships, scopes, eager loading to prevent N+1 queries, Actions, DTOs, and Service Container bindings.
---

# Laravel Development Patterns & Best Practices

Guidance for writing clean, maintainable, and scalable Laravel code (PHP 8.3+ / Laravel 11/12+).

## Architectural Guidelines

### 1. Thin Controllers
- Controllers should strictly orchestrate HTTP requests and delegate business logic to Actions or Service classes.
- Use explicit Form Requests for input validation instead of validating inline.

```php
// app/Http/Requests/StorePeraturanRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePeraturanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nomor' => ['required', 'string', 'max:100'],
            'judul' => ['required', 'string', 'max:255'],
            'tahun' => ['required', 'integer', 'min:1945', 'max:' . date('Y')],
            'file'  => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:20480'],
        ];
    }
}
```

### 2. Eloquent Best Practices
- **Eager Loading**: Always prevent N+1 query problems by using `with([...])` when querying models with relationships:
  ```php
  $peraturanList = Peraturan::with(['kategori', 'user'])
      ->latest()
      ->paginate(10);
  ```
- **Local Scopes**: Encapsulate frequent query constraints inside model scopes:
  ```php
  public function scopePublished(Builder $query): Builder
  {
      return $query->where('status', 'published');
  }
  ```
- **Type Hinting & Casts**: Use native PHP 8.3+ typed properties and Eloquent `$casts` (e.g. enums, arrays, datetimes).

### 3. Single-Action Classes (Action Pattern)
For complex business operations, use discrete Action classes:

```php
namespace App\Actions;

use App\Models\Peraturan;
use Illuminate\Http\UploadedFile;

final class UploadAndParsePeraturanAction
{
    public function execute(array $data, ?UploadedFile $file): Peraturan
    {
        $path = $file ? $file->store('peraturan_docs', 'public') : null;

        return Peraturan::create([
            ...$data,
            'file_path' => $path,
        ]);
    }
}
```

### 4. Database Migrations & Seeders
- Define explicit foreign key constraints with cascade rules:
  ```php
  $table->foreignId('user_id')->constrained()->cascadeOnDelete();
  ```
- Always include indexes on frequently queried or filtered columns (e.g. `status`, `tahun`, `nomor`).
