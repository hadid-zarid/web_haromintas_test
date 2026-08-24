<?php

use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GoogleAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes - HARMONITAS (Laravel + Inertia React)
|--------------------------------------------------------------------------
*/

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================
Route::get('/', function () {
    return Inertia::render('LandingPage');
})->name('landing');

Route::get('/panduan', function () {
    return Inertia::render('PanduanPage');
})->name('panduan');

// ==========================================
// 2. GUEST AUTH ROUTES (LOGIN & GOOGLE OAUTH)
// ==========================================
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    // Google OAuth SSO
    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
});

// ==========================================
// 3. AUTHENTICATED USER ROUTES
// ==========================================
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/home', function () {
        return Inertia::render('HomePage');
    })->name('home');

    Route::get('/peraturan', function () {
        return Inertia::render('PeraturanListPage');
    })->name('peraturan.index');

    Route::get('/peraturan/{id}', function (string $id) {
        return Inertia::render('PeraturanDetailPage', [
            'id' => $id,
        ]);
    })->name('peraturan.show');

    Route::get('/ai', function () {
        return Inertia::render('AIAssistantPage');
    })->name('ai');

    // ==========================================
    // 4. ADMIN ONLY: MANAGE ACCOUNTS (RBAC)
    // ==========================================
    Route::prefix('admin')->name('admin.')->middleware('role:ADMIN')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');
    });
});
