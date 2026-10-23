<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_activities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('activity_date');
            $table->time('activity_time');
            $table->enum('status', ['akan_datang', 'dalam_proses', 'selesai'])->default('akan_datang');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_activities');
    }
};
