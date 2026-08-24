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
  Scale
} from 'lucide-react';

const formatIndonesianDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

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
  initialType = 'perda', // 'perda' or 'perkada'
  onSaveHistory
}) => {
  const { showToast } = useToast();
  const { peraturanList } = usePeraturan();
  const printAreaRef = useRef(null);

  const [letterType, setLetterType] = useState(initialType);
  const [activeTab, setActiveTab] = useState('preview'); // 'form' or 'preview'
  const [selectedRegId, setSelectedRegId] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const todayStr = formatIndonesianDate(new Date());

  const [formData, setFormData] = useState({
    nomorSurat: '1489',
    tanggalSurat: todayStr,
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
      
      const matched = peraturanList.find(p => {
        if (initialType === 'perda') return p.jenis?.toLowerCase() === 'raperda';
        return p.jenis?.toLowerCase() === 'raperbup' || p.jenis?.toLowerCase() === 'raperwal';
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
    const judul = isPerda ? 'Pajak Daerah dan Retribusi Daerah' : 'Rencana Detail Tata Ruang Kawasan Strategis';
    const jabatan = isPerda ? 'Wali Kota Pekanbaru' : 'Bupati Kampar';
    const ibukota = isPerda ? 'Pekanbaru' : 'Bangkinang';

    setFormData(prev => ({
      ...prev,
      nomorSurat: String(Math.floor(1000 + Math.random() * 9000)),
      tanggalSurat: todayStr,
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
      jenis = isProv ? 'Peraturan Gubernur' : (isKota ? 'Peraturan Wali Kota' : 'Peraturan Bupati');
    }

    const jabatan = isProv ? 'Gubernur Riau' : (isKota ? `Wali Kota ${kab.replace('Kota ', '')}` : `Bupati ${kab.replace('Kab. ', '')}`);
    const ibukota = IBUKOTA_MAP[kab] || 'Pekanbaru';

    // Clean title carefully without repetitions
    let raw = reg.judul || '';
    let clean = raw
      .replace(/^Rancangan\s+Peraturan\s+[^\n]+?\s+tentang\s+/i, '')
      .replace(/^Peraturan\s+[^\n]+?\s+tentang\s+/i, '')
      .replace(/^tentang\s+/i, '')
      .trim();

    if (!clean) clean = raw;

    const halText = `Penyampaian Hasil Pengharmonisasian, Pembulatan, dan Pemantapan Konsepsi Rancangan ${jenis} ${kab} tentang ${clean}`;

    setFormData(prev => ({
      ...prev,
      nomorSurat: String(Math.floor(1000 + Math.random() * 9000)),
      tanggalSurat: todayStr,
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
    const reg = peraturanList.find(p => p.id === id);
    if (reg) {
      handleSelectRegulation(reg);
    }
  };

  const handleChangeType = (type) => {
    setLetterType(type);
    setDefaultByType(type);
  };

  // Action: Print / Save PDF
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
          <title>Cetak - Surat Selesai ${letterType.toUpperCase()} - W.4-PP.04.02-${formData.nomorSurat}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 20mm 20mm 20mm 20mm;
            }
            body {
              font-family: Arial, Helvetica, "Bookman Old Style", sans-serif;
              font-size: 11pt;
              line-height: 1.35;
              color: #000000;
              margin: 0;
              padding: 0;
              background: #ffffff;
            }
            .kop-border {
              border-bottom: 2px solid #000000;
              padding-bottom: 6px;
              margin-bottom: 16px;
            }
            .meta-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 16px;
              font-size: 11pt;
            }
            .meta-table td {
              vertical-align: top;
              padding: 1px 0;
            }
            p {
              margin: 0 0 12px 0;
              text-align: justify;
              text-justify: inter-word;
              line-height: 1.4;
            }
            .text-indent {
              text-indent: 38px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 600);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    showToast('Membuka dialog cetak PDF...', 'success');
  };

  // Action: Download official .docx generated directly from actual user template file
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

  const handleFallbackDoc = () => {
    const printContent = printAreaRef.current;
    if (!printContent) return;

    const headerHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Surat Selesai Harmonisasi</title>
        <style>
          @page Section1 { size: 595.3pt 841.9pt; margin: 70.85pt; }
          div.Section1 { page: Section1; }
          body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.35; }
          p { margin-bottom: 8pt; text-align: justify; }
        </style>
      </head>
      <body><div class="Section1">${printContent.innerHTML}</div></body></html>
    `;

    const blob = new Blob(['\ufeff', headerHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Surat_Selesai_${letterType.toUpperCase()}_W.4-PP.04.02-${formData.nomorSurat}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    const perdaPasal = 'Pasal 58 Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan';
    const perkadaPasal = 'Pasal 97D Undang-Undang Nomor 13 Tahun 2022 tentang Perubahan Kedua Atas Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan';
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

Yth «JABATAN_PEMRAKARSA»
di «IBUKOTA»

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Generator ${letterType === 'perda' ? 'Surat Selesai PERDA' : 'Surat Selesai PERKADA'}`}
      size="5xl"
    >
      <div className="space-y-5">

        {/* =========================================
            HEADER TOOLBAR: TYPE SWITCH & TAB
        ========================================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-[#F5F5F0] border border-[#E2E2DC] rounded-xl">
          <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E2DC] rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => handleChangeType('perda')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                letterType === 'perda'
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                letterType === 'perkada'
                  ? 'bg-[#1A1A5E] text-white shadow-xs'
                  : 'text-[#3D3D3A]/70 hover:text-[#1A1A5E] hover:bg-slate-50'
              }`}
            >
              <FileOutput className="w-3.5 h-3.5" />
              <span>Surat Selesai PERKADA</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 p-1 bg-white border border-[#E2E2DC] rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'form'
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-[#1A1A5E] text-white font-black'
                    : 'text-[#3D3D3A]/70 hover:text-[#1A1A5E]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau Template Asli</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================
            TAB 1: FORM INPUT (10 VARIABLES MATCHING TEMPLATE)
        ========================================= */}
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
                <option value="">-- Pilih permohonan terdaftar atau edit variabel di bawah --</option>
                {peraturanList.map(item => (
                  <option key={item.id} value={item.id}>
                    [{item.id}] - [{item.jenis}] {item.kabupaten} : {item.judul}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                  Nomor Surat Keluar Kanwil (setelah W.4-PP.04.02-) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-2 rounded-l-lg border border-r-0 border-[#D5D5CE] bg-[#F5F5F0] text-xs font-mono font-bold text-[#1A1A5E]">
                    W.4-PP.04.02-
                  </span>
                  <input
                    type="text"
                    value={formData.nomorSurat}
                    onChange={e => setFormData({ ...formData, nomorSurat: e.target.value })}
                    className="flat-input w-full p-2 text-xs font-mono font-bold rounded-l-none"
                    placeholder="1489"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                  Tanggal Surat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tanggalSurat}
                  onChange={e => setFormData({ ...formData, tanggalSurat: e.target.value })}
                  className="flat-input w-full p-2 text-xs font-medium"
                  placeholder="24 Agustus 2026"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                  Hal (Perihal Surat) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.hal}
                  onChange={e => setFormData({ ...formData, hal: e.target.value })}
                  className="flat-input w-full p-2 text-xs font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                  Jabatan Pemrakarsa (Tujuan Surat) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.jabatanPemrakarsa}
                  onChange={e => setFormData({ ...formData, jabatanPemrakarsa: e.target.value })}
                  className="flat-input w-full p-2 text-xs font-medium"
                  placeholder="Wali Kota Pekanbaru / Bupati Kampar"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                  Ibu Kota / Tempat Tujuan (di ...) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ibukota}
                  onChange={e => setFormData({ ...formData, ibukota: e.target.value })}
                  className="flat-input w-full p-2 text-xs font-medium"
                  placeholder="Pekanbaru / Bangkinang"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                  Nomor Surat Permohonan Pemda
                </label>
                <input
                  type="text"
                  value={formData.nomorSuratP}
                  onChange={e => setFormData({ ...formData, nomorSuratP: e.target.value })}
                  className="flat-input w-full p-2 text-xs font-medium"
                  placeholder="180/HK/2024/045"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                  Tanggal Surat Permohonan Pemda
                </label>
                <input
                  type="text"
                  value={formData.tanggalSuratP}
                  onChange={e => setFormData({ ...formData, tanggalSuratP: e.target.value })}
                  className="flat-input w-full p-2 text-xs font-medium"
                  placeholder="12 Juli 2024"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                  Jenis Peraturan
                </label>
                <input
                  type="text"
                  value={formData.jenisPeraturan}
                  onChange={e => setFormData({ ...formData, jenisPeraturan: e.target.value })}
                  className="flat-input w-full p-2 text-xs font-medium"
                  placeholder="Peraturan Daerah / Peraturan Wali Kota"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                  Asal Pemrakarsa (Daerah)
                </label>
                <input
                  type="text"
                  value={formData.asalPemrakarsa}
                  onChange={e => setFormData({ ...formData, asalPemrakarsa: e.target.value })}
                  className="flat-input w-full p-2 text-xs font-medium"
                  placeholder="Kota Pekanbaru / Kabupaten Kampar"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-[#1A1A5E] mb-1">
                  Judul Materi Peraturan (tentang ...) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.judulPeraturan}
                  onChange={e => setFormData({ ...formData, judulPeraturan: e.target.value })}
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

        {/* =========================================
            TAB 2: EXACT AUTHENTIC TEMPLATE PREVIEW (MATCHING IMAGE 2)
        ========================================= */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            
            {/* Document Sheet Viewer */}
            <div className="bg-[#525659] p-4 sm:p-8 rounded-2xl overflow-x-auto shadow-inner flex justify-center max-h-[62vh] overflow-y-auto">
              
              {/* Paper Sheet Matching Exact Template Layout */}
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
                {/* =========================================
                    KOP SURAT (EXACT AS IMAGE 2 TEMPLATE)
                ========================================== */}
                <div className="border-b-2 border-black pb-2 mb-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        {/* Logo Pengayoman with Navy Background Box */}
                        <td className="w-24 align-middle pr-4 py-0">
                          <LogoPengayoman className="w-20 h-24 rounded-none shadow-none" bgColor="#0B1A38" symbolColor="#FFDE00" />
                        </td>

                        {/* Kop Text Centered */}
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
                            Laman: <span className="text-blue-700 underline">https://riau.kemenkum.go.id/</span> Pos-el: subbidfpphdriaubedelau@gmail.com
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* =========================================
                    NOMOR, TANGGAL, SIFAT, HAL (NO LAMPIRAN ROW)
                ========================================== */}
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
                      <td className="align-top py-0.5" colSpan={2}>Penting</td>
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

                {/* =========================================
                    TUJUAN SURAT (Yth ...)
                ========================================== */}
                <div className="my-5 text-[11pt] leading-snug">
                  <div>Yth {formData.jabatanPemrakarsa}</div>
                  <div>di {formData.ibukota}</div>
                </div>

                {/* =========================================
                    ISI SURAT (EXACT WORDING FROM DOCX)
                ========================================== */}
                <div className="space-y-4 text-justify text-[11pt] leading-relaxed">
                  <p className="indent-9">
                    Menindaklanjuti surat permohonan {formData.jabatanPemrakarsa} Nomor {formData.nomorSuratP} Tanggal {formData.tanggalSuratP} perihal Mohon Harmonisasi Rancangan {formData.jenisPeraturan} {formData.asalPemrakarsa}, berikut ini kami sampaikan bahwa Rancangan {formData.jenisPeraturan} {formData.asalPemrakarsa} tentang {formData.judulPeraturan} telah dilakukan pengharmonisasian, pembulatan, dan pemantapan konsepsi berdasarkan ketentuan sebagaimana dimaksud dalam{' '}
                    {letterType === 'perda'
                      ? 'Pasal 58 Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan'
                      : 'Pasal 97D Undang-Undang Nomor 13 Tahun 2022 tentang Perubahan Kedua Atas Undang-Undang Nomor 12 Tahun 2011 tentang Pembentukan Peraturan Perundang-undangan'}
                    , dengan hasil Rancangan {formData.jenisPeraturan} tersebut secara substansi tidak bertentangan dengan peraturan perundang-undangan yang lebih tinggi, sejajar, dan putusan pengadilan, serta dapat ditindaklanjuti ke tahapan selanjutnya
                  </p>

                  <p className="indent-9">
                    Demikian disampaikan, atas perhatian dan kerjasamanya diucapkan terima kasih.
                  </p>
                </div>

                {/* =========================================
                    TANDA TANGAN RESMI
                ========================================== */}
                <div className="mt-10 flex justify-end">
                  <div className="w-64 text-left text-[11pt]">
                    <p className="mb-14">{formData.jabatanKakanwil}</p>
                    <p className="font-normal">
                      {formData.namaKakanwil}
                    </p>
                  </div>
                </div>

                {/* =========================================
                    TEMBUSAN
                ========================================== */}
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

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#F5F5F0] border border-[#E2E2DC] rounded-xl">
              <div className="flex items-center gap-2 text-xs text-[#3D3D3A]/80 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kop surat, logo pengayoman biru-kuning, dan tata letak 100% persis gambar template Anda</span>
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
                  <span>{isDownloading ? 'Memproses Word...' : 'Download Word Asli (.docx)'}</span>
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
    </Modal>
  );
};

export default DraftGenerateModal;
