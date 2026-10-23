<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;

// Landing page publik
Route::get('/', fn () => view('landing'))->name('home');

// Auth
Route::get('/login', fn () => view('auth.login'))->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');

// Dashboard Perawat
Route::get('/perawat/dashboard', fn () => view('perawat'))->name('perawat.dashboard');

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/me', [AuthenticatedSessionController::class, 'me'])->name('auth.me');

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/api/dashboard/stats', [DashboardController::class, 'stats'])->name('dashboard.stats');

    // Data Lansia
    Route::get('/lansia', [ResidentController::class, 'index'])->name('lansia');
    Route::get('/api/lansia', [ResidentController::class, 'list'])->name('lansia.list');
    Route::post('/api/lansia', [ResidentController::class, 'store'])->name('lansia.store');
    Route::get('/api/lansia/{resident}', [ResidentController::class, 'show'])->name('lansia.show');
    Route::put('/api/lansia/{resident}', [ResidentController::class, 'update'])->name('lansia.update');
    Route::delete('/api/lansia/{resident}', [ResidentController::class, 'destroy'])->name('lansia.destroy');

    // Data Pegawai
    Route::get('/pegawai', [StaffController::class, 'index'])->name('pegawai');
    Route::get('/api/pegawai', [StaffController::class, 'list'])->name('pegawai.list');
    Route::post('/api/pegawai', [StaffController::class, 'store'])->name('pegawai.store');
    Route::get('/api/pegawai/{user}', [StaffController::class, 'show'])->name('pegawai.show');
    Route::put('/api/pegawai/{user}', [StaffController::class, 'update'])->name('pegawai.update');
    Route::delete('/api/pegawai/{user}', [StaffController::class, 'destroy'])->name('pegawai.destroy');

    // Data Kamar
    Route::get('/kamar', [RoomController::class, 'index'])->name('kamar');
    Route::get('/api/kamar', [RoomController::class, 'list'])->name('kamar.list');
    Route::get('/api/kamar/{room}/residents', [RoomController::class, 'residents'])->name('kamar.residents');

    // Kesehatan
    Route::get('/kesehatan', [HealthRecordController::class, 'index'])->name('kesehatan');
    Route::get('/api/kesehatan', [HealthRecordController::class, 'list'])->name('kesehatan.list');
    Route::post('/api/kesehatan', [HealthRecordController::class, 'store'])->name('kesehatan.store');
    Route::get('/api/kesehatan/{healthRecord}', [HealthRecordController::class, 'show'])->name('kesehatan.show');
    Route::put('/api/kesehatan/{healthRecord}', [HealthRecordController::class, 'update'])->name('kesehatan.update');
    Route::delete('/api/kesehatan/{healthRecord}', [HealthRecordController::class, 'destroy'])->name('kesehatan.destroy');
    Route::get('/api/kesehatan-residents', [HealthRecordController::class, 'residents'])->name('kesehatan.residents');

    // Kegiatan
    Route::get('/kegiatan', [ActivityController::class, 'index'])->name('kegiatan');
    Route::get('/api/kegiatan', [ActivityController::class, 'list'])->name('kegiatan.list');
    Route::post('/api/kegiatan', [ActivityController::class, 'store'])->name('kegiatan.store');
    Route::get('/api/kegiatan/{activity}', [ActivityController::class, 'show'])->name('kegiatan.show');
    Route::put('/api/kegiatan/{activity}', [ActivityController::class, 'update'])->name('kegiatan.update');
    Route::delete('/api/kegiatan/{activity}', [ActivityController::class, 'destroy'])->name('kegiatan.destroy');
    Route::get('/api/kegiatan-residents', [ActivityController::class, 'residents'])->name('kegiatan.residents');

    // Laporan
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan');
    Route::get('/api/laporan/summary', [LaporanController::class, 'summary'])->name('laporan.summary');
});
