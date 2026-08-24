import React, { useState } from 'react';
<<<<<<< Updated upstream
import { Link, useForm, usePage } from '@inertiajs/react';
import { 
  Lock, 
  Mail, 
  LogIn, 
  ArrowLeft, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Building,
  KeyRound
} from 'lucide-react';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';

export const LoginPage = ({ demoUsers = [] }) => {
  const { flash } = usePage().props;
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login', {
      onFinish: () => reset('password'),
    });
  };

  const handleSelectDemo = (demo) => {
    setData({
      email: demo.email,
      password: 'password',
      remember: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F5F9] flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Top Header Controls */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E2DC] hover:border-[#1A1A5E]/30 rounded-xl text-xs font-bold text-[#1A1A5E] shadow-sm transition-all duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC800]/15 text-[#1A1A5E] border border-[#FFC800]/40 rounded-full text-[11px] font-black">
          <Sparkles className="w-3.5 h-3.5 text-[#E6B400]" />
          Portal Autentikasi HARMONITAS
        </span>
      </div>

      {/* Main Card Bento Container */}
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#E2E2DC] shadow-[0_20px_60px_rgba(26,26,94,0.08)] overflow-hidden">
        {/* Header Branding Navy Blue (#2C3154) */}
        <div className="relative bg-[#2C3154] text-white p-7 text-center border-b border-[#383F6A] overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FFC800]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#383F6A] rounded-full blur-xl pointer-events-none" />

          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-md overflow-hidden shrink-0 border-2 border-[#FFC800]">
            <img src={logoHarmonitas} alt="Logo Harmonitas" className="w-full h-full object-contain p-1" />
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold mb-1 border border-white/10">
            <span>Kantor Wilayah Kementerian Hukum Riau</span>
          </div>

          <h2 className="text-2xl font-black tracking-wider text-white">
            HARMONITAS
          </h2>
          <p className="text-xs text-[#FFC800] font-black mt-0.5 tracking-wide">
            Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas
          </p>
        </div>

        {/* Flash Notifications */}
        {flash?.success && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>{flash.success}</p>
          </div>
        )}

        {flash?.info && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-blue-800 text-xs font-bold">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p>{flash.info}</p>
          </div>
        )}

        {flash?.error && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-bold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>{flash.error}</p>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Google OAuth Login Button */}
          <div>
            <a
              href="/auth/google/redirect"
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-black text-xs flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              {/* Google SVG Logo */}
              <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Masuk Cepat dengan Akun Google</span>
            </a>
            <p className="text-[10px] text-center text-slate-400 font-semibold mt-1.5">
              Gunakan akun Google kedinasan yang telah terdaftar di sistem.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Atau masuk manual
            </span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                Alamat Email Kedinasan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="nama@harmonitas.go.id"
                  className={`w-full pl-10 pr-4 py-3 bg-[#F8F8F5] border rounded-xl text-xs font-bold text-[#1A1A5E] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800] focus:border-transparent transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/50' : 'border-[#E2E2DC]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-extrabold text-[#1A1A5E]">
                  Kata Sandi / Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className={`w-full pl-10 pr-10 py-3 bg-[#F8F8F5] border rounded-xl text-xs font-bold text-[#1A1A5E] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800] focus:border-transparent transition-all ${
                    errors.password ? 'border-rose-400 bg-rose-50/50' : 'border-[#E2E2DC]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#1A1A5E] transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#1A1A5E] focus:ring-[#FFC800] accent-[#1A1A5E] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#3D3D3A]">Ingat Sesi Saya (Remember Me)</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFE082] hover:to-[#FFC107] text-[#1A1A5E] font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{processing ? 'Memverifikasi...' : 'Masuk ke Sistem HARMONITAS'}</span>
            </button>

            {/* Demo Users Quick Selector */}
            {demoUsers.length > 0 && (
              <div className="pt-5 mt-2 border-t border-[#E2E2DC]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-black text-[#1A1A5E] uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#E6B400]" />
                    Pilih Akun Demo Cepat (1-Klik)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                    Password: password
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {demoUsers.map((demo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDemo(demo)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                        data.email === demo.email 
                          ? 'border-[#1A1A5E] bg-[#1A1A5E]/5 ring-2 ring-[#FFC800]/50' 
                          : 'border-[#E2E2DC] bg-[#F8F8F5] hover:bg-white hover:border-[#1A1A5E]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          demo.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          (demo.role === 'TIM_KERJA' || demo.role === 'POKJA') ? 'bg-blue-100 text-blue-800' :
                          demo.role === 'BIRO_HUKUM' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {demo.role}
                        </span>
                        {data.email === demo.email && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A5E]" />
                        )}
                      </div>
                      <p className="text-xs font-black text-[#1A1A5E] mt-1 truncate">
                        {demo.name}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500 truncate">
                        {demo.email}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3.5 bg-[#F8F8F5] border-t border-[#E2E2DC] text-center text-[10px] text-slate-500 font-bold flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sistem Informasi Terenkripsi • Kanwil Kemenkumham Provinsi Riau</span>
=======
import { router } from '@inertiajs/react';
import { ArrowLeft, Lock, LogIn, ShieldCheck, Sparkles, User } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MOCK_USERS, ROLES } from '../mock/mockUsers';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';

export const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES.PROJA_1);
  const [username, setUsername] = useState('operator.riau');
  const [password, setPassword] = useState('••••••••');

  const { login } = useAuth();
  const { showToast } = useToast();

  const handleRoleChange = (event) => {
    const roleValue = event.target.value;
    setSelectedRole(roleValue);

    const matchedUser = MOCK_USERS.find((user) => user.role === roleValue);
    if (matchedUser) {
      setUsername(matchedUser.email.split('@')[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(selectedRole);
    showToast(`Berhasil masuk sebagai ${selectedRole}`, 'success');
    router.visit('/home');
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case ROLES.PROJA_1:
      case ROLES.PROJA_2:
      case ROLES.PROJA_3:
        return 'Akses input permohonan dan penyusunan Surat Hasil Harmonisasi wilayah Riau.';
      case ROLES.KAKANWIL:
        return 'Akses pemantauan eksekutif dan pengawasan seluruh berkas permohonan Riau.';
      case ROLES.KADIV:
        return 'Akses verifikasi Divisi P3H dan evaluasi permohonan.';
      case ROLES.BIRO_HUKUM:
        return 'Akses pemeriksaan tingkat provinsi dan pengunggahan Surat Hasil Fasilitasi.';
      default:
        return '';
    }
  };

  return (
    <div className="login-legal-bg min-h-screen overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => router.visit('/')}
        className="absolute left-4 top-5 z-20 inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition-colors hover:bg-white/15 sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Beranda
      </button>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-12rem)] max-w-7xl items-center justify-center">
        <div className="w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_30px_80px_rgba(5,12,49,0.35)]">
          <div className="px-6 pb-5 pt-8 text-center sm:px-10 sm:pt-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[22px] border border-[#E2E6EF] bg-white p-2 shadow-[0_12px_28px_rgba(30,39,89,0.13)]">
              <img
                src={logoHarmonitas}
                alt="Logo HARMONITAS"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              <p className="text-lg font-extrabold tracking-[0.08em] text-[#303661]">HARMONITAS</p>
              <span className="rounded-full bg-[#EEF1F8] px-2 py-0.5 text-[9px] font-extrabold text-[#6473B5]">Provinsi Riau</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#232638] sm:text-[34px]">
              Masuk ke Dashboard
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-xs font-medium leading-5 text-[#73798A]">
              Gunakan akun petugas yang telah terdaftar untuk mengakses layanan HARMONITAS.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-7 sm:px-10 sm:pb-9">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="username" className="mb-1.5 block text-xs font-bold text-[#30384A]">
                  Username Petugas
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#9AA1B1]">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Masukkan username"
                    className="bento-input px-3 py-2.5 pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-bold text-[#30384A]">
                  Kata Sandi
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#9AA1B1]">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="bento-input px-3 py-2.5 pl-10 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[#EDF0F5] pt-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="role" className="flex items-center gap-2 text-xs font-bold text-[#30384A]">
                  <ShieldCheck className="h-4 w-4 text-[#3269D8]" />
                  Simulasi Hak Akses
                </label>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#FFE1A9] bg-[#FFF8E9] px-2.5 py-1 text-[9px] font-bold text-[#B56A00]">
                  <Sparkles className="h-3 w-3" />
                  Tanpa Backend
                </span>
              </div>

              <select
                id="role"
                value={selectedRole}
                onChange={handleRoleChange}
                className="bento-input cursor-pointer px-3 py-2.5 text-xs font-semibold"
              >
                {Object.values(ROLES).map((roleName) => (
                  <option key={roleName} value={roleName}>
                    {roleName}
                  </option>
                ))}
              </select>

              <div className="mt-3 rounded-xl border border-[#DDE5F3] bg-[#F5F8FE] px-3.5 py-3 text-[10px] font-medium leading-5 text-[#606A7E]">
                <span className="font-bold text-[#303661]">Keterangan akses:</span>{' '}
                {getRoleDescription(selectedRole)}
              </div>
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#303661] to-[#454C7D] px-4 text-xs font-bold text-white shadow-[0_10px_22px_rgba(48,54,97,0.24)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(48,54,97,0.3)]"
            >
              <LogIn className="h-4 w-4" />
              Masuk ke Dashboard
            </button>

            <p className="text-center text-[10px] font-medium text-[#98A0B1]">
              Autentikasi aman untuk pengguna resmi HARMONITAS.
            </p>
          </form>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
