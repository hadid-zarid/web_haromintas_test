import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

/**
 * Badge status per-Pasal hasil perbandingan.
 */
export const PasalStatusBadge = ({ status }) => {
  const map = {
    sama: { label: 'Sama', className: 'bg-slate-100 text-slate-600 border-slate-200' },
    diubah: { label: 'Diubah', className: 'bg-amber-50 text-amber-800 border-amber-300' },
    ditambahkan: { label: 'Ditambahkan', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    dihapus: { label: 'Dihapus', className: 'bg-rose-50 text-rose-700 border-rose-200' },
  };
  const item = map[status] || map.sama;

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${item.className}`}>
      {item.label}
    </span>
  );
};

const DOC_TEXT_CLASS = 'text-[13px] font-serif leading-[1.8] text-slate-800';

/**
 * Render rincian kata (dipakai untuk baris ber-type "modified" & fallback
 * "replace"). `skipType` menyembunyikan sisi lawan (mis. kolom kiri
 * menyembunyikan kata yang "insert" karena kata itu belum ada di Dokumen A).
 */
const WordDiff = ({ ops, skipType }) => (
  <>
    {ops
      .filter((op) => op.type !== skipType)
      .map((op, idx) => {
        if (op.type === 'delete') {
          return (
            <span key={idx} className="bg-rose-100 text-rose-700 line-through decoration-rose-500 px-0.5 rounded">
              {op.text}{' '}
            </span>
          );
        }
        if (op.type === 'insert') {
          return (
            <span key={idx} className="bg-emerald-100 text-emerald-800 underline decoration-emerald-500 px-0.5 rounded">
              {op.text}{' '}
            </span>
          );
        }
        return <span key={idx}>{op.text} </span>;
      })}
  </>
);

/**
 * Render satu sisi (kiri = Dokumen A, kanan = Dokumen B) dari daftar baris
 * hasil diff. Tiap baris/butir asli naskah tetap jadi paragraf terpisah
 * (bukan dilebur jadi satu blok teks panjang) supaya terasa seperti membaca
 * dokumen aslinya, bukan output mentah alat bantu.
 */
const DiffSide = ({ lines, side }) => {
  if (!lines || lines.length === 0) {
    return <p className={`${DOC_TEXT_CLASS} italic text-slate-400`}>(Isi Pasal kosong)</p>;
  }

  const skipWholeLineType = side === 'left' ? 'insert' : 'delete';
  const skipWordType = side === 'left' ? 'insert' : 'delete';

  const visible = lines
    .map((line, idx) => ({ ...line, _key: idx }))
    .filter((line) => line.type !== skipWholeLineType);

  return (
    <div className="space-y-2.5">
      {visible.map((line) => {
        if (line.type === 'modified') {
          return (
            <p key={line._key} className={`${DOC_TEXT_CLASS} whitespace-pre-wrap`}>
              <WordDiff ops={line.ops} skipType={skipWordType} />
            </p>
          );
        }
        if (line.type === 'delete') {
          return (
            <p key={line._key} className={`${DOC_TEXT_CLASS} whitespace-pre-wrap bg-rose-50 text-rose-700 line-through decoration-rose-500 rounded px-1.5 py-0.5 -mx-1.5`}>
              {line.text}
            </p>
          );
        }
        if (line.type === 'insert') {
          return (
            <p key={line._key} className={`${DOC_TEXT_CLASS} whitespace-pre-wrap bg-emerald-50 text-emerald-800 underline decoration-emerald-500 rounded px-1.5 py-0.5 -mx-1.5`}>
              {line.text}
            </p>
          );
        }
        return (
          <p key={line._key} className={`${DOC_TEXT_CLASS} whitespace-pre-wrap`}>
            {line.text}
          </p>
        );
      })}
    </div>
  );
};

/** Pecah teks polos (status "sama"/"dihapus"/"ditambahkan") jadi paragraf per baris. */
const toLines = (text) =>
  (text || '')
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => t !== '');

const PlainText = ({ text, highlightClassName = '' }) => {
  const lines = toLines(text);
  if (lines.length === 0) {
    return <p className={`${DOC_TEXT_CLASS} italic text-slate-400`}>(Isi Pasal kosong)</p>;
  }

  return (
    <div className="space-y-2.5">
      {lines.map((line, idx) => (
        <p key={idx} className={`${DOC_TEXT_CLASS} whitespace-pre-wrap ${highlightClassName}`}>
          {line}
        </p>
      ))}
    </div>
  );
};

const PasalCard = ({ pasal }) => {
  const leftContent = () => {
    if (pasal.status === 'sama') {
      return <PlainText text={pasal.isi_a} />;
    }
    if (pasal.status === 'diubah') {
      return <DiffSide lines={pasal.diff} side="left" />;
    }
    if (pasal.status === 'dihapus') {
      return <PlainText text={pasal.isi_a} highlightClassName="bg-rose-50 text-rose-700 line-through decoration-rose-500 rounded px-1.5 py-0.5 -mx-1.5" />;
    }
    return <p className="text-[13px] font-serif italic text-slate-400">— (belum ada di Dokumen A)</p>;
  };

  const rightContent = () => {
    if (pasal.status === 'sama') {
      return <PlainText text={pasal.isi_b} />;
    }
    if (pasal.status === 'diubah') {
      return <DiffSide lines={pasal.diff} side="right" />;
    }
    if (pasal.status === 'ditambahkan') {
      return <PlainText text={pasal.isi_b} highlightClassName="bg-emerald-50 text-emerald-800 underline decoration-emerald-500 rounded px-1.5 py-0.5 -mx-1.5" />;
    }
    return <p className="text-[13px] font-serif italic text-slate-400">— (dihapus dari Dokumen B)</p>;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-3">
        <h3 className="text-sm font-extrabold text-[#2B3056] font-serif tracking-wide">Pasal {pasal.nomor}</h3>
        <PasalStatusBadge status={pasal.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs p-4 sm:p-6">{leftContent()}</div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs p-4 sm:p-6">{rightContent()}</div>
      </div>
    </div>
  );
};

const SummaryStat = ({ label, value, className }) => (
  <div className={`px-3 py-2 rounded-xl border text-center min-w-[84px] ${className}`}>
    <p className="text-base font-extrabold leading-none">{value}</p>
    <p className="text-[10px] font-bold mt-1 opacity-80">{label}</p>
  </div>
);

/**
 * Blok utuh: ringkasan statistik + header kolom + daftar kartu Pasal
 * (tampilan kiri-kanan Dokumen A vs Dokumen B, dengan tipografi ala naskah
 * resmi supaya terasa seperti membaca dokumen, bukan output alat bantu).
 * Dipakai bersama oleh halaman perbandingan resmi (PerbandinganDokumenPage)
 * maupun tester mandiri (TestPerbandinganPage).
 */
export const PasalComparisonResult = ({ comparison }) => {
  const namaA = comparison.dokumen_a.nama_dokumen || comparison.dokumen_a.nama_file || 'Dokumen A';
  const namaB = comparison.dokumen_b.nama_dokumen || comparison.dokumen_b.nama_file || 'Dokumen B';

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <FileText className="w-4 h-4 text-[#2B3056]" />
            <span className="text-[#2B3056]">{namaA}</span>
            <span className="text-slate-400">vs</span>
            <span className="text-[#2B3056]">{namaB}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-semibold text-slate-500">Dihitung otomatis via diff algoritmik (bukan AI)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <SummaryStat label="Total Pasal" value={comparison.summary.total_pasal} className="bg-slate-50 border-slate-200 text-slate-700" />
          <SummaryStat label="Sama" value={comparison.summary.sama} className="bg-slate-50 border-slate-200 text-slate-600" />
          <SummaryStat label="Diubah" value={comparison.summary.diubah} className="bg-amber-50 border-amber-200 text-amber-800" />
          <SummaryStat label="Ditambahkan" value={comparison.summary.ditambahkan} className="bg-blue-50 border-blue-200 text-blue-700" />
          <SummaryStat label="Dihapus" value={comparison.summary.dihapus} className="bg-rose-50 border-rose-200 text-rose-700" />
        </div>
      </div>

      {/* HEADER KOLOM KIRI-KANAN — dua card terpisah, bukan dibelah garis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 sticky top-0 z-10">
        <div className="rounded-2xl bg-[#2B3056] overflow-hidden shadow-sm px-4 sm:px-5 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
          <span className="text-xs font-extrabold text-white truncate">Dokumen A — {namaA}</span>
        </div>
        <div className="rounded-2xl bg-[#2B3056] overflow-hidden shadow-sm px-4 sm:px-5 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-xs font-extrabold text-white truncate">Dokumen B — {namaB}</span>
        </div>
      </div>

      <div className="space-y-3">
        {comparison.pasal.map((pasal) => (
          <PasalCard key={pasal.nomor} pasal={pasal} />
        ))}
      </div>
    </div>
  );
};

export default PasalComparisonResult;
