<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

// Landing page publik
Route::get('/', fn () => view('landing'))->name('home');

// Auth (API-style, return JSON)
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/me', [AuthenticatedSessionController::class, 'me'])->name('auth.me');

    // Semua route dashboard & fitur lainnya akan ditambahkan di sini
    // setelah controller dibuat
});
