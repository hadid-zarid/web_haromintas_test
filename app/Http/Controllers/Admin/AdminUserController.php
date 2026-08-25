<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\AuditLog;
use App\Models\Role;
use App\Models\TimKerja;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * Tampilkan Daftar Akun Pengguna & Ringkasan RBAC
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $roleFilter = $request->query('role');
        $statusFilter = $request->query('status');
        $timKerjaFilter = $request->query('tim_kerja_id');

        $users = User::with(['timKerja', 'roleRelation'])->latest('created_at')->get();

        // Data Statistik Pengguna
        $stats = [
            'total' => User::count(),
            'active' => User::where('status', 'ACTIVE')->count(),
            'inactive' => User::where('status', 'INACTIVE')->count(),
            'admin' => User::where('role_id', 1)->count(),
            'tim_kerja' => User::where('role_id', 2)->count(),
            'biro_hukum' => User::where('role_id', 3)->count(),
            'pimpinan' => User::where('role_id', 4)->count(),
        ];

        $timKerjas = TimKerja::select('tim_kerja_id', 'nama_tim_kerja', 'keterangan')->get();
        $roles = Role::select('role_id', 'nama_role')->get();

        return Inertia::render('Admin/ManageAccountsPage', [
            'users' => $users,
            'stats' => $stats,
            'timKerjas' => $timKerjas,
            'roles' => $roles,
            'filters' => [
                'search' => $search ?? '',
                'role' => $roleFilter ?? 'ALL',
                'status' => $statusFilter ?? 'ALL',
                'tim_kerja_id' => $timKerjaFilter ?? 'ALL',
            ],
        ]);
    }

    /**
     * Tambah Akun Pengguna Baru oleh Admin
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $roleId = (int) $validated['role_id'];

        $user = User::create([
            'nama' => $validated['nama'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'nip' => $validated['nip'] ?? null,
            'no_hp' => $validated['no_hp'] ?? null,
            'role_id' => $roleId,
            'status' => 'ACTIVE', // Otomatis aktif saat dibuat
            'tim_kerja_id' => $roleId === 2 ? ($validated['tim_kerja_id'] ?? null) : null,
        ]);

        AuditLog::create([
            'user_id' => Auth::user()->user_id,
            'action' => 'ADMIN_CREATE_USER',
            'module' => 'USER_MANAGEMENT',
            'target_id' => (string) $user->user_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'created_user_id' => $user->user_id,
                'email' => $user->email,
                'role_id' => $user->role_id,
            ],
            'created_at' => now(),
        ]);

        return back()->with('success', "Akun pengguna '{$user->nama}' berhasil dibuat dan aktif.");
    }

    /**
     * Perbarui Data Akun Pengguna oleh Admin
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();
        $currentAdminId = Auth::user()->user_id;

        // Proteksi: Admin tidak boleh menonaktifkan dirinya sendiri
        if ($user->user_id === $currentAdminId && $validated['status'] === 'INACTIVE') {
            return back()->with('error', 'Anda tidak dapat menonaktifkan akun yang sedang aktif digunakan.');
        }

        $roleId = (int) $validated['role_id'];

        // Proteksi: Admin tidak boleh mengubah role dirinya sendiri menjadi non-admin
        if ($user->user_id === $currentAdminId && $roleId !== 1) {
            return back()->with('error', 'Anda tidak dapat mengubah hak akses admin akun Anda sendiri.');
        }

        $payloadUpdate = [
            'nama' => $validated['nama'],
            'email' => $validated['email'],
            'nip' => $validated['nip'] ?? null,
            'no_hp' => $validated['no_hp'] ?? null,
            'role_id' => $roleId,
            'status' => $validated['status'],
            'tim_kerja_id' => $roleId === 2 ? ($validated['tim_kerja_id'] ?? null) : null,
        ];

        // Jika password diisi, update password
        if (! empty($validated['password'])) {
            $payloadUpdate['password'] = Hash::make($validated['password']);
        }

        $user->update($payloadUpdate);

        AuditLog::create([
            'user_id' => $currentAdminId,
            'action' => 'ADMIN_UPDATE_USER',
            'module' => 'USER_MANAGEMENT',
            'target_id' => (string) $user->user_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'updated_user_id' => $user->user_id,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'status' => $user->status,
                'password_changed' => ! empty($validated['password']),
            ],
            'created_at' => now(),
        ]);

        return back()->with('success', "Data akun '{$user->nama}' berhasil diperbarui.");
    }

    /**
     * Hapus Akun Pengguna
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $currentAdminId = Auth::user()->user_id;

        // Proteksi: Admin tidak boleh menghapus akunnya sendiri
        if ($user->user_id === $currentAdminId) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $userName = $user->nama;
        $userEmail = $user->email;
        $userId = $user->user_id;

        $user->delete();

        AuditLog::create([
            'user_id' => $currentAdminId,
            'action' => 'ADMIN_DELETE_USER',
            'module' => 'USER_MANAGEMENT',
            'target_id' => (string) $userId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'deleted_user_id' => $userId,
                'email' => $userEmail,
                'name' => $userName,
            ],
            'created_at' => now(),
        ]);

        return back()->with('success', "Akun '{$userName}' ({$userEmail}) berhasil dihapus dari sistem.");
    }

    /**
     * Ubah Status Akun Pengguna (ACTIVE <-> INACTIVE)
     */
    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        $currentAdminId = Auth::user()->user_id;

        if ($user->user_id === $currentAdminId) {
            return back()->with('error', 'Anda tidak dapat mengubah status akun Anda sendiri.');
        }

        $newStatus = $user->status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        $user->update(['status' => $newStatus]);

        AuditLog::create([
            'user_id' => $currentAdminId,
            'action' => 'ADMIN_TOGGLE_USER_STATUS',
            'module' => 'USER_MANAGEMENT',
            'target_id' => (string) $user->user_id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => [
                'user_id' => $user->user_id,
                'new_status' => $newStatus,
            ],
            'created_at' => now(),
        ]);

        $statusLabel = $newStatus === 'ACTIVE' ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Status akun '{$user->nama}' berhasil {$statusLabel}.");
    }
}
