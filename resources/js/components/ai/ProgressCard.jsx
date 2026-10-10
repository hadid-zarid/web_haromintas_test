import React from 'react';
import { Loader2 } from 'lucide-react';
import { formatEta } from '../../lib/aiReport';

// Kartu progres di tengah halaman (setara AI Document Checker): spinner, judul, bilah kemajuan,
// jumlah blok, perkiraan sisa waktu, dan galat per blok.
const ProgressCard = ({ fileName, completed, total, eta, errors }) => {
  const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <section
      className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 sm:px-8 py-8 text-center"
      aria-live="polite"
      aria-label="Progres pemeriksaan"
    >
      <Loader2 className="w-10 h-10 mx-auto text-[#2B3056] animate-spin" aria-hidden="true" />
      <h4 className="mt-3 text-base font-bold text-slate-800">Sedang Memproses Pemeriksaan Dokumen...</h4>
      <p className="mt-1.5 text-sm text-slate-500">
        Mengekstrak teks, analisis kepatuhan pedoman, validasi struktur UU, serta ejaan &amp; tanda baca...
      </p>
      {fileName && <p className="mt-1 text-xs text-slate-400 truncate" title={fileName}>{fileName}</p>}

      <div
        className="mt-5 mx-auto max-w-xl h-2.5 rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full rounded-full bg-gradient-to-r from-[#FFD82B] to-[#FFB943] transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-2 mx-auto max-w-xl flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-slate-500">
        <span>{total > 0 ? `${completed} / ${total} blok` : '0 / 0 blok'}</span>
        <span>{completed > 0 || eta ? formatEta(eta) : 'Menghitung estimasi waktu...'}</span>
      </div>

      {errors.length > 0 && (
        <ul className="mt-4 mx-auto max-w-xl space-y-1 max-h-32 overflow-y-auto rounded-lg bg-red-50 border border-red-100 p-2.5 text-left">
          {errors.map((e, i) => (
            <li key={i} className="text-[11px] text-red-800 break-words">
              Blok {e.block_id}: {e.message}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ProgressCard;
