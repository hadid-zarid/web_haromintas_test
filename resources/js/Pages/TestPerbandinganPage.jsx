import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { PasalComparisonResult } from '../components/common/PasalComparisonResult';
import { Upload, RefreshCw, XCircle, FlaskConical } from 'lucide-react';

/**
 * Halaman tester mandiri (tanpa login) untuk mencoba cepat fitur perbandingan
 * Pasal-per-Pasal: upload 2 berkas (PDF/DOCX) langsung, tanpa perlu ada data
 * Rancangan Regulasi di database. Hanya aktif di environment local — lihat
 * PasalDiffTesterController.
 */
export const TestPerbandinganPage = () => {
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

      const res = await fetch('/test-perbandingan/compare', {
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
      setError('Gagal menghubungi server. Pastikan server Laravel sedang berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8">
      <Head title="Tester Perbandingan Pasal (Dev Only)" />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
          <FlaskConical className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Halaman tester (dev only, tanpa login).</strong> Upload 2 berkas PDF/DOCX yang memakai
            struktur &quot;Pasal 1&quot;, &quot;Pasal 2&quot;, dst. untuk melihat hasil perbandingan per-Pasal secara
            langsung, terpisah dari alur permohonan yang sesungguhnya.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 space-y-4">
          <h1 className="text-base font-extrabold text-[#2B3056]">Tester Perbandingan Dokumen Per-Pasal</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Dokumen A</label>
              <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer transition text-center">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600">
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
                <span className="text-xs font-semibold text-slate-600">
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
    </div>
  );
};

export default TestPerbandinganPage;
