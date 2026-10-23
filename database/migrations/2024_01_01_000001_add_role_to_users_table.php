<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'staff', 'keluarga'])->default('staff')->after('email');
            // resident_id FK ditambahkan di migrasi terpisah setelah tabel residents dibuat
            $table->unsignedBigInteger('resident_id')->nullable()->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'resident_id']);
        });
    }
};
