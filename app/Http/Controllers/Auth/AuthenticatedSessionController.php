<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        if (!Auth::attempt([
            'email'    => $credentials['email'],
            'password' => $credentials['password'],
        ], $request->boolean('remember'))) {

            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $request->session()->regenerate();

        // Jika request dari React (AJAX/fetch), kembalikan JSON
        if ($request->expectsJson()) {
            $redirect = $request->user()->role === 'keluarga'
                ? route('keluarga.dashboard')
                : route('dashboard');

            return response()->json([
                'message'  => 'Login berhasil.',
                'redirect' => $redirect,
                'user'     => $request->user(),
            ]);
        }

        // Jika request form biasa, redirect sesuai role
        $redirect = $request->user()->role === 'keluarga'
            ? route('keluarga.dashboard')
            : route('dashboard');

        return redirect()->intended($redirect);
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Logout berhasil.']);
        }

        return redirect()->route('login');
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
