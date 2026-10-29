<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Keluarga tidak boleh akses halaman admin — arahkan ke dashboard mereka
        if ($user->role === 'keluarga') {
            return redirect()->route('keluarga.dashboard');
        }

        return $next($request);
    }
}
