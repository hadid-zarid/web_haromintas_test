import React, { useState } from 'react';
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
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Clock,
  Building,
  Layers,
  Scale
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

  const handleOpenGenerator = (type) => {
    setGeneratorType(type);
    setViewMode('generator');
  };

  const handleSaveHistory = (newEntry) => {
    setHistoryList(prev => [
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

  return (
    <AppLayout title="Draft Generate Surat">
      <div className="space-y-6">

        {/* =====================================================
            VIEW MODE 1: FULL PAGE GENERATOR (TANPA POPUP MODAL)
        ====================================================== */}
        {viewMode === 'generator' ? (
          <div className="space-y-5">
            {/* Header Navigasi Kembali */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white border border-[#E2E2DC] rounded-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5F5F0] border border-[#E2E2DC] text-xs font-black text-[#1A1A5E] hover:bg-amber-100/60 hover:border-amber-300 transition-all cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4 text-[#1A1A5E]" />
                  <span>Kembali ke Daftar Draf</span>
                </button>
                <div>
                  <h3 className="text-lg font-black text-[#1A1A5E] tracking-tight">
                    Lembar Generator Surat Selesai Harmonisasi
                  </h3>
                  <p className="text-xs text-[#3D3D3A]/70 font-semibold">
                    Atur variabel & pratinjau lembar naskah dinas resmi sebelum diunduh (.docx) atau dicetak (PDF)
                  </p>
                </div>
              </div>
            </div>

            {/* Render Generator Surat Secara Penuh di Halaman (Inline, Tanpa Modal Backdrop) */}
            <div className="flat-card p-6 border border-[#E2E2DC] bg-white">
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
          <div className="space-y-6">

            {/* HERO INTRO SECTION */}
            <div className="flat-card p-6 bg-gradient-to-r from-white via-white to-amber-50/40 border border-[#E2E2DC] relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-full bg-[#FFC800]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1A1A5E] to-[#2E3A87] flex items-center justify-center text-[#FFC800] shrink-0 shadow-md">
                    <FileOutput className="w-7 h-7" />
                  </div>

                  <div>
                    {/* <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFC800]/20 text-[#1A1A5E] text-[10px] font-black uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Format 100% Sesuai Template Resmi Kantor Wilayah Kementerian Hukum Riau</span>
                    </div> */}
                    <h3 className="text-xl font-black text-[#1A1A5E] tracking-tight">
                      Draft Generator Surat Selesai Harmonisasi
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#3D3D3A]/75 font-medium max-w-2xl leading-relaxed">
                      Generate naskah dinas resmi surat penyampaian hasil harmonisasi Ranperda & Ranperkada secara instan dan <strong>100% persis sama dengan template resmi Word (.docx)</strong> Kanwil Kemenkumham Riau.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="p-3 bg-[#F5F5F0] border border-[#E2E2DC] rounded-xl text-center">
                    <p className="text-[10px] uppercase font-bold text-[#3D3D3A]/60">Total Terbit</p>
                    <p className="text-lg font-black text-[#1A1A5E]">{historyList.length} Draf</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PILIHAN JENIS TEMPLATE SURAT */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="text-sm font-black text-[#1A1A5E] uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#FFC800]" />
                  Pilih Format Template Surat Selesai
                </h4>
                <span className="text-xs font-semibold text-[#3D3D3A]/60">
                  Template Asli: SURAT SELESAI PERDA.docx & SURAT SELESAI PERKADA.docx
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* CARD 1: SURAT SELESAI PERDA */}
                <div className="flat-card p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-t-4 border-t-[#1A1A5E] flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-[#1A1A5E]" />
                        </div>

                        <div>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-950 text-[10px] font-black uppercase tracking-wider mb-1">
                            Ranperda (Perda)
                          </div>
                          <h4 className="text-base font-black text-[#1A1A5E]">
                            Surat Selesai PERDA
                          </h4>
                          <p className="text-[11px] text-[#3D3D3A]/60 font-semibold">
                            Pasal 58 UU No. 12 Tahun 2011
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold shrink-0">
                        Template Word Asli
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E2E2DC] space-y-3">
                      <p className="text-xs text-[#3D3D3A]/80 leading-relaxed font-medium">
                        Surat penyampaian hasil harmonisasi untuk <strong>Rancangan Peraturan Daerah</strong> berdasarkan ketentuan <strong>Pasal 58 UU No. 12 Tahun 2011</strong> dengan kesimpulan substansi tidak bertentangan dengan hukum yang lebih tinggi, sejajar, dan putusan pengadilan.
                      </p>

                      <div className="bg-[#F8F8F5] p-3 rounded-xl border border-[#E2E2DC] text-[11px] space-y-1.5 font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Rujukan: <strong>Pasal 58 UU 12/2011</strong> (Pembentukan Peraturan Perundang-undangan)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Nomor Surat: <strong>W.4-PP.04.02-«NOMOR»</strong> & Penandatangan <strong>Rudy Hendra Pakpahan</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Ekspor langsung ke file <strong>Microsoft Word (.docx)</strong> asli tanpa merusak layout</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E2E2DC] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenGenerator('perda')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] px-5 py-3 text-xs font-black text-[#1A1A5E] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                    >
                      <FileOutput className="w-4 h-4" />
                      <span>Buka Generator Surat Selesai PERDA</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>

                {/* CARD 2: SURAT SELESAI PERKADA */}
                <div className="flat-card p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-t-4 border-t-[#FFC800] flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
                          <ClipboardList className="w-6 h-6 text-amber-800" />
                        </div>

                        <div>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-950 text-[10px] font-black uppercase tracking-wider mb-1">
                            Ranperbup / Ranperwal / Pergub
                          </div>
                          <h4 className="text-base font-black text-[#1A1A5E]">
                            Surat Selesai PERKADA
                          </h4>
                          <p className="text-[11px] text-[#3D3D3A]/60 font-semibold">
                            Pasal 97D UU No. 13 Tahun 2022
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold shrink-0">
                        Template Word Asli
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E2E2DC] space-y-3">
                      <p className="text-xs text-[#3D3D3A]/80 leading-relaxed font-medium">
                        Surat penyampaian hasil harmonisasi untuk <strong>Peraturan Kepala Daerah (Perbup / Perwal / Pergub)</strong> berdasarkan ketentuan <strong>Pasal 97D UU No. 13 Tahun 2022</strong> (Perubahan Kedua UU 12/2011).
                      </p>

                      <div className="bg-[#F8F8F5] p-3 rounded-xl border border-[#E2E2DC] text-[11px] space-y-1.5 font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Rujukan: <strong>Pasal 97D UU 13/2022</strong> (Perubahan Kedua UU 12/2011)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Nomor Surat: <strong>W.4-PP.04.02-«NOMOR»</strong> & Penandatangan <strong>Rudy Hendra Pakpahan</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Ekspor langsung ke file <strong>Microsoft Word (.docx)</strong> asli tanpa merusak layout</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E2E2DC] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenGenerator('perkada')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] px-5 py-3 text-xs font-black text-[#1A1A5E] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                    >
                      <FileOutput className="w-4 h-4" />
                      <span>Buka Generator Surat Selesai PERKADA</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* RIWAYAT SURAT YANG TELAH DI-GENERATE */}
            <div className="flat-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h4 className="text-base font-black text-[#1A1A5E] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FFC800]" />
                    Riwayat Draf Surat Selesai Harmonisasi
                  </h4>
                  <p className="text-xs text-[#3D3D3A]/60 font-medium mt-0.5">
                    Daftar surat selesai harmonisasi yang pernah di-generate sebelumnya.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenGenerator('perda')}
                    className="flat-btn bg-[#1A1A5E] text-white px-3.5 py-2 text-xs rounded-xl font-bold hover:bg-[#2E3A87]"
                  >
                    <FileOutput className="w-3.5 h-3.5 text-[#FFC800]" />
                    <span>Buat Surat Baru</span>
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E2DC] bg-[#F8F8F5] text-[#1A1A5E]">
                      <th className="p-3.5 font-black">Nomor Surat Kanwil</th>
                      <th className="p-3.5 font-black">Jenis Surat</th>
                      <th className="p-3.5 font-black">Judul Regulasi</th>
                      <th className="p-3.5 font-black">Pemerintah Daerah</th>
                      <th className="p-3.5 font-black">Tanggal</th>
                      <th className="p-3.5 font-black text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E2DC]">
                    {historyList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#1A1A5E] whitespace-nowrap">
                          {item.nomorSurat}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            item.jenis.includes('PERDA')
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {item.jenis}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-[#3D3D3A] max-w-xs truncate" title={item.judul}>
                          {item.judul}
                        </td>
                        <td className="p-3.5 font-medium text-slate-700 whitespace-nowrap">
                          {item.kabupaten}
                        </td>
                        <td className="p-3.5 text-slate-500 whitespace-nowrap">
                          {item.tanggal}
                        </td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleQuickPrint(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 transition-all text-[11px] font-bold cursor-pointer"
                              title="Buka Generator & Unduh Word (.docx)"
                            >
                              <Download className="w-3.5 h-3.5 text-blue-700" />
                              <span>Word (.docx)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleQuickPrint(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100 transition-all text-[11px] font-bold cursor-pointer"
                              title="Buka Generator & Cetak / Simpan PDF"
                            >
                              <Printer className="w-3.5 h-3.5 text-amber-800" />
                              <span>PDF</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleQuickPrint(item)}
                              className="p-1.5 rounded-lg border border-[#E2E2DC] bg-white text-[#1A1A5E] hover:bg-slate-100 transition-all cursor-pointer"
                              title="Buka Generator Surat"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PANDUAN DASAR HUKUM */}
            <div className="flat-card p-6 bg-[#F8F8F5] border border-[#E2E2DC]">
              <h4 className="text-sm font-black text-[#1A1A5E] uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#FFC800]" />
                Landasan Hukum Template Surat Harmonisasi Kanwil Kemenkumham Riau
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#3D3D3A]/80 leading-relaxed font-medium">
                <div className="p-4 bg-white rounded-xl border border-[#E2E2DC]">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px] uppercase mb-2 inline-block">Format Perda</span>
                  <h5 className="font-black text-[#1A1A5E] mb-1">Pasal 58 UU No. 12 Tahun 2011</h5>
                  <p>Mengatur bahwa pengharmonisasian, pembulatan, dan pemantapan konsepsi Rancangan Peraturan Daerah dikoordinasikan oleh Kementerian Hukum.</p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E2E2DC]">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] uppercase mb-2 inline-block">Format Perkada</span>
                  <h5 className="font-black text-[#1A1A5E] mb-1">Pasal 97D UU No. 13 Tahun 2022</h5>
                  <p>Mengatur bahwa pengharmonisasian, pembulatan, dan pemantapan konsepsi Rancangan Peraturan Kepala Daerah (Perbup/Perwal/Pergub) dikoordinasikan oleh Kementerian Hukum.</p>
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
