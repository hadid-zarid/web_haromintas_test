import React from 'react';
import { CheckCheck, CircleAlert, CircleCheck, CircleHelp, List, Palette, SpellCheck, TriangleAlert, X } from 'lucide-react';
import { FILTERS, SWATCH_CLASS } from '../../lib/aiReport';

const LEGEND = [
  { type: 'pedoman', label: 'Pedoman/UU' },
  { type: 'ejaan', label: 'Ejaan' },
  { type: 'tanda_baca', label: 'Tanda Baca' },
  { type: 'kosa_kata', label: 'Kosa Kata' },
];

const FILTER_ICON = {
  all: List,
  perlu_revisi: TriangleAlert,
  ejaan_tanda_baca: SpellCheck,
  sesuai: CircleCheck,
  tidak_ditemukan_rujukan: CircleHelp,
  gagal_dianalisis: CircleAlert,
};

// Toolbar hasil (setara AI Document Checker): kotak legenda "Penanda" di kiri, tombol terima/tolak semua
// usulan di kanan, lalu baris pil filter berikon. Pil "Gagal" hanya muncul bila ada blok yang gagal.
const FilterBar = ({ counts, active, onChange, onAcceptAll, onRejectAll }) => (
  <div className="space-y-3">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-[10px] border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <span className="inline-flex items-center gap-1.5 text-[12.4px] font-bold text-[#2B3056]">
          <Palette className="w-3.5 h-3.5" aria-hidden="true" /> Penanda:
        </span>
        {LEGEND.map(({ type, label }) => (
          <span key={type} className="inline-flex items-center gap-1.5 text-[12.8px] font-semibold text-slate-500">
            <span className={`w-3 h-3 rounded-[3px] shrink-0 ${SWATCH_CLASS[type]}`} aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-1.5">
        <button
          type="button"
          onClick={onAcceptAll}
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] sm:min-h-[38px] px-3.5 rounded-xl bg-white border border-slate-300 hover:bg-green-50 text-[13px] font-semibold text-slate-800 cursor-pointer transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5 text-green-600" aria-hidden="true" /> Terima Semua Usulan
        </button>
        <button
          type="button"
          onClick={onRejectAll}
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] sm:min-h-[38px] px-3.5 rounded-xl bg-white border border-slate-300 hover:bg-red-50 text-[13px] font-semibold text-slate-800 cursor-pointer transition-colors"
        >
          <X className="w-3.5 h-3.5 text-red-600" aria-hidden="true" /> Tolak Semua Usulan
        </button>
      </div>
    </div>

    <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filter hasil">
      {FILTERS.filter((f) => f.key !== 'gagal_dianalisis' || (counts.gagal_dianalisis ?? 0) > 0 || active === f.key).map((f) => {
        const selected = active === f.key;
        const Icon = FILTER_ICON[f.key];
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            aria-pressed={selected}
            className={`inline-flex items-center gap-1.5 shrink-0 min-h-[44px] sm:min-h-[38px] px-[0.9rem] rounded-[20px] border text-[13.2px] font-semibold cursor-pointer transition-colors ${
              selected
                ? 'bg-[#2B3056] border-[#2B3056] text-white shadow-md shadow-[#2B3056]/25'
                : 'bg-white border-slate-200 text-slate-500 hover:border-[#2B3056] hover:text-[#2B3056] hover:bg-[#F3F4FA]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" /> {f.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default FilterBar;
