import React, { useState } from 'react';
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
} from 'lucide-react';

const AIAssistantPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  /* =========================================
     FILE UPLOAD
  ========================================== */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedExtensions = ['.pdf', '.doc', '.docx'];

    const fileName = file.name.toLowerCase();

    const isValid = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!isValid) {
      alert('Format dokumen harus PDF, DOC, atau DOCX.');
      return;
    }

    setSelectedFile(file);
    setAnalysisResult(null);
  };

  /* =========================================
     REMOVE FILE
  ========================================== */

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
  };

  /* =========================================
     ANALYZE DOCUMENT
  ========================================== */

  const handleAnalyze = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    /*
      SIMULASI ANALISIS AI

      Nantinya bagian ini dapat diganti dengan API backend:

      const formData = new FormData();

      formData.append(
        'document',
        selectedFile
      );

      axios.post(
        '/api/ai/analyze',
        formData
      );
    */

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
            type: 'Kesalahan Penulisan',
            severity: 'Sedang',
            page: 'Halaman 2',
            description:
              'Terdapat penggunaan kata atau kalimat yang berpotensi tidak sesuai dengan kaidah penulisan peraturan.',
          },
          {
            type: 'Struktur Peraturan',
            severity: 'Tinggi',
            page: 'Halaman 4',
            description:
              'Struktur pasal dan ayat perlu diperiksa kembali karena terdapat bagian yang berpotensi tidak mengikuti sistematika peraturan.',
          },
          {
            type: 'Kesesuaian Format',
            severity: 'Sedang',
            page: 'Halaman 6',
            description:
              'Format penomoran pada beberapa bagian dokumen berpotensi tidak konsisten.',
          },
          {
            type: 'Rekomendasi',
            severity: 'Rendah',
            page: 'Halaman 8',
            description:
              'Disarankan melakukan pemeriksaan ulang terhadap istilah yang digunakan agar konsisten di seluruh dokumen.',
          },
        ],
      });
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">


        {/* =====================================
            MAIN GRID
        ====================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ===================================
              LEFT CONTENT
          ==================================== */}

          <div className="xl:col-span-2 space-y-6">

            {/* =================================
                UPLOAD DOCUMENT
            ================================== */}

            <section className="bg-white rounded-2xl border border-[#E2E2DC] shadow-sm overflow-hidden">

              {/* Header */}

              <div className="px-6 py-5 border-b border-[#E2E2DC]">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#2C3154] flex items-center justify-center">

                    <FileCheck2 className="w-5 h-5 text-[#FFC800]" />

                  </div>

                  <div>

                    <h2 className="text-base font-black text-[#2C3154]">
                      Pemeriksaan Dokumen
                    </h2>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload dokumen peraturan untuk dianalisis oleh AI.
                    </p>

                  </div>

                </div>

              </div>


              {/* Upload Area */}

              <div className="p-6">

                {!selectedFile ? (

                  <label
                    htmlFor="document-upload"
                    className="group relative block cursor-pointer"
                  >

                    <div className="border-2 border-dashed border-[#D8DBE5] rounded-2xl p-10 text-center transition-all duration-200 hover:border-[#FFC800] hover:bg-[#FFFDF2]">

                      <div className="mx-auto w-16 h-16 rounded-2xl bg-[#F1F3F8] group-hover:bg-[#FFF3B8] flex items-center justify-center transition">

                        <Upload className="w-7 h-7 text-[#2C3154]" />

                      </div>

                      <h3 className="mt-5 text-sm font-black text-[#2C3154]">
                        Upload Dokumen Peraturan
                      </h3>

                      <p className="mt-2 text-xs text-slate-500">
                        Klik untuk memilih dokumen yang akan diperiksa.
                      </p>

                      <div className="flex justify-center gap-2 mt-4">

                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500">
                          PDF
                        </span>

                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500">
                          DOC
                        </span>

                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500">
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

                  /* Selected File */

                  <div className="rounded-2xl border border-[#D8DBE5] bg-[#F8F9FC] p-5">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-xl bg-[#2C3154] flex items-center justify-center shrink-0">

                        <FileText className="w-6 h-6 text-[#FFC800]" />

                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="text-sm font-black text-[#2C3154] truncate">
                          {selectedFile.name}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
                      >

                        <X className="w-4 h-4" />

                      </button>

                    </div>


                    {/* Analyze Button */}

                    <div className="mt-5 pt-5 border-t border-slate-200">

                      <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2C3154] hover:bg-[#383F6A] disabled:opacity-60 text-white text-sm font-black transition shadow-sm"
                      >

                        {isAnalyzing ? (

                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />

                            Menganalisis Dokumen...
                          </>

                        ) : (

                          <>
                            <Sparkles className="w-4 h-4 text-[#FFC800]" />

                            Mulai Analisis AI
                          </>

                        )}

                      </button>

                    </div>

                  </div>

                )}

              </div>

            </section>


            {/* =================================
                RESULT
            ================================== */}

            <section className="bg-white rounded-2xl border border-[#E2E2DC] shadow-sm overflow-hidden">

              <div className="px-6 py-5 border-b border-[#E2E2DC]">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-[#F1F3F8] flex items-center justify-center">

                      <Search className="w-5 h-5 text-[#2C3154]" />

                    </div>

                    <div>

                      <h2 className="text-base font-black text-[#2C3154]">
                        Hasil Pemeriksaan
                      </h2>

                      <p className="text-xs text-slate-500">
                        Ringkasan hasil analisis dokumen.
                      </p>

                    </div>

                  </div>

                  {analysisResult ? (

                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-600">
                      Analisis Selesai
                    </span>

                  ) : (

                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500">
                      Belum Dianalisis
                    </span>

                  )}

                </div>

              </div>


              {!analysisResult ? (

                <div className="p-8">

                  <div className="flex flex-col items-center justify-center text-center py-8">

                    <div className="w-16 h-16 rounded-2xl bg-[#F1F3F8] flex items-center justify-center">

                      <FileText className="w-7 h-7 text-slate-400" />

                    </div>

                    <h3 className="mt-4 text-sm font-black text-[#2C3154]">
                      Belum Ada Hasil Analisis
                    </h3>

                    <p className="mt-2 max-w-md text-xs text-slate-500 leading-relaxed">
                      Upload dokumen Peraturan Daerah kemudian
                      tekan tombol <b>Mulai Analisis AI</b> untuk
                      melihat hasil pemeriksaan.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="p-6 space-y-6">

                  {/* Score */}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div className="sm:col-span-1 rounded-2xl bg-[#2C3154] p-5 text-white">

                      <p className="text-xs text-slate-300 font-semibold">
                        Tingkat Kesesuaian
                      </p>

                      <div className="flex items-end gap-1 mt-2">

                        <span className="text-4xl font-black text-[#FFC800]">
                          {analysisResult.score}
                        </span>

                        <span className="text-lg font-bold text-slate-300 mb-1">
                          %
                        </span>

                      </div>

                      <p className="text-[10px] text-slate-400 mt-2">
                        Berdasarkan pemeriksaan sementara AI.
                      </p>

                    </div>


                    <div className="rounded-2xl border border-slate-200 p-5">

                      <p className="text-xs text-slate-500 font-semibold">
                        Potensi Kesalahan
                      </p>

                      <p className="text-3xl font-black text-red-500 mt-2">
                        {analysisResult.totalErrors}
                      </p>

                      <p className="text-[10px] text-slate-400 mt-1">
                        Bagian perlu diperiksa
                      </p>

                    </div>


                    <div className="rounded-2xl border border-slate-200 p-5">

                      <p className="text-xs text-slate-500 font-semibold">
                        Status Dokumen
                      </p>

                      <div className="flex items-center gap-2 mt-3">

                        <CheckCircle className="w-5 h-5 text-emerald-500" />

                        <span className="text-sm font-black text-[#2C3154]">
                          Perlu Review
                        </span>

                      </div>

                      <p className="text-[10px] text-slate-400 mt-2">
                        Disarankan melakukan pemeriksaan lanjutan.
                      </p>

                    </div>

                  </div>


                  {/* Error Statistics */}

                  <div>

                    <h3 className="text-sm font-black text-[#2C3154] mb-3">
                      Ringkasan Temuan
                    </h3>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

                      <ResultStat
                        title="Penulisan"
                        value={analysisResult.writingErrors}
                        icon={AlertCircle}
                      />

                      <ResultStat
                        title="Struktur"
                        value={analysisResult.structureErrors}
                        icon={FileCheck2}
                      />

                      <ResultStat
                        title="Format"
                        value={analysisResult.formatErrors}
                        icon={ShieldCheck}
                      />

                      <ResultStat
                        title="Rekomendasi"
                        value={analysisResult.recommendations}
                        icon={CheckCircle2}
                      />

                    </div>

                  </div>


                  {/* Error List */}

                  <div>

                    <div className="flex items-center justify-between mb-3">

                      <h3 className="text-sm font-black text-[#2C3154]">
                        Poin yang Perlu Diperiksa
                      </h3>

                      <span className="text-[10px] font-bold text-slate-400">
                        {analysisResult.errors.length} temuan
                      </span>

                    </div>

                    <div className="space-y-3">

                      {analysisResult.errors.map((error, index) => (

                        <ErrorItem
                          key={index}
                          number={index + 1}
                          {...error}
                        />

                      ))}

                    </div>

                  </div>

                </div>

              )}

            </section>

          </div>


          {/* ===================================
              RIGHT SIDEBAR
          ==================================== */}

          <div className="space-y-6">

            {/* AI INFORMATION */}

            <section className="bg-[#2C3154] rounded-2xl p-6 shadow-sm relative overflow-hidden">

              <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-[#FFC800]/10 blur-2xl" />

              <div className="relative">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-[#FFC800] flex items-center justify-center">

                    <Sparkles className="w-5 h-5 text-[#2C3154]" />

                  </div>

                  <div>

                    <h3 className="text-sm font-black text-white">
                      HARMONITAS AI
                    </h3>

                    <p className="text-[10px] text-slate-300">
                      Intelligent Regulation Analysis
                    </p>

                  </div>

                </div>

                <p className="mt-5 text-xs text-slate-300 leading-relaxed">
                  Sistem AI membantu mengidentifikasi potensi
                  kesalahan penulisan, struktur, format, serta
                  memberikan rekomendasi perbaikan terhadap
                  dokumen peraturan.
                </p>

                <div className="mt-5 flex items-center gap-2">

                  <ShieldCheck className="w-4 h-4 text-emerald-400" />

                  <span className="text-[10px] text-slate-300 font-bold">
                    Secure Document Analysis
                  </span>

                </div>

              </div>

            </section>


            {/* AI FEATURES */}

            <section className="bg-white rounded-2xl border border-[#E2E2DC] shadow-sm p-5">

              <h3 className="text-sm font-black text-[#2C3154] mb-4">
                Pemeriksaan AI
              </h3>

              <div className="space-y-3">

                <FeatureItem
                  icon={AlertCircle}
                  title="Kesalahan Penulisan"
                  description="Mendeteksi potensi kesalahan teks."
                />

                <FeatureItem
                  icon={FileCheck2}
                  title="Struktur Peraturan"
                  description="Memeriksa struktur dokumen."
                />

                <FeatureItem
                  icon={ShieldCheck}
                  title="Kesesuaian Format"
                  description="Menganalisis format peraturan."
                />

                <FeatureItem
                  icon={CheckCircle2}
                  title="Rekomendasi"
                  description="Memberikan saran perbaikan."
                />

              </div>

            </section>


            {/* PROCESS */}

            <section className="bg-white rounded-2xl border border-[#E2E2DC] shadow-sm p-5">

              <h3 className="text-sm font-black text-[#2C3154] mb-4">
                Alur Pemeriksaan
              </h3>

              <div className="space-y-4">

                <ProcessStep
                  number="01"
                  title="Upload Dokumen"
                  description="Masukkan dokumen peraturan."
                  active={!selectedFile}
                />

                <ProcessStep
                  number="02"
                  title="Analisis AI"
                  description="AI memeriksa isi dokumen."
                  active={isAnalyzing}
                />

                <ProcessStep
                  number="03"
                  title="Review Hasil"
                  description="Tinjau temuan dan rekomendasi."
                  active={!!analysisResult}
                />

              </div>

            </section>

          </div>

        </div>


        {/* =====================================
            INFORMATION
        ====================================== */}

        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FFF9DF] border border-[#F3DF82]">

          <Info className="w-4 h-4 text-[#A47B00] mt-0.5 shrink-0" />

          <p className="text-xs text-[#705B16] leading-relaxed">

            <span className="font-black">
              Catatan:
            </span>{' '}

            Fitur AI saat ini masih dalam tahap pengembangan.
            Hasil pemeriksaan yang diberikan sistem merupakan
            rekomendasi dan tetap perlu ditinjau oleh pengguna
            sebelum digunakan sebagai dasar keputusan.

          </p>

        </div>

      </div>
    </AppLayout>
  );
};


/* =========================================
   FEATURE ITEM
========================================= */

const FeatureItem = ({
  icon: Icon,
  title,
  description,
}) => {

  return (

    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8F9FC] transition">

      <div className="w-8 h-8 rounded-lg bg-[#F1F3F8] flex items-center justify-center shrink-0">

        <Icon className="w-4 h-4 text-[#2C3154]" />

      </div>

      <div className="min-w-0">

        <p className="text-xs font-black text-[#2C3154]">
          {title}
        </p>

        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
          {description}
        </p>

      </div>

    </div>

  );
};


/* =========================================
   RESULT STAT
========================================= */

const ResultStat = ({
  title,
  value,
  icon: Icon,
}) => {

  return (

    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <div className="flex items-center justify-between">

        <div className="w-8 h-8 rounded-lg bg-[#F1F3F8] flex items-center justify-center">

          <Icon className="w-4 h-4 text-[#2C3154]" />

        </div>

        <span className="text-xl font-black text-[#2C3154]">
          {value}
        </span>

      </div>

      <p className="text-[10px] text-slate-500 font-bold mt-3">
        {title}
      </p>

    </div>

  );
};


/* =========================================
   ERROR ITEM
========================================= */

const ErrorItem = ({
  number,
  type,
  severity,
  page,
  description,
}) => {

  const severityClass = {
    Tinggi: 'bg-red-50 text-red-600 border-red-100',
    Sedang: 'bg-amber-50 text-amber-600 border-amber-100',
    Rendah: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (

    <div className="rounded-xl border border-slate-200 p-4 hover:border-[#D0D5E2] hover:shadow-sm transition">

      <div className="flex items-start gap-3">

        <div className="w-8 h-8 rounded-lg bg-[#2C3154] text-[#FFC800] flex items-center justify-center text-xs font-black shrink-0">
          {number}
        </div>

        <div className="flex-1 min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <h4 className="text-xs font-black text-[#2C3154]">
              {type}
            </h4>

            <span
              className={`px-2 py-0.5 rounded-md border text-[9px] font-bold ${
                severityClass[severity]
              }`}
            >
              {severity}
            </span>

            <span className="text-[9px] text-slate-400 font-semibold">
              {page}
            </span>

          </div>

          <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
            {description}
          </p>

        </div>

      </div>

    </div>

  );
};


/* =========================================
   PROCESS STEP
========================================= */

const ProcessStep = ({
  number,
  title,
  description,
  active,
}) => {

  return (

    <div className="flex items-start gap-3">

      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
          active
            ? 'bg-[#FFC800] text-[#2C3154]'
            : 'bg-[#F1F3F8] text-[#2C3154]'
        }`}
      >
        {number}
      </div>

      <div>

        <p className="text-xs font-black text-[#2C3154]">
          {title}
        </p>

        <p className="text-[10px] text-slate-500 mt-0.5">
          {description}
        </p>

      </div>

    </div>

  );
};

export default AIAssistantPage;