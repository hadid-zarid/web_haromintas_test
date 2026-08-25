import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
  Lock,
  Mail,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';

export const ResetPasswordPage = ({ token, email }) => {
  const { flash } = usePage().props;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    token: token || '',
    email: email || '',
    password: '',
    password_confirmation: '',
  });

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

  const passwordRules = getPasswordRules(data.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/reset-password');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F9] flex flex-col justify-center items-center p-4 sm:p-6">
      <Head title="Pemulihan Kata Sandi Baru - HARMONITAS" />

      {/* Top Header Controls */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E2DC] hover:border-[#1A1A5E]/30 rounded-xl text-xs font-bold text-[#1A1A5E] shadow-sm transition-all duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Login</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC800]/15 text-[#1A1A5E] border border-[#FFC800]/40 rounded-full text-[11px] font-black">
          <KeyRound className="w-3.5 h-3.5 text-[#E6B400]" />
          Buat Kata Sandi Baru
        </span>
      </div>

      {/* Main Bento Card */}
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

          <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white">
            Atur Kata Sandi Baru
          </h2>
          <p className="text-xs text-[#FFC800] font-bold mt-1 tracking-wide">
            Masukkan kata sandi baru yang memenuhi standar keamanan akun dinas
          </p>
        </div>

        {/* Flash Notifications */}
        {flash?.error && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-bold shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>{flash.error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden Input Token */}
            <input type="hidden" value={data.token} />

            {/* Email Input (ReadOnly / Disabled) */}
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
                  className="w-full pl-10 pr-4 py-3 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Baru Input */}
            <div>
              <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Masukkan kata sandi baru"
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

            {/* Real-Time Password Security Checklist */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className={`flex items-center gap-1.5 font-bold transition-colors ${passwordRules.hasLower ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${passwordRules.hasLower ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span>Minimal satu huruf kecil</span>
              </div>

              <div className={`flex items-center gap-1.5 font-bold transition-colors ${passwordRules.hasUpper ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${passwordRules.hasUpper ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span>Minimal satu huruf besar</span>
              </div>

              <div className={`flex items-center gap-1.5 font-bold transition-colors ${passwordRules.hasNumber ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${passwordRules.hasNumber ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span>Minimal satu angka</span>
              </div>

              <div className={`flex items-center gap-1.5 font-bold transition-colors ${passwordRules.hasSpecial ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${passwordRules.hasSpecial ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span>Minimal satu karakter spesial</span>
              </div>

              <div className={`flex items-center gap-1.5 font-bold sm:col-span-2 transition-colors ${passwordRules.hasMinLen ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${passwordRules.hasMinLen ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span>Minimal 8 karakter</span>
              </div>
            </div>

            {/* Konfirmasi Password Baru Input */}
            <div>
              <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full pl-10 pr-10 py-3 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#1A1A5E] transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#1A1A5E] hover:bg-[#2C3154] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-[#FFC800]" />
              <span>{processing ? 'Menyimpan Kata Sandi...' : 'Simpan Kata Sandi Baru'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
