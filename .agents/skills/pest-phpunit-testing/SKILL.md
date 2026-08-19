---
name: pest-phpunit-testing
description: Best practices for writing automated feature and unit tests for Laravel and Inertia.js applications using PHPUnit or Pest. Covers Inertia assertions, database transactions, model factories, and mock requests.
---

# Laravel & Inertia Testing Guidelines

Guidance for writing test suites with **Pest** and **PHPUnit** in Laravel Inertia applications.

## 1. Testing Inertia Pages & Responses

Use Laravel's built-in Inertia test assertions to verify that controllers return the expected React component and props:

```php
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated user can view peraturan list page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('peraturan.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('PeraturanListPage')
            ->has('peraturanList')
        );
});
```

## 2. Testing Validation & Actions

Test Form Requests and business logic errors:

```php
test('storing peraturan requires valid title and year', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('peraturan.store'), [
            'judul' => '',
            'tahun' => 'invalid_year',
        ])
        ->assertSessionHasErrors(['judul', 'tahun']);
});
```

## 3. Database Isolation

- Always use `use Illuminate\Foundation\Testing\RefreshDatabase;` in test cases to ensure tests run against clean isolated database state.
