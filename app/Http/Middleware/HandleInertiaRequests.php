<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $notifications = [];
        $unreadCount = 0;

        if ($user) {
            $user->loadMissing(['timKerja', 'roleRelation']);

            // Admin dikecualikan dari notifikasi operasional
            if ($user->role_id !== 1 && $user->role !== 'ADMIN') {
                $rawNotifs = \App\Models\Notifikasi::where('user_id', $user->user_id)
                    ->with(['rancangan:rancangan_id,judul_rancangan,nomor_regulasi'])
                    ->latest('created_at')
                    ->limit(20)
                    ->get();

                $unreadCount = \App\Models\Notifikasi::where('user_id', $user->user_id)
                    ->where('is_read', false)
                    ->count();

                $notifications = $rawNotifs->map(function ($n) {
                    return [
                        'id' => $n->notifikasi_id,
                        'notifikasi_id' => $n->notifikasi_id,
                        'rancangan_id' => $n->rancangan_id,
                        'judul' => $n->judul,
                        'pesan' => $n->pesan,
                        'is_read' => (bool) $n->is_read,
                        'time_ago' => $n->created_at ? $n->created_at->diffForHumans() : 'Baru saja',
                        'created_at' => $n->created_at ? $n->created_at->toISOString() : null,
                        'rancangan' => $n->rancangan ? [
                            'id' => $n->rancangan->rancangan_id,
                            'judul' => $n->rancangan->judul_rancangan,
                            'nomor' => $n->rancangan->nomor_regulasi,
                        ] : null,
                    ];
                })->toArray();
            }
        }

        return [
            ...parent::share($request),
            'notifications' => $notifications,
            'unread_notifications_count' => $unreadCount,
            'auth' => [
                'user' => $user ? [
                    'id' => $user->user_id,
                    'user_id' => $user->user_id,
                    'name' => $user->nama,
                    'nama' => $user->nama,
                    'email' => $user->email,
                    'nip' => $user->nip,
                    'no_hp' => $user->no_hp,
                    'role' => $user->role,
                    'role_id' => $user->role_id,
                    'status' => $user->status,
                    'avatar_path' => $user->avatar_path,
                    'tim_kerja_id' => $user->tim_kerja_id,
                    'tim_kerja' => $user->timKerja ? [
                        'id' => $user->timKerja->tim_kerja_id,
                        'tim_kerja_id' => $user->timKerja->tim_kerja_id,
                        'nama_tim_kerja' => $user->timKerja->nama_tim_kerja,
                        'keterangan' => $user->timKerja->keterangan,
                    ] : null,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
