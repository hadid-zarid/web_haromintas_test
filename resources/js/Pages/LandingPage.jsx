import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicNavbar from '../components/layout/PublicNavbar';
import logoHarmonitas from '../assets/LOGO HARMONITAS.png';
import logoPengayoman from '../assets/logo_pengayoman.png';
import harmonitasMascot3d from '../assets/harmonitas_mascot_3d.png';
import {
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  UsersRound,
  FileCheck2,
  FileSpreadsheet,
  TrendingUp,
  AlertTriangle,
  Scale,
  Sparkles,
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
  ArrowUpRight,
  Activity,
  Layers,
  ChevronLeft
} from 'lucide-react';

/**
 * Reveal Component: Smooth Scroll-Triggered Animation Wrapper
 */
const Reveal = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
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

/**
 * CustomCursor Component: Elegant dual-ring fluid trailing cursor
 */
const CustomCursor = () => {
  const [position, setPosition] = React.useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = React.useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
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
      const isClickable = target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, article');
      setIsHovered(!!isClickable);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
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

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Sleek Trailing Halo */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full transition-all duration-200 ease-out will-change-transform hidden md:block"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) translate(-50%, -50%) scale(${isClicked ? 0.75 : isHovered ? 1.35 : 1})`,
          width: '26px',
          height: '26px',
          border: isHovered ? '1.5px solid rgba(255, 200, 0, 0.9)' : '1px solid rgba(43, 48, 86, 0.25)',
          backgroundColor: isHovered ? 'rgba(255, 216, 43, 0.12)' : 'rgba(43, 48, 86, 0.03)',
        }}
      />
      {/* Inner Precision Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full will-change-transform hidden md:block transition-all duration-100"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${isClicked ? 0.6 : isHovered ? 0.4 : 1})`,
          width: '6px',
          height: '6px',
          backgroundColor: isHovered ? '#FFC800' : '#2B3056',
          boxShadow: isHovered ? '0 0 8px rgba(255, 200, 0, 0.8)' : '0 0 3px rgba(43, 48, 86, 0.2)',
        }}
      />
    </>
  );
};

export const LandingPage = () => {
  const { auth } = usePage().props || {};
  const user = auth?.user;
  const [hoveredCardIndex, setHoveredCardIndex] = React.useState(null);
  const [activeServiceTab, setActiveServiceTab] = React.useState(0);
  const [activeAiClauseTab, setActiveAiClauseTab] = React.useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = React.useState(0);

  const heroFeatures = [
    {
      label: 'Pengajuan Ranperda & Ranperkada',
      desc: 'E-submission berkas & lampiran terpadu',
      icon: FileSpreadsheet,
      badge: 'Terpadu',
    },
    {
      label: 'Pemeriksaan Status Berkala',
      desc: 'Pelacakan progres telaah transparan',
      icon: CheckCircle2,
      badge: 'Real-time',
    },
    {
      label: 'Telaah Awal Berbantuan AI',
      desc: 'Analisis kesesuaian kaidah peraturan',
      icon: Bot,
      badge: 'AI Powered',
      isAi: true,
    },
    {
      label: 'Arsip Dokumen Terpusat',
      desc: 'Penyimpanan digital aman & terstruktur',
      icon: FileCheck2,
      badge: 'e-Register',
    },
  ];

  const benefits = [
    {
      number: '01',
      title: 'Akses Mudah dan Cepat',
      description:
        'Satu pintu layanan digitalisasi pengajuan dan pemeriksaan dokumen harmonisasi, dapat diakses terpadu kapan saja.',
      icon: Zap,
      tag: 'Efisiensi Layanan',
    },
    {
      number: '02',
      title: 'Proses Lebih Efisien',
      description:
        'Pengajuan, telaah, rapat pleno, validasi, dan pengarsipan terpadu dalam satu alur kerja yang jelas dan terstruktur.',
      icon: Layers3,
      tag: 'Alur Terstandarisasi',
    },
    {
      number: '03',
      title: 'Regulasi Lebih Berkualitas',
      description:
        'Pemeriksaan terstruktur untuk membantu menjaga keselarasan hierarki serta mutu perancangan produk hukum daerah.',
      icon: ShieldCheck,
      tag: 'Kaidah Hukum Tertata',
    },
  ];

  const serviceItems = [
    {
      step: '01',
      label: 'E-Submission & Kelengkapan Berkas',
      desc: 'Unggah berkas draf Ranperda & checklist dokumen permohonan',
      badge: 'Verifikasi Berkas',
      icon: FileCheck2,
      docTitle: 'Ranperda Pajak & Retribusi Daerah (PDRD)',
      docMeta: 'Kabupaten Bengkalis • Register No. 041/PDRD/2026',
      stage: 'Pemeriksaan Berkas Permohonan',
      statusText: 'Berkas Lengkap & Terverifikasi',
      progress: '25%',
      details: [
        { label: 'Surat Permohonan Kepala Daerah', status: 'Format Sesuai' },
        { label: 'Naskah Akademik & Draf Ranperda', status: 'Terunggah (PDF/DOCX)' },
        { label: 'Rekomendasi Bapenda & Dokumen Pendukung', status: 'Terverifikasi' },
      ],
      action: 'Lanjut ke Telaah Awal AI',
    },
    {
      step: '02',
      label: 'Telaah Hukum & Analisis AI',
      desc: 'Deteksi kepatuhan hierarki UU & teknik penyusunan otomatis',
      badge: 'Analisis Cerdas',
      icon: Bot,
      docTitle: 'Ranperda Tata Ruang Wilayah (RTRW) 2026-2046',
      docMeta: 'Kabupaten Siak • Tim Kerja 1 (Harmonisasi)',
      stage: 'Pemeriksaan Kaidah Perancangan UU 12/2011',
      statusText: '2 Rekomendasi Penyelarasan',
      progress: '50%',
      details: [
        { label: 'Penyelarasan Pasal 14 Ayat (2)', status: 'Rekomendasi UU 26/2007' },
        { label: 'Konsistensi Definisi & Frasa Hukum', status: '100% Selaras Kamus' },
        { label: 'Struktur Batang Tubuh & Lampiran', status: 'Sesuai Lampiran II' },
      ],
      action: 'Buka Matriks Telaah AI',
    },
    {
      step: '03',
      label: 'Rapat Pleno & Sandingan Pasal',
      desc: 'Pembahasan bersama Kanwil, Tim Kerja, dan Biro Hukum Pemda',
      badge: 'Sesi Kolaboratif',
      icon: UsersRound,
      docTitle: 'Ranperkada Rencana Detail Tata Ruang (RDTR)',
      docMeta: 'Kabupaten Pelalawan • Tim Kerja 3',
      stage: 'Pembahasan Bersama Tim Ahli & Pemrakarsa',
      statusText: 'Rapat Pleno Berlangsung (12 Peserta)',
      progress: '75%',
      details: [
        { label: 'Matriks Sandingan Pasal Digital', status: 'Sinkronisasi Real-time' },
        { label: 'Catatan Tim Perancang Peraturan', status: '14 Masukan Disepakati' },
        { label: 'Notula Resmi & Draf Perubahan', status: 'Terdokumentasi Otomatis' },
      ],
      action: 'Unduh Notula Berita Acara',
    },
    {
      step: '04',
      label: 'Validasi Akhir & e-Register Arsip',
      desc: 'Persetujuan resmi Kanwil Kemenkumham & sertifikat arsip digital',
      badge: 'Tuntas & Terarsip',
      icon: CheckCircle2,
      docTitle: 'Ranperda Penyelenggaraan Pelayanan Publik',
      docMeta: 'Kota Pekanbaru • Selesai Harmonisasi',
      stage: 'Penerbitan Surat Selesai Harmonisasi',
      statusText: 'Harmonisasi Selesai (e-Register Terbit)',
      progress: '100%',
      details: [
        { label: 'Surat Hasil Harmonisasi Kanwil Riau', status: 'TTE Pejabat Berwenang' },
        { label: 'Draf Bersih Siap Pengundangan', status: 'Final & Terverifikasi' },
        { label: 'Database Cloud Kemenkumham', status: 'Tersimpan Permanen' },
      ],
      action: 'Unduh Dokumen Tervalidasi',
    },
  ];

  const aiClauseCases = [
    {
      tabLabel: 'Pasal 14 (Wewenang)',
      title: 'Pasal 14 Ayat (2) • Sanksi & Delegasi Wewenang',
      category: 'Inkonsistensi Hierarki Wewenang',
      issueLevel: 'Perlu Penyelarasan',
      originalSnippet: 'Ketentuan teknis mengenai tata cara perizinan dan denda administratif diatur lebih lanjut melalui Keputusan Kepala Dinas tanpa persetujuan Kepala Daerah.',
      originalNote: 'Keputusan Kadis tidak dapat memuat norma sanksi atau mengikat publik (UU 12/2011 & UU 23/2014)',
      recommendSnippet: 'Ketentuan lebih lanjut mengenai tata cara perizinan sebagaimana dimaksud pada ayat (1) diatur dengan Peraturan Kepala Daerah.',
      recommendNote: 'Penyelarasan jenis produk hukum delegasi sesuai Pasal 8 ayat (2) UU No. 12 Tahun 2011',
      score: '98.4%',
      confidence: 'Akurasi Tinggi',
      reference: 'Lampiran II Angka 198 UU 12/2011',
    },
    {
      tabLabel: 'Pasal 8 (Sanksi Pidana)',
      title: 'Pasal 8 Ayat (1) • Rumusan Sanksi Pidana',
      category: 'Pelampauan Batas Ancaman Pidana',
      issueLevel: 'Substansi Kritis',
      originalSnippet: 'Setiap orang yang melanggar ketentuan Pasal 5 diancam pidana kurungan paling lama 1 (satu) tahun atau denda paling banyak Rp 100.000.000,00.',
      originalNote: 'Ancaman pidana Perda melampaui batas maksimal 6 bulan kurungan & denda Rp 50.000.000 (Pasal 15 UU 12/2011)',
      recommendSnippet: 'Setiap orang yang melanggar ketentuan sebagaimana dimaksud dalam Pasal 5 diancam pidana kurungan paling lama 6 (enam) bulan atau denda paling banyak Rp 50.000.000,00 (lima puluh juta rupiah).',
      recommendNote: 'Penyesuaian batas maksimal pidana kurungan dan denda Perda sesuai Pasal 15 ayat (2) UU 12/2011',
      score: '99.8%',
      confidence: 'Sangat Akurat',
      reference: 'Pasal 15 UU No. 12 Tahun 2011',
    },
    {
      tabLabel: 'Pasal 27 (Peralihan)',
      title: 'Pasal 27 • Ketentuan Pencabutan Regulasi',
      category: 'Kaidah Teknik Penyusunan Baku',
      issueLevel: 'Redaksional Baku',
      originalSnippet: 'Peraturan lama dinyatakan masih berlaku selama tidak bertentangan dengan peraturan ini.',
      originalNote: 'Rumusan frasa umum tanpa mencantumkan secara tegas nama dan nomor peraturan perundang-undangan yang digantikan',
      recommendSnippet: 'Pada saat Peraturan Daerah ini mulai berlaku, Peraturan Daerah Kabupaten Siak Nomor 4 Tahun 2016 tentang Penataan Ruang dicabut dan dinyatakan tidak berlaku.',
      recommendNote: 'Penyelarasan ketentuan pencabutan eksplisit sesuai Bab IV Lampiran II UU 12/2011',
      score: '97.6%',
      confidence: 'Standar Terpenuhi',
      reference: 'Lampiran II Angka 234 UU 12/2011',
    },
  ];

  const teamWorkAreas = [
    {
      name: 'Tim Kerja I',
      roman: 'I',
      tagline: 'Wilayah Pesisir & Sentral Provinsi',
      totalRanperda: '48+ Tuntas',
      leadInfo: 'Koordinator Wilayah I',
      accentColor: 'from-[#FFD82B] to-[#FFB943]',
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
      totalRanperda: '36+ Tuntas',
      leadInfo: 'Koordinator Wilayah II',
      accentColor: 'from-blue-400 to-indigo-500',
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
      totalRanperda: '52+ Tuntas',
      leadInfo: 'Koordinator Wilayah III',
      accentColor: 'from-emerald-400 to-teal-500',
      wilayah: [
        { name: 'Kota Pekanbaru', type: 'Ibukota Provinsi', isCapital: true },
        { name: 'Kabupaten Pelalawan', type: 'Kabupaten' },
        { name: 'Kabupaten Kuantan Singingi', type: 'Kabupaten' },
        { name: 'Kabupaten Rokan Hilir', type: 'Kabupaten' },
      ],
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Input & Pra-Harmonisasi',
      actor: 'Pemrakarsa & Tim Kerja',
      timeframe: 'Maks. 3 Hari Kerja',
      description: 'Pengunggahan draf Ranperda, Naskah Akademik, dan verifikasi kelengkapan berkas permohonan melalui checklist digital.',
      deliverable: 'Tanda Terima & Berkas Terdaftar',
      icon: FileSpreadsheet,
      color: 'from-amber-400 to-[#FFD82B]',
      accentBg: 'bg-amber-500/10 text-amber-900',
      features: [
        'Unggah draf Ranperda / Ranperkada (.docx & .pdf)',
        'Checklist kelengkapan surat permohonan kepala daerah',
        'Validasi otomatis dokumen Naskah Akademik & pendukung',
      ],
      mockupBadge: 'Tahap 1: Verifikasi Berkas',
      mockupStatus: 'Berkas Lengkap & Terverifikasi',
      mockupDetail: 'Draf Ranperda Pajak & Retribusi Daerah berhasil diverifikasi kelengkapannya.',
    },
    {
      step: '02',
      title: 'Rapat Pleno Harmonisasi',
      actor: 'Kanwil & Tim Ahli Pemda',
      timeframe: 'Sesuai Jadwal Pleno',
      description: 'Pembahasan materi muatan pasal per pasal dan teknik perancangan PUU bersama Perancang Peraturan Kanwil Kemenkumham Riau.',
      deliverable: 'Matriks Sandingan & Notula Pleno',
      icon: UsersRound,
      color: 'from-blue-500 to-indigo-600',
      accentBg: 'bg-blue-500/10 text-blue-900',
      features: [
        'Matriks sandingan pasal per pasal real-time',
        'Penyelarasan norma dengan hierarki peraturan lebih tinggi',
        'Pencatatan notula rapat & kesepakatan berita acara pleno',
      ],
      mockupBadge: 'Tahap 2: Rapat Pleno',
      mockupStatus: 'Pembahasan 24 Pasal Selesai',
      mockupDetail: 'Seluruh masukan teknis redaksional dan substansi telah disepakati dalam Berita Acara.',
    },
    {
      step: '03',
      title: 'Validasi & Penyelarasan',
      actor: 'Biro Hukum & Kanwil',
      timeframe: 'Maks. 2 Hari Kerja',
      description: 'Pemeriksaan draf naskah hasil perbaikan pleno dan validasi kepatuhan hukum oleh Kepala Biro Hukum dan Kanwil Kemenkumham.',
      deliverable: 'Surat Selesai Harmonisasi',
      icon: Scale,
      color: 'from-purple-500 to-indigo-700',
      accentBg: 'bg-purple-500/10 text-purple-900',
      features: [
        'Pemeriksaan draf final hasil perbaikan naskah',
        'Penerbitan surat keterangan selesai harmonisasi',
        'Penandatanganan elektronik (TTE) pejabat berwenang',
      ],
      mockupBadge: 'Tahap 3: Validasi Hukum',
      mockupStatus: 'Surat Kemenkumham Terbit',
      mockupDetail: 'Surat Hasil Harmonisasi telah disahkan dan siap untuk proses fasilitasi/pengundangan.',
    },
    {
      step: '04',
      title: 'Tuntas & Arsip Digital',
      actor: 'Sekda & Bagian Hukum',
      timeframe: 'Pengundangan Resmi',
      description: 'Penerbitan nomor registrasi (e-Register), pengundangan dalam Lembaran Daerah, dan penyimpanan permanen pada repositori Kanwil.',
      deliverable: 'e-Register & Arsip Cloud',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      accentBg: 'bg-emerald-500/10 text-emerald-900',
      features: [
        'Pemberian nomor register resmi regulasi (e-Register)',
        'Penyimpanan arsip digital aman di cloud Kanwil Kemenkumham',
        'Akses riwayat dokumen dapat ditelusuri kapan saja',
      ],
      mockupBadge: 'Tahap 4: Tuntas & Terarsip',
      mockupStatus: 'Nomor e-Register Diterbitkan',
      mockupDetail: 'Regulasi resmi terarsip secara digital dan dapat diakses publik/instansi terkait.',
    },
  ];

  const getCardDeckClasses = (idx) => {
    if (hoveredCardIndex === null) {
      if (idx === 0) return 'lg:-rotate-1 lg:translate-y-0';
      if (idx === 1) return 'lg:rotate-0 lg:-translate-y-0.5';
      if (idx === 2) return 'lg:rotate-1 lg:translate-y-0';
      return '';
    }

    if (hoveredCardIndex === idx) {
      return 'lg:-translate-y-4 lg:scale-[1.035] lg:rotate-0 z-30 shadow-2xl border-[#2B3056]/40 ring-4 ring-[#FFD82B]/25';
    }

    if (hoveredCardIndex === 0) {
      if (idx === 1) return 'lg:translate-x-3 lg:translate-y-1 lg:rotate-1 lg:scale-[0.98] opacity-85 z-10';
      if (idx === 2) return 'lg:translate-x-6 lg:translate-y-2 lg:rotate-2 lg:scale-[0.96] opacity-75 z-0';
    }

    if (hoveredCardIndex === 1) {
      if (idx === 0) return 'lg:-translate-x-3 lg:translate-y-1 lg:-rotate-2 lg:scale-[0.98] opacity-85 z-10';
      if (idx === 2) return 'lg:translate-x-3 lg:translate-y-1 lg:rotate-2 lg:scale-[0.98] opacity-85 z-10';
    }

    if (hoveredCardIndex === 2) {
      if (idx === 0) return 'lg:-translate-x-6 lg:translate-y-2 lg:-rotate-2 lg:scale-[0.96] opacity-75 z-0';
      if (idx === 1) return 'lg:-translate-x-3 lg:translate-y-1 lg:-rotate-1 lg:scale-[0.98] opacity-85 z-10';
    }

    return '';
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 antialiased font-sans">
      <CustomCursor />
      <Head title="HARMONITAS - Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas" />
      <PublicNavbar />

      <main>
        {/* =========================================================================
            SECTION 1: HERO SECTION (Luminous Soft Navy Gradient Background)
            ========================================================================= */}
        <section
          id="beranda"
          className="relative scroll-mt-28 overflow-hidden border-b border-slate-200 bg-white pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16"
        >
          {/* Background Layer 1: Structured Micro Grid with Slow Subtle Drift Animation */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.045] animate-hero-grid"
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

          {/* Background Layer 2: Subtle Ambient Warmth with Slow Organic Breathing */}
          <div
            className="absolute -top-16 right-1/4 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl animate-hero-glow-1"
            style={{
              background: "radial-gradient(circle, rgba(255, 216, 43, 0.14) 0%, rgba(255, 255, 255, 0) 70%)",
            }}
          />
          <div
            className="absolute -bottom-16 left-10 w-80 h-80 rounded-full pointer-events-none opacity-25 blur-3xl animate-hero-glow-2"
            style={{
              background: "radial-gradient(circle, rgba(43, 48, 86, 0.09) 0%, rgba(255, 255, 255, 0) 70%)",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">

              {/* Left Column: Hero Content with Reveal Animation */}
              <div className="lg:col-span-7">
                <Reveal direction="up" delay={0} className="space-y-5">
                  <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2B3056] shadow-2xs backdrop-blur-md">
                    <span className="flex h-4 w-4 items-center justify-center shrink-0">
                      <img
                        src={logoPengayoman}
                        alt="Logo Pengayoman"
                        className="h-full w-full object-contain"
                      />
                    </span>
                    Kantor Wilayah Kementerian Hukum Riau
                  </span>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2B3056] leading-[1.15]">
                    Harmonisasi Regulasi Daerah yang Lebih Tertata
                  </h1>

                  <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed max-w-2xl pt-1">
                    Kelola pengajuan, telaah, pembahasan, validasi, dan arsip Ranperda serta Ranperkada dalam satu layanan digital resmi yang terintegrasi.
                  </p>

                  {/* 4 Feature Micro-Cards in 2x2 Bento Grid with Interactive Hover & Animations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {heroFeatures.map((feat) => {
                      const Icon = feat.icon;
                      return (
                        <div
                          key={feat.label}
                          className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#2B3056]/35 hover:shadow-md cursor-pointer backdrop-blur-sm"
                        >
                          {/* Subtle Ambient Hover Gradient Glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/60 via-transparent to-amber-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                          {/* Left Accent Indicator Bar on Hover */}
                          <span className="absolute left-0 inset-y-2 w-1 rounded-r-full bg-[#FFD82B] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:inset-y-1" />

                          <div className="relative z-10 flex items-center gap-3 min-w-0">
                            {/* Icon Container with smooth tilt & rotation */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100/90 border border-slate-200/80 text-[#2B3056] shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[#2B3056] group-hover:text-[#FFD82B] group-hover:shadow-sm">
                              <Icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-105" />
                            </div>

                            {/* Text Content */}
                            <div className="min-w-0 pr-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-[#2B3056] group-hover:text-[#3A4070] transition-colors leading-tight truncate">
                                  {feat.label}
                                </span>
                                {feat.isAi && (
                                  <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-100/90 border border-amber-300/60 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-900 shrink-0">
                                    <Sparkles className="h-2.5 w-2.5 text-amber-600" />
                                    AI
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-[10.5px] text-slate-500 font-normal truncate group-hover:text-slate-600 transition-colors">
                                {feat.desc}
                              </p>
                            </div>
                          </div>

                          {/* Right Arrow Hover Action */}
                          <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-[#FFD82B] group-hover:text-[#2B3056]">
                            <ChevronRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Call to Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href={user ? "/home" : "/login"}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 px-6 text-xs font-bold text-[#2B3056] shadow-sm transition duration-200 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>{user ? 'Buka Dashboard' : 'Masuk ke Dashboard'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <a
                      href="#alur"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#2B3056] transition shadow-2xs"
                    >
                      <BookOpen className="h-4 w-4 text-[#FFC800]" />
                      <span>Pelajari Alur</span>
                    </a>
                  </div>

                  {/* Bottom Assurance Note */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-slate-500">
                    <span className="flex h-4 w-4 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>Layanan resmi untuk mendukung harmonisasi produk hukum daerah</span>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Clean Free-Standing 3D Mascot Workstation with Slide-in Animation */}
              <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]">
                <Reveal direction="right" delay={150} className="w-full flex items-center justify-center">
                  {/* Ambient Soft Glow Behind Illustration */}
                  <div
                    className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full pointer-events-none opacity-55 blur-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 216, 43, 0.20) 0%, rgba(43, 48, 86, 0.05) 55%, transparent 75%)'
                    }}
                  />

                  {/* Floating Minimal Icon 1: Top-Left (Timbangan Keadilan) */}
                  <div className="absolute top-4 left-2 sm:-left-2 z-20 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/90 bg-white/95 text-[#2B3056] shadow-lg backdrop-blur-md animate-float-badge1 hover:scale-110 transition-all duration-300">
                    <Scale className="h-6 w-6 text-[#2B3056]" />
                  </div>

                  {/* Floating Minimal Icon 2: Top-Right (Pengayoman / Shield) */}
                  <div className="absolute top-8 -right-2 sm:-right-4 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#FFD82B]/60 bg-white/95 shadow-lg backdrop-blur-md animate-float-badge2 hover:scale-110 transition-all duration-300">
                    <ShieldCheck className="h-5 w-5 text-[#B3912D]" />
                  </div>

                  {/* Floating Minimal Icon 3: Bottom-Left (Validasi Tuntas) */}
                  <div className="absolute bottom-8 left-4 sm:left-0 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-white/95 shadow-lg backdrop-blur-md animate-float-badge1 hover:scale-110 transition-all duration-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>

                  {/* Floating Minimal Icon 4: Bottom-Right (Arsip Dokumen) */}
                  <div className="absolute bottom-12 -right-2 sm:right-2 z-20 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/90 bg-white/95 text-[#2B3056] shadow-lg backdrop-blur-md animate-float-badge2 hover:scale-110 transition-all duration-300">
                    <FileCheck2 className="h-5 w-5 text-[#2B3056]" />
                  </div>

                  {/* Free-Standing 3D System Illustration with Mascot Character */}
                  <div className="relative flex flex-col items-center justify-center z-10 select-none group cursor-pointer">
                    <img
                      src={harmonitasMascot3d}
                      alt="Ilustrasi Digital Workspace Harmonisasi Regulasi HARMONITAS bersama Maskot Kanwil Kemenkumham Riau"
                      className="w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[490px] h-auto object-contain drop-shadow-2xl animate-float-slow transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-2 select-none pointer-events-none"
                    />
                    {/* Organic Soft Ground Shadow */}
                    <div className="w-56 sm:w-64 h-5 rounded-full bg-slate-400/25 blur-md mt-[-14px] pointer-events-none transition-all duration-500 group-hover:scale-105 group-hover:opacity-75" />
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
    SECTION 2: KEUNGGULAN LAYANAN (CARD RINGKAS & FLIP DETAIL)
    ========================================================================= */}
        <section id="tentang" className="scroll-mt-28 bg-white py-12 sm:py-16 border-b border-slate-200 overflow-hidden">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">

            {/* SECTION HEADER */}
            <Reveal direction="up" delay={0}>
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#2B3056]/10 border border-[#2B3056]/15 text-[10px] font-black uppercase tracking-widest text-[#2B3056]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFC800] animate-ping" />
                  Keunggulan Layanan
                </span>
                <h2 className="mt-2.5 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#2B3056]">
                  Mendukung Proses yang Lebih Terarah
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-xs font-medium text-slate-600 leading-relaxed">
                  Arahkan kursor ke kartu di bawah untuk melihat rincian detail keunggulan layanan HARMONITAS.
                </p>
              </div>
            </Reveal>

            {/* 3D FLIP BENEFIT CARDS (UKURAN LEBIH PENDEK) */}
            <div className="mt-8 grid gap-6 md:grid-cols-3 relative">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;

                return (
                  <Reveal key={benefit.title} direction="up" delay={idx * 150 + 50} className="h-full">

                    {/* Outer Container (Height Dipangkas Menjadi 210px) */}
                    <div className="group h-[210px] w-full cursor-pointer [perspective:1000px]">

                      {/* Inner Wrapper */}
                      <div className="relative h-full w-full rounded-2xl transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)_scale(1.03)] shadow-xs hover:shadow-xl">

                        {/* ================= SISI DEPAN (FRONT - SUPER RINGKAS) ================= */}
                        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 [backface-visibility:hidden]">
                          {/* Top Accent Line */}
                          <span className="absolute inset-x-0 top-0 h-1.5 bg-[#2B3056]" />

                          {/* Watermark Number */}
                          <span className="absolute -right-2 -bottom-4 text-7xl font-black text-slate-100 select-none pointer-events-none">
                            {benefit.number}
                          </span>

                          {/* Icon & Tag */}
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] shadow-xs">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="inline-flex items-center rounded-md border border-[#2B3056]/20 bg-[#2B3056]/5 px-2 py-0.5 text-[9px] font-black uppercase text-[#2B3056]">
                              {benefit.tag}
                            </span>
                          </div>

                          {/* Judul Singkat */}
                          <div className="relative z-10 my-auto text-center px-1">
                            <h3 className="text-base font-black text-[#2B3056] leading-snug">
                              {benefit.title}
                            </h3>
                          </div>

                          {/* Bottom Hint */}
                          <div className="relative z-10 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-[#2B3056]">
                            <span className="text-slate-400 font-medium">
                              Layanan #{benefit.number}
                            </span>
                            <span className="flex items-center gap-0.5 text-[#2B3056] font-extrabold">
                              Buka Detail <ChevronRight className="h-3 w-3 text-[#FFC800]" />
                            </span>
                          </div>
                        </div>

                        {/* ================= SISI BELAKANG (BACK - DETAIL DESKRIPSI) ================= */}
                        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2B3056] bg-[#2B3056] text-white p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl">
                          {/* Top Accent Line Gold */}
                          <span className="absolute inset-x-0 top-0 h-1 bg-[#FFD82B]" />

                          <div className="relative z-10 space-y-1.5">
                            <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
                              <span className="text-[9px] font-black uppercase tracking-wider text-[#FFD82B]">
                                {benefit.tag}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-slate-300">
                                #{benefit.number}
                              </span>
                            </div>

                            <h4 className="text-xs font-black text-white leading-tight">
                              {benefit.title}
                            </h4>

                            {/* Deskripsi */}
                            <p className="text-[11px] text-slate-200 font-medium leading-normal line-clamp-4">
                              {benefit.description}
                            </p>
                          </div>

                          {/* Back Bottom Content */}
                          <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-300 font-medium text-[9px]">
                              SOP Resmi
                            </span>
                            <span className="inline-flex items-center gap-0.5 rounded bg-[#FFD82B] px-2 py-0.5 text-[#2B3056] text-[10px] font-black">
                              <span>Terstruktur</span>
                              <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>

                  </Reveal>
                );
              })}
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 3: LAYANAN TERINTEGRASI
            ========================================================================= */}
        <section className="border-b border-slate-200 bg-slate-50/60 py-16 sm:py-20 overflow-hidden">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">

            {/* Left Column: Interactive 4-Stage Workflow Selector */}
            <div className="lg:col-span-6">
              <Reveal direction="left" delay={50} className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2B3056] shadow-2xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FFC800]" />
                  Layanan Terintegrasi
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2B3056] leading-tight">
                  Satu Ruang Kerja untuk Seluruh Proses Harmonisasi
                </h2>
                <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed max-w-2xl pt-0.5">
                  Setiap tahapan terorganisir agar Kemenkumham, Tim Kerja, Biro Hukum, dan Bagian Hukum Daerah dapat bekerja pada data yang sama tanpa kehilangan riwayat proses.
                </p>

                {/* 4 Interactive Process Steps */}
                <div className="mt-6 space-y-2.5 pt-1">
                  {serviceItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = activeServiceTab === idx;

                    return (
                      <div
                        key={item.step}
                        onClick={() => setActiveServiceTab(idx)}
                        onMouseEnter={() => setActiveServiceTab(idx)}
                        className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border p-4 transition-all duration-300 cursor-pointer ${isActive
                          ? 'bg-white border-[#2B3056]/50 shadow-md ring-2 ring-[#FFD82B]/60 -translate-y-0.5'
                          : 'bg-white/80 border-slate-200/90 hover:bg-white hover:border-slate-300 hover:shadow-2xs'
                          }`}
                      >
                        {/* Active Indicator Left Stripe */}
                        <span
                          className={`absolute left-0 inset-y-0 w-1.5 bg-gradient-to-b from-[#FFD82B] via-[#FFC800] to-[#2B3056] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                        />

                        <div className="flex items-center gap-3.5 min-w-0 pl-1">
                          {/* Step Number Badge */}
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition-all duration-300 ${isActive
                              ? 'bg-[#2B3056] text-[#FFD82B] shadow-sm scale-105'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                              }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs sm:text-sm font-bold transition-colors leading-tight ${isActive ? 'text-[#2B3056]' : 'text-slate-700 group-hover:text-[#2B3056]'
                                  }`}
                              >
                                {item.label}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-slate-500 font-normal truncate">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span
                            className={`rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors ${isActive
                              ? 'bg-[#2B3056] text-[#FFD82B]'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                              }`}
                          >
                            {item.badge}
                          </span>
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-200 ${isActive
                              ? 'bg-[#FFD82B] text-[#2B3056] translate-x-0.5'
                              : 'text-slate-400 group-hover:text-slate-600'
                              }`}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>

            {/* Right Column: Dynamic Live Legal Workspace Window Mockup */}
            <div className="lg:col-span-6 relative">
              <Reveal direction="right" delay={150}>
                {/* Ambient Soft Glow Behind Window */}
                <div
                  className="absolute -inset-4 rounded-3xl pointer-events-none opacity-40 blur-2xl -z-10"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 216, 43, 0.25) 0%, rgba(43, 48, 86, 0.08) 60%, transparent 80%)'
                  }}
                />

                <div className="mx-auto max-w-[520px] rounded-3xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden transition-all duration-300">

                  {/* Window Header Chrome (macOS Style) */}
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/90 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-400 border border-red-500/20" />
                      <span className="h-3 w-3 rounded-full bg-amber-400 border border-amber-500/20" />
                      <span className="h-3 w-3 rounded-full bg-emerald-400 border border-emerald-500/20" />
                      <span className="ml-2 text-[11px] font-bold text-[#2B3056]">
                        HARMONITAS • Ruang Kerja Digital
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md bg-white border border-slate-200 px-2 py-0.5 shadow-2xs">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-700">Sinkron Kanwil Riau</span>
                    </div>
                  </div>

                  {/* Active Document Inspector Panel */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Document Header with Stage Progress */}
                    <div className="border-b border-slate-100 pb-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#2B3056] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FFD82B]">
                          {serviceItems[activeServiceTab].badge}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-500">
                          Progres: {serviceItems[activeServiceTab].progress}
                        </span>
                      </div>

                      <h3 className="mt-2.5 text-sm sm:text-base font-extrabold text-[#2B3056] leading-snug">
                        {serviceItems[activeServiceTab].docTitle}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500 font-medium">
                        {serviceItems[activeServiceTab].docMeta}
                      </p>
                    </div>

                    {/* Live Progress Bar with Stage Title */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10.5px] font-bold">
                        <span className="text-slate-600">{serviceItems[activeServiceTab].stage}</span>
                        <span className="text-emerald-600 font-extrabold">{serviceItems[activeServiceTab].statusText}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/80">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FFD82B] via-[#FFC800] to-[#2B3056] transition-all duration-500 ease-out"
                          style={{ width: serviceItems[activeServiceTab].progress }}
                        />
                      </div>
                    </div>

                    {/* Dynamic Detail Checklist Items */}
                    <div className="space-y-2 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Poin Verifikasi & Kelengkapan Tahap
                      </p>
                      <div className="space-y-2 pt-1">
                        {serviceItems[activeServiceTab].details.map((item, dIdx) => (
                          <div
                            key={dIdx}
                            className="flex items-center justify-between gap-2 rounded-xl bg-white p-2.5 border border-slate-200/80 shadow-2xs transition-all hover:border-[#2B3056]/30"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-100/90 text-emerald-700">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </span>
                              <span className="text-xs font-semibold text-slate-700 truncate">
                                {item.label}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 shrink-0 bg-slate-100 px-2 py-0.5 rounded-md">
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button & Metadata Footer */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                        <ShieldCheck className="h-4 w-4 text-[#B3912D]" />
                        <span>SOP Kanwil Kemenkumham Riau</span>
                      </div>
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#2B3056] hover:bg-[#3A4070] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors cursor-pointer"
                      >
                        <span>{serviceItems[activeServiceTab].action}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-[#FFD82B]" />
                      </Link>
                    </div>

                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 4: DUKUNGAN TEKNOLOGI AI
            ========================================================================= */}
        <section className="bg-white py-16 sm:py-20 border-b border-slate-200 overflow-hidden">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">

            {/* Left Column: Interactive AI Legal Clause Inspector & Diff Studio */}
            <div className="order-2 lg:order-1 lg:col-span-6 relative">
              <Reveal direction="left" delay={100}>
                {/* Soft Warm Glow Behind Mockup */}
                <div
                  className="absolute -inset-4 rounded-3xl pointer-events-none opacity-35 blur-2xl -z-10"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 200, 0, 0.20) 0%, rgba(43, 48, 86, 0.08) 60%, transparent 80%)'
                  }}
                />

                <div className="mx-auto max-w-[520px] rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xl space-y-4">

                  {/* Top Window Bar */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] shadow-2xs">
                        <Bot className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#2B3056]">HARMONITAS AI Studio</p>
                        <p className="text-[10px] text-slate-500 font-medium">Penelaah Kaidah Peraturan PUU</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 shadow-2xs">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-700">Model Hukum Aktif</span>
                    </div>
                  </div>

                  {/* Clause Switcher Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {aiClauseCases.map((c, idx) => (
                      <button
                        key={c.tabLabel}
                        onClick={() => setActiveAiClauseTab(idx)}
                        className={`rounded-xl px-3 py-1.5 text-[10.5px] font-bold transition-all whitespace-nowrap cursor-pointer ${activeAiClauseTab === idx
                          ? 'bg-[#2B3056] text-[#FFD82B] shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                          }`}
                      >
                        {c.tabLabel}
                      </button>
                    ))}
                  </div>

                  {/* Active Clause Header & Category */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-xs font-bold text-[#2B3056]">
                      {aiClauseCases[activeAiClauseTab].title}
                    </span>
                    <span className="rounded-md bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[9.5px] font-bold text-amber-800">
                      {aiClauseCases[activeAiClauseTab].category}
                    </span>
                  </div>

                  {/* Clause Diff & AI Recommendation Comparison */}
                  <div className="space-y-2.5">
                    {/* Box A: Original Draft with Detected Issue */}
                    <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-rose-900">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                          <span>Draf Awal Pemda (Masalah Terdeteksi)</span>
                        </span>
                        <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] text-rose-800 font-extrabold">
                          {aiClauseCases[activeAiClauseTab].issueLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-950 font-mono leading-relaxed bg-white/90 rounded-xl p-2.5 border border-rose-200/60 shadow-2xs">
                        "{aiClauseCases[activeAiClauseTab].originalSnippet}"
                      </p>
                      <p className="text-[10px] text-rose-700 font-medium pl-1">
                        Catatan: {aiClauseCases[activeAiClauseTab].originalNote}
                      </p>
                    </div>

                    {/* Box B: AI Recommendation with Clean Legal Phrasing */}
                    <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/40 p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Rekomendasi AI Penyelarasan Perancang</span>
                        </span>
                        <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] text-emerald-800 font-extrabold">
                          Kaidah Terpenuhi
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-950 font-mono leading-relaxed bg-white/90 rounded-xl p-2.5 border border-emerald-200/60 shadow-2xs">
                        "{aiClauseCases[activeAiClauseTab].recommendSnippet}"
                      </p>
                      <p className="text-[10px] text-emerald-700 font-medium pl-1">
                        Dasar: {aiClauseCases[activeAiClauseTab].recommendNote}
                      </p>
                    </div>
                  </div>

                  {/* Quality Score & Citation Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Kesesuaian Kaidah:</span>
                      <span className="rounded-md bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 text-[10px]">
                        {aiClauseCases[activeAiClauseTab].score}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {aiClauseCases[activeAiClauseTab].reference}
                    </span>
                  </div>

                </div>
              </Reveal>
            </div>

            {/* Right Column: AI Feature Capabilities & Pillars */}
            <div className="order-1 lg:order-2 lg:col-span-6 lg:pl-4">
              <Reveal direction="right" delay={150} className="space-y-5">
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2B3056] shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-[#FFC800]" />
                  Kecerdasan Buatan Terintegrasi
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2B3056] leading-tight">
                  Pemeriksaan Awal Dokumen yang Cepat, Akurat, dan Terarah
                </h2>

                <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed max-w-2xl">
                  HARMONITAS AI membantu Tim Perancang Kanwil dan Bagian Hukum Daerah mendeteksi potensi pertentangan norma, inkonsistensi frasa, dan pelampauan kewenangan secara presisi sebelum rapat pleno.
                </p>

                {/* 3 Capability Bento Cards */}
                <div className="space-y-2.5 pt-1">
                  {[
                    {
                      title: 'Deteksi Hierarki & Batas Wewenang',
                      desc: 'Otomatis mencocokkan norma pasal terhadap regulasi yang lebih tinggi (UUD 1945, UU, PP, Permen).',
                      icon: Scale,
                    },
                    {
                      title: 'Standarisasi Lampiran II UU 12/2011',
                      desc: 'Memastikan sistematika bab, penomoran ayat, dan frasa baku perancangan PUU terpenuhi 100%.',
                      icon: CheckCircle2,
                    },
                    {
                      title: 'Efisiensi Waktu Pra-Harmonisasi',
                      desc: 'Memangkas waktu telaah awal dari 3 hari menjadi hitungan menit dengan akurasi teruji.',
                      icon: Zap,
                    },
                  ].map((feat) => {
                    const FIcon = feat.icon;
                    return (
                      <div
                        key={feat.title}
                        className="group flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:border-[#2B3056]/30 hover:shadow-sm transition-all"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#2B3056] group-hover:bg-[#2B3056] group-hover:text-[#FFD82B] transition-colors mt-0.5">
                          <FIcon className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#2B3056] group-hover:text-[#3A4070] transition-colors">
                            {feat.title}
                          </h4>
                          <p className="mt-0.5 text-[11px] text-slate-500 font-normal leading-relaxed">
                            {feat.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2B3056] hover:bg-[#3A4070] px-6 text-xs font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-[#FFD82B]" />
                    <span>Masuk & Gunakan Bantuan AI</span>
                    <ArrowRight className="h-4 w-4 text-white" />
                  </Link>
                </div>
              </Reveal>
            </div>

          </div>
        </section>

        {/* =========================================================================
    SECTION 5: WILAYAH TIM KERJA (WITH 3D FLIP CARD ANIMATION)
    ========================================================================= */}
        <section
          id="wilayah"
          className="scroll-mt-28 bg-slate-50/70 py-16 sm:py-24 border-b border-slate-200 overflow-hidden relative"
        >
          {/* Ambient Background Blur */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#2B3056]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFC800]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

            {/* SECTION HEADER */}
            <Reveal direction="up" delay={0}>
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2B3056]/10 border border-[#2B3056]/15 text-[10px] font-black uppercase tracking-widest text-[#2B3056]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FFC800] animate-ping" />
                  Pembagian Wilayah Kerja
                </span>

                <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#2B3056]">
                  Cakupan Tim Kerja Kanwil Kemenkumham Riau
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                  Layanan harmonisasi untuk Pemerintah Provinsi dan seluruh 12 Kabupaten/Kota di Riau terbagi dalam 3 Tim Kerja Fasilitasi. Arahkan kursor ke kartu untuk melihat rincian wilayah.
                </p>
              </div>
            </Reveal>

            {/* TOP STATS RIBBON */}
            <Reveal direction="up" delay={80}>
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* Stat Item 1 */}
                <div className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-md hover:border-[#2B3056]/30 transition-all duration-300 hover:-translate-y-1">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] shadow-xs group-hover:scale-105 transition-transform duration-300">
                    <Landmark className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-[#2B3056]">1 Provinsi &amp; 12 Kab/Kota</p>
                    <p className="text-[11px] text-slate-500 font-medium">Cakupan Wilayah Administratif</p>
                  </div>
                </div>

                {/* Stat Item 2 */}
                <div className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-md hover:border-[#2B3056]/30 transition-all duration-300 hover:-translate-y-1">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] shadow-xs group-hover:scale-105 transition-transform duration-300">
                    <UsersRound className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-[#2B3056]">3 Tim Kerja Harmonisasi</p>
                    <p className="text-[11px] text-slate-500 font-medium">Perancang Peraturan Kanwil Riau</p>
                  </div>
                </div>

                {/* Stat Item 3 */}
                <div className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-md hover:border-[#2B3056]/30 transition-all duration-300 hover:-translate-y-1">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] shadow-xs group-hover:scale-105 transition-transform duration-300">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-[#2B3056]">136+ Regulasi Tuntas</p>
                    <p className="text-[11px] text-slate-500 font-medium">Sesuai Standar Layanan SOP Resmi</p>
                  </div>
                </div>

              </div>
            </Reveal>

            {/* 3D FLIP TIM KERJA CARDS (100% TAILWIND INLINE) */}
            <div className="mt-10 grid gap-8 lg:grid-cols-3">
              {teamWorkAreas.map((team, idx) => (
                <Reveal key={team.name} direction="up" delay={idx * 150 + 100} className="h-full">

                  {/* Outer Perspective Container */}
                  <div className="group h-[420px] w-full cursor-pointer [perspective:1000px]">

                    {/* Inner Flip Wrapper */}
                    <div className="relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)_rotateZ(180deg)]">

                      {/* ================= SISI DEPAN (FRONT) ================= */}
                      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-md [backface-visibility:hidden]">
                        {/* Top Accent Line */}
                        <span className="absolute inset-x-0 top-0 h-2 bg-[#2B3056]" />

                        {/* Watermark Angka Romawi */}
                        <span className="absolute -right-2 -bottom-6 text-9xl font-black text-slate-100 select-none pointer-events-none">
                          {team.roman}
                        </span>

                        <div className="relative z-10 flex flex-col items-center text-center mt-2">
                          {/* Badge Angka Romawi */}
                          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2B3056] text-[#FFD82B] font-black text-2xl shadow-md mb-4">
                            {team.roman}
                          </span>

                          <h3 className="text-xl font-black text-[#2B3056]">
                            {team.name}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1">
                            {team.tagline}
                          </p>

                          <span className="mt-6 inline-block rounded-lg border border-[#2B3056]/20 bg-[#2B3056]/5 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#2B3056]">
                            {team.totalRanperda}
                          </span>
                        </div>

                        {/* Bottom Hint */}
                        <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                          <span className="inline-flex items-center gap-1.5 text-[#2B3056] bg-[#2B3056]/5 px-2.5 py-1 rounded-full border border-[#2B3056]/10">
                            <span className="h-2 w-2 rounded-full bg-[#FFC800] animate-pulse" />
                            Tim Aktif
                          </span>

                          <span className="text-[#2B3056] font-bold text-xs flex items-center gap-1">
                            Arahkan Kursor <ChevronRight className="h-3.5 w-3.5 text-[#FFC800]" />
                          </span>
                        </div>
                      </div>

                      {/* ================= SISI BELAKANG (BACK) ================= */}
                      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border border-[#2B3056] bg-[#2B3056] text-white p-6 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)_rotateZ(180deg)]">
                        <div className="relative z-10 space-y-3">
                          <div className="flex items-center justify-between border-b border-white/15 pb-3">
                            <h4 className="text-sm font-black text-[#FFD82B] uppercase tracking-wider">
                              Wilayah Kerja {team.roman}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-300">
                              {team.wilayah.length} Daerah
                            </span>
                          </div>

                          {/* List Daerah */}
                          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                            {team.wilayah.map((w) => (
                              <div
                                key={w.name}
                                className="flex items-center justify-between gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs font-semibold text-slate-100"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#FFD82B] text-[#2B3056]">
                                    {w.isGov ? (
                                      <Landmark className="h-3 w-3" />
                                    ) : w.isCapital || w.isCity ? (
                                      <Building2 className="h-3 w-3" />
                                    ) : (
                                      <MapPin className="h-3 w-3" />
                                    )}
                                  </span>
                                  <span className="truncate font-bold text-white">{w.name}</span>
                                </div>

                                <span className="text-[9px] font-extrabold text-[#FFD82B] shrink-0 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                                  {w.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tombol Aksi Sisi Belakang */}
                        <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between">
                          <span className="text-[10px] text-slate-300 font-medium">
                            Kanwil Kemenkumham Riau
                          </span>

                          <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 bg-[#FFD82B] text-[#2B3056] px-3 py-1.5 rounded-lg font-black text-xs hover:bg-white transition-colors"
                          >
                            <span>Masuk Tim</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>

                </Reveal>
              ))}
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 6: ALUR KERJA
            ========================================================================= */}
        <section id="alur" className="scroll-mt-28 bg-white py-16 sm:py-20 border-b border-slate-200 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

            {/* Header Section */}
            <Reveal direction="up" delay={0}>
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#B3912D]">
                  <span className="h-px w-6 bg-[#FFC800]" />
                  SOP Harmonisasi Terpadu
                  <span className="h-px w-6 bg-[#FFC800]" />
                </span>
                <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2B3056]">
                  Alur Kerja & Tahapan SOP Harmonisasi
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm font-normal text-slate-600 leading-relaxed">
                  Empat tahap terstandar menjamin proses harmonisasi regulasi daerah berjalan transparan, akuntabel, dan terukur dari awal permohonan hingga arsip digital.
                </p>
              </div>
            </Reveal>

            {/* 4 Interactive Phase Pipeline Cards */}
            <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Connected Line on Desktop */}
              <div
                aria-hidden="true"
                className="absolute left-[12%] right-[12%] top-10 hidden h-0.5 bg-slate-200 lg:block pointer-events-none -z-0"
              />

              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeWorkflowStep === index;

                return (
                  <Reveal key={step.step} direction="up" delay={index * 120 + 50}>
                    <article
                      onClick={() => setActiveWorkflowStep(index)}
                      className={`group relative flex flex-col justify-between rounded-3xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer h-full ${isActive
                        ? 'bg-gradient-to-b from-white to-slate-50/80 border-[#2B3056] shadow-xl ring-2 ring-[#FFD82B]/80 -translate-y-1.5'
                        : 'bg-white border-slate-200/90 shadow-2xs hover:border-[#2B3056]/30 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                    >
                      {/* Top Glowing Active Bar */}
                      {isActive && (
                        <span className={`absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r ${step.color}`} />
                      )}

                      <div>
                        {/* Step Header */}
                        <div className="relative flex items-center justify-between">
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-black shadow-md transition-transform ${isActive
                              ? 'bg-[#2B3056] text-[#FFD82B] ring-4 ring-[#FFD82B]/30 scale-105'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-[#2B3056] group-hover:text-[#FFD82B]'
                              }`}
                          >
                            {step.step}
                          </span>

                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${isActive
                              ? 'bg-[#2B3056] text-[#FFD82B]'
                              : 'bg-slate-50 border border-slate-200/80 text-slate-500 group-hover:text-[#2B3056]'
                              }`}
                          >
                            <Icon className="h-4.5 w-4.5" />
                          </span>
                        </div>

                        <h3 className="mt-5 text-sm sm:text-base font-bold text-[#2B3056]">
                          {step.title}
                        </h3>

                        <p className="mt-2 text-xs text-slate-600 font-normal leading-relaxed line-clamp-3">
                          {step.description}
                        </p>
                      </div>

                      {/* Step Footer Metadata */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="font-semibold text-slate-500">{step.timeframe}</span>
                          <span className="font-bold text-[#2B3056] bg-slate-100 px-2 py-0.5 rounded-md">
                            {step.actor.split('&')[0]}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-[#B3912D] truncate max-w-[140px]">
                            {step.deliverable}
                          </span>
                          <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-extrabold ${isActive ? 'bg-[#2B3056] text-[#FFD82B]' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {isActive ? 'Aktif' : 'Pilih'}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            {/* Interactive Live SOP Stage Simulator / Document Inspector Panel */}
            <Reveal direction="up" delay={200}>
              <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-900 via-[#1E223D] to-[#2B3056] p-6 sm:p-8 text-white shadow-2xl overflow-hidden relative">

                {/* Background Ambient Aura */}
                <div
                  className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full pointer-events-none opacity-25 blur-3xl -z-0"
                  style={{
                    background: 'radial-gradient(circle, #FFD82B 0%, #2B3056 70%, transparent 100%)'
                  }}
                />

                {/* Simulator Top Chrome */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-rose-500/90 shadow-2xs" />
                      <span className="h-3 w-3 rounded-full bg-amber-400/90 shadow-2xs" />
                      <span className="h-3 w-3 rounded-full bg-emerald-400/90 shadow-2xs" />
                    </div>
                    <span className="h-3.5 w-px bg-white/20" />
                    <p className="text-xs font-bold text-[#FFD82B] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#FFD82B]" />
                      Simulasi Alur SOP: Tahap {workflowSteps[activeWorkflowStep].step} — {workflowSteps[activeWorkflowStep].title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-white/10 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-slate-200 border border-white/10">
                      Pelaksana: {workflowSteps[activeWorkflowStep].actor}
                    </span>
                    <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      ⏱️ {workflowSteps[activeWorkflowStep].timeframe}
                    </span>
                  </div>
                </div>

                {/* Simulator Content Grid */}
                <div className="relative z-10 mt-6 grid gap-6 lg:grid-cols-12 items-center">

                  {/* Left Column: Key Execution Checklist */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#FFD82B]" />
                        Kegiatan Utama & Ketentuan Prosedur
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {workflowSteps[activeWorkflowStep].description}
                      </p>
                    </div>

                    {/* Features Checklist */}
                    <div className="space-y-2.5 pt-1">
                      {workflowSteps[activeWorkflowStep].features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3 backdrop-blur-sm transition-colors hover:bg-white/10"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#FFD82B] text-[#2B3056] font-bold text-xs">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                          <span className="text-xs text-slate-200 font-medium leading-normal">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Output & Legal Deliverable Card */}
                  <div className="lg:col-span-5">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD82B]">
                          Output Resmi Tahap Ini
                        </span>
                        <span className="rounded-md bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                          SOP Terpenuhi
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD82B] text-[#2B3056] shadow-md font-bold">
                            <FileText className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">
                              {workflowSteps[activeWorkflowStep].deliverable}
                            </p>
                            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                              {workflowSteps[activeWorkflowStep].mockupDetail}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10.5px]">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <ShieldCheck className="h-4 w-4 text-[#FFD82B]" />
                          <span>Tervalidasi Kanwil Riau</span>
                        </div>
                        <Link
                          href="/login"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#FFD82B] hover:underline"
                        >
                          <span>Mulai Tahap Ini</span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#FFD82B]" />
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </Reveal>

          </div>
        </section>

        {/* =========================================================================
            SECTION 7: BANNER CTA
            ========================================================================= */}
        <section className="bg-slate-50/70 py-16 sm:py-20 overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal direction="scale" delay={50}>
              <div className="relative overflow-hidden rounded-3xl border border-[#3A4070] bg-gradient-to-r from-[#2B3056] via-[#323963] to-[#2B3056] p-7 sm:p-10 lg:p-12 text-white shadow-2xl">
                {/* Gold Left Accent Border */}
                <div aria-hidden="true" className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-b from-[#FFC800] via-[#FFD82B] to-[#FFC800]" />

                {/* Soft Radial Ambient Glow */}
                <div
                  className="absolute -right-16 -top-16 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl"
                  style={{ background: 'radial-gradient(circle, #FFD82B 0%, transparent 70%)' }}
                />

                <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">

                  {/* Left Column: Headline & Action Buttons */}
                  <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                    <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-1.5 text-[9.5px] font-bold uppercase tracking-widest text-[#FFD82B] backdrop-blur-xs">
                      <ShieldCheck className="h-4 w-4 text-[#FFD82B]" />
                      Akses Layanan Resmi Kanwil Kemenkumham Riau
                    </span>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                      Siap Mengakselerasi Harmonisasi Regulasi Daerah?
                    </h2>

                    <p className="text-xs sm:text-sm font-normal leading-relaxed text-slate-200 max-w-xl">
                      Gunakan akun resmi Kanwil Kemenkumham Riau, Biro Hukum Provinsi, atau Bagian Hukum Kabupaten/Kota untuk mengakses dashboard digital terpadu, telaah draf dengan AI, dan pantau status secara real-time.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                      <Link
                        href="/login"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 px-6 text-xs font-bold text-[#2B3056] shadow-lg transition duration-200 hover:-translate-y-0.5 cursor-pointer"
                      >
                        <span>Masuk ke HARMONITAS</span>
                        <ArrowRight className="h-4 w-4 text-[#2B3056]" />
                      </Link>

                      <Link
                        href="/panduan"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-xs px-5 text-xs font-bold text-white transition duration-200 cursor-pointer"
                      >
                        <BookOpen className="h-4 w-4 text-[#FFD82B]" />
                        <span>Panduan Penggunaan</span>
                      </Link>
                    </div>

                    {/* Trust Footnotes */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-[10.5px] text-slate-300 font-medium border-t border-white/10">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#FFD82B] stroke-[3]" />
                        12 Kab/Kota Terkoneksi
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#FFD82B] stroke-[3]" />
                        SOP Resmi Kemenkumham
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#FFD82B] stroke-[3]" />
                        Bantuan Telaah AI
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Mini Dashboard Workstation Mockup */}
                  <div className="lg:col-span-5">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4.5 backdrop-blur-md space-y-3.5 shadow-2xl">
                      {/* Window Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/90" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                          <span className="ml-1.5 text-[10px] font-bold text-slate-200">Dashboard Quick Access</span>
                        </div>
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[8.5px] font-extrabold text-emerald-300 border border-emerald-400/30">
                          Sistem Aktif
                        </span>
                      </div>

                      {/* Mockup Active User Pill */}
                      <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFD82B] text-[#2B3056] font-black text-xs">
                            P
                          </span>
                          <div>
                            <p className="text-[11px] font-bold text-white leading-none">Perancang Peraturan PUU</p>
                            <p className="text-[9.5px] text-slate-300 mt-0.5">Kanwil Kemenkumham Riau</p>
                          </div>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      </div>

                      {/* Mini Regulation Queue Preview */}
                      <div className="space-y-1.5 text-[10px]">
                        <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-300">
                          Antrean Regulasi Aktif:
                        </p>
                        <div className="flex items-center justify-between rounded-lg bg-black/20 px-2.5 py-1.5 border border-white/5">
                          <span className="truncate text-slate-200 font-medium">Ranperda Tata Ruang Kab. Siak</span>
                          <span className="shrink-0 font-bold text-amber-300">Tahap Pleno</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-black/20 px-2.5 py-1.5 border border-white/5">
                          <span className="truncate text-slate-200 font-medium">Ranperda Pajak Kab. Bengkalis</span>
                          <span className="shrink-0 font-bold text-emerald-300">Validasi</span>
                        </div>
                      </div>

                      {/* Launch Button */}
                      <Link
                        href="/login"
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 py-2 text-[11px] font-bold text-white transition-colors"
                      >
                        <Lock className="h-3 w-3 text-[#FFD82B]" />
                        <span>Buka Ruang Kerja Digital</span>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* =========================================================================
          SECTION 8: FOOTER (Official Kemenkumham Navy #2B3056)
          ========================================================================= */}
      <footer id="kontak" className="bg-[#2B3056] text-white pt-14 pb-8 border-t border-[#3A4070] overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" delay={50}>
            <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-12 text-xs">

              {/* Brand & Identity Column */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-3.5">
                  {/* High-Contrast White Container for Brand Logos */}
                  <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lg border border-white/20">
                    <img src={logoHarmonitas} alt="Logo HARMONITAS" className="h-8 w-auto object-contain" />
                    <img src={logoPengayoman} alt="Logo Pengayoman" className="h-8 w-auto object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-black tracking-wider text-white">HARMONITAS</p>
                      <span className="rounded-full bg-[#FFD82B] px-2 py-0.5 text-[9px] font-extrabold text-[#2B3056]">
                        RIAU
                      </span>
                    </div>
                    <p className="text-[10.5px] font-medium text-slate-300">Kanwil Kementerian Hukum Riau</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-normal leading-relaxed max-w-md">
                  Sistem Informasi Harmonisasi dan Fasilitasi Ranperda serta Ranperkada terintegrasi untuk mendukung pembentukan regulasi daerah yang berkualitas, berkeadilan, dan taat asas.
                </p>

                <div className="flex items-center gap-2 text-[11px] font-bold text-[#FFD82B]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Portal Resmi Kanwil Kementerian Hukum Riau</span>
                </div>
              </div>

              {/* Quick Links Column */}
              <div className="md:col-span-3 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFD82B]">Tautan Cepat</h3>
                <ul className="space-y-2.5 text-xs text-slate-300 font-normal">
                  <li><a href="#beranda" className="hover:text-[#FFD82B] transition">Beranda</a></li>
                  <li><a href="#tentang" className="hover:text-[#FFD82B] transition">Tentang Sistem</a></li>
                  <li><a href="#wilayah" className="hover:text-[#FFD82B] transition">Wilayah Tim Kerja</a></li>
                  <li><a href="#alur" className="hover:text-[#FFD82B] transition">Alur Kerja SOP</a></li>
                  <li><Link href="/panduan" className="hover:text-[#FFD82B] transition">Panduan Sistem</Link></li>
                  <li>
                    <Link
                      href={user ? "/home" : "/login"}
                      className="hover:text-[#FFD82B] transition font-bold text-white"
                    >
                      {user ? 'Dashboard Utama' : 'Masuk Petugas'}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Column */}
              <div className="md:col-span-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFD82B]">Hubungi Kami</h3>
                <ul className="space-y-3 text-xs text-slate-300 font-normal">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFD82B]">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Email Resmi:</p>
                      <span className="text-slate-300">harmonitas.kanwil@kemenkum.go.id</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFD82B]">
                      <PhoneCall className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Telepon / Hotline:</p>
                      <span className="text-slate-300">(0761) 853000</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#FFD82B]">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">Kantor Wilayah:</p>
                      <span className="text-slate-300">Jl. Jend. Sudirman No. 233, Kota Pekanbaru, Riau</span>
                    </div>
                  </li>
                </ul>
              </div>

            </div>

            <div className="flex flex-col gap-2 pt-6 text-[10.5px] text-slate-400 font-normal sm:flex-row sm:items-center sm:justify-between">
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
