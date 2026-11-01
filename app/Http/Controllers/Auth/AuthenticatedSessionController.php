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
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        if (!Auth::attempt(
            ['email' => $request->email, 'password' => $request->password],
            $request->boolean('remember')
        )) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $request->session()->regenerate();

        $redirect = $this->redirectForRole($request->user()->role);

        if ($request->expectsJson()) {
            return response()->json([
                'message'  => 'Login berhasil.',
                'redirect' => $redirect,
                'user'     => $request->user(),
            ]);
        }

        return redirect()->intended($redirect);
    }

    private function redirectForRole(string $role): string
    {
        return match ($role) {
            'keluarga' => route('keluarga.dashboard'),
            'staff'    => route('perawat'),
            default    => route('dashboard'),   // admin
        };
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
        return response()->json(['user' => $request->user()]);
    }
}
