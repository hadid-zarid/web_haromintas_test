import React from 'react';

export const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'flat-badge-slate' },
  proses: { label: 'Sedang Diproses', color: 'flat-badge-amber' },
  harmonisasi: { label: 'Sedang Dianalisis', color: 'flat-badge-blue' },
  fasilitasi: { label: 'Fasilitasi Biro Hukum', color: 'flat-badge-purple' },
  selesai: { label: 'Selesai', color: 'flat-badge-emerald' }
};

export const StatusBadge = ({ status, className = '' }) => {
  const normalized = (status || 'draft').toLowerCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.draft;

  return (
    <span className={`flat-badge text-[11px] font-bold uppercase tracking-wider ${config.color} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1 opacity-80" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
