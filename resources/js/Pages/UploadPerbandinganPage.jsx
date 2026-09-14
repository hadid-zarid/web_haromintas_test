import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../components/layout/AppLayout';
import { PasalComparisonResult } from '../components/common/PasalComparisonResult';
import { Upload, RefreshCw, XCircle, Layers } from 'lucide-react';

/**
 * Perbandingan Pasal-per-Pasal dengan mengunggah 2 berkas langsung, tanpa
 * perlu memilih dari dokumen yang sudah ada di suatu berkas permohonan.
 * Cocok untuk membandingkan naskah dari luar sistem, atau saat berkas
 * permohonan yang dituju belum punya dokumen resmi ter-unggah.
 */
export const UploadPerbandinganPage = () => {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);

  const canSubmit = fileA && fileB && !isLoading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);
    setComparison(null);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      const formData = new FormData();
      formData.append('file_a', fileA);
      formData.append('file_b', fileB);

      const res = await fetch('/bandingkan-dokumen/compare', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken || '',
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Gagal memproses berkas.');
        return;
      }

      setComparison(data);
    } catch (e) {
      setError('Gagal menghubungi server. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout hideHeader={true}>
      <Head title="Bandingkan Dokumen Per-Pasal - HARMONITAS" />

      <div className="space-y-6">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2B3056] via-[#323963] to-[#2B3056] p-4 sm:p-7 text-white shadow-xl border border-[#3A4070]">
          <span className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-[#FFD82B] via-[#FFC800] to-[#FFD82B]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-[#FFD82B]" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-extrabold text-white leading-snug">
                Bandingkan Dokumen Per-Pasal
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Unggah 2 berkas (PDF/DOCX) untuk dibandingkan langsung, tanpa perlu berkas permohonan.
              </p>
            </div>
          </div>
        </div>

        {/* PEMILIH DOKUMEN */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Dokumen A</label>
              <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer transition text-center">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600 break-all">
                  {fileA ? fileA.name : 'Pilih berkas PDF/DOCX'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => setFileA(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Dokumen B</label>
              <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer transition text-center">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600 break-all">
                  {fileB ? fileB.name : 'Pilih berkas PDF/DOCX'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => setFileB(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="px-4 py-2.5 rounded-xl bg-[#2B3056] hover:bg-[#3A4070] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FFD82B] ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Memproses...' : 'Bandingkan Naskah'}</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-bold shadow-xs">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-normal">{error}</p>
          </div>
        )}

        {comparison && <PasalComparisonResult comparison={comparison} />}
      </div>
    </AppLayout>
  );
};

export default UploadPerbandinganPage;
