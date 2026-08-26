import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building2, 
  IdCard, 
  ArrowLeft, 
  UserPlus, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';

export const RegisterPage = ({ pokjas = [], wilayahs = [] }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    nip: '',
    jabatan: '',
    no_hp: '',
    role: 'BIRO_HUKUM',
    pokja_id: pokjas[0]?.id || '',
    wilayah_id: wilayahs[0]?.id || '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F9] flex flex-col justify-center items-center p-4 sm:p-6 py-10">
      {/* Top Header Controls */}
      <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E2E2DC] hover:border-[#1A1A5E]/30 rounded-xl text-xs font-bold text-[#1A1A5E] shadow-sm transition-all duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Masuk</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFC800]/15 text-[#1A1A5E] border border-[#FFC800]/40 rounded-full text-[11px] font-black">
          <Sparkles className="w-3.5 h-3.5 text-[#E6B400]" />
          Registrasi Pengguna Baru
        </span>
      </div>

      {/* Main Card Bento */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#E2E2DC] shadow-[0_20px_60px_rgba(26,26,94,0.08)] overflow-hidden">
        {/* Header Branding */}
        <div className="relative bg-[#2C3154] text-white p-7 text-center border-b border-[#383F6A] overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFC800]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative mx-auto w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-md overflow-hidden shrink-0 border-2 border-[#FFC800]">
            <img src={logoHarmonitas} alt="Logo Harmonitas" className="w-full h-full object-contain p-1" />
          </div>

          <h2 className="text-2xl font-black tracking-wider text-white">
            Pendaftaran Akun HARMONITAS
          </h2>
          <p className="text-xs text-[#FFC800] font-black mt-1 tracking-wide">
            Kantor Wilayah Kementerian Hukum Provinsi Riau
          </p>
          <p className="text-[11px] text-slate-200 font-medium mt-1">
            Lengkapi formulir di bawah ini untuk mendaftarkan akun dinas baru.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {/* Section 1: Identitas Pegawai */}
          <div>
            <h3 className="text-xs font-black text-[#1A1A5E] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <IdCard className="w-4 h-4 text-[#E6B400]" />
              1. Identitas & Data Pegawai
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                  Nama Lengkap (beserta Gelar) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Contoh: Ahmad Subandi, S.H."
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800] ${
                      errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-[#E2E2DC]'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.name}</p>
                )}
              </div>

              {/* NIP */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                  Nomor Induk Pegawai (NIP)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <IdCard className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    maxLength={18}
                    value={data.nip}
                    onChange={(e) => setData('nip', e.target.value.replace(/\D/g, '').slice(0, 18))}
                    placeholder="Contoh: 198503122010121002 (18 digit)"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                </div>
                {errors.nip && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.nip}</p>
                )}
              </div>

              {/* Jabatan */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                  Jabatan Kedinasan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={data.jabatan}
                    onChange={(e) => setData('jabatan', e.target.value)}
                    placeholder="Contoh: Perancang Peraturan Ahli Muda"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                </div>
                {errors.jabatan && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.jabatan}</p>
                )}
              </div>

              {/* No HP / WhatsApp */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                  Nomor HP / WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    maxLength={13}
                    value={data.no_hp}
                    onChange={(e) => setData('no_hp', e.target.value.replace(/\D/g, '').slice(0, 13))}
                    placeholder="Contoh: 081234567890 (Maks. 13 digit)"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  />
                </div>
                {errors.no_hp && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.no_hp}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Penugasan & Peran */}
          <div className="pt-2">
            <h3 className="text-xs font-black text-[#1A1A5E] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-[#E6B400]" />
              2. Unit Kerja & Peran Hak Akses
            </h3>

            {/* Role Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setData('role', 'BIRO_HUKUM')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  data.role === 'BIRO_HUKUM'
                    ? 'border-[#1A1A5E] bg-[#1A1A5E]/5 ring-2 ring-[#FFC800]'
                    : 'border-[#E2E2DC] bg-[#F8F8F5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Biro / Bagian Hukum
                  </span>
                  {data.role === 'BIRO_HUKUM' && <CheckCircle2 className="w-4 h-4 text-[#1A1A5E]" />}
                </div>
                <p className="text-xs font-black text-[#1A1A5E] mt-1.5">
                  Pemerintah Daerah (Prov/Kab/Kota)
                </p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Untuk pejabat & staf bagian hukum 13 wilayah se-Riau.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setData('role', 'POKJA')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  data.role === 'POKJA'
                    ? 'border-[#1A1A5E] bg-[#1A1A5E]/5 ring-2 ring-[#FFC800]'
                    : 'border-[#E2E2DC] bg-[#F8F8F5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Tim Pokja Kanwil
                  </span>
                  {data.role === 'POKJA' && <CheckCircle2 className="w-4 h-4 text-[#1A1A5E]" />}
                </div>
                <p className="text-xs font-black text-[#1A1A5E] mt-1.5">
                  Kanwil Kemenkumham Riau
                </p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Untuk perancang peraturan zonasi Pokja 1, 2, dan 3.
                </p>
              </button>
            </div>

            {/* Conditional Dropdown */}
            {data.role === 'BIRO_HUKUM' && (
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                  Pilih Entitas Pemerintah Daerah <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={data.wilayah_id}
                  onChange={(e) => setData('wilayah_id', e.target.value)}
                  className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                >
                  <option value="">-- Pilih Wilayah Pemda --</option>
                  {wilayahs.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.nama_wilayah} ({w.jenis_wilayah})
                    </option>
                  ))}
                </select>
                {errors.wilayah_id && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.wilayah_id}</p>
                )}
              </div>
            )}

            {data.role === 'POKJA' && (
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                  Pilih Tim Pokja Kanwil Riau <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={data.pokja_id}
                  onChange={(e) => setData('pokja_id', e.target.value)}
                  className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                >
                  <option value="">-- Pilih Pokja --</option>
                  {pokjas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama_pokja} - ({p.keterangan})
                    </option>
                  ))}
                </select>
                {errors.pokja_id && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.pokja_id}</p>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Akun & Keamanan */}
          <div className="pt-2">
            <h3 className="text-xs font-black text-[#1A1A5E] uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Lock className="w-4 h-4 text-[#E6B400]" />
              3. Akun & Kredensial Masuk
            </h3>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                  Email Kedinasan (Username Login) <span className="text-rose-500">*</span>
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
                    placeholder="nama.pegawai@riau.go.id atau @kemenkumham.go.id"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800] ${
                      errors.email ? 'border-rose-400 bg-rose-50/50' : 'border-[#E2E2DC]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                    Kata Sandi <span className="text-rose-500">*</span>
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
                      placeholder="Minimal 8 karakter"
                      className={`w-full pl-10 pr-10 py-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800] ${
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
                    <p className="mt-1 text-xs text-rose-600 font-bold">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1.5">
                    Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
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
                      placeholder="Ulangi kata sandi"
                      className={`w-full pl-10 pr-10 py-2.5 bg-[#F8F8F5] border rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800] ${
                        errors.password_confirmation ? 'border-rose-400 bg-rose-50/50' : 'border-[#E2E2DC]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#1A1A5E] transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-1 text-xs text-rose-600 font-bold">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFE082] hover:to-[#FFC107] text-[#1A1A5E] font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{processing ? 'Mendaftarkan Akun...' : 'Daftarkan Akun Petugas'}</span>
            </button>
          </div>

          {/* Link back to login */}
          <div className="text-center pt-2">
            <p className="text-xs font-bold text-slate-600">
              Sudah memiliki akun terdaftar?{' '}
              <Link href="/login" className="text-[#1A1A5E] font-black hover:underline">
                Masuk ke Dashboard
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F8F8F5] border-t border-[#E2E2DC] text-center text-[10px] text-slate-500 font-bold flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verifikasi Akun Terenkripsi • Kanwil Kemenkumham Riau</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
