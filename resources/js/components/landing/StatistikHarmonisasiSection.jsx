import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Building2,
  Landmark,
  MapPin,
  Map as MapIcon,
  ArrowUpDown,
  Layers,
  Info,
  Clock,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download,
  Table as TableIcon,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Check,
  Sparkles,
  Calendar,
  Lock,
} from 'lucide-react';
import RiauMapVisualization from './RiauMapVisualization';

/**
 * ScrollReveal: Bidirectional Scroll-Triggered Animation Wrapper
 * Triggers smooth enter/exit transitions when scrolling up and down
 */
const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 750,
  threshold = 0.08,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Re-triggers dynamically on scrolling up and down into/out of view
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 28px, 0) scale(0.985)';
      case 'down':
        return 'translate3d(0, -28px, 0) scale(0.985)';
      case 'left':
        return 'translate3d(-32px, 0, 0) scale(0.985)';
      case 'right':
        return 'translate3d(32px, 0, 0) scale(0.985)';
      case 'scale':
        return 'translate3d(0, 16px, 0) scale(0.94)';
      default:
        return 'translate3d(0, 28px, 0) scale(0.985)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

/**
 * AnimatedNumber: Counts up smoothly when scrolled into view
 */
const AnimatedNumber = ({ value, duration = 1000, formatDecimal = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) {
      setDisplayValue(0);
      return;
    }

    const target = Number(value) || 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = target * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(target);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration, isInView]);

  return (
    <span ref={ref}>
      {formatDecimal
        ? Number(displayValue).toFixed(1).replace('.', ',')
        : Math.round(displayValue)}
    </span>
  );
};

export const StatistikHarmonisasiSection = ({ initialData }) => {
  // Master data state
  const [data, setData] = useState(initialData || null);
  const [activeYear, setActiveYear] = useState(initialData?.tahun || 2025);
  const [activeRegulasi, setActiveRegulasi] = useState('gabungan'); // 'gabungan' | 'ranperda' | 'ranperkada'
  const [activeKelompok, setActiveKelompok] = useState('semua'); // 'semua' | 'Kabupaten' | 'Kota' | 'Provinsi'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'harmonisasi' | 'rencana' | 'rasio' | 'nama'
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'chart' | 'table'
  const [selectedWilayahId, setSelectedWilayahId] = useState(3); // Default: Kampar (kabupaten_id: 3)
  
  // Pagination state (default: 5 cards per page to prevent excessive vertical height in chart/table views)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // Polling & network states
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(initialData?.last_updated_at ? new Date(initialData.last_updated_at) : new Date());

  // Fetch updated data from secure backend aggregation endpoint
  const fetchData = useCallback(async (tahunTarget, isBackground = false) => {
    if (!isBackground) setIsFetching(true);
    setFetchError(null);

    try {
      const target = tahunTarget || activeYear;
      const res = await fetch(`/api/statistik-harmonisasi?tahun=${target}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal memuat data (HTTP ${res.status})`);
      }

      const json = await res.json();
      if (json.status === 'success' && json.data) {
        setData(json.data);
        setLastUpdated(new Date(json.data.last_updated_at || Date.now()));
      } else {
        throw new Error('Format data tidak sesuai');
      }
    } catch (err) {
      console.warn('Statistik fetch notice:', err.message);
      setFetchError(err.message || 'Gagal memperbarui data berkala');
    } finally {
      if (!isBackground) setIsFetching(false);
    }
  }, [activeYear]);

  // Handle year change
  const handleYearChange = (newYear) => {
    const y = parseInt(newYear, 10);
    setActiveYear(y);
    fetchData(y, false);
  };

  // Periodic polling (30-60 detik) HANYA jika mode sistem tahun berjalan aktif (is_live = true)
  useEffect(() => {
    if (!data?.is_live) return;

    let pollInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchData(activeYear, true);
      }
    }, 45000); // 45 detik interval

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData(activeYear, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [data?.is_live, activeYear, fetchData]);

  // Filter & Sort Regions
  const filteredAndSortedWilayah = useMemo(() => {
    if (!data?.wilayah) return [];

    let list = [...data.wilayah];

    // Filter Kelompok
    if (activeKelompok !== 'semua') {
      list = list.filter((w) => w.kelompok === activeKelompok);
    }

    // Sort
    list.sort((a, b) => {
      const getVal = (item, type) => {
        if (activeRegulasi === 'ranperda') return item.ranperda[type];
        if (activeRegulasi === 'ranperkada') return item.ranperkada[type];
        return item.total[type];
      };

      if (sortBy === 'harmonisasi') {
        return getVal(b, 'harmonisasi') - getVal(a, 'harmonisasi');
      }
      if (sortBy === 'rencana') {
        return getVal(b, 'rencana') - getVal(a, 'rencana');
      }
      if (sortBy === 'rasio') {
        return getVal(b, 'rasio') - getVal(a, 'rasio');
      }
      if (sortBy === 'nama') {
        return a.nama_singkat.localeCompare(b.nama_singkat);
      }
      // 'default': urutan baku tabel rekap resmi 2025
      return (a.urutan || 99) - (b.urutan || 99);
    });

    return list;
  }, [data?.wilayah, activeKelompok, activeRegulasi, sortBy]);

  // Max value calculation for proportional bar scales (auto-scales if surplus > target)
  const maxScaleValue = useMemo(() => {
    if (!filteredAndSortedWilayah.length) return 100;

    let maxVal = 10;
    filteredAndSortedWilayah.forEach((w) => {
      const r = activeRegulasi === 'ranperda' ? w.ranperda : activeRegulasi === 'ranperkada' ? w.ranperkada : w.total;
      const localMax = Math.max(r.rencana, r.harmonisasi);
      if (localMax > maxVal) maxVal = localMax;
    });

    return maxVal;
  }, [filteredAndSortedWilayah, activeRegulasi]);

  // Selected Region Detail Inspector
  const selectedWilayah = useMemo(() => {
    if (!data?.wilayah) return null;
    return (
      data.wilayah.find((w) => w.kabupaten_id === selectedWilayahId) ||
      data.wilayah[0] ||
      null
    );
  }, [data?.wilayah, selectedWilayahId]);

  // Reset pagination when filters, regulation type, sort or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeKelompok, activeRegulasi, sortBy, pageSize]);

  // Pagination calculations
  const totalItems = filteredAndSortedWilayah.length;
  const isAll = pageSize === 'all' || pageSize >= totalItems;
  const effectivePageSize = isAll ? Math.max(1, totalItems) : Number(pageSize);
  const totalPages = isAll ? 1 : Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = totalItems === 0 ? 0 : (isAll ? 0 : (safeCurrentPage - 1) * effectivePageSize);
  const endIndex = isAll ? totalItems : Math.min(startIndex + effectivePageSize, totalItems);

  const paginatedWilayah = useMemo(() => {
    if (isAll) return filteredAndSortedWilayah;
    return filteredAndSortedWilayah.slice(startIndex, endIndex);
  }, [filteredAndSortedWilayah, isAll, startIndex, endIndex]);

  // Reusable Pagination Bar for Chart & Table views
  const renderPagination = () => {
    if (totalItems === 0) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-1 border-t border-slate-200/80">
        {/* Info Text & Page Size Selector */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium">
          <span>
            Menampilkan <strong className="text-[#2B3056] font-extrabold">{totalItems > 0 ? startIndex + 1 : 0}–{endIndex}</strong> dari <strong className="text-[#2B3056] font-extrabold">{totalItems}</strong> wilayah
          </span>
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-[11px] text-slate-400 font-semibold">Tampilkan:</span>
            {[5, 10, 'all'].map((sz) => {
              const isSelected = (sz === 'all' && isAll) || pageSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => {
                    setPageSize(sz);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2B3056] text-[#FFD82B] shadow-2xs font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {sz === 'all' ? 'Semua' : sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Page Navigation Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                safeCurrentPage <= 1
                  ? 'opacity-35 cursor-not-allowed text-slate-400 bg-slate-100'
                  : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#2B3056] shadow-2xs active:scale-95'
              }`}
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Page Number Pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === safeCurrentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-7 min-w-7 px-2 flex items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2B3056] text-[#FFD82B] shadow-xs ring-1 ring-[#2B3056]'
                        : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#2B3056] active:scale-95'
                    }`}
                    aria-label={`Ke halaman ${pageNum}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                safeCurrentPage >= totalPages
                  ? 'opacity-35 cursor-not-allowed text-slate-400 bg-slate-100'
                  : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#2B3056] shadow-2xs active:scale-95'
              }`}
              aria-label="Halaman selanjutnya"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Export CSV Helper
  const handleExportCSV = () => {
    if (!data?.wilayah) return;

    const headers = [
      'No',
      'Nama Wilayah',
      'Kelompok',
      'ProPem Ranperda (Rencana)',
      'Harmonisasi Ranperda',
      'Rasio Ranperda (%)',
      'Progsun Ranperkada (Rencana)',
      'Harmonisasi Ranperkada',
      'Rasio Ranperkada (%)',
      'Total Rencana',
      'Total Harmonisasi',
      'Rasio Total (%)',
    ];

    const rows = data.wilayah.map((w, idx) => [
      idx + 1,
      `"${w.nama_kabupaten}"`,
      `"${w.kelompok}"`,
      w.ranperda.rencana,
      w.ranperda.harmonisasi,
      w.ranperda.rasio,
      w.ranperkada.rencana,
      w.ranperkada.harmonisasi,
      w.ranperkada.rasio,
      w.total.rencana,
      w.total.harmonisasi,
      w.total.rasio,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `HARMONITAS_Statistik_${data.tahun || 2025}_Riau.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ringkasan = data?.ringkasan || {
    ranperda: { rencana: 212, harmonisasi: 49, rasio: 23.1, rasio_label: '23,1%' },
    ranperkada: { rencana: 817, harmonisasi: 456, rasio: 55.8, rasio_label: '55,8%' },
    gabungan: { rencana: 1029, harmonisasi: 505, rasio: 49.1, rasio_label: '49,1%' },
  };

  // Reusable Region Detail Inspector & Glossary Card Component
  const renderInspectorAndGlossary = () => (
    <>
      {/* Inspector Card */}
      {selectedWilayah && (
        <div className="rounded-3xl border border-[#2B3056]/20 bg-gradient-to-b from-white via-slate-50/50 to-white p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-200/80 pb-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <Landmark className="h-3.5 w-3.5 text-[#B3912D]" />
              Kartu Rincian Wilayah Terpilih
            </span>
            <h4 className="mt-1 text-xl font-black text-[#2B3056]">
              {selectedWilayah.nama_kabupaten}
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Binaan {selectedWilayah.tim_kerja_nama} • Kategori {selectedWilayah.kelompok}
            </p>
          </div>

          {/* Ranperda Details for Selected Region */}
          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wide">
                Ranperda (ProPem)
              </span>
              <span className="text-xs font-mono font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded">
                Rasio {numberFormat(selectedWilayah.ranperda.rasio)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-500 font-medium block">
                  {data?.is_live ? 'Permohonan Masuk:' : 'Target ProPem:'}
                </span>
                <span className="text-base font-mono font-black text-[#2B3056]">
                  {selectedWilayah.ranperda.rencana}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Diharmonisasi:</span>
                <span className="text-base font-mono font-black text-blue-700">
                  {selectedWilayah.ranperda.harmonisasi}
                </span>
              </div>
            </div>

            {selectedWilayah.ranperda.surplus && (
              <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 rounded-lg p-2 border border-emerald-200 mt-2">
                Realisasi Ranperda melampaui target rencana (+{selectedWilayah.ranperda.surplus_selisih} regulasi).
              </p>
            )}
          </div>

          {/* Ranperkada Details for Selected Region */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                Ranperkada (Progsun)
              </span>
              <span className="text-xs font-mono font-bold text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded">
                Rasio {numberFormat(selectedWilayah.ranperkada.rasio)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-500 font-medium block">
                  {data?.is_live ? 'Permohonan Masuk:' : 'Target Progsun:'}
                </span>
                <span className="text-base font-mono font-black text-[#2B3056]">
                  {selectedWilayah.ranperkada.rencana}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Diharmonisasi:</span>
                <span className="text-base font-mono font-black text-amber-900">
                  {selectedWilayah.ranperkada.harmonisasi}
                </span>
              </div>
            </div>

            {selectedWilayah.ranperkada.surplus && (
              <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 rounded-lg p-2 border border-emerald-200 mt-2">
                Realisasi Ranperkada melampaui target rencana (+{selectedWilayah.ranperkada.surplus_selisih} regulasi).
              </p>
            )}
          </div>

          {/* Combined Region Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#2B3056] uppercase tracking-wide">
                Akumulasi Regulasi
              </span>
              <span className="text-xs font-mono font-black text-[#2B3056]">
                Rasio Total {numberFormat(selectedWilayah.total.rasio)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-500 font-medium block">
                  {data?.is_live ? 'Total Permohonan:' : 'Total Rencana:'}
                </span>
                <span className="text-lg font-mono font-black text-[#2B3056]">
                  {selectedWilayah.total.rencana}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Total Selesai:</span>
                <span className="text-lg font-mono font-black text-emerald-700">
                  {selectedWilayah.total.harmonisasi}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informative Glossary Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-2xs text-xs">
        <div className="flex items-center gap-2 font-extrabold text-[#2B3056] border-b border-slate-100 pb-2.5">
          <HelpCircle className="h-4 w-4 text-[#B3912D]" />
          <span>Panduan Membaca Data</span>
        </div>

        <div className="space-y-3 text-slate-600 leading-relaxed">
          <div>
            <p className="font-bold text-[#2B3056]">Apa itu ProPem &amp; Progsun?</p>
            <p className="mt-0.5 text-[11.5px]">
              <strong>ProPem</strong> adalah Program Pembentukan Peraturan Daerah (Ranperda). <strong>Progsun</strong> adalah Program Penyusunan Peraturan Kepala Daerah (Ranperkada). Keduanya merupakan daftar target rencana tahunan resmi daerah, bukan ramalan sistem.
            </p>
          </div>

          <div>
            <p className="font-bold text-[#2B3056]">Kapan Berkas Dihitung Selesai?</p>
            <p className="mt-0.5 text-[11.5px]">
              Hanya dihitung setelah seluruh dokumen wajib harmonisasi 1–5 lengkap dan surat hasil harmonisasi resmi disahkan oleh Kanwil Kemenkum Riau. Status proses berjalan tidak dihitung sebagai selesai.
            </p>
          </div>

          <div>
            <p className="font-bold text-[#2B3056]">Mengapa Rasio Bisa Melebihi 100%?</p>
            <p className="mt-0.5 text-[11.5px]">
              Pemerintah Daerah dapat mengajukan regulasi di luar daftar rencana tahunan akibat keadaan darurat/mendesak, instruksi pemerintah pusat, tindak lanjut putusan pengadilan, atau perubahan APBD.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <section
      id="statistik"
      className="scroll-mt-24 border-b border-slate-200 bg-[#FBFBFE] py-16 sm:py-24 overflow-hidden relative"
      aria-labelledby="statistik-heading"
    >
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-gradient-to-b from-[#2B3056]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-[450px] h-[450px] bg-gradient-to-t from-[#FFD82B]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">

        {/* =========================================================================
            1. EDITORIAL HEADER & METADATA BADGES (WITH SCROLL REVEAL ANIMATION)
            ========================================================================= */}
        <ScrollReveal direction="up" delay={0}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Institution Badge */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#2B3056]/15 bg-[#2B3056]/5 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#2B3056]">
                <span className="flex h-2 w-2 rounded-full bg-[#FFC800] ring-4 ring-[#FFC800]/20 animate-pulse" />
                <span>Atlas Harmonisasi Regulasi Daerah Riau</span>
              </div>

              {/* Status & Year Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Year Selector Filter */}
                {data?.available_years && data.available_years.length > 1 ? (
                  <div className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white p-1 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 px-2 items-center gap-1 hidden sm:flex">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Pilih Tahun:
                    </span>
                    {data.available_years.map((y) => {
                      const isActive = activeYear === y.tahun;
                      const isLive = y.tipe === 'sistem';

                      return (
                        <button
                          key={y.tahun}
                          type="button"
                          onClick={() => handleYearChange(y.tahun)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#2B3056] text-white shadow-xs font-black'
                              : 'text-slate-600 hover:text-[#2B3056] hover:bg-slate-100'
                          }`}
                          title={y.badge}
                        >
                          <span>{y.label}</span>
                          {isLive ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.2 text-[9.5px] font-extrabold ${
                                isActive
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Live
                            </span>
                          ) : (
                            <span
                              className={`rounded-full px-1.5 py-0.2 text-[9.5px] font-bold ${
                                isActive
                                  ? 'bg-slate-700 text-slate-200'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              Historis
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 font-bold text-[#2B3056] shadow-2xs">
                    <Calendar className="h-3.5 w-3.5 text-[#B3912D]" />
                    <span>{data?.label_sumber || `Data historis ${activeYear}`}</span>
                  </span>
                )}

                {/* Live Polling Status */}
                {data?.is_live ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-800">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>Sistem Berjalan (Pembaruan Otomatis)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                    <Lock className="h-3 w-3 text-slate-500" />
                    <span>Rekap Historis Terverifikasi</span>
                  </span>
                )}
              </div>
            </div>

            <div className="max-w-4xl">
              <h2
                id="statistik-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#2B3056] leading-[1.2]"
              >
                Rencana dan Hasil Harmonisasi Regulasi Daerah
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                Membandingkan target perencanaan program regulasi (<strong>ProPem</strong> untuk Ranperda dan <strong>Progsun</strong> untuk Ranperkada) dengan capaian rancangan yang telah selesai diharmonisasi oleh Kantor Wilayah Kementerian Hukum Riau.
              </p>
            </div>

            {/* Fetch Error Notice (if any) */}
            {fetchError && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Pembaruan otomatis sementara tertunda: {fetchError}. Angka yang ditampilkan tetap menggunakan data valid terakhir.</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchData(activeYear, false)}
                  className="font-bold underline hover:text-amber-950 shrink-0 cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* =========================================================================
            2. DUA PANEL RINGKASAN ASIMETRIS (WITH STAGGERED SCROLL REVEAL & COUNTUP)
            ========================================================================= */}
        <div className="grid gap-6 lg:grid-cols-12">

          {/* Panel Ranperda (ProPem) - 6 Cols on LG */}
          <ScrollReveal direction="up" delay={80} className="lg:col-span-6">
            <div className="h-full rounded-3xl border border-blue-200/80 bg-gradient-to-br from-white via-blue-50/20 to-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-28 w-28 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />

              <div className="flex items-start justify-between gap-3 pb-4 border-b border-blue-100">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-900">
                    <span className="h-2 w-2 rounded-xs bg-blue-600" />
                    Ranperda (Peraturan Daerah)
                  </span>
                  <h3 className="mt-1 text-lg sm:text-xl font-black text-[#2B3056]">
                    ProPem Ranperda
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Program Pembentukan Peraturan Daerah
                  </p>
                </div>

                <span className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-mono font-black text-blue-900">
                  13 Wilayah
                </span>
              </div>

              {/* Asymmetrical Metric Comparison with Animated Numbers */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {ringkasan.ranperda.label_target || 'Target Direncanakan'}
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#2B3056] font-mono tracking-tight">
                      <AnimatedNumber value={ringkasan.ranperda.rencana} />
                    </span>
                    <span className="text-xs font-bold text-slate-500">Ranperda</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 font-medium">
                    {ringkasan.ranperda.sublabel_target || 'Target kesepakatan Pemda & DPRD'}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-300/80 bg-blue-600 text-white p-4 shadow-sm hover:bg-blue-700 transition-colors">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-100">
                    Telah Diharmonisasi
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                      <AnimatedNumber value={ringkasan.ranperda.harmonisasi} />
                    </span>
                    <span className="text-xs font-bold text-blue-100">Selesai</span>
                  </div>
                  <p className="mt-1 text-[11px] text-blue-100/90 font-medium">
                    Pengesahan surat hasil Kanwil
                  </p>
                </div>
              </div>

              {/* Honest Ratio Indicator Bar */}
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Rasio jumlah harmonisasi terhadap {data?.is_live ? 'permohonan' : 'rencana'}:</span>
                  <span className="font-mono text-blue-900 text-sm font-black">
                    <AnimatedNumber value={ringkasan.ranperda.rasio} formatDecimal={true} />%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(ringkasan.ranperda.rasio, 100)}%` }}
                  />
                </div>
                <p className="text-[10.5px] text-slate-500 italic">
                  * Rasio agregat seluruh wilayah Riau ({ringkasan.ranperda.harmonisasi} dari {ringkasan.ranperda.rencana} {ringkasan.ranperda.footnote_target || 'target program'}).
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Panel Ranperkada (Progsun) - 6 Cols on LG */}
          <ScrollReveal direction="up" delay={160} className="lg:col-span-6">
            <div className="h-full rounded-3xl border border-amber-200/80 bg-gradient-to-br from-white via-amber-50/20 to-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-28 w-28 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />

              <div className="flex items-start justify-between gap-3 pb-4 border-b border-amber-100">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-900">
                    <span className="h-2 w-2 rounded-xs bg-[#FFC800]" />
                    Ranperkada (Peraturan Kepala Daerah)
                  </span>
                  <h3 className="mt-1 text-lg sm:text-xl font-black text-[#2B3056]">
                    Progsun Ranperkada
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Program Penyusunan Peraturan Kepala Daerah
                  </p>
                </div>

                <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-mono font-black text-amber-900">
                  13 Wilayah
                </span>
              </div>

              {/* Asymmetrical Metric Comparison with Animated Numbers */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {ringkasan.ranperkada.label_target || 'Target Direncanakan'}
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#2B3056] font-mono tracking-tight">
                      <AnimatedNumber value={ringkasan.ranperkada.rencana} />
                    </span>
                    <span className="text-xs font-bold text-slate-500">Ranperkada</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 font-medium">
                    {ringkasan.ranperkada.sublabel_target || 'Rencana tahunan Pergub / Perbup / Perwali'}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#FFD82B] bg-[#2B3056] text-white p-4 shadow-sm hover:bg-[#353B6A] transition-colors">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#FFD82B]">
                    Telah Diharmonisasi
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#FFD82B] font-mono tracking-tight">
                      <AnimatedNumber value={ringkasan.ranperkada.harmonisasi} />
                    </span>
                    <span className="text-xs font-bold text-white/90">Selesai</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/80 font-medium">
                    Tuntas diharmonisasi Kanwil Riau
                  </p>
                </div>
              </div>

              {/* Honest Ratio Indicator Bar */}
              <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Rasio jumlah harmonisasi terhadap {data?.is_live ? 'permohonan' : 'rencana'}:</span>
                  <span className="font-mono text-amber-950 text-sm font-black">
                    <AnimatedNumber value={ringkasan.ranperkada.rasio} formatDecimal={true} />%
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#FFC800] to-[#E5A500] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(ringkasan.ranperkada.rasio, 100)}%` }}
                  />
                </div>
                <p className="text-[10.5px] text-slate-500 italic">
                  * Rasio agregat seluruh wilayah Riau ({ringkasan.ranperkada.harmonisasi} dari {ringkasan.ranperkada.rencana} {ringkasan.ranperkada.footnote_target || 'target program'}).
                </p>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* =========================================================================
            3. KONTROL EKSPLORASI (USER-FRIENDLY & INTUITIF UNTUK SEMUA PENGGUNA)
            ========================================================================= */}
        <ScrollReveal direction="up" delay={120}>
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-5">
            
            {/* Header Kontrol */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2B3056]/10 text-[#2B3056]">
                  <Layers className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#2B3056]">
                    Eksplorasi Data &amp; Pilihan Tampilan
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Sesuaikan format visual, jenis regulasi, dan wilayah yang ingin Anda tinjau.
                  </p>
                </div>
              </div>

              {/* CSV Quick Download */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-[#2B3056] transition shadow-2xs cursor-pointer self-start sm:self-auto"
                title="Unduh seluruh data dalam format CSV / Excel"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Unduh Data CSV</span>
              </button>
            </div>

            {/* Grid Kontrol 2 Tingkat */}
            <div className="space-y-4">
              
              {/* TINGKAT 1: PILIHAN FORMAT TAMPILAN (3 KARTU BESAR JELAS) */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Langkah 1: Pilih Format Tampilan
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Mode Peta */}
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-[#2B3056] text-white border-[#2B3056] shadow-sm ring-2 ring-[#2B3056]/20'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        viewMode === 'map'
                          ? 'bg-[#FFD82B] text-[#2B3056]'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      <MapIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className={`text-xs font-black block leading-tight ${viewMode === 'map' ? 'text-[#FFD82B]' : 'text-[#2B3056]'}`}>
                        Peta Wilayah
                      </span>
                      <span className={`text-[11px] font-medium truncate block ${viewMode === 'map' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Visualisasi peta 13 daerah
                      </span>
                    </div>
                  </button>

                  {/* Mode Jalur Visual */}
                  <button
                    type="button"
                    onClick={() => setViewMode('chart')}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      viewMode === 'chart'
                        ? 'bg-[#2B3056] text-white border-[#2B3056] shadow-sm ring-2 ring-[#2B3056]/20'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        viewMode === 'chart'
                          ? 'bg-[#FFD82B] text-[#2B3056]'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className={`text-xs font-black block leading-tight ${viewMode === 'chart' ? 'text-[#FFD82B]' : 'text-[#2B3056]'}`}>
                        Jalur Visual
                      </span>
                      <span className={`text-[11px] font-medium truncate block ${viewMode === 'chart' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Grafik perbandingan capaian
                      </span>
                    </div>
                  </button>

                  {/* Mode Tabel Rekap */}
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-[#2B3056] text-white border-[#2B3056] shadow-sm ring-2 ring-[#2B3056]/20'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        viewMode === 'table'
                          ? 'bg-[#FFD82B] text-[#2B3056]'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      <TableIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className={`text-xs font-black block leading-tight ${viewMode === 'table' ? 'text-[#FFD82B]' : 'text-[#2B3056]'}`}>
                        Tabel Rekap
                      </span>
                      <span className={`text-[11px] font-medium truncate block ${viewMode === 'table' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Tabel angka resmi 13 wilayah
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* TINGKAT 2: PILIHAN REGULASI & FILTER DAERAH */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2">
                
                {/* Jenis Regulasi (6 Cols on LG) */}
                <div className="lg:col-span-5 space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Langkah 2: Jenis Regulasi
                  </span>
                  <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveRegulasi('gabungan')}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        activeRegulasi === 'gabungan'
                          ? 'bg-white text-[#2B3056] shadow-xs'
                          : 'text-slate-600 hover:text-[#2B3056]'
                      }`}
                    >
                      Semua Regulasi
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRegulasi('ranperda')}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        activeRegulasi === 'ranperda'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-blue-900'
                      }`}
                    >
                      Ranperda
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRegulasi('ranperkada')}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        activeRegulasi === 'ranperkada'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-amber-950'
                      }`}
                    >
                      Ranperkada
                    </button>
                  </div>
                </div>

                {/* Filter Kelompok Wilayah (4 Cols on LG) */}
                <div className="lg:col-span-4 space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Filter Kelompok Wilayah
                  </span>
                  <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                    {['semua', 'Kabupaten', 'Kota', 'Provinsi'].map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setActiveKelompok(k)}
                        className={`flex-1 px-2 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                          activeKelompok === k
                            ? 'bg-white text-[#2B3056] shadow-2xs font-black'
                            : 'text-slate-600 hover:text-[#2B3056]'
                        }`}
                      >
                        {k === 'semua' ? 'Semua (13)' : k}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Urutkan Berdasarkan (3 Cols on LG) */}
                <div className="lg:col-span-3 space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Urutan Data
                  </span>
                  <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs">
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-transparent font-bold text-[#2B3056] focus:outline-hidden cursor-pointer"
                      aria-label="Urutkan data wilayah"
                    >
                      <option value="default">Urutan Baku Rekap</option>
                      <option value="harmonisasi">Harmonisasi Terbanyak</option>
                      <option value="rencana">Target Rencana Terbesar</option>
                      <option value="rasio">Rasio Tertinggi</option>
                      <option value="nama">Nama Daerah (A-Z)</option>
                    </select>
                  </div>
                </div>

              </div>

            </div>

            {/* Active Legend Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-4 text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-5 rounded-xs bg-[#3A4070]" />
                  <span>{data?.is_live ? 'Permohonan Masuk' : 'Direncanakan'} ({data?.is_live ? 'Diajukan' : 'Target'} {activeRegulasi === 'ranperda' ? 'ProPem' : activeRegulasi === 'ranperkada' ? 'Progsun' : 'Total'})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-5 rounded-xs bg-[#FFC800]" />
                  <span>Telah Selesai Diharmonisasi Kanwil</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                  <span>Capaian Melebihi Rencana (Surplus)</span>
                </span>
              </div>

              <span className="text-slate-500 font-mono text-[11px] font-bold">
                Menampilkan {totalItems > 0 ? `${startIndex + 1}–${endIndex}` : '0'} dari {totalItems} wilayah di Riau
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* =========================================================================
            4. VISUAL UTAMA: PETA INTERAKTIF vs JALUR PERBANDINGAN vs TABEL
            ========================================================================= */}
        {viewMode === 'map' ? (
          /* =========================================================================
              VIEW MODE 1: INTERACTIVE RIAU MAP VISUALIZATION (WITH BIDIRECTIONAL SCROLL REVEAL)
             ========================================================================= */
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column (8 cols on LG): Interactive SVG Riau Map */}
            <ScrollReveal direction="left" delay={80} className="lg:col-span-8 space-y-4">
              <RiauMapVisualization
                wilayahList={filteredAndSortedWilayah.length ? filteredAndSortedWilayah : (data?.wilayah || [])}
                selectedWilayahId={selectedWilayahId}
                onSelectWilayah={setSelectedWilayahId}
                activeRegulasi={activeRegulasi}
                isLive={data?.is_live}
              />
            </ScrollReveal>

            {/* Right Column (4 cols on LG): Sticky Region Detail Inspector & Glossary */}
            <ScrollReveal direction="right" delay={160} className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {renderInspectorAndGlossary()}
            </ScrollReveal>
          </div>
        ) : viewMode === 'chart' ? (
          /* =========================================================================
              VIEW MODE 2: PAIRED HORIZONTAL COMPARISON LANES (JALUR VISUAL)
             ========================================================================= */
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column (8 cols): Atlas Jalur Perbandingan Wilayah */}
            <ScrollReveal direction="left" delay={80} className="lg:col-span-8 space-y-3">
              {paginatedWilayah.map((w, idx) => {
                const regData =
                  activeRegulasi === 'ranperda'
                    ? w.ranperda
                    : activeRegulasi === 'ranperkada'
                    ? w.ranperkada
                    : w.total;

                const isSelected = selectedWilayah?.kabupaten_id === w.kabupaten_id;
                const isSurplus = regData.surplus;

                // Scale calculations (proportional, max-scale auto adjusts)
                const rencanaPct = Math.max(3, (regData.rencana / maxScaleValue) * 100);
                const harmPct = Math.max(3, (regData.harmonisasi / maxScaleValue) * 100);

                return (
                  <div
                    key={w.kabupaten_id}
                    onClick={() => setSelectedWilayahId(w.kabupaten_id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedWilayahId(w.kabupaten_id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Rincian wilayah ${w.nama_kabupaten}: Rencana ${regData.rencana}, Harmonisasi ${regData.harmonisasi}`}
                    className={`group rounded-2xl border p-4 sm:p-4.5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#2B3056] bg-white shadow-md ring-2 ring-[#2B3056]/15'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Header Row: Region Name, Type, Surplus Badge, Ratio */}
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            w.kelompok === 'Provinsi'
                              ? 'bg-amber-100 text-amber-900'
                              : w.kelompok === 'Kota'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-[#2B3056] text-[#FFD82B]'
                          }`}
                        >
                          {w.kelompok === 'Provinsi' ? (
                            <Landmark className="h-4 w-4" />
                          ) : w.kelompok === 'Kota' ? (
                            <Building2 className="h-4 w-4" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                        </span>

                        <div className="min-w-0">
                          <span className="font-extrabold text-[#2B3056] text-sm sm:text-base leading-tight truncate block">
                            {w.nama_kabupaten}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {w.tim_kerja_nama} • {w.kelompok}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSurplus && (
                          <span
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-300 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800"
                            title="Jumlah harmonisasi melampaui jumlah rencana (dapat terjadi karena permohonan terbuka/mendesak)"
                          >
                            <Sparkles className="h-3 w-3 text-emerald-600" />
                            <span>+{regData.surplus_selisih} di atas rencana</span>
                          </span>
                        )}

                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-mono font-black ${
                            isSurplus
                              ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {numberFormat(regData.rasio)}%
                        </span>
                      </div>
                    </div>

                    {/* Dual Comparative Horizontal Lanes (Direncanakan vs Diharmonisasi) */}
                    <div className="space-y-1.5 pt-1">
                      {/* Lane 1: Target Rencana (Navy / Indigo) */}
                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-24 sm:w-28 text-slate-500 font-bold shrink-0 text-[11px] truncate">
                          {data?.is_live ? 'Permohonan:' : 'Target Rencana:'}
                        </span>
                        <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden p-0.5 relative">
                          <div
                            className="h-full bg-[#3A4070] rounded-sm transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-white"
                            style={{ width: `${rencanaPct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono font-extrabold text-slate-800 shrink-0 text-xs sm:text-sm">
                          {regData.rencana}
                        </span>
                      </div>

                      {/* Lane 2: Realisasi Harmonisasi (Gold / Amber) */}
                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-24 sm:w-28 text-amber-950 font-bold shrink-0 text-[11px] truncate">
                          Harmonisasi:
                        </span>
                        <div className="flex-1 h-5 bg-amber-50 rounded-md overflow-hidden p-0.5 relative">
                          <div
                            className={`h-full rounded-sm transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-mono font-bold ${
                              isSurplus
                                ? 'bg-gradient-to-r from-[#FFC800] via-[#E5A500] to-emerald-500 text-[#2B3056]'
                                : 'bg-[#FFC800] text-[#2B3056]'
                            }`}
                            style={{ width: `${harmPct}%` }}
                          />
                        </div>
                        <span
                          className={`w-10 text-right font-mono font-black shrink-0 text-xs sm:text-sm ${
                            isSurplus ? 'text-emerald-700' : 'text-[#2B3056]'
                          }`}
                        >
                          {regData.harmonisasi}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination Controls for Chart View */}
              {renderPagination()}
            </ScrollReveal>

            {/* Right Column (4 cols): Sticky Region Detail Inspector & Glossary */}
            <ScrollReveal direction="right" delay={160} className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {renderInspectorAndGlossary()}
            </ScrollReveal>
          </div>
        ) : (
          /* =========================================================================
              VIEW MODE 3: ACCESSIBLE TABULAR RECAPITULATION VIEW
             ========================================================================= */
          <ScrollReveal direction="up" delay={80}>
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/60">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#2B3056]">
                    Tabel Rekapitulasi Lengkap Regulasi 13 Wilayah
                  </h3>
                  <p className="text-xs text-slate-500">
                    Data angka mutlak rencana, harmonisasi selesai, dan rasio pencapaian resmi Kanwil Kemenkum Riau ({data?.label_sumber || `Tahun ${activeYear}`}).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#2B3056] text-white px-4 text-xs font-bold shadow-xs hover:bg-[#353B6A] transition cursor-pointer self-start sm:self-auto"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh Lembar Excel / CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/70 font-black text-slate-700 uppercase tracking-wider text-[11px]">
                      <th scope="col" className="py-3.5 px-4 w-12 text-center">No</th>
                      <th scope="col" className="py-3.5 px-4 min-w-[190px]">Nama Daerah</th>
                      <th scope="col" className="py-3.5 px-4 w-28 text-center">Kelompok</th>
                      <th scope="col" className="py-3.5 px-3 text-center bg-blue-50/60 border-l border-blue-100 text-blue-950 font-black">
                        ProPem Ranperda
                      </th>
                      <th scope="col" className="py-3.5 px-3 text-center bg-blue-50/30 text-blue-900 font-black">
                        Harm. Ranperda
                      </th>
                      <th scope="col" className="py-3.5 px-3 text-center bg-blue-50/60 text-blue-950 border-r border-blue-100 font-black">
                        Rasio Perda
                      </th>
                      <th scope="col" className="py-3.5 px-3 text-center bg-amber-50/60 border-l border-amber-100 text-amber-950 font-black">
                        Progsun Ranperkada
                      </th>
                      <th scope="col" className="py-3.5 px-3 text-center bg-amber-50/30 text-amber-900 font-black">
                        Harm. Ranperkada
                      </th>
                      <th scope="col" className="py-3.5 px-3 text-center bg-amber-50/60 text-amber-950 border-r border-amber-100 font-black">
                        Rasio Perkada
                      </th>
                      <th scope="col" className="py-3.5 px-4 text-center bg-slate-100 font-black">
                        Total Rencana
                      </th>
                      <th scope="col" className="py-3.5 px-4 text-center bg-slate-100 font-black">
                        Total Harmonisasi
                      </th>
                      <th scope="col" className="py-3.5 px-4 text-center bg-slate-200/80 font-black text-[#2B3056]">
                        Rasio Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedWilayah.map((row, idx) => (
                      <tr
                        key={row.kabupaten_id}
                        className="hover:bg-slate-50/90 transition-colors font-medium text-slate-800"
                      >
                        <td className="py-3 px-4 text-center font-bold text-slate-400">
                          {startIndex + idx + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#2B3056]">
                          {row.nama_kabupaten}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                              row.kelompok === 'Provinsi'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : row.kelompok === 'Kota'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-slate-200/70 text-slate-700'
                            }`}
                          >
                            {row.kelompok}
                          </span>
                        </td>

                        {/* Ranperda Numbers */}
                        <td className="py-3 px-3 text-center font-mono font-bold bg-blue-50/20 border-l border-blue-100">
                          {row.ranperda.rencana}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-black text-blue-700 bg-blue-50/10">
                          {row.ranperda.harmonisasi}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold bg-blue-50/20 border-r border-blue-100">
                          <span className={row.ranperda.surplus ? 'text-emerald-700 font-black' : ''}>
                            {numberFormat(row.ranperda.rasio)}%
                          </span>
                        </td>

                        {/* Ranperkada Numbers */}
                        <td className="py-3 px-3 text-center font-mono font-bold bg-amber-50/20 border-l border-amber-100">
                          {row.ranperkada.rencana}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-black text-amber-900 bg-amber-50/10">
                          {row.ranperkada.harmonisasi}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold bg-amber-50/20 border-r border-amber-100">
                          <span className={row.ranperkada.surplus ? 'text-emerald-700 font-black' : ''}>
                            {numberFormat(row.ranperkada.rasio)}%
                          </span>
                        </td>

                        {/* Overall Totals */}
                        <td className="py-3 px-4 text-center font-mono font-bold bg-slate-50">
                          {row.total.rencana}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-black bg-slate-50 text-[#2B3056]">
                          {row.total.harmonisasi}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-black bg-slate-100 text-[#2B3056]">
                          <span className={row.total.surplus ? 'text-emerald-700' : ''}>
                            {numberFormat(row.total.rasio)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={3} className="py-4 px-4 text-right uppercase tracking-wider text-xs">
                        Total Rekapitulasi Riau ({data?.wilayah?.length || 13} Wilayah):
                      </td>
                      <td className="py-4 px-3 text-center font-mono text-sm bg-blue-100/60 text-blue-950">
                        {ringkasan.ranperda.rencana}
                      </td>
                      <td className="py-4 px-3 text-center font-mono text-sm bg-blue-50/60 text-blue-900 font-black">
                        {ringkasan.ranperda.harmonisasi}
                      </td>
                      <td className="py-4 px-3 text-center font-mono text-sm bg-blue-100/60 text-blue-950 font-black">
                        {ringkasan.ranperda.rasio_label}
                      </td>
                      <td className="py-4 px-3 text-center font-mono text-sm bg-amber-100/60 text-amber-950">
                        {ringkasan.ranperkada.rencana}
                      </td>
                      <td className="py-4 px-3 text-center font-mono text-sm bg-amber-50/60 text-amber-900 font-black">
                        {ringkasan.ranperkada.harmonisasi}
                      </td>
                      <td className="py-4 px-3 text-center font-mono text-sm bg-amber-100/60 text-amber-950 font-black">
                        {ringkasan.ranperkada.rasio_label}
                      </td>
                      <td className="py-4 px-4 text-center font-mono text-sm bg-slate-200 text-slate-950">
                        {ringkasan.gabungan.rencana}
                      </td>
                      <td className="py-4 px-4 text-center font-mono text-sm bg-slate-200 text-[#2B3056] font-black">
                        {ringkasan.gabungan.harmonisasi}
                      </td>
                      <td className="py-4 px-4 text-center font-mono text-sm bg-slate-300 text-[#2B3056] font-black">
                        {ringkasan.gabungan.rasio_label}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pagination Controls for Table View */}
              {renderPagination()}
            </div>
          </ScrollReveal>
        )}

      </div>
    </section>
  );
};

// Formatting helper: Indonesian decimal separator (e.g. 23,1)
function numberFormat(val) {
  if (val === null || val === undefined || isNaN(val)) return '0,0';
  return Number(val).toFixed(1).replace('.', ',');
}

export default StatistikHarmonisasiSection;
