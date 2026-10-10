import React from 'react';
import { FileCheck2, Quote, ShieldCheck, SpellCheck } from 'lucide-react';
import { gradeBadgeClass } from '../../lib/aiReport';

const SubPill = ({ icon: Icon, label, value }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-500">
    <Icon className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
    {label}: <strong className="font-bold text-slate-800">{value}%</strong>
  </span>
);

// Banner skor kepatuhan (setara banner AI Document Checker): lingkaran skor + grade di kiri, judul dan
// sub-skor di tengah, tombol aksi di kanan. Grade "-" berarti belum dapat dinilai (sebagian/seluruh
// blok gagal diperiksa); keterangannya dibuat server sehingga tidak diberi awalan "Grade".
const ScoreBanner = ({ summary, actions }) => (
  <div className="rounded-2xl border-2 border-[#D5D9EC] bg-gradient-to-br from-white to-slate-50 px-4 sm:px-7 py-5 shadow-md shadow-[#2B3056]/5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0">
      <div className="relative shrink-0 mx-auto sm:mx-0">
        <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#2B3056] to-[#3F4780] flex items-center justify-center text-white text-[1.6rem] font-extrabold shadow-lg shadow-[#2B3056]/30">
          {summary.score ?? '--'}
        </div>
        <div
          className={`absolute -bottom-1 -right-1 w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] font-extrabold text-white border-2 border-white ${gradeBadgeClass(summary.grade)}`}
          aria-label={`Grade ${summary.grade}`}
        >
          {summary.grade}
        </div>
      </div>

      <div className="min-w-0 text-center sm:text-left">
        <p className="text-[12.8px] font-bold uppercase tracking-wider text-slate-500">Skor Kepatuhan &amp; Kualitas Naskah</p>
        <p className="text-lg sm:text-xl font-extrabold text-[#2B3056] mb-1.5 break-words">
          {summary.grade === '-' ? summary.predicate : `Grade ${summary.grade} - ${summary.predicate}`}
        </p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
          <SubPill icon={ShieldCheck} label="Pedoman" value={summary.subScores.pedoman} />
          <SubPill icon={SpellCheck} label="Ejaan" value={summary.subScores.ejaan} />
          <SubPill icon={Quote} label="Tanda Baca & Kosa Kata" value={summary.subScores.punct} />
          <SubPill icon={FileCheck2} label="Struktur UU" value={summary.subScores.struct} />
        </div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">{actions}</div>
  </div>
);

export default ScoreBanner;
