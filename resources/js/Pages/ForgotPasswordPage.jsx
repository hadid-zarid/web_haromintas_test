import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
  Mail,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Send
} from 'lucide-react';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';

export const ForgotPasswordPage = () => {
  const { flash } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F9] flex flex-col justify-center items-center p-4 sm:p-6">
      <Head title="Lupa Kata Sandi - HARMONITAS" />

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
          Pemulihan Kata Sandi Akun
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
            Lupa Kata Sandi Akun?
          </h2>
          <p className="text-xs text-[#FFC800] font-bold mt-1 tracking-wide">
            Masukkan email kedinasan Anda untuk menerima tautan pemulihan kata sandi
          </p>
        </div>

        {/* Flash Notifications */}
        {flash?.success && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div dangerouslySetInnerHTML={{ __html: flash.success }} />
          </div>
        )}

        {flash?.error && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-bold shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>{flash.error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 sm:p-8 space-y-5">
          <p className="text-xs text-[#3D3D3A]/80 font-medium leading-relaxed">
            Sistem akan mengirimkan pesan berisi tautan khusus ke email kedinasan Anda. Klik tombol di dalam email tersebut untuk melanjutkan ke tahap pembuatan kata sandi baru.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                Alamat Email Kedinasan Terdaftar <span className="text-rose-500">*</span>
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

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFE082] hover:to-[#FFC107] text-[#1A1A5E] font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{processing ? 'Memproses...' : 'Lanjutkan Reset Password'}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center">
            <Link
              href="/login"
              className="text-xs font-bold text-[#1A1A5E] hover:underline"
            >
              Sudah ingat kata sandi Anda? Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
