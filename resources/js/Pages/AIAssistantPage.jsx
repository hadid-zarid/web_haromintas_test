import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../components/layout/AppLayout';
import HarmonitasLoader from '../components/common/HarmonitasLoader';

import {
  Upload,
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  FileCheck2,
  Info,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

const AIAssistantPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
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

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        score: 87,
        totalErrors: 8,
        writingErrors: 3,
        structureErrors: 2,
        formatErrors: 2,
        recommendations: 1,
        errors: [
          {
            type: 'Kaidah Penulisan',
            severity: 'Sedang',
            page: 'Halaman 2',
            description:
              'Ditemukan penggunaan istilah dan rujukan frasa yang berpotensi tidak konsisten dengan kaidah baku legal drafting.',
          },
          {
            type: 'Struktur Peraturan',
            severity: 'Tinggi',
            page: 'Halaman 4',
            description:
              'Struktur penomoran pasal dan ayat perlu diperiksa karena terdapat hierarki sub-pasal yang melompati urutan baku.',
          },
          {
            type: 'Kesesuaian Format',
            severity: 'Sedang',
            page: 'Halaman 6',
            description:
              'Format penomoran lampiran dan konsiderans menimbang memerlukan penyesuaian tata naskah dinas.',
          },
          {
            type: 'Rekomendasi',
            severity: 'Rendah',
            page: 'Halaman 8',
            description:
              'Direkomendasikan melakukan standardisasi definisi operasional pada Pasal 1 Ketentuan Umum.',
          },
        ],
      });
    }, 1800);
  };

  return (
    <AppLayout>
      <Head title="Asisten AI Pra-Harmonisasi - HARMONITAS" />
      <div className="space-y-6 font-sans">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Upload & Result */}
          <div className="xl:col-span-2 space-y-6">
            {/* Upload Document Card */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B3056] flex items-center justify-center text-white">
                  <FileCheck2 className="w-5 h-5 text-[#FFC800]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#2B3056]">
                    Pemeriksaan & Analisa Dokumen
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">
                    Unggah naskah peraturan (PDF/DOCX) untuk pemindaian otomatis kesesuaian format
                  </p>
                </div>
              </div>

              <div className="p-6">
                {!selectedFile ? (
                  <label
                    htmlFor="document-upload"
                    className="block cursor-pointer group"
                  >
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center transition-colors hover:border-[#2B3056] hover:bg-slate-50/50">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-[#2B3056] mb-3 group-hover:scale-105 transition-transform">
                        <Upload className="w-6 h-6 text-[#2B3056]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#2B3056]">
                        Klik atau Tarik File ke Sini
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Mendukung format naskah regulasi standar daerah
                      </p>
                      <div className="flex justify-center gap-2 mt-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-[#2B3056] border border-slate-200">
                          PDF
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-[#2B3056] border border-slate-200">
                          DOC
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-[#2B3056] border border-slate-200">
                          DOCX
                        </span>
                      </div>
                    </div>
                    <input
                      id="document-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2B3056] text-white flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#FFC800]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#2B3056] truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                      <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 text-[#2B3056] text-xs font-bold transition-all disabled:opacity-80 cursor-pointer shadow-sm active:scale-95"
                      >
                        {isAnalyzing ? (
                          <HarmonitasLoader variant="button" title="Menganalisis Naskah..." />
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-[#2B3056]" />
                            <span>Mulai Analisa Dokumen</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Analysis Result Section */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#2B3056]">
                    <Search className="w-5 h-5 text-[#2B3056]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#2B3056]">
                      Hasil Analisa & Rekomendasi
                    </h2>
                    <p className="text-xs text-slate-500 font-normal">
                      Ringkasan parameter kesesuaian naskah hukum
                    </p>
                  </div>
                </div>

                {isAnalyzing ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-[11px] font-bold text-amber-700 border border-amber-200 animate-pulse">
                    Sedang Memindai AI
                  </span>
                ) : analysisResult ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                    Selesai Dipindai
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500 border border-slate-200">
                    Menunggu Dokumen
                  </span>
                )}
              </div>

              {isAnalyzing ? (
                <div className="p-8 sm:p-12 flex items-center justify-center">
                  <HarmonitasLoader
                    variant="scanner"
                    title="AI Sedang Menelaah Naskah Regulasi..."
                    subtitle="Memproses parameter kesesuaian konsiderans, konsistensi istilah, dan hierarki perundang-undangan"
                    steps={[
                      "Membaca struktur naskah akademis & draf regulasi...",
                      "Memverifikasi konsiderans 'Menimbang' & dasar hukum 'Mengingat'...",
                      "Menganalisis keselarasan vertikal dengan UU No. 12/2011 & PP terkait...",
                      "Memeriksa asas kepastian hukum & kerapian bahasa perancangan...",
                      "Menyusun rekomendasi Analisa hukum Kanwil Riau...",
                    ]}
                  />
                </div>
              ) : !analysisResult ? (
                <div className="p-10 text-center">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#2B3056]">
                    Belum Ada Hasil Analisa
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Unggah berkas rancangan peraturan dan tekan tombol <b>Mulai Analisa</b> untuk melihat catatan evaluasi.
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Score Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-[#2B3056] p-5 text-white">
                      <p className="text-xs text-slate-300 font-medium">
                        Kesesuaian Format
                      </p>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-bold text-[#FFD82B]">
                          {analysisResult.score}
                        </span>
                        <span className="text-sm text-slate-300 font-medium">/ 100</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-2">
                        Skor keselarasan sistematika peraturan
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-5 bg-white">
                      <p className="text-xs text-slate-500 font-medium">
                        Temuan Perbaikan
                      </p>
                      <p className="text-3xl font-bold text-[#2B3056] mt-1">
                        {analysisResult.totalErrors}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Poin pasal yang perlu ditinjau
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-5 bg-white">
                      <p className="text-xs text-slate-500 font-medium">
                        Status Validasi
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-bold text-[#2B3056]">
                          Perlu Review
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Memerlukan konfirmasi Tim Kerja
                      </p>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Klasifikasi Temuan
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <ResultStat title="Penulisan" value={analysisResult.writingErrors} icon={AlertCircle} />
                      <ResultStat title="Struktur" value={analysisResult.structureErrors} icon={FileCheck2} />
                      <ResultStat title="Format" value={analysisResult.formatErrors} icon={ShieldCheck} />
                      <ResultStat title="Rekomendasi" value={analysisResult.recommendations} icon={CheckCircle2} />
                    </div>
                  </div>

                  {/* Error List */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Rincian Catatan ({analysisResult.errors.length})
                    </h3>
                    <div className="space-y-3">
                      {analysisResult.errors.map((error, index) => (
                        <ErrorItem key={index} number={index + 1} {...error} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Information & Guidelines */}
          <div className="space-y-5">
            {/* Information Card */}
            <section className="bg-gradient-to-b from-[#2B3056] to-[#3A4070] text-white rounded-2xl p-6 border border-[#3A4070]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FFD82B]">
                  <Sparkles className="w-5 h-5 text-[#FFD82B]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Analisa Cerdas HARMONITAS</h3>
                  <p className="text-[11px] text-slate-300 font-medium">Pemeriksaan Regulasi Berbantuan Sistem</p>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Sistem membantu mendeteksi potensi ketidaksesuaian penulisan, struktur pasal, dan format regulasi untuk mempercepat proses Analisa oleh perancang peraturan perundang-undangan.
              </p>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300 font-normal">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pemrosesan internal terlindungi</span>
              </div>
            </section>

            {/* Workflow steps */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2B3056] mb-3">
                Alur Kerja Analisa
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#2B3056] text-[#FFD82B] flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B3056]">Unggah Naskah</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Pilih dokumen permohonan regulasi.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#2B3056] text-[#FFD82B] flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B3056]">Pemindaian Sistem</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Sistem memeriksa kesesuaian kaidah.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#2B3056] text-[#FFD82B] flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B3056]">Penyempurnaan Draft</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Tinjau temuan sebagai bahan rapat pleno.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Notice banner */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-normal">
                <strong className="font-bold text-[#2B3056]">Catatan:</strong> Hasil pemeriksaan sistem bersifat rekomendasi teknis awal. Keputusan substansi hukum tetap berada pada kewenangan Tim Perancang Kanwil dan Biro Hukum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const ResultStat = ({ title, value, icon: Icon }) => (
  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-500 font-medium">{title}</span>
      <Icon className="w-3.5 h-3.5 text-[#2B3056]" />
    </div>
    <p className="text-lg font-bold text-[#2B3056] mt-1">{value}</p>
  </div>
);

const ErrorItem = ({ number, type, severity, page, description }) => {
  const severityClass = {
    Tinggi: 'bg-red-50 text-red-700 border-red-200',
    Sedang: 'bg-amber-50 text-amber-800 border-amber-200',
    Rendah: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-[#2B3056] text-[#FFD82B] text-[10px] font-bold flex items-center justify-center">
            {number}
          </span>
          <span className="text-xs font-bold text-[#2B3056]">{type}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${severityClass[severity]}`}>
            {severity}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">{page}</span>
        </div>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed font-normal pl-7">
        {description}
      </p>
    </div>
  );
};

export default AIAssistantPage;