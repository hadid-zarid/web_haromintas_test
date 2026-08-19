import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle, 
  Layers,
  FileText,
  FileSpreadsheet
} from 'lucide-react';

const AccordionItem = ({ title, icon: Icon, isOpen, onToggle, children }) => {
  return (
    <div className="flat-card overflow-hidden transition-all duration-150">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-lg font-bold">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-slate-900">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-amber-600 shrink-0 font-bold" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 font-bold" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 border-t border-slate-200 text-xs text-slate-700 leading-relaxed space-y-3 font-semibold bg-slate-50/50">
          {children}
        </div>
      )}
    </div>
  );
};

export const PanduanPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleSection = (index) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Page Header Flat Card */}
        <div className="flat-card-dark text-white p-7 flex items-center gap-5">
          <div className="p-3.5 bg-amber-500 text-slate-950 rounded-xl font-black shrink-0">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">Buku Panduan Sistem HARMONITAS</h2>
            <p className="text-xs text-slate-300 mt-1 font-semibold leading-relaxed">
              Petunjuk operasional HARMONITAS (Harmonisasi Ranperda dan Ranperkada Tuntas) sebagai upaya menyederhanakan proses harmonisasi rancangan peraturan daerah (Ranperda) dan rancangan peraturan kepala daerah (Ranperkada) untuk Kanwil Kemenkum Riau dan Biro Hukum Setda Provinsi Riau.
            </p>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          <AccordionItem
            title="1. Tata Cara Pengarsipan & Alur Kerja (PASIH & E-Harmonisasi)"
            icon={Layers}
            isOpen={openIndex === 0}
            onToggle={() => toggleSection(0)}
          >
            <p className="text-slate-800 font-bold mb-2">
              Proses pengarsipan dan pemeriksaaan peraturan daerah dilaksanakan secara berjenjang melalui 4 tahap utama:
            </p>
            <ol className="list-decimal pl-5 space-y-2 font-semibold text-slate-700">
              <li>
                <strong className="text-slate-900 font-black">Input & Pemeriksaan Awal (Tim Proja Kanwil):</strong> Petugas Tim Proja menginput identitas rancangan peraturan daerah/bupati serta melampirkan Draft Rancangan (Dokumen 1) dan Analisa Konsepsi (Dokumen 2).
              </li>
              <li>
                <strong className="text-slate-900 font-black">Penyusunan Sandingan & Harmonisasi:</strong> Tim Proja mengunggah Matrix Perubahan (Dokumen 3) dan Draft Hasil (Dokumen 4) setelah pelaksanaan rapat pleno harmonisasi.
              </li>
              <li>
                <strong className="text-slate-900 font-black">Penerbitan Surat Hasil Harmonisasi:</strong> Surat Hasil Harmonisasi (Dokumen 5) diterbitkan dan disahkan oleh Kadiv Pelayanan Hukum & Kakanwil. Status otomatis berubah menjadi <span className="flat-badge-purple">Fasilitasi</span>.
              </li>
              <li>
                <strong className="text-slate-900 font-black">Fasilitasi & Penyelesaian (Biro Hukum):</strong> Tim Biro Hukum Provinsi memeriksa berkas dan mengunggah Surat Hasil Fasilitasi (Dokumen 6). Status peraturan otomatis berubah menjadi <span className="flat-badge-emerald">Selesai</span>.
              </li>
            </ol>
          </AccordionItem>

          <AccordionItem
            title="2. Kelengkapan 6 Berkas Dokumen Syarat Utama"
            icon={FileSpreadsheet}
            isOpen={openIndex === 1}
            onToggle={() => toggleSection(1)}
          >
            <p className="mb-3 font-bold text-slate-900">Sistem mewajibkan kelengkapan 6 jenis dokumen standar berikut untuk setiap peraturan:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 flat-card">
                <span className="font-black text-amber-700 block">Dokumen 1: Draft Rancangan</span>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">Naskah awal peraturan daerah/bupati dari pemohon.</p>
              </div>
              <div className="p-4 flat-card">
                <span className="font-black text-amber-700 block">Dokumen 2: Analisa Konsepsi</span>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">Dokumen kualitatif naskah akademik & kesesuaian hirarki.</p>
              </div>
              <div className="p-4 flat-card">
                <span className="font-black text-amber-700 block">Dokumen 3: Matrix Perubahan</span>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">Tabel sandingan pasal perbandingan sebelum vs sesudah.</p>
              </div>
              <div className="p-4 flat-card">
                <span className="font-black text-amber-700 block">Dokumen 4: Draft Hasil</span>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">Naskah peraturan hasil penyempurnaan harmonisasi.</p>
              </div>
              <div className="p-4 flat-card">
                <span className="font-black text-amber-700 block">Dokumen 5: Surat Hasil Harmonisasi</span>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">Surat penyelesaian resmi yang diterbitkan Kanwil.</p>
              </div>
              <div className="p-4 flat-card-emerald">
                <span className="font-black text-emerald-900 block">Dokumen 6: Surat Hasil Fasilitasi</span>
                <p className="text-[11px] text-emerald-800 mt-1 font-semibold">Surat persetujuan akhir dari Biro Hukum Provinsi.</p>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            title="3. Matriks Pembagian Wewenang Hak Akses Role"
            icon={ShieldCheck}
            isOpen={openIndex === 2}
            onToggle={() => toggleSection(2)}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 font-black text-slate-900 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Role Pengguna</th>
                    <th className="p-3">Cakupan Data</th>
                    <th className="p-3">Unggah Dok 1 - 5</th>
                    <th className="p-3">Unggah Dok 6</th>
                    <th className="p-3">Tambah Peraturan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  <tr>
                    <td className="p-3 font-black text-blue-800">Proja 1 / 2 / 3</td>
                    <td className="p-3">Terbatas Kabupaten Scope Tim</td>
                    <td className="p-3 text-emerald-700 font-black">Ya (Aktif)</td>
                    <td className="p-3 text-slate-400">Tidak (Read-only)</td>
                    <td className="p-3 text-emerald-700 font-black">Ya</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-amber-800">Kakanwil</td>
                    <td className="p-3">Seluruh Kabupaten / Kota</td>
                    <td className="p-3 text-slate-400">Pengawasan (Read-only)</td>
                    <td className="p-3 text-slate-400">Pengawasan (Read-only)</td>
                    <td className="p-3 text-slate-400">Tidak</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-purple-800">Kadiv</td>
                    <td className="p-3">Seluruh Kabupaten / Kota</td>
                    <td className="p-3 text-slate-400">Pengawasan (Read-only)</td>
                    <td className="p-3 text-slate-400">Pengawasan (Read-only)</td>
                    <td className="p-3 text-slate-400">Tidak</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-emerald-800">Biro Hukum</td>
                    <td className="p-3">Seluruh Kabupaten / Kota</td>
                    <td className="p-3 text-slate-400">Pemeriksaan (Read-only)</td>
                    <td className="p-3 text-emerald-700 font-black">Ya (Dokumen 6)</td>
                    <td className="p-3 text-slate-400">Tidak</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AccordionItem>

          <AccordionItem
            title="4. Format File & Ketentuan Batas Ukuran Dokumen"
            icon={FileText}
            isOpen={openIndex === 3}
            onToggle={() => toggleSection(3)}
          >
            <ul className="list-disc pl-5 space-y-2 font-semibold text-slate-700">
              <li>Format file yang didukung: <span className="font-black text-amber-700">.pdf, .doc, .docx</span></li>
              <li>Ukuran maksimal tiap file: <span className="font-black text-amber-700">10 Megabytes (MB)</span></li>
              <li>Pastikan dokumen PDF telah dilengkapi stempel digital atau tanda tangan basah yang dipindai dengan jelas.</li>
            </ul>
          </AccordionItem>

          <AccordionItem
            title="5. Pertanyaan yang Sering Diajukan (FAQ)"
            icon={HelpCircle}
            isOpen={openIndex === 4}
            onToggle={() => toggleSection(4)}
          >
            <div className="space-y-4">
              <div>
                <p className="font-black text-slate-900">Q: Bagaimana jika dokumen yang diunggah salah atau perlu direvisi?</p>
                <p className="text-slate-600 mt-1 font-semibold">
                  Petugas penanggung jawab (Tim Proja atau Biro Hukum) dapat mengeklik tombol <span className="font-black text-amber-700">"Ganti"</span> pada kartu dokumen terkait di halaman detail peraturan untuk mengunggah revisi terbaru.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <p className="font-black text-slate-900">Q: Kapan status peraturan berubah otomatis menjadi "Fasilitasi"?</p>
                <p className="text-slate-600 mt-1 font-semibold">
                  Status otomatis maju menjadi <span className="flat-badge-purple">Fasilitasi</span> begitu Dokumen 5 (Surat Hasil Harmonisasi) diunggah oleh Tim Proja.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <p className="font-black text-slate-900">Q: Bagaimana cara mengganti simulasi role pengguna saat ini?</p>
                <p className="text-slate-600 mt-1 font-semibold">
                  Anda dapat keluar lewat tombol <span className="font-black text-red-600">"Keluar / Logout"</span> di sidebar kiri, kemudian memilih role lain pada dropdown simulasi role di halaman login.
                </p>
              </div>
            </div>
          </AccordionItem>
        </div>
      </div>
    </AppLayout>
  );
};

export default PanduanPage;
