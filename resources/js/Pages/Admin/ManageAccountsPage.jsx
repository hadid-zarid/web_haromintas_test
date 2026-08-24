import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../components/layout/AppLayout';
import RoleBadge from '../../components/common/RoleBadge';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Mail, 
  Phone, 
  X, 
  AlertCircle, 
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';

export const ManageAccountsPage = ({ users, stats, timKerjas = [], pokjas = [], filters = {} }) => {
  const { auth, flash } = usePage().props;
  const currentAdminId = auth?.user?.user_id || auth?.user?.id;

  // Normalisasi list unit tim kerja
  const unitList = (timKerjas && timKerjas.length > 0) ? timKerjas : pokjas;

  // Filter States
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedRole, setSelectedRole] = useState(filters.role || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [togglingUser, setTogglingUser] = useState(null);

  // Form: Tambah Akun
  const addForm = useForm({
    nama: '',
    email: '',
    password: '',
    nip: '',
    no_hp: '',
    role_id: 2, // Default: Tim Kerja
    tim_kerja_id: unitList[0]?.tim_kerja_id || unitList[0]?.id || 1,
  });

  // Form: Edit Akun
  const editForm = useForm({
    nama: '',
    email: '',
    password: '',
    nip: '',
    no_hp: '',
    role_id: 2,
    status: 'ACTIVE',
    tim_kerja_id: '',
  });

  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Password Rules Checker
  const getPasswordRules = (pwd = '') => {
    return {
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
      hasMinLen: pwd.length >= 8,
    };
  };

  const addPasswordRules = getPasswordRules(addForm.data.password);
  const editPasswordRules = getPasswordRules(editForm.data.password);

  // Filter submit handler
  const handleFilterSubmit = (e) => {
    e?.preventDefault();
    router.get('/admin/users', {
      search: searchTerm,
      role: selectedRole,
      status: selectedStatus,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleResetFilter = () => {
    setSearchTerm('');
    setSelectedRole('ALL');
    setSelectedStatus('ALL');
    router.get('/admin/users');
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setEditingUser(user);
    const userId = user.user_id || user.id;
    editForm.setData({
      nama: user.nama || user.name || '',
      email: user.email || '',
      password: '',
      nip: user.nip || '',
      no_hp: user.no_hp || '',
      role_id: user.role_id || (user.role === 'ADMIN' ? 1 : user.role === 'BIRO_HUKUM' ? 3 : user.role === 'PIMPINAN' ? 4 : 2),
      status: user.status || 'ACTIVE',
      tim_kerja_id: user.tim_kerja_id || user.pokja_id || unitList[0]?.tim_kerja_id || unitList[0]?.id || '',
    });
  };

  // Submit Add User
  const handleAddSubmit = (e) => {
    e.preventDefault();
    addForm.post('/admin/users', {
      onSuccess: () => {
        setIsAddModalOpen(false);
        addForm.reset();
      },
    });
  };

  // Submit Edit User
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const targetId = editingUser.user_id || editingUser.id;
    editForm.put(`/admin/users/${targetId}`, {
      onSuccess: () => {
        setEditingUser(null);
        editForm.reset();
      },
    });
  };

  // Submit Delete User
  const handleDeleteConfirm = () => {
    if (!deletingUser) return;
    const targetId = deletingUser.user_id || deletingUser.id;
    router.delete(`/admin/users/${targetId}`, {
      onSuccess: () => setDeletingUser(null),
    });
  };

  // Submit Toggle Status
  const handleToggleStatusConfirm = () => {
    if (!togglingUser) return;
    const targetId = togglingUser.user_id || togglingUser.id;
    router.post(`/admin/users/${targetId}/toggle-status`, {}, {
      onSuccess: () => setTogglingUser(null),
    });
  };

  return (
    <AppLayout>
      <Head title="Manajemen Akun Pengguna (RBAC)" />

      <div className="space-y-6">
        {/* Flash Notifications */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>{flash.success}</p>
          </div>
        )}

        {flash?.error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-bold shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>{flash.error}</p>
          </div>
        )}

        {/* HEADER & ACTION BANNER */}
        <div className="bg-[#2C3154] text-white p-6 sm:p-7 rounded-3xl border border-[#383F6A] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#FFC800]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black border border-white/10 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFC800]" />
              <span>Modul Khusus Administrator Sistem</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-white">
              Manajemen Akun & Hak Akses (RBAC)
            </h1>
            <p className="text-xs text-slate-200 font-medium mt-1 max-w-xl leading-relaxed">
              Kelola data pengguna sistem HARMONITAS, tentukan hak akses peran (*Admin, Tim Kerja, Biro Hukum, Pimpinan*), serta aktifkan atau nonaktifkan akun dinas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="relative px-4 py-3 rounded-2xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFE082] hover:to-[#FFC107] text-[#1A1A5E] font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Akun Pengguna</span>
          </button>
        </div>

        {/* BENTO SUMMARY STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-[#E2E2DC] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Total Pengguna
            </p>
            <p className="text-2xl font-black text-[#1A1A5E] mt-1">
              {stats?.total || 0}
            </p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              Terdaftar di HARMONITAS
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E2DC] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
              Akun Aktif
            </p>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              {stats?.active || 0}
            </p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              Dapat login & beraktivitas
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E2DC] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-600">
              Akun Nonaktif
            </p>
            <p className="text-2xl font-black text-rose-700 mt-1">
              {stats?.inactive || 0}
            </p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              Akses login diblokir
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E2DC] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-purple-600">
              Distribusi Peran
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-black text-[#1A1A5E]">
              <span className="text-purple-700">{stats?.admin || 0} Adm</span>
              <span>•</span>
              <span className="text-blue-700">{stats?.tim_kerja || stats?.pokja || 0} Tim</span>
              <span>•</span>
              <span className="text-emerald-700">{stats?.biro_hukum || 0} Biro</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              {stats?.pimpinan || 0} Akun Pimpinan
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER TOOLBAR */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E2DC] shadow-sm space-y-3">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, email, atau NIP pegawai..."
                className="w-full pl-10 pr-4 py-2 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
              />
            </div>

            {/* Role Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full py-2 px-3 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
              >
                <option value="ALL">Semua Hak Akses (Role)</option>
                <option value="1">ADMIN - Administrator Kanwil</option>
                <option value="2">TIM_KERJA - Tim Kerja Kanwil</option>
                <option value="3">BIRO_HUKUM - Biro Hukum Provinsi</option>
                <option value="4">PIMPINAN - Kakanwil & Kadiv</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-2 px-3 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
              >
                <option value="ALL">Semua Status</option>
                <option value="ACTIVE">ACTIVE (Aktif)</option>
                <option value="INACTIVE">INACTIVE (Nonaktif)</option>
              </select>
            </div>

            {/* Action Filter Buttons */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2 px-3 bg-[#1A1A5E] text-white hover:bg-[#2C3154] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
              <button
                type="button"
                onClick={handleResetFilter}
                title="Reset Filter"
                className="p-2 bg-[#F8F8F5] border border-[#E2E2DC] hover:bg-white text-slate-600 rounded-xl transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E2DC] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#1A1A5E]">
                Daftar Akun Pengguna ({users?.total || users?.data?.length || 0})
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Daftar seluruh akun petugas yang terdaftar di database HARMONITAS.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F8F5] border-b border-[#E2E2DC] text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Nama & Identitas Pegawai</th>
                  <th className="py-3.5 px-4">Kontak / Email</th>
                  <th className="py-3.5 px-4">Hak Akses & Penugasan</th>
                  <th className="py-3.5 px-4">Status Akun</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users?.data && users.data.length > 0 ? (
                  users.data.map((u) => {
                    const userId = u.user_id || u.id;
                    const userName = u.nama || u.name;
                    const isSelf = userId === currentAdminId;
                    const timName = u.tim_kerja?.nama_tim_kerja || u.timKerja?.nama_tim_kerja || u.pokja?.nama_pokja;

                    return (
                      <tr key={userId} className="hover:bg-slate-50/70 transition">
                        {/* Nama & NIP */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#1A1A5E]/10 border border-[#1A1A5E]/20 text-[#1A1A5E] font-black flex items-center justify-center shrink-0">
                              {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-[#1A1A5E] truncate flex items-center gap-1.5">
                                <span>{userName}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-black">
                                    Akun Anda
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                NIP: {u.nip || '-'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Kontak & Email */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{u.email}</span>
                          </p>
                          {u.no_hp && (
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{u.no_hp}</span>
                            </p>
                          )}
                        </td>

                        {/* Role & Unit */}
                        <td className="py-3.5 px-4">
                          <div>
                            <RoleBadge 
                              role={u.role || u.role_relation?.nama_role} 
                              timKerjaName={timName} 
                            />
                            {timName && (
                              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                                {u.tim_kerja?.keterangan || u.timKerja?.keterangan}
                              </p>
                            )}
                            {(u.role === 'BIRO_HUKUM' || u.role_id === 3) && (
                              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                                Biro Hukum Provinsi Riau
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {u.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                              Nonaktif
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            {/* Toggle Status */}
                            <button
                              type="button"
                              disabled={isSelf}
                              onClick={() => setTogglingUser(u)}
                              title={u.status === 'ACTIVE' ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                              className={`p-1.5 rounded-lg border transition ${
                                isSelf
                                  ? 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400'
                                  : u.status === 'ACTIVE'
                                  ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {u.status === 'ACTIVE' ? (
                                <ShieldAlert className="w-4 h-4" />
                              ) : (
                                <ShieldCheck className="w-4 h-4" />
                              )}
                            </button>

                            {/* Edit User */}
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              title="Edit Data Akun"
                              className="p-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Delete User */}
                            <button
                              type="button"
                              disabled={isSelf}
                              onClick={() => setDeletingUser(u)}
                              title={isSelf ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Akun'}
                              className={`p-1.5 rounded-lg border transition ${
                                isSelf
                                  ? 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400'
                                  : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 font-bold">
                      Tidak ditemukan akun pengguna dengan kriteria pencarian ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users?.links && users.links.length > 3 && (
            <div className="p-4 border-t border-[#E2E2DC] flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500">
                Menampilkan halaman {users.current_page} dari {users.last_page} ({users.total} total akun)
              </p>
              <div className="flex items-center gap-1">
                {users.links.map((link, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={!link.url || link.active}
                    onClick={() => link.url && router.get(link.url)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      link.active
                        ? 'bg-[#1A1A5E] text-white'
                        : link.url
                        ? 'bg-[#F8F8F5] text-slate-700 hover:bg-white border border-[#E2E2DC]'
                        : 'opacity-40 text-slate-400 cursor-not-allowed'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: TAMBAH AKUN PENGGUNA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A5E]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#2C3154] text-white p-5 flex items-center justify-between border-b border-[#383F6A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFC800]/20 border border-[#FFC800]/30 flex items-center justify-center text-[#FFC800]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Tambah Akun Pengguna Baru</h3>
                  <p className="text-[10px] text-[#FFC800] font-bold">Registrasi Akun Petugas oleh Administrator (Otomatis Aktif)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.data.nama}
                    onChange={(e) => addForm.setData('nama', e.target.value)}
                    placeholder="Nama Pegawai"
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                  {addForm.errors.nama && (
                    <p className="mt-1 text-[10px] text-rose-600 font-bold">{addForm.errors.nama}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Email Kedinasan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={addForm.data.email}
                    onChange={(e) => addForm.setData('email', e.target.value)}
                    placeholder="email@harmonitas.go.id"
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                  {addForm.errors.email && (
                    <p className="mt-1 text-[10px] text-rose-600 font-bold">{addForm.errors.email}</p>
                  )}
                </div>

                {/* NIP */}
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    NIP Pegawai
                  </label>
                  <input
                    type="text"
                    value={addForm.data.nip}
                    onChange={(e) => addForm.setData('nip', e.target.value)}
                    placeholder="19880101 201501 1 001"
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                </div>

                {/* No HP */}
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={addForm.data.no_hp}
                    onChange={(e) => addForm.setData('no_hp', e.target.value)}
                    placeholder="081234567890"
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                </div>

                {/* Role / Hak Akses */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Hak Akses (Role) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.data.role_id}
                    onChange={(e) => addForm.setData('role_id', parseInt(e.target.value))}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  >
                    <option value={2}>TIM_KERJA - Tim Kerja Kanwil Riau</option>
                    <option value={3}>BIRO_HUKUM - Biro Hukum Provinsi</option>
                    <option value={4}>PIMPINAN - Kakanwil & Kadiv</option>
                    <option value={1}>ADMIN - Administrator Sistem</option>
                  </select>
                </div>
              </div>

              {/* Conditional Field Tim Kerja */}
              {parseInt(addForm.data.role_id) === 2 && (
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Pilih Penugasan Tim Kerja Kanwil <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={addForm.data.tim_kerja_id}
                    onChange={(e) => addForm.setData('tim_kerja_id', parseInt(e.target.value))}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  >
                    <option value="">-- Pilih Tim Kerja --</option>
                    {unitList.map((p) => {
                      const pId = p.tim_kerja_id || p.id;
                      const pName = p.nama_tim_kerja || p.nama_pokja;
                      return (
                        <option key={pId} value={pId}>
                          {pName} - ({p.keterangan})
                        </option>
                      );
                    })}
                  </select>
                  {addForm.errors.tim_kerja_id && (
                    <p className="mt-1 text-[10px] text-rose-600 font-bold">{addForm.errors.tim_kerja_id}</p>
                  )}
                </div>
              )}

              {/* Password Input & Realtime Security Checklist */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-extrabold text-[#1A1A5E]">
                    Kata Sandi Akun <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => addForm.setData('password', 'Harmonitas@2026')}
                    className="text-[10px] font-bold text-[#1A1A5E] hover:underline"
                  >
                    Gunakan Default ('Harmonitas@2026')
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAddPassword ? 'text' : 'password'}
                    required
                    value={addForm.data.password}
                    onChange={(e) => addForm.setData('password', e.target.value)}
                    placeholder="Masukkan Password"
                    className="w-full p-2.5 pr-10 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#1A1A5E]"
                  >
                    {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Rules Checklist */}
                <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className={`flex items-center gap-1.5 font-bold transition-colors ${addPasswordRules.hasLower ? 'text-emerald-700' : 'text-rose-500'}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${addPasswordRules.hasLower ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                    <span>Minimal satu huruf kecil</span>
                  </div>

                  <div className={`flex items-center gap-1.5 font-bold transition-colors ${addPasswordRules.hasUpper ? 'text-emerald-700' : 'text-rose-500'}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${addPasswordRules.hasUpper ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                    <span>Minimal satu huruf besar</span>
                  </div>

                  <div className={`flex items-center gap-1.5 font-bold transition-colors ${addPasswordRules.hasNumber ? 'text-emerald-700' : 'text-rose-500'}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${addPasswordRules.hasNumber ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                    <span>Minimal satu angka</span>
                  </div>

                  <div className={`flex items-center gap-1.5 font-bold transition-colors ${addPasswordRules.hasSpecial ? 'text-emerald-700' : 'text-rose-500'}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${addPasswordRules.hasSpecial ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                    <span>Minimal satu karakter spesial</span>
                  </div>

                  <div className={`flex items-center gap-1.5 font-bold sm:col-span-2 transition-colors ${addPasswordRules.hasMinLen ? 'text-emerald-700' : 'text-rose-500'}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${addPasswordRules.hasMinLen ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                    <span>Minimal 8 karakter</span>
                  </div>
                </div>

                {addForm.errors.password && (
                  <p className="mt-1 text-[10px] text-rose-600 font-bold">{addForm.errors.password}</p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addForm.processing}
                  className="px-5 py-2.5 rounded-xl bg-[#1A1A5E] hover:bg-[#2C3154] text-white text-xs font-black transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#FFC800]" />
                  <span>{addForm.processing ? 'Menyimpan...' : 'Simpan Akun Pengguna'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT AKUN PENGGUNA */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A5E]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#2C3154] text-white p-5 flex items-center justify-between border-b border-[#383F6A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Edit Data Akun Pengguna</h3>
                  <p className="text-[10px] text-slate-300 font-bold">{(editingUser.nama || editingUser.name)} ({editingUser.email})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama */}
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.data.nama}
                    onChange={(e) => editForm.setData('nama', e.target.value)}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                  {editForm.errors.nama && (
                    <p className="mt-1 text-[10px] text-rose-600 font-bold">{editForm.errors.nama}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Email Kedinasan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.data.email}
                    onChange={(e) => editForm.setData('email', e.target.value)}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                  {editForm.errors.email && (
                    <p className="mt-1 text-[10px] text-rose-600 font-bold">{editForm.errors.email}</p>
                  )}
                </div>

                {/* NIP */}
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    NIP Pegawai
                  </label>
                  <input
                    type="text"
                    value={editForm.data.nip}
                    onChange={(e) => editForm.setData('nip', e.target.value)}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                </div>

                {/* No HP */}
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={editForm.data.no_hp}
                    onChange={(e) => editForm.setData('no_hp', e.target.value)}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                </div>

                {/* Role */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Hak Akses (Role) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={(editingUser.user_id || editingUser.id) === currentAdminId}
                    value={editForm.data.role_id}
                    onChange={(e) => editForm.setData('role_id', parseInt(e.target.value))}
                    className={`w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800] ${
                      (editingUser.user_id || editingUser.id) === currentAdminId ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value={2}>TIM_KERJA - Tim Kerja Kanwil Riau</option>
                    <option value={3}>BIRO_HUKUM - Biro Hukum Provinsi</option>
                    <option value={4}>PIMPINAN - Kakanwil & Kadiv</option>
                    <option value={1}>ADMIN - Administrator Sistem</option>
                  </select>
                  {(editingUser.user_id || editingUser.id) === currentAdminId && (
                    <p className="text-[10px] text-purple-600 font-bold mt-0.5">Role akun admin aktif tidak dapat diubah sendiri.</p>
                  )}
                </div>
              </div>

              {/* Conditional Tim Kerja */}
              {parseInt(editForm.data.role_id) === 2 && (
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Pilih Penugasan Tim Kerja Kanwil <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={editForm.data.tim_kerja_id}
                    onChange={(e) => editForm.setData('tim_kerja_id', parseInt(e.target.value))}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  >
                    <option value="">-- Pilih Tim Kerja --</option>
                    {unitList.map((p) => {
                      const pId = p.tim_kerja_id || p.id;
                      const pName = p.nama_tim_kerja || p.nama_pokja;
                      return (
                        <option key={pId} value={pId}>
                          {pName} - ({p.keterangan})
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Status Akun */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                  Status Akun <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#1A1A5E] cursor-pointer">
                    <input
                      type="radio"
                      name="edit_status"
                      value="ACTIVE"
                      disabled={(editingUser.user_id || editingUser.id) === currentAdminId}
                      checked={editForm.data.status === 'ACTIVE'}
                      onChange={() => editForm.setData('status', 'ACTIVE')}
                      className="accent-emerald-600"
                    />
                    <span>ACTIVE (Aktif)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="edit_status"
                      value="INACTIVE"
                      disabled={(editingUser.user_id || editingUser.id) === currentAdminId}
                      checked={editForm.data.status === 'INACTIVE'}
                      onChange={() => editForm.setData('status', 'INACTIVE')}
                      className="accent-rose-600"
                    />
                    <span>INACTIVE (Nonaktif)</span>
                  </label>
                </div>
              </div>

              {/* Ganti Password (Opsional) */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                  Ganti Kata Sandi (Kosongkan jika tidak ingin mengubah)
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editForm.data.password}
                    onChange={(e) => editForm.setData('password', e.target.value)}
                    placeholder="Masukkan password baru jika ingin mereset"
                    className="w-full p-2.5 pr-10 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#1A1A5E]"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {editForm.data.password.length > 0 && (
                  <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className={`flex items-center gap-1.5 font-bold ${editPasswordRules.hasLower ? 'text-emerald-700' : 'text-rose-500'}`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${editPasswordRules.hasLower ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                      <span>Minimal satu huruf kecil</span>
                    </div>

                    <div className={`flex items-center gap-1.5 font-bold ${editPasswordRules.hasUpper ? 'text-emerald-700' : 'text-rose-500'}`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${editPasswordRules.hasUpper ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                      <span>Minimal satu huruf besar</span>
                    </div>

                    <div className={`flex items-center gap-1.5 font-bold ${editPasswordRules.hasNumber ? 'text-emerald-700' : 'text-rose-500'}`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${editPasswordRules.hasNumber ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                      <span>Minimal satu angka</span>
                    </div>

                    <div className={`flex items-center gap-1.5 font-bold ${editPasswordRules.hasSpecial ? 'text-emerald-700' : 'text-rose-500'}`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${editPasswordRules.hasSpecial ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                      <span>Minimal satu karakter spesial</span>
                    </div>

                    <div className={`flex items-center gap-1.5 font-bold sm:col-span-2 ${editPasswordRules.hasMinLen ? 'text-emerald-700' : 'text-rose-500'}`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${editPasswordRules.hasMinLen ? 'bg-emerald-600' : 'bg-rose-500'}`} />
                      <span>Minimal 8 karakter</span>
                    </div>
                  </div>
                )}

                {editForm.errors.password && (
                  <p className="mt-1 text-[10px] text-rose-600 font-bold">{editForm.errors.password}</p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editForm.processing}
                  className="px-5 py-2.5 rounded-xl bg-[#1A1A5E] hover:bg-[#2C3154] text-white text-xs font-black transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC800]" />
                  <span>{editForm.processing ? 'Menyimpan...' : 'Perbarui Akun'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI TOGGLE STATUS */}
      {togglingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A5E]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-2xl max-w-md w-full p-6 text-center">
            <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
              togglingUser.status === 'ACTIVE' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-[#1A1A5E]">
              {togglingUser.status === 'ACTIVE' ? 'Nonaktifkan Akun Pengguna?' : 'Aktifkan Kembali Akun Pengguna?'}
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
              Anda akan mengubah status akun <span className="font-bold text-[#1A1A5E]">{togglingUser.nama || togglingUser.name}</span> ({togglingUser.email}) menjadi{' '}
              <span className={`font-black ${togglingUser.status === 'ACTIVE' ? 'text-rose-600' : 'text-emerald-600'}`}>
                {togglingUser.status === 'ACTIVE' ? 'INACTIVE (Nonaktif)' : 'ACTIVE (Aktif)'}
              </span>.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setTogglingUser(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleToggleStatusConfirm}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-black transition ${
                  togglingUser.status === 'ACTIVE' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Ya, Ubah Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS AKUN */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A5E]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-2xl max-w-md w-full p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-rose-900">
              Hapus Akun Pengguna Secara Permanen?
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Akun <span className="font-bold text-[#1A1A5E]">{deletingUser.nama || deletingUser.name}</span> ({deletingUser.email}) akan dihapus dari sistem HARMONITAS.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ManageAccountsPage;
