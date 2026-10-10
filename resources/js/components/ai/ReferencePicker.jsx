import React, { useState } from 'react';
import { BookMarked, ChevronDown } from 'lucide-react';

// Panel "Dokumen Referensi yang Dipakai" (setara AI Document Checker): header yang bisa dilipat dengan
// lencana jumlah pilihan, dan isi berupa chip centang. Kosong = seluruh pedoman dipakai.
const ReferencePicker = ({ guidelines, selected, onChange, loading, error }) => {
  const [open, setOpen] = useState(false);

  const toggle = (name) => {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    onChange(next);
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ai-ref-body"
        className="w-full flex items-center justify-between gap-3 min-h-[48px] px-4 sm:px-[1.1rem] py-3 cursor-pointer text-left rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B3056]/30"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-slate-800 min-w-0">
          <BookMarked className="w-4 h-4 shrink-0 text-[#2B3056]" aria-hidden="true" />
          <span className="truncate">Dokumen Referensi yang Dipakai</span>
          <span className="px-2.5 py-0.5 rounded-xl bg-[#FFF8DB] border border-[#F2DE8C] text-[11.6px] font-bold text-[#8A6A00] shrink-0">
            {selected.size === 0 ? 'Semua' : `${selected.size} dipilih`}
          </span>
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div id="ai-ref-body" className="px-4 sm:px-[1.1rem] pb-4">
          <p className="text-[12.5px] text-slate-500 mb-2.5">
            Pilih pedoman yang jadi acuan pemeriksaan untuk dokumen ini. Kosongkan semua centang untuk memakai seluruh pedoman.
          </p>
          {loading && <p className="text-xs text-slate-400">Memuat daftar pedoman...</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
          {!loading && !error && guidelines.length === 0 && <p className="text-xs text-slate-500">Belum ada dokumen pedoman.</p>}
          <div className="flex flex-wrap gap-2">
            {guidelines.map((g) => (
              <label
                key={g.name}
                className="inline-flex items-center gap-2 min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[12.8px] cursor-pointer hover:border-[#2B3056]/40 max-w-full"
              >
                <input
                  type="checkbox"
                  checked={selected.has(g.name)}
                  onChange={() => toggle(g.name)}
                  className="w-4 h-4 accent-[#2B3056] shrink-0"
                />
                <span className="break-words min-w-0">{g.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ReferencePicker;
