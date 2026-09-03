import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../components/layout/AppLayout';
import { DraftGenerateModal } from '../components/modals/DraftGenerateModal';
import {
  FileText,
  FileOutput,
  Scale,
  Download,
  Printer,
  Eye,
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  ClipboardList,
  ArrowLeft,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

export const DraftGeneratePage = () => {
  // State untuk berpindah view: 'overview' (kartu & riwayat) atau 'generator' (lembar generator aktif)
  const [viewMode, setViewMode] = useState('overview');
  const [generatorType, setGeneratorType] = useState('perda'); // 'perda' | 'perkada'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'PERDA' | 'PERKADA'

  // Data Riwayat Draf Surat
  const [historyList, setHistoryList] = useState([
    {
      id: 'DRAFT-001',
      nomorSurat: 'W.4-PP.04.02-1489',
      jenis: 'Surat Selesai PERDA',
      judul: 'Pajak Daerah dan Retribusi Daerah',
      kabupaten: 'Kota Pekanbaru',
      tanggal: '15 Juli 2024',
      pejabat: 'Rudy Hendra Pakpahan',
      typeCode: 'perda',
    },
    {
      id: 'DRAFT-002',
      nomorSurat: 'W.4-PP.04.02-1492',
      jenis: 'Surat Selesai PERKADA',
      judul: 'Rencana Detail Tata Ruang Kawasan Strategis',
      kabupaten: 'Kabupaten Kampar',
      tanggal: '22 Juli 2024',
      pejabat: 'Rudy Hendra Pakpahan',
      typeCode: 'perkada',
    },
    {
      id: 'DRAFT-003',
      nomorSurat: 'W.4-PP.04.02-1505',
      jenis: 'Surat Selesai PERDA',
      judul: 'Rencana Pembangunan Jangka Panjang Daerah (RPJPD) 2025-2045',
      kabupaten: 'Kabupaten Siak',
      tanggal: '05 Agustus 2024',
      pejabat: 'Rudy Hendra Pakpahan',
      typeCode: 'perda',
    },
    {
      id: 'DRAFT-004',
      nomorSurat: 'W.4-PP.04.02-1518',
      jenis: 'Surat Selesai PERKADA',
      judul: 'Tata Cara Pemungutan Pajak Sarang Burung Walet',
      kabupaten: 'Kabupaten Bengkalis',
      tanggal: '12 Agustus 2024',
      pejabat: 'Rudy Hendra Pakpahan',
      typeCode: 'perkada',
    },
  ]);

  const handleOpenGenerator = (type) => {
    setGeneratorType(type);
    setViewMode('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickPrint = (item) => {
    setGeneratorType(item.typeCode || (item.jenis.includes('PERDA') ? 'perda' : 'perkada'));
    setViewMode('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveHistory = (newDraft = {}) => {
    // Modal mengirim { id, nomorSurat, jenis, judul, kabupaten, tanggal, ... }.
    // Terima juga bentuk lama ({ jenisPeraturan, judulPeraturan, ... }) sebagai cadangan.
    const jenisRaw = String(newDraft.jenisPeraturan || '');
    const jenis =
      newDraft.jenis ||
      (jenisRaw.includes('Daerah') ? 'Surat Selesai PERDA' : 'Surat Selesai PERKADA');
    const isPerda = String(jenis).includes('PERDA');

    setHistoryList((prev) => [
      {
        id: newDraft.id || `DRAFT-${Date.now()}`,
        nomorSurat:
          newDraft.nomorSurat || `W.4-PP.04.02-${Math.floor(1000 + Math.random() * 9000)}`,
        jenis,
        judul: newDraft.judul || newDraft.judulPeraturan || '-',
        kabupaten: newDraft.kabupaten || newDraft.asalPemrakarsa || '-',
        tanggal: newDraft.tanggal || newDraft.tanggalSurat || '',
        pejabat: newDraft.pejabat || newDraft.namaKakanwil || '',
        typeCode: isPerda ? 'perda' : 'perkada',
      },
      ...prev,
    ]);
  };

  const filteredHistory = historyList.filter((item) => {
    const matchSearch =
      item.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kabupaten.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'ALL') return matchSearch;
    if (filterType === 'PERDA') return matchSearch && item.jenis.includes('PERDA');
    if (filterType === 'PERKADA') return matchSearch && item.jenis.includes('PERKADA');
    return matchSearch;
  });

  return (
    <AppLayout
      title="Draft Generator Surat Harmonisasi"
      subtitle="Otomasi penyusunan naskah dinas resmi surat selesai harmonisasi Ranperda & Ranperkada (.docx / PDF)."
    >
      <Head title="Draft Generator Surat - HARMONITAS" />

      <div className="space-y-6 max-w-7xl mx-auto">

        {/* ======================================================
            VIEW MODE 1: LEMBAR GENERATOR SURAT (FULL SCREEN IN-PAGE)
        ====================================================== */}
        {viewMode === 'generator' ? (
          <div className="space-y-6 animate-fadeIn transition-all duration-300">
            
            {/* Header Navigasi Kembali */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-[#2B3056] hover:bg-[#2B3056] hover:text-white hover:border-[#2B3056] active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4 text-[#2B3056] group-hover:-translate-x-1 group-hover:text-white transition-all" />
                  <span>Kembali ke Ringkasan</span>
                </button>
                <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Draft Generator</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span className="text-[#2B3056] font-extrabold">
                      {generatorType === 'perda' ? 'Surat Selesai PERDA' : 'Surat Selesai PERKADA'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#2B3056] tracking-tight">
                    Lembar Generator Surat Selesai Harmonisasi
                  </h3>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shrink-0">
                <span className="h-2 w-2 rounded-sm bg-[#FFC800]" />
                <span>Mode Pratinjau Baku Terkoneksi</span>
              </div>
            </div>

            {/* Render Generator Surat Secara Penuh */}
            <div className="p-6 border border-slate-200 bg-white rounded-2xl shadow-xs">
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

            {/* HERO BANNER RESMI DENGAN NAVY UTAMA (#2B3056) & AKSEN EMAS */}
            <div className="rounded-2xl bg-[#2B3056] p-6 sm:p-7 text-white shadow-md border border-[#3A4070]">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#FFD82B] shrink-0 mt-0.5">
                    <FileOutput className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-white/10 text-[#FFD82B] text-xs font-bold tracking-wide">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Standar Tata Naskah Dinas Resmi Kanwil Kemenkum Provinsi Riau</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      Draft Generator Surat Selesai Harmonisasi
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-2xl">
                      Penyusunan naskah dinas resmi surat penyampaian hasil harmonisasi Ranperda &amp; Ranperkada secara instan, presisi, dan siap diunduh dalam format Microsoft Word (.docx) maupun cetak PDF.
                    </p>
                  </div>
                </div>

                {/* Quick Stats Ribbon */}
                <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
                  <div className="flex-1 lg:flex-none px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-center min-w-[120px]">
                    <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Total Draf Terbit</p>
                    <p className="text-xl font-black text-[#FFD82B]">{historyList.length}</p>
                  </div>
                  <div className="flex-1 lg:flex-none px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-center min-w-[120px]">
                    <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Format Ekspor</p>
                    <p className="text-sm font-bold text-white">DOCX &amp; PDF</p>
                  </div>
                </div>

              </div>
            </div>

            {/* PILIHAN FORMAT TEMPLATE SURAT (2 CARDS) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#2B3056] flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#B3912D]" />
                    Pilih Format Naskah Surat
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    Gunakan template baku yang disesuaikan dengan jenis rancangan peraturan perundang-undangan
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* CARD 1: SURAT SELESAI PERDA */}
                <div className="group p-6 sm:p-7 relative overflow-hidden bg-white border border-slate-200 rounded-2xl transition-all duration-200 hover:border-[#2B3056]/40 hover:shadow-lg flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2B3056]" />

                  <div>
                    <div className="flex items-start justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-[#2B3056] group-hover:scale-105 transition-all">
                          <FileText className="w-6 h-6 text-[#2B3056]" />
                        </div>

                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                            Ranperda (Perda Daerah)
                          </span>
                          <h4 className="text-lg font-extrabold text-[#2B3056]">
                            Surat Selesai PERDA
                          </h4>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold shrink-0">
                        Format DOCX / PDF
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Surat penyampaian hasil harmonisasi untuk <strong>Rancangan Peraturan Daerah</strong> berdasarkan ketentuan perundang-undangan.
                      </p>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2 text-slate-700">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" />
                          <span>Rujukan Hukum: <strong>Pasal 58 UU No. 12 Tahun 2011</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" />
                          <span>Penomoran Resmi: <strong>Format baku Kanwil Riau (Kustom)</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" />
                          <span>Output: <strong>Microsoft Word (.docx) &amp; Cetak PDF</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenGenerator('perda')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 active:scale-[0.98] px-5 py-3 text-xs font-bold text-[#2B3056] shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                    >
                      <FileOutput className="w-4 h-4" />
                      <span>Buka Generator Surat PERDA</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* CARD 2: SURAT SELESAI PERKADA */}
                <div className="group p-6 sm:p-7 relative overflow-hidden bg-white border border-slate-200 rounded-2xl transition-all duration-200 hover:border-[#2B3056]/40 hover:shadow-lg flex flex-col justify-between">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FFC800]" />

                  <div>
                    <div className="flex items-start justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-800 group-hover:scale-105 transition-all">
                          <ClipboardList className="w-6 h-6 text-[#B3912D]" />
                        </div>

                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                            Ranperbup / Ranperwal / Pergub
                          </span>
                          <h4 className="text-lg font-extrabold text-[#2B3056]">
                            Surat Selesai PERKADA
                          </h4>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold shrink-0">
                        Format DOCX / PDF
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Surat penyampaian hasil harmonisasi untuk <strong>Peraturan Kepala Daerah</strong> (Perbup / Perwal / Pergub) sesuai tata naskah dinas.
                      </p>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2 text-slate-700">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" />
                          <span>Rujukan Hukum: <strong>Pasal 97D UU No. 13 Tahun 2022</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" />
                          <span>Penomoran Resmi: <strong>Format baku Kanwil Riau (Kustom)</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" />
                          <span>Output: <strong>Microsoft Word (.docx) &amp; Cetak PDF</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenGenerator('perkada')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 active:scale-[0.98] px-5 py-3 text-xs font-bold text-[#2B3056] shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
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
            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-5 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-extrabold text-[#2B3056] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B3912D]" />
                    Riwayat Draf Surat Selesai Harmonisasi
                  </h4>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    Daftar dokumen surat penyampaian hasil harmonisasi yang pernah dibuat di sistem
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  {/* Filter Chips */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setFilterType('ALL')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        filterType === 'ALL'
                          ? 'bg-[#2B3056] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#2B3056]'
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('PERDA')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        filterType === 'PERDA'
                          ? 'bg-[#2B3056] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#2B3056]'
                      }`}
                    >
                      PERDA
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType('PERKADA')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        filterType === 'PERKADA'
                          ? 'bg-[#2B3056] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#2B3056]'
                      }`}
                    >
                      PERKADA
                    </button>
                  </div>

                  {/* Search Field */}
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nomor, judul, daerah..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2B3056] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[#2B3056]">
                      <th className="p-3.5 font-extrabold uppercase text-[10px] tracking-wider">Nomor Surat Kanwil</th>
                      <th className="p-3.5 font-extrabold uppercase text-[10px] tracking-wider">Jenis Surat</th>
                      <th className="p-3.5 font-extrabold uppercase text-[10px] tracking-wider">Judul Regulasi</th>
                      <th className="p-3.5 font-extrabold uppercase text-[10px] tracking-wider">Pemerintah Daerah</th>
                      <th className="p-3.5 font-extrabold uppercase text-[10px] tracking-wider">Tanggal</th>
                      <th className="p-3.5 font-extrabold uppercase text-[10px] tracking-wider text-center">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors duration-150">
                          <td className="p-3.5 font-mono font-bold text-[#2B3056] whitespace-nowrap">
                            {item.nomorSurat}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                item.jenis.includes('PERDA')
                                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                  : 'bg-amber-50 text-amber-900 border border-amber-200'
                              }`}
                            >
                              {item.jenis}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-800 max-w-xs truncate" title={item.judul}>
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
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#2B3056]/20 bg-[#2B3056]/5 text-[#2B3056] hover:bg-[#2B3056] hover:text-white active:scale-95 transition-all text-[11px] font-bold cursor-pointer"
                                title="Buka Generator & Unduh Word (.docx)"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Word</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleQuickPrint(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100 active:scale-95 transition-all text-[11px] font-bold cursor-pointer"
                                title="Buka Generator & Cetak / Simpan PDF"
                              >
                                <Printer className="w-3.5 h-3.5 text-[#B3912D]" />
                                <span>PDF</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleQuickPrint(item)}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white text-[#2B3056] hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
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
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-extrabold text-[#2B3056] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#B3912D]" />
                Landasan Hukum Surat Harmonisasi Kanwil Kemenkum Provinsi Riau
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed font-normal">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold text-[10px] uppercase inline-block">
                    Format PERDA
                  </span>
                  <h5 className="font-bold text-[#2B3056]">Pasal 58 UU No. 12 Tahun 2011</h5>
                  <p className="text-slate-600">
                    Pengharmonisasian, pembulatan, dan pemantapan konsepsi Rancangan Peraturan Daerah dikoordinasikan oleh Kementerian Hukum melalui Kantor Wilayah.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] uppercase inline-block">
                    Format PERKADA
                  </span>
                  <h5 className="font-bold text-[#2B3056]">Pasal 97D UU No. 13 Tahun 2022</h5>
                  <p className="text-slate-600">
                    Pengharmonisasian, pembulatan, dan pemantapan konsepsi Rancangan Peraturan Kepala Daerah (Perbup/Perwal/Pergub) dikoordinasikan oleh Kementerian Hukum melalui Kantor Wilayah.
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