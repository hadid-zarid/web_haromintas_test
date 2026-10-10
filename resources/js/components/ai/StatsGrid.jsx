import React from 'react';
import {
  AlertTriangle,
  AlignLeft,
  BookOpenText,
  Bug,
  CheckCircle2,
  Layers,
  Quote,
  ShieldAlert,
  SpellCheck,
} from 'lucide-react';

const ICON_BOX = {
  blue: 'bg-[#E4E7F4] text-[#2B3056]',
  emerald: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
  slate: 'bg-slate-100 text-slate-600',
};

const VALUE_TEXT = {
  blue: 'text-[#2B3056]',
  emerald: 'text-emerald-600',
  red: 'text-red-600',
  amber: 'text-amber-600',
  sky: 'text-sky-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  slate: 'text-slate-600',
};

// Kartu horizontal (ikon di kiri, label dan angka di kanan), sama dengan AI Document Checker.
const Stat = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#D5D9EC]">
    <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ICON_BOX[color]}`}>
      <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <h4 className="text-[10.8px] font-bold uppercase tracking-wider text-slate-500 leading-tight">{title}</h4>
      <p className={`text-[1.3rem] font-extrabold leading-tight ${VALUE_TEXT[color]}`}>{value}</p>
    </div>
  </div>
);

// Kartu "Gagal Diperiksa" hanya muncul bila ada blok yang gagal.
const StatsGrid = ({ summary }) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-3.5" aria-label="Klasifikasi temuan">
    <Stat title="Total Blok" value={summary.totalBlocks} icon={Layers} color="blue" />
    <Stat title="Sesuai" value={summary.sesuai} icon={CheckCircle2} color="emerald" />
    <Stat title="Pedoman/UU" value={summary.perluRevisi} icon={AlertTriangle} color="red" />
    <Stat title="Ejaan & Tanda Baca" value={summary.ejaanTandaBaca} icon={SpellCheck} color="amber" />
    <Stat title="Total Kesalahan" value={summary.totalErrors} icon={Bug} color="sky" />
    <Stat title="Tanda Baca" value={summary.errTandaBaca} icon={Quote} color="orange" />
    <Stat title="Kosa Kata" value={summary.errKosaKata} icon={BookOpenText} color="purple" />
    <Stat title="Kalimat Panjang" value={summary.longSentences} icon={AlignLeft} color="slate" />
    {summary.gagal > 0 && <Stat title="Gagal Diperiksa" value={summary.gagal} icon={ShieldAlert} color="red" />}
  </div>
);

export default StatsGrid;
