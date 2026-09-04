import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../components/layout/AppLayout';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  Upload, 
  Eye, 
  Download, 
  FileText, 
  CheckCircle2, 
  Building, 
  Building2, 
  Scale, 
  Landmark, 
  UserCheck, 
  Sparkles, 
  FolderCheck,
  Folder,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Printer,
  Info,
  SlidersHorizontal,
  FileCheck2,
  Lock,
  RefreshCw
} from 'lucide-react';

export const PanduanPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');

  const guideSlides = [
    {
      id: 1,
      badge: 'Panduan 1: Pengenalan',
      title: 'Mengenal Peran & Hak Akses Pengguna',
      subtitle: 'Pahami peran dan wewenang Anda dalam sistem sebelum mengelola berkas regulasi daerah.',
      icon: ShieldCheck,
      color: 'from-blue-600 to-indigo-700',
      accentColor: 'text-blue-700 bg-blue-50 border-blue-200',
      steps: [
        {
          title: 'Tim Kerja 1 / 2 / 3 Kanwil Kemenkum Provinsi Riau',
          desc: 'Menginput permohonan baru, melaksanakan rapat pleno harmonisasi, dan mengunggah Dokumen 1 hingga 5 untuk wilayah kabupaten/kota binaan masing-masing.',
          tag: 'Pengelola Berkas Tahap I',
          icon: UserCheck,
          highlight: 'bg-blue-50/80 border-blue-200 text-blue-950',
        },
        {
          title: 'Biro Hukum Sekretariat Daerah Provinsi Riau',
          desc: 'Menelaah berkas harmonisasi yang telah lengkap dari Kanwil, mengunggah Matriks Fasilitasi (Dokumen 6), dan menerbitkan Surat Keputusan Fasilitasi (Dokumen 7).',
          tag: 'Pemeriksa Akhir Tahap II',
          icon: Building2,
          highlight: 'bg-purple-50/80 border-purple-200 text-purple-950',
        },
        {
          title: 'Pimpinan (Kakanwil & Kadiv Pelayanan Hukum)',
          desc: 'Memantau seluruh progres harmonisasi se-Provinsi Riau dan mengesahkan Surat Hasil Harmonisasi Kanwil.',
          tag: 'Pengawasan & Pengesahan',
          icon: Landmark,
          highlight: 'bg-amber-50/80 border-amber-200 text-amber-950',
        },
      ],
      tip: 'Tip: Pastikan Anda masuk menggunakan akun dengan wilayah kerja yang sesuai untuk dapat mengunggah atau mengubah berkas.',
    },
    {
      id: 2,
      badge: 'Panduan 2: Input Permohonan',
      title: 'Cara Mengajukan Permohonan Regulasi Baru',
      subtitle: 'Langkah mudah mengajukan rancangan peraturan daerah (Ranperda) atau peraturan kepala daerah (Ranperkada).',
      icon: PlusCircle,
      color: 'from-amber-500 to-orange-600',
      accentColor: 'text-amber-700 bg-amber-50 border-amber-200',
      steps: [
        {
          title: '1. Buka Menu Daftar Permohonan',
          desc: 'Pilih menu "Daftar Permohonan" di sidebar kiri, lalu klik tombol "Tambah Permohonan Baru" di sudut kanan atas.',
          tag: 'Langkah 1',
          icon: SlidersHorizontal,
          highlight: 'bg-slate-50 border-slate-200 text-slate-900',
        },
        {
          title: '2. Lengkapi Identitas Rancangan Peraturan',
          desc: 'Ketik Judul Rancangan Peraturan, pilih Jenis Regulasi (Ranperda atau Ranperkada), dan pilih Kabupaten/Kota Pemohon.',
          tag: 'Langkah 2',
          icon: FileText,
          highlight: 'bg-slate-50 border-slate-200 text-slate-900',
        },
        {
          title: '3. Lampirkan Draf Awal & Analisis Konsepsi',
          desc: 'Unggah file draf awal rancangan (.pdf/.docx) jika berkas sudah tersedia. Nomor registrasi berkas akan otomatis digenerate oleh sistem.',
          tag: 'Langkah 3',
          icon: Upload,
          highlight: 'bg-emerald-50 border-emerald-200 text-emerald-950',
        },
      ],
      tip: 'Tip: Jika berkas draf belum siap saat pendaftaran, berkas dapat diunggah nanti melalui lembar detail permohonan.',
    },
    {
      id: 3,
      badge: 'Panduan 3: Harmonisasi Kanwil',
      title: 'Melengkapi 5 Dokumen Harmonisasi Kanwil (Tahap I)',
      subtitle: 'Panduan pelaksanaan rapat pleno dan pengunggahan 5 berkas utama oleh Tim Kerja Kanwil.',
      icon: Scale,
      color: 'from-blue-600 to-indigo-700',
      accentColor: 'text-blue-700 bg-blue-50 border-blue-200',
      steps: [
        {
          title: 'Dokumen 1 & Dokumen 2: Berkas Awal Pemohon',
          desc: 'Pastikan Draft Rancangan Awal (Dokumen 1) dan Dokumen Analisis Konsepsi (Dokumen 2) telah terunggah dengan benar sebelum pleno.',
          tag: 'Pra-Harmonisasi',
          icon: Folder,
          highlight: 'bg-blue-50/70 border-blue-200 text-blue-950',
        },
        {
          title: 'Dokumen 3 & Dokumen 4: Hasil Rapat Pleno',
          desc: 'Setelah rapat pleno penyelarasan pasal bersama Pemda, unggah Matriks Perubahan Sandingan (Dokumen 3) dan Draft Bersih Hasil Harmonisasi (Dokumen 4).',
          tag: 'Hasil Pleno',
          icon: FileCheck2,
          highlight: 'bg-indigo-50/70 border-indigo-200 text-indigo-950',
        },
        {
          title: 'Dokumen 5: Surat Hasil Harmonisasi Kanwil',
          desc: 'Unggah Surat Resmi Hasil Harmonisasi bertanda tangan Kakanwil/Kadiv. Begitu Dokumen 5 terunggah, status otomatis berpindah ke "Fasilitasi".',
          tag: 'Pengesahan Kanwil',
          icon: CheckCircle2,
          highlight: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
        },
      ],
      tip: 'Penting: Seluruh 5 dokumen Tahap I wajib lengkap 100% agar berkas dapat ditelaah oleh Biro Hukum Provinsi Riau.',
    },
    {
      id: 4,
      badge: 'Panduan 4: Fasilitasi Biro Hukum',
      title: 'Proses Fasilitasi oleh Biro Hukum Provinsi Riau (Tahap II)',
      subtitle: 'Tahapan evaluasi akhir dan penerbitan surat persetujuan hingga status peraturan menjadi Selesai.',
      icon: Building2,
      color: 'from-purple-600 to-indigo-800',
      accentColor: 'text-purple-700 bg-purple-50 border-purple-200',
      steps: [
        {
          title: '1. Verifikasi Berkas dari Kanwil',
          desc: 'Biro Hukum memeriksa riwayat rapat pleno dan keabsahan Dokumen 1 hingga 5 yang telah disahkan oleh Kanwil Kemenkum Provinsi Riau.',
          tag: 'Pemeriksaan',
          icon: ShieldCheck,
          highlight: 'bg-purple-50/70 border-purple-200 text-purple-950',
        },
        {
          title: '2. Unggah Matriks Hasil Fasilitasi (Dokumen 6 — Opsional)',
          desc: 'Biro Hukum dapat mengunggah catatan evaluasi dan penyesuaian materi muatan pasal pada Dokumen 6 jika tersedia. Dokumen ini tidak wajib dan tidak menghambat penyelesaian fasilitasi.',
          tag: 'Dokumen Opsional',
          icon: Folder,
          highlight: 'bg-purple-50/70 border-purple-200 text-purple-950',
        },
        {
          title: '3. Pengesahan Keputusan Akhir (Dokumen 7)',
          desc: 'Klik tombol "Terima & Terbitkan Surat Fasilitasi" untuk melampirkan surat keputusan akhir (Dokumen 7). Status regulasi otomatis berubah menjadi "Selesai (Tuntas)".',
          tag: 'Keputusan Selesai',
          icon: CheckCircle2,
          highlight: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
        },
      ],
      tip: 'Catatan: Dokumen 6 bersifat opsional. Dokumen 7 tetap menjadi dokumen utama hasil fasilitasi. Jika berkas memerlukan perbaikan, Biro Hukum dapat mengeklik "Tolak & Terbitkan Surat Penolakan" untuk dikembalikan ke Kanwil.',
    },
    {
      id: 5,
      badge: 'Panduan 5: Kelola Berkas Fisik',
      title: 'Melihat Pratinjau & Mengunduh Dokumen',
      subtitle: 'Cara berinteraksi dengan kartu map dokumen interaktif dan membuka berkas langsung di browser.',
      icon: FolderCheck,
      color: 'from-emerald-600 to-teal-700',
      accentColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      steps: [
        {
          title: '1. Arahkan Kursor ke Card Map Dokumen',
          desc: 'Arahkan kursor ke tiap map berkas. Lembaran kertas di dalamnya akan meluncur naik secara interaktif untuk melihat status berkas.',
          tag: 'Interaksi Hover',
          icon: Layers,
          highlight: 'bg-slate-50 border-slate-200 text-slate-900',
        },
        {
          title: '2. Pratinjau Langsung (Inline Preview)',
          desc: 'Klik tombol "Lihat" atau klik badan kartu untuk membuka penampil dokumen di web tanpa perlu mengunduh terlebih dahulu.',
          tag: 'Pratinjau Web',
          icon: Eye,
          highlight: 'bg-blue-50 border-blue-200 text-blue-950',
        },
        {
          title: '3. Unduh Berkas Aman (Protected Download)',
          desc: 'Klik ikon panah unduh pada kartu atau di dalam modal pratinjau untuk menyimpan berkas (.pdf/.docx) ke perangkat Anda.',
          tag: 'Unduh Berkas',
          icon: Download,
          highlight: 'bg-emerald-50 border-emerald-200 text-emerald-950',
        },
      ],
      tip: 'Tip: Jika ingin mengganti file yang salah, klik tombol "Ganti" pada kartu dokumen untuk mengunggah versi perbaikan terbaru.',
    },
    {
      id: 6,
      badge: 'Panduan 6: Fitur AI',
      title: 'Uji Format Dokumen dengan Harmonitas AI',
      subtitle: 'Gunakan kecerdasan buatan untuk menguji keselarasan konsiderans dan format pasal secara otomatis.',
      icon: Sparkles,
      color: 'from-amber-500 to-yellow-600',
      accentColor: 'text-amber-800 bg-amber-50 border-amber-200',
      steps: [
        {
          title: '1. Buka Menu Harmonitas AI',
          desc: 'Akses menu "Harmonitas AI" di sidebar atau klik tombol "Uji Format Dokumen via AI" pada lembar detail permohonan.',
          tag: 'Akses AI',
          icon: Sparkles,
          highlight: 'bg-amber-50/70 border-amber-200 text-amber-950',
        },
        {
          title: '2. Masukkan Naskah atau Draf Pasal',
          desc: 'Salin naskah konsiderans menimbang/mengingat atau naskah pasal yang ingin diuji kesesuaian formatnya.',
          tag: 'Input Naskah',
          icon: FileText,
          highlight: 'bg-slate-50 border-slate-200 text-slate-900',
        },
        {
          title: '3. Analisis Kepatuhan & Hirarki Hukum',
          desc: 'AI akan memeriksa apakah konsiderans telah mengacu pada UU yang masih berlaku dan memberikan rekomendasi penyempurnaan naskah.',
          tag: 'Hasil Evaluasi',
          icon: CheckCircle2,
          highlight: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
        },
      ],
      tip: 'Tip: Hasil analisis AI bersifat sebagai alat bantu asisten perancang untuk mempermudah telaah awal naskah.',
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

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <AppLayout
      title="Buku Panduan & SOP Interaktif"
      subtitle="Panduan langkah demi langkah pengoperasian sistem HARMONITAS Kanwil Kemenkum Provinsi Riau & Biro Hukum Prov. Riau."
    >
      <Head title="Buku Panduan - HARMONITAS" />

      <div className="space-y-6 max-w-5xl mx-auto">
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
            MAIN INTERACTIVE BOOK CARD SLIDER (DENGAN ANIMASI GESER HALUS)
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
                  <span className="px-2 py-0.5 rounded-md bg-[#FFD82B] text-[#2B3056] text-[10px] font-black uppercase tracking-wide">
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
              className="bg-[#FFC800] h-1 transition-all duration-300 ease-out"
              style={{ width: `${((currentSlide + 1) / guideSlides.length) * 100}%` }}
            />
          </div>

          {/* =========================================================================
              CARD BODY WITH ANIMATED SLIDE TRANSITION
              ========================================================================= */}
          <div className="p-4 sm:p-8 space-y-5 sm:space-y-6 key={currentSlide} animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Subtitle / Purpose */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                {currentGuide.subtitle}
              </p>
            </div>

            {/* 3 Step Visual Cards inside the Guide */}
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
                      <span>Panduan Sistem Resmi</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Helpful Tip Box at the Bottom of Slide */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <p>{currentGuide.tip}</p>
            </div>
          </div>

          {/* Card Footer with Slide Dots & Navigation */}
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
                      ? 'w-7 bg-[#2B3056]'
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
                  href="/peraturan"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Selesai, Buka Daftar Permohonan</span>
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
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#2B3056]">
                Gunakan Tombol Panah Keyboard
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Anda juga dapat menekan tombol <strong>← Panah Kiri</strong> dan <strong>→ Panah Kanan</strong> pada keyboard untuk menggeser panduan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak Panduan Lengkap</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default PanduanPage;
