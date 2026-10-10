import React from 'react';

// Indikator status layanan AI (sama dengan indikator di halaman AI Document Checker).
const AiStatusPill = ({ state, status }) => {
  let tone = 'bg-slate-100 text-slate-600 border-slate-200';
  let dot = 'bg-slate-400 animate-pulse';
  let label = 'Menghubungkan...';

  if (state === 'error') {
    tone = 'bg-red-50 text-red-700 border-red-200';
    dot = 'bg-red-500';
    label = 'Server AI tidak terhubung';
  } else if (state === 'ok' && status && !status.openrouter_configured) {
    tone = 'bg-amber-50 text-amber-800 border-amber-200';
    dot = 'bg-amber-500';
    label = 'API Key belum diisi';
  } else if (state === 'ok' && status) {
    tone = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dot = 'bg-emerald-500';
    label = `AI Siap | ${status.indexed_chunks ?? 0} Chunk`;
  }

  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold ${tone}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
};

export default AiStatusPill;
