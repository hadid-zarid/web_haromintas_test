import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Check,
  Copy,
  Landmark,
  Scale,
  Loader2,
  Maximize2,
  Minimize2,
  PenLine,
  ScanSearch,
  Send,
  SpellCheck,
  Trash2,
  X,
} from 'lucide-react';
import MarkdownView from './MarkdownView';

const QUICK_PROMPTS = [
  { icon: ScanSearch, label: 'Analisis Dokumen', text: 'Tolong berikan analisis kepatuhan hukum dan sistematika menyeluruh untuk dokumen ini.' },
  { icon: SpellCheck, label: 'Cek EYD & KBBI', text: 'Tolong periksa apakah ada kesalahan ejaan, tanda baca, dan kosa kata tidak baku menurut EYD V & KBBI?' },
  { icon: Landmark, label: 'Uji UU 12/2011 & 13/2022', text: 'Bagaimana kesesuaian dokumen ini dengan kaidah perancangan UU No. 12 Tahun 2011 dan UU No. 13 Tahun 2022?' },
  { icon: PenLine, label: 'Formulasi Ulang Pasal', text: 'Formulasikan ulang pasal/kalimat ini agar lebih baku, lugas, dan tidak multitafsir.' },
];

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard tidak tersedia: abaikan */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Tersalin' : 'Salin Jawaban'}
    </button>
  );
};

// Panel chat asisten AI (slide dari kanan di layar lebar, lembar bawah di layar sempit).
// Jawaban berformat markdown dirender aman; Esc menutup panel.
const ChatDrawer = ({ open, onClose, hasReport, messages, sending, onSend, onClear, focusBlock, onClearFocus }) => {
  const [input, setInput] = useState('');
  const [wide, setWide] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  if (!open) return null;

  const submit = (text) => {
    const value = (text ?? input).trim();
    if (!value || sending) return;
    onSend(value);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-center sm:justify-end">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-chat-title"
        className={`relative w-full ${wide ? 'sm:w-[44rem]' : 'sm:w-[28rem]'} h-[88vh] sm:h-full bg-white rounded-t-2xl sm:rounded-none sm:rounded-l-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-[width] duration-200`}
      >
        <header className="px-4 py-3 flex items-center justify-between gap-2 bg-[#2B3056]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-[#FFD82B]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 id="ai-chat-title" className="text-xs font-bold text-white truncate">Asisten Konsultasi Dokumen &amp; Hukum</h3>
              <p className="text-[10px] text-slate-300">Seputar hasil pemeriksaan naskah ini</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button type="button" onClick={() => setWide((w) => !w)} title="Perlebar / perkecil panel" aria-label="Perlebar atau perkecil panel chat" className="hidden sm:flex p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer">
              {wide ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button type="button" onClick={onClear} title="Bersihkan riwayat chat" aria-label="Bersihkan riwayat chat" className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
            <button type="button" onClick={onClose} aria-label="Tutup panel chat" className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50" aria-live="polite">
          {focusBlock && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-900">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold">Fokus: {focusBlock.block_id} (Halaman {focusBlock.page_number || 1})</p>
                <button type="button" onClick={onClearFocus} aria-label="Lepas fokus blok" className="p-0.5 rounded hover:bg-amber-100 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="mt-1 italic line-clamp-3 break-words">&ldquo;{focusBlock.original_text}&rdquo;</p>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="rounded-xl border border-[#D5D9EC] bg-white p-4 shadow-sm">
              <p className="flex items-center gap-2 text-xs font-bold text-[#2B3056]">
                <Scale className="w-4 h-4 text-[#C99A00]" aria-hidden="true" />
                Selamat datang di Asisten Legal Drafter &amp; Kebahasaan
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Saya siap membantu meninjau naskah, memformulasikan pasal hukum, menguji kepatuhan UU 12/2011 &amp; UU 13/2022,
                serta menyempurnakan kaidah PUEBI/EYD &amp; KBBI.
              </p>
              {!hasReport && (
                <p className="mt-2 text-[11px] leading-relaxed text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2">
                  Periksa dokumen terlebih dahulu di tab Pemeriksaan agar saya dapat membaca naskah dan temuannya.
                </p>
              )}
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'user' ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#2B3056] text-white px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap break-words">
                    {m.content}
                  </div>
                ) : (
                  <div className={`max-w-[95%] rounded-2xl rounded-bl-sm border px-3.5 py-3 ${m.failed ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                    <MarkdownView text={m.content} />
                    {!m.failed && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400">
                          Legal Drafter AI{m.seconds ? ` • ${m.seconds.toFixed(1)}s` : ''}
                        </span>
                        <CopyButton text={m.content} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-2 text-[11px] text-slate-500">
                <Loader2 className="w-3.5 h-3.5 text-[#2B3056] animate-spin" /> Sedang menyusun analisis...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-slate-100 bg-white">
          <div className="flex gap-2 overflow-x-auto px-3 pt-3 pb-1" role="group" aria-label="Pertanyaan cepat">
            {QUICK_PROMPTS.map(({ icon: Icon, label, text }) => (
              <button
                key={label}
                type="button"
                onClick={() => submit(text)}
                disabled={sending}
                className="inline-flex items-center gap-1.5 shrink-0 min-h-[36px] px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-600 cursor-pointer disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-[#2B3056]" aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
          <div className="p-3 flex items-end gap-2">
            <label htmlFor="ai-chat-input" className="sr-only">Pertanyaan untuk asisten AI</label>
            <textarea
              id="ai-chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={2}
              placeholder="Tulis pertanyaan Anda... (Shift+Enter untuk baris baru)"
              className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B3056]/20 focus:border-[#2B3056]"
            />
            <button
              type="button"
              onClick={() => submit()}
              disabled={!input.trim() || sending}
              aria-label="Kirim pertanyaan"
              className="w-11 h-11 shrink-0 rounded-xl bg-[#2B3056] hover:bg-[#232849] text-[#FFD82B] flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDrawer;
