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
  ShieldCheck,
  Check
} from 'lucide-react';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';
import logoPengayoman from '../assets/logo_pengayoman.png';

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
    <div className="min-h-screen w-full bg-white relative flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden antialiased font-sans">
      <Head title="Pemulihan Kata Sandi Baru - HARMONITAS" />

      {/* Background Layer 1: Structured Micro Grid with Slow Subtle Drift Animation */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] animate-hero-grid"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2B3056 1px, transparent 1px),
            linear-gradient(to bottom, #2B3056 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Background Layer 2: Subtle Ambient Warmth */}
      <div
        className="absolute -top-16 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl animate-hero-glow-1"
        style={{
          background: "radial-gradient(circle, rgba(255, 216, 43, 0.14) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />
      <div
        className="absolute -bottom-16 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-30 blur-3xl animate-hero-glow-2"
        style={{
          background: "radial-gradient(circle, rgba(43, 48, 86, 0.10) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      {/* Top Header Navigation Controls */}
      <div className="w-full max-w-lg mb-3 flex items-center justify-between z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 hover:bg-white border border-slate-200 hover:border-[#2B3056]/30 rounded-xl text-xs font-bold text-[#2B3056] shadow-2xs transition-all duration-150 backdrop-blur-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#2B3056]" />
          <span>Kembali ke Login</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF9DF] text-[#2B3056] border border-[#FFD82B]/60 rounded-md text-[10px] font-bold shadow-2xs">
          <KeyRound className="w-3 h-3 text-[#B3912D]" />
          Buat Kata Sandi Baru
        </span>
      </div>

      {/* Main Bento Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden backdrop-blur-sm z-10">
        
        {/* Header Branding Navy Blue (#2B3056) - Sleek & Compact */}
        <div className="relative bg-[#2B3056] text-white py-5 px-6 sm:py-6 sm:px-7 text-center border-b border-[#3A4070] overflow-hidden">
          <div 
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-xl pointer-events-none opacity-25"
            style={{ background: 'radial-gradient(circle, #FFC800 0%, transparent 70%)' }}
          />

          {/* Logo HARMONITAS (Clear & High Contrast in Frosted White Rounded-xl Badge) */}
          <div className="relative mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/95 border border-white/30 shadow-sm flex items-center justify-center mb-2.5 p-1.5 shrink-0">
            <img src={logoHarmonitas} alt="Logo HARMONITAS" className="w-full h-full object-contain" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] font-bold mb-1 border border-white/15 shadow-2xs">
            <img src={logoPengayoman} alt="Pengayoman" className="h-3.5 w-3.5 object-contain" />
            <span>Kantor Wilayah Kementerian Hukum Riau</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-white">
            Atur Kata Sandi Baru
          </h2>
          <p className="text-[11px] text-[#FFD82B] font-medium mt-0.5 tracking-wide">
            Masukkan kata sandi baru yang memenuhi standar keamanan akun dinas
          </p>
        </div>

        {/* Flash Notifications */}
        {flash?.error && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-semibold shadow-xs">
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
              <label className="block text-xs font-bold text-[#2B3056] mb-1.5">
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-semibold text-[#2B3056] focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Baru Input */}
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1.5">
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
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50/70 border rounded-2xl text-xs font-semibold text-[#2B3056] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2B3056]/10 focus:border-[#2B3056] transition-all ${
                    errors.password ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#2B3056] transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Real-Time Password Security Checklist */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className={`flex items-center gap-1.5 font-semibold transition-colors ${passwordRules.hasLower ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${passwordRules.hasLower ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span>Minimal satu huruf kecil</span>
              </div>

              <div className={`flex items-center gap-1.5 font-semibold transition-colors ${passwordRules.hasUpper ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${passwordRules.hasUpper ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span>Minimal satu huruf besar</span>
              </div>

              <div className={`flex items-center gap-1.5 font-semibold transition-colors ${passwordRules.hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${passwordRules.hasNumber ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span>Minimal satu angka</span>
              </div>

              <div className={`flex items-center gap-1.5 font-semibold transition-colors ${passwordRules.hasSpecial ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${passwordRules.hasSpecial ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span>Minimal satu karakter spesial</span>
              </div>

              <div className={`flex items-center gap-1.5 font-semibold sm:col-span-2 transition-colors ${passwordRules.hasMinLen ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${passwordRules.hasMinLen ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                <span>Minimal 8 karakter</span>
              </div>
            </div>

            {/* Konfirmasi Password Baru Input */}
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1.5">
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
                  className="w-full pl-10 pr-10 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-semibold text-[#2B3056] placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2B3056]/10 focus:border-[#2B3056] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#2B3056] transition cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 text-[#2B3056] font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-[#2B3056]" />
              <span>{processing ? 'Menyimpan Kata Sandi...' : 'Simpan Kata Sandi Baru'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
