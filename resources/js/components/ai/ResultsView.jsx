import React, { useEffect, useMemo, useState } from 'react';
import { Bot, FileText, MessagesSquare, ClipboardCheck, TriangleAlert } from 'lucide-react';
import ScoreBanner from './ScoreBanner';
import StatsGrid from './StatsGrid';
import FilterBar from './FilterBar';
import DocumentReader from './DocumentReader';
import BlockCard from './BlockCard';
import ExportMenu from './ExportMenu';
import { defaultAcceptedIds, summarizeReport } from '../../lib/aiReport';

// Hasil pemeriksaan dengan urutan yang sama seperti AI Document Checker:
//   banner skor -> kartu statistik -> {middle: panel referensi + dropzone} -> toolbar dan filter ->
//   tampilan dua panel (naskah bersorot di kiri, umpan balik terima/tolak di kanan 490px).
// `middle` disisipkan agar dropzone tetap berada di antara statistik dan hasil. Beri `key` berbeda
// untuk tiap laporan supaya keputusan terima/tolak dan filter ter-reset.
const ResultsView = ({ report, middle, commentsAvailable, onOpenChat, onAskAi }) => {
  const summary = useMemo(() => summarizeReport(report), [report]);
  const blocks = report.blocks || [];

  const [filter, setFilter] = useState('all');
  const [accepted, setAccepted] = useState(() => defaultAcceptedIds(report));
  const [activeId, setActiveId] = useState(null);
  const [pane, setPane] = useState('reader'); // hanya berlaku di layar sempit
  const [scrollTo, setScrollTo] = useState(null);

  const counts = useMemo(() => {
    const c = { all: blocks.length };
    blocks.forEach((b) => {
      c[b.status] = (c[b.status] || 0) + 1;
    });
    return c;
  }, [blocks]);

  const visible = useMemo(() => (filter === 'all' ? blocks : blocks.filter((b) => b.status === filter)), [blocks, filter]);

  // Sinkronkan kedua panel: memilih sorotan menggulir kartu, memilih kartu menggulir sorotan.
  useEffect(() => {
    if (!scrollTo) return;
    const el = document.getElementById(scrollTo.id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: scrollTo.block });
    setScrollTo(null);
  }, [scrollTo, pane]);

  const selectFromReader = (blockId) => {
    setActiveId(blockId);
    setPane('feedback');
    setScrollTo({ id: `ai-card-${blockId}`, block: 'nearest' });
  };
  const selectFromCard = (blockId) => {
    setActiveId(blockId);
    setPane('reader');
    setScrollTo({ id: `ai-hl-${blockId}`, block: 'center' });
  };

  const toggleAccept = (blockId, accept) =>
    setAccepted((prev) => {
      const next = new Set(prev);
      if (accept) next.add(blockId);
      else next.delete(blockId);
      return next;
    });

  const acceptAll = () => setAccepted(new Set(blocks.filter((b) => b.suggested_revision).map((b) => b.block_id)));
  const rejectAll = () => setAccepted(new Set());

  const paneButton = (key, label, Icon) => (
    <button
      type="button"
      onClick={() => setPane(key)}
      aria-pressed={pane === key}
      className={`flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] text-xs font-bold cursor-pointer transition-colors ${
        pane === key ? 'bg-[#2B3056] text-white' : 'bg-white text-slate-600'
      }`}
    >
      <Icon className="w-4 h-4" aria-hidden="true" /> {label}
    </button>
  );

  return (
    <div className="space-y-5">
      <ScoreBanner
        summary={summary}
        actions={
          <>
            <ExportMenu report={report} acceptedIds={accepted} commentsAvailable={commentsAvailable} />
            <button
              type="button"
              onClick={() => onOpenChat()}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 hover:border-[#2B3056]/40 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4 text-[#2B3056]" aria-hidden="true" /> Tanya Asisten AI
            </button>
          </>
        }
      />

      <StatsGrid summary={summary} />

      {middle}

      {summary.gagal > 0 && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-900">
          <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong>{summary.gagal} dari {summary.totalBlocks} blok gagal diperiksa AI</strong> dan belum dinilai. Tinjau
            blok tersebut secara manual (filter <em>Gagal</em>), atau periksa ulang dokumennya.
          </p>
        </div>
      )}

      <FilterBar counts={counts} active={filter} onChange={setFilter} onAcceptAll={acceptAll} onRejectAll={rejectAll} />

      <div className="lg:hidden flex rounded-xl overflow-hidden border border-slate-200" role="group" aria-label="Pilih panel">
        {paneButton('reader', 'Naskah', FileText)}
        {paneButton('feedback', 'Umpan Balik', MessagesSquare)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_490px] gap-5 items-start">
        <section
          className={`${pane === 'reader' ? 'flex' : 'hidden'} lg:flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm`}
          aria-label="Dokumen pembaca"
        >
          <header className="px-[1.15rem] py-3 border-b border-slate-200 flex items-center justify-between gap-2 bg-slate-50">
            <h3 className="text-[0.9rem] font-bold text-[#2B3056] flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Dokumen Pembaca (Turnitin View)</span>
            </h3>
            <span
              className="px-2.5 py-0.5 rounded-xl bg-[#E4E7F4] border border-[#D5D9EC] text-[11.6px] font-bold text-[#2B3056] truncate max-w-[45%]"
              title={report.document_checked}
            >
              {report.document_checked}
            </span>
          </header>
          <div className="px-5 sm:px-7 py-6 max-h-[750px] overflow-y-auto">
            <DocumentReader blocks={blocks} filter={filter} activeBlockId={activeId} onSelectBlock={selectFromReader} />
          </div>
        </section>

        <section
          className={`${pane === 'feedback' ? 'flex' : 'hidden'} lg:flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm`}
          aria-label="Umpan balik"
        >
          <header className="px-[1.15rem] py-3 border-b border-slate-200 flex items-center justify-between gap-2 bg-slate-50">
            <h3 className="text-[0.9rem] font-bold text-[#2B3056] flex items-center gap-2 min-w-0">
              <ClipboardCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Umpan Balik &amp; Interaksi Revisi</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-xl bg-[#FFF8DB] border border-[#F2DE8C] text-[11.6px] font-bold text-[#8A6A00] shrink-0">
              {summary.issueBlocks} Blok Masalah | {summary.totalErrors} Kesalahan
            </span>
          </header>
          <div className="p-3 space-y-3 max-h-[750px] overflow-y-auto bg-slate-50/50">
            {visible.length === 0 ? (
              <p className="py-10 text-center text-xs text-slate-500">Tidak ada umpan balik untuk filter ini.</p>
            ) : (
              visible.map((b) => (
                <BlockCard
                  key={b.block_id}
                  block={b}
                  accepted={accepted.has(b.block_id)}
                  active={activeId === b.block_id}
                  onSelect={selectFromCard}
                  onToggleAccept={toggleAccept}
                  onAskAi={onAskAi}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResultsView;
