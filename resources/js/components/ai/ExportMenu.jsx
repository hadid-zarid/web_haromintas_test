import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Code2, Download, FileText, Highlighter, Loader2, MessageSquareText, ScrollText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { downloadBlob, exportReport } from '../../lib/aiApi';

const MenuItem = ({ icon: Icon, iconClass, label, hint, loading, onClick }) => (
  <button
    type="button"
    role="menuitem"
    onClick={onClick}
    disabled={loading}
    className="w-full flex items-start gap-2.5 px-3.5 py-2.5 text-left hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:bg-slate-100"
  >
    {loading ? (
      <Loader2 className="w-4 h-4 mt-0.5 text-slate-400 animate-spin shrink-0" />
    ) : (
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconClass}`} aria-hidden="true" />
    )}
    <span className="min-w-0">
      <span className="block text-xs font-medium text-slate-700">{label}</span>
      {hint && <span className="block text-[10px] text-slate-400 mt-0.5">{hint}</span>}
    </span>
  </button>
);

// Menu ekspor hasil pemeriksaan. "Naskah Asli + Komentar" hanya muncul bila server menyimpan
// file asli (fitur diaktifkan) dan dokumennya .docx.
const ExportMenu = ({ report, acceptedIds, commentsAvailable }) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClick = (e) => rootRef.current && !rootRef.current.contains(e.target) && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const run = async (mode) => {
    setOpen(false);
    setBusy(mode);
    try {
      const { blob, filename, placed, unplaced } = await exportReport(report, mode, [...acceptedIds]);
      downloadBlob(blob, filename);
      if (mode === 'comments') {
        showToast(
          unplaced > 0
            ? `${placed} komentar ditempel, ${unplaced} catatan tidak bisa ditempatkan di teks.`
            : `${placed} komentar ditempel di dokumen asli.`,
          unplaced > 0 ? 'warning' : 'success'
        );
      }
    } catch (error) {
      showToast(`Gagal mengekspor: ${error.message}`, 'error');
    } finally {
      setBusy(null);
    }
  };

  const exportJson = () => {
    setOpen(false);
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'hasil-analisa-data.json');
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto px-4 rounded-xl bg-[#2B3056] hover:bg-[#232849] text-white text-sm font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD82B]"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-[#FFD82B]" aria-hidden="true" />}
        Export Dokumen
        <ChevronDown className="w-3 h-3" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden py-1"
        >
          <MenuItem icon={FileText} iconClass="text-blue-600" label="Naskah Bersih (Word .docx)" loading={busy === 'clean'} onClick={() => run('clean')} />
          <MenuItem icon={Highlighter} iconClass="text-orange-600" label="Mode Track Changes (Coret/Tambah)" loading={busy === 'track_changes'} onClick={() => run('track_changes')} />
          <MenuItem icon={ScrollText} iconClass="text-emerald-600" label="Laporan Audit Eksekutif (.docx)" loading={busy === 'audit_report'} onClick={() => run('audit_report')} />
          {commentsAvailable && (
            <MenuItem
              icon={MessageSquareText}
              iconClass="text-violet-600"
              label="Naskah Asli + Komentar (Word .docx)"
              hint="Format dokumen asli tetap; bagian yang salah diberi komentar"
              loading={busy === 'comments'}
              onClick={() => run('comments')}
            />
          )}
          <MenuItem icon={Code2} iconClass="text-slate-500" label="Data Mentah (JSON)" onClick={exportJson} />
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
