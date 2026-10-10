import React, { useMemo } from 'react';
import { File as FileIcon } from 'lucide-react';
import { buildHighlightSegments, groupByPage, HIGHLIGHT_CLASS, isIssueBlock } from '../../lib/aiReport';

const BLOCK_LEVEL_CLASS = {
  perlu_revisi: HIGHLIGHT_CLASS.pedoman,
  ejaan_tanda_baca: HIGHLIGHT_CLASS.ejaan,
  gagal_dianalisis: HIGHLIGHT_CLASS.gagal,
};

const MARK_BASE =
  'relative px-[0.35rem] py-[0.15rem] rounded-[3px] cursor-pointer font-semibold transition-all hover:ring-[3px] hover:ring-[#2B3056]/25 hover:-translate-y-px hover:brightness-95 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#2B3056]/40';

const Badge = ({ number }) => (
  <span className="inline-flex items-center justify-center w-[18px] h-[18px] ml-[3px] align-middle rounded-full bg-[#2B3056] text-white text-[10.4px] font-extrabold">
    {number}
  </span>
);

// Panel naskah (setara "Dokumen Pembaca" AI Document Checker): tiap halaman berupa kertas krem dengan
// penanda "HALAMAN n", teks rata kanan-kiri, dan bagian yang salah disorot berlatar warna + garis bawah
// + lencana angka. Semua teks dirender oleh React (otomatis di-escape), bukan sebagai HTML.
const DocumentReader = ({ blocks, filter, activeBlockId, onSelectBlock }) => {
  const pages = useMemo(() => groupByPage(blocks), [blocks]);

  const numbers = useMemo(() => {
    const map = new Map();
    let counter = 0;
    blocks.forEach((b) => {
      if (isIssueBlock(b) && (filter === 'all' || b.status === filter)) {
        counter += 1;
        map.set(b.block_id, counter);
      }
    });
    return map;
  }, [blocks, filter]);

  if (blocks.length === 0) {
    return <p className="p-6 text-center text-xs text-slate-500">Tidak ada isi dokumen.</p>;
  }

  const select = (blockId) => (event) => {
    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelectBlock(blockId);
  };

  const markProps = (blockId, id) => ({
    role: 'button',
    tabIndex: 0,
    onClick: select(blockId),
    onKeyDown: select(blockId),
    id,
  });

  return (
    <div className="text-[0.95rem] leading-[1.85] text-[#1e293b]">
      {pages.map(([pageNumber, pageBlocks]) => (
        <section
          key={pageNumber}
          aria-label={`Halaman ${pageNumber}`}
          className="bg-[#fafaf9] border border-[#e7e5e4] rounded-[10px] p-5 mb-5 last:mb-0"
        >
          <p className="flex items-center gap-1.5 text-[11.6px] font-bold uppercase tracking-wider text-slate-500 mb-3.5 pb-1.5 border-b border-dashed border-[#d6d3d1]">
            <FileIcon className="w-3 h-3" aria-hidden="true" /> Halaman {pageNumber}
          </p>
          {pageBlocks.map((b) => {
            const number = numbers.get(b.block_id);
            const active = activeBlockId === b.block_id;
            const ring = active ? 'ring-[3px] ring-[#2B3056]/30 -translate-y-px' : '';

            let content = b.original_text;
            if (number) {
              if ((b.span_errors || []).length > 0) {
                const segments = buildHighlightSegments(b.original_text, b.span_errors);
                let firstDone = false;
                content = segments.map((seg, i) => {
                  if (!seg.error) return <React.Fragment key={i}>{seg.text}</React.Fragment>;
                  const id = !firstDone ? `ai-hl-${b.block_id}` : undefined;
                  firstDone = true;
                  return (
                    <React.Fragment key={i}>
                      <mark
                        {...markProps(b.block_id, id)}
                        title={seg.error.explanation || `Kesalahan ${seg.error.error_type}`}
                        className={`${MARK_BASE} ${HIGHLIGHT_CLASS[seg.error.error_type] || HIGHLIGHT_CLASS.ejaan} ${ring}`}
                      >
                        {seg.text}
                      </mark>
                      <Badge number={number} />
                    </React.Fragment>
                  );
                });
              } else {
                content = (
                  <>
                    <mark
                      {...markProps(b.block_id, `ai-hl-${b.block_id}`)}
                      className={`${MARK_BASE} ${BLOCK_LEVEL_CLASS[b.status] || HIGHLIGHT_CLASS.pedoman} ${ring}`}
                    >
                      {b.original_text}
                    </mark>
                    <Badge number={number} />
                  </>
                );
              }
            }

            return (
              <p key={b.block_id} id={`ai-para-${b.block_id}`} className="mb-[1.15rem] last:mb-0 text-justify whitespace-pre-line break-words">
                {content}
              </p>
            );
          })}
        </section>
      ))}
    </div>
  );
};

export default DocumentReader;
