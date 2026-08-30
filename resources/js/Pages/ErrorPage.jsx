import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  FileQuestion,
  ShieldAlert,
  ServerCrash,
  Lock,
  Clock,
  RefreshCw,
  ArrowLeft,
  Home,
  FileText,
  BookOpen,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Compass,
  AlertTriangle,
  Flame,
  Activity
} from 'lucide-react';
import LogoPengayoman from '../components/common/LogoPengayoman';

const ERROR_CONFIGS = {
  404: {
    code: '404',
    badge: 'Halaman Tidak Ditemukan',
    title: 'Halaman yang Anda Cari Tidak Ditemukan',
    description:
      'Tautan atau berkas regulasi yang Anda tuju mungkin salah ketik, telah dipindahkan ke arsip lain, atau sudah tidak tersedia di sistem HARMONITAS.',
    icon: FileQuestion,
    accentColor: 'from-[#FFD82B] to-[#FFB943]',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-400/10 text-[#FFD82B] border-amber-400/20',
    solutions: [
      'Periksa kembali penulisan alamat URL pada bilah peramban Anda.',
      'Gunakan fitur pencarian pada menu Berkas Permohonan Regulasi.',
      'Kembali ke Beranda atau halaman navigasi sebelumnya.'
    ]
  },
  403: {
    code: '403',
    badge: 'Akses Dibatasi / Ditolak',
    title: 'Hak Akses Tidak Mencukupi',
    description:
      'Akun Anda tidak memiliki wewenang atau hak akses untuk membuka halaman/dokumen ini. Beberapa fitur dibatasi khusus untuk peran tertentu (Tim Kerja, Biro Hukum, atau Administrator).',
    icon: ShieldAlert,
    accentColor: 'from-rose-400 to-rose-600',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    solutions: [
      'Pastikan Anda telah masuk (login) dengan akun yang memiliki peran sesuai.',
      'Fitur Draft Generate Surat hanya dapat diakses oleh role Tim Kerja.',
      'Hubungi Administrator Kanwil Kemenkumham Riau jika memerlukan eskalasi peran.'
    ]
  },
  401: {
    code: '401',
    badge: 'Autentikasi Diperlukan',
    title: 'Sesi Belum Terautentikasi',
    description:
      'Anda harus masuk terlebih dahulu dengan akun resmi untuk mengakses layanan dan informasi regulasi terintegrasi.',
    icon: Lock,
    accentColor: 'from-blue-400 to-indigo-500',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    solutions: [
      'Klik tombol Masuk / Login untuk melanjutkan autentikasi.',
      'Gunakan kredensial resmi Kanwil Kemenkumham atau SSO Google yang terdaftar.',
      'Jika lupa kata sandi, gunakan layanan Reset Password.'
    ]
  },
  419: {
    code: '419',
    badge: 'Sesi Keamanan Kedaluwarsa',
    title: 'Token Sesi Formulir Telah Habis',
    description:
      'Sesi keamanan (CSRF Token) halaman Anda telah berakhir karena tidak ada aktivitas dalam beberapa waktu demi menjaga keamanan data Anda.',
    icon: Clock,
    accentColor: 'from-amber-400 to-orange-500',
    badgeBg: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    solutions: [
      'Muat ulang halaman ini untuk memperbarui token keamanan.',
      'Kirim ulang formulir Anda setelah halaman berhasil disegarkan.',
      'Masuk kembali jika sesi login Anda telah berakhir.'
    ]
  },
  429: {
    code: '429',
    badge: 'Batas Permintaan Terlampaui',
    title: 'Terlalu Banyak Permintaan (Rate Limit)',
    description:
      'Sistem mendeteksi aktivitas pengiriman permintaan yang terlalu cepat dari perangkat Anda untuk menjaga stabilitas dan keamanan server.',
    icon: Activity,
    accentColor: 'from-orange-400 to-rose-500',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    solutions: [
      'Mohon jeda sejenak (sekitar 1-2 menit) sebelum mencoba kembali.',
      'Hindari menekan tombol formulir secara berulang-ulang dengan cepat.',
      'Muat ulang halaman jika waktu tunggu telah selesai.'
    ]
  },
  500: {
    code: '500',
    badge: 'Gangguan Internal Server',
    title: 'Terjadi Kendala Teknis pada Server',
    description:
      'Sistem mengalami kesalahan pemrosesan tak terduga saat memuat data. Tim teknis HARMONITAS telah mencatat galat ini untuk segera ditangani.',
    icon: ServerCrash,
    accentColor: 'from-red-500 to-rose-600',
    badgeBg: 'bg-red-500/10 text-red-300 border-red-500/30',
    iconBg: 'bg-red-500/10 text-red-400 border-red-500/20',
    solutions: [
      'Coba muat ulang halaman dalam beberapa saat.',
      'Kembali ke halaman Beranda untuk mengakses fitur lainnya.',
      'Laporkan rincian masalah ke tim pengelola sistem jika kendala berlanjut.'
    ]
  },
  503: {
    code: '503',
    badge: 'Sistem Dalam Pemeliharaan',
    title: 'Layanan Sedang Ditingkatkan',
    description:
      'Platform HARMONITAS Kanwil Kemenkumham Riau sedang dalam proses pemeliharaan rutin atau peningkatan kapasitas infrastruktur server.',
    icon: Flame,
    accentColor: 'from-amber-400 to-yellow-500',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
    solutions: [
      'Sistem akan segera kembali aktif dalam beberapa waktu ke depan.',
      'Silakan cek kembali secara berkala.',
      'Terima kasih atas pengertian dan kesabaran Anda.'
    ]
  },
  502: {
    code: '502',
    badge: 'Koneksi Server Terputus',
    title: 'Gerbang Server Tidak Merespons (Bad Gateway)',
    description:
      'Server perantara tidak menerima respons valid dari layanan utama saat memproses permintaan Anda.',
    icon: AlertTriangle,
    accentColor: 'from-amber-500 to-rose-500',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    solutions: [
      'Periksa kestabilan koneksi internet Anda.',
      'Muat ulang halaman untuk mengirim ulang permintaan.',
      'Coba kembali dalam 1-2 menit.'
    ]
  },
  504: {
    code: '504',
    badge: 'Batas Waktu Terlampaui',
    title: 'Batas Waktu Permintaan Server (Gateway Timeout)',
    description:
      'Proses memakan waktu lebih lama dari batas normal server saat mengambil atau mengolah data regulasi daerah.',
    icon: Clock,
    accentColor: 'from-amber-500 to-rose-500',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    solutions: [
      'Muat ulang halaman atau coba kembali beberapa saat lagi.',
      'Pastikan koneksi jaringan Anda dalam kondisi optimal.'
    ]
  }
};

const DEFAULT_CONFIG = {
  code: 'Error',
  badge: 'Terjadi Kendala Sistem',
  title: 'Terjadi Kesalahan yang Tidak Terduga',
  description:
    'Permintaan Anda tidak dapat diproses secara sempurna oleh sistem aplikasi saat ini.',
  icon: AlertTriangle,
  accentColor: 'from-amber-400 to-rose-500',
  badgeBg: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  iconBg: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  solutions: [
    'Muat ulang halaman untuk mencoba kembali.',
    'Kembali ke halaman utama untuk melanjutkan pekerjaan Anda.'
  ]
};

export default function ErrorPage({ status, message, debug }) {
  const { auth } = usePage().props || {};
  const user = auth?.user;
  const [showTechnical, setShowTechnical] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const statusCode = Number(status) || 404;
  const config = ERROR_CONFIGS[statusCode] || DEFAULT_CONFIG;
  const IconComponent = config.icon;

  const handleReload = () => {
    setIsReloading(true);
    window.location.reload();
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = user ? '/home' : '/';
    }
  };

  const handleCopyDebug = () => {
    const info = `[HARMONITAS ERROR REPORT]
Status: ${statusCode} (${config.badge})
Title: ${config.title}
Message: ${message || config.description}
URL: ${typeof window !== 'undefined' ? window.location.href : '-'}
Time: ${new Date().toISOString()}
User: ${user ? `${user.nama || user.name} (${user.role || 'USER'})` : 'Guest'}
${debug ? `Debug Details: ${JSON.stringify(debug, null, 2)}` : ''}`;

    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <Head title={`${statusCode} - ${config.badge} | HARMONITAS`} />

      <div className="min-h-screen bg-[#101B4F] text-slate-100 flex flex-col justify-between selection:bg-[#FFD82B] selection:text-[#101B4F] relative overflow-hidden font-sans">
        {/* Background Ambient Glow & Grid Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}
          />

          {/* Primary Navy Radial Glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#3A4070]/30 rounded-full blur-[120px]" />

          {/* Golden Corner Accents */}
          <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#FFD82B]/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2B3056]/50 rounded-full blur-[100px]" />
        </div>

        {/* Top Header Bar */}
        <header className="relative z-10 border-b border-white/10 bg-[#101B4F]/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            {/* Brand Logo & Title */}
            <Link
              href={user ? '/home' : '/'}
              className="flex items-center gap-3.5 group cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/20 p-1 flex items-center justify-center shadow-md group-hover:border-[#FFD82B]/60 transition-all duration-300">
                  <img
                    src="/LOGO HARMONITAS.png"
                    alt="Logo HARMONITAS"
                    className="w-full h-full object-contain drop-shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-extrabold tracking-wider text-white group-hover:text-[#FFD82B] transition-colors">
                    HARMONITAS
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FFD82B] text-[#101B4F] uppercase tracking-wider">
                    Kanwil Riau
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium hidden sm:block">
                  Harmonisasi Ranperda & Ranperkada Terpadu
                </p>
              </div>
            </Link>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/panduan"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#FFD82B]" />
                <span className="hidden sm:inline">Buku Panduan</span>
              </Link>

              {user ? (
                <Link
                  href="/home"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 text-[#101B4F] text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 text-[#101B4F] text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  <span>Masuk Akun</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Error Content Area */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="max-w-3xl w-full text-center">
            
            {/* Status Code Large Visual Indicator */}
            <div className="relative inline-flex items-center justify-center mb-6 sm:mb-8">
              {/* Outer Glowing Rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFD82B]/20 to-transparent blur-2xl animate-pulse" />

              <div className="relative flex flex-col items-center">
                {/* Large 3D Gradient Text for Error Code */}
                <div className="relative">
                  <span className="text-7xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400/30 drop-shadow-2xl select-none leading-none">
                    {statusCode}
                  </span>

                  {/* Floating Icon Floating at Top Right */}
                  <div
                    className={`absolute -top-3 -right-4 sm:-top-4 sm:-right-6 p-2.5 sm:p-3 rounded-2xl border shadow-xl backdrop-blur-md ${config.iconBg} animate-bounce`}
                    style={{ animationDuration: '3s' }}
                  >
                    <IconComponent className="w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                </div>

                {/* Status Pill Badge */}
                <div
                  className={`mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider backdrop-blur-md ${config.badgeBg}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  <span>{config.badge}</span>
                </div>
              </div>
            </div>

            {/* Error Headlines & Explanations */}
            <div className="space-y-3 mb-8 sm:mb-10 max-w-xl mx-auto">
              <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {config.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                {message || config.description}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
              <button
                type="button"
                onClick={handleGoBack}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all duration-200 cursor-pointer shadow-sm hover:border-white/40"
              >
                <ArrowLeft className="w-4 h-4 text-slate-300" />
                <span>Halaman Sebelumnya</span>
              </button>

              <Link
                href={user ? '/home' : '/'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:from-[#FFE082] hover:to-[#FFC107] active:scale-95 text-xs sm:text-sm font-extrabold text-[#101B4F] transition-all duration-200 cursor-pointer shadow-lg shadow-[#FFD82B]/20"
              >
                <Home className="w-4 h-4 text-[#101B4F]" />
                <span>{user ? 'Kembali ke Beranda' : 'Ke Halaman Utama'}</span>
              </Link>

              <button
                type="button"
                onClick={handleReload}
                disabled={isReloading}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
                title="Muat Ulang Halaman"
              >
                <RefreshCw
                  className={`w-4 h-4 text-[#FFD82B] ${
                    isReloading ? 'animate-spin' : ''
                  }`}
                />
                <span className="hidden sm:inline">Segarkan</span>
              </button>
            </div>

            {/* Helpful Solution Recommendations Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5 sm:p-6 text-left max-w-2xl mx-auto shadow-xl">
              <div className="flex items-center gap-2 text-[#FFD82B] mb-3">
                <Compass className="w-4 h-4" />
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100">
                  Langkah yang Dapat Anda Lakukan
                </h2>
              </div>

              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-300">
                {config.solutions.map((sol, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFD82B]/10 text-[#FFD82B] text-[10px] font-bold mt-0.5 border border-[#FFD82B]/20">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{sol}</span>
                  </li>
                ))}
              </ul>

              {/* Quick Jump Links inside app */}
              <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <Link
                  href="/peraturan"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-200 transition-colors group cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#FFD82B] shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-white text-[11px]">Daftar Berkas</p>
                    <p className="text-[10px] text-slate-400">Rancangan Regulasi</p>
                  </div>
                </Link>

                <Link
                  href="/ai"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-200 transition-colors group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#FFD82B] shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-white text-[11px]">Asisten AI</p>
                    <p className="text-[10px] text-slate-400">Analisis Regulasi</p>
                  </div>
                </Link>

                <Link
                  href="/panduan"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-200 transition-colors group cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#FFD82B] shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-white text-[11px]">Panduan SOP</p>
                    <p className="text-[10px] text-slate-400">Buku Petunjuk</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Technical Details Toggle (For IT Admin / Developers / Troubleshooting) */}
            <div className="mt-6 max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => setShowTechnical(!showTechnical)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-[#FFD82B] transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  {showTechnical
                    ? 'Sembunyikan Informasi Teknis'
                    : 'Tampilkan Informasi Diagnostik Teknis'}
                </span>
                {showTechnical ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showTechnical && (
                <div className="mt-3 p-4 rounded-xl bg-slate-900/90 border border-white/10 text-left font-mono text-[11px] space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Detail Galat Sistem
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyDebug}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-300" />
                          <span>Salin Laporan</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-500">Status Code: </span>
                      <span className="text-[#FFD82B] font-bold">{statusCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Timestamp: </span>
                      <span>{new Date().toLocaleString('id-ID')}</span>
                    </div>
                    <div className="sm:col-span-2 truncate">
                      <span className="text-slate-500">Path: </span>
                      <span>
                        {typeof window !== 'undefined'
                          ? window.location.pathname
                          : '-'}
                      </span>
                    </div>
                    {user && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-500">User Session: </span>
                        <span>
                          {user.nama || user.name} [{user.role || 'ROLE'}]
                        </span>
                      </div>
                    )}
                  </div>

                  {debug && (
                    <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                      <p className="text-rose-400 font-bold">
                        {debug.exception || 'Exception'}
                      </p>
                      {debug.file && (
                        <p className="text-slate-400 text-[10px]">
                          {debug.file} : line {debug.line}
                        </p>
                      )}
                      {debug.trace && (
                        <div className="mt-1.5 p-2 rounded bg-black/40 text-[10px] text-slate-400 overflow-x-auto max-h-32">
                          {debug.trace.map((tr, idx) => (
                            <p key={idx}>
                              #{idx} {tr.file}({tr.line}): {tr.function}()
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </main>

        {/* Footer Area */}
        <footer className="relative z-10 border-t border-white/10 bg-[#101B4F]/80 backdrop-blur-md py-4 text-center">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <LogoPengayoman className="w-5 h-6" bgColor="transparent" symbolColor="#FFD82B" />
              <span>Kantor Wilayah Kementerian Hukum & HAM Riau</span>
            </div>

            <p>
              &copy; {new Date().getFullYear()} HARMONITAS. Hak Cipta Dilindungi.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
