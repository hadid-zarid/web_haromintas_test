import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleAlert,
  CircleCheck,
  CircleDot,
  CircleHelp,
  Lightbulb,
  MessageSquareText,
  SpellCheck,
  TriangleAlert,
  X,
} from 'lucide-react';
import {
  ERROR_TYPE_LABELS,
  ERROR_TYPE_TAG,
  SEVERITY_LABELS,
  SEVERITY_TAG,
  STATUS_META,
  groupErrorsByType,
  hasSuggestion,
} from '../../lib/aiReport';

const STATUS_ICON = {
  sesuai: CircleCheck,
  perlu_revisi: TriangleAlert,
  ejaan_tanda_baca: SpellCheck,
  tidak_ditemukan_rujukan: CircleHelp,
  gagal_dianalisis: CircleAlert,
};

const Tag = ({ className, children }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold ${className}`}>{children}</span>
);

// Kartu umpan balik satu blok (setara kartu di "Umpan Balik & Interaksi Revisi" AI Document Checker):
// bergaris hijau di kiri bila revisi diterima, abu-abu bila ditolak; berisi id blok, status, teks asli,
// detail masalah, daftar kesalahan, rujukan pedoman, saran perbaikan, dan tombol terima/tolak/tanya AI.
// Semua teks dari server dirender oleh React (otomatis di-escape).
const BlockCard = ({ block, accepted, active, onSelect, onToggleAccept, onAskAi }) => {
  const meta = STATUS_META[block.status] || STATUS_META.sesuai;
  const StatusIcon = STATUS_ICON[block.status] || CircleCheck;
  const groups = groupErrorsByType(block.span_errors);
  const errorCount = (block.span_errors || []).length;
  const rule = block.rule_reference;
  const suggestible = hasSuggestion(block);

  const side = accepted ? 'border-l-4 border-l-green-600 bg-[#fafdfb]' : `border-l-4 border-l-slate-400 ${suggestible ? 'opacity-75' : ''}`;

  return (
    <article
      id={`ai-card-${block.block_id}`}
      onClick={() => onSelect(block.block_id)}
      className={`relative rounded-[10px] border p-[1.15rem] shadow-sm hover:shadow-md cursor-pointer transition-all bg-white ${side} ${
        active ? 'border-[#2B3056] ring-[3px] ring-[#2B3056]/20' : 'border-slate-200 hover:border-[#D5D9EC]'
      }`}
    >
      <header className="flex items-center justify-between gap-2 mb-3">
        <span className="px-[0.45rem] py-[0.15rem] rounded-md bg-slate-100 border border-slate-200 text-[12.4px] font-mono font-semibold text-slate-500">
          {block.block_id}
        </span>
        <div className="flex items-center gap-1.5 min-w-0">
          {errorCount > 0 && (
            <span className="inline-flex items-center gap-1 px-[0.45rem] py-[0.15rem] rounded-xl bg-[#FFF8DB] border border-[#F2DE8C] text-[11.2px] font-bold text-[#8A6A00] whitespace-nowrap">
              <CircleDot className="w-3 h-3" aria-hidden="true" /> {errorCount} kesalahan
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 px-[0.65rem] py-1 rounded-2xl border text-[11.6px] font-bold uppercase tracking-[0.03em] ${meta.badge}`}
          >
            <StatusIcon className="w-3 h-3" aria-hidden="true" /> {meta.label}
          </span>
        </div>
      </header>

      <div className="mb-3 max-h-40 overflow-y-auto rounded-md bg-slate-50 border border-slate-200 p-3 text-[0.85rem] leading-[1.55] text-slate-700 whitespace-pre-wrap break-words">
        {block.original_text}
      </div>

      {block.issue && (
        <p className="mb-3 flex items-start gap-1.5 rounded-md bg-red-50 border-l-4 border-red-600 px-3 py-2.5 text-[0.825rem] text-red-800 break-words">
          <CircleAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            <strong>Detail Masalah:</strong> {block.issue}
          </span>
        </p>
      )}

      {groups.length > 0 && (
        <div className="mb-3 space-y-2.5">
          {groups.map(([type, errors]) => (
            <div key={type} className="space-y-1.5">
              <p className="text-[10.8px] font-bold uppercase tracking-wider text-slate-400">
                {ERROR_TYPE_LABELS[type] || type} ({errors.length})
              </p>
              {errors.map((e, i) => (
                <div key={i} className="rounded-md border border-slate-200 bg-white px-3 py-2 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Tag className={ERROR_TYPE_TAG[e.error_type] || ERROR_TYPE_TAG.ejaan}>{ERROR_TYPE_LABELS[e.error_type] || e.error_type}</Tag>
                    <Tag className={SEVERITY_TAG[e.severity] || SEVERITY_TAG.medium}>{SEVERITY_LABELS[e.severity] || 'Sedang'}</Tag>
                  </div>
                  <p className="flex flex-wrap items-center gap-1.5 text-[0.85rem] break-words">
                    <s className="text-red-600">&ldquo;{e.original_snippet}&rdquo;</s>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <strong className="text-green-700">&ldquo;{e.suggested_snippet}&rdquo;</strong>
                  </p>
                  {e.explanation && <p className="text-[0.8rem] text-slate-500 break-words">{e.explanation}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {rule && (
        <p className="mb-3 flex items-center gap-1.5 rounded-md bg-[#EEF0F8] border border-[#D5D9EC] px-3 py-2.5 text-[0.8rem] font-medium text-[#2B3056] break-words">
          <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>
            <strong>Rujukan Pedoman:</strong> {rule.document} (Halaman {rule.page}
            {rule.section ? ` | ${rule.section}` : ''})
          </span>
        </p>
      )}

      {block.suggested_revision && (
        <p className="mb-3 flex items-start gap-1.5 rounded-md bg-green-50 border-l-4 border-green-600 px-3.5 py-3 text-[0.85rem] leading-normal text-green-800 break-words whitespace-pre-line">
          <Lightbulb className="w-3.5 h-3.5 mt-1 shrink-0" aria-hidden="true" />
          <span>
            <strong>Saran Perbaikan Usulan:</strong> {block.suggested_revision}
          </span>
        </p>
      )}

      {(suggestible || block.status === 'gagal_dianalisis') && (
        <footer className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-dashed border-slate-200">
          {suggestible ? (
            <div className="inline-flex gap-1.5" role="group" aria-label="Keputusan revisi">
              <button
                type="button"
                aria-pressed={accepted}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAccept(block.block_id, true);
                }}
                className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                  accepted ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-slate-300 text-slate-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" /> Terima Revisi
              </button>
              <button
                type="button"
                aria-pressed={!accepted}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAccept(block.block_id, false);
                }}
                className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                  !accepted ? 'bg-slate-600 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-600 hover:bg-red-50 hover:border-red-500 hover:text-red-700'
                }`}
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" /> Tolak
              </button>
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAskAi(block);
            }}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg bg-[#EEF0F8] border border-[#D5D9EC] hover:bg-[#E4E7F4] text-xs font-bold text-[#2B3056] cursor-pointer transition-colors"
          >
            <MessageSquareText className="w-3.5 h-3.5" aria-hidden="true" /> Tanya AI
          </button>
        </footer>
      )}
    </article>
  );
};

export default BlockCard;
