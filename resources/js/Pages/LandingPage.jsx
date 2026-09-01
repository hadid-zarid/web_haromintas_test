import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicNavbar from '../components/layout/PublicNavbar';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';
import logoPengayoman from '../assets/logo_pengayoman.png';
import harmonitasMascot3d from '../assets/harmonitas_mascot_3d.png';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  UsersRound,
  FileCheck2,
  FileSpreadsheet,
  Scale,
  ArrowRight,
  ChevronRight,
  BookOpen,
  MapPin,
  Building2,
  Landmark,
  Bot,
  Zap,
  Layers3,
  Mail,
  PhoneCall,
  Check,
  Lock,
  FileOutput,
  FolderCheck,
  Folder,
  Layers,
  Download,
  Eye,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';

/**
 * CustomCursor: Fluid Magnetic Dual-Ring Trailing Cursor
 */
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let rafId;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, .interactive-card');
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const render = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      setTrailingPos({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Center Dot */}
      <div
        className="custom-cursor-dot"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0,
        }}
      />
      {/* Outer Fluid Trailing Ring */}
      <div
        className={`custom-cursor-ring ${isHovered ? 'is-hovered' : ''} ${isClicked ? 'is-clicked' : ''}`}
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
};

/**
 * Reveal Component: Bidirectional Scroll-Triggered Animation Wrapper
 */
const Reveal = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Re-trigger smoothly when scrolling into view
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'none';
    switch (direction) {
      case 'up':
        return 'translateY(24px)';
      case 'down':
        return 'translateY(-24px)';
      case 'left':
        return 'translateX(-24px)';
      case 'right':
        return 'translateX(24px)';
      case 'scale':
        return 'scale(0.96)';
      default:
        return 'translateY(24px)';
    }
  };

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
      style={{
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

export const LandingPage = () => {
  const { auth } = usePage().props || {};
  const user = auth?.user;

  const heroFeatures = [
    {
      label: 'Permohonan Ranperda & Ranperkada',
      desc: 'Pendaftaran berkas regulasi daerah terstruktur',
      icon: FileSpreadsheet,
    },
    {
      label: 'Alur 2 Tahap (7 Slot Dokumen)',
      desc: 'Harmonisasi Kanwil & Fasilitasi Biro Hukum',
      icon: Layers3,
    },
    {
      label: 'Asisten AI Pra-Harmonisasi',
      desc: 'Pemindaian kesesuaian format & konsiderans',
      icon: Bot,
      isAi: true,
    },
    {
      label: 'Generator Draf Surat Resmi',
      desc: 'Otomasi draf surat selesai harmonisasi (.docx)',
      icon: FileOutput,
    },
  ];

  const benefits = [
    {
      number: '01',
      title: 'Satu Pintu Layanan Digital',
      description:
        'Mengintegrasikan Tim Kerja Kanwil Kemenkum Provinsi Riau, Biro Hukum Setda Provinsi Riau, dan Bagian Hukum Kabupaten/Kota dalam satu portal terpadu.',
      icon: Zap,
      tag: 'Akses Terpadu',
      points: [
        'Akses berbasis peran pengguna & wilayah kerja',
        'Pelacakan status permohonan real-time',
        'Notifikasi progres berkas otomatis ke pemohon',
      ],
      footerNote: 'Kolaborasi Kanwil & Biro Hukum',
    },
    {
      number: '02',
      title: 'Standarisasi 7 Slot Dokumen',
      description:
        'Struktur berkas digital yang rapi dan terstandar mulai dari draf awal hingga penetapan keputusan akhir.',
      icon: FolderCheck,
      tag: 'Tata Kelola Berkas',
      points: [
        'Tahap I: 5 Dokumen Harmonisasi Kanwil Riau',
        'Tahap II: 2 Dokumen Fasilitasi Biro Hukum Setda',
        'Pratinjau langsung di web (inline preview) & unduh aman',
      ],
      footerNote: '7 Slot Berkas Terstandarisasi',
    },
    {
      number: '03',
      title: 'Kualitas & Kepastian Regulasi',
      description:
        'Memastikan keselarasan materi muatan peraturan perundang-undangan daerah sesuai kaidah baku UU No. 12 Tahun 2011.',
      icon: ShieldCheck,
      tag: 'Kaidah Hukum Baku',
      points: [
        'Penyelarasan hierarki dengan peraturan lebih tinggi',
        'Pencatatan matriks perubahan pleno yang akuntabel',
        'Penerbitan surat hasil harmonisasi bertandatangan resmi',
      ],
      footerNote: 'SOP Kanwil Kemenkum Provinsi Riau',
    },
  ];

  const unifiedWorkflowSteps = [
    {
      step: '01',
      stage: 'Tahap I: Pra-Harmonisasi',
      title: 'Pendaftaran & Berkas Awal',
      actor: 'Pemda Pemohon & Tim Kerja',
      description: 'Pemerintah daerah mendaftarkan permohonan Ranperda/Ranperkada dan mengunggah berkas rancangan awal beserta naskah akademik/analisis konsepsi.',
      slots: [
        { slot: 'Slot 1', name: 'Draft Rancangan Awal', ext: 'PDF/DOCX' },
        { slot: 'Slot 2', name: 'Dokumen Analisis Konsepsi', ext: 'PDF' },
      ],
      icon: FileSpreadsheet,
      badgeColor: 'bg-blue-50 text-blue-900 border-blue-200',
    },
    {
      step: '02',
      stage: 'Tahap I: Pleno Harmonisasi',
      title: 'Rapat Pleno & Draf Bersih',
      actor: 'Perancang PUU & Pemda',
      description: 'Pembahasan materi muatan pasal per pasal bersama Perancang Peraturan Kanwil Kemenkum Provinsi Riau, menghasilkan matriks perubahan dan draf bersih.',
      slots: [
        { slot: 'Slot 3', name: 'Matriks Perubahan Sandingan', ext: 'DOCX' },
        { slot: 'Slot 4', name: 'Draft Bersih Hasil Harmonisasi', ext: 'PDF' },
      ],
      icon: UsersRound,
      badgeColor: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    },
    {
      step: '03',
      stage: 'Tahap I: Pengesahan Kanwil',
      title: 'Pengesahan Surat Harmonisasi',
      actor: 'Kakanwil / Kadiv Pelayanan Hukum',
      description: 'Validasi kelengkapan berkas pleno dan pengesahan Surat Hasil Harmonisasi resmi Kanwil Kemenkum Provinsi Riau sebagai syarat lanjut ke fasilitasi.',
      slots: [
        { slot: 'Slot 5', name: 'Surat Hasil Harmonisasi Kanwil', ext: 'PDF RESMI' },
      ],
      icon: Scale,
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      step: '04',
      stage: 'Tahap II: Fasilitasi Provinsi',
      title: 'Fasilitasi & Keputusan Akhir',
      actor: 'Biro Hukum Setda Provinsi Riau',
      description: 'Penelaahan berkas oleh Biro Hukum Provinsi Riau, penyusunan matriks fasilitasi, dan penerbitan Surat Keputusan Fasilitasi hingga status Selesai.',
      slots: [
        { slot: 'Slot 6', name: 'Matriks Hasil Fasilitasi', ext: 'DOCX' },
        { slot: 'Slot 7', name: 'Surat Keputusan Fasilitasi', ext: 'PDF RESMI' },
      ],
      icon: CheckCircle2,
      badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
  ];

  const teamWorkAreas = [
    {
      name: 'Tim Kerja I',
      roman: 'I',
      tagline: 'Wilayah Pesisir & Sentral Provinsi',
      totalRanperda: '5 Daerah Terfasilitasi',
      wilayah: [
        { name: 'Pemerintah Provinsi Riau', type: 'Pusat Pemprov', isGov: true },
        { name: 'Kabupaten Siak', type: 'Kabupaten' },
        { name: 'Kabupaten Kampar', type: 'Kabupaten' },
        { name: 'Kabupaten Indragiri Hilir', type: 'Kabupaten' },
        { name: 'Kabupaten Bengkalis', type: 'Kabupaten' },
      ],
    },
    {
      name: 'Tim Kerja II',
      roman: 'II',
      tagline: 'Wilayah Utara & Selat Melaka',
      totalRanperda: '4 Daerah Terfasilitasi',
      wilayah: [
        { name: 'Kabupaten Rokan Hulu', type: 'Kabupaten' },
        { name: 'Kabupaten Indragiri Hulu', type: 'Kabupaten' },
        { name: 'Kabupaten Kepulauan Meranti', type: 'Kabupaten' },
        { name: 'Kota Dumai', type: 'Kota', isCity: true },
      ],
    },
    {
      name: 'Tim Kerja III',
      roman: 'III',
      tagline: 'Pusat Ibukota & Wilayah Daratan',
      totalRanperda: '4 Daerah Terfasilitasi',
      wilayah: [
        { name: 'Kota Pekanbaru', type: 'Ibukota Provinsi', isCapital: true },
        { name: 'Kabupaten Pelalawan', type: 'Kabupaten' },
        { name: 'Kabupaten Kuantan Singingi', type: 'Kabupaten' },
        { name: 'Kabupaten Rokan Hilir', type: 'Kabupaten' },
      ],
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 antialiased font-sans">
      <Head title="HARMONITAS - Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas" />

      {/* Fluid Interactive Custom Cursor */}
      <CustomCursor />

      <PublicNavbar />

      <main>
        {/* =========================================================================
            SECTION 1: HERO SECTION
            ========================================================================= */}
        <section
          id="beranda"
          className="relative scroll-mt-28 overflow-hidden border-b border-slate-200 bg-white pt-8 pb-14 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20"
        >
          {/* Subtle Background Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #2B3056 1px, transparent 1px),
                linear-gradient(to bottom, #2B3056 1px, transparent 1px)
              `,
              backgroundSize: "36px 36px",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">

              {/* Left Column: Hero Content */}
              <div className="lg:col-span-7">
                <Reveal direction="up" delay={0} className="space-y-6">

                  {/* Institutional Badge */}
                  <span className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#2B3056] shadow-xs">
                    <span className="flex h-5 w-5 items-center justify-center shrink-0">
                      <img
                        src={logoPengayoman}
                        alt="Logo Pengayoman"
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <span>Kantor Wilayah Kementerian Hukum Riau</span>
                  </span>

                  {/* Main Headline */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2B3056] leading-[1.18]">
                    Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas
                  </h1>

                  {/* Subtitle / Lead Paragraph */}
                  <p className="text-base sm:text-lg font-normal text-slate-700 leading-relaxed max-w-2xl">
                    Mewujudkan sinergi terintegrasi untuk regulasi daerah yang berkualitas, efektif, dan berdaya guna.
                  </p>

                  {/* 4 Feature Cards (Bento Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {heroFeatures.map((feat) => {
                      const Icon = feat.icon;
                      return (
                        <div
                          key={feat.label}
                          className="interactive-card flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:border-[#2B3056]/30 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#2B3056]">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-bold text-[#2B3056] leading-snug truncate">
                                {feat.label}
                              </span>
                              {feat.isAi && (
                                <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-xs font-bold text-amber-800 shrink-0">
                                  AI
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs sm:text-sm text-slate-600 font-normal truncate">
                              {feat.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Call to Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-2">
                    <Link
                      href={user ? "/home" : "/login"}
                      className="inline-flex h-12 sm:h-13 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 px-7 text-sm sm:text-base font-bold text-[#2B3056] shadow-md transition duration-200 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>{user ? 'Buka Dashboard Utama' : 'Masuk ke Dashboard'}</span>
                      <ArrowRight className="h-4.5 w-4.5 text-[#2B3056]" />
                    </Link>

                    <a
                      href="#alur"
                      className="inline-flex h-12 sm:h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#2B3056] transition shadow-xs"
                    >
                      <BookOpen className="h-4.5 w-4.5 text-[#FFC800]" />
                      <span>Pelajari Alur SOP</span>
                    </a>
                  </div>

                  {/* Bottom Assurance Note */}
                  <div className="flex items-center gap-2.5 pt-1 text-xs sm:text-sm font-medium text-slate-600">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                    <span>Layanan resmi berstandar SOP Kanwil Kementerian Hukum Riau</span>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: 3D Mascot Illustration with Smooth Floating Micro-Animations */}
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] sm:min-h-[420px] lg:min-h-[460px]">
                <Reveal direction="right" delay={150} className="w-full flex flex-col items-center justify-center">

                  {/* Floating Badges with Dynamic CSS Floating Animations */}
                  <div className="animate-float-badge1 absolute top-4 left-2 sm:-left-2 z-20 flex h-13 w-13 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#2B3056] shadow-lg">
                    <Scale className="h-6 w-6 text-[#2B3056]" />
                  </div>

                  <div className="animate-float-badge2 absolute top-8 -right-2 sm:-right-4 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFD82B]/80 bg-white shadow-lg">
                    <ShieldCheck className="h-6 w-6 text-[#B3912D]" />
                  </div>

                  <div className="animate-float-badge1 absolute bottom-8 left-4 sm:left-0 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-white shadow-lg" style={{ animationDelay: '1.5s' }}>
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>

                  {/* 3D Mascot with Smooth Floating Animation */}
                  <div className="animate-float-slow relative flex flex-col items-center justify-center z-10 select-none">
                    <img
                      src={harmonitasMascot3d}
                      alt="Maskot HARMONITAS Kanwil Kemenkum Provinsi Riau"
                      className="w-full max-w-[400px] sm:max-w-[440px] lg:max-w-[470px] h-auto object-contain drop-shadow-xl select-none pointer-events-none"
                    />
                    <div className="w-56 sm:w-64 h-5 rounded-xl bg-slate-400/20 blur-md mt-[-14px] pointer-events-none" />
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: KEUNGGULAN LAYANAN (Enriched with Visual Indicators)
            ========================================================================= */}
        <section id="tentang" className="scroll-mt-28 bg-white py-16 sm:py-20 border-b border-slate-200 overflow-hidden">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">

            {/* Section Header */}
            <Reveal direction="up" delay={0}>
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2B3056]/10 border border-[#2B3056]/15 text-xs font-bold uppercase tracking-wider text-[#2B3056]">
                  <span className="h-2 w-2 rounded-sm bg-[#FFC800]" />
                  Keunggulan Sistem
                </span>
                <h2 className="mt-3.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2B3056]">
                  Solusi Terpadu Harmonisasi Produk Hukum Daerah
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base font-normal text-slate-600 leading-relaxed">
                  Mewujudkan proses perancangan peraturan yang taat asas, transparan, dan terkoordinasi antar instansi pemerintah.
                </p>
              </div>
            </Reveal>

            {/* 3 Clean Benefit Cards with Visual Footer Seals */}
            <div className="mt-12 grid gap-8 md:grid-cols-3 relative">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;

                return (
                  <Reveal key={benefit.title} direction="up" delay={idx * 120 + 50} className="h-full">
                    <div className="interactive-card flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-[#2B3056]/30 transition-all duration-200">

                      <div>
                        {/* Top Row: Icon, Tag & Number */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2B3056] text-[#FFD82B] shadow-xs">
                            <Icon className="h-6 w-6" />
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-lg border border-[#2B3056]/15 bg-[#2B3056]/5 px-2.5 py-1 text-xs font-bold text-[#2B3056]">
                              {benefit.tag}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-400">
                              #{benefit.number}
                            </span>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="mt-5 text-lg sm:text-xl font-bold text-[#2B3056] leading-snug">
                          {benefit.title}
                        </h3>

                        <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                          {benefit.description}
                        </p>

                        {/* Feature Checklist */}
                        <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-100">
                          {benefit.points.map((point, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2.5">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 mt-0.5">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </span>
                              <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Note */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5 text-[#2B3056]">
                          <ShieldCheck className="h-4 w-4 text-[#B3912D]" />
                          <span>{benefit.footerNote}</span>
                        </span>
                        <span className="text-slate-400 font-mono text-xs">
                          Standar #{benefit.number}
                        </span>
                      </div>

                    </div>
                  </Reveal>
                );
              })}
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 3: ALUR PROSEDUR & 7 SLOT DOKUMEN (Enriched with Realistic Slot Cards)
            ========================================================================= */}
        <section id="alur" className="border-b border-slate-200 bg-slate-50/60 py-16 sm:py-20 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

            {/* Header Section */}
            <Reveal direction="up" delay={0}>
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2B3056]/10 border border-[#2B3056]/15 text-xs font-bold uppercase tracking-wider text-[#2B3056]">
                  <Layers3 className="h-3.5 w-3.5 text-[#FFC800]" />
                  Alur Prosedur &amp; 7 Slot Dokumen
                </span>
                <h2 className="mt-3.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2B3056]">
                  Tahapan Harmonisasi &amp; Pengelolaan Dokumen
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base font-normal text-slate-600 leading-relaxed">
                  Alur operasional terintegrasi dari pendaftaran permohonan oleh pemda hingga penetapan keputusan akhir, mencakup pengelolaan 7 slot berkas digital resmi.
                </p>
              </div>
            </Reveal>

            {/* 4 Unified Process & Document Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {unifiedWorkflowSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <Reveal key={step.step} direction="up" delay={index * 80 + 50}>
                    <div className="interactive-card flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#2B3056]/30 hover:shadow-md transition-all duration-200">
                      <div>
                        {/* Step Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] text-sm font-black shadow-xs">
                            {step.step}
                          </span>

                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${step.badgeColor}`}>
                            {step.stage}
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <h3 className="mt-4 text-base font-bold text-[#2B3056]">
                          {step.title}
                        </h3>

                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Document Slots Section (Enriched with Extension Badges) */}
                        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Berkas Terkait:
                          </p>
                          <div className="space-y-1.5">
                            {step.slots.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100/80 transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-extrabold text-[#2B3056] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10.5px] shrink-0">
                                    {s.slot}
                                  </span>
                                  <span className="font-semibold truncate text-[11.5px]">{s.name}</span>
                                </div>

                                <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.5 bg-slate-200/80 text-slate-600 rounded shrink-0">
                                  {s.ext}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Penanggung Jawab:</span>
                        <span className="font-bold text-[#2B3056] truncate max-w-[130px]">{step.actor}</span>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 4: ASISTEN AI & DRAFT GENERATOR (Enriched with Authentic Mockups)
            ========================================================================= */}
        <section id="fitur" className="bg-white py-16 sm:py-20 border-b border-slate-200 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

            {/* Header Section */}
            <Reveal direction="up" delay={0}>
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2B3056]/10 border border-[#2B3056]/15 text-xs font-bold uppercase tracking-wider text-[#2B3056]">
                  <span className="h-2 w-2 rounded-sm bg-[#FFC800]" />
                  Fitur Penunjang Produktivitas
                </span>
                <h2 className="mt-3.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2B3056]">
                  Asisten AI &amp; Generator Draf Surat Otomatis
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base font-normal text-slate-600 leading-relaxed">
                  Fitur pendukung terintegrasi untuk membantu Tim Perancang dan Bagian Hukum mempercepat telaah awal naskah serta administrasi surat selesai harmonisasi.
                </p>
              </div>
            </Reveal>

            {/* 2 Focused Cards with Authentic Visual Mockup Previews */}
            <div className="grid gap-8 lg:grid-cols-2">

              {/* Card 1: Asisten AI Pra-Harmonisasi with Document Inspection Mockup */}
              <Reveal direction="left" delay={80} className="h-full">
                <div className="interactive-card flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-200">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2B3056] text-[#FFD82B]">
                        <Bot className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#2B3056]">
                          Asisten AI Pra-Harmonisasi
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Pemindaian naskah format .pdf, .doc, dan .docx
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Membantu perancang mendeteksi potensi ketidaksesuaian kaidah legal drafting, struktur penomoran pasal/ayat, dan format konsiderans sebelum pelaksanaan rapat pleno.
                    </p>

                    {/* Authentic Document Scanner Mockup Box with Simple Scan Animation */}
                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 relative overflow-hidden">
                      {/* Animated Scanning Laser Beam */}
                      <div className="pointer-events-none absolute inset-x-0 -top-2 z-10 animate-scan-line">
                        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FFC800] to-transparent shadow-[0_0_10px_rgba(255,200,0,0.85)]" />
                        <div className="h-9 w-full bg-gradient-to-b from-[#FFD82B]/15 via-[#FFD82B]/5 to-transparent" />
                      </div>

                      <div className="relative z-0">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80">
                          <span className="font-bold text-[#2B3056] flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-[#B3912D]" />
                            Pratinjau Telaah Naskah Digital
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            Hasil: 100% Sesuai
                          </span>
                        </div>

                        <div className="mt-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                              Kaidah Penulisan Legal Drafting
                            </span>
                            <span className="font-bold text-slate-800 text-[11px]">Terpenuhi</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                              Struktur Hierarki Pasal &amp; Ayat
                            </span>
                            <span className="font-bold text-slate-800 text-[11px]">Valid</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                              Kesesuaian Konsiderans Mengingat
                            </span>
                            <span className="font-bold text-slate-800 text-[11px]">UU 12/2011</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5 text-[#2B3056]">
                      <ShieldCheck className="h-4 w-4 text-[#B3912D]" />
                      <span>Alat Bantu Asisten Perancang</span>
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Sistem Aktif
                    </span>
                  </div>
                </div>
              </Reveal>

              {/* Card 2: Generator Draf Surat Selesai (.docx) with Word Document Mockup */}
              <Reveal direction="right" delay={120} className="h-full">
                <div className="interactive-card flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-200">
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2B3056] text-[#FFD82B]">
                        <FileOutput className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#2B3056]">
                          Generator Draf Surat Resmi (.docx)
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Tata naskah dinas resmi Kanwil Kemenkum Provinsi Riau
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Membuat draf surat selesai harmonisasi secara instan dan otomatis sesuai format baku Surat Selesai PERDA dan Surat Selesai PERKADA.
                    </p>

                    {/* Authentic Word Template Preview Box */}
                    <div className="mt-5 rounded-xl border border-blue-200/80 bg-blue-50/40 p-4 relative">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-blue-200/60">
                        <span className="font-bold text-[#2B3056] flex items-center gap-1.5">
                          <FileOutput className="h-3.5 w-3.5 text-blue-700" />
                          Template Surat Selesai Harmonisasi
                        </span>
                        <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                          Format Word (.DOCX)
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-700">
                          <span>Kop Surat Kedinasan:</span>
                          <span className="font-bold text-[#2B3056] text-[11px]">Kanwil Kemenkum Riau</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                          <span>Format Penomoran:</span>
                          <span className="font-mono text-[11px] font-bold text-slate-800">W.4-PP.04.02-XXXX</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                          <span>Pilihan Jenis Regulasi:</span>
                          <span className="font-bold text-slate-800 text-[11px]">PERDA &amp; PERKADA</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5 text-[#2B3056]">
                      <FileCheck2 className="h-4 w-4 text-[#B3912D]" />
                      <span>Template Baku Resmi Kanwil</span>
                    </span>
                    <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      Ekspor .DOCX
                    </span>
                  </div>
                </div>
              </Reveal>

            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 5: WILAYAH TIM KERJA (Clean standard rounded-2xl, No button)
            ========================================================================= */}
        <section
          id="wilayah"
          className="scroll-mt-28 bg-slate-50/70 py-16 sm:py-24 border-b border-slate-200 overflow-hidden relative"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Section Header */}
            <Reveal direction="up" delay={0}>
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2B3056]/10 border border-[#2B3056]/15 text-xs font-bold uppercase tracking-wider text-[#2B3056]">
                  <span className="h-2 w-2 rounded-sm bg-[#FFC800]" />
                  Pembagian Wilayah Kerja
                </span>

                <h2 className="mt-3.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2B3056]">
                  Cakupan Tim Kerja Kanwil Kemenkum Provinsi Riau
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base font-normal text-slate-600 leading-relaxed">
                  Layanan fasilitasi permohonan regulasi untuk 1 Pemerintah Provinsi dan seluruh 12 Kabupaten/Kota di Riau terbagi dalam 3 Tim Kerja Perancang.
                </p>
              </div>
            </Reveal>

            {/* Top Stats Ribbon */}
            <Reveal direction="up" delay={80}>
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] shadow-xs">
                    <Landmark className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-base sm:text-lg font-black text-[#2B3056]">1 Provinsi &amp; 12 Kab/Kota</p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Cakupan Wilayah Administratif</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] shadow-xs">
                    <UsersRound className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-base sm:text-lg font-black text-[#2B3056]">3 Tim Kerja Fasilitasi</p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Perancang Peraturan Kanwil Riau</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] shadow-xs">
                    <FolderCheck className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-base sm:text-lg font-black text-[#2B3056]">7 Slot Berkas Digital</p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Standar Dokumen Harmonisasi &amp; Fasilitasi</p>
                  </div>
                </div>

              </div>
            </Reveal>

            {/* 3 Clean Team Cards */}
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {teamWorkAreas.map((team, idx) => (
                <Reveal key={team.name} direction="up" delay={idx * 100 + 100} className="h-full">
                  <div className="interactive-card flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#2B3056]/30 hover:shadow-md transition-all duration-200">

                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] font-black text-xl shadow-xs">
                            {team.roman}
                          </span>
                          <div>
                            <h3 className="text-lg sm:text-xl font-extrabold text-[#2B3056]">
                              {team.name}
                            </h3>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                              {team.tagline}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg shrink-0">
                          <span className="h-1.5 w-1.5 rounded-sm bg-emerald-500" />
                          Aktif
                        </span>
                      </div>

                      {/* Region Count Badge */}
                      <div className="mt-3.5 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-lg border border-[#2B3056]/15 bg-[#2B3056]/5 px-3 py-1 text-xs font-bold text-[#2B3056]">
                          {team.totalRanperda}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          Wilayah Binaan
                        </span>
                      </div>

                      {/* Region List */}
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Daftar Wilayah Binaan:
                        </p>
                        <div className="space-y-2 pt-1">
                          {team.wilayah.map((w) => (
                            <div
                              key={w.name}
                              className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#2B3056] text-[#FFD82B]">
                                  {w.isGov ? (
                                    <Landmark className="h-3.5 w-3.5" />
                                  ) : w.isCapital || w.isCity ? (
                                    <Building2 className="h-3.5 w-3.5" />
                                  ) : (
                                    <MapPin className="h-3.5 w-3.5" />
                                  )}
                                </span>
                                <span className="truncate font-bold text-[#2B3056]">{w.name}</span>
                              </div>

                              <span
                                className={`text-xs font-bold shrink-0 px-2 py-0.5 rounded-md ${w.isGov
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : w.isCapital
                                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                      : w.isCity
                                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                        : 'bg-slate-200/80 text-slate-700'
                                  }`}
                              >
                                {w.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Clean Footer Note (NO button) */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center justify-between">
                      <span>Kanwil Kemenkum Provinsi Riau</span>
                      <span className="font-bold text-[#2B3056]">{team.wilayah.length} Daerah</span>
                    </div>

                  </div>
                </Reveal>
              ))}
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 6: BANNER CTA
            ========================================================================= */}
        <section className="bg-slate-50/70 py-16 sm:py-20 overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal direction="scale" delay={50}>
              <div className="rounded-2xl border border-[#3A4070] bg-gradient-to-r from-[#2B3056] via-[#323963] to-[#2B3056] p-8 sm:p-10 lg:p-12 text-white shadow-xl">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">

                  {/* Headline & Action Buttons */}
                  <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
                    <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFD82B]">
                      <ShieldCheck className="h-4 w-4 text-[#FFD82B]" />
                      Portal Resmi Harmonisasi &amp; Fasilitasi Regulasi
                    </span>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                      Akses Layanan HARMONITAS Kanwil Kemenkum Provinsi Riau
                    </h2>

                    <p className="text-sm sm:text-base font-normal leading-relaxed text-slate-200 max-w-2xl">
                      Gunakan akun resmi Tim Kerja Kanwil Kemenkum Provinsi Riau, Biro Hukum Setda Provinsi Riau, atau Bagian Hukum Kabupaten/Kota untuk mengelola dan memantau seluruh proses regulasi daerah.
                    </p>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                      <Link
                        href={user ? "/home" : "/login"}
                        className="inline-flex h-12 sm:h-13 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 px-7 text-sm sm:text-base font-bold text-[#2B3056] shadow-md transition duration-200 hover:-translate-y-0.5 cursor-pointer"
                      >
                        <span>{user ? 'Buka Dashboard Utama' : 'Masuk ke Portal'}</span>
                        <ArrowRight className="h-4.5 w-4.5 text-[#2B3056]" />
                      </Link>

                      <Link
                        href="/panduan"
                        className="inline-flex h-12 sm:h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-6 text-sm sm:text-base font-bold text-white transition duration-200 cursor-pointer"
                      >
                        <BookOpen className="h-4.5 w-4.5 text-[#FFD82B]" />
                        <span>Panduan Penggunaan</span>
                      </Link>
                    </div>
                  </div>

                  {/* Quick Info Box */}
                  <div className="lg:col-span-4">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 space-y-3.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#FFD82B]">
                        Informasi Layanan:
                      </p>

                      <div className="space-y-2.5 text-xs text-slate-200">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#FFD82B] shrink-0" />
                          <span>12 Kabupaten/Kota &amp; 1 Pemprov Riau</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#FFD82B] shrink-0" />
                          <span>3 Tim Kerja Perancang Kanwil</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#FFD82B] shrink-0" />
                          <span>Standarisasi 7 Slot Berkas Digital</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#FFD82B] shrink-0" />
                          <span>Bantuan Asisten AI &amp; Generator .DOCX</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* =========================================================================
          SECTION 7: FOOTER
          ========================================================================= */}
      <footer id="kontak" className="bg-[#2B3056] text-white pt-14 pb-8 border-t border-[#3A4070] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" delay={50}>
            <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-12 text-xs sm:text-sm">

              {/* Brand & Identity Column */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-md border border-white/20">
                    <img src={logoHarmonitas} alt="Logo HARMONITAS" className="h-9 w-auto object-contain" />
                    <img src={logoPengayoman} alt="Logo Pengayoman" className="h-9 w-auto object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black tracking-wider text-white">HARMONITAS</p>
                      <span className="rounded-md bg-[#FFD82B] px-2 py-0.5 text-xs font-extrabold text-[#2B3056]">
                        RIAU
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-300">Kanwil Kemenkum Provinsi Riau</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-md">
                  Sistem Informasi Harmonisasi dan Fasilitasi Ranperda serta Ranperkada terintegrasi untuk mendukung pembentukan regulasi daerah yang berkualitas, berkeadilan, dan taat asas.
                </p>

                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FFD82B]">
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Portal Resmi Kanwil Kemenkum Provinsi Riau</span>
                </div>
              </div>

              {/* Quick Links Column */}
              <div className="md:col-span-3 space-y-3">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFD82B]">Tautan Cepat</h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-normal">
                  <li><a href="#beranda" className="hover:text-[#FFD82B] transition">Beranda</a></li>
                  <li><a href="#tentang" className="hover:text-[#FFD82B] transition">Tentang Sistem</a></li>
                  <li><a href="#alur" className="hover:text-[#FFD82B] transition">Alur &amp; Dokumen</a></li>
                  <li><a href="#fitur" className="hover:text-[#FFD82B] transition">Fitur Penunjang</a></li>
                  <li><a href="#wilayah" className="hover:text-[#FFD82B] transition">Wilayah Tim Kerja</a></li>
                  <li><Link href="/panduan" className="hover:text-[#FFD82B] transition">Panduan Sistem</Link></li>
                </ul>
              </div>

              {/* Contact Column */}
              <div className="md:col-span-4 space-y-3">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFD82B]">Hubungi Kami</h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-normal">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFD82B]">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Email Resmi:</p>
                      <span className="text-slate-300">harmonitas.kanwil@kemenkum.go.id</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFD82B]">
                      <PhoneCall className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Telepon / Hotline:</p>
                      <span className="text-slate-300">(0761) 853000</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFD82B]">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Kantor Wilayah:</p>
                      <span className="text-slate-300">Jl. Jend. Sudirman No. 233, Kota Pekanbaru, Riau</span>
                    </div>
                  </li>
                </ul>
              </div>

            </div>

            <div className="flex flex-col gap-2 pt-6 text-xs text-slate-400 font-normal sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} HARMONITAS • Kantor Wilayah Kementerian Hukum Riau.</p>
              <p className="text-slate-400 font-medium">Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas</p>
            </div>
          </Reveal>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
