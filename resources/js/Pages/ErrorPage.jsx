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
  Activity,
  ArrowRight,
  ChevronRight,
  LogIn,
  LayoutDashboard,
  ExternalLink
} from 'lucide-react';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';
import logoPengayoman from '../assets/logo_pengayoman.png';
import harmonitasMascot3d from '../assets/harmonitas_mascot_3d.png';

const ERROR_CONFIGS = {
  404: {
    code: '404',
    badge: 'Halaman Tidak Ditemukan',
    title: 'Halaman yang Anda Cari Tidak Ditemukan',
    description:
      'Tautan atau berkas regulasi yang Anda tuju mungkin salah ketik, telah dipindahkan ke arsip lain, atau sudah tidak tersedia di sistem HARMONITAS.',
    icon: FileQuestion,
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    iconColor: 'text-[#2B3056]',
    iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
    solutions: [
      'Periksa kembali penulisan alamat URL pada bilah peramban Anda.',
      'Gunakan fitur pencarian pada menu Berkas Permohonan Regulasi.',
      'Kembali ke Beranda atau gunakan menu navigasi utama.'
    ]
  },
  403: {
    code: '403',
    badge: 'Akses Dibatasi / Ditolak',
    title: 'Hak Akses Tidak Mencukupi',
    description:
      'Akun Anda tidak memiliki wewenang atau hak akses untuk membuka halaman/dokumen ini. Beberapa fitur dibatasi khusus untuk peran tertentu (Tim Kerja, Biro Hukum, atau Administrator).',
    icon: ShieldAlert,
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-100 text-rose-700 border-rose-200',
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
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100 text-blue-700 border-blue-200',
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
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100 text-orange-700 border-orange-200',
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
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-100 text-rose-700 border-rose-200',
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
    badgeBg: 'bg-red-50 text-red-800 border-red-200',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100 text-red-700 border-red-200',
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
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
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
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
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
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
    solutions: [
      'Muat ulang halaman atau coba kembali beberapa saat lagi.',
      'Pastikan koneksi jaringan Anda dalam kondisi optimal.'
    ]
  }
};

const DEFAULT_CONFIG = {
  code: 'Error',
  badge: 'Kendala Sistem',
  title: 'Terjadi Kesalahan yang Tidak Terduga',
  description:
    'Permintaan Anda tidak dapat diproses secara sempurna oleh sistem aplikasi saat ini.',
  icon: AlertTriangle,
  badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
  iconColor: 'text-[#2B3056]',
  iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
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

      <div className="min-h-screen w-full bg-white text-slate-800 antialiased font-sans flex flex-col justify-between selection:bg-[#FFD82B] selection:text-[#2B3056] relative overflow-hidden">
        {/* Background Layer 1: Structured Micro Grid matching Landing Page */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.045]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #2B3056 1px, transparent 1px),
              linear-gradient(to bottom, #2B3056 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 75% 75% at 50% 40%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 40%, black 40%, transparent 100%)",
          }}
        />

        {/* Background Layer 2: Subtle Ambient Warmth */}
        <div
          className="absolute -top-16 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255, 216, 43, 0.14) 0%, rgba(255, 255, 255, 0) 70%)",
          }}
        />
        <div
          className="absolute -bottom-16 left-10 w-80 h-80 rounded-full pointer-events-none opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(43, 48, 86, 0.08) 0%, rgba(255, 255, 255, 0) 70%)",
          }}
        />

        {/* Top Header Bar matching PublicNavbar */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex h-[66px] max-w-7xl items-center justify-between">
            {/* Brand Logo & Title */}
            <Link href="/" className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer">
              <span className="shrink-0 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center">
                <img
                  src={logoHarmonitas}
                  alt="Logo HARMONITAS"
                  className="h-full w-full object-contain drop-shadow-2xs"
                />
              </span>

              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="font-bold tracking-wide text-[#2B3056] text-base sm:text-[17px]">
                    HARMONITAS
                  </span>
                  <span className="hidden rounded-full border border-[#FFD82B]/60 bg-[#FFF9DF] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#2B3056] sm:inline-flex">
                    Riau
                  </span>
                </span>
                <span className="hidden truncate text-[10px] font-medium tracking-wide text-slate-500 sm:block">
                  Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas
                </span>
              </span>
            </Link>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                href="/panduan"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#FFC800]" />
                <span>Buku Panduan</span>
              </Link>

              {user ? (
                <Link
                  href="/home"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 px-4 sm:px-5 h-10 text-xs font-bold text-[#2B3056] shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Ke Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-70 hidden sm:inline" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 px-4 sm:px-5 h-10 text-xs font-bold text-[#2B3056] shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Masuk Petugas</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Error Content Area */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl w-full">
            
            {/* Top Container: Error Details & Mascot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Status Display, Texts, & Actions */}
              <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
                
                {/* Government Institution Badge */}
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2B3056] shadow-2xs backdrop-blur-md">
                  <span className="flex h-4 w-4 items-center justify-center shrink-0">
                    <img
                      src={logoPengayoman}
                      alt="Logo Pengayoman"
                      className="h-full w-full object-contain"
                    />
                  </span>
                  Kantor Wilayah Kementerian Hukum Riau
                </div>

                {/* Big Status Code & Pill */}
                <div className="flex flex-col lg:flex-row items-center lg:items-baseline gap-3">
                  <span className="text-6xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#2B3056] via-[#3A4070] to-[#2B3056] leading-none drop-shadow-2xs">
                    {statusCode}
                  </span>

                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${config.badgeBg}`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    <span>{config.badge}</span>
                  </div>
                </div>

                {/* Error Headlines & Explanations */}
                <div className="space-y-2 max-w-xl mx-auto lg:mx-0">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B3056] tracking-tight leading-snug">
                    {config.title}
                  </h1>

                  <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed">
                    {message || config.description}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#2B3056] transition shadow-2xs cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-500" />
                    <span>Halaman Sebelumnya</span>
                  </button>

                  <Link
                    href={user ? '/home' : '/'}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 px-6 text-xs font-bold text-[#2B3056] shadow-sm transition duration-200 hover:-translate-y-0.5 cursor-pointer active:scale-95"
                  >
                    <Home className="w-4 h-4 text-[#2B3056]" />
                    <span>{user ? 'Buka Dashboard' : 'Ke Halaman Utama'}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleReload}
                    disabled={isReloading}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
                    title="Muat Ulang Halaman"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 text-[#2B3056] ${
                        isReloading ? 'animate-spin' : ''
                      }`}
                    />
                    <span className="hidden sm:inline">Segarkan</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Clean Mascot Workstation matching Landing Page */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square flex items-center justify-center">
                  {/* Ambient Soft Glow Behind Mascot */}
                  <div
                    className="absolute w-64 h-64 rounded-full pointer-events-none opacity-60 blur-2xl"
                    style={{
                      background: "radial-gradient(circle, rgba(255, 216, 43, 0.25) 0%, rgba(255, 255, 255, 0) 70%)",
                    }}
                  />

                  {/* Mascot Image */}
                  <img
                    src={harmonitasMascot3d}
                    alt="Maskot Harmonisasi Regulasi Kanwil Riau"
                    className="relative z-10 w-full h-full object-contain drop-shadow-md select-none animate-float-slow"
                  />

                  {/* Floating Status Icon Badge on Mascot */}
                  <div className={`absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-md ${config.iconBg}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Section: Solution Steps & Quick Links Bento Box */}
            <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white/95 p-5 sm:p-6 shadow-2xs backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 text-[#2B3056]">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 border border-amber-200/60 text-[#B3912D]">
                  <Compass className="w-3.5 h-3.5" />
                </span>
                <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#2B3056]">
                  Langkah yang Dapat Anda Lakukan
                </h2>
              </div>

              {/* 3 Numbered Steps with Golden Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {config.solutions.map((sol, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/70 text-xs text-slate-700 leading-relaxed"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#FFD82B] to-[#FFB943] text-[#2B3056] text-[10px] font-extrabold shadow-2xs mt-0.5">
                      {index + 1}
                    </span>
                    <span>{sol}</span>
                  </div>
                ))}
              </div>

              {/* Quick Navigation Cards */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/peraturan"
                  className="group flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-white hover:border-[#2B3056]/30 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2B3056] border border-blue-100">
                      <FileText className="w-4 h-4" />
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#2B3056] group-hover:text-[#3A4070]">Daftar Berkas</p>
                      <p className="text-[10px] text-slate-500">Rancangan Regulasi</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2B3056] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/ai"
                  className="group flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-white hover:border-[#2B3056]/30 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-[#B3912D] border border-amber-100">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#2B3056] group-hover:text-[#3A4070]">Asisten AI</p>
                      <p className="text-[10px] text-slate-500">Analisis Kepatuhan</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2B3056] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/panduan"
                  className="group flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-white hover:border-[#2B3056]/30 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#2B3056] group-hover:text-[#3A4070]">Panduan SOP</p>
                      <p className="text-[10px] text-slate-500">Buku Petunjuk</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2B3056] group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>

            {/* Technical Diagnostics Accordion */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowTechnical(!showTechnical)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-[#2B3056] transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {showTechnical
                    ? 'Sembunyikan Informasi Diagnostik'
                    : 'Tampilkan Informasi Diagnostik Teknis'}
                </span>
                {showTechnical ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showTechnical && (
                <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-100 text-left font-mono text-[11px] space-y-2 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Detail Galat Sistem
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyDebug}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Salin Laporan</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-400">Status Code: </span>
                      <span className="text-[#FFD82B] font-bold">{statusCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Timestamp: </span>
                      <span>{new Date().toLocaleString('id-ID')}</span>
                    </div>
                    <div className="sm:col-span-2 truncate">
                      <span className="text-slate-400">Path: </span>
                      <span>
                        {typeof window !== 'undefined'
                          ? window.location.pathname
                          : '-'}
                      </span>
                    </div>
                    {user && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">User Session: </span>
                        <span>
                          {user.nama || user.name} [{user.role || 'USER'}]
                        </span>
                      </div>
                    )}
                  </div>

                  {debug && (
                    <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
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

        {/* Footer Area matching Landing Page Footer */}
        <footer className="relative z-10 border-t border-slate-200 bg-white py-4 text-center">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center shrink-0">
                <img
                  src={logoPengayoman}
                  alt="Logo Pengayoman"
                  className="h-full w-full object-contain"
                />
              </span>
              <span>Kantor Wilayah Kementerian Hukum Riau</span>
            </div>

            <p>
              &copy; {new Date().getFullYear()} HARMONITAS • Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
