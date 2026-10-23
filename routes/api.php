<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DailyActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExaminationController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\ResidentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $r) => $r->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Lansia
    Route::apiResource('residents', ResidentController::class);

    // Pemeriksaan
    Route::apiResource('examinations', ExaminationController::class);

    // Kondisi Kesehatan
    Route::apiResource('health-records', HealthRecordController::class);

    // Kegiatan Harian
    Route::apiResource('daily-activities', DailyActivityController::class);
});
