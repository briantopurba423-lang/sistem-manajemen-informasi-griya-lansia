<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DailyActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExaminationController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\ResidentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $r) => $r->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profil
    Route::put('/profile', function (Request $request) {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $request->user()->id,
            'password' => 'nullable|string|min:8',
        ]);

        $user = $request->user();
        $user->name  = $data['name'];
        $user->email = $data['email'];
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }
        $user->save();

        return response()->json($user);
    });

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Laporan
    Route::get('/laporan/summary', [LaporanController::class, 'summary']);

    // Lansia
    Route::apiResource('residents', ResidentController::class);

    // Pemeriksaan
    Route::apiResource('examinations', ExaminationController::class);

    // Kondisi Kesehatan
    Route::apiResource('health-records', HealthRecordController::class);

    // Kegiatan Harian
    Route::apiResource('daily-activities', DailyActivityController::class);
});
