<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotifikasiController extends Controller
{
    /**
     * Ambil daftar notifikasi untuk user yang sedang login (JSON API)
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['notifications' => [], 'unread_count' => 0]);
        }

        $notifications = Notifikasi::where('user_id', $user->user_id)
            ->with(['rancangan:rancangan_id,judul_rancangan,nomor_regulasi,kabupaten_id'])
            ->latest('created_at')
            ->limit(30)
            ->get()
            ->map(function ($n) {
                return [
                    'id' => $n->notifikasi_id,
                    'notifikasi_id' => $n->notifikasi_id,
                    'rancangan_id' => $n->rancangan_id,
                    'judul' => $n->judul,
                    'pesan' => $n->pesan,
                    'is_read' => (bool) $n->is_read,
                    'created_at' => $n->created_at ? $n->created_at->toISOString() : null,
                    'time_ago' => $n->created_at ? $n->created_at->diffForHumans() : 'Baru saja',
                    'rancangan' => $n->rancangan ? [
                        'id' => $n->rancangan->rancangan_id,
                        'judul' => $n->rancangan->judul_rancangan,
                        'nomor' => $n->rancangan->nomor_regulasi,
                    ] : null,
                ];
            });

        $unreadCount = Notifikasi::where('user_id', $user->user_id)->where('is_read', false)->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Tandai satu notifikasi sebagai sudah dibaca (dengan proteksi IDOR)
     */
    public function markAsRead(Request $request, $id): JsonResponse|RedirectResponse
    {
        $user = Auth::user();
        $notifikasi = Notifikasi::findOrFail($id);

        // IDOR Defense: Pastikan notifikasi milik user yang bersangkutan
        if ($notifikasi->user_id !== $user->user_id && ! $user->isAdmin()) {
            abort(403, 'Akses Ditolak: Anda tidak berhak mengubah status notifikasi ini.');
        }

        $notifikasi->update(['is_read' => true]);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Notifikasi berhasil ditandai telah dibaca.',
            ]);
        }

        return back();
    }

    /**
     * Tandai semua notifikasi milik user yang sedang login sebagai sudah dibaca
     */
    public function markAllAsRead(Request $request): JsonResponse|RedirectResponse
    {
        $user = Auth::user();

        Notifikasi::where('user_id', $user->user_id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Semua notifikasi berhasil ditandai telah dibaca.',
            ]);
        }

        return back()->with('success', 'Semua notifikasi telah ditandai dibaca.');
    }
}
