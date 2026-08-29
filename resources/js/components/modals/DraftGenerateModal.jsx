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
  Sparkles,
  ShieldCheck,
  Scale,
  RefreshCw
} from 'lucide-react';

/*
|--------------------------------------------------------------------------
| HELPER: FORMAT TANGGAL INDONESIA LENGKAP
|--------------------------------------------------------------------------
| Mengubah string date (YYYY-MM-DD) atau Date object menjadi format 
| tanggal Indonesia lengkap.
| Contoh: 2026-08-29 -> 29 Agustus 2026
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

  const handlePrint = () => {
    if (onSaveHistory) {
      onSaveHistory({
        id: `DRAFT-${Date.now()}`,
        nomorSurat: `W.4-PP.04.02-${formData.nomorSurat}`,
        jenis: letterType === 'perda' ? 'Surat Selesai PERDA' : 'Surat Selesai PERKADA',
        judul: `Rancangan ${formData.jenisPeraturan} ${formData.asalPemrakarsa} tentang ${formData.judulPeraturan}`,
        kabupaten: formData.asalPemrakarsa,
        tanggal: formData.tanggalSurat,
        createdAt: new Date().toISOString()
      });
    }

    const printContent = printAreaRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Cetak - Surat Selesai ${letterType.toUpperCase()} - W.4-PP.04.02-${formData.nomorSurat}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm 20mm 20mm 20mm; }
            * { box-sizing: border-box; }
            body {
              font-family: Arial, Helvetica, "Bookman Old Style", sans-serif;
              font-size: 11pt;
              line-height: 1.4;
              color: #000000;
              margin: 0; padding: 0; background: #ffffff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body > div, .print-paper {
              width: 100% !important; max-width: 100% !important;
              padding: 0 !important; margin: 0 !important;
              box-shadow: none !important; border: none !important;
              background: #ffffff !important; min-height: auto !important;
            }
            .flex { display: flex !important; }
            .flex-col { flex-direction: column !important; }
            .items-center { align-items: center !important; }
            .justify-between { justify-content: space-between !important; }
            .justify-end { justify-content: flex-end !important; }
            .shrink-0 { flex-shrink: 0 !important; }
            .flex-1 { flex: 1 1 0% !important; }
            table { width: 100% !important; border-collapse: collapse !important; }
            td { vertical-align: top; }
            .align-middle { vertical-align: middle !important; }
            .align-top { vertical-align: top !important; }
            .text-center { text-align: center !important; }
            .text-right { text-align: right !important; }
            .text-left { text-align: left !important; }
            .text-justify { text-align: justify !important; text-justify: inter-word !important; }
            .whitespace-nowrap { white-space: nowrap !important; }
            .indent-9 { text-indent: 38px !important; }
            .signature-container {
              margin-top: 40px !important; width: 100% !important;
              display: flex !important; justify-content: flex-end !important;
            }
            .signature-box {
              width: 260px !important; margin-left: auto !important;
              float: right !important; text-align: left !important; font-size: 11pt !important;
            }
            p { margin: 0 0 12px 0; text-align: justify; line-height: 1.4; }
            ol { margin: 0; padding-left: 20px; }
            li { margin-bottom: 2px; }
            .w-24 { width: 90px !important; min-width: 90px !important; }
            .w-20 { width: 75px !important; }
            .h-24 { height: 90px !important; }
            .w-16 { width: 70px !important; }
            .w-4 { width: 15px !important; }
            .w-64 { width: 260px !important; }
            .w-full { width: 100% !important; }
            .m-0 { margin: 0 !important; }
            .mb-1 { margin-bottom: 4px !important; }
            .mb-4 { margin-bottom: 16px !important; }
            .mb-5 { margin-bottom: 20px !important; }
            .mb-14 { margin-bottom: 56px !important; }
            .mt-0\.5 { margin-top: 2px !important; }
            .mt-1 { margin-top: 4px !important; }
            .mt-8 { margin-top: 30px !important; }
            .mt-10 { margin-top: 40px !important; }
            .my-5 { margin-top: 20px !important; margin-bottom: 20px !important; }
            .pb-2 { padding-bottom: 8px !important; }
            .pr-4 { padding-right: 16px !important; }
            .py-0 { padding-top: 0 !important; padding-bottom: 0 !important; }
            .py-0\.5 { padding-top: 2px !important; padding-bottom: 2px !important; }
            .pl-5 { padding-left: 20px !important; }
            .border-b-2 { border-bottom: 2.5px solid #000000 !important; }
            .border-black { border-color: #000000 !important; }
            .text-\[12pt\] { font-size: 12pt !important; }
            .text-\[13pt\] { font-size: 13pt !important; }
            .text-\[9pt\] { font-size: 9pt !important; }
            .text-\[10pt\] { font-size: 10pt !important; }
            .text-\[11pt\] { font-size: 11pt !important; }
            .font-normal { font-weight: normal !important; }
            .font-bold { font-weight: bold !important; }
            .tracking-wide { letter-spacing: 0.5px !important; }
            .uppercase { text-transform: uppercase !important; }
            .leading-tight { line-height: 1.25 !important; }
            .leading-snug { line-height: 1.4 !important; }
            .leading-relaxed { line-height: 1.5 !important; }
            .underline { text-decoration: underline !important; }
            .text-blue-700 { color: #1d4ed8 !important; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }, 350);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    showToast('Membuka dialog cetak PDF...', 'success');
  };

  const handleDownloadDocx = () => {
    setIsDownloading(true);
    showToast('Mengunduh dokumen Word (.docx) sesuai template asli...', 'info');

    try {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/generate-surat-docx';

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
        judul_peraturan: formData.judulPeraturan
      };

      for (const [key, value] of Object.entries(payload)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      if (onSaveHistory) {
        onSaveHistory({
          id: `DRAFT-${Date.now()}`,
          nomorSurat: `W.4-PP.04.02-${formData.nomorSurat}`,
          jenis: letterType === 'perda' ? 'Surat Selesai PERDA' : 'Surat Selesai PERKADA',
          judul: `Rancangan ${formData.jenisPeraturan} ${formData.asalPemrakarsa} tentang ${formData.judulPeraturan}`,
          kabupaten: formData.asalPemrakarsa,
          tanggal: formData.tanggalSurat,
          createdAt: new Date().toISOString()
        });
      }

      setTimeout(() => {
        setIsDownloading(false);
        showToast('Dokumen Word resmi (.docx) berhasil diunduh!', 'success');
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsDownloading(false);
      showToast('Gagal memproses file Word. Silakan coba lagi.', 'error');
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

Nomor : W.4-PP.04.02-${formData.nomorSurat}                                                                      ${formData.tanggalSurat}
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
    showToast('Teks resmi sesuai template berhasil disalin ke clipboard!', 'success');
  };

  const content = (
    <div className="space-y-5">
      {/* HEADER TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-[#F5F5F0] border border-[#E2E2DC] rounded-xl">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E2DC] rounded-xl shadow-xs">
          <button
            type="button"
            onClick={() => handleChangeType('perda')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${letterType === 'perda'
              ? 'bg-[#1A1A5E] text-white shadow-xs'
              : 'text-[#3D3D3A]/70 hover:text-[#1A1A5E] hover:bg-slate-50'
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Surat Selesai PERDA</span>
          </button>

          <button
            type="button"
            onClick={() => handleChangeType('perkada')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${letterType === 'perkada'
              ? 'bg-[#1A1A5E] text-white shadow-xs'
              : 'text-[#3D3D3A]/70 hover:text-[#1A1A5E] hover:bg-slate-50'
              }`}
          >
            <FileOutput className="w-3.5 h-3.5" />
            <span>Surat Selesai PERKADA</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1 p-1 bg-white border border-[#E2E2DC] rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'form'
                ? 'bg-[#FFC800] text-[#1A1A5E] font-black'
                : 'text-[#3D3D3A]/70 hover:text-[#1A1A5E]'
                }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sesuaikan Variabel</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview'
                ? 'bg-[#1A1A5E] text-white font-black'
                : 'text-[#3D3D3A]/70 hover:text-[#1A1A5E]'
                }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Template Asli</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadDocx}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2B579A] hover:bg-[#1E3E6D] text-white text-xs font-black shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Unduh Surat dalam Format Microsoft Word (.docx)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isDownloading ? 'Proses...' : 'Download Word (.docx)'}
              </span>
              <span className="sm:hidden">Word</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFE082] hover:to-[#FFC107] text-[#1A1A5E] text-xs font-black shadow-xs transition-all cursor-pointer"
              title="Cetak atau Simpan Dokumen sebagai File PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak / Simpan PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB FORM INPUT */}
      {activeTab === 'form' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5 text-[#1A1A5E]">
              <Sparkles className="w-4 h-4 text-[#FFC800]" />
              <span className="text-xs font-black uppercase tracking-wider">
                Pilih dari Permohonan Aktif (Otomatis Mengisi Variabel)
              </span>
            </div>

            <select
              value={selectedRegId}
              onChange={handleRegDropdownChange}
              className="w-full text-xs font-semibold p-2.5 bg-white border border-blue-200 rounded-lg focus:outline-none focus:border-[#1A1A5E]"
            >
              <option value="">
                -- Pilih permohonan terdaftar atau edit variabel di bawah --
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
              <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                Nomor Surat Keluar Kanwil (setelah W.4-PP.04.02-)
                <span className="text-red-500"> *</span>
              </label>

              <div className="flex items-center gap-1.5">
                {/* Input Group Menyatukan Prefix & Input */}
                <div className="flex items-center flex-1 rounded-xl border border-[#D5D5CE] bg-white overflow-hidden focus-within:border-[#1A1A5E] focus-within:ring-1 focus-within:ring-[#1A1A5E] transition-all">
                  <span className="inline-flex items-center px-3 py-2 bg-[#F5F5F0] border-r border-[#D5D5CE] text-xs font-mono font-bold text-[#1A1A5E] whitespace-nowrap select-none">
                    W.4-PP.04.02-
                  </span>
                  <input
                    type="text"
                    value={formData.nomorSurat}
                    onChange={(e) =>
                      setFormData({ ...formData, nomorSurat: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-[#1A1A5E] bg-transparent focus:outline-none"
                    placeholder="1489"
                  />
                </div>

                {/* Tombol Acak Nomor */}
                <button
                  type="button"
                  onClick={handleGenerateRandomNumber}
                  className="p-2.5 rounded-xl bg-[#F5F5F0] border border-[#D5D5CE] hover:bg-[#EAEAE0] text-[#1A1A5E] transition-colors shrink-0"
                  title="Acak Nomor Surat"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="mt-1 text-[10px] text-[#3D3D3A]/60 font-medium">
                Sistem akan memformat nomor surat keluar secara otomatis.
              </p>
            </div>

            {/* TANGGAL SURAT - TANGGAL, BULAN & TAHUN LENGKAP */}
            <div>
              <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                Tanggal Surat
                <span className="text-xs font-semibold text-[#3D3D3A]/60 ml-1">
                  (Tanggal, Bulan &amp; Tahun)
                </span>
                <span className="text-red-500"> *</span>
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
                className="flat-input w-full p-2 text-xs font-medium"
              />

              {formData.tanggalSurat && (
                <p className="mt-1 text-[10px] text-[#3D3D3A]/70 font-semibold">
                  Akan tertulis:{' '}
                  <span className="text-[#1A1A5E] font-black">
                    {formData.tanggalSurat}
                  </span>
                </p>
              )}
            </div>

            {/* HAL / PERIHAL */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                Hal (Perihal Surat)
                <span className="text-red-500"> *</span>
              </label>
              <textarea
                rows={2}
                value={formData.hal}
                onChange={(e) =>
                  setFormData({ ...formData, hal: e.target.value })
                }
                className="flat-input w-full p-2 text-xs font-medium resize-none"
              />
            </div>

            {/* JABATAN PEMRAKARSA */}
            <div>
              <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                Jabatan Pemrakarsa (Tujuan Surat)
                <span className="text-red-500"> *</span>
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
                className="flat-input w-full p-2 text-xs font-medium"
                placeholder="Wali Kota Pekanbaru / Bupati Kampar"
              />
            </div>

            {/* IBUKOTA */}
            <div>
              <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                Ibu Kota / Tempat Tujuan (di ...)
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                value={formData.ibukota}
                onChange={(e) =>
                  setFormData({ ...formData, ibukota: e.target.value })
                }
                className="flat-input w-full p-2 text-xs font-medium"
                placeholder="Pekanbaru / Bangkinang"
              />
            </div>

            {/* NOMOR SURAT PEMDA */}
            <div>
              <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                Nomor Surat Permohonan Pemda
              </label>
              <input
                type="text"
                value={formData.nomorSuratP}
                onChange={(e) =>
                  setFormData({ ...formData, nomorSuratP: e.target.value })
                }
                className="flat-input w-full p-2 text-xs font-medium"
                placeholder="180/HK/2024/045"
              />
            </div>

            {/* TANGGAL SURAT PEMDA */}
            <div>
              <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                Tanggal Surat Permohonan Pemda
              </label>
              <input
                type="text"
                value={formData.tanggalSuratP}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalSuratP: e.target.value })
                }
                className="flat-input w-full p-2 text-xs font-medium"
                placeholder="12 Juli 2024"
              />
            </div>

            {/* JENIS PERATURAN */}
            <div>
              <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                Jenis Peraturan
              </label>
              <input
                type="text"
                value={formData.jenisPeraturan}
                onChange={(e) =>
                  setFormData({ ...formData, jenisPeraturan: e.target.value })
                }
                className="flat-input w-full p-2 text-xs font-medium"
                placeholder="Peraturan Daerah / Peraturan Wali Kota"
              />
            </div>

            {/* ASAL PEMRAKARSA */}
            <div>
              <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                Asal Pemrakarsa (Daerah)
              </label>
              <input
                type="text"
                value={formData.asalPemrakarsa}
                onChange={(e) =>
                  setFormData({ ...formData, asalPemrakarsa: e.target.value })
                }
                className="flat-input w-full p-2 text-xs font-medium"
                placeholder="Kota Pekanbaru / Kabupaten Kampar"
              />
            </div>

            {/* JUDUL PERATURAN */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                Judul Materi Peraturan (tentang ...)
                <span className="text-red-500"> *</span>
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
                className="flat-input w-full p-2 text-xs font-medium"
                placeholder="Pajak Daerah dan Retribusi Daerah"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="flat-btn bg-[#1A1A5E] text-white px-5 py-2.5 text-xs font-black rounded-xl hover:bg-[#2E3A87]"
            >
              <Eye className="w-4 h-4 text-[#FFC800]" />
              Lihat Pratinjau Lembar Surat
            </button>
          </div>
        </div>
      )}

      {/* TAB PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div
            className={`bg-[#525659] p-4 sm:p-8 rounded-2xl overflow-x-auto shadow-inner flex justify-center ${isModal ? 'max-h-[62vh] overflow-y-auto' : 'min-h-[750px] py-8'
              }`}
          >
            <div
              ref={printAreaRef}
              className="bg-white text-black w-full max-w-[760px] p-8 sm:p-12 shadow-2xl rounded-xs min-h-[920px] select-text"
              style={{
                fontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif',
                fontSize: '11pt',
                lineHeight: '1.38',
                color: '#000000'
              }}
            >
              {/* KOP SURAT */}
              <div className="border-b-2 border-black pb-2 mb-4">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-24 align-middle pr-4 py-0">
                        <LogoPengayoman
                          className="w-20 h-24 rounded-none shadow-none"
                          bgColor="#0B1A38"
                          symbolColor="#FFDE00"
                        />
                      </td>
                      <td className="align-middle text-center text-black py-0">
                        <p className="text-[12pt] font-normal tracking-wide uppercase m-0 leading-tight">
                          KEMENTERIAN HUKUM REPUBLIK INDONESIA
                        </p>
                        <p className="text-[13pt] font-bold tracking-wide uppercase m-0 mt-0.5 leading-tight">
                          KANTOR WILAYAH RIAU
                        </p>
                        <p className="text-[9pt] font-normal text-black m-0 mt-1 leading-tight">
                          Jl. Jend. Sudirman No.233, Kec. Pekanbaru Kota, Kota Pekanbaru
                        </p>
                        <p className="text-[9pt] font-normal text-black m-0 leading-tight">
                          Telepon: (0761) 23846 - 0811-6904-422
                        </p>
                        <p className="text-[9pt] font-normal text-black m-0 leading-tight">
                          Laman:{' '}
                          <span className="text-blue-700 underline">
                            https://riau.kemenkum.go.id/
                          </span>{' '}
                          Pos-el: subbidfpphdriaubedelau@gmail.com
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* INFORMASI NOMOR, TANGGAL, SIFAT, HAL */}
              <table className="w-full text-[11pt] mb-5 border-collapse">
                <tbody>
                  <tr>
                    <td className="w-16 align-top py-0.5">Nomor</td>
                    <td className="w-4 align-top py-0.5">:</td>
                    <td className="align-top py-0.5">
                      W.4-PP.04.02-{formData.nomorSurat}
                    </td>
                    <td className="text-right align-top py-0.5 whitespace-nowrap">
                      {formData.tanggalSurat}
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">Sifat</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="align-top py-0.5" colSpan={2}>
                      Penting
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top py-0.5">Hal</td>
                    <td className="align-top py-0.5">:</td>
                    <td className="align-top py-0.5 text-justify" colSpan={2}>
                      {formData.hal}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* TUJUAN SURAT */}
              <div className="my-5 text-[11pt] leading-snug">
                <div>Yth {formData.jabatanPemrakarsa}</div>
                <div>di {formData.ibukota}</div>
              </div>

              {/* ISI SURAT */}
              <div className="space-y-4 text-justify text-[11pt] leading-relaxed">
                <p className="indent-9">
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

                <p className="indent-9">
                  Demikian disampaikan, atas perhatian dan kerjasamanya diucapkan
                  terima kasih.
                </p>
              </div>

              {/* TANDA TANGAN */}
              <div
                className="mt-10 flex justify-end signature-container"
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '100%'
                }}
              >
                <div
                  className="w-64 text-left text-[11pt] signature-box"
                  style={{
                    width: '260px',
                    marginLeft: 'auto',
                    textAlign: 'left'
                  }}
                >
                  <p
                    className="mb-14"
                    style={{ marginBottom: '56px', margin: '0 0 56px 0' }}
                  >
                    {formData.jabatanKakanwil}
                  </p>
                  <p className="font-normal" style={{ margin: 0 }}>
                    {formData.namaKakanwil}
                  </p>
                </div>
              </div>

              {/* TEMBUSAN */}
              <div className="mt-8 pt-4 text-[10pt]">
                <p className="font-normal mb-1">Tembusan:</p>
                <ol className="list-decimal pl-5 space-y-0.5 text-neutral-900">
                  {formData.tembusan.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#F5F5F0] border border-[#E2E2DC] rounded-xl">
            <div className="flex items-center gap-2 text-xs text-[#3D3D3A]/80 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Kop surat, logo pengayoman biru-kuning, dan tata letak 100% persis
                gambar template Anda
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="flat-btn bg-white border border-[#E2E2DC] text-[#1A1A5E] px-3.5 py-2 text-xs rounded-xl hover:bg-slate-50 font-bold"
                title="Salin teks naskah ke clipboard"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Salin Teks</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadDocx}
                disabled={isDownloading}
                className="flat-btn bg-blue-900 text-white px-4 py-2 text-xs rounded-xl hover:bg-blue-950 font-black shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FFC800]" />
                <span>
                  {isDownloading
                    ? 'Memproses Word...'
                    : 'Download Word Asli (.docx)'}
                </span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flat-btn bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-[#1A1A5E] px-4 py-2 text-xs rounded-xl hover:shadow-md font-black cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#1A1A5E]" />
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
      title={`Generator ${letterType === 'perda'
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