import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, MOCK_USERS } from '../mock/mockUsers';
import { Scale, LogIn, Lock, User, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES.PROJA_1);
  const [username, setUsername] = useState('operator.riau');
  const [password, setPassword] = useState('••••••••');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRoleChange = (e) => {
    const roleVal = e.target.value;
    setSelectedRole(roleVal);
    const matched = MOCK_USERS.find(u => u.role === roleVal);
    if (matched) {
      setUsername(matched.email.split('@')[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(selectedRole);
    showToast(`Berhasil masuk sebagai ${selectedRole}`, 'success');
    navigate('/home');
  };

  const getRoleDescription = (r) => {
    switch (r) {
      case ROLES.PROJA_1:
      case ROLES.PROJA_2:
      case ROLES.PROJA_3:
        return 'Akses input permohonan & penyusunan Surat Hasil Harmonisasi wilayah Riau.';
      case ROLES.KAKANWIL:
        return 'Akses pemantauan eksekutif & pengawasan seluruh berkas permohonan Riau.';
      case ROLES.KADIV:
        return 'Akses verifikasi divisi P3H & evaluasi permohonan.';
      case ROLES.BIRO_HUKUM:
        return 'Akses pemeriksaan tingkat provinsi & pengunggahan Surat Hasil Fasilitasi.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4">
      {/* Top back link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3.5 py-2 bento-btn-secondary rounded-xl text-xs font-bold text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
        <span className="text-[11px] font-bold bento-badge-amber">
          <Sparkles className="w-3 h-3" />
          HARMONITAS Riau
        </span>
      </div>

      {/* Main Login Card Bento */}
      <div className="w-full max-w-md bento-card overflow-hidden">
        {/* Header Branding Navy Blue (#2C3154) */}
        <div className="bg-[#2C3154] text-white p-7 text-center border-b border-[#383F6A]">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#2C3154] text-[#FFC800] flex items-center justify-center font-black mb-3 border border-[#FFC800]/40">
            <Scale className="w-8 h-8 text-[#FFC800]" />
          </div>
          <h2 className="text-2xl font-black tracking-wider text-white">
            HARMONITAS
          </h2>
          <p className="text-xs text-[#FFC800] font-extrabold mt-1">
            Harmonisasi Ranperda dan Ranperkada Tuntas
          </p>
          <p className="text-[11px] text-slate-200 font-medium mt-1 leading-snug">
            Upaya menyederhanakan proses harmonisasi rancangan peraturan daerah dan rancangan peraturan kepala daerah.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Username Petugas
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-10 text-xs p-3 bento-input font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Kata Sandi / Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-10 text-xs p-3 bento-input font-bold"
              />
            </div>
          </div>

          {/* Role Simulation Dropdown */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Simulasi Role Hak Akses</span>
              </label>
              <span className="bento-badge-amber text-[10px]">
                Tanpa Backend
              </span>
            </div>

            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full text-xs font-bold p-3 bento-input cursor-pointer"
            >
              {Object.values(ROLES).map((roleName) => (
                <option key={roleName} value={roleName}>
                  {roleName}
                </option>
              ))}
            </select>

            <p className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-xl font-medium leading-relaxed">
              <span className="font-bold text-slate-900">Keterangan Akses:</span> {getRoleDescription(selectedRole)}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bento-btn-amber text-white font-black text-xs flex items-center justify-center gap-2 mt-4"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Dashboard</span>
          </button>
        </form>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500 font-bold">
          HARMONITAS Kanwil Kemenkumham Riau • Hak Akses Terenkripsi
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
