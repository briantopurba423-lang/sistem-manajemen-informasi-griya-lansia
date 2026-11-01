<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    /**
     * Allow admin and staff. Block keluarga → send to their own dashboard.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if ($user->role === 'keluarga') {
            return redirect()->route('keluarga.dashboard');
        }

        return $next($request);
    }
}
