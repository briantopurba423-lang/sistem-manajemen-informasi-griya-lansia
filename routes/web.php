<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

// Landing
Route::get('/', fn () => view('landing'))->name('home');

// Auth
Route::get('/login', fn () => view('auth.login'))->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

// Dashboard — semua role pakai SPA yang sama, role ditentukan dari localStorage
Route::get('/perawat/dashboard',  fn () => view('dashboard'))->name('perawat.dashboard');
Route::get('/admin/dashboard',    fn () => view('dashboard'))->name('admin.dashboard');
Route::get('/keluarga/dashboard', fn () => view('dashboard'))->name('keluarga.dashboard');
