<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        if ($user->status !== 'ACTIVE') {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'email' => 'Akun Anda telah dinonaktifkan. Silakan hubungi Administrator Sistem Kanwil Riau.',
            ]);
        }

        $userRole = $user->role;

        // Normalisasi alias POKJA <-> TIM_KERJA
        $normalizedRoles = [];
        foreach ($roles as $r) {
            $normalizedRoles[] = $r;
            if ($r === 'POKJA') $normalizedRoles[] = 'TIM_KERJA';
            if ($r === 'TIM_KERJA') $normalizedRoles[] = 'POKJA';
        }

        if (! empty($roles) && ! in_array($userRole, $normalizedRoles, true)) {
            abort(403, 'Akses Ditolak: Anda tidak memiliki wewenang untuk mengakses halaman ini.');
        }

        return $next($request);
    }
}
