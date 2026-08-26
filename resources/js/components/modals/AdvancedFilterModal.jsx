import React, { useState } from 'react';
import Modal from '../common/Modal';
import { KABUPATEN_LIST, JENIS_PERATURAN, STATUS_PERATURAN } from '../../mock/mockPeraturan';
import { Filter, RotateCcw, Check, X } from 'lucide-react';

export const AdvancedFilterModal = ({ isOpen, onClose, filters, onApplyFilters, onResetFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      kabupaten: '',
      status: '',
      jenis: '',
      proja: '',
      startDate: '',
      endDate: ''
    };
    setLocalFilters(emptyFilters);
    onResetFilters();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Lanjutan Peraturan"
      size="md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#2B3056] mb-1">Kabupaten / Kota</label>
            <select
              value={localFilters.kabupaten || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, kabupaten: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#2B3056] outline-none focus:ring-2 focus:ring-[#FFD82B] transition-all"
            >
              <option value="">-- Semua Kabupaten / Kota --</option>
              {KABUPATEN_LIST.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B3056] mb-1">Status Progres</label>
            <select
              value={localFilters.status || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#2B3056] outline-none focus:ring-2 focus:ring-[#FFD82B] transition-all"
            >
              <option value="">-- Semua Status --</option>
              {Object.values(STATUS_PERATURAN).map((s) => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B3056] mb-1">Jenis Peraturan</label>
            <select
              value={localFilters.jenis || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, jenis: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#2B3056] outline-none focus:ring-2 focus:ring-[#FFD82B] transition-all"
            >
              <option value="">-- Semua Jenis --</option>
              {JENIS_PERATURAN.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B3056] mb-1">Tim Proja</label>
            <select
              value={localFilters.proja || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, proja: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#2B3056] outline-none focus:ring-2 focus:ring-[#FFD82B] transition-all"
            >
              <option value="">-- Semua Tim Proja --</option>
              <option value="Proja 1">Proja 1</option>
              <option value="Proja 2">Proja 2</option>
              <option value="Proja 3">Proja 3</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#2B3056] mb-1">Rentang Tanggal Pembaruan</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={localFilters.startDate || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#2B3056] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD82B] transition-all"
            />
            <input
              type="date"
              value={localFilters.endDate || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#2B3056] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD82B] transition-all"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-xs font-bold text-white bg-[#2B3056] hover:bg-[#3A4070] rounded-xl flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#FFD82B]" />
              <span>Terapkan Filter</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdvancedFilterModal;
