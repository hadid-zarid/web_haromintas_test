import React from 'react';

export const STATUS_CONFIG = {
  // Key ID 1-5
  1: { label: 'Draf Awal', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  2: { label: 'Proses Harmonisasi', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  3: { label: 'Proses Fasilitasi', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  4: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  5: { label: 'Perlu Perbaikan', color: 'bg-rose-100 text-rose-800 border-rose-200' },

  // String keys
  draft: { label: 'Draf Awal', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  harmonisasi: { label: 'Proses Harmonisasi', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  fasilitasi: { label: 'Proses Fasilitasi', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  selesai: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  revisi: { label: 'Perlu Perbaikan', color: 'bg-rose-100 text-rose-800 border-rose-200' },
};

export const StatusBadge = ({ status, statusId, className = '' }) => {
  let config = null;

  if (statusId && STATUS_CONFIG[statusId]) {
    config = STATUS_CONFIG[statusId];
  } else if (typeof status === 'object' && status !== null) {
    const id = status.status_id || status.id;
    config = STATUS_CONFIG[id] || { label: status.nama_status || 'Status', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  } else if (typeof status === 'number' && STATUS_CONFIG[status]) {
    config = STATUS_CONFIG[status];
  } else if (typeof status === 'string') {
    const s = status.toLowerCase();
    if (s.includes('selesai')) config = STATUS_CONFIG[4];
    else if (s.includes('fasilitasi')) config = STATUS_CONFIG[3];
    else if (s.includes('harmonisasi')) config = STATUS_CONFIG[2];
    else if (s.includes('revisi') || s.includes('perbaikan') || s.includes('tolak')) config = STATUS_CONFIG[5];
    else if (s.includes('draft') || s.includes('awal')) config = STATUS_CONFIG[1];
    else config = { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200' };
  } else {
    config = STATUS_CONFIG[1];
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider ${config.color} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
