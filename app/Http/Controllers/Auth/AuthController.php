<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Tampilkan halaman Login
     */
    public function showLogin(): Response
    {
        $demoUsers = [
            [
                'role' => 'ADMIN',
                'name' => 'Administrator Sistem',
                'email' => 'admin@harmonitas.go.id',
                'description' => 'Akses penuh kelola akun, master data & sistem',
            ],
            [
                'role' => 'TIM_KERJA',
                'name' => 'Tim Kerja 1 Kanwil Riau',
                'email' => 'timkerja1@harmonitas.go.id',
                'description' => 'Membina Pemprov Riau, Siak, Kampar, Inhil, Bengkalis',
            ],
            [
                'role' => 'TIM_KERJA',
                'name' => 'Tim Kerja 2 Kanwil Riau',
                'email' => 'timkerja2@harmonitas.go.id',
                'description' => 'Membina Rohul, Inhu, Meranti, Dumai',
            ],
            [
                'role' => 'TIM_KERJA',
                'name' => 'Tim Kerja 3 Kanwil Riau',
                'email' => 'timkerja3@harmonitas.go.id',
                'description' => 'Membina Kuansing, Pelalawan, Rohil, Pekanbaru',
            ],
            [
                'role' => 'BIRO_HUKUM',
                'name' => 'Biro Hukum Provinsi Riau',
                'email' => 'birohukum.riau@harmonitas.go.id',
                'description' => 'Validasi telaah & persetujuan Pemprov Riau',
            ],
            [
                'role' => 'PIMPINAN',
                'name' => 'Kepala Kantor Wilayah Riau',
                'email' => 'kakanwil.riau@harmonitas.go.id',
                'description' => 'Monitoring eksekutif seluruh wilayah Riau',
            ],
        ];

        return Inertia::render('LoginPage', [
            'demoUsers' => $demoUsers,
        ]);
    }

    /**
     * Proses Autentikasi Login Pengguna
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        // Catat Audit Log
        AuditLog::create([
            'user_id' => $user->user_id,
            'action' => 'AUTH_LOGIN',
            'module' => 'AUTHENTICATION',
            'target_id' => (string) $user->user_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'email' => $user->email,
                'role' => $user->role,
                'login_at' => now()->toIso8601String(),
            ],
            'created_at' => now(),
        ]);

        return redirect()->intended(route('home'))->with('success', "Selamat datang kembali, {$user->nama}!");
    }

    /**
     * Logout Pengguna & Hapus Sesi
     */
    public function logout(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user) {
            AuditLog::create([
                'user_id' => $user->user_id,
                'action' => 'AUTH_LOGOUT',
                'module' => 'AUTHENTICATION',
                'target_id' => (string) $user->user_id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'payload' => ['email' => $user->email],
                'created_at' => now(),
            ]);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('info', 'Anda telah berhasil keluar dari sistem HARMONITAS.');
    }
}
