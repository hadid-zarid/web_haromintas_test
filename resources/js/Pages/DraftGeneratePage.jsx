import React, { useState, useMemo } from 'react';
import AppLayout from '../components/layout/AppLayout';
import DraftGenerateModal from '../components/modals/DraftGenerateModal';
import { useToast } from '../context/ToastContext';
import {
  FileOutput,
  FileText,
  ClipboardList,
  Sparkles,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Clock,
  Scale,
  Search,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const INITIAL_HISTORY = [
  {
    id: 'DRAFT-2024-001',
    nomorSurat: 'W.4-PP.04.02-1189',
    jenis: 'Surat Selesai PERDA',
    judul: 'Rancangan Peraturan Daerah Kota Pekanbaru tentang Pajak Daerah dan Retribusi Daerah',
    kabupaten: 'Kota Pekanbaru',
    tanggal: '25 Juli 2024',
    status: 'Selesai Harmonisasi'
  },
  {
    id: 'DRAFT-2024-002',
    nomorSurat: 'W.4-PP.04.02-1240',
    jenis: 'Surat Selesai PERKADA',
    judul: 'Rancangan Peraturan Bupati Kampar tentang Rencana Detail Tata Ruang Kawasan Strategis',
    kabupaten: 'Kab. Kampar',
    tanggal: '28 Juli 2024',
    status: 'Selesai Harmonisasi'
  },
  {
    id: 'DRAFT-2024-003',
    nomorSurat: 'W.4-PP.04.02-1310',
    jenis: 'Surat Selesai PERKADA',
    judul: 'Rancangan Peraturan Bupati Siak tentang Pelestarian Cagar Budaya Melayu',
    kabupaten: 'Kab. Siak',
    tanggal: '05 Agustus 2024',
    status: 'Selesai Harmonisasi'
  }
];

const DraftGeneratePage = () => {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState('overview'); // 'overview' atau 'generator'
  const [generatorType, setGeneratorType] = useState('perda');
  const [historyList, setHistoryList] = useState(INITIAL_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenGenerator = (type) => {
    setGeneratorType(type);
    setViewMode('generator');
  };

  const handleSaveHistory = (newEntry) => {
    setHistoryList((prev) => [
      {
        ...newEntry,
        status: 'Selesai Harmonisasi'
      },
      ...prev
    ]);
  };

  const handleQuickPrint = (item) => {
    setGeneratorType(item.jenis.includes('PERDA') ? 'perda' : 'perkada');
    setViewMode('generator');
  };

  // Filter Riwayat Draf Berdasarkan Pencarian
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return historyList;
    const query = searchQuery.toLowerCase();
    return historyList.filter(
      (item) =>
        item.nomorSurat.toLowerCase().includes(query) ||
        item.judul.toLowerCase().includes(query) ||
        item.kabupaten.toLowerCase().includes(query) ||
        item.jenis.toLowerCase().includes(query)
    );
  }, [historyList, searchQuery]);

  return (
    <AppLayout title="Draft Generate Surat">
      <div className="space-y-8 pb-10">

        {/* =====================================================
            VIEW MODE 1: FULL PAGE GENERATOR (INLINE)
        ====================================================== */}
        {viewMode === 'generator' ? (
          <div className="space-y-6 animate-fadeIn transition-all duration-300">
            {/* Header Navigasi Kembali */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-[#E2E2DC] rounded-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F5F0] border border-[#E2E2DC] text-xs font-black text-[#1A1A5E] hover:bg-[#1A1A5E] hover:text-white hover:border-[#1A1A5E] active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4 text-[#1A1A5E] group-hover:-translate-x-1 group-hover:text-white transition-all" />
                  <span>Kembali</span>
                </button>
                <div className="h-8 w-px bg-[#E2E2DC] hidden sm:block" />
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#3D3D3A]/60 uppercase tracking-wider">
                    <span>Draft Generator</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#1A1A5E]">
                      {generatorType === 'perda' ? 'Surat Selesai PERDA' : 'Surat Selesai PERKADA'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#1A1A5E] tracking-tight">
                    Lembar Generator Surat Selesai Harmonisasi
                  </h3>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold shrink-0 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Mode Pratinjau Real-Time</span>
              </div>
            </div>

            {/* Render Generator Surat Secara Penuh */}
            <div className="flat-card p-6 border border-[#E2E2DC] bg-white rounded-2xl shadow-xs">
              <DraftGenerateModal
                isOpen={true}
                isModal={false}
                onClose={() => setViewMode('overview')}
                initialType={generatorType}
                onSaveHistory={handleSaveHistory}
              />
            </div>
          </div>
        ) : (
          /* =====================================================
              VIEW MODE 2: OVERVIEW CARDS & RIWAYAT DRAF
          ====================================================== */
          <div className="space-y-8 animate-fadeIn transition-all duration-300">

            {/* HERO INTRO SECTION (VERSI SIMPEL & KONSISTEN 1 WARNA) */}
            <div className="rounded-xl bg-[#1A1A5E] p-5 text-white shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0">
                    <FileOutput className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-slate-200 text-[10px] font-semibold tracking-wide mb-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Standar Resmi Kanwil Kemenkumham Riau</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Draft Generator Surat Selesai Harmonisasi
                    </h2>
                    <p className="text-xs text-slate-300 font-normal leading-normal">
                      Generate naskah dinas Ranperda &amp; Ranperkada secara instan, presisi, dan siap diunduh (.docx / PDF).
                    </p>
                  </div>
                </div>

                {/* Stat Box Simpel */}
                <div className="shrink-0 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-center min-w-[110px]">
                  <p className="text-[10px] uppercase font-medium text-slate-300 tracking-wider">Total Terbit</p>
                  <p className="text-base font-bold text-white">{historyList.length} Draf</p>
                </div>
              </div>
            </div>

            {/* PILIHAN JENIS TEMPLATE SURAT */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#1A1A5E] uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#FFC800]" />
                    Pilih Format Template Surat
                  </h3>
                  <p className="text-xs text-[#3D3D3A]/70 font-medium mt-0.5">
                    Gunakan template baku yang disesuaikan dengan jenis rancangan perundang-undangan
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* CARD 1: SURAT SELESAI PERDA */}
                <div className="group flat-card p-6 relative overflow-hidden bg-white border border-[#E2E2DC] rounded-2xl transition-all duration-300 hover:border-[#1A1A5E] hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1A1A5E] transition-all group-hover:h-2" />

                  <div>
                    <div className="flex items-start justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#1A1A5E] group-hover:text-white transition-all duration-300">
                          <FileText className="w-6 h-6 text-[#1A1A5E] group-hover:text-white transition-colors" />
                        </div>

                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-950 text-[10px] font-black uppercase tracking-wider mb-1">
                            Ranperda (Perda)
                          </span>
                          <h4 className="text-lg font-black text-[#1A1A5E] group-hover:text-blue-900 transition-colors">
                            Surat Selesai PERDA
                          </h4>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold shrink-0">
                        Format DOCX / PDF
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E2E2DC] space-y-3">
                      <p className="text-xs text-[#3D3D3A]/80 leading-relaxed font-medium">
                        Surat penyampaian hasil harmonisasi untuk <strong>Rancangan Peraturan Daerah</strong> berdasarkan ketentuan regulasi pembentukan perundang-undangan.
                      </p>

                      <div className="bg-[#F8F8F5] p-3.5 rounded-xl border border-[#E2E2DC] text-[11px] space-y-2 font-medium text-slate-700 group-hover:bg-blue-50/40 transition-colors">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Rujukan Utama: <strong>Pasal 58 UU No. 12 Tahun 2011</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Format Penomoran: <strong>Sesuai input (Kustom)</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Ekspor langsung ke <strong>Microsoft Word (.docx) &amp; Cetak PDF</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E2E2DC]">
                    <button
                      type="button"
                      onClick={() => handleOpenGenerator('perda')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFE082] hover:to-[#FFC107] active:scale-[0.98] px-5 py-3 text-xs font-black text-[#1A1A5E] shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                    >
                      <FileOutput className="w-4 h-4" />
                      <span>Buka Generator Surat PERDA</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* CARD 2: SURAT SELESAI PERKADA */}
                <div className="group flat-card p-6 relative overflow-hidden bg-white border border-[#E2E2DC] rounded-2xl transition-all duration-300 hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500 transition-all group-hover:h-2" />

                  <div>
                    <div className="flex items-start justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                          <ClipboardList className="w-6 h-6 text-amber-800 group-hover:text-white transition-colors" />
                        </div>

                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 text-[10px] font-black uppercase tracking-wider mb-1">
                            Ranperbup / Ranperwal / Pergub
                          </span>
                          <h4 className="text-lg font-black text-[#1A1A5E] group-hover:text-amber-900 transition-colors">
                            Surat Selesai PERKADA
                          </h4>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold shrink-0">
                        Format DOCX / PDF
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E2E2DC] space-y-3">
                      <p className="text-xs text-[#3D3D3A]/80 leading-relaxed font-medium">
                        Surat penyampaian hasil harmonisasi untuk <strong>Peraturan Kepala Daerah</strong> (Perbup / Perwal / Pergub) sesuai standar tata naskah dinas.
                      </p>

                      <div className="bg-[#F8F8F5] p-3.5 rounded-xl border border-[#E2E2DC] text-[11px] space-y-2 font-medium text-slate-700 group-hover:bg-amber-50/40 transition-colors">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Rujukan Utama: <strong>Pasal 97D UU No. 13 Tahun 2022</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Format Penomoran: <strong>Sesuai input (Kustom)</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Ekspor langsung ke <strong>Microsoft Word (.docx) &amp; Cetak PDF</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E2E2DC]">
                    <button
                      type="button"
                      onClick={() => handleOpenGenerator('perkada')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFE082] hover:to-[#FFC107] active:scale-[0.98] px-5 py-3 text-xs font-black text-[#1A1A5E] shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                    >
                      <FileOutput className="w-4 h-4" />
                      <span>Buka Generator Surat PERKADA</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* RIWAYAT SURAT YANG TELAH DI-GENERATE */}
            <div className="flat-card p-6 bg-white border border-[#E2E2DC] rounded-2xl space-y-5 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-black text-[#1A1A5E] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FFC800]" />
                    Riwayat Draf Surat Selesai Harmonisasi
                  </h4>
                  <p className="text-xs text-[#3D3D3A]/60 font-medium mt-0.5">
                    Daftar dokumen surat penyampaian hasil yang pernah dibuat sebelumnya
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  {/* Search Field */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nomor, judul, daerah..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F5F5F0] border border-[#E2E2DC] rounded-xl text-xs font-medium focus:outline-none focus:border-[#1A1A5E] focus:bg-white transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenGenerator('perda')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1A1A5E] text-white px-4 py-2 text-xs rounded-xl font-bold hover:bg-[#2E3A87] active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <FileOutput className="w-3.5 h-3.5 text-[#FFC800]" />
                    <span>Buat Surat Baru</span>
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto border border-[#E2E2DC] rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E2DC] bg-[#F8F8F5] text-[#1A1A5E]">
                      <th className="p-3.5 font-black uppercase text-[10px] tracking-wider">Nomor Surat Kanwil</th>
                      <th className="p-3.5 font-black uppercase text-[10px] tracking-wider">Jenis Surat</th>
                      <th className="p-3.5 font-black uppercase text-[10px] tracking-wider">Judul Regulasi</th>
                      <th className="p-3.5 font-black uppercase text-[10px] tracking-wider">Pemerintah Daerah</th>
                      <th className="p-3.5 font-black uppercase text-[10px] tracking-wider">Tanggal</th>
                      <th className="p-3.5 font-black uppercase text-[10px] tracking-wider text-center">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E2DC] bg-white">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-[#1A1A5E]/5 transition-colors duration-150">
                          <td className="p-3.5 font-mono font-bold text-[#1A1A5E] whitespace-nowrap">
                            {item.nomorSurat}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black ${item.jenis.includes('PERDA')
                                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                  : 'bg-amber-50 text-amber-900 border border-amber-200'
                                }`}
                            >
                              {item.jenis}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-[#3D3D3A] max-w-xs truncate" title={item.judul}>
                            {item.judul}
                          </td>
                          <td className="p-3.5 font-medium text-slate-700 whitespace-nowrap">
                            {item.kabupaten}
                          </td>
                          <td className="p-3.5 text-slate-500 whitespace-nowrap font-medium">
                            {item.tanggal}
                          </td>
                          <td className="p-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleQuickPrint(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 active:scale-95 transition-all text-[11px] font-bold cursor-pointer"
                                title="Buka Generator & Unduh Word (.docx)"
                              >
                                <Download className="w-3.5 h-3.5 text-blue-700" />
                                <span>Word</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleQuickPrint(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100 active:scale-95 transition-all text-[11px] font-bold cursor-pointer"
                                title="Buka Generator & Cetak / Simpan PDF"
                              >
                                <Printer className="w-3.5 h-3.5 text-amber-800" />
                                <span>PDF</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleQuickPrint(item)}
                                className="p-1.5 rounded-lg border border-[#E2E2DC] bg-white text-[#1A1A5E] hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                                title="Buka Pratinjau Lembar Surat"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 text-xs font-medium">
                          Tidak ada draf surat yang sesuai dengan pencarian Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PANDUAN DASAR HUKUM */}
            <div className="flat-card p-6 bg-[#F8F8F5] border border-[#E2E2DC] rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-[#1A1A5E] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#FFC800]" />
                Landasan Hukum Surat Harmonisasi Kanwil Kemenkumham Riau
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#3D3D3A]/80 leading-relaxed font-medium">
                <div className="p-4 bg-white rounded-xl border border-[#E2E2DC] space-y-1 hover:border-[#1A1A5E]/40 transition-colors">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-black text-[10px] uppercase inline-block mb-1">
                    Format Perda
                  </span>
                  <h5 className="font-black text-[#1A1A5E]">Pasal 58 UU No. 12 Tahun 2011</h5>
                  <p>
                    Mengatur bahwa pengharmonisasian, pembulatan, dan pemantapan konsepsi Rancangan Peraturan Daerah dikoordinasikan oleh Kementerian Hukum.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E2E2DC] space-y-1 hover:border-amber-400/50 transition-colors">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[10px] uppercase inline-block mb-1">
                    Format Perkada
                  </span>
                  <h5 className="font-black text-[#1A1A5E]">Pasal 97D UU No. 13 Tahun 2022</h5>
                  <p>
                    Mengatur bahwa pengharmonisasian, pembulatan, dan pemantapan konsepsi Rancangan Peraturan Kepala Daerah (Perbup/Perwal/Pergub) dikoordinasikan oleh Kementerian Hukum.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default DraftGeneratePage;