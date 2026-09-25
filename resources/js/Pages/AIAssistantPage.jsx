import React, { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../components/layout/AppLayout';
import HarmonitasLoader from '../components/common/HarmonitasLoader';

import {
  Upload,
  FileText,
  ShieldCheck,
  CheckCircle2,
  X,
  Search,
  FileCheck2,
  Info,
  Sparkles,
  Layers,
  AlertTriangle,
  SpellCheck,
  Bug,
  Quote,
  BookOpenText,
  AlignLeft,
  Download,
  ChevronDown,
  Code2,
  Highlighter,
  ScrollText,
  Bot,
  Send,
  Loader2,
} from 'lucide-react';

// Backend AI Document Checker berjalan di server yang sama dan diakses lewat
// path /ai-api (Caddy meneruskannya ke container ai-checker), jadi satu domain
// tanpa CORS/mixed-content. Lihat docker/Caddyfile.
const AI_API_BASE_URL = '/ai-api';

// Peta status/error dari AI Document Checker ke bentuk yang dipahami UI ini.
const SEVERITY_LABELS = { high: 'Tinggi', medium: 'Sedang', low: 'Rendah' };
const ERROR_TYPE_LABELS = {
  pedoman: 'Struktur Peraturan',
  ejaan: 'Kaidah Penulisan',
  tanda_baca: 'Kaidah Penulisan',
  kosa_kata: 'Kaidah Penulisan',
};

function mapCheckReportToAnalysisResult(report) {
  const summary = report.summary || {};
  const compliance = report.compliance_score || {};
  const subScores = compliance.sub_scores || {};
  const score = Math.round(compliance.overall_score ?? 0);
  const totalErrors = summary.total_span_errors ?? 0;
  const writingErrors =
    (summary.errors_ejaan ?? 0) + (summary.errors_tanda_baca ?? 0) + (summary.errors_kosa_kata ?? 0);
  const structureErrors = summary.errors_pedoman ?? 0;
  const formatErrors = summary.tidak_ditemukan_rujukan ?? 0;
  const recommendations = summary.perlu_revisi ?? 0;

  const errors = [];
  (report.blocks || []).forEach((block) => {
    (block.span_errors || []).forEach((se) => {
      errors.push({
        type: ERROR_TYPE_LABELS[se.error_type] || 'Rekomendasi',
        severity: SEVERITY_LABELS[se.severity] || 'Sedang',
        page: `Halaman ${block.page_number || 1}`,
        description: se.explanation || se.original_snippet,
      });
    });
  });

  return {
    score,
    grade: compliance.grade || '-',
    predicate: compliance.predicate || '',
    subScores: {
      pedoman: Math.round(subScores.pedoman_score ?? 100),
      ejaan: Math.round(subScores.ejaan_score ?? 100),
      punct: Math.round(subScores.tanda_baca_kosa_kata_score ?? 100),
      struct: Math.round(subScores.struktur_hukum_score ?? 100),
    },
    totalBlocks: summary.total_blocks ?? 0,
    sesuai: summary.sesuai ?? 0,
    longSentences: report.legal_metrics?.long_sentences_count ?? 0,
    totalErrors,
    writingErrors,
    structureErrors,
    formatErrors,
    recommendations,
    errorsEjaanTandaBaca: summary.ejaan_tanda_baca ?? 0,
    errorsTandaBaca: summary.errors_tanda_baca ?? 0,
    errorsKosaKata: summary.errors_kosa_kata ?? 0,
    errors: errors.slice(0, 30),
    rawReport: report,
  };
}

function buildDocumentContext(report) {
  return (report.blocks || [])
    .map((b) => b.original_text)
    .filter(Boolean)
    .join('\n')
    .slice(0, 3000);
}

const AIAssistantPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportingMode, setExportingMode] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

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

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const startRes = await fetch(`${AI_API_BASE_URL}/api/check/start`, {
        method: 'POST',
        body: formData,
      });
      if (!startRes.ok) {
        const errBody = await startRes.json().catch(() => ({}));
        throw new Error(errBody.detail || 'Gagal memulai analisis dokumen di server AI.');
      }
      const { job_id } = await startRes.json();

      // Polling status job - toleran terhadap kegagalan sesaat (server AI lagi
      // restart dsb), sama seperti pola yang dipakai di dashboard AI Document
      // Checker sendiri.
      const report = await new Promise((resolve, reject) => {
        let consecutiveFailures = 0;
        const MAX_CONSECUTIVE_FAILURES = 40; // ~60 detik toleransi

        const interval = setInterval(async () => {
          let statusRes;
          try {
            statusRes = await fetch(`${AI_API_BASE_URL}/api/check/status/${job_id}`);
          } catch (networkErr) {
            statusRes = null;
          }

          if (!statusRes || !statusRes.ok) {
            consecutiveFailures += 1;
            if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
              clearInterval(interval);
              reject(new Error('Server AI tidak merespons setelah beberapa kali percobaan.'));
            }
            return;
          }
          consecutiveFailures = 0;

          const job = await statusRes.json();
          if (job.status === 'done') {
            clearInterval(interval);
            resolve(job.report);
          } else if (job.status === 'error') {
            clearInterval(interval);
            reject(new Error(job.error_message || 'Analisis dokumen gagal diproses.'));
          }
        }, 1500);
      });

      setAnalysisResult(mapCheckReportToAnalysisResult(report));
    } catch (error) {
      alert(`Gagal menganalisis dokumen: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = async (mode) => {
    if (!analysisResult?.rawReport) return;
    setExportOpen(false);
    setExportingMode(mode);

    try {
      const res = await fetch(`${AI_API_BASE_URL}/api/export-docx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: analysisResult.rawReport, mode }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || 'Gagal membuat dokumen ekspor.');
      }

      const disposition = res.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : `hasil-analisa-${mode}.docx`;

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Gagal mengekspor dokumen: ${error.message}`);
    } finally {
      setExportingMode(null);
    }
  };

  const handleExportJson = () => {
    if (!analysisResult?.rawReport) return;
    setExportOpen(false);
    const blob = new Blob([JSON.stringify(analysisResult.rawReport, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hasil-analisa-data.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleSendChat = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;

    const nextMessages = [...chatMessages, { role: 'user', content: message }];
    setChatMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch(`${AI_API_BASE_URL}/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          chat_history: chatMessages,
          document_context: analysisResult?.rawReport
            ? buildDocumentContext(analysisResult.rawReport)
            : undefined,
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || 'Asisten AI gagal merespons.');
      }
      const data = await res.json();
      setChatMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setChatMessages([
        ...nextMessages,
        { role: 'assistant', content: `Maaf, terjadi kesalahan: ${error.message}` },
      ]);
    } finally {
      setChatLoading(false);
    }
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
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2B3056] flex items-center justify-center text-white shrink-0">
                  <FileCheck2 className="w-5 h-5 text-[#FFC800]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-[#2B3056] truncate">
                    Pemeriksaan & Analisa Dokumen
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">
                    Unggah naskah peraturan (PDF/DOCX) untuk pemindaian otomatis kesesuaian format
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {!selectedFile ? (
                  <label
                    htmlFor="document-upload"
                    className="block cursor-pointer group"
                  >
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 sm:p-8 text-center transition-colors hover:border-[#2B3056] hover:bg-slate-50/50">
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
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#2B3056] shrink-0">
                    <Search className="w-5 h-5 text-[#2B3056]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[#2B3056] truncate">
                      Hasil Analisa & Rekomendasi
                    </h2>
                    <p className="text-xs text-slate-500 font-normal">
                      Ringkasan parameter kesesuaian naskah hukum
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {analysisResult && (
                    <>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setExportOpen((o) => !o)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B3056] hover:bg-[#232849] text-white text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Export
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        {exportOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                              <ExportMenuItem
                                icon={FileText}
                                iconClass="text-blue-600"
                                label="Naskah Bersih (Word .docx)"
                                loading={exportingMode === 'clean'}
                                onClick={() => handleExport('clean')}
                              />
                              <ExportMenuItem
                                icon={Highlighter}
                                iconClass="text-orange-600"
                                label="Mode Track Changes (Coret/Tambah)"
                                loading={exportingMode === 'track_changes'}
                                onClick={() => handleExport('track_changes')}
                              />
                              <ExportMenuItem
                                icon={ScrollText}
                                iconClass="text-emerald-600"
                                label="Laporan Audit Eksekutif (.docx)"
                                loading={exportingMode === 'audit_report'}
                                onClick={() => handleExport('audit_report')}
                              />
                              <ExportMenuItem
                                icon={Code2}
                                iconClass="text-slate-500"
                                label="Data Mentah (JSON)"
                                onClick={handleExportJson}
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setChatOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-[#2B3056] text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        Tanya Asisten AI
                      </button>
                    </>
                  )}

                  {isAnalyzing ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-[11px] font-bold text-amber-700 border border-amber-200 animate-pulse shrink-0">
                      Sedang Memindai
                    </span>
                  ) : analysisResult ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700 border border-emerald-200 shrink-0">
                      Selesai Dipindai
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500 border border-slate-200 shrink-0">
                      Menunggu Dokumen
                    </span>
                  )}
                </div>
              </div>

              {isAnalyzing ? (
                <div className="p-6 sm:p-12 flex items-center justify-center">
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
                <div className="p-8 sm:p-10 text-center">
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
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Score Banner */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="relative shrink-0 mx-auto sm:mx-0">
                      <div className="w-20 h-20 rounded-full bg-[#2B3056] flex items-center justify-center text-white text-2xl font-extrabold shadow-inner">
                        {analysisResult.score}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white border-2 border-white ${gradeBadgeClass(
                          analysisResult.grade
                        )}`}
                      >
                        {analysisResult.grade}
                      </div>
                    </div>

                    <div className="min-w-0 text-center sm:text-left">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Skor Kepatuhan & Kualitas Naskah
                      </p>
                      <p className="text-sm font-bold text-[#2B3056] mt-0.5">
                        Grade {analysisResult.grade} – {analysisResult.predicate}
                      </p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                        <SubPill icon={ShieldCheck} label="Pedoman" value={analysisResult.subScores.pedoman} />
                        <SubPill icon={SpellCheck} label="Ejaan" value={analysisResult.subScores.ejaan} />
                        <SubPill icon={Quote} label="Tanda Baca & Kosa Kata" value={analysisResult.subScores.punct} />
                        <SubPill icon={FileCheck2} label="Struktur UU" value={analysisResult.subScores.struct} />
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Klasifikasi Temuan
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <ResultStat title="Total Blok" value={analysisResult.totalBlocks} icon={Layers} color="blue" />
                      <ResultStat title="Sesuai" value={analysisResult.sesuai} icon={CheckCircle2} color="emerald" />
                      <ResultStat title="Pedoman/UU" value={analysisResult.recommendations} icon={AlertTriangle} color="red" />
                      <ResultStat title="Ejaan & Tanda Baca" value={analysisResult.errorsEjaanTandaBaca} icon={SpellCheck} color="amber" />
                      <ResultStat title="Total Kesalahan" value={analysisResult.totalErrors} icon={Bug} color="sky" />
                      <ResultStat title="Tanda Baca" value={analysisResult.errorsTandaBaca} icon={Quote} color="orange" />
                      <ResultStat title="Kosa Kata" value={analysisResult.errorsKosaKata} icon={BookOpenText} color="purple" />
                      <ResultStat title="Kalimat Panjang" value={analysisResult.longSentences} icon={AlignLeft} color="slate" />
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

      {/* Tanya Asisten AI - Chat Drawer */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setChatOpen(false)} />
          <div className="relative w-full sm:w-[26rem] h-[85vh] sm:h-[36rem] bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-[#2B3056]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#FFD82B]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white truncate">Tanya Asisten AI</h3>
                  <p className="text-[10px] text-slate-300">Seputar hasil analisa naskah ini</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <Bot className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-500 max-w-[15rem] mx-auto">
                    Tanyakan apa saja soal hasil analisa naskah ini, misalnya alasan sebuah temuan atau saran perbaikannya.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-[#2B3056] text-white rounded-br-sm'
                          : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                    <Loader2 className="w-3.5 h-3.5 text-[#2B3056] animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-slate-100 bg-white">
              <div className="flex items-end gap-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                  rows={1}
                  placeholder="Tulis pertanyaan..."
                  className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B3056]/20 focus:border-[#2B3056]"
                />
                <button
                  type="button"
                  onClick={handleSendChat}
                  disabled={!chatInput.trim() || chatLoading}
                  className="w-9 h-9 shrink-0 rounded-xl bg-[#2B3056] hover:bg-[#232849] text-[#FFD82B] flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

const STAT_ICON_COLORS = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
  slate: 'bg-slate-100 text-slate-500',
};

const ResultStat = ({ title, value, icon: Icon, color = 'blue' }) => (
  <div className="p-3 bg-white border border-slate-200/80 rounded-xl">
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-500 font-medium">{title}</span>
      <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${STAT_ICON_COLORS[color] || STAT_ICON_COLORS.blue}`}>
        <Icon className="w-3.5 h-3.5" />
      </span>
    </div>
    <p className="text-lg font-bold text-[#2B3056] mt-1">{value}</p>
  </div>
);

const SubPill = ({ icon: Icon, label, value }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
    <Icon className="w-3 h-3 text-[#2B3056]" />
    {label}: <strong className="text-[#2B3056]">{value}%</strong>
  </span>
);

function gradeBadgeClass(grade) {
  const map = {
    A: 'bg-emerald-500',
    B: 'bg-sky-500',
    C: 'bg-amber-500',
    D: 'bg-orange-500',
    E: 'bg-red-500',
  };
  return map[grade] || 'bg-slate-400';
}

const ExportMenuItem = ({ icon: Icon, iconClass, label, loading, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
  >
    {loading ? (
      <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0" />
    ) : (
      <Icon className={`w-4 h-4 shrink-0 ${iconClass || 'text-slate-500'}`} />
    )}
    {label}
  </button>
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