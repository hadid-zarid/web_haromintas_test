import React, { useMemo } from 'react';
import { parseMarkdown } from '../../lib/markdown';

// Merender jawaban asisten (markdown) menjadi elemen React tanpa dangerouslySetInnerHTML,
// sehingga teks dari model tidak pernah dieksekusi sebagai HTML.
const Inlines = ({ tokens }) =>
  tokens.map((t, i) => {
    if (t.type === 'strong') return <strong key={i} className="font-bold text-[#2B3056]">{t.value}</strong>;
    if (t.type === 'em') return <em key={i}>{t.value}</em>;
    if (t.type === 'code') {
      return (
        <code key={i} className="px-1 py-0.5 rounded bg-slate-100 text-[0.92em] font-mono text-slate-800 break-words">
          {t.value}
        </code>
      );
    }
    return <React.Fragment key={i}>{t.value}</React.Fragment>;
  });

const HEADING_CLASS = {
  1: 'text-sm font-extrabold text-[#2B3056] mt-3 mb-1.5',
  2: 'text-[13px] font-extrabold text-[#2B3056] mt-3 mb-1.5 pb-1 border-b border-slate-200',
  3: 'text-xs font-bold text-[#2B3056] mt-2.5 mb-1',
};

const MarkdownView = ({ text }) => {
  const blocks = useMemo(() => parseMarkdown(text), [text]);

  return (
    <div className="text-xs leading-relaxed text-slate-700 break-words space-y-2">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'heading':
            return (
              <h4 key={i} className={HEADING_CLASS[Math.min(b.level, 3)]}>
                <Inlines tokens={b.inlines} />
              </h4>
            );
          case 'list': {
            const Tag = b.ordered ? 'ol' : 'ul';
            return (
              <Tag key={i} className={`pl-5 space-y-1 ${b.ordered ? 'list-decimal' : 'list-disc'}`}>
                {b.items.map((item, j) => (
                  <li key={j}>
                    <Inlines tokens={item} />
                  </li>
                ))}
              </Tag>
            );
          }
          case 'quote':
            return (
              <blockquote key={i} className="border-l-4 border-[#FFD82B] bg-amber-50/60 pl-3 pr-2 py-1.5 rounded-r-lg whitespace-pre-line">
                <Inlines tokens={b.inlines} />
              </blockquote>
            );
          case 'table':
            return (
              <div key={i} className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-[11px]">
                  <thead className="bg-slate-50">
                    <tr>
                      {b.header.map((cell, j) => (
                        <th key={j} className="px-2.5 py-1.5 text-left font-bold text-[#2B3056] border-b border-slate-200">
                          <Inlines tokens={cell} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="odd:bg-white even:bg-slate-50/50">
                        {row.map((cell, j) => (
                          <td key={j} className="px-2.5 py-1.5 align-top border-b border-slate-100">
                            <Inlines tokens={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'hr':
            return <hr key={i} className="border-slate-200" />;
          case 'code':
            return (
              <pre key={i} className="p-2.5 rounded-lg bg-slate-900 text-slate-100 text-[11px] overflow-x-auto font-mono">
                {b.text}
              </pre>
            );
          default:
            return (
              <p key={i} className="whitespace-pre-line">
                <Inlines tokens={b.inlines} />
              </p>
            );
        }
      })}
    </div>
  );
};

export default MarkdownView;
