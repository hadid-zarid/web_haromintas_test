import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { usePeraturan } from '../../context/PeraturanContext';
import { KABUPATEN_LIST } from '../../mock/mockPeraturan';
import LogoPengayoman from '../common/LogoPengayoman';

import {
  FileText,
  FileOutput,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Eye,
  SlidersHorizontal,
  ShieldCheck,
  Scale,
  RefreshCw,
  Check
} from 'lucide-react';

/*
|--------------------------------------------------------------------------
| HELPER: FORMAT TANGGAL INDONESIA LENGKAP
|--------------------------------------------------------------------------
*/
const formatIndonesianDate = (dateInput) => {
  if (!dateInput) return '';

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ];

  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

/*
|--------------------------------------------------------------------------
| HELPER: GET YYYY-MM-DD FOR INPUT DATE
|--------------------------------------------------------------------------
*/
const getTodayFormatted = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/*
|--------------------------------------------------------------------------
| DATA IBUKOTA KABUPATEN / KOTA
|--------------------------------------------------------------------------
*/
const IBUKOTA_MAP = {
  'Kota Pekanbaru': 'Pekanbaru',
  'Kota Dumai': 'Dumai',
  'Kab. Kampar': 'Bangkinang',
  'Kab. Bengkalis': 'Bengkalis',
  'Kab. Siak': 'Siak Sri Indrapura',
  'Kab. Pelalawan': 'Pangkalan Kerinci',
  'Kab. Rokan Hilir': 'Bagansiapiapi',
  'Kab. Rokan Hulu': 'Pasir Pengaraian',
  'Kab. Indragiri Hilir': 'Tembilahan',
  'Kab. Indragiri Hulu': 'Rengat',
  'Kab. Kuantan Singingi': 'Teluk Kuantan',
  'Kab. Kepulauan Meranti': 'Selatpanjang',
  'Provinsi Riau': 'Pekanbaru'
};

export const DraftGenerateModal = ({
  isOpen,
  onClose,
  initialType = 'perda',
  onSaveHistory,
  isModal = true
}) => {
  const { showToast } = useToast();
  const { peraturanList } = usePeraturan();
  const printAreaRef = useRef(null);

  const [letterType, setLetterType] = useState(initialType);
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedRegId, setSelectedRegId] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // State nilai raw input date (YYYY-MM-DD)
  const [inputDateVal, setInputDateVal] = useState(getTodayFormatted());

  const [formData, setFormData] = useState({
    nomorSurat: '1489',
    tanggalSurat: formatIndonesianDate(getTodayFormatted()),

    hal: 'Penyampaian Hasil Pengharmonisasian, Pembulatan, dan Pemantapan Konsepsi Rancangan Peraturan Daerah Kota Pekanbaru tentang Pajak Daerah dan Retribusi Daerah',

    jabatanPemrakarsa: 'Wali Kota Pekanbaru',
    ibukota: 'Pekanbaru',

    nomorSuratP: '180/HK/2024/045',
    tanggalSuratP: '12 Juli 2024',

    jenisPeraturan: 'Peraturan Daerah',
    asalPemrakarsa: 'Kota Pekanbaru',
    judulPeraturan: 'Pajak Daerah dan Retribusi Daerah',

    namaKakanwil: 'Rudy Hendra Pakpahan',
    jabatanKakanwil: 'Kepala Kantor Wilayah',

    tembusan: [
      'Menteri Hukum;',
      'Direktur Jenderal Peraturan Perundang-Undangan Kementerian Hukum;'
    ]
  });

  useEffect(() => {
    if (isOpen) {
      setLetterType(initialType);
      setActiveTab('preview');

      const matched = peraturanList.find((p) => {
        if (initialType === 'perda') {
          return p.jenis?.toLowerCase() === 'raperda';
        }
        return (
          p.jenis?.toLowerCase() === 'raperbup' ||
          p.jenis?.toLowerCase() === 'raperwal'
        );
      });

      if (matched) {
        setSelectedRegId(matched.id);
        handleSelectRegulation(matched, initialType);
      } else {
        setSelectedRegId('');
        setDefaultByType(initialType);
      }
    }
  }, [isOpen, initialType]);

  const setDefaultByType = (type) => {
    const isPerda = type === 'perda';
    const jenis = isPerda ? 'Peraturan Daerah' : 'Peraturan Bupati';
    const asal = isPerda ? 'Kota Pekanbaru' : 'Kabupaten Kampar';
    const judul = isPerda
      ? 'Pajak Daerah dan Retribusi Daerah'
      : 'Rencana Detail Tata Ruang Kawasan Strategis';
    const jabatan = isPerda ? 'Wali Kota Pekanbaru' : 'Bupati Kampar';
    const ibukota = isPerda ? 'Pekanbaru' : 'Bangkinang';

    const randomNum = String(Math.floor(1000 + Math.random() * 9000));

    setFormData((prev) => ({
      ...prev,
      nomorSurat: randomNum,
      tanggalSurat: formatIndonesianDate(inputDateVal),
      hal: `Penyampaian Hasil Pengharmonisasian, Pembulatan, dan Pemantapan Konsepsi Rancangan ${jenis} ${asal} tentang ${judul}`,
      jabatanPemrakarsa: jabatan,
      ibukota: ibukota,
      nomorSuratP: '180/HK/2024/045',
      tanggalSuratP: '12 Juli 2024',
      jenisPeraturan: jenis,
      asalPemrakarsa: asal,
      judulPeraturan: judul
    }));
  };

  const handleSelectRegulation = (reg, typeOverride) => {
    if (!reg) return;

    const isPerda = (typeOverride || letterType) === 'perda';
    const kab = reg.kabupaten || 'Kota Pekanbaru';
    const isKota = kab.toLowerCase().includes('kota');
    const isProv = kab.toLowerCase().includes('provinsi');

    let jenis = 'Peraturan Daerah';
    if (!isPerda) {
      jenis = isProv
        ? 'Peraturan Gubernur'
        : isKota
          ? 'Peraturan Wali Kota'
          : 'Peraturan Bupati';
    }

    const jabatan = isProv
      ? 'Gubernur Riau'
      : isKota
        ? `Wali Kota ${kab.replace('Kota ', '')}`
        : `Bupati ${kab.replace('Kab. ', '')}`;

    const ibukota = IBUKOTA_MAP[kab] || 'Pekanbaru';

    let raw = reg.judul || '';
    let clean = raw
      .replace(/^Rancangan\s+Peraturan\s+[^\n]+?\s+tentang\s+/i, '')
      .replace(/^Peraturan\s+[^\n]+?\s+tentang\s+/i, '')
      .replace(/^tentang\s+/i, '')
      .trim();

    if (!clean) clean = raw;

    const halText = `Penyampaian Hasil Pengharmonisasian, Pembulatan, dan Pemantapan Konsepsi Rancangan ${jenis} ${kab} tentang ${clean}`;

    setFormData((prev) => ({
      ...prev,
      nomorSurat: String(Math.floor(1000 + Math.random() * 9000)),
      tanggalSurat: formatIndonesianDate(inputDateVal),
      hal: halText,
      jabatanPemrakarsa: jabatan,
      ibukota: ibukota,
      nomorSuratP: reg.nomor ? `180/HK/${reg.nomor}` : prev.nomorSuratP,
      tanggalSuratP: '12 Juli 2024',
      jenisPeraturan: jenis,
      asalPemrakarsa: kab,
      judulPeraturan: clean
    }));
  };

  const handleRegDropdownChange = (e) => {
    const id = e.target.value;
    setSelectedRegId(id);
    if (!id) return;
    const reg = peraturanList.find((p) => p.id === id);
    if (reg) handleSelectRegulation(reg);
  };

  const handleChangeType = (type) => {
    setLetterType(type);
    setDefaultByType(type);
  };

  const handleGenerateRandomNumber = () => {
    const randomNum = String(Math.floor(1000 + Math.random() * 9000));
    setFormData((prev) => ({ ...prev, nomorSurat: randomNum }));
  };

  // Simpan ke riwayat draft dengan aman — bug pada callback induk tidak boleh
  // menggagalkan proses unduh/cetak (dulu menyebabkan halaman jadi putih).
  const saveToHistory = (extra = {}) => {
    if (typeof onSaveHistory !== 'function') return;
    try {
      onSaveHistory({
        id: `DRAFT-${Date.now()}`,
        nomorSurat: formData.nomorSurat,
        jenis: letterType === 'perda' ? 'Surat Selesai PERDA' : 'Surat Selesai PERKADA',
        judul: `Rancangan ${formData.jenisPeraturan} ${formData.asalPemrakarsa} tentang ${formData.judulPeraturan}`,
        kabupaten: formData.asalPemrakarsa,
        tanggal: formData.tanggalSurat,
        createdAt: new Date().toISOString(),
        ...extra
      });
    } catch (e) {
      console.error('Gagal menyimpan riwayat draft (diabaikan):', e);
    }
  };

  const handlePrint = () => {
    saveToHistory({ nomorSurat: `W.4-PP.04.02-${formData.nomorSurat}` });

    const printContent = printAreaRef.current;
    if (!printContent) return;

    // Remove any previous hidden print iframe
    const oldIframe = document.getElementById('harmonitas-print-iframe');
    if (oldIframe) {
      oldIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'harmonitas-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Surat Selesai ${letterType.toUpperCase()} - W.4-PP.04.02-${formData.nomorSurat}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 20mm 15mm 25mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
              font-size: 11pt !important;
              color: #000000 !important;
              width: 100% !important;
            }
            .print-paper {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
            }
            table, td, th, p, div, span, ol, li {
              font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
            }
            td {
              vertical-align: top !important;
              padding: 0 !important;
            }
            img {
              width: 65px !important;
              max-width: 65px !important;
              height: 74px !important;
              object-fit: contain !important;
              display: block !important;
              margin: 0 auto !important;
            }
            p {
              margin: 0 0 12px 0 !important;
              text-align: justify !important;
              text-justify: inter-word !important;
              line-height: 1.35 !important;
            }
            ol {
              margin: 0 !important;
              padding-left: 20px !important;
              font-size: 10pt !important;
            }
            li {
              margin-bottom: 2px !important;
              font-size: 10pt !important;
            }
          </style>
        </head>
        <body>
          <div class="print-paper">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    showToast('Membuka dialog cetak PDF...', 'info');

    // Wait a brief moment for layout/images to finish parsing in the iframe
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 450);
  };

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    showToast('Mengunduh dokumen Word (.docx) sesuai template asli...', 'info');

    const csrfToken =
      document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const payload = {
      type: letterType,
      nomor_surat: formData.nomorSurat,
      tanggal_surat: formData.tanggalSurat,
      hal: formData.hal,
      jabatan_pemrakarsa: formData.jabatanPemrakarsa,
      ibukota: formData.ibukota,
      nomor_surat_p: formData.nomorSuratP,
      tanggal_surat_p: formData.tanggalSuratP,
      jenis_peraturan: formData.jenisPeraturan,
      asal_pemrakarsa: formData.asalPemrakarsa,
      judul_peraturan: formData.judulPeraturan,
      jabatan_kakanwil: formData.jabatanKakanwil,
      nama_kakanwil: formData.namaKakanwil
    };

    try {
      const response = await fetch('/api/generate-surat-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || `Gagal mengunduh (${response.status})`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Surat_Selesai_${letterType.toUpperCase()}_${formData.nomorSurat.replace(/[^a-zA-Z0-9_\-]/g, '_')}.docx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Beri jeda sebelum revoke agar unduhan tidak terputus di sebagian browser.
      setTimeout(() => window.URL.revokeObjectURL(url), 2000);

      saveToHistory();

      showToast('Dokumen Word resmi (.docx) berhasil diunduh!', 'success');
    } catch (err) {
      // Jangan pakai form.submit() sebagai fallback — itu menavigasi SPA & bikin halaman putih.
      console.error('Gagal mengunduh DOCX:', err);
      showToast(err.message || 'Gagal memproses file Word. Silakan coba lagi.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = () => {
    const perdaPasal =
      'Pasal 58 Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan';
    const perkadaPasal =
      'Pasal 97D Undang-Undang Nomor 13 Tahun 2022 tentang Perubahan Kedua Atas Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan';

    const dasarHukum = letterType === 'perda' ? perdaPasal : perkadaPasal;

    const fullText = `
KEMENTERIAN HUKUM REPUBLIK INDONESIA
KANTOR WILAYAH RIAU
Jl. Jend. Sudirman No.233, Kec. Pekanbaru Kota, Kota Pekanbaru
Telepon: (0761) 23846 - 0811-6904-422
Laman: https://riau.kemenkum.go.id/ Pos-el: subbidfpphdriaubedelau@gmail.com

Nomor : ${formData.nomorSurat.startsWith('W.4-PP.04.02-') ? formData.nomorSurat : `W.4-PP.04.02-${formData.nomorSurat}`}                                                                      ${formData.tanggalSurat}
Sifat : Penting
Hal   : ${formData.hal}

Yth ${formData.jabatanPemrakarsa}
di ${formData.ibukota}

Menindaklanjuti surat permohonan ${formData.jabatanPemrakarsa} Nomor ${formData.nomorSuratP} Tanggal ${formData.tanggalSuratP} perihal Mohon Harmonisasi Rancangan ${formData.jenisPeraturan} ${formData.asalPemrakarsa}, berikut ini kami sampaikan bahwa Rancangan ${formData.jenisPeraturan} ${formData.asalPemrakarsa} tentang ${formData.judulPeraturan} telah dilakukan pengharmonisasian, pembulatan, dan pemantapan konsepsi berdasarkan ketentuan sebagaimana dimaksud dalam ${dasarHukum}, dengan hasil Rancangan ${formData.jenisPeraturan} tersebut secara substansi tidak bertentangan dengan peraturan perundang-undangan yang lebih tinggi, sejajar, dan putusan pengadilan, serta dapat ditindaklanjuti ke tahapan selanjutnya

Demikian disampaikan, atas perhatian dan kerjasamanya diucapkan terima kasih.

  ${formData.jabatanKakanwil} 

  ${formData.namaKakanwil}

Tembusan:
1. Menteri Hukum;
2. Direktur Jenderal Peraturan Perundang-Undangan Kementerian Hukum;
    `.trim();

    navigator.clipboard.writeText(fullText);
    showToast('Teks naskah resmi berhasil disalin ke clipboard!', 'success');
  };

  const content = (
    <div className="space-y-5">
      {/* HEADER TOOLBAR DENGAN WARNA RESMI HARMONITAS (#2B3056) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        
        {/* Format Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
          <button
            type="button"
            onClick={() => handleChangeType('perda')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              letterType === 'perda'
                ? 'bg-[#2B3056] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#2B3056] hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Surat Selesai PERDA</span>
          </button>

          <button
            type="button"
            onClick={() => handleChangeType('perkada')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              letterType === 'perkada'
                ? 'bg-[#2B3056] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#2B3056] hover:bg-slate-50'
            }`}
          >
            <FileOutput className="w-3.5 h-3.5" />
            <span>Surat Selesai PERKADA</span>
          </button>
        </div>

        {/* View Tab & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'form'
                  ? 'bg-[#2B3056] text-white'
                  : 'text-slate-600 hover:text-[#2B3056]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sesuaikan Data</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'preview'
                  ? 'bg-[#2B3056] text-white'
                  : 'text-slate-600 hover:text-[#2B3056]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Naskah</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadDocx}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2B3056] hover:bg-[#3A4070] text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Unduh Surat dalam Format Microsoft Word (.docx)"
            >
              <Download className="w-3.5 h-3.5 text-[#FFD82B]" />
              <span className="hidden sm:inline">
                {isDownloading ? 'Memproses...' : 'Unduh Word (.docx)'}
              </span>
              <span className="sm:hidden">Word</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 text-[#2B3056] text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Cetak atau Simpan Dokumen sebagai File PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak / PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB FORM INPUT */}
      {activeTab === 'form' && (
        <div className="space-y-4">
          {/* Quick Auto-Fill Selector */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-[#2B3056]">
              <ShieldCheck className="w-4 h-4 text-[#B3912D]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Pilih dari Permohonan Aktif (Otomatis Mengisi Seluruh Kolom)
              </span>
            </div>

            <select
              value={selectedRegId}
              onChange={handleRegDropdownChange}
              className="w-full text-xs font-medium p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056] text-slate-800"
            >
              <option value="">
                -- Pilih berkas permohonan terdaftar untuk mengisi formulir secara otomatis --
              </option>
              {peraturanList.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.id}] - [{item.jenis}] {item.kabupaten} : {item.judul}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NOMOR SURAT KELUAR KANWIL */}
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1">
                Nomor Surat Keluar Kanwil <span className="text-rose-500">*</span>
              </label>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center flex-1 rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-[#2B3056] focus-within:ring-1 focus-within:ring-[#2B3056] transition-all">
                  <input
                    type="text"
                    value={formData.nomorSurat}
                    onChange={(e) =>
                      setFormData({ ...formData, nomorSurat: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-xs font-mono font-bold text-[#2B3056] bg-transparent focus:outline-none"
                    placeholder="Contoh: 1489"
                  />
                </div>

                {/* Tombol Acak Nomor */}
                <button
                  type="button"
                  onClick={handleGenerateRandomNumber}
                  className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-[#2B3056] transition-colors shrink-0 cursor-pointer"
                  title="Generate Nomor Acak"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="mt-1 text-[10px] text-slate-500 font-medium">
                Nomor surat akan dicetak lengkap dengan format tata naskah dinas.
              </p>
            </div>

            {/* TANGGAL SURAT */}
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1">
                Tanggal Surat Keluar <span className="text-rose-500">*</span>
              </label>

              <input
                type="date"
                value={inputDateVal}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputDateVal(val);
                  setFormData({
                    ...formData,
                    tanggalSurat: formatIndonesianDate(val)
                  });
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056]"
              />

              {formData.tanggalSurat && (
                <p className="mt-1 text-[10px] text-slate-500">
                  Tertulis pada naskah:{' '}
                  <span className="text-[#2B3056] font-bold">
                    {formData.tanggalSurat}
                  </span>
                </p>
              )}
            </div>

            {/* HAL / PERIHAL */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#2B3056] mb-1">
                Hal (Perihal Surat) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.hal}
                onChange={(e) =>
                  setFormData({ ...formData, hal: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056] resize-none"
              />
            </div>

            {/* JABATAN PEMRAKARSA */}
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1">
                Jabatan Pemrakarsa (Tujuan Surat) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.jabatanPemrakarsa}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jabatanPemrakarsa: e.target.value
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056]"
                placeholder="Wali Kota Pekanbaru / Bupati Kampar"
              />
            </div>

            {/* IBUKOTA */}
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1">
                Ibu Kota Tempat Tujuan (di ...) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ibukota}
                onChange={(e) =>
                  setFormData({ ...formData, ibukota: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056]"
                placeholder="Pekanbaru / Bangkinang"
              />
            </div>

            {/* NOMOR SURAT PEMDA */}
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1">
                Nomor Surat Permohonan Pemda
              </label>
              <input
                type="text"
                value={formData.nomorSuratP}
                onChange={(e) =>
                  setFormData({ ...formData, nomorSuratP: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056]"
                placeholder="180/HK/2024/045"
              />
            </div>

            {/* TANGGAL SURAT PEMDA */}
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1">
                Tanggal Surat Permohonan Pemda
              </label>
              <input
                type="date"
                value={inputDateVal}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputDateVal(val);
                  setFormData({
                    ...formData,
                    tanggalSuratP: formatIndonesianDate(val)
                  });
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056]"
              />
            </div>

            {/* JENIS PERATURAN */}
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1">
                Jenis Peraturan
              </label>
              <input
                type="text"
                value={formData.jenisPeraturan}
                onChange={(e) =>
                  setFormData({ ...formData, jenisPeraturan: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056]"
                placeholder="Peraturan Daerah / Peraturan Wali Kota"
              />
            </div>

            {/* ASAL PEMRAKARSA */}
            <div>
              <label className="block text-xs font-bold text-[#2B3056] mb-1">
                Asal Pemrakarsa (Daerah)
              </label>
              <input
                type="text"
                value={formData.asalPemrakarsa}
                onChange={(e) =>
                  setFormData({ ...formData, asalPemrakarsa: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056]"
                placeholder="Kota Pekanbaru / Kabupaten Kampar"
              />
            </div>

            {/* JUDUL PERATURAN */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#2B3056] mb-1">
                Judul Materi Peraturan (tentang ...) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.judulPeraturan}
                onChange={(e) => {
                  const newJudul = e.target.value;
                  const newHal = `Penyampaian Hasil Pengharmonisasian, Pembulatan, dan Pemantapan Konsepsi Rancangan ${formData.jenisPeraturan} ${formData.asalPemrakarsa} tentang ${newJudul}`;
                  setFormData({
                    ...formData,
                    judulPeraturan: newJudul,
                    hal: newHal
                  });
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2B3056] focus:ring-1 focus:ring-[#2B3056]"
                placeholder="Pajak Daerah dan Retribusi Daerah"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="inline-flex items-center gap-2 bg-[#2B3056] hover:bg-[#3A4070] text-white px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#FFD82B]" />
              <span>Lihat Pratinjau Lembar Surat</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div
            className={`bg-slate-700/80 p-4 sm:p-8 rounded-2xl overflow-x-auto shadow-inner flex justify-center ${
              isModal ? 'max-h-[62vh] overflow-y-auto' : 'min-h-[750px] py-8'
            }`}
          >
            <div
              ref={printAreaRef}
              className="bg-white text-black w-full max-w-[760px] p-8 sm:p-12 shadow-2xl rounded-xs min-h-[920px] select-text"
              style={{
                fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                fontSize: '11pt',
                lineHeight: '1.25',
                color: '#000000'
              }}
            >
              {/* KOP SURAT RESMI KANWIL KEMENKUM PROVINSI RIAU */}
              <div className="border-b-2 border-black pb-1 mb-4" style={{ borderBottom: '2.5px solid #000000', paddingBottom: '6px', marginBottom: '16px' }}>
                <table className="w-full border-collapse" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td className="align-middle text-center shrink-0" style={{ width: '75px', minWidth: '75px', maxWidth: '75px', verticalAlign: 'middle', textAlign: 'center', paddingRight: '12px', paddingLeft: '0' }}>
                        <img
                          src="/images/logo_kemenkum_surat.png"
                          alt="Logo Pengayoman"
                          width="65"
                          height="74"
                          style={{ width: '65px', height: '74px', objectFit: 'contain', margin: '0 auto', display: 'block' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </td>
                      <td className="align-middle text-center text-black" style={{ verticalAlign: 'middle', textAlign: 'center', padding: 0 }}>
                        <div style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif', fontSize: '11pt', fontWeight: 'normal', textTransform: 'uppercase', lineHeight: '1.2', margin: '0' }}>
                          KEMENTERIAN HUKUM REPUBLIK INDONESIA
                        </div>
                        <div style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif', fontSize: '11.5pt', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: '1.2', margin: '2px 0 0 0' }}>
                          KANTOR WILAYAH RIAU
                        </div>
                        <div style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif', fontSize: '9pt', fontWeight: 'normal', lineHeight: '1.2', margin: '3px 0 0 0' }}>
                          Jl. Jend. Sudirman No.233, Kec. Pekanbaru Kota, Kota Pekanbaru
                        </div>
                        <div style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif', fontSize: '9pt', fontWeight: 'normal', lineHeight: '1.2', margin: '1px 0 0 0' }}>
                          Telepon: (0761) 23846 - 0811-6904-422
                        </div>
                        <div style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif', fontSize: '9pt', fontWeight: 'normal', lineHeight: '1.2', margin: '1px 0 0 0' }}>
                          Laman: <span style={{ textDecoration: 'underline', color: '#1d4ed8' }}>https://riau.kemenkum.go.id/</span> &nbsp;Pos-el: subbidfpphdriaubedelau@gmail.com
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* INFORMASI NOMOR, TANGGAL, SIFAT, HAL */}
              <table
                className="w-full mb-4 border-collapse"
                style={{
                  width: '100%',
                  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                  fontSize: '11pt',
                  marginBottom: '16px',
                  tableLayout: 'fixed',
                  borderCollapse: 'collapse'
                }}
              >
                <colgroup>
                  <col style={{ width: '60px' }} />
                  <col style={{ width: '15px' }} />
                  <col style={{ width: '58%' }} />
                  <col style={{ width: 'auto' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: 'top', padding: '1px 0', whiteSpace: 'nowrap' }}>Nomor</td>
                    <td style={{ verticalAlign: 'top', padding: '1px 0' }}>:</td>
                    <td style={{ verticalAlign: 'top', padding: '1px 0', whiteSpace: 'nowrap' }}>
                      {formData.nomorSurat.startsWith('W.4-PP.04.02-')
                        ? formData.nomorSurat
                        : `W.4-PP.04.02-${formData.nomorSurat}`}
                    </td>
                    <td style={{ verticalAlign: 'top', padding: '1px 0', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {formData.tanggalSurat}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top', padding: '1px 0', whiteSpace: 'nowrap' }}>Sifat</td>
                    <td style={{ verticalAlign: 'top', padding: '1px 0' }}>:</td>
                    <td style={{ verticalAlign: 'top', padding: '1px 0' }}>Penting</td>
                    <td style={{ verticalAlign: 'top', padding: '1px 0' }}></td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top', padding: '1px 0', whiteSpace: 'nowrap' }}>Hal</td>
                    <td style={{ verticalAlign: 'top', padding: '1px 0' }}>:</td>
                    <td
                      style={{
                        verticalAlign: 'top',
                        padding: '1px 0',
                        textAlign: 'justify',
                        textJustify: 'inter-word'
                      }}
                    >
                      {formData.hal}
                    </td>
                    <td style={{ verticalAlign: 'top', padding: '1px 0' }}></td>
                  </tr>
                </tbody>
              </table>

              {/* TUJUAN SURAT (YTH & DI) */}
              <table className="w-full mb-4 border-collapse" style={{ width: '100%', fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif', fontSize: '11pt', marginBottom: '16px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '45px', verticalAlign: 'top', padding: '1px 0' }}>Yth</td>
                    <td style={{ verticalAlign: 'top', padding: '1px 0' }}>
                      <div>{formData.jabatanPemrakarsa}</div>
                      <div>di {formData.ibukota}</div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ISI SURAT */}
              <div style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif', fontSize: '11pt', lineHeight: '1.35', textAlign: 'justify' }}>
                <p style={{ textIndent: '38px', margin: '0 0 12px 0', textAlign: 'justify', textJustify: 'inter-word', lineHeight: '1.35' }}>
                  Menindaklanjuti surat permohonan {formData.jabatanPemrakarsa} Nomor{' '}
                  {formData.nomorSuratP} Tanggal {formData.tanggalSuratP} perihal Mohon
                  Harmonisasi Rancangan {formData.jenisPeraturan}{' '}
                  {formData.asalPemrakarsa}, berikut ini kami sampaikan bahwa Rancangan{' '}
                  {formData.jenisPeraturan} {formData.asalPemrakarsa} tentang{' '}
                  {formData.judulPeraturan} telah dilakukan pengharmonisasian,
                  pembulatan, dan pemantapan konsepsi berdasarkan ketentuan sebagaimana
                  dimaksud dalam{' '}
                  {letterType === 'perda'
                    ? 'Pasal 58 Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan'
                    : 'Pasal 97D Undang-Undang Nomor 13 Tahun 2022 tentang Perubahan Kedua Atas Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan'}
                  , dengan hasil Rancangan {formData.jenisPeraturan} tersebut secara
                  substansi tidak bertentangan dengan peraturan perundang-undangan
                  yang lebih tinggi, sejajar, dan putusan pengadilan, serta dapat
                  ditindaklanjuti ke tahapan selanjutnya
                </p>

                <p style={{ textIndent: '38px', margin: '0 0 12px 0', textAlign: 'justify', textJustify: 'inter-word', lineHeight: '1.35' }}>
                  Demikian disampaikan, atas perhatian dan kerjasamanya diucapkan
                  terima kasih.
                </p>
              </div>

              {/* TANDA TANGAN KAKANWIL */}
              <div
                style={{
                  marginTop: '28px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '100%',
                  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                  fontSize: '11pt'
                }}
              >
                <div
                  style={{
                    width: '250px',
                    marginLeft: 'auto',
                    textAlign: 'left'
                  }}
                >
                  <div
                    style={{ marginBottom: '56px' }}
                  >
                    {formData.jabatanKakanwil}
                  </div>
                  <div>
                    {formData.namaKakanwil}
                  </div>
                </div>
              </div>

              {/* TEMBUSAN */}
              <div style={{ marginTop: '20px', fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif', fontSize: '10pt' }}>
                <div style={{ marginBottom: '4px' }}>Tembusan:</div>
                <ol style={{ margin: 0, paddingLeft: '20px' }}>
                  {formData.tembusan.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '2px' }}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Tata naskah dinas resmi Kanwil Kemenkum Provinsi Riau siap diunduh.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-[#2B3056] px-3.5 py-2 text-xs rounded-xl hover:bg-slate-100 font-bold transition-all shadow-xs cursor-pointer"
                title="Salin teks naskah ke clipboard"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Salin Teks</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadDocx}
                disabled={isDownloading}
                className="inline-flex items-center gap-1.5 bg-[#2B3056] hover:bg-[#3A4070] text-white px-4 py-2 text-xs rounded-xl font-bold shadow-xs disabled:opacity-50 cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[#FFD82B]" />
                <span>
                  {isDownloading
                    ? 'Memproses...'
                    : 'Download Word (.docx)'}
                </span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 text-[#2B3056] px-4 py-2 text-xs rounded-xl hover:shadow-md font-bold cursor-pointer transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!isModal) {
    if (!isOpen) return null;
    return content;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Generator ${
        letterType === 'perda'
          ? 'Surat Selesai PERDA'
          : 'Surat Selesai PERKADA'
      }`}
      size="5xl"
    >
      {content}
    </Modal>
  );
};

export default DraftGenerateModal;