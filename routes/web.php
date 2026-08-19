<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes - HARMONITAS (Laravel + Inertia React)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('LandingPage');
})->name('landing');

Route::get('/login', function () {
    return Inertia::render('LoginPage');
})->name('login');

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

Route::get('/panduan', function () {
    return Inertia::render('PanduanPage');
})->name('panduan');

Route::get('/ai', function () {
    return Inertia::render('AIAssistantPage');
})->name('ai');
