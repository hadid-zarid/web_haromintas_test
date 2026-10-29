import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../components/layout/AppLayout';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  ExternalLink,
  X,
  Info,
  Zap,
  ShieldCheck,
  Users,
  UserPlus,
  UserCog,
  UserX,
  ToggleLeft,
  ToggleRight,
  FileOutput,
  Calendar,
  ClipboardList,
  BarChart2,
  Settings,
  KeyRound,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  RefreshCw,
  Database,
  Globe,
} from 'lucide-react';

export const PanduanAdminPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [showPdfModal, setShowPdfModal] = useState(false);

  const guideSlides = [
    {
      id: 1,
      badge: 'Admin 1: Peran & Akses',
      title: 'Memahami Peran Administrator Sistem',
      subtitle: 'Administrator adalah pengelola tertinggi sistem HARMONITAS yang bertanggung jawab atas manajemen akun, hak akses, dan konfigurasi data master aplikasi.',
      icon: ShieldCheck,
      color: 'from-red-600 to-rose-700',
      accentColor: 'text-red-700 bg-red-50 border-red-200',
      steps: [
        {
          title: 'Wewenang Penuh Manajemen Akun',
          desc: 'Admin dapat membuat, mengedit, menonaktifkan, dan menghapus seluruh akun pengguna (Tim Kerja, Biro Hukum, Pimpinan) di semua wilayah.',
          tag: 'Hak Akses Penuh',
          icon: KeyRound,
          highlight: 'bg-red-50/80 border-red-200 text-red-950',
        },
        {
          title: 'Kontrol Data Master & Target Rencana',
          desc: 'Admin bertanggung jawab menginput dan mempublikasikan target ProPem (Program Pembentukan) dan Progsun (Program Penyusunan) per tahun anggaran.',
          tag: 'Data Master',
          icon: Database,
          highlight: 'bg-amber-50/80 border-amber-200 text-amber-950',
        },
        {
          title: 'Pemantauan Aktivitas Sistem',
          desc: 'Admin dapat memantau seluruh riwayat aktivitas (audit log) dari semua pengguna di dashboard beranda, termasuk login, upload, approve, dan hapus berkas.',
          tag: 'Audit & Monitoring',
          icon: Eye,
          highlight: 'bg-blue-50/80 border-blue-200 text-blue-950',
        },
      ],
      tip: 'Penting: Gunakan akun Admin hanya untuk keperluan pengelolaan sistem. Setiap tindakan Admin tercatat dalam audit log sistem.',
    },
    {
      id: 2,
      badge: 'Admin 2: Kelola Akun',
      title: 'Menambahkan & Mengelola Akun Pengguna',
      subtitle: 'Panduan langkah demi langkah untuk mendaftarkan akun baru, menetapkan peran, dan mengatur wilayah kerja setiap pengguna.',
      icon: UserPlus,
      color: 'from-blue-600 to-indigo-700',
      accentColor: 'text-blue-700 bg-blue-50 border-blue-200',
      steps: [
        {
          title: '1. Buka Menu Kelola Akun (Users)',
          desc: 'Klik menu "Kelola Akun (Users)" pada bagian Manajemen Sistem di sidebar kiri. Halaman ini menampilkan seluruh daftar akun yang terdaftar.',
          tag: 'Langkah 1',
          icon: Users,
          highlight: 'bg-slate-50 border-slate-200 text-slate-900',
        },
        {
          title: '2. Klik "Tambah Pengguna Baru"',
          desc: 'Isi form: Nama Lengkap, Email, Password, Peran (TIM_KERJA / BIRO_HUKUM / PIMPINAN / ADMIN), dan Wilayah Kerja yang sesuai.',
          tag: 'Langkah 2',
          icon: UserPlus,
          highlight: 'bg-blue-50/70 border-blue-200 text-blue-950',
        },
        {
          title: '3. Simpan & Verifikasi Akun Aktif',
          desc: 'Setelah disimpan, pengguna langsung aktif dan dapat login. Pastikan peran dan wilayah kerja sudah benar sebelum menyimpan.',
          tag: 'Langkah 3',
          icon: CheckCircle2,
          highlight: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
        },
      ],
      tip: 'Tip: Untuk Tim Kerja, pastikan wilayah kabupaten/kota binaan sudah sesuai. Kesalahan wilayah akan berdampak pada data yang terlihat oleh pengguna tersebut.',
    },
    {
      id: 3,
      badge: 'Admin 3: Edit & Nonaktifkan',
      title: 'Mengubah Data & Menonaktifkan Akun',
      subtitle: 'Cara memperbarui informasi akun yang sudah ada dan mengelola status aktif/nonaktif pengguna tanpa harus menghapus akun.',
      icon: UserCog,
      color: 'from-amber-500 to-orange-600',
      accentColor: 'text-amber-700 bg-amber-50 border-amber-200',
      steps: [
        {
          title: '1. Klik Aksi "Edit" pada Baris Pengguna',
          desc: 'Di tabel daftar pengguna, klik tombol ikon edit (pensil) pada baris akun yang ingin diubah. Form edit akan tampil dengan data yang sudah terisi.',
          tag: 'Edit Data',
          icon: UserCog,
          highlight: 'bg-amber-50/70 border-amber-200 text-amber-950',
        },
        {
          title: '2. Toggle Status Aktif / Nonaktif',
          desc: 'Untuk menonaktifkan akun sementara (misalnya karyawan cuti atau pindah tugas), klik tombol toggle status. Akun nonaktif tidak bisa login namun data riwayatnya tetap tersimpan.',
          tag: 'Status Akun',
          icon: ToggleLeft,
          highlight: 'bg-slate-50/70 border-slate-200 text-slate-900',
        },
        {
          title: '3. Hapus Permanen (Hati-hati!)',
          desc: 'Gunakan fitur hapus HANYA jika akun benar-benar tidak diperlukan lagi. Penghapusan permanen tidak dapat dibatalkan dan dapat mempengaruhi riwayat aktivitas terkait.',
          tag: 'Hapus Permanen',
          icon: UserX,
          highlight: 'bg-rose-50/70 border-rose-200 text-rose-950',
        },
      ],
      tip: 'Rekomendasi: Gunakan "Nonaktifkan" daripada "Hapus" agar riwayat audit pengguna tetap terjaga untuk keperluan pelaporan dan pertanggungjawaban.',
    },
    {
      id: 4,
      badge: 'Admin 4: Target ProPem & Progsun',
      title: 'Menginput Target Rencana Regulasi Tahunan',
      subtitle: 'Panduan pengisian target Program Pembentukan (ProPem) dan Program Penyusunan (Progsun) per kabupaten/kota untuk setiap tahun anggaran.',
      icon: ClipboardList,
      color: 'from-emerald-600 to-teal-700',
      accentColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      steps: [
        {
          title: '1. Buka Menu Target ProPem & Progsun',
          desc: 'Akses menu "Target ProPem & Progsun" di bagian Manajemen Sistem pada sidebar. Pilih tahun anggaran yang ingin diinput atau diperbarui.',
          tag: 'Langkah 1',
          icon: Calendar,
          highlight: 'bg-slate-50 border-slate-200 text-slate-900',
        },
        {
          title: '2. Isi Target per Kabupaten/Kota',
          desc: 'Masukkan angka target Ranperda dan Ranperkada untuk masing-masing kabupaten/kota se-Riau. Data ini menjadi acuan capaian harmonisasi dalam pelaporan tahunan.',
          tag: 'Input Target',
          icon: ClipboardList,
          highlight: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
        },
        {
          title: '3. Publikasikan Data Target',
          desc: 'Setelah semua target terisi dan diverifikasi, klik tombol "Publikasikan" untuk menjadikan data target terlihat di dashboard dan laporan statistik publik.',
          tag: 'Publikasi',
          icon: Globe,
          highlight: 'bg-blue-50/70 border-blue-200 text-blue-950',
        },
      ],
      tip: 'Catatan: Data target yang sudah dipublikasikan akan muncul di halaman statistik publik. Pastikan data sudah final sebelum dipublikasikan.',
    },
    {
      id: 5,
      badge: 'Admin 5: Filter & Monitoring',
      title: 'Memantau Aktivitas & Memfilter Data Berkas',
      subtitle: 'Cara menggunakan fitur pencarian, filter, dan pemantauan audit log untuk mengawasi seluruh aktivitas di sistem HARMONITAS.',
      icon: BarChart2,
      color: 'from-purple-600 to-indigo-800',
      accentColor: 'text-purple-700 bg-purple-50 border-purple-200',
      steps: [
        {
          title: '1. Filter Berkas di Daftar Permohonan',
          desc: 'Admin dapat melihat seluruh berkas dari semua wilayah dan tim kerja. Gunakan filter Status, Kabupaten/Kota, Jenis Regulasi, dan Tahun untuk mempersempit tampilan.',
          tag: 'Filter Data',
          icon: Filter,
          highlight: 'bg-purple-50/70 border-purple-200 text-purple-950',
        },
        {
          title: '2. Pantau Audit Log di Dashboard Beranda',
          desc: 'Bagian "Aktivitas Berkas Terbaru" di dashboard menampilkan seluruh log aktivitas real-time dari semua pengguna: login, upload, approve, tolak, hingga hapus berkas.',
          tag: 'Audit Log',
          icon: Eye,
          highlight: 'bg-blue-50/70 border-blue-200 text-blue-950',
        },
        {
          title: '3. Pantau Statistik & Tren Bulanan',
          desc: 'Dashboard beranda admin menampilkan chart tren harmonisasi bulanan dan distribusi tahapan seluruh berkas se-Provinsi Riau tanpa filter wilayah.',
          tag: 'Statistik',
          icon: BarChart2,
          highlight: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
        },
      ],
      tip: 'Tip: Klik pada setiap item di "Aktivitas Berkas Terbaru" untuk membuka detail lengkap log aktivitas, termasuk data payload perubahan yang dilakukan.',
    },
    {
      id: 6,
      badge: 'Admin 6: Keamanan & Praktik Terbaik',
      title: 'Keamanan Akun & Praktik Terbaik Admin',
      subtitle: 'Panduan menjaga keamanan akun administrator dan praktik terbaik dalam mengelola sistem HARMONITAS secara aman dan bertanggung jawab.',
      icon: Lock,
      color: 'from-slate-700 to-slate-900',
      accentColor: 'text-slate-700 bg-slate-50 border-slate-200',
      steps: [
        {
          title: 'Gunakan Password Kuat & Unik',
          desc: 'Pastikan akun Admin menggunakan password minimal 12 karakter yang terdiri dari huruf besar, huruf kecil, angka, dan simbol. Ganti password secara berkala.',
          tag: 'Keamanan Akun',
          icon: KeyRound,
          highlight: 'bg-slate-50/80 border-slate-200 text-slate-900',
        },
        {
          title: 'Jangan Bagikan Kredensial Admin',
          desc: 'Akun Admin tidak boleh digunakan bersama. Jika ada personil baru yang perlu hak admin, buatkan akun Admin terpisah untuk mereka.',
          tag: 'Privasi Akun',
          icon: AlertTriangle,
          highlight: 'bg-amber-50/80 border-amber-200 text-amber-950',
        },
        {
          title: 'Selalu Logout Setelah Selesai',
          desc: 'Klik tombol "Keluar / Logout" di bagian bawah sidebar setiap kali selesai menggunakan sistem. Hindari meninggalkan sesi Admin terbuka di komputer yang tidak terjaga.',
          tag: 'Keamanan Sesi',
          icon: Lock,
          highlight: 'bg-rose-50/80 border-rose-200 text-rose-950',
        },
      ],
      tip: 'Pengingat: Seluruh tindakan dengan akun Admin tercatat dalam audit log sistem. Gunakan wewenang Admin dengan bijak dan sesuai prosedur yang berlaku.',
    },
  ];

  const currentGuide = guideSlides[currentSlide];

  const goToPrev = () => {
    if (currentSlide > 0) {
      setSlideDirection('prev');
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentSlide < guideSlides.length - 1) {
      setSlideDirection('next');
      setCurrentSlide(prev => prev + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <AppLayout
      title="Buku Panduan Administrator"
      subtitle="Panduan khusus pengelolaan sistem HARMONITAS untuk Administrator — manajemen akun, target rencana, dan pemantauan aktivitas."
    >
      <Head title="Panduan Admin - HARMONITAS" />

      <div className="space-y-6 max-w-5xl mx-auto">

        {/* =========================================================================
            ADMIN BADGE HEADER
            ========================================================================= */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#2B3056] to-[#3A4070] border border-[#3A4070] shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFD82B] text-[#2B3056] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#FFD82B]">Akses Terbatas</p>
            <h1 className="text-sm font-extrabold text-white truncate">
              Buku Panduan Khusus Administrator Sistem HARMONITAS
            </h1>
          </div>
          <span className="ml-auto px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-300 text-[10px] font-black uppercase tracking-wide shrink-0">
            ADMIN ONLY
          </span>
        </div>

        {/* =========================================================================
            SLIDE SELECTOR BAR (HORIZONTAL BOOK INDEX TABS)
            ========================================================================= */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            {guideSlides.map((slide, index) => {
              const Icon = slide.icon;
              const isActive = currentSlide === index;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    setSlideDirection(index > currentSlide ? 'next' : 'prev');
                    setCurrentSlide(index);
                  }}
                  className={`flex-1 min-w-[130px] p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5 shrink-0 ${
                    isActive
                      ? 'bg-[#2B3056] text-white border-[#2B3056] shadow-sm -translate-y-0.5'
                      : 'bg-slate-50/80 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                    isActive ? 'bg-[#FFD82B] text-[#2B3056]' : 'bg-white text-slate-600 border border-slate-200'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[9px] font-black uppercase tracking-wider ${
                      isActive ? 'text-[#FFD82B]' : 'text-slate-400'
                    }`}>
                      Bab {index + 1}
                    </p>
                    <p className={`text-[11px] font-bold truncate ${
                      isActive ? 'text-white' : 'text-[#2B3056]'
                    }`}>
                      {slide.title.split(':')[1]?.trim() || slide.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            MAIN INTERACTIVE BOOK CARD SLIDER
            ========================================================================= */}
        <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-lg overflow-hidden transition-all duration-300">
          {/* Top Progress Bar & Slide Counter Header */}
          <div className="p-4 sm:p-5 bg-[#2B3056] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A4070]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-[#FFD82B] flex items-center justify-center font-bold shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black uppercase tracking-wide">
                    {currentGuide.badge}
                  </span>
                  <span className="text-[11px] text-slate-300 font-semibold">
                    Halaman {currentSlide + 1} dari {guideSlides.length}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                  {currentGuide.title}
                </h2>
              </div>
            </div>

            {/* Quick Navigation Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={goToPrev}
                disabled={currentSlide === 0}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  currentSlide === 0
                    ? 'opacity-40 bg-white/5 border-white/10 text-slate-400 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
                title="Halaman Sebelumnya (Tombol Panah Kiri)"
              >
                <ChevronLeft className="w-4 h-4 text-[#FFD82B]" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={goToNext}
                disabled={currentSlide === guideSlides.length - 1}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  currentSlide === guideSlides.length - 1
                    ? 'opacity-40 bg-white/5 border border-white/10 text-slate-400 cursor-not-allowed'
                    : 'bg-[#FFD82B] hover:bg-[#FFC800] text-[#2B3056]'
                }`}
                title="Halaman Selanjutnya (Tombol Panah Kanan)"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight className="w-4 h-4 text-[#2B3056]" />
              </button>
            </div>
          </div>

          {/* Slide Progress Line Indicator */}
          <div className="w-full bg-slate-100 h-1">
            <div
              className="bg-rose-500 h-1 transition-all duration-300 ease-out"
              style={{ width: `${((currentSlide + 1) / guideSlides.length) * 100}%` }}
            />
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-8 space-y-5 sm:space-y-6">
            {/* Subtitle */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                {currentGuide.subtitle}
              </p>
            </div>

            {/* 3 Step Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentGuide.steps.map((step, idx) => {
                const StepIcon = step.icon || CheckCircle2;
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border shadow-2xs flex flex-col justify-between space-y-3 transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${step.highlight}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-[#2B3056] font-black text-xs flex items-center justify-center shadow-2xs">
                        {idx + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold tracking-wide uppercase bg-white/80 border border-slate-200 shadow-2xs">
                        {step.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-black text-[#2B3056] leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-[11px] text-slate-600 font-medium mt-1.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500">
                      <StepIcon className="w-3.5 h-3.5 text-[#2B3056] shrink-0" />
                      <span>Panduan Admin Resmi</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Helpful Tip Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <p>{currentGuide.tip}</p>
            </div>
          </div>

          {/* Card Footer */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/90 flex items-center justify-between">
            {/* Slide Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {guideSlides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => {
                    setSlideDirection(dotIdx > currentSlide ? 'next' : 'prev');
                    setCurrentSlide(dotIdx);
                  }}
                  className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                    currentSlide === dotIdx
                      ? 'w-7 bg-rose-600'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Buka Panduan ${dotIdx + 1}`}
                />
              ))}
            </div>

            {/* Next / Previous Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPrev}
                disabled={currentSlide === 0}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  currentSlide === 0
                    ? 'opacity-40 bg-white border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>

              {currentSlide < guideSlides.length - 1 ? (
                <button
                  type="button"
                  onClick={goToNext}
                  className="px-5 py-2 rounded-xl bg-[#2B3056] hover:bg-[#3A4070] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>Lanjut ke Bab {currentSlide + 2}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFD82B]" />
                </button>
              ) : (
                <Link
                  href="/admin/users"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Selesai, Buka Kelola Akun</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM QUICK ACTION
            ========================================================================= */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#2B3056]">
                Navigasi dengan Tombol Panah Keyboard
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Tekan tombol <strong>← Panah Kiri</strong> dan <strong>→ Panah Kanan</strong> untuk menggeser panduan.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="px-4 py-2.5 rounded-xl border border-[#2B3056] bg-[#2B3056] hover:bg-[#3A4070] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FFD82B]" />
              <span>Baca Panduan Admin Lengkap</span>
            </button>

            <a
              href="/panduan-admin/unduh"
              download="Buku Panduan Administrator HARMONITAS.pdf"
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#2B3056] text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh Panduan Admin</span>
            </a>
          </div>
        </div>

        {/* =========================================================================
            MODAL: BACA PANDUAN ADMIN LENGKAP (PDF VIEWER)
            ========================================================================= */}
        {showPdfModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2B3056]/70 backdrop-blur-xs"
            onClick={() => setShowPdfModal(false)}
          >
            <div
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="bg-[#2B3056] px-5 py-3.5 flex items-center justify-between gap-4 text-white shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-extrabold text-white truncate">
                        Buku Panduan Administrator HARMONITAS
                      </h3>
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-400/30">
                        ADMIN ONLY
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium truncate">
                      Panduan Manajemen Akun, Target Rencana & Keamanan Sistem
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <a
                    href="/panduan-admin/unduh"
                    download="Buku Panduan Administrator HARMONITAS.pdf"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 cursor-pointer"
                    title="Unduh Berkas PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FFD82B]" />
                    <span>Unduh PDF</span>
                  </a>

                  <a
                    href="/panduan-admin/baca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Buka di Tab Baru"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowPdfModal(false)}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Tutup Modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content: Iframe PDF Reader */}
              <div className="flex-1 bg-slate-100 relative overflow-hidden">
                <iframe
                  src="/panduan-admin/baca#toolbar=1&navpanes=1"
                  className="w-full h-full border-none"
                  title="Buku Panduan Administrator HARMONITAS"
                />
              </div>

              {/* Footer Modal */}
              <div className="bg-white px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-semibold shrink-0">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span className="hidden sm:inline">Dokumen Panduan Resmi Admin Sistem HARMONITAS — Kanwil Kemenkumham Riau</span>
                  <span className="sm:hidden">Panduan Admin HARMONITAS</span>
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="/panduan-admin/unduh"
                    download="Buku Panduan Administrator HARMONITAS.pdf"
                    className="sm:hidden px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                  >
                    Unduh
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowPdfModal(false)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PanduanAdminPage;
