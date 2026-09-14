import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../components/layout/AppLayout';
import { PasalComparisonResult } from '../components/common/PasalComparisonResult';
import {
  ArrowLeft,
  Layers,
  RefreshCw,
  AlertCircle,
  XCircle,
  Scale,
} from 'lucide-react';

export const PerbandinganDokumenPage = ({ permohonan, selected, comparison, comparisonError }) => {
  const dokumens = permohonan.dokumens || [];

  // Dari 7 jenis dokumen di sistem ini, hanya "Draft Rancangan" (jenis #1) dan
  // "Draft Hasil Harmonisasi" (jenis #4) berisi naskah regulasi utuh berstruktur
  // Pasal — dokumen lain (Analisis Konsepsi, Matriks, Surat) bersifat pendukung/
  // administratif, bukan naskah regulasi itu sendiri. Default perbandingan
  // diarahkan ke pasangan ini; pengguna tetap bebas memilih dokumen lain manual.
  const defaultA = useMemo(() => {
    const draftAwal = dokumens.find((d) => d.jenis_dokumen_id === 1);
    if (draftAwal) return String(draftAwal.dokumen_id);
    const fallback = [...dokumens].sort((a, b) => a.jenis_dokumen_id - b.jenis_dokumen_id)[0];
    return fallback ? String(fallback.dokumen_id) : '';
  }, [dokumens]);

  const defaultB = useMemo(() => {
    const draftHasil = dokumens.find((d) => d.jenis_dokumen_id === 4);
    if (draftHasil) return String(draftHasil.dokumen_id);
    const fallback = [...dokumens]
      .filter((d) => String(d.dokumen_id) !== defaultA)
      .sort((a, b) => b.jenis_dokumen_id - a.jenis_dokumen_id)[0];
    return fallback ? String(fallback.dokumen_id) : '';
  }, [dokumens, defaultA]);

  const [dokumenAId, setDokumenAId] = useState(
    selected?.dokumen_a_id ? String(selected.dokumen_a_id) : defaultA
  );
  const [dokumenBId, setDokumenBId] = useState(
    selected?.dokumen_b_id ? String(selected.dokumen_b_id) : defaultB
  );

  const canCompare = dokumenAId && dokumenBId && dokumenAId !== dokumenBId;

  const handleCompare = () => {
    if (!canCompare) return;
    router.get(
      `/peraturan/${permohonan.rancangan_id}/perbandingan`,
      { dokumen_a_id: dokumenAId, dokumen_b_id: dokumenBId },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  const docLabel = (doc) => {
    const nama = doc.jenis_dokumen?.nama_dokumen || `Dokumen #${doc.jenis_dokumen_id}`;
    return `${nama} — v${doc.versi} (${doc.nama_file})`;
  };

  return (
    <AppLayout hideHeader={true}>
      <Head title={`Perbandingan Dokumen ${permohonan.nomor_regulasi} - HARMONITAS`} />

      <div className="space-y-6">
        {/* TOP NAVIGATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <Link
            href={`/peraturan/${permohonan.rancangan_id}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#2B3056] hover:bg-slate-50 transition shadow-2xs w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFC800]" />
            <span>Kembali ke Detail Berkas</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Nomor Registrasi:</span>
            <span className="px-3 py-1 bg-[#2B3056] text-[#FFD82B] rounded-xl text-xs font-mono font-extrabold shadow-2xs">
              {permohonan.nomor_regulasi}
            </span>
          </div>
        </div>

        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2B3056] via-[#323963] to-[#2B3056] p-4 sm:p-7 text-white shadow-xl border border-[#3A4070]">
          <span className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-[#FFD82B] via-[#FFC800] to-[#FFD82B]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-[#FFD82B]" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-extrabold text-white leading-snug">
                Perbandingan Dokumen Per-Pasal
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-0.5">{permohonan.judul_rancangan}</p>
            </div>
          </div>
        </div>

        {/* PEMILIH DOKUMEN */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 space-y-4">
          <h2 className="text-sm font-extrabold text-[#2B3056] flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-[#FFC800]" />
            <span>Pilih Dua Dokumen untuk Dibandingkan</span>
          </h2>

          {dokumens.length < 2 ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
              <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
              <p>Minimal 2 dokumen harus diunggah pada berkas ini sebelum bisa dibandingkan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                  Dokumen A (Draft Rancangan Awal)
                </label>
                <select
                  value={dokumenAId}
                  onChange={(e) => setDokumenAId(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#2B3056] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD82B] transition-all"
                >
                  <option value="">— Pilih Dokumen —</option>
                  {dokumens.map((doc) => (
                    <option key={doc.dokumen_id} value={doc.dokumen_id}>
                      {docLabel(doc)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">
                  Dokumen B (Draft Hasil Harmonisasi)
                </label>
                <select
                  value={dokumenBId}
                  onChange={(e) => setDokumenBId(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#2B3056] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD82B] transition-all"
                >
                  <option value="">— Pilih Dokumen —</option>
                  {dokumens.map((doc) => (
                    <option key={doc.dokumen_id} value={doc.dokumen_id}>
                      {docLabel(doc)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={!canCompare}
            onClick={handleCompare}
            className="px-4 py-2.5 rounded-xl bg-[#2B3056] hover:bg-[#3A4070] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FFD82B]" />
            <span>Bandingkan Naskah</span>
          </button>

          {dokumenAId && dokumenBId && dokumenAId === dokumenBId && (
            <p className="text-[11px] font-semibold text-rose-600">Pilih dua dokumen yang berbeda.</p>
          )}
        </div>

        {/* ERROR */}
        {comparisonError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-bold shadow-xs">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-normal">{comparisonError}</p>
          </div>
        )}

        {/* HASIL PERBANDINGAN */}
        {comparison && <PasalComparisonResult comparison={comparison} />}
      </div>
    </AppLayout>
  );
};

export default PerbandinganDokumenPage;
