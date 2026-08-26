import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../components/layout/AppLayout';

import {
  Upload,
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Search,
  FileCheck2,
  Info,
  Sparkles,
  CheckCircle,
  Bot,
  Zap,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  Download,
  Copy,
  Check,
  FileCode,
  BookOpen,
  HelpCircle,
  Filter,
} from 'lucide-react';

const SAMPLE_ANALYSIS = {
  fileName: 'Draf_Ranperda_Penyelenggaraan_Ketertiban_Umum_2026.docx',
  fileSize: '1.84 MB',
  score: 88,
  grade: 'Layak dengan Perbaikan Ringan',
  totalFindings: 6,
  writingErrors: 2,
  structureErrors: 2,
  formatErrors: 1,
  recommendations: 1,
  categories: [
    {
      id: 'all',
      label: 'Semua Temuan',
      count: 6,
    },
    {
      id: 'struktur',
      label: 'Struktur & Sistematika',
      count: 2,
    },
    {
      id: 'penulisan',
      label: 'Kaidah Bahasa',
      count: 2,
    },
    {
      id: 'format',
      label: 'Format & Penomoran',
      count: 1,
    },
    {
      id: 'rekomendasi',
      label: 'Rekomendasi Khusus',
      count: 1,
    },
  ],
  findings: [
    {
      id: 1,
      category: 'struktur',
      type: 'Sistematika Bab & Pasal',
      severity: 'Tinggi',
      location: 'BAB III - Ketentuan Sanksi (Hal. 6)',
      problem:
        'Penempatan Ketentuan Pidana mendahului Ketentuan Penyidikan. Berdasarkan Lampiran II UU 12/2011, Bab Penyidikan wajib diletakkan sebelum Bab Ketentuan Pidana.',
      solution:
        'Pindahkan BAB Penyidikan menjadi BAB IV dan sesuaikan penomoran pasal serta rujukannya pada batang tubuh.',
    },
    {
      id: 2,
      category: 'penulisan',
      type: 'Kaidah Bahasa Hukum',
      severity: 'Sedang',
      location: 'Pasal 12 ayat (2) (Hal. 3)',
      problem:
        'Ditemukan penggunaan frasa ambigu "dan/atau" pada perumusan norma kewajiban yang dapat menimbulkan multitafsir penegakan hukum.',
      solution:
        'Gunakan kata "dan" jika bersifat kumulatif atau kata "atau" jika bersifat alternatif secara tegas.',
    },
    {
      id: 3,
      category: 'format',
      type: 'Format Konsistensi Penomoran',
      severity: 'Sedang',
      location: 'Pasal 18 ayat (1) huruf c (Hal. 5)',
      problem:
        'Penulisan rincian huruf menggunakan tanda kurung tutup "(c)" bukan titik "c." yang tidak sesuai standar drafting regulasi.',
      solution:
        'Ubah format rincian huruf menjadi "a.", "b.", "c." diakhiri tanda titik koma (;).',
    },
    {
      id: 4,
      category: 'struktur',
      type: 'Konsiderans Menimbang',
      severity: 'Rendah',
      location: 'Konsiderans Menimbang huruf b (Hal. 1)',
      problem:
        'Uraian pokok pikiran pada butir (b) menggabungkan landasan filosofis dan sosiologis dalam satu kalimat panjang.',
      solution:
        'Pisahkan pokok pikiran sosiologis menjadi butir tersendiri untuk menjaga kejelasan alur penalaran konsiderans.',
    },
    {
      id: 5,
      category: 'penulisan',
      type: 'Istilah dan Definisi',
      severity: 'Sedang',
      location: 'Ketentuan Umum Pasal 1 angka 4 (Hal. 2)',
      problem:
        'Istilah "Satuan Tugas" didefinisikan dalam Ketentuan Umum namun tidak pernah digunakan dalam pasal-pasal batang tubuh.',
      solution:
        'Hapus definisi angka 4 dari Ketentuan Umum jika tidak memiliki keterkaitan operasional dengan norma pasal.',
    },
    {
      id: 6,
      category: 'rekomendasi',
      type: 'Sinkronisasi Vertikal',
      severity: 'Rendah',
      location: 'Dasar Hukum Mengingat angka 7 (Hal. 1)',
      problem:
        'Peraturan Pemerintah rujukan telah mengalami perubahan terakhir melalui PP Nomor 16 Tahun 2023.',
      solution:
        'Perbarui nomor dan nomenklatur dasar hukum ke regulasi pengganti terbaru.',
    },
  ],
};

export const AIAssistantPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  /* =========================================
     HANDLE FILE SELECTION
  ========================================== */
  const processFile = (file) => {
    if (!file) return;

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    const isValid = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      alert('Format dokumen harus berupa PDF, DOC, atau DOCX.');
      return;
    }

    setSelectedFile(file);
    setAnalysisResult(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
  };

  const loadSampleDocument = () => {
    const dummyFile = {
      name: SAMPLE_ANALYSIS.fileName,
      size: 1929380, // ~1.84 MB
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    setSelectedFile(dummyFile);
    setAnalysisResult(null);
  };

  /* =========================================
     SIMULATE AI ANALYSIS WITH REALISTIC STAGES
  ========================================== */
  const handleAnalyze = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setProgressStage('Mengekstraksi teks dokumen dan struktur draf...');
    setAnalysisResult(null);

    const stages = [
      { progress: 30, text: 'Memeriksa format konsiderans dan dasar hukum...' },
      { progress: 55, text: 'Menganalisis sistematika BAB, Bagian, dan Pasal...' },
      { progress: 80, text: 'Memverifikasi kaidah bahasa hukum & UU 12/2011...' },
      { progress: 100, text: 'Menyusun laporan skor kesesuaian dan rekomendasi...' },
    ];

    stages.forEach((stage, idx) => {
      setTimeout(() => {
        setAnalysisProgress(stage.progress);
        setProgressStage(stage.text);

        if (idx === stages.length - 1) {
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisResult(SAMPLE_ANALYSIS);
            setActiveCategory('all');
          }, 400);
        }
      }, (idx + 1) * 500);
    });
  };

  const handleCopyFinding = (finding) => {
    const textToCopy = `[${finding.type}] - ${finding.location}\nMasalah: ${finding.problem}\nRekomendasi: ${finding.solution}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(finding.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFindings = analysisResult
    ? analysisResult.findings.filter((item) => {
        if (activeCategory === 'all') return true;
        return item.category === activeCategory;
      })
    : [];

  return (
    <AppLayout>
      <Head title="HARMONITAS AI - Asisten Regulasi Cerdas" />

      <div className="space-y-6 pb-12">
        {/* =========================================
            HERO HEADER BANNER
        ========================================= */}
        <section className="relative overflow-hidden rounded-3xl border border-[#263E75] bg-gradient-to-r from-[#142A5E] via-[#1E3773] to-[#2B478B] p-6 text-white shadow-[0_16px_40px_rgba(20,42,94,0.18)] sm:p-8">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FFC800]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#FFE380] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#FFC800]" />
                Asisten Analisis Regulasi Cerdas
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                HARMONITAS AI
              </h1>

              <p className="text-xs font-medium leading-relaxed text-white/75 sm:text-sm">
                Periksa kepatuhan format, sistematika Bab & Pasal, serta kaidah perancangan peraturan perundang-undangan (UU No. 12/2011) secara otomatis sebelum masuk ke rapat pleno.
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold text-white shadow-inner backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <div>
                  <p className="text-[10px] font-medium text-white/60">Engine AI Regulasi</p>
                  <p className="text-xs font-bold text-white">Online & Siap Analisis</p>
                </div>
              </div>

              {!selectedFile && (
                <button
                  type="button"
                  onClick={loadSampleDocument}
                  className="group inline-flex h-11 items-center gap-2 rounded-2xl border border-[#FFE380]/40 bg-[#FFC800] px-4 text-xs font-black text-[#101B4F] shadow-[0_4px_14px_rgba(255,200,0,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFD633] active:translate-y-0"
                >
                  <Zap className="h-3.5 w-3.5 fill-current text-[#101B4F]" />
                  <span>Coba Contoh Dokumen</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            MAIN 2-COLUMN LAYOUT
        ========================================= */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* LEFT CONTENT AREA (8 Cols) */}
          <div className="space-y-6 xl:col-span-8">
            {/* 1. UPLOAD BOX */}
            <section className="rounded-2xl border border-[#DCE2EC] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EAEFF6] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#142A5E] text-[#FFC800] shadow-sm">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[#142A5E]">
                      Unggah Dokumen Peraturan
                    </h2>
                    <p className="text-[11px] font-medium text-slate-500">
                      Pilih berkas draf Ranperda / Ranperkada (PDF, DOCX, atau DOC).
                    </p>
                  </div>
                </div>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={removeFile}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Ganti File</span>
                  </button>
                )}
              </div>

              <div className="mt-5">
                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                      isDragging
                        ? 'border-[#FFC800] bg-[#FFFDF0] scale-[0.99]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#142A5E]/40 hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <input
                      id="document-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#142A5E] shadow-sm border border-[#E2E8F0] transition-transform duration-200 group-hover:scale-105">
                      <Upload className="h-6 w-6 text-[#142A5E]" />
                    </div>

                    <h3 className="mt-4 text-sm font-black text-[#142A5E]">
                      Tarik & Lepas Dokumen di Sini
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      atau klik tombol di bawah untuk memilih file dari komputer Anda.
                    </p>

                    <label
                      htmlFor="document-upload"
                      className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#142A5E] px-5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102454] hover:shadow-md"
                    >
                      <Upload className="h-3.5 w-3.5 text-[#FFC800]" />
                      <span>Pilih File Dokumen</span>
                    </label>

                    <div className="mt-5 flex items-center justify-center gap-2">
                      <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        PDF
                      </span>
                      <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        DOCX
                      </span>
                      <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        Maks. 25 MB
                      </span>
                    </div>
                  </div>
                ) : (
                  /* FILE ACTIVE CARD */
                  <div className="rounded-2xl border border-[#D0DBE9] bg-gradient-to-r from-[#F8FAFD] to-[#F1F5FB] p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#142A5E] text-[#FFC800] shadow-sm">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#142A5E]">
                            {selectedFile.name}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                            <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-bold">Siap Dianalisis</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#142A5E] px-6 text-xs font-bold text-white shadow-[0_4px_14px_rgba(20,42,94,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#102454] hover:shadow-lg disabled:opacity-60"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-[#FFC800]" />
                            <span>Menganalisis Draf...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 text-[#FFC800]" />
                            <span>Mulai Analisis AI</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Progress Bar when Analyzing */}
                    {isAnalyzing && (
                      <div className="mt-5 space-y-2 border-t border-[#DDE4EE] pt-4">
                        <div className="flex items-center justify-between text-xs font-bold text-[#142A5E]">
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#142A5E]" />
                            {progressStage}
                          </span>
                          <span>{analysisProgress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#142A5E] via-[#2A4D9B] to-[#FFC800] transition-all duration-500"
                            style={{ width: `${analysisProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 2. RESULTS CONTAINER */}
            <section className="rounded-2xl border border-[#DCE2EC] bg-white shadow-sm overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAEFF6] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F4FA] text-[#142A5E]">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[#142A5E]">
                      Hasil Telaah & Rekomendasi
                    </h2>
                    <p className="text-[11px] font-medium text-slate-500">
                      Rangkuman poin koreksi sesuai standar penyusunan perundang-undangan.
                    </p>
                  </div>
                </div>

                {analysisResult ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Analisis Tuntas
                    </span>
                  </div>
                ) : (
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                    Menunggu Dokumen
                  </span>
                )}
              </div>

              {!analysisResult ? (
                /* EMPTY STATE */
                <div className="p-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F4FA] text-slate-400">
                    <Bot className="h-8 w-8 text-[#142A5E]/40" />
                  </div>
                  <h3 className="mt-4 text-sm font-black text-[#142A5E]">
                    Belum Ada Dokumen yang Dianalisis
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
                    Unggah draf regulasi Anda di atas atau klik tombol <b>"Coba Contoh Dokumen"</b> untuk melihat simulasi analisis sistematis dari HARMONITAS AI.
                  </p>
                </div>
              ) : (
                /* POPULATED RESULTS */
                <div className="p-6 space-y-6">
                  {/* METRIC SCORE CARDS */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Compliance Score */}
                    <div className="relative overflow-hidden rounded-2xl border border-[#243E77] bg-[#142A5E] p-5 text-white shadow-sm">
                      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FFC800]/10 blur-xl" />
                      <p className="text-[11px] font-bold text-white/70">
                        Skor Kesesuaian Draf
                      </p>
                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-4xl font-black tracking-tight text-[#FFC800]">
                          {analysisResult.score}
                        </span>
                        <span className="text-base font-bold text-white/60">/ 100</span>
                      </div>
                      <p className="mt-2 text-[10px] font-bold text-emerald-300">
                        {analysisResult.grade}
                      </p>
                    </div>

                    {/* Total Findings */}
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                      <p className="text-[11px] font-bold text-rose-800">
                        Catatan & Koreksi
                      </p>
                      <p className="mt-2 text-3xl font-black text-rose-600">
                        {analysisResult.totalFindings} Poin
                      </p>
                      <p className="mt-2 text-[10px] font-medium text-rose-700/80">
                        Memerlukan revisi sebelum pleno
                      </p>
                    </div>

                    {/* Status Advice */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-[11px] font-bold text-slate-600">
                        Status Rekomendasi
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-black text-[#142A5E]">
                          Revisi Terarah
                        </span>
                      </div>
                      <p className="mt-2 text-[10px] font-medium text-slate-500">
                        Perbaiki sesuai saran di bawah
                      </p>
                    </div>
                  </div>

                  {/* FILTER TABS */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="mr-1 text-[11px] font-bold text-slate-400">
                      Filter Kategori:
                    </span>
                    {analysisResult.categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-150 ${
                          activeCategory === cat.id
                            ? 'bg-[#142A5E] text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label} ({cat.count})
                      </button>
                    ))}
                  </div>

                  {/* FINDINGS LIST */}
                  <div className="space-y-3">
                    {filteredFindings.map((finding, idx) => (
                      <article
                        key={finding.id}
                        className="rounded-2xl border border-[#DCE2EC] bg-[#FAFBFD] p-5 transition-all duration-200 hover:border-[#BAC7D8] hover:bg-white hover:shadow-sm"
                      >
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#142A5E] text-xs font-black text-[#FFC800]">
                              {idx + 1}
                            </span>
                            <div>
                              <h3 className="text-xs font-black text-[#142A5E]">
                                {finding.type}
                              </h3>
                              <p className="text-[10px] font-semibold text-slate-500">
                                {finding.location}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                                finding.severity === 'Tinggi'
                                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                                  : finding.severity === 'Sedang'
                                    ? 'border-amber-200 bg-amber-50 text-amber-800'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                              }`}
                            >
                              Prioritas: {finding.severity}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleCopyFinding(finding)}
                              title="Salin Poin Koreksi"
                              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#142A5E]"
                            >
                              {copiedId === finding.id ? (
                                <Check className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Finding Details */}
                        <div className="mt-3.5 space-y-2.5 text-xs">
                          <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3 text-rose-900">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-0.5">
                              Temuan Masalah:
                            </p>
                            <p className="leading-relaxed font-medium">{finding.problem}</p>
                          </div>

                          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-emerald-950">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
                              Rekomendasi Perbaikan:
                            </p>
                            <p className="leading-relaxed font-medium">{finding.solution}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR (4 Cols) */}
          <div className="space-y-6 xl:col-span-4">
            {/* 1. KANWIL AI IDENTITY CARD */}
            <div className="relative overflow-hidden rounded-2xl border border-[#243E77] bg-[#142A5E] p-6 text-white shadow-sm">
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-[#FFC800]/10 blur-2xl" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFC800] text-[#101B4F] shadow-sm">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      HARMONITAS AI
                    </h3>
                    <p className="text-[10px] font-medium text-[#FFE380]">
                      Legal Drafting Rule Engine
                    </p>
                  </div>
                </div>

                <p className="text-xs font-medium leading-relaxed text-white/75">
                  Sistem dirancang khusus untuk memverifikasi draf Ranperda/Ranperkada berdasarkan kaidah pembentukan peraturan perundang-undangan nasional dan SOP Kanwil Kemenkum Riau.
                </p>

                <div className="flex items-center gap-2 border-t border-white/10 pt-3 text-[10px] font-bold text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Kerahasiaan Dokumen Terjamin</span>
                </div>
              </div>
            </div>

            {/* 2. PILAR PENGUJIAN OTOMATIS */}
            <div className="rounded-2xl border border-[#DCE2EC] bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#142A5E]">
                Pilar Pengujian AI
              </h3>

              <div className="space-y-2.5">
                {[
                  {
                    title: 'Sistematika UU No. 12/2011',
                    desc: 'Struktur Judul, Pembukaan, Batang Tubuh, Penutup & Lampiran',
                    icon: BookOpen,
                  },
                  {
                    title: 'Kaidah Bahasa Peraturan',
                    desc: 'Ketepatan subjek norma, penghindaran frasa ambigu & multitafsir',
                    icon: AlertCircle,
                  },
                  {
                    title: 'Konsistensi Format & Hierarki',
                    desc: 'Penomoran pasal, ayat, huruf, serta rujukan pasal internal',
                    icon: FileCheck2,
                  },
                  {
                    title: 'Sinkronisasi Dasar Hukum',
                    desc: 'Pemeriksaan keberlakuan peraturan yang dijadikan rujukan',
                    icon: ShieldCheck,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-[#F9FAFC] p-3 transition hover:bg-slate-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#142A5E] text-[#FFC800]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#142A5E]">{item.title}</p>
                        <p className="mt-0.5 text-[10px] text-slate-500 leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. ALUR TAHAPAN ANALISIS */}
            <div className="rounded-2xl border border-[#DCE2EC] bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#142A5E]">
                Alur Pemeriksaan
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  {
                    step: '01',
                    title: 'Unggah Berkas',
                    desc: 'Sistem membaca berkas naskah',
                    done: !!selectedFile,
                  },
                  {
                    step: '02',
                    title: 'Pengolahan AI',
                    desc: 'Pemeriksaan kaidah drafting',
                    done: !!analysisResult,
                  },
                  {
                    step: '03',
                    title: 'Tinjau & Rekomendasi',
                    desc: 'Daftar perbaikan siap dipedomani',
                    done: !!analysisResult,
                  },
                ].map((st) => (
                  <div key={st.step} className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${
                        st.done
                          ? 'bg-[#142A5E] text-[#FFC800]'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {st.step}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#142A5E]">{st.title}</p>
                      <p className="text-[10px] text-slate-400">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. PANDUAN PENTING */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#F0DF97] bg-[#FFFBF0] p-4 text-xs">
              <Info className="h-4 w-4 shrink-0 text-[#96740B] mt-0.5" />
              <p className="leading-relaxed text-[#785E09] text-[11px]">
                <strong className="font-bold">Disclaimer:</strong> Hasil analisis HARMONITAS AI merupakan telaah awal pendukung dan tidak menggantikan keputusan resmi rapat pleno Pokja Kanwil Kemenkum Riau.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AIAssistantPage;